/**
 * Utility functions for UK Mobile Phone Number validation and formatting.
 * Enforces strict UK Mobile number format (+44 7xxx xxxxxx or 07xxx xxxxxx).
 */

export const isValidUkMobile = (phone: string | null | undefined): boolean => {
  if (!phone || !phone.trim()) return true; // Empty check handled by caller if required

  // Remove spaces, hyphens, brackets, dots, and leading '+'
  const cleaned = phone.trim().replace(/[\s\-\(\)\+\.]/g, '');

  // Valid UK Mobile Number formats after cleaning non-digit characters:
  // 1. 07xxxxxxxxx (11 digits starting with '07')
  // 2. 447xxxxxxxxx (12 digits starting with '447')
  // 3. 4407xxxxxxxxx (13 digits starting with '4407')
  // 4. 00447xxxxxxxxx (14 digits starting with '00447')
  // 5. 004407xxxxxxxxx (15 digits starting with '004407')
  const ukMobileRegex = /^(?:07\d{9}|447\d{9}|4407\d{9}|00447\d{9}|004407\d{9})$/;
  return ukMobileRegex.test(cleaned);
};

export const UK_PHONE_ERROR_MSG = 'Only UK mobile numbers are allowed (e.g. +44 7911 123456 or 07911 123456).';
