import { Helmet } from 'react-helmet-async';
export function Seo({ title, description }: { title: string; description?: string }) {
  return (<Helmet><title>{`${title} — ЭлектроТорг`}</title>{description && <meta name="description" content={description} />}</Helmet>);
}
