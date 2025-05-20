/**
 * Validation utility functions for form inputs
 */

/**
 * Country code type for phone and postal code validation
 */
export type CountryCode = string; // ISO 3166-1 alpha-2 codes (e.g., 'US', 'CA', 'GB')

/**
 * Service area zip code ranges for US (first 3 digits of zip code)
 */
export const serviceAreaZipPrefixes: Record<string, string[]> = {
  'US': ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349'], // Sample area codes for NY and GA areas
  'CA': ['A1', 'B2', 'C3'], // Sample prefixes for Canadian postal codes
  'GB': ['E1', 'SW', 'N1'] // Sample prefixes for UK postal codes
};

/**
 * Checks if a postal code is within the service area
 * @param postalCode - The postal code to check
 * @param countryCode - ISO country code (default: 'US')
 * @returns Object with warning message if outside service area
 */
export const checkServiceArea = (postalCode: string, countryCode: CountryCode = 'US'): { inServiceArea: boolean; warningMessage?: string } => {
  // Empty check
  if (!postalCode.trim()) {
    return { inServiceArea: true }; // No warning if empty
  }
  
  const prefixes = serviceAreaZipPrefixes[countryCode] || [];
  
  // For US zip codes
  if (countryCode === 'US') {
    // Get first 3 digits of zip code
    const prefix = postalCode.trim().substring(0, 3);
    const inServiceArea = prefixes.includes(prefix);
    
    if (!inServiceArea) {
      return { 
        inServiceArea: false, 
        warningMessage: "This location appears to be outside our primary service area. Depending on the project, we may still be able to help you."
      };
    }
  }
  // For other countries, implement similar prefix checks based on their postal code formats
  else if (countryCode === 'CA' || countryCode === 'GB') {
    // Extract the prefix based on country format
    const prefix = postalCode.trim().substring(0, 2);
    const inServiceArea = prefixes.includes(prefix);
    
    if (!inServiceArea) {
      return { 
        inServiceArea: false, 
        warningMessage: `This ${countryCode} location appears to be outside our primary service area. Depending on the project, we may still be able to help you.`
      };
    }
  }

  return { inServiceArea: true };
};

/**
 * Validates a postal code based on country format
 * @param postalCode - The postal code to validate
 * @param countryCode - ISO country code (default: 'US')
 * @returns Object containing validity and optional error message
 */
export const validateZipCode = (postalCode: string, countryCode: CountryCode = 'US'): { isValid: boolean; message?: string } => {
  // Remove any whitespace
  const trimmedCode = postalCode.trim();
  
  // Empty check
  if (!trimmedCode) {
    return { isValid: false, message: "Postal code is required" };
  }
  
  // Postal code patterns by country
  const postalCodePatterns: Record<CountryCode, {pattern: RegExp, example: string}> = {
    'US': { pattern: /^[0-9]{5}(?:-[0-9]{4})?$/, example: '12345 or 12345-6789' },
    'CA': { pattern: /^[A-Za-z][0-9][A-Za-z][ -]?[0-9][A-Za-z][0-9]$/, example: 'A1A 1A1' },
    'GB': { pattern: /^[A-Z]{1,2}[0-9][A-Z0-9]?[ ]?[0-9][A-Z]{2}$/i, example: 'SW1A 1AA' },
    'AU': { pattern: /^[0-9]{4}$/, example: '2000' },
    'DE': { pattern: /^[0-9]{5}$/, example: '10115' },
    'FR': { pattern: /^[0-9]{5}$/, example: '75001' },
    'IT': { pattern: /^[0-9]{5}$/, example: '00144' },
    'ES': { pattern: /^[0-9]{5}$/, example: '28001' },
    'NL': { pattern: /^[1-9][0-9]{3}[ ]?[A-Za-z]{2}$/, example: '1234 AB' },
    'IN': { pattern: /^[1-9][0-9]{5}$/, example: '110001' },
    'JP': { pattern: /^[0-9]{3}-[0-9]{4}$/, example: '123-4567' },
    'CN': { pattern: /^[0-9]{6}$/, example: '100000' },
    'BR': { pattern: /^[0-9]{5}-[0-9]{3}$/, example: '01310-100' },
    'RU': { pattern: /^[0-9]{6}$/, example: '101000' },
    'ZA': { pattern: /^[0-9]{4}$/, example: '0001' }
  };
  
  // Default pattern for countries not in the list
  const defaultPattern = { pattern: /^[0-9A-Za-z\s-]{3,10}$/, example: '3-10 alphanumeric characters' };
  
  // Get the pattern for the specified country or use default
  const { pattern, example } = postalCodePatterns[countryCode] || defaultPattern;
  
  if (!pattern.test(trimmedCode)) {
    return { 
      isValid: false, 
      message: `Please enter a valid ${countryCode} postal code (e.g., ${example})` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validates a phone number with international support
 * @param phoneNumber - The phone number to validate
 * @param countryCode - ISO country code (default: 'US')
 * @returns Object containing validity and optional error message
 */
export const validatePhoneNumber = (phoneNumber: string, countryCode: CountryCode = 'US'): { isValid: boolean; message?: string } => {
  // Remove any whitespace
  const trimmedPhone = phoneNumber.trim();
  
  // Empty check (phone can be optional in some forms)
  if (!trimmedPhone) {
    return { isValid: true }; // Empty is valid if field is optional
  }
  
  // Normalize phone number by removing all non-digit characters except leading +
  const normalizedPhone = trimmedPhone.replace(/^\+/, 'plus').replace(/\D/g, '').replace('plus', '+');
  
  // International phone validation with relaxed rules
  // Just checking if it's a reasonable phone number (has enough digits)
  if (normalizedPhone.startsWith('+')) {
    // International format with + should have at least 8 digits after the + and country code
    if (normalizedPhone.length >= 8) {
      return { isValid: true };
    } else {
      return { 
        isValid: false,
        message: "International phone number too short"
      };
    }
  } else {
    // Country-specific validation
    switch(countryCode) {
      case 'US':
        // US number should have 10 digits, or 11 if starting with 1
        if (normalizedPhone.length === 10 || (normalizedPhone.length === 11 && normalizedPhone.startsWith('1'))) {
          return { isValid: true };
        }
        break;
      // Add other country-specific validation rules as needed
      default:
        // Default: accept if it has a reasonable length for a phone number (7-15 digits)
        if (normalizedPhone.length >= 7 && normalizedPhone.length <= 15) {
          return { isValid: true };
        }
    }
  }
  
  return { 
    isValid: false,
    message: "Please enter a valid phone number"
  };
};

/**
 * Formats a phone number as the user types based on country format
 * @param input - The raw phone input
 * @param countryCode - ISO country code (default: 'US')
 * @returns The formatted phone number
 */
export const formatPhoneNumber = (input: string, countryCode: CountryCode = 'US'): string => {
  // If it's an international format starting with +, don't apply formatting
  if (input.startsWith('+')) {
    return input;
  }
  
  // Strip all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  
  // Apply country-specific formatting
  switch (countryCode) {
    case 'US':
      // US format: (123) 456-7890
      if (digitsOnly.length <= 3) {
        return digitsOnly;
      } else if (digitsOnly.length <= 6) {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
      } else {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
      }
    case 'GB':
      // UK format varies, this is a simple version for mobile: 07xxx xxxxxx
      if (digitsOnly.length <= 5) {
        return digitsOnly;
      } else if (digitsOnly.length <= 11) {
        return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
      }
      break;
    // Add other country-specific formatting as needed
    default:
      // For other countries, apply basic grouping
      if (digitsOnly.length <= 4) {
        return digitsOnly;
      } else if (digitsOnly.length <= 7) {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
      } else {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 13)}`;
      }
  }
  
  return input; // Return original if no formatting applied
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

/**
 * Returns a list of country options with names and codes
 * @returns Array of country objects with name and code
 */
export const getCountryOptions = () => {
  return [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'BR', name: 'Brazil' },
    { code: 'RU', name: 'Russia' },
    { code: 'ZA', name: 'South Africa' },
    // Add more countries as needed
  ];
}; 