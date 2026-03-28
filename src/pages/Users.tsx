import { useEffect, useState } from 'react';
import { UserPlus, CreditCard as Edit, Trash2, Shield, X } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { supabase } from '../lib/supabase';
import { AdminUser } from '../types/database';

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'admin' as const,
    password: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="danger">مدير أعلى</Badge>;
      case 'admin':
        return <Badge variant="success">مدير</Badge>;
      case 'finance':
        return <Badge variant="info">مالي</Badge>;
      case 'membership_manager':
        return <Badge variant="warning">مدير عضويات</Badge>;
      case 'content_manager':
        return <Badge variant="default">مدير محتوى</Badge>;
      case 'support':
        return <Badge variant="default">دعم فني</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="success">فعال</Badge>
    ) : (
      <Badge variant="danger">غير فعال</Badge>
    );
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const { error: dbError } = await supabase.from('admin_users').insert({
        auth_user_id: authData.user?.id,
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role,
        is_active: true,
      });

      if (dbError) throw dbError;

      setShowAddModal(false);
      setFormData({ full_name: '', email: '', role: 'admin', password: '' });
      loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('حدث خطأ أثناء إضافة المستخدم');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">إدارة المستخدمين والصلاحيات</h2>
          <p className="text-sm text-gray-600 mt-1">تحكم في صلاحيات ووصول المستخدمين للنظام</p>
        </div>
        <Button icon={UserPlus} variant="primary" onClick={() => setShowAddModal(true)}>
          إضافة مستخدم جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">إجمالي المستخدمين</p>
              <p className="text-3xl font-bold text-slate-800">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-xl shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">المستخدمين الفعالون</p>
              <p className="text-3xl font-bold text-emerald-600">
                {users.filter((u) => u.is_active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-lg border border-amber-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-xl shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">المدراء</p>
              <p className="text-3xl font-bold text-amber-600">
                {users.filter((u) => u.role === 'super_admin' || u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <tr>
                <th className="px-6 py-4 text-right font-bold">الاسم</th>
                <th className="px-6 py-4 text-right font-bold">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right font-bold">الدور</th>
                <th className="px-6 py-4 text-right font-bold">الحالة</th>
                <th className="px-6 py-4 text-right font-bold">آخر تسجيل دخول</th>
                <th className="px-6 py-4 text-right font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    لا يوجد مستخدمين
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.is_active)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString('ar-EG')
                        : 'لم يسجل دخول'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert('تعديل المستخدم')}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
                              alert('حذف المستخدم');
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">الأدوار والصلاحيات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
            <h4 className="font-bold text-red-700 mb-2">مدير أعلى (Super Admin)</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>- صلاحيات كاملة على النظام</li>
              <li>- إدارة المستخدمين والصلاحيات</li>
              <li>- الوصول لجميع الإعدادات</li>
            </ul>
          </div>
          <div className="p-4 border-2 border-emerald-200 rounded-lg bg-emerald-50">
            <h4 className="font-bold text-emerald-700 mb-2">مدير (Admin)</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>- إدارة العضويات والطلبات</li>
              <li>- إدارة المحتوى</li>
              <li>- عرض التقارير</li>
            </ul>
          </div>
          <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-bold text-blue-700 mb-2">مالي (Finance)</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>- إدارة المدفوعات</li>
              <li>- عرض التقارير المالية</li>
              <li>- إصدار الفواتير</li>
            </ul>
          </div>
          <div className="p-4 border-2 border-amber-200 rounded-lg bg-amber-50">
            <h4 className="font-bold text-amber-700 mb-2">مدير عضويات</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>- مراجعة طلبات العضوية</li>
              <li>- إدارة بيانات الأعضاء</li>
              <li>- تجديد العضويات</li>
            </ul>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">إضافة مستخدم جديد</h2>

            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="example@domain.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="أدخل كلمة مرور قوية"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدور الوظيفي
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="admin">مدير</option>
                  <option value="super_admin">مدير أعلى</option>
                  <option value="finance">مالي</option>
                  <option value="membership_manager">مدير عضويات</option>
                  <option value="content_manager">مدير محتوى</option>
                  <option value="support">دعم فني</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  إضافة المستخدم
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-xl transition-all"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
