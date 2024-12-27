import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <div
      className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      style={{ marginTop: '20px', marginBottom: '20px' }}
    >
      {children}
    </div>
  );
}

export default Container;
