import { useEffect, useState } from 'react';
import { Activity, Filter, Download } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { supabase } from '../lib/supabase';
import { ActivityLog } from '../types/database';

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('create') || action.includes('add')) {
      return <Badge variant="success">{action}</Badge>;
    } else if (action.includes('delete') || action.includes('remove')) {
      return <Badge variant="danger">{action}</Badge>;
    } else if (action.includes('update') || action.includes('edit')) {
      return <Badge variant="info">{action}</Badge>;
    } else if (action.includes('login')) {
      return <Badge variant="default">{action}</Badge>;
    }
    return <Badge>{action}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل سجل النشاط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Activity className="w-8 h-8 text-[#1e3a5f]" />
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">سجل النشاط</h2>
            <p className="text-sm text-gray-600">تتبع جميع العمليات والأنشطة في النظام</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button icon={Filter} variant="outline" size="sm">
            تصفية
          </Button>
          <Button icon={Download} variant="secondary" size="sm">
            تصدير السجل
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#1e3a5f] to-[#0f1f3d] text-white">
              <tr>
                <th className="px-6 py-4 text-right font-semibold">التاريخ والوقت</th>
                <th className="px-6 py-4 text-right font-semibold">المستخدم</th>
                <th className="px-6 py-4 text-right font-semibold">العملية</th>
                <th className="px-6 py-4 text-right font-semibold">نوع الكيان</th>
                <th className="px-6 py-4 text-right font-semibold">عنوان IP</th>
                <th className="px-6 py-4 text-right font-semibold">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    لا يوجد سجل نشاط
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(log.created_at).toLocaleString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {log.user_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.entity_type || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.ip_address || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {JSON.stringify(log.details).substring(0, 50)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">إحصائيات النشاط</h3>
            <p className="text-sm text-gray-600">
              إجمالي العمليات المسجلة: <span className="font-bold">{logs.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
