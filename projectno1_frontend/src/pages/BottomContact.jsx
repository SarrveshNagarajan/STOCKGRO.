import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Send, User, Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

const BottomContact = () => {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaValue) {
      setErrorMessage('Please complete the reCAPTCHA.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Send the formData directly, not wrapped in another object
      await emailjs.send(
        import.meta.env.VITE_SERVICE_ID, 
        import.meta.env.VITE_TEMPLATE_ID,
        formData,  // Changed from {formData} to formData
        import.meta.env.VITE_USER_ID
      );
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({ from_name: '', from_email: '', message: '' });
      setCaptchaValue(null);
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id='contact' className='bg-gradient-to-b from-black to-gray-900 w-full rounded-t-3xl py-16 px-4'>
      <div className='text-white max-w-[1240px] mx-auto'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Let's get in touch !</h2>

        <div className='grid my-2 md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold mb-2'>Contact Information</h3>
            <p className='flex items-center'><Mail className='mr-2' /> info@example.com</p>
            <p className='flex items-center'><Phone className='mr-2' /> +91 1234567890</p>
            <p className='flex items-center'><MapPin className='mr-2' /> Chennai, India</p>
          </div>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='relative'>
              <User className='absolute top-3 left-3 text-gray-400' />
              <input
                type='text'
                name='from_name'  
                placeholder='Your Name'
                value={formData.from_name}
                onChange={handleChange}
                required
                className='w-full p-2 pl-10 rounded bg-gray-800 text-white border border-gray-700 focus:border-[#00df9a] focus:outline-none'
              />
            </div>
            <div className='relative'>
              <Mail className='absolute top-3 left-3 text-gray-400' />
              <input
                type='email'
                name='from_email'  
                placeholder='Your Email'
                value={formData.from_email}
                onChange={handleChange}
                required
                className='w-full p-2 pl-10 rounded bg-gray-800 text-white border border-gray-700 focus:border-[#00df9a] focus:outline-none'
              />
            </div>
            <div className='relative'>
              <MessageSquare className='absolute top-3 left-3 text-gray-400' />
              <textarea
                name='message'
                placeholder='Your Message'
                value={formData.message}
                onChange={handleChange}
                required
                className='w-full p-2 pl-10 rounded bg-gray-800 text-white border border-gray-700 focus:border-[#00df9a] focus:outline-none'
                rows='4'
              />
            </div>
            <ReCAPTCHA
              sitekey='6Lf4DmgqAAAAAM0tv1nRd_8eeH_-JAp2HrQKJh6F'
              onChange={handleCaptchaChange}
              theme='dark'
            />
            <button 
              type='submit' 
              className='w-full bg-[#00df9a] text-black p-2 font-medium rounded flex items-center justify-center hover:bg-[#00c589] transition duration-300 ease-in-out'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <Send className='mr-2' />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
        {successMessage && <p className='text-green-500 mt-4 text-center'>{successMessage}</p>}
        {errorMessage && <p className='text-red-500 mt-4 text-center'>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default BottomContact;