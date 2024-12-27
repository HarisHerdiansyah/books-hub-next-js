import { Navbar, Container } from '@/components/general';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Container>
        {children}
      </Container>
    </>
  );
}
