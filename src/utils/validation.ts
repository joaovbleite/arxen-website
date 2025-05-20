/**
 * Validation utility functions for form inputs
 */

/**
 * Validates a US zip code
 * Supports both 5-digit (12345) and 9-digit formats (12345-6789)
 * @param zipCode - The zip code to validate
 * @returns Object containing validity and optional error message
 */
export const validateZipCode = (zipCode: string): { isValid: boolean; message?: string } => {
  // Remove any whitespace
  const trimmedZip = zipCode.trim();
  
  // Empty check
  if (!trimmedZip) {
    return { isValid: false, message: "Zip code is required" };
  }
  
  // Check pattern: either 5 digits or 5 digits + hyphen + 4 digits
  const zipRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
  
  if (!zipRegex.test(trimmedZip)) {
    return { 
      isValid: false, 
      message: "Please enter a valid US zip code (e.g., 12345 or 12345-6789)" 
    };
  }
  
  return { isValid: true };
};

/**
 * Validates a US phone number
 * Supports various formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
 * @param phoneNumber - The phone number to validate
 * @returns Object containing validity and optional error message
 */
export const validatePhoneNumber = (phoneNumber: string): { isValid: boolean; message?: string } => {
  // Remove any whitespace
  const trimmedPhone = phoneNumber.trim();
  
  // Empty check (phone can be optional in some forms)
  if (!trimmedPhone) {
    return { isValid: true }; // Empty is valid if field is optional
  }
  
  // Normalize phone number by removing all non-digit characters
  const digitsOnly = trimmedPhone.replace(/\D/g, '');
  
  // Check if we have a valid number of digits (10 for US, or 11 if starting with 1)
  if (digitsOnly.length === 10 || (digitsOnly.length === 11 && digitsOnly.startsWith('1'))) {
    return { isValid: true };
  }
  
  return { 
    isValid: false,
    message: "Please enter a valid US phone number (10 digits)"
  };
};

/**
 * Formats a phone number as the user types
 * Automatically adds formatting: (123) 456-7890
 * @param input - The raw phone input
 * @returns The formatted phone number
 */
export const formatPhoneNumber = (input: string): string => {
  // Strip all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  
  // Format based on length
  if (digitsOnly.length <= 3) {
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  } else {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  }
};

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns Object containing validity and optional error message
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return { isValid: false, message: "Email is required" };
  }
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  return { isValid: true };
}; 