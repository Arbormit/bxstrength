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

  // 1. UK Mobile regex (+44 / 07)
  const ukMobileRegex = /^(?:07\d{9}|447\d{9}|4407\d{9}|00447\d{9}|004407\d{9})$/;

  // 2. India Mobile regex (+91 / 091 / 10-digit starting 6-9)
  const indiaMobileRegex = /^(?:0?[6-9]\d{9}|91[6-9]\d{9}|0091[6-9]\d{9})$/;

  return ukMobileRegex.test(cleaned) || indiaMobileRegex.test(cleaned);
};

export const isValidUkMobile = (phone: string | null | undefined): boolean => {
  return isValidPhone(phone);
};

export const UK_PHONE_ERROR_MSG = 'Please enter a valid UK (+44) or India (+91) mobile phone number.';
export const PHONE_ERROR_MSG = 'Please enter a valid UK (+44) or India (+91) mobile phone number.';
