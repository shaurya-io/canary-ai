'use client';

import { useTheme } from '@/lib/theme-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#09090B] tracking-tight mb-1">Settings</h1>
      <p className="text-[15px] text-[#6B7280] mb-8">
        Manage your preferences
      </p>

      <div className="bg-white border border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] hover:shadow-md transition-all">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#09090B]">Appearance</h2>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Customize how Canary looks on your device
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-wider text-[#F97316] font-semibold">Theme</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${
                  theme === 'light'
                    ? 'border-[#F97316] bg-[#FFF7ED]'
                    : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${
                  theme === 'light' ? 'bg-[#F97316] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#09090B]">Light</p>
                  <p className="text-[12px] text-[#6B7280]">
                    Bright and clean
                  </p>
                </div>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'border-[#F97316] bg-[#FFF7ED]'
                    : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${
                  theme === 'dark' ? 'bg-[#F97316] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#09090B]">Dark</p>
                  <p className="text-[12px] text-[#6B7280]">
                    Easy on the eyes
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
