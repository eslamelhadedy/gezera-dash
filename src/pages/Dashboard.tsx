import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  DollarSign,
  TrendingUp,
  UserX,
  Shield,
  Bell,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { DashboardStats, MembershipRequest, Payment } from '../types/database';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingRequests: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    expiredMemberships: 0,
    totalUsers: 0,
    unreadNotifications: 0,
  });
  const [recentRequests, setRecentRequests] = useState<MembershipRequest[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [membersRes, requestsRes, paymentsRes, usersRes, notificationsRes] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('membership_requests').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('admin_users').select('*'),
        supabase.from('notifications').select('*').eq('status', 'pending'),
      ]);

      const members = membersRes.data || [];
      const requests = requestsRes.data || [];
      const payments = paymentsRes.data || [];
      const users = usersRes.data || [];
      const notifications = notificationsRes.data || [];

      const activeMembers = members.filter((m) => m.status === 'active').length;
      const expiredMembers = members.filter((m) => m.status === 'expired').length;
      const pendingRequests = requests.filter((r) => r.status === 'pending').length;

      const totalRevenue = payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const currentMonth = new Date().getMonth();
      const monthlyRevenue = payments
        .filter(
          (p) =>
            p.status === 'completed' &&
            new Date(p.created_at).getMonth() === currentMonth
        )
        .reduce((sum, p) => sum + Number(p.amount), 0);

      setStats({
        totalMembers: members.length,
        activeMembers,
        pendingRequests,
        totalRevenue,
        monthlyRevenue,
        expiredMemberships: expiredMembers,
        totalUsers: users.length,
        unreadNotifications: notifications.length,
      });

      setRecentRequests(requests);
      setRecentPayments(payments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">قيد المراجعة</Badge>;
      case 'approved':
        return <Badge variant="success">مقبول</Badge>;
      case 'rejected':
        return <Badge variant="danger">مرفوض</Badge>;
      case 'under_review':
        return <Badge variant="info">تحت المراجعة</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">مكتمل</Badge>;
      case 'pending':
        return <Badge variant="warning">معلق</Badge>;
      case 'failed':
        return <Badge variant="danger">فشل</Badge>;
      case 'refunded':
        return <Badge variant="info">مسترد</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">لوحة التحكم الرئيسية</h1>
              <p className="text-white/70 text-lg">نظام إدارة شامل لنادي جزيرة الورد الرياضي</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
              <Calendar className="w-6 h-6" />
              <div className="text-right">
                <p className="text-sm text-white/70">التاريخ</p>
                <p className="font-semibold">{new Date().toLocaleDateString('ar-EG', { dateStyle: 'medium' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="إجمالي الأعضاء"
          value={stats.totalMembers}
          icon={Users}
          color="blue"
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatCard
          title="العضويات الفعالة"
          value={stats.activeMembers}
          icon={UserCheck}
          color="green"
          trend={{ value: '+8%', isPositive: true }}
        />
        <StatCard
          title="طلبات جديدة"
          value={stats.pendingRequests}
          icon={UserPlus}
          color="yellow"
        />
        <StatCard
          title="الإيرادات الشهرية"
          value={`${stats.monthlyRevenue.toLocaleString()} جنيه`}
          icon={DollarSign}
          color="gold"
          trend={{ value: '+15%', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="إجمالي الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} جنيه`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="العضويات المنتهية"
          value={stats.expiredMemberships}
          icon={UserX}
          color="red"
        />
        <StatCard title="المستخدمين" value={stats.totalUsers} icon={Shield} color="purple" />
        <StatCard
          title="الإشعارات الجديدة"
          value={stats.unreadNotifications}
          icon={Bell}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">أحدث طلبات العضوية</h2>
            </div>
            <Button variant="outline" size="sm">
              عرض الكل
            </Button>
          </div>
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-center text-gray-400 py-12">لا توجد طلبات جديدة</p>
            ) : (
              recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-l from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">{request.full_name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{request.email}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(request.status)}
                    <span className="text-xs text-gray-400 font-medium">#{request.request_number}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">أحدث المدفوعات</h2>
            </div>
            <Button variant="outline" size="sm">
              عرض الكل
            </Button>
          </div>
          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-center text-gray-400 py-12">لا توجد مدفوعات</p>
            ) : (
              recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-l from-emerald-50/50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100 hover:border-emerald-200"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">
                      {payment.payment_number}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {payment.payment_type === 'membership'
                        ? 'اشتراك عضوية'
                        : payment.payment_type === 'renewal'
                        ? 'تجديد'
                        : 'غرامة'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-emerald-600">
                      {Number(payment.amount).toLocaleString()} جنيه
                    </span>
                    {getPaymentStatusBadge(payment.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
        <h2 className="text-xl font-bold text-slate-800 mb-6">نظرة عامة على الأنشطة اليومية</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
            <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-700 font-medium mb-1">طلبات مقبولة اليوم</p>
              <p className="text-3xl font-bold text-emerald-600">12</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl border border-rose-200 hover:shadow-md transition-all">
            <div className="p-3 bg-rose-500 rounded-xl shadow-lg">
              <XCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-rose-700 font-medium mb-1">طلبات مرفوضة اليوم</p>
              <p className="text-3xl font-bold text-rose-600">3</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 hover:shadow-md transition-all">
            <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-700 font-medium mb-1">طلبات قيد المراجعة</p>
              <p className="text-3xl font-bold text-amber-600">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            توزيع الأعضاء حسب النوع
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">عضوية عادية</span>
                <span className="font-bold text-blue-600">45%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">عضوية عائلية</span>
                <span className="font-bold text-emerald-600">35%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full shadow-sm transition-all" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">عضوية VIP</span>
                <span className="font-bold text-amber-600">20%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full shadow-sm transition-all" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
            الإيرادات الشهرية
          </h3>
          <div className="space-y-3">
            {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'].map((month, index) => (
              <div key={month} className="flex items-center justify-between group">
                <span className="text-sm font-medium text-gray-700 w-16">{month}</span>
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full transition-all group-hover:shadow-sm"
                      style={{ width: `${50 + index * 8}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-20 text-left">
                    {(80000 + index * 15000).toLocaleString()} ج
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
            معدل التجديد
          </h3>
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-800">75%</span>
                <span className="text-xs text-gray-500 mt-1">معدل التجديد</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-emerald-600 font-semibold bg-emerald-50 rounded-lg py-2 px-3">
              معدل ممتاز للتجديد هذا الشهر
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-slate-700 rounded-full"></div>
          تحليل الطلبات الشهرية
        </h3>
        <div className="h-72 flex items-end justify-between gap-2 px-2">
          {[65, 85, 72, 95, 80, 90, 78, 88, 92, 85, 98, 94].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="w-full bg-gradient-to-t from-slate-700 via-slate-600 to-slate-500 rounded-t-xl transition-all hover:shadow-lg hover:scale-105 relative overflow-hidden" style={{ height: `${value}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                <div className="absolute top-2 left-0 right-0 text-center">
                  <span className="text-xs text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{value}</span>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{index + 1}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-medium">عدد الطلبات خلال الـ 12 شهر الماضية</p>
        </div>
      </div>
    </div>
  );
}
