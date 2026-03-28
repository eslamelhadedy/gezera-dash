import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';
import Button from '../components/Button';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">التقارير والتحليلات</h2>
          <p className="text-sm text-gray-600 mt-1">تقارير شاملة عن جميع أنشطة النادي</p>
        </div>
        <Button icon={Download} variant="secondary">
          تصدير جميع التقارير
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'تقرير العضويات', icon: FileText, color: 'blue' },
          { title: 'تقرير المدفوعات', icon: TrendingUp, color: 'green' },
          { title: 'تقرير الطلبات', icon: FileText, color: 'yellow' },
          { title: 'تقرير الإيرادات', icon: TrendingUp, color: 'purple' },
          { title: 'تقرير المستخدمين', icon: FileText, color: 'red' },
          { title: 'تقرير النشاط', icon: BarChart3, color: 'blue' },
        ].map((report, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <report.icon className="w-8 h-8 text-[#1e3a5f]" />
              <Button variant="outline" size="sm" icon={Download}>
                تصدير
              </Button>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
            <p className="text-sm text-gray-600 mt-2">تقرير شامل ومفصل</p>
          </div>
        ))}
      </div>
    </div>
  );
}
