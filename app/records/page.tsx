import { RecordsArchive } from '@/components/records-archive';
export const metadata = { title: '기록 자료실 | 지도로 읽는 전쟁사' };
export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  return (
    <RecordsArchive
      initialType={typeof q.type === 'string' ? q.type : 'all'}
      initialWar={typeof q.war === 'string' ? q.war : 'all'}
    />
  );
}
