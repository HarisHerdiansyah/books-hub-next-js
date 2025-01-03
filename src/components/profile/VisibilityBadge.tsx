import clsx from 'clsx';
import { Badge } from '../ui/badge';

export default function VisibilityBadge({
  visibility,
  screen,
}: {
  visibility: boolean;
  screen: 'mobile' | 'wide';
}) {
  return (
    <Badge
      variant={visibility ? 'blue' : 'gray'}
      className={clsx('font-bold uppercase', {
        'hidden sm:block': screen === 'wide',
        'sm:hidden': screen === 'mobile',
      })}
    >
      {visibility ? 'Public' : 'Private'}
    </Badge>
  );
}
