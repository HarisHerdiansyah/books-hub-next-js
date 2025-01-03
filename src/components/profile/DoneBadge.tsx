import { Badge } from '../ui/badge';

export default function DoneBadge({ isDone }: { isDone: boolean }) {
  return (
    <Badge
      variant={isDone ? 'green' : 'orange'}
      className='font-bold uppercase'
    >
      {isDone ? 'Finished' : 'Unfinished'}
    </Badge>
  );
}
