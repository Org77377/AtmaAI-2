
"use client";

import { useEffect, useState } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-col">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {currentYear} AatmAI. All rights reserved.
        </p>
        <p className="text-center text-xs text-muted-foreground md:text-left">
          Your interactions are anonymous. No personal data is stored.
        </p>
      </div>
    </footer>
  );
}
