import React from 'react';

// Typography components
function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
}

function TypographyH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
    >
      {children}
    </h2>
  );
}

function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
}

function TypographyH4({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={`scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h4>
  );
}

function TypographyP({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`leading-relaxed text-sm sm:text-base ${className}`}>
      {children}
    </p>
  );
}

function TypographySm({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`leading-relaxed text-sm ${className}`}>{children}</p>;
}

// Define the TEXT mapping
const TEXT: Record<
  string,
  React.FC<{ children: React.ReactNode; className?: string }>
> = {
  h1: TypographyH1,
  h2: TypographyH2,
  h3: TypographyH3,
  h4: TypographyH4,
  p: TypographyP,
  sm: TypographySm,
};

// Text Component
export default function Text({
  tag,
  children,
  className,
}: Readonly<{
  tag: string;
  children: React.ReactNode;
  className?: string;
}>) {
  const Component = TEXT[tag];
  if (!Component) {
    throw new Error(`Invalid tag: ${tag}`);
  }
  return <Component className={className}>{children}</Component>;
}
