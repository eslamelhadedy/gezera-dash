import { Bell, Send } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">إدارة الإشعارات</h2>
          <p className="text-sm text-gray-600 mt-1">إرسال وإدارة الإشعارات للأعضاء والمستخدمين</p>
        </div>
        <Button icon={Send} variant="primary">
          إرسال إشعار جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6">
          <Bell className="w-8 h-8 text-blue-600 mb-3" />
          <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">245</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md p-6">
          <Send className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-sm text-gray-600">تم الإرسال</p>
          <p className="text-2xl font-bold text-green-600">198</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-md p-6">
          <Bell className="w-8 h-8 text-yellow-600 mb-3" />
          <p className="text-sm text-gray-600">قيد الانتظار</p>
          <p className="text-2xl font-bold text-yellow-600">32</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-md p-6">
          <Bell className="w-8 h-8 text-red-600 mb-3" />
          <p className="text-sm text-gray-600">فشل الإرسال</p>
          <p className="text-2xl font-bold text-red-600">15</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">قوالب الرسائل</h3>
          <div className="space-y-3">
            {[
              'قبول طلب العضوية',
              'رفض طلب العضوية',
              'تأكيد الدفع',
              'تذكير انتهاء العضوية',
              'تجديد الاشتراك',
              'إعادة تعيين كلمة المرور',
            ].map((template, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#1e3a5f]" />
                  <span className="font-medium">{template}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">فعال</Badge>
                  <Button variant="outline" size="sm">
                    تعديل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
