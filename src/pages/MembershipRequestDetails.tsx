import { useEffect, useState } from 'react';
import { ArrowRight, User, Mail, Phone, MapPin, Calendar, FileText, CheckCircle, XCircle, Clock, Download, MessageSquare, Image, FileCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MembershipRequest } from '../types/database';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface Props {
  requestId: string;
  onBack: () => void;
}

export default function MembershipRequestDetails({ requestId, onBack }: Props) {
  const [request, setRequest] = useState<MembershipRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();

      if (error) throw error;
      setRequest(data);
    } catch (error) {
      console.error('Error loading request:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequestDetails();
  }, [requestId]);

  const handleApprove = async () => {
    if (!request) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (error) throw error;
      await loadRequestDetails();
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
      await loadRequestDetails();
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setProcessing(false);
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

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على الطلب</p>
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
            <h1 className="text-3xl font-bold text-slate-800">تفاصيل طلب العضوية</h1>
            <p className="text-gray-600 mt-1">رقم الطلب: {request.request_number}</p>
          </div>
        </div>
        <div>{getStatusBadge(request.status)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              المعلومات الشخصية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">الاسم الكامل</p>
                  <p className="font-bold text-slate-800">{request.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
                  <p className="font-bold text-slate-800">{request.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <Phone className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">رقم الهاتف</p>
                  <p className="font-bold text-slate-800">{request.phone || 'غير متوفر'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">تاريخ الميلاد</p>
                  <p className="font-bold text-slate-800">
                    {request.date_of_birth ? new Date(request.date_of_birth).toLocaleDateString('ar-EG') : 'غير متوفر'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">العنوان</p>
                  <p className="font-bold text-slate-800">{request.address || 'غير متوفر'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
              تفاصيل العضوية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">نوع العضوية</p>
                  <p className="font-bold text-slate-800">{request.membership_type || 'غير محدد'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">تاريخ التقديم</p>
                  <p className="font-bold text-slate-800">
                    {new Date(request.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {request.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">ملاحظات إضافية</p>
                <p className="text-slate-800">{request.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
              المستندات المرفقة
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">صورة الهوية</h3>
                      <p className="text-sm text-gray-500">PDF, JPG (Max 5MB)</p>
                    </div>
                  </div>
                  {request.id_card_url && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-blue-600" />
                    </button>
                  )}
                </div>
                {request.id_card_url ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      تم الرفع بنجاح
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-amber-600 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      لم يتم الرفع بعد
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">شهادة التخرج</h3>
                      <p className="text-sm text-gray-500">PDF, JPG (Max 10MB)</p>
                    </div>
                  </div>
                  {request.graduation_certificate_url && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-blue-600" />
                    </button>
                  )}
                </div>
                {request.graduation_certificate_url ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      تم الرفع بنجاح
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-amber-600 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      لم يتم الرفع بعد
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Image className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">صورة شخصية</h3>
                      <p className="text-sm text-gray-500">High Resolution JPG</p>
                    </div>
                  </div>
                  {request.personal_photo_url && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-blue-600" />
                    </button>
                  )}
                </div>
                {request.personal_photo_url ? (
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                    <img
                      src={request.personal_photo_url}
                      alt="صورة شخصية"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      تم الرفع بنجاح
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-amber-600 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      لم يتم الرفع بعد
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-7 text-white sticky top-6">
            <h2 className="text-xl font-bold mb-6">إجراءات الطلب</h2>

            {request.status === 'pending' || request.status === 'under_review' ? (
              <div className="space-y-4">
                <Button
                  onClick={handleApprove}
                  disabled={processing}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  قبول الطلب
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={processing}
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all border-white/20"
                >
                  <XCircle className="w-5 h-5" />
                  رفض الطلب
                </Button>
              </div>
            ) : (
              <div className={`p-4 rounded-xl ${
                request.status === 'approved'
                  ? 'bg-emerald-500/20 border border-emerald-400/30'
                  : 'bg-rose-500/20 border border-rose-400/30'
              }`}>
                <p className="text-center font-medium">
                  {request.status === 'approved' ? 'تم قبول هذا الطلب' : 'تم رفض هذا الطلب'}
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="font-bold mb-4">معلومات إضافية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">رقم الطلب</span>
                  <span className="font-medium">{request.request_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">الحالة</span>
                  <span className="font-medium">
                    {request.status === 'pending' && 'قيد المراجعة'}
                    {request.status === 'approved' && 'مقبول'}
                    {request.status === 'rejected' && 'مرفوض'}
                    {request.status === 'under_review' && 'تحت المراجعة'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">تاريخ التقديم</span>
                  <span className="font-medium">
                    {new Date(request.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              الملاحظات الداخلية
            </h3>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="أضف ملاحظات داخلية حول هذا الطلب..."
            ></textarea>
            <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
              حفظ الملاحظات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
