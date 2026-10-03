import { notFound, redirect } from 'next/navigation';
import { getTheme, parseStep } from '@/lib/themes';
import { ThemeExperience } from '@/components/theme-experience';
export default async function ThemePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const theme = getTheme(id);
  if (!theme) notFound();
  const q = await searchParams;
  const step = typeof q.step === 'string' ? q.step : undefined;
  const index = parseStep(step);
  if (
    q.step !== undefined &&
    (typeof q.step !== 'string' || q.step !== String(index + 1))
  )
    redirect('/themes/' + id + '?step=1');
  return <ThemeExperience theme={theme} index={index} />;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = getTheme(id);
  return {
    title: theme
      ? theme.title + ' | 지도로 읽는 전쟁사'
      : '주제를 찾을 수 없습니다',
    description: theme?.description,
  };
}
