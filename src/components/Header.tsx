import { Bell, Search, User } from 'lucide-react';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث..."
                className="w-64 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-right"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div className="flex items-center gap-3 pr-4 border-r border-gray-300">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">أحمد محمد</p>
                <p className="text-xs text-gray-600">مدير النظام</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#0f1f3d] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
