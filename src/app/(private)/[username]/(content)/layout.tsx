import { Tabs } from '@/components/general';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Tabs />
      {children}
    </>
  );
}
