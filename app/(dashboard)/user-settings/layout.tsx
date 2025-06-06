import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import StoreSwitcher from '@/components/StoreSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/auth/LogoutButton';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { UserAccountNav } from '@/components/UserAccountNav';
import { LanguageChanger } from '@/components/LanguageChanger';
import initTranslations from '@/lib/i18n/i18n';
import { getStores } from '@/actions/getStores';


interface UserSettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}

async function UserSettingsLayout({
  children,
  params
}: UserSettingsLayoutProps) {
  const { locale } = await params;
  const { t } = await initTranslations({
    locale,
    namespaces: ['common']
  });
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login')
  };

  const stores = await getStores(session?.user.id as string);

  return (
    <div className='h-screen'>  
      <div className='flex flex-col sm:flex-row items-center justify-between w-full py-3 px-3 space-y-4'>
        <div className='flex flex-row space-x-5 items-center justify-between w-[330px]'>
          <UserAccountNav />
          <ThemeToggle />
          <LanguageChanger />
          <Link href="/">
            <Button variant="outline" size="icon" className="bg-slate-400 hover:bg-slate-200 p-1 cursor-pointer">
              <Home />
            </Button>
          </Link>
          <LogoutButton>
              <Button
                // variant="destructive"
                className="cursor-pointer hover:bg-red-400 bg-red-700 text-white"
              >
                {t('log_out')}
              </Button>
          </LogoutButton>
        </div>
        <div className=''>
          <StoreSwitcher items={stores} />
        </div>
      </div>
      <hr />
      <div className="flex items-center justify-center h-fit mt-20 p-5">
        {children}
      </div>
    </div>
  )
}

export default UserSettingsLayout;

