import { MarketCountry, MarketConfig, ServiceItem, MembershipPlan } from '../types';

export const MARKETS: Record<MarketCountry, MarketConfig> = {
  GB: {
    country: 'GB',
    countryName: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flagEmoji: '🇬🇧'
  },
  IN: {
    country: 'IN',
    countryName: 'India',
    currency: 'INR',
    symbol: '₹',
    flagEmoji: '🇮🇳'
  }
};

const STORAGE_KEY = 'bxstrength_market_country';

/**
 * Gets currently selected market country ('GB' or 'IN')
 */
export const getActiveMarketCountry = (): MarketCountry => {
  if (typeof window === 'undefined') return 'GB';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'IN' || saved === 'GB') {
    return saved;
  }
  return 'GB'; // Default UK
};

/**
 * Sets market country preference in localStorage
 */
export const setActiveMarketCountry = (country: MarketCountry): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, country);
    window.dispatchEvent(new CustomEvent('bxstrength_market_changed', { detail: { country } }));
  }
};

/**
 * Detects market country signal from phone number or country selection
 */
export const detectMarketFromPhone = (phone?: string): MarketCountry => {
  if (!phone) return getActiveMarketCountry();
  const cleaned = phone.trim().replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+91') || cleaned.startsWith('91')) {
    return 'IN';
  }
  if (cleaned.startsWith('+44') || cleaned.startsWith('44') || cleaned.startsWith('07')) {
    return 'GB';
  }
  return getActiveMarketCountry();
};

/**
 * Returns MarketConfig for given country or active market
 */
export const getMarketConfig = (country?: MarketCountry): MarketConfig => {
  const code = country || getActiveMarketCountry();
  return MARKETS[code] || MARKETS.GB;
};

/**
 * Returns numeric price for a service item based on selected market
 */
export const getServicePrice = (service: ServiceItem, country?: MarketCountry): { amount: number; symbol: string; currency: string } => {
  const config = getMarketConfig(country);
  if (config.country === 'IN') {
    const amount = service.priceInr ?? 3999;
    return { amount, symbol: '₹', currency: 'INR' };
  }
  const amount = service.priceGbp ?? (Number(service.price) || 50);
  return { amount, symbol: '£', currency: 'GBP' };
};

/**
 * Returns numeric price for a membership plan based on selected market
 */
export const getMembershipPrice = (plan: MembershipPlan, country?: MarketCountry): { amount: number; symbol: string; currency: string } => {
  const config = getMarketConfig(country);
  if (config.country === 'IN') {
    const amount = plan.priceInr ?? (plan.id === 'basic' ? 2999 : plan.id === 'standard' ? 5999 : 9999);
    return { amount, symbol: '₹', currency: 'INR' };
  }
  const amount = plan.priceGbp ?? plan.price ?? 79;
  return { amount, symbol: '£', currency: 'GBP' };
};

/**
 * Formats amount with active currency symbol
 */
export const formatMarketPrice = (amount: number, country?: MarketCountry): string => {
  const config = getMarketConfig(country);
  if (config.country === 'IN') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `£${amount.toLocaleString('en-GB')}`;
};
