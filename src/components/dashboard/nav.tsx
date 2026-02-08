'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { LogOut, Plus, LayoutDashboard, Settings, FileText, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-[#09090B] tracking-tight">
              Census
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Link href="/dashboard">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'bg-[#F3F4F6] text-[#09090B]'
                    : 'text-[#6B7280] hover:text-[#09090B] hover:bg-[#F9FAFB]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
            <Link href="/interviews/new">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium bg-[#F97316] text-white hover:bg-[#EA580C] transition-all ml-2 shadow-sm">
                <Plus className="w-4 h-4" />
                New Interview
              </button>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Link href="/settings">
              <button
                className={`p-2 rounded-lg transition-all ${
                  isActive('/settings')
                    ? 'bg-[#F3F4F6] text-[#09090B]'
                    : 'text-[#6B7280] hover:text-[#09090B] hover:bg-[#F9FAFB]'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </Link>
            <div className="h-5 w-px bg-[#E5E7EB]" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] text-[#6B7280] hover:text-[#09090B] hover:bg-[#F9FAFB] transition-all"
            >
              <span className="hidden sm:block max-w-[140px] truncate">
                {user.email}
              </span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
