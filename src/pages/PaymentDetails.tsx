import { useEffect, useState } from 'react';
import { ArrowRight, DollarSign, Calendar, CreditCard, FileText, User, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Payment, Member } from '../types/database';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface Props {
  paymentId: string;
  onBack: () => void;
}

export default function PaymentDetails({ paymentId, onBack }: Props) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPaymentDetails = async () => {
    try {
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .maybeSingle();

      if (paymentError) throw paymentError;
      setPayment(paymentData);

      if (paymentData?.member_id) {
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('id', paymentData.member_id)
          .maybeSingle();

        if (memberError) throw memberError;
        setMember(memberData);
      }
    } catch (error) {
      console.error('Error loading payment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentDetails();
  }, [paymentId]);

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

  const getPaymentTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      membership: { label: 'عضوية', color: 'bg-blue-100 text-blue-700' },
      renewal: { label: 'تجديد', color: 'bg-emerald-100 text-emerald-700' },
      fine: { label: 'غرامة', color: 'bg-rose-100 text-rose-700' },
    };
    const typeInfo = types[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${typeInfo.color}`}>
        {typeInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التفاصيل...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على عملية الدفع</p>
        <Button onClick={onBack} className="mt-4">العودة للقائمة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">تفاصيل الدفع</h1>
            <p className="text-gray-600 mt-1">رقم العملية: {payment.payment_number}</p>
          </div>
        </div>
        <div>{getStatusBadge(payment.status)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              معلومات الدفع
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">رقم العملية</p>
                  <p className="font-bold text-slate-800">{payment.payment_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">المبلغ</p>
                  <p className="font-bold text-emerald-600 text-2xl">
                    {Number(payment.amount).toLocaleString()} جنيه
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">تاريخ الدفع</p>
                  <p className="font-bold text-slate-800">
                    {new Date(payment.payment_date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">طريقة الدفع</p>
                  <p className="font-bold text-slate-800">
                    {payment.payment_method === 'cash' && 'نقدي'}
                    {payment.payment_method === 'card' && 'بطاقة'}
                    {payment.payment_method === 'transfer' && 'تحويل'}
                    {payment.payment_method === 'online' && 'أونلاين'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <FileText className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">نوع الدفع</p>
                  <div>{getPaymentTypeBadge(payment.payment_type)}</div>
                </div>
              </div>
            </div>

            {payment.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">ملاحظات</p>
                <p className="text-slate-800">{payment.notes}</p>
              </div>
            )}
          </div>

          {member && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                معلومات العضو
              </h2>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-l from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {member.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{member.full_name}</h3>
                  <p className="text-gray-600">{member.email}</p>
                  <p className="text-sm text-gray-500 mt-1">رقم العضوية: {member.membership_number}</p>
                </div>
                <Button variant="outline" size="sm">
                  عرض الملف
                </Button>
              </div>
            </div>
          )}

          {payment.transaction_id && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
                معلومات المعاملة
              </h2>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">رقم المعاملة</p>
                <p className="font-mono text-slate-800 font-bold">{payment.transaction_id}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-7 text-white sticky top-6">
            <h2 className="text-xl font-bold mb-6">ملخص الدفع</h2>

            <div className="space-y-5">
              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">المبلغ الإجمالي</span>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold">{Number(payment.amount).toLocaleString()} ج</p>
              </div>

              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">الحالة</span>
                  {payment.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                  {payment.status === 'pending' && <RefreshCw className="w-5 h-5 text-amber-400" />}
                  {payment.status === 'failed' && <XCircle className="w-5 h-5 text-rose-400" />}
                </div>
                <p className="text-lg font-bold">
                  {payment.status === 'completed' && 'مكتمل'}
                  {payment.status === 'pending' && 'معلق'}
                  {payment.status === 'failed' && 'فشل'}
                  {payment.status === 'refunded' && 'مسترد'}
                </p>
              </div>

              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">تاريخ الإنشاء</span>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-sm font-medium">
                  {new Date(payment.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="font-bold mb-4">تفاصيل إضافية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">رقم العملية</span>
                  <span className="font-medium">{payment.payment_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">طريقة الدفع</span>
                  <span className="font-medium">
                    {payment.payment_method === 'cash' && 'نقدي'}
                    {payment.payment_method === 'card' && 'بطاقة'}
                    {payment.payment_method === 'transfer' && 'تحويل'}
                    {payment.payment_method === 'online' && 'أونلاين'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">النوع</span>
                  <span className="font-medium">
                    {payment.payment_type === 'membership' && 'عضوية'}
                    {payment.payment_type === 'renewal' && 'تجديد'}
                    {payment.payment_type === 'fine' && 'غرامة'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">إجراءات</h3>
            <div className="space-y-3">
              {payment.status === 'completed' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" icon={FileText}>
                  طباعة الإيصال
                </Button>
              )}
              {payment.status === 'pending' && (
                <>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" icon={CheckCircle}>
                    تأكيد الدفع
                  </Button>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" icon={XCircle}>
                    إلغاء الدفع
                  </Button>
                </>
              )}
              {payment.status === 'completed' && (
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" icon={RefreshCw}>
                  استرداد المبلغ
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
