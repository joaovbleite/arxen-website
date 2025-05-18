// Test script for EmailJS integration
import { init, send } from '@emailjs/browser';

// Initialize EmailJS
init('f6ICI0_vWkpGTL9DL');

// Define test data for contact form
const contactTestData = {
  from_name: 'Test User',
  from_email: 'test@example.com',
  phone: '123-456-7890',
  address: '123 Test St, Atlanta, GA',
  inquiry_type: 'project',
  service_type: 'Kitchen Remodeling',
  project_type: 'residential',
  message: 'This is a test message for the contact form.',
  how_heard: 'Search Engine',
  other_source: '',
  other_service: '',
  to_name: 'ARXEN Construction Team',
  to_email: 'sustenablet@gmail.com',
  form_source: 'Contact Form Test'
};

// Define test data for estimate form
const estimateTestData = {
  from_name: 'Test User',
  from_email: 'test@example.com',
  phone: '123-456-7890',
  company: 'Test Company',
  reference_number: 'TEST-123456-789',
  service_list: 'Kitchen Remodeling, Bathroom Renovation',
  project_type: 'residential',
  project_description: 'This is a test description for the estimate form.',
  urgency: 'standard',
  scope: 'medium',
  timeline: '2 weeks',
  promo_code: 'TESTCODE',
  preferred_contact: 'email',
  to_name: 'ARXEN Construction Team',
  to_email: 'sustenablet@gmail.com',
  form_source: 'Free Estimate Form Test'
};

// Service and template IDs
const SERVICE_ID = 'service_yjnczmi';
const CONTACT_TEMPLATE_ID = 'template_ta9fewp';
const ESTIMATE_TEMPLATE_ID = 'template_9vdi7mp';

// Function to test contact form
async function testContactForm() {
  console.log('Testing Contact Form...');
  try {
    const result = await send(
      SERVICE_ID,
      CONTACT_TEMPLATE_ID,
      contactTestData,
      'f6ICI0_vWkpGTL9DL'
    );
    console.log('Contact Form Test SUCCESS!', result.text);
    return true;
  } catch (error) {
    console.error('Contact Form Test FAILED!', error);
    return false;
  }
}

// Function to test estimate form
async function testEstimateForm() {
  console.log('Testing Estimate Form...');
  try {
    const result = await send(
      SERVICE_ID,
      ESTIMATE_TEMPLATE_ID,
      estimateTestData,
      'f6ICI0_vWkpGTL9DL'
    );
    console.log('Estimate Form Test SUCCESS!', result.text);
    return true;
  } catch (error) {
    console.error('Estimate Form Test FAILED!', error);
    return false;
  }
}

// Run tests
async function runTests() {
  let contactSuccess = await testContactForm();
  let estimateSuccess = await testEstimateForm();
  
  console.log('\n--- Test Results ---');
  console.log(`Contact Form: ${contactSuccess ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  console.log(`Estimate Form: ${estimateSuccess ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  
  if (contactSuccess && estimateSuccess) {
    console.log('\nAll tests passed! Your EmailJS integration is working correctly.');
    console.log('Check your email inbox for the test messages.');
  } else {
    console.log('\nSome tests failed. Please check the error messages above.');
  }
}

runTests(); 