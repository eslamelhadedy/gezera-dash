import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  title: string;
  subtitle?: string;
};

export default function Layout({ children, currentPath, onNavigate, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <div className="mr-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
