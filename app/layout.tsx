import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '지도로 읽는 전쟁사',
  description:
    '지도와 타임라인, 기록을 따라 세계 주요 전쟁의 원인과 영향을 이해하는 역사 탐험.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
