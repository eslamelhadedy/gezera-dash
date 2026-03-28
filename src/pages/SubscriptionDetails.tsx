import { useEffect, useState } from 'react';
import { ArrowRight, FileText, Calendar, User, DollarSign, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Subscription, Member } from '../types/database';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface Props {
  subscriptionId: string;
  onBack: () => void;
}

export default function SubscriptionDetails({ subscriptionId, onBack }: Props) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSubscriptionDetails = async () => {
    try {
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .maybeSingle();

      if (subError) throw subError;
      setSubscription(subData);

      if (subData?.member_id) {
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('id', subData.member_id)
          .maybeSingle();

        if (memberError) throw memberError;
        setMember(memberData);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionDetails();
  }, [subscriptionId]);

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

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على الاشتراك</p>
        <Button onClick={onBack} className="mt-4">العودة للقائمة</Button>
      </div>
    );
  }

  const daysRemaining = Math.ceil((new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

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
            <h1 className="text-3xl font-bold text-slate-800">تفاصيل الاشتراك</h1>
            <p className="text-gray-600 mt-1">رقم الاشتراك: {subscription.subscription_number}</p>
          </div>
        </div>
        <div>{getStatusBadge(subscription.status)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              معلومات الاشتراك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">رقم الاشتراك</p>
                  <p className="font-bold text-slate-800">{subscription.subscription_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">المبلغ</p>
                  <p className="font-bold text-emerald-600 text-2xl">
                    {Number(subscription.amount).toLocaleString()} جنيه
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">تاريخ البداية</p>
                  <p className="font-bold text-slate-800">
                    {new Date(subscription.start_date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">تاريخ الانتهاء</p>
                  <p className="font-bold text-slate-800">
                    {new Date(subscription.end_date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">حالة الاشتراك</p>
                  <div>{getStatusBadge(subscription.status)}</div>
                </div>
              </div>
            </div>

            {daysRemaining > 0 && subscription.status === 'active' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-blue-800 font-medium">
                  متبقي <span className="text-2xl font-bold">{daysRemaining}</span> يوم على انتهاء الاشتراك
                </p>
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
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-7 text-white sticky top-6">
            <h2 className="text-xl font-bold mb-6">ملخص الاشتراك</h2>

            <div className="space-y-5">
              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">المبلغ</span>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold">{Number(subscription.amount).toLocaleString()} ج</p>
              </div>

              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">الأيام المتبقية</span>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold">{daysRemaining > 0 ? daysRemaining : 0}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="font-bold mb-4">تفاصيل إضافية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">رقم الاشتراك</span>
                  <span className="font-medium">{subscription.subscription_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">الحالة</span>
                  <span className="font-medium">
                    {subscription.status === 'active' && 'نشط'}
                    {subscription.status === 'expired' && 'منتهي'}
                    {subscription.status === 'cancelled' && 'ملغي'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">إجراءات</h3>
            <div className="space-y-3">
              {subscription.status === 'active' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" icon={FileText}>
                  طباعة بطاقة العضوية
                </Button>
              )}
              {subscription.status === 'expired' && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" icon={CheckCircle}>
                  تجديد الاشتراك
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
