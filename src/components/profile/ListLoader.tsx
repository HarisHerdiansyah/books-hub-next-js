import { Text } from '../typography';

export default function ListLoader() {
  return (
    <div className='flex items-center justify-center h-96'>
      <Text tag='h3'>Loading . . . .</Text>
      <Text tag='p'>This may take some times</Text>
    </div>
  );
}
