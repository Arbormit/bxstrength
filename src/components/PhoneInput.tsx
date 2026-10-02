import React, { useState } from 'react';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  placeholder: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', placeholder: '7911 123456 or 07911 123456' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', placeholder: '98765 43210' }
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = 'Mobile Phone Number',
  required = false,
  className = '',
  inputClassName = ''
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(() => {
    if (value && (value.startsWith('+91') || value.startsWith('91'))) {
      return COUNTRIES[1]; // India
    }
    return COUNTRIES[0]; // UK default
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative flex items-center">
        {/* Country Flag Selector Button */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 px-2 py-1 rounded text-xs font-mono font-bold text-white shadow-sm transition-colors cursor-pointer select-none"
            title="Select Country Code"
          >
            <span className="text-sm leading-none">{selectedCountry.flag}</span>
            <span className="text-[11px] text-zinc-200 font-bold">{selectedCountry.dialCode}</span>
            <span className="text-[9px] text-zinc-400 ml-0.5">▼</span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#18181b] border border-zinc-700 rounded-lg shadow-2xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-150">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-colors cursor-pointer text-left ${
                    selectedCountry.code === c.code ? 'bg-[#CCFF00]/15 text-[#CCFF00]' : 'text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <div className="flex flex-col">
                    <span>{c.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{c.dialCode}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Field */}
        <input
          type="tel"
          inputMode="tel"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={selectedCountry.placeholder}
          className={
            inputClassName ||
            "w-full bg-[#121214] border border-zinc-700 rounded-lg pl-[84px] pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
          }
        />
      </div>
    </div>
  );
};
