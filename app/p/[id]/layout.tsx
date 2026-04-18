import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '收到一份回憶...點擊開啟',
  description: '打開這份專屬於你的特別驚喜',
  openGraph: {
    title: '收到一份回憶...點擊開啟',
    description: '打開這份專屬於你的特別驚喜',
    images: ['https://nfc-memory-olive.vercel.app/image.png'],
  },
};

export default function MemoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
