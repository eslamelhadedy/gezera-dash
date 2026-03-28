import { useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CreditCard,
  Calendar,
  Shield,
  FileText,
  Image,
  Bell,
  BarChart3,
  Settings,
  Activity,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  path: string;
  subItems?: { id: string; label: string; path: string }[];
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, path: '/' },
  { id: 'requests', label: 'طلبات العضوية', icon: UserPlus, path: '/requests' },
  { id: 'members', label: 'الأعضاء', icon: Users, path: '/members' },
  { id: 'payments', label: 'المدفوعات', icon: CreditCard, path: '/payments' },
  { id: 'subscriptions', label: 'الاشتراكات', icon: Calendar, path: '/subscriptions' },
  { id: 'users', label: 'المستخدمين والصلاحيات', icon: Shield, path: '/users' },
  {
    id: 'content',
    label: 'إدارة المحتوى',
    icon: FileText,
    path: '/content',
    subItems: [
      { id: 'pages', label: 'الصفحات', path: '/content/pages' },
      { id: 'news', label: 'الأخبار', path: '/content/news' },
    ],
  },
  { id: 'media', label: 'مكتبة الوسائط', icon: Image, path: '/media' },
  { id: 'notifications', label: 'الإشعارات', icon: Bell, path: '/notifications' },
  { id: 'reports', label: 'التقارير والتحليلات', icon: BarChart3, path: '/reports' },
  { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/settings' },
  { id: 'activity', label: 'سجل النشاط', icon: Activity, path: '/activity' },
  { id: 'support', label: 'الرسائل والدعم', icon: MessageSquare, path: '/support' },
];

type SidebarProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

export default function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-gradient-to-b from-[#1e3a5f] to-[#0f1f3d] text-white shadow-2xl overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#c9a961] to-[#d4af37] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[#1e3a5f] font-bold text-lg">GSC</span>
          </div>
        </div>
        <h1 className="text-center text-base font-bold text-white">نادي جزيرة الورد</h1>
        <p className="text-center text-xs text-white/70 mt-1">لوحة التحكم</p>
      </div>

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.subItems) {
                  toggleExpanded(item.id);
                } else {
                  onNavigate(item.path);
                }
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#c9a961] to-[#d4af37] text-[#1e3a5f] shadow-lg'
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.subItems && (
                expandedItems.includes(item.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              )}
            </button>

            {item.subItems && expandedItems.includes(item.id) && (
              <div className="mr-3 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onNavigate(subItem.path)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                      currentPath === subItem.path
                        ? 'bg-white/20 text-white'
                        : 'hover:bg-white/10 text-white/80'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
