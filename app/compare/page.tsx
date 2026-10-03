import ComparisonView from '@/components/comparison-view';
import { resolvePair } from '@/lib/comparison';
export const metadata = { title: '전쟁 비교 | 지도로 읽는 전쟁사' };
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const [left, right] = resolvePair(
    typeof q.left === 'string' ? q.left : undefined,
    typeof q.right === 'string' ? q.right : undefined,
  );
  return <ComparisonView left={left} right={right} />;
}
