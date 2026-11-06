'use client';

import React, { createContext, useContext, useState, useEffect, useTransition, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationTransitionContextType {
  isNavigating: boolean;
  navigatingHref: string | null;
  navigateTo: (href: string, callback?: () => void) => void;
  prefetch: (href: string) => void;
}

const NavigationTransitionContext = createContext<NavigationTransitionContextType | undefined>(undefined);

export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

  // Clear navigating state when the pathname actually changes
  useEffect(() => {
    setNavigatingHref(null);
  }, [pathname]);

  const prefetch = useCallback(
    (href: string) => {
      try {
        router.prefetch(href);
      } catch (_) {}
    },
    [router]
  );

  const navigateTo = useCallback(
    (href: string, callback?: () => void) => {
      // If already on this path, just execute optional callback
      if (href === pathname) {
        callback?.();
        return;
      }

      // 1. Instant 0ms visual registration
      setNavigatingHref(href);
      callback?.();

      // 2. React 18 Concurrent startTransition to avoid blocking WebGL render loops
      startTransition(() => {
        router.push(href);
      });
    },
    [pathname, router]
  );

  const isNavigating = isPending || navigatingHref !== null;

  return (
    <NavigationTransitionContext.Provider value={{ isNavigating, navigatingHref, navigateTo, prefetch }}>
      {/* ── Ultra-Luxury Golden Top Navigation Progress Line (0ms feedback) ── */}
      {isNavigating && (
        <div className="fixed top-0 inset-x-0 z-[9999] pointer-events-none h-[3px] bg-black/60 overflow-hidden backdrop-blur-sm">
          <div className="h-full w-full bg-gradient-to-r from-amber-600 via-gold to-amber-300 shadow-[0_0_14px_rgba(212,175,55,1)] animate-nav-progress" />
        </div>
      )}
      {children}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);
  if (!context) {
    throw new Error('useNavigationTransition must be used within NavigationTransitionProvider');
  }
  return context;
}
