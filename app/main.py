from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import yfinance as yf
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import joblib
from sklearn.metrics import r2_score
from sklearn.preprocessing import MinMaxScaler
import math
from pymongo import MongoClient
import gridfs
import io
import tempfile
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = MongoClient(os.getenv('MONGO_URI'))
db = client['auth']
fs = gridfs.GridFS(db)

class StockRequest(BaseModel):
    ticker: str
    days: int

def download_recent_data(ticker):
    ticker = ticker.upper()
    try:
        
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=7*365)).strftime('%Y-%m-%d')
        
        if ticker.endswith('.NS') or ticker.endswith('.BO'):
            full_ticker = ticker
        else:
            full_ticker = f"{ticker}.NS"  

        stock = yf.Ticker(full_ticker)
        data = stock.history(start=start_date, end=end_date)

        if data.empty and not full_ticker.endswith('.BO'):
            full_ticker = f"{ticker}.BO"
            stock = yf.Ticker(full_ticker)
            data = stock.history(start=start_date, end=end_date)

        if data.empty:
            raise ValueError(f"No data found for {ticker}.")

        return data, 'INR'
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def create_model(input_shape):
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(25),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_model(df):
    data = df[['Close']].values
    training_data_len = math.ceil(len(data) * 0.8)

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    sequence_length = 60
    x_train, y_train = [], []
    for i in range(sequence_length, training_data_len):
        x_train.append(scaled_data[i-sequence_length:i, 0])
        y_train.append(scaled_data[i, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    model = create_model((x_train.shape[1], 1))
    model.fit(x_train, y_train, batch_size=32, epochs=50, verbose=0)

    return model, scaler

def predict_stock(df, model, scaler, forecast_days):
    data = df[['Close']].values
    training_data_len = math.ceil(len(data) * 0.8)
    
    
    scaled_data = scaler.transform(data)
    sequence_length = 60
    test_data = scaled_data[training_data_len - sequence_length:, :]
    x_test = []
    y_test = data[training_data_len:, :]

    for i in range(sequence_length, len(test_data)):
        x_test.append(test_data[i-sequence_length:i, 0])

    x_test = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    
    predictions = model.predict(x_test)
    predictions = scaler.inverse_transform(predictions)

    
    last_sequence = scaled_data[-sequence_length:]
    future_predictions = []
    current_sequence = last_sequence.reshape((1, sequence_length, 1))

    for _ in range(forecast_days):
        next_pred = model.predict(current_sequence)[0]
        future_predictions.append(next_pred)
        current_sequence = np.roll(current_sequence, -1)
        current_sequence[0, -1, 0] = next_pred

    future_predictions = np.array(future_predictions).reshape(-1, 1)
    future_predictions = scaler.inverse_transform(future_predictions)

    last_date = df.index[-1]
    start_date = last_date + pd.Timedelta(days=1)

    while start_date.weekday() >= 5:
        start_date += pd.Timedelta(days=1)

    future_dates = []
    current_date = start_date
    while len(future_dates) < forecast_days:
        if current_date.weekday() < 5:
            future_dates.append(current_date)
        current_date += pd.Timedelta(days=1)

    
    r2 = r2_score(y_test, predictions)

    return future_dates, future_predictions, r2

def get_model(ticker):
    ticker = ticker.upper()
    try:
        file_id = fs.find_one({'filename': f'{ticker}_model.h5'})
        if file_id is None:
            return None
        file = fs.get(file_id._id)
        
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.h5') as temp_file:
            temp_file.write(file.read())
            temp_file_path = temp_file.name
        
        
        model = load_model(temp_file_path, compile=False)
        
        
        os.unlink(temp_file_path)
        
        return model
    except Exception as e:
        print(f"Error getting model: {str(e)}")
        return None
    
def save_model(ticker, model):
    ticker = ticker.upper()
    try:
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.h5') as temp_file:
            model.save(temp_file.name)  
            temp_file_path = temp_file.name
        
        
        with open(temp_file_path, 'rb') as file:
            fs.put(file, filename=f'{ticker}_model.h5')
        
        
        os.unlink(temp_file_path)
        
    except Exception as e:
        print(f"Error saving model: {str(e)}")

def get_scaler(ticker):
    ticker = ticker.upper()
    try:
        file_id = fs.find_one({'filename': f'{ticker}_scaler.joblib'})
        if file_id is None:
            return None
        file = fs.get(file_id._id)
        
        
        scaler = joblib.load(file)
        
        return scaler
    except Exception as e:
        print(f"Error getting scaler: {str(e)}")
        return None

def save_scaler(ticker, scaler):
    ticker = ticker.upper()
    try:
        buffer = io.BytesIO()
        joblib.dump(scaler, buffer)
        buffer.seek(0)
        fs.put(buffer, filename=f'{ticker}_scaler.joblib')
    except Exception as e:
        print(f"Error saving scaler: {str(e)}")

@app.post("/predict")
async def predict(request: StockRequest):
    try:
        ticker = request.ticker.upper()
        
        df, currency = download_recent_data(ticker)
        
        model = get_model(ticker)
        scaler = get_scaler(ticker)

        if model is None and scaler is None:
            print(f"Training new model for {ticker}")
            model, scaler = train_model(df)
            save_model(ticker, model)
            save_scaler(ticker, scaler)
        else:
            print(f"Using existing model for {ticker}")
        
        future_dates, predictions, r2_score = predict_stock(df, model, scaler, request.days)
        
        results = []
        for date, price in zip(future_dates, predictions):
            results.append({
                "date": date.strftime('%Y-%m-%d'),
                "day": date.strftime('%A'),
                "price": round(float(price[0]), 2)
            })
        
        return {
            "ticker": ticker,
            "currency": currency,
            "predictions": results,
            "accuracy": round(r2_score, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)