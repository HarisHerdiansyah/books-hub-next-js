import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FaFilter } from 'react-icons/fa';
import { Text } from '../typography';
import CheckboxFilter from './CheckboxFilter';

export default function FilterPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='white'>
          <FaFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end'>
        <div className='bg-white text-nwutral-800 rounded-lg overflow-hidden p-1'>
          <Text tag='h4'>Filter:</Text>
          <CheckboxFilter />
        </div>
      </PopoverContent>
    </Popover>
  );
}
