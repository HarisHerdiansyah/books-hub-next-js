import { FaUserAlt, FaEnvelope, FaKey } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/typography';
import {
  EditProfileForm,
  EditEmailForm,
  EditPasswordForm,
} from '@/components/settings';
import { db } from '@/lib/db';

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await db.users.findUnique({
    where: { username },
    select: {
      about: true,
      bio: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
      username: true,
    },
  });

  return (
    <Accordion type='single' collapsible className='w-full mt-6'>
      <AccordionItem value='item-1'>
        <AccordionTrigger className='bg-[#392467] text-white rounded-xl px-4 py-2 mb-6 hover:no-underline'>
          <div className='flex items-center space-x-3'>
            <FaUserAlt />
            <Text tag='h3'>Edit Profile</Text>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <EditProfileForm userProps={user} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-2'>
        <AccordionTrigger className='bg-[#392467] text-white rounded-xl px-4 py-2 mb-6 hover:no-underline'>
          <div className='flex items-center space-x-3'>
            <FaEnvelope />
            <Text tag='h3'>Edit Email</Text>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <EditEmailForm />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-3'>
        <AccordionTrigger className='bg-[#392467] text-white rounded-xl px-4 py-2 mb-6 hover:no-underline'>
          <div className='flex items-center space-x-3'>
            <FaKey />
            <Text tag='h3'>Edit Password</Text>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <EditPasswordForm />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
