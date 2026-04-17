import { ui, defaultLang, type Lang } from './ui';

export function useTranslatedPath(lang: Lang) {
  return (path: string, targetLang?: Lang) => {
    const base = '/sprites-gallery';
    const destLang = targetLang || lang;
    if (!path.startsWith('/')) path = '/' + path;
    if (destLang === defaultLang) {
      return `${base}${path}`;
    }
    return `${base}/${destLang}${path}`;
  };
}

export function getLangFromUrl(url: URL): Lang {
  const pathname = url.pathname.replace('/sprites-gallery', '');
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (firstSegment && firstSegment in ui) {
    return firstSegment as Lang;
  }
  return defaultLang;
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = url.pathname.replace('/sprites-gallery', '');
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && parts[0] in ui) {
    parts.shift();
  }
  return parts.join('/') || undefined;
}
