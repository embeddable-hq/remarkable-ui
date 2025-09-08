import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Theme } from '../theme/theme.types';
import { useTheme } from '@embeddable.com/react';

// Dayjs locales dynamic imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const locales: Record<string, () => Promise<any>> = {
  af: () => import('dayjs/locale/af'),
  am: () => import('dayjs/locale/am'),
  ar: () => import('dayjs/locale/ar'),
  az: () => import('dayjs/locale/az'),
  be: () => import('dayjs/locale/be'),
  bg: () => import('dayjs/locale/bg'),
  bi: () => import('dayjs/locale/bi'),
  bm: () => import('dayjs/locale/bm'),
  bn: () => import('dayjs/locale/bn'),
  bo: () => import('dayjs/locale/bo'),
  br: () => import('dayjs/locale/br'),
  bs: () => import('dayjs/locale/bs'),
  ca: () => import('dayjs/locale/ca'),
  cs: () => import('dayjs/locale/cs'),
  cv: () => import('dayjs/locale/cv'),
  cy: () => import('dayjs/locale/cy'),
  da: () => import('dayjs/locale/da'),
  de: () => import('dayjs/locale/de'),
  dv: () => import('dayjs/locale/dv'),
  el: () => import('dayjs/locale/el'),
  en: () => import('dayjs/locale/en'),
  eo: () => import('dayjs/locale/eo'),
  es: () => import('dayjs/locale/es'),
  et: () => import('dayjs/locale/et'),
  eu: () => import('dayjs/locale/eu'),
  fa: () => import('dayjs/locale/fa'),
  fi: () => import('dayjs/locale/fi'),
  fo: () => import('dayjs/locale/fo'),
  fr: () => import('dayjs/locale/fr'),
  fy: () => import('dayjs/locale/fy'),
  ga: () => import('dayjs/locale/ga'),
  gd: () => import('dayjs/locale/gd'),
  gl: () => import('dayjs/locale/gl'),
  gu: () => import('dayjs/locale/gu'),
  he: () => import('dayjs/locale/he'),
  hi: () => import('dayjs/locale/hi'),
  hr: () => import('dayjs/locale/hr'),
  ht: () => import('dayjs/locale/ht'),
  hu: () => import('dayjs/locale/hu'),
  id: () => import('dayjs/locale/id'),
  is: () => import('dayjs/locale/is'),
  it: () => import('dayjs/locale/it'),
  ja: () => import('dayjs/locale/ja'),
  jv: () => import('dayjs/locale/jv'),
  ka: () => import('dayjs/locale/ka'),
  kk: () => import('dayjs/locale/kk'),
  km: () => import('dayjs/locale/km'),
  kn: () => import('dayjs/locale/kn'),
  ko: () => import('dayjs/locale/ko'),
  ku: () => import('dayjs/locale/ku'),
  ky: () => import('dayjs/locale/ky'),
  lb: () => import('dayjs/locale/lb'),
  lo: () => import('dayjs/locale/lo'),
  lt: () => import('dayjs/locale/lt'),
  lv: () => import('dayjs/locale/lv'),
  me: () => import('dayjs/locale/me'),
  mi: () => import('dayjs/locale/mi'),
  mk: () => import('dayjs/locale/mk'),
  ml: () => import('dayjs/locale/ml'),
  mn: () => import('dayjs/locale/mn'),
  mr: () => import('dayjs/locale/mr'),
  ms: () => import('dayjs/locale/ms'),
  mt: () => import('dayjs/locale/mt'),
  my: () => import('dayjs/locale/my'),
  nb: () => import('dayjs/locale/nb'),
  ne: () => import('dayjs/locale/ne'),
  nl: () => import('dayjs/locale/nl'),
  nn: () => import('dayjs/locale/nn'),
  pl: () => import('dayjs/locale/pl'),
  pt: () => import('dayjs/locale/pt'),
  ro: () => import('dayjs/locale/ro'),
  ru: () => import('dayjs/locale/ru'),
  rw: () => import('dayjs/locale/rw'),
  sd: () => import('dayjs/locale/sd'),
  se: () => import('dayjs/locale/se'),
  si: () => import('dayjs/locale/si'),
  sk: () => import('dayjs/locale/sk'),
  sl: () => import('dayjs/locale/sl'),
  sq: () => import('dayjs/locale/sq'),
  sr: () => import('dayjs/locale/sr'),
  ss: () => import('dayjs/locale/ss'),
  sv: () => import('dayjs/locale/sv'),
  sw: () => import('dayjs/locale/sw'),
  ta: () => import('dayjs/locale/ta'),
  te: () => import('dayjs/locale/te'),
  tet: () => import('dayjs/locale/tet'),
  tg: () => import('dayjs/locale/tg'),
  th: () => import('dayjs/locale/th'),
  tk: () => import('dayjs/locale/tk'),
  tlh: () => import('dayjs/locale/tlh'),
  tr: () => import('dayjs/locale/tr'),
  tzl: () => import('dayjs/locale/tzl'),
  tzm: () => import('dayjs/locale/tzm'),
  uk: () => import('dayjs/locale/uk'),
  ur: () => import('dayjs/locale/ur'),
  uz: () => import('dayjs/locale/uz'),
  vi: () => import('dayjs/locale/vi'),
  x_pseudo: () => import('dayjs/locale/x-pseudo'),
  yo: () => import('dayjs/locale/yo'),
  zh_cn: () => import('dayjs/locale/zh-cn'),
  zh_hk: () => import('dayjs/locale/zh-hk'),
  zh_tw: () => import('dayjs/locale/zh-tw'),
};
export async function loadDayjsLocale(locale: string): Promise<void> {
  const loader = locales[locale.toLowerCase()];
  if (!loader) return;
  try {
    await loader();
    dayjs.locale(locale);
  } catch {
    console.warn(`Locale "${locale}" not supported, falling back to "en".`);
    dayjs.locale('en');
  }
}

type UseLoadDayjsLocaleProps = {
  dayjsLocaleReady: boolean;
};

export const useLoadDayjsLocale = (): UseLoadDayjsLocaleProps => {
  const theme: Theme = useTheme() as Theme;
  const [dayjsLocaleReady, setDayjsLocaleReady] = useState(false);

  useEffect(() => {
    const loadLocale = async () => {
      setDayjsLocaleReady(false);
      await loadDayjsLocale(theme.formatter.locale);
      setDayjsLocaleReady(true);
    };

    loadLocale();
  }, [theme.formatter.locale]);

  return { dayjsLocaleReady };
};

export const localToUtcDate = (date: Date): Date => {
  // getTimezoneOffset() is “minutes to add to local → UTC”
  const offsetMs = date.getTimezoneOffset() * 60_000;
  // subtracting that offset “undoes” the browser’s shift
  return new Date(date.getTime() - offsetMs);
};
