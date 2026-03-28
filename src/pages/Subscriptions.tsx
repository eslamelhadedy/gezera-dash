import { useEffect, useState } from 'react';
import { Calendar, RefreshCw, Eye, Search, Download, FileText, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { Subscription } from '../types/database';
import SubscriptionDetails from './SubscriptionDetails';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">نشط</Badge>;
      case 'expired':
        return <Badge variant="warning">منتهي</Badge>;
      case 'cancelled':
        return <Badge variant="danger">ملغي</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return sub.subscription_number.toLowerCase().includes(query);
  });

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const expiredCount = subscriptions.filter((s) => s.status === 'expired').length;
  const totalAmount = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + Number(s.amount), 0);

  if (selectedSubscriptionId) {
    return (
      <SubscriptionDetails
        subscriptionId={selectedSubscriptionId}
        onBack={() => {
          setSelectedSubscriptionId(null);
          loadSubscriptions();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الاشتراكات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">إدارة الاشتراكات</h1>
        <p className="text-white/70">متابعة اشتراكات الأعضاء وتجديداتها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 shadow-lg">
          <div className="p-3 bg-emerald-500 rounded-xl">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-emerald-700 font-medium">الاشتراكات النشطة</p>
            <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 shadow-lg">
          <div className="p-3 bg-amber-500 rounded-xl">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-amber-700 font-medium">الاشتراكات المنتهية</p>
            <p className="text-3xl font-bold text-amber-600">{expiredCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 shadow-lg">
          <div className="p-3 bg-blue-500 rounded-xl">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">قيمة الاشتراكات النشطة</p>
            <p className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()} ج</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث برقم الاشتراك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button icon={Download} variant="secondary" className="bg-white hover:bg-gray-50 text-slate-800 font-bold border-2 border-gray-200">
          تصدير التقرير
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubscriptions.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">لا توجد اشتراكات</p>
          </div>
        ) : (
          filteredSubscriptions.map((subscription) => {
            const daysRemaining = Math.ceil((new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div
                key={subscription.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => setSelectedSubscriptionId(subscription.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {subscription.subscription_number}
                      </h3>
                      <p className="text-xs text-gray-500">اشتراك</p>
                    </div>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>

                <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">المبلغ</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Number(subscription.amount).toLocaleString()} ج
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      من: {new Date(subscription.start_date).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      إلى: {new Date(subscription.end_date).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  {daysRemaining > 0 && subscription.status === 'active' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">
                        متبقي {daysRemaining} يوم
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSubscriptionId(subscription.id);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold"
                  icon={Eye}
                >
                  عرض التفاصيل
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
