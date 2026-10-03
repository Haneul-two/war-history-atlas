'use client';
import Link from '@/components/site-link';
import { usePathname } from 'next/navigation';
import { Compass } from 'lucide-react';
export function Header() {
  const path = usePathname();
  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 이동
      </a>
      <header className="site-header">
        <Link prefetch={false} href="/" className="brand">
          <Compass size={29} strokeWidth={1.4} />
          <span className="serif">지도로 읽는 전쟁사</span>
        </Link>
        <nav aria-label="주 메뉴">
          <Link
            prefetch={false}
            aria-current={path === '/' ? 'page' : undefined}
            href="/"
          >
            전쟁 지도
          </Link>
          <Link
            prefetch={false}
            aria-current={path.startsWith('/themes') ? 'page' : undefined}
            href="/themes"
          >
            주제 탐험
          </Link>
          <Link
            prefetch={false}
            aria-current={path === '/compare' ? 'page' : undefined}
            href="/compare"
          >
            전쟁 비교
          </Link>
          <Link prefetch={false} href="/#reading-list">
            나의 기록
          </Link>
          <Link
            href="/about"
            aria-current={path === '/about' ? 'page' : undefined}
          >
            자료 안내
          </Link>
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <span>
        지도로 읽는 전쟁사 <span className="footer-divider">/</span> 주요 전쟁
        60개 · 대표 사건 189개
      </span>
      <div className="footer-links">
        <a
          href="https://www.naturalearthdata.com/about/terms-of-use/"
          target="_blank"
          rel="noreferrer"
        >
          지도 데이터: Natural Earth{' '}
        </a>
        <a
          href="https://github.com/Haneul-two"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Haneul-two GitHub 프로필 (새 탭)"
          className="footer-github"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
