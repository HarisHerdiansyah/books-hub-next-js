import { FaStar, FaRegStar } from 'react-icons/fa';
import clsx from 'clsx';

export default function FavouriteBtn({
  isFav,
  action,
  screen,
}: {
  isFav: boolean;
  action: () => void;
  screen: 'mobile' | 'wide';
}) {
  return (
    <div
      className={clsx(
        'hover:bg-slate-100 p-1 rounded-lg transition-all duration-300',
        {
          'hidden sm:block': screen === 'wide',
          'sm:hidden': screen === 'mobile',
        }
      )}
      onClick={action}
    >
      {isFav ? (
        <FaStar size={22} color='#EBEB05' className='cursor-pointer' />
      ) : (
        <FaRegStar size={22} color='#EBEB05' className='cursor-pointer' />
      )}
    </div>
  );
}
