import { MessageSquare, Send } from 'lucide-react';
import Badge from '../components/Badge';

export default function Support() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">الرسائل والدعم الفني</h2>
        <p className="text-sm text-gray-600 mt-1">إدارة الرسائل والاستفسارات من الأعضاء</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6">
          <MessageSquare className="w-8 h-8 text-blue-600 mb-3" />
          <p className="text-sm text-gray-600">رسائل جديدة</p>
          <p className="text-2xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md p-6">
          <Send className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-sm text-gray-600">تم الرد</p>
          <p className="text-2xl font-bold text-green-600">156</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-md p-6">
          <MessageSquare className="w-8 h-8 text-yellow-600 mb-3" />
          <p className="text-sm text-gray-600">قيد المعالجة</p>
          <p className="text-2xl font-bold text-yellow-600">12</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">الرسائل الأخيرة</h3>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <MessageSquare className="w-5 h-5 text-[#1e3a5f]" />
                <div>
                  <h4 className="font-semibold">استفسار من العضو #{index + 1}</h4>
                  <p className="text-sm text-gray-600">
                    لدي استفسار بخصوص تجديد العضوية...
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>
              <Badge variant={index % 2 === 0 ? 'warning' : 'success'}>
                {index % 2 === 0 ? 'جديد' : 'تم الرد'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
