import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  emailjs.init('f6ICI0_vWkpGTL9DL'); // Public key
};

// Email service configuration
export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_yjnczmi', // Email service ID
  CONTACT_TEMPLATE_ID: 'template_ta9fewp', // Contact form template ID
  ESTIMATE_TEMPLATE_ID: 'template_9vdi7mp', // Estimate form template ID
  PUBLIC_KEY: 'f6ICI0_vWkpGTL9DL' // Public key
};

// Helper function to send emails
export const sendContactEmail = async (templateParams: any) => {
  try {
    // Ensure to_email parameter is used
    const completeParams = {
      ...templateParams,
      to_email: templateParams.to_email || 'Arxenconstruction@gmail.com' // Default to Arxenconstruction@gmail.com if not provided
    };
    
    const result = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.CONTACT_TEMPLATE_ID,
      completeParams,
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
    // Ensure to_email parameter is used
    const completeParams = {
      ...templateParams,
      to_email: templateParams.to_email || 'Arxenconstruction@gmail.com' // Default to Arxenconstruction@gmail.com if not provided
    };
    
    const result = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.ESTIMATE_TEMPLATE_ID,
      completeParams,
      EMAIL_CONFIG.PUBLIC_KEY
    );
    return result;
  } catch (error) {
    console.error('Error sending estimate email:', error);
    throw error;
  }
};