// src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
