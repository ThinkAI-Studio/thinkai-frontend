'use client';

import AppHeader, { type AppNavKey } from '@/components/layout/AppHeader';

export type SidebarKey = AppNavKey;

interface MainSidebarProps {
  active: SidebarKey;
}

/**
 * Universal App Shell Header
 * Replaces the legacy 260px fixed left sidebar with the Floating Liquid Glass Capsule Header.
 */
export default function MainSidebar({ active }: MainSidebarProps) {
  return <AppHeader active={active} />;
}
