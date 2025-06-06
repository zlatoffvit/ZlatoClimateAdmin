export interface ExchangeRate {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: Date;
  time_next_update_unix: number;
  time_next_update_utc: Date;
  time_eol_unix: number;
  base_code: string;
  rates: {
    [key: string]: number;
  }
}

const URL = 'https://open.er-api.com/v6/latest/RUB';

const getExchangeRates = async (): Promise<ExchangeRate> => {
  const res = await fetch(URL); 
  if (!res.ok) {
    throw new Error('Failed to fetch exchange rates');
  }

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    return data;
  } else {
    throw new Error("Unexpected response format");
  }
}

export default getExchangeRates;
