import { notFound, redirect } from 'next/navigation';
import { getWar, eventHref } from '@/lib/history';
import WarExperience from '@/components/war-experience';
export default async function WarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const war = getWar(id);
  if (!war) notFound();
  const query = await searchParams;
  const eventId = typeof query.event === 'string' ? query.event : undefined;
  if (query.event && !war.events.some((e) => e.id === eventId))
    redirect(
      eventHref(
        war,
        war.events[0].id,
        query.mode === 'short' ? 'short' : 'full',
      ),
    );
  return (
    <WarExperience
      key={war.id}
      war={war}
      initialEvent={eventId}
      mode={query.mode === 'short' ? 'short' : 'full'}
    />
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const war = getWar(id);
  return {
    title: war
      ? `${war.title} | 지도로 읽는 전쟁사`
      : '이야기를 찾을 수 없습니다',
    description: war?.summary,
  };
}
