import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MembershipRequests from './pages/MembershipRequests';
import Members from './pages/Members';
import Payments from './pages/Payments';
import Subscriptions from './pages/Subscriptions';
import Users from './pages/Users';
import Content from './pages/Content';
import Media from './pages/Media';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ActivityLogs from './pages/ActivityLogs';
import Support from './pages/Support';

type PageConfig = {
  title: string;
  subtitle?: string;
  component: React.ComponentType;
};

const pages: Record<string, PageConfig> = {
  '/': {
    title: 'لوحة التحكم الرئيسية',
    subtitle: 'نظرة عامة على جميع الأنشطة والإحصائيات',
    component: Dashboard,
  },
  '/requests': {
    title: 'طلبات العضوية',
    subtitle: 'مراجعة وإدارة طلبات العضوية الجديدة',
    component: MembershipRequests,
  },
  '/members': {
    title: 'إدارة الأعضاء',
    subtitle: 'عرض وتعديل بيانات الأعضاء',
    component: Members,
  },
  '/payments': {
    title: 'إدارة المدفوعات',
    subtitle: 'متابعة وإدارة جميع المدفوعات والفواتير',
    component: Payments,
  },
  '/subscriptions': {
    title: 'الاشتراكات',
    subtitle: 'متابعة اشتراكات الأعضاء وتجديداتها',
    component: Subscriptions,
  },
  '/users': {
    title: 'المستخدمين والصلاحيات',
    subtitle: 'إدارة مستخدمي النظام وصلاحياتهم',
    component: Users,
  },
  '/content': {
    title: 'إدارة المحتوى',
    subtitle: 'تحرير صفحات الموقع والأخبار',
    component: Content,
  },
  '/content/pages': {
    title: 'صفحات الموقع',
    subtitle: 'إدارة صفحات الموقع الرئيسية',
    component: Content,
  },
  '/content/news': {
    title: 'الأخبار',
    subtitle: 'إدارة الأخبار والمقالات',
    component: Content,
  },
  '/media': {
    title: 'مكتبة الوسائط',
    subtitle: 'إدارة الصور والفيديوهات',
    component: Media,
  },
  '/notifications': {
    title: 'الإشعارات',
    subtitle: 'إرسال وإدارة الإشعارات',
    component: Notifications,
  },
  '/reports': {
    title: 'التقارير والتحليلات',
    subtitle: 'تقارير شاملة عن جميع الأنشطة',
    component: Reports,
  },
  '/settings': {
    title: 'الإعدادات',
    subtitle: 'إعدادات النظام العامة',
    component: Settings,
  },
  '/activity': {
    title: 'سجل النشاط',
    subtitle: 'متابعة جميع العمليات والأنشطة',
    component: ActivityLogs,
  },
  '/support': {
    title: 'الرسائل والدعم',
    subtitle: 'إدارة استفسارات ورسائل الأعضاء',
    component: Support,
  },
};

function App() {
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = pages[currentPath] || pages['/'];
  const PageComponent = currentPage.component;

  return (
    <Layout
      currentPath={currentPath}
      onNavigate={handleNavigate}
      title={currentPage.title}
      subtitle={currentPage.subtitle}
    >
      <PageComponent />
    </Layout>
  );
}

export default App;
