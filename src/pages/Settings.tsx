import { useState } from 'react';
import { Save, Building2, CreditCard, Mail, Bell } from 'lucide-react';
import Button from '../components/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'الإعدادات العامة', icon: Building2 },
    { id: 'payment', label: 'إعدادات الدفع', icon: CreditCard },
    { id: 'email', label: 'إعدادات البريد', icon: Mail },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#1e3a5f] text-[#1e3a5f] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">الإعدادات العامة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم النادي
                  </label>
                  <input
                    type="text"
                    defaultValue="نادي جزيرة الورد الرياضي"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    defaultValue="info@gezeerasportsclub.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    defaultValue="+20 123 456 7890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                  <textarea
                    rows={3}
                    defaultValue="القاهرة، مصر"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button icon={Save} variant="primary">
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">إعدادات الدفع</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm font-medium">تفعيل الدفع النقدي</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm font-medium">تفعيل التحويل البنكي</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm font-medium">تفعيل الدفع ببطاقة الائتمان</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm font-medium">تفعيل الدفع الإلكتروني</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رسوم التأخير (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نسبة الضريبة (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="14"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button icon={Save} variant="primary">
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">إعدادات البريد الإلكتروني</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خادم SMTP
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">منفذ SMTP</label>
                  <input
                    type="number"
                    defaultValue="587"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button icon={Save} variant="primary">
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">إعدادات الإشعارات</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات الطلبات الجديدة</h3>
                    <p className="text-sm text-gray-600">إرسال إشعار عند استلام طلب عضوية جديد</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">تذكير انتهاء العضوية</h3>
                    <p className="text-sm text-gray-600">إرسال تذكير قبل انتهاء العضوية بـ 30 يوم</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات المدفوعات</h3>
                    <p className="text-sm text-gray-600">إرسال إشعار عند استلام دفعة جديدة</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">التقارير الأسبوعية</h3>
                    <p className="text-sm text-gray-600">إرسال تقرير أسبوعي بالإحصائيات</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button icon={Save} variant="primary">
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
