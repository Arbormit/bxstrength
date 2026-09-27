/**
 * Utility functions for Mobile Phone Number validation (UK & India supported).
 */

export const isValidIndiaMobile = (phone: string | null | undefined): boolean => {
  if (!phone || !phone.trim()) return true;
  const cleaned = phone.trim().replace(/[\s\-\(\)\+\.]/g, '');
  const indiaMobileRegex = /^(?:0?[6-9]\d{9}|91[6-9]\d{9}|0091[6-9]\d{9})$/;
  return indiaMobileRegex.test(cleaned);
};

export const isValidPhone = (phone: string | null | undefined): boolean => {
  if (!phone || !phone.trim()) return true;
  const cleaned = phone.trim().replace(/[\s\-\(\)\+\.]/g, '');
  return /^\d{7,15}$/.test(cleaned);
};

export const isValidUkMobile = (phone: string | null | undefined): boolean => {
  return isValidPhone(phone);
};

export const UK_PHONE_ERROR_MSG = 'Please enter a valid mobile phone number (7 to 15 digits).';
export const PHONE_ERROR_MSG = 'Please enter a valid mobile phone number (7 to 15 digits).';
