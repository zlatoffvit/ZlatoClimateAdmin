import { cookies } from "next/headers";

export const getCurrentLocale = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru'; 

  return locale;
}