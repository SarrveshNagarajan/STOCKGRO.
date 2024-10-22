const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();

require('dotenv').config()
// app.use(cors());
app.use(bodyparser.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => console.log("Error connecting to MongoDB : ",err));


const authRoutes = require('./routes/auth');

app.use('/api',authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log('Server running on port ',PORT);
});