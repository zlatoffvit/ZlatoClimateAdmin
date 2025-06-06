import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EuroFormatter = new Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: 'EUR'
});

export const UsdFormatter = new Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: 'USD'
});

export const RubFormatter = new Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: 'RUB'
});

interface ExchangeRates {
  [currencyCode: string]: number;
}

export const priceInRUB = (id: string, price: string, exchangeRate: ExchangeRates) => {
  let priceInRUB;
  if (id === "9aeddf11-9044-4078-9149-6d8742b75a73") {
    priceInRUB = Number(price) / exchangeRate['EUR']
  } else {
    priceInRUB = Number(price) / exchangeRate['USD']
  }

  return priceInRUB;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "https://zlato-climate-store.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-type, Authorization",
  "Accept-Language": "en-US"
};

export enum UserRole {
  ADMIN="ADMIN",
  USER="USER"
}