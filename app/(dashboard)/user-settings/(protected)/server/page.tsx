import initTranslations from "@/lib/i18n/i18n";
import { auth } from "@/auth";
import Heading from "@/components/ui/Heading";


const ServerPage = async ({
  params: { locale }
}: {
  params: { locale: string}
}) => {
  const { t } = await initTranslations({
    locale,
    namespaces: ['common']
  })
  const session = await auth();

  return (
    <div className="flex flex-col">
      <Heading 
        title={t('server_component')}
        description={t('str_server_session')}
      />
      <h2 className="mt-4">{t('server_session')}:</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>

  )
}

export default ServerPage;
