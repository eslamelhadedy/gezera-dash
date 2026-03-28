export type MembershipType = {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  duration_months: number;
  benefits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Member = {
  id: string;
  membership_number: string;
  full_name: string;
  email: string;
  phone: string;
  national_id: string;
  date_of_birth: string | null;
  address: string | null;
  membership_type_id: string;
  status: 'active' | 'expired' | 'suspended';
  join_date: string;
  expiry_date: string | null;
  profile_image: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type MembershipRequest = {
  id: string;
  request_number: string;
  full_name: string;
  email: string;
  phone: string;
  national_id: string;
  date_of_birth: string | null;
  address: string | null;
  membership_type_id: string;
  spouse_name: string | null;
  spouse_national_id: string | null;
  documents: any[];
  id_card_url: string | null;
  graduation_certificate_url: string | null;
  personal_photo_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_amount: number;
  admin_notes: string | null;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  payment_number: string;
  member_id: string | null;
  request_id: string | null;
  amount: number;
  payment_type: 'membership' | 'renewal' | 'penalty';
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string | null;
  payment_date: string;
  notes: string | null;
  processed_by: string | null;
  created_at: string;
};

export type AdminUser = {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'finance' | 'membership_manager' | 'content_manager' | 'support';
  permissions: any;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  recipient_type: 'member' | 'admin';
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push' | 'system';
  status: 'pending' | 'sent' | 'failed' | 'read';
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
};

export type DashboardStats = {
  totalMembers: number;
  activeMembers: number;
  pendingRequests: number;
  totalRevenue: number;
  monthlyRevenue: number;
  expiredMemberships: number;
  totalUsers: number;
  unreadNotifications: number;
};
