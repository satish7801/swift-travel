"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Home, Settings, User, Map, ClipboardList, MapPinned } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <Home />, label: 'Search' },
    { href: '/multi-trip', icon: <MapPinned />, label: 'Multi-City Trip' },
    { href: '/trips', icon: <Briefcase />, label: 'My Trips' },
    { href: '/planner', icon: <Map />, label: 'Itinerary Planner' },
    { href: '/plans', icon: <ClipboardList />, label: 'My Plans' },
    { href: '/profile', icon: <User />, label: 'My Profile' },
    { href: '/settings', icon: <Settings />, label: 'Settings' },
  ];

  return (
    <SidebarMenu className="gap-3">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href} className="mx-2">
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            // In a real app, you'd navigate. For this demo, we prevent navigation for non-root paths.
            onClick={(e) => {
              const allowedPaths = ['/', '/trips', '/settings', '/profile', '/planner', '/plans', '/multi-trip'];
              if (!allowedPaths.includes(item.href)) {
                e.preventDefault();
              }
            }}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
