'use client';

import React, { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { useNavigationTransition } from '@/context/NavigationTransitionContext';

export interface TransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onNavigateStart?: () => void;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(function TransitionLink(
  {
    href,
    children,
    className = '',
    onClick,
    onMouseEnter,
    onPointerDown,
    onNavigateStart,
    ...props
  },
  ref
) {
  const { navigateTo, prefetch, navigatingHref } = useNavigationTransition();
  const targetHref = typeof href === 'string' ? href : href.pathname || '/';
  const isThisTargetPending = navigatingHref === targetHref;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If user held modifier keys or non-left click, preserve native multi-tab behavior
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      onClick?.(e);
      return;
    }

    e.preventDefault();
    onClick?.(e);
    onNavigateStart?.();
    navigateTo(targetHref);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    prefetch(targetHref);
    onMouseEnter?.(e);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    prefetch(targetHref);
    onPointerDown?.(e);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onPointerDown={handlePointerDown}
      className={`transition-all active:scale-[0.97] active:brightness-125 cursor-pointer select-none ${className} ${
        isThisTargetPending ? 'opacity-75 pointer-events-none' : ''
      }`}
      {...props}
    >
      {children}
    </Link>
  );
});
