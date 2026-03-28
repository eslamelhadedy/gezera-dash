import { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Filter, Download, Search, Calendar, Mail, Phone } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { MembershipRequest, MembershipType } from '../types/database';
import MembershipRequestDetails from './MembershipRequestDetails';

export default function MembershipRequests() {
  const [requests, setRequests] = useState<(MembershipRequest & { membership_type?: MembershipType })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      let query = supabase
        .from('membership_requests')
        .select('*, membership_types(*)')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const request = requests.find((r) => r.id === requestId);
      if (!request) return;

      const membershipNumber = `GSC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const { error: memberError } = await supabase.from('members').insert({
        membership_number: membershipNumber,
        full_name: request.full_name,
        email: request.email,
        phone: request.phone,
        national_id: request.national_id,
        date_of_birth: request.date_of_birth,
        address: request.address,
        membership_type_id: request.membership_type_id,
        status: 'active',
        join_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      if (memberError) throw memberError;

      const { error: updateError } = await supabase
        .from('membership_requests')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', requestId);

      if (updateError) throw updateError;

      loadRequests();
      alert('تم قبول الطلب بنجاح');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('حدث خطأ أثناء قبول الطلب');
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      loadRequests();
      alert('تم رفض الطلب');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('حدث خطأ أثناء رفض الطلب');
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

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">مدفوع</Badge>;
      case 'pending':
        return <Badge variant="warning">معلق</Badge>;
      case 'failed':
        return <Badge variant="danger">فشل</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.full_name.toLowerCase().includes(query) ||
      request.email.toLowerCase().includes(query) ||
      request.phone?.toLowerCase().includes(query) ||
      request.request_number.toLowerCase().includes(query)
    );
  });

  if (selectedRequestId) {
    return (
      <MembershipRequestDetails
        requestId={selectedRequestId}
        onBack={() => {
          setSelectedRequestId(null);
          loadRequests();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">طلبات العضوية</h1>
        <p className="text-white/70">إدارة ومراجعة جميع طلبات العضوية الواردة</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث بالاسم، البريد، الهاتف أو رقم الطلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-6 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
        >
          <option value="all">جميع الطلبات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">مقبول</option>
          <option value="rejected">مرفوض</option>
          <option value="under_review">تحت المراجعة</option>
        </select>
        <Button icon={Download} variant="secondary" className="bg-white hover:bg-gray-50 text-slate-800 font-bold border-2 border-gray-200">
          تصدير Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequests.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">لا توجد طلبات</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => setSelectedRequestId(request.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {request.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {request.full_name}
                      </h3>
                      <p className="text-xs text-gray-500">#{request.request_number}</p>
                    </div>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{request.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{request.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(request.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">نوع العضوية</p>
                  <p className="font-bold text-slate-800">
                    {(request as any).membership_types?.name_ar || 'غير محدد'}
                  </p>
                </div>
                <div className="text-right">
                  {getPaymentBadge(request.payment_status)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRequestId(request.id);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold"
                  icon={Eye}
                >
                  عرض التفاصيل
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
