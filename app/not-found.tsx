import Link from '@/components/site-link';
export default function NotFound() {
  return (
    <main className="page">
      <p className="eyebrow">404</p>
      <h1>이 이야기를 찾을 수 없습니다.</h1>
      <p className="muted">지도에서 다른 전쟁을 선택해 보세요.</p>
      <Link prefetch={false} className="btn primary" href="/">
        전쟁 지도로 돌아가기
      </Link>
    </main>
  );
}
