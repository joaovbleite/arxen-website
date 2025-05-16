import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual EmailJS public key
};

// Email service configuration
export const EMAIL_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your actual EmailJS service ID
  CONTACT_TEMPLATE_ID: 'YOUR_CONTACT_TEMPLATE_ID', // Replace with your contact form template ID
  ESTIMATE_TEMPLATE_ID: 'YOUR_ESTIMATE_TEMPLATE_ID', // Replace with your estimate form template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY' // Replace with your actual EmailJS public key
};

// Helper function to send emails
export const sendContactEmail = async (templateParams: any) => {
  try {
    const result = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.CONTACT_TEMPLATE_ID,
      templateParams,
      EMAIL_CONFIG.PUBLIC_KEY
    );
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Helper function to send estimate emails
export const sendEstimateEmail = async (templateParams: any) => {
  try {
    const result = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.ESTIMATE_TEMPLATE_ID,
      templateParams,
      EMAIL_CONFIG.PUBLIC_KEY
    );
    return result;
  } catch (error) {
    console.error('Error sending estimate email:', error);
    throw error;
  }
}; 