/**
 * Curated Google Fonts for the theme editor. Each pairs well with the
 * soft, feminine-but-professional direction and supports the needed script.
 */
export const HEADING_FONTS = ['Fraunces', 'Playfair Display', 'DM Serif Display', 'Cormorant Garamond', 'Lora', 'Quicksand', 'Comfortaa', 'Poppins'];
export const BODY_FONTS = ['Plus Jakarta Sans', 'DM Sans', 'Nunito', 'Manrope', 'Inter', 'Poppins', 'Quicksand'];
export const HEADING_FONTS_AR = ['El Messiri', 'Reem Kufi', 'Changa', 'Lalezar', 'Aref Ruqaa', 'Cairo'];
export const BODY_FONTS_AR = ['IBM Plex Sans Arabic', 'Tajawal', 'Cairo', 'Almarai', 'Noto Kufi Arabic', 'Readex Pro'];

/** Fonts that only ship a single weight on Google Fonts. */
const SINGLE_WEIGHT = new Set(['DM Serif Display', 'Lalezar']);
/** Fonts without a weight axis that need explicit weights. */
const STATIC_WEIGHTS: Record<string, string> = {
  'Aref Ruqaa': '400;700',
  Tajawal: '400;500;700',
  Almarai: '400;700',
  'IBM Plex Sans Arabic': '400;500;600;700',
  Poppins: '400;500;600;700',
  'El Messiri': '400;500;600;700',
};

/** Google Fonts CSS2 URL that loads the given families. */
export function googleFontsUrl(families: string[]) {
  const unique = Array.from(new Set(families.filter(Boolean)));
  const params = unique
    .map((f) => {
      const name = f.replace(/ /g, '+');
      if (SINGLE_WEIGHT.has(f)) return `family=${name}`;
      return `family=${name}:wght@${STATIC_WEIGHTS[f] ?? '400..700'}`;
    })
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
