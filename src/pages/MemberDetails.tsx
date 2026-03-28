import { useEffect, useState } from 'react';
import { ArrowRight, User, Mail, Phone, MapPin, Calendar, CreditCard, TrendingUp, Ban, CheckCircle, CreditCard as Edit, FileText, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Member, Subscription, Payment } from '../types/database';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface Props {
  memberId: string;
  onBack: () => void;
}

export default function MemberDetails({ memberId, onBack }: Props) {
  const [member, setMember] = useState<Member | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMemberDetails = async () => {
    try {
      const [memberRes, subsRes, paymentsRes] = await Promise.all([
        supabase.from('members').select('*').eq('id', memberId).maybeSingle(),
        supabase.from('subscriptions').select('*').eq('member_id', memberId).order('start_date', { ascending: false }),
        supabase.from('payments').select('*').eq('member_id', memberId).order('payment_date', { ascending: false })
      ]);

      if (memberRes.error) throw memberRes.error;
      setMember(memberRes.data);
      setSubscriptions(subsRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error('Error loading member:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberDetails();
  }, [memberId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">نشط</Badge>;
      case 'expired':
        return <Badge variant="warning">منتهي</Badge>;
      case 'suspended':
        return <Badge variant="danger">موقوف</Badge>;
      case 'cancelled':
        return <Badge variant="danger">ملغي</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
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
          <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التفاصيل...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على العضو</p>
        <Button onClick={onBack} className="mt-4">العودة للقائمة</Button>
      </div>
    );
  }

  const totalPaid = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

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
            <h1 className="text-3xl font-bold text-slate-800">ملف العضو</h1>
            <p className="text-gray-600 mt-1">رقم العضوية: {member.membership_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(member.status)}
          <Button icon={Edit} variant="outline">تعديل البيانات</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <div className="flex items-center gap-4 mb-6">
              {member.profile_image ? (
                <img
                  src={member.profile_image}
                  alt={member.full_name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-100"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                  {member.full_name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{member.full_name}</h2>
                <p className="text-gray-600">{member.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">رقم الهاتف</p>
                  <p className="font-bold text-slate-800">{member.phone || 'غير متوفر'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">الرقم القومي</p>
                  <p className="font-bold text-slate-800">{member.national_id || 'غير متوفر'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">تاريخ الميلاد</p>
                  <p className="font-bold text-slate-800">
                    {member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString('ar-EG') : 'غير متوفر'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">تاريخ الانضمام</p>
                  <p className="font-bold text-slate-800">
                    {new Date(member.join_date).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">العنوان</p>
                  <p className="font-bold text-slate-800">{member.address || 'غير متوفر'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
              سجل الاشتراكات
            </h2>
            {subscriptions.length === 0 ? (
              <p className="text-center text-gray-400 py-8">لا توجد اشتراكات</p>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-l from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-slate-800">
                          اشتراك - {sub.subscription_number}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">من: </span>
                          <span className="font-medium text-slate-800">
                            {new Date(sub.start_date).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">إلى: </span>
                          <span className="font-medium text-slate-800">
                            {new Date(sub.end_date).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(sub.status)}
                      <span className="text-lg font-bold text-emerald-600">
                        {Number(sub.amount).toLocaleString()} ج
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              سجل المدفوعات
            </h2>
            {payments.length === 0 ? (
              <p className="text-center text-gray-400 py-8">لا توجد مدفوعات</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-l from-blue-50/50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800">{payment.payment_number}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">النوع: </span>
                          <span className="font-medium text-slate-800">
                            {payment.payment_type === 'membership' && 'عضوية'}
                            {payment.payment_type === 'renewal' && 'تجديد'}
                            {payment.payment_type === 'fine' && 'غرامة'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">التاريخ: </span>
                          <span className="font-medium text-slate-800">
                            {new Date(payment.payment_date).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getPaymentBadge(payment.status)}
                      <span className="text-lg font-bold text-blue-600">
                        {Number(payment.amount).toLocaleString()} ج
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-7 text-white sticky top-6">
            <h2 className="text-xl font-bold mb-6">الإحصائيات المالية</h2>

            <div className="space-y-5">
              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  <p className="text-sm text-white/70">إجمالي المدفوعات</p>
                </div>
                <p className="text-3xl font-bold">{totalPaid.toLocaleString()} ج</p>
              </div>

              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <p className="text-sm text-white/70">عدد الاشتراكات</p>
                </div>
                <p className="text-3xl font-bold">{subscriptions.length}</p>
              </div>

              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-violet-400" />
                  <p className="text-sm text-white/70">عدد المدفوعات</p>
                </div>
                <p className="text-3xl font-bold">{payments.length}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="font-bold mb-4">معلومات العضوية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">رقم العضوية</span>
                  <span className="font-medium">{member.membership_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">الحالة</span>
                  <span className="font-medium">
                    {member.status === 'active' && 'نشط'}
                    {member.status === 'expired' && 'منتهي'}
                    {member.status === 'suspended' && 'موقوف'}
                    {member.status === 'cancelled' && 'ملغي'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">تاريخ الانتهاء</span>
                  <span className="font-medium">
                    {new Date(member.expiry_date).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">إجراءات سريعة</h3>
            <div className="space-y-3">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" icon={CheckCircle}>
                تجديد العضوية
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" icon={DollarSign}>
                إضافة دفعة
              </Button>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" icon={Edit}>
                تعديل البيانات
              </Button>
              <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" icon={Ban}>
                تعليق العضوية
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
