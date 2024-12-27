import { FaSpinner } from "react-icons/fa";
import { Text } from "../typography";

export default function Spinner() {
  return (
    <div
      className='fixed inset-0 flex flex-col items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
    >
      <FaSpinner color='white' className='animate-spin mb-4' size={36} />
      <Text tag='h3' className='text-white'>
        Loading . . . .
      </Text>
    </div>
  );
}
