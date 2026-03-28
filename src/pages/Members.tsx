import { useEffect, useState } from 'react';
import { Eye, CreditCard as Edit, UserX, RefreshCw, Download, Search, User, Phone, Mail, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { Member, MembershipType } from '../types/database';
import MemberDetails from './MemberDetails';

export default function Members() {
  const [members, setMembers] = useState<(Member & { membership_types?: MembershipType })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, [statusFilter]);

  const loadMembers = async () => {
    try {
      let query = supabase
        .from('members')
        .select('*, membership_types(*)')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (memberId: string) => {
    if (!confirm('هل أنت متأكد من إيقاف هذا العضو؟')) return;

    try {
      const { error } = await supabase
        .from('members')
        .update({ status: 'suspended' })
        .eq('id', memberId);

      if (error) throw error;
      loadMembers();
      alert('تم إيقاف العضو بنجاح');
    } catch (error) {
      console.error('Error suspending member:', error);
      alert('حدث خطأ أثناء إيقاف العضو');
    }
  };

  const handleRenew = async (memberId: string) => {
    try {
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

      const { error } = await supabase
        .from('members')
        .update({
          status: 'active',
          expiry_date: newExpiryDate.toISOString().split('T')[0],
        })
        .eq('id', memberId);

      if (error) throw error;
      loadMembers();
      alert('تم تجديد العضوية بنجاح');
    } catch (error) {
      console.error('Error renewing membership:', error);
      alert('حدث خطأ أثناء تجديد العضوية');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">فعال</Badge>;
      case 'expired':
        return <Badge variant="danger">منتهي</Badge>;
      case 'suspended':
        return <Badge variant="warning">موقوف</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membership_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
  );

  if (selectedMemberId) {
    return (
      <MemberDetails
        memberId={selectedMemberId}
        onBack={() => {
          setSelectedMemberId(null);
          loadMembers();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الأعضاء...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">إدارة الأعضاء</h1>
        <p className="text-white/70">عرض وإدارة جميع أعضاء النادي</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
            <div className="p-3 bg-emerald-500 rounded-xl">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-700 font-medium">الأعضاء الفعالون</p>
              <p className="text-3xl font-bold text-emerald-600">
                {members.filter((m) => m.status === 'active').length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl border border-rose-200">
            <div className="p-3 bg-rose-500 rounded-xl">
              <XCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-rose-700 font-medium">العضويات المنتهية</p>
              <p className="text-3xl font-bold text-rose-600">
                {members.filter((m) => m.status === 'expired').length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
            <div className="p-3 bg-amber-500 rounded-xl">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-700 font-medium">الأعضاء الموقوفون</p>
              <p className="text-3xl font-bold text-amber-600">
                {members.filter((m) => m.status === 'suspended').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث بالاسم، البريد، رقم العضوية أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">فعال</option>
          <option value="expired">منتهي</option>
          <option value="suspended">موقوف</option>
        </select>
        <Button icon={Download} variant="secondary" className="bg-white hover:bg-gray-50 text-slate-800 font-bold border-2 border-gray-200">
          تصدير Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">لا توجد أعضاء</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => setSelectedMemberId(member.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {member.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {member.full_name}
                    </h3>
                    <p className="text-xs text-gray-500">#{member.membership_number}</p>
                  </div>
                </div>
                {getStatusBadge(member.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    انضم: {new Date(member.join_date).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    ينتهي: {member.expiry_date ? new Date(member.expiry_date).toLocaleDateString('ar-EG') : '-'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm mb-3">
                  <p className="text-gray-500 mb-1">نوع العضوية</p>
                  <p className="font-bold text-slate-800">
                    {member.membership_types?.name_ar || 'غير محدد'}
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMemberId(member.id);
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
