import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm', weight: ['400', '500', '600', '700', '800'], display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', weight: ['500', '600', '700'], display: 'swap' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta', weight: ['400', '500', '600', '700', '800'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://schoolcity.schoolos.ng'),
  title: { default: 'SchoolCity · Find the perfect school for your child', template: '%s · Terma SchoolCity' },
  description: 'Discover, compare and enquire with verified Nigerian private schools on Terma SchoolCity.',
  openGraph: { type: 'website', siteName: 'Terma SchoolCity', title: 'Find the perfect school for your child' },
  themeColor: '#FDFAF5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dm.variable} ${cormorant.variable} ${plusJakarta.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
