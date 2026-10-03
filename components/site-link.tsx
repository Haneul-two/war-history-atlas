import type { ComponentProps } from 'react';
/** Native navigation avoids Vinext beta Link exceptions and supports hashes, history and new tabs. */
export default function SiteLink({
  prefetch: _prefetch,
  ...props
}: ComponentProps<'a'> & { prefetch?: boolean }) {
  return <a {...props} />;
}
