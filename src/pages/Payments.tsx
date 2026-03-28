import { useEffect, useState } from 'react';
import { Eye, Download, DollarSign, TrendingUp, CreditCard, Search, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import { supabase } from '../lib/supabase';
import { Payment } from '../types/database';
import PaymentDetails from './PaymentDetails';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const paymentsData = data || [];
      setPayments(paymentsData);

      const completed = paymentsData.filter((p) => p.status === 'completed').length;
      const pending = paymentsData.filter((p) => p.status === 'pending').length;
      const totalAmount = paymentsData
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      setStats({
        total: paymentsData.length,
        completed,
        pending,
        totalAmount,
      });
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
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

  const getPaymentType = (type: string) => {
    switch (type) {
      case 'membership':
        return 'اشتراك عضوية';
      case 'renewal':
        return 'تجديد';
      case 'penalty':
        return 'غرامة';
      default:
        return type;
    }
  };

  const getPaymentMethod = (method: string) => {
    switch (method) {
      case 'cash':
        return 'نقدي';
      case 'bank_transfer':
        return 'تحويل بنكي';
      case 'card':
        return 'بطاقة';
      case 'online':
        return 'أونلاين';
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return payment.payment_number.toLowerCase().includes(query);
  });

  if (selectedPaymentId) {
    return (
      <PaymentDetails
        paymentId={selectedPaymentId}
        onBack={() => {
          setSelectedPaymentId(null);
          loadPayments();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المدفوعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">إدارة المدفوعات</h1>
        <p className="text-white/70">عرض وإدارة جميع عمليات الدفع</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          title="إجمالي المدفوعات"
          value={stats.total}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="المدفوعات المكتملة"
          value={stats.completed}
          icon={DollarSign}
          color="green"
        />
        <StatCard title="المدفوعات المعلقة" value={stats.pending} icon={CreditCard} color="yellow" />
        <StatCard
          title="إجمالي المبالغ"
          value={`${stats.totalAmount.toLocaleString()} جنيه`}
          icon={TrendingUp}
          color="gold"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث برقم العملية..."
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
        {filteredPayments.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">لا توجد مدفوعات</p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => setSelectedPaymentId(payment.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {payment.payment_number}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {getPaymentType(payment.payment_type)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(payment.status)}
              </div>

              <div className="mb-4 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                <p className="text-sm text-emerald-700 mb-1">المبلغ</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {Number(payment.amount).toLocaleString()} ج
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{getPaymentMethod(payment.payment_method)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(payment.payment_date).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPaymentId(payment.id);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold"
                icon={Eye}
              >
                عرض التفاصيل
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
