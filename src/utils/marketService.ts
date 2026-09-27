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
    country: 'GB',
    countryName: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flagEmoji: '🇬🇧'
  }
};

const STORAGE_KEY = 'bxstrength_market_country';

/**
 * Gets currently selected market country ('GB')
 */
export const getActiveMarketCountry = (): MarketCountry => {
  return 'GB'; // Strictly UK / GBP (£)
};

/**
 * Sets market country preference in localStorage
 */
export const setActiveMarketCountry = (country: MarketCountry): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, 'GB');
    window.dispatchEvent(new CustomEvent('bxstrength_market_changed', { detail: { country: 'GB' } }));
  }
};

/**
 * Detects market country signal - Defaults to UK market (GB / GBP £)
 */
export const detectMarketFromPhone = (_phone?: string): MarketCountry => {
  return 'GB';
};

/**
 * Returns MarketConfig for given country or active market (GBP £)
 */
export const getMarketConfig = (_country?: MarketCountry): MarketConfig => {
  return MARKETS.GB;
};

/**
 * Returns numeric price for a service item in GBP (£)
 */
export const getServicePrice = (service: ServiceItem, _country?: MarketCountry): { amount: number; symbol: string; currency: string } => {
  const amount = Number(service.priceGbp ?? service.price) || 50;
  return { amount, symbol: '£', currency: 'GBP' };
};

/**
 * Returns numeric price for a membership plan in GBP (£)
 */
export const getMembershipPrice = (plan: MembershipPlan, _country?: MarketCountry): { amount: number; symbol: string; currency: string } => {
  const amount = Number(plan.priceGbp ?? plan.price) || 79;
  return { amount, symbol: '£', currency: 'GBP' };
};

/**
 * Formats amount with GBP (£) currency symbol
 */
export const formatMarketPrice = (amount: number, _country?: MarketCountry): string => {
  return `£${amount.toLocaleString('en-GB')}`;
};

