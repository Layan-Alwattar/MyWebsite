import type { NextConfig } from 'next';
import { SUPABASE_URL } from './lib/supabase/env';

// Same fallback as the app, so images work even without host env vars.
const supabaseHost = new URL(SUPABASE_URL).hostname;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow next/image to optimize files served from Supabase Storage.
    remotePatterns: [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }],
  },
};

export default nextConfig;
