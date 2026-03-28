import { FileText, Plus, CreditCard as Edit, Eye } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Content() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">إدارة المحتوى</h2>
          <p className="text-sm text-gray-600 mt-1">إدارة صفحات الموقع والأخبار</p>
        </div>
        <Button icon={Plus} variant="primary">
          إضافة صفحة جديدة
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#1e3a5f] to-[#0f1f3d] text-white">
            <tr>
              <th className="px-6 py-4 text-right font-semibold">عنوان الصفحة</th>
              <th className="px-6 py-4 text-right font-semibold">النوع</th>
              <th className="px-6 py-4 text-right font-semibold">الحالة</th>
              <th className="px-6 py-4 text-right font-semibold">آخر تحديث</th>
              <th className="px-6 py-4 text-right font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              'الصفحة الرئيسية',
              'عن النادي',
              'الأنشطة',
              'الأخبار',
              'العضوية',
              'اتصل بنا',
            ].map((page, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{page}</td>
                <td className="px-6 py-4 text-sm text-gray-600">صفحة</td>
                <td className="px-6 py-4">
                  <Badge variant="success">منشور</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date().toLocaleDateString('ar-EG')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-green-50 rounded-lg">
                      <Edit className="w-5 h-5 text-green-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
