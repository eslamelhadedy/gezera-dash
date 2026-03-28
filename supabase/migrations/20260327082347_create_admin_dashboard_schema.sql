/*
  # نظام إدارة نادي جزيرة الورد الرياضي - قاعدة البيانات الكاملة

  ## الجداول الجديدة
  
  ### 1. membership_types - أنواع العضويات
    - `id` (uuid, primary key)
    - `name_ar` (text) - اسم العضوية بالعربي
    - `name_en` (text) - اسم العضوية بالإنجليزي
    - `price` (decimal) - السعر
    - `duration_months` (integer) - مدة العضوية بالشهور
    - `benefits` (jsonb) - المزايا
    - `is_active` (boolean) - فعالة أم لا
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 2. members - الأعضاء
    - `id` (uuid, primary key)
    - `membership_number` (text, unique) - رقم العضوية
    - `full_name` (text) - الاسم الكامل
    - `email` (text, unique) - البريد الإلكتروني
    - `phone` (text) - رقم الهاتف
    - `national_id` (text) - الرقم القومي
    - `date_of_birth` (date) - تاريخ الميلاد
    - `address` (text) - العنوان
    - `membership_type_id` (uuid, foreign key) - نوع العضوية
    - `status` (text) - الحالة: active, expired, suspended
    - `join_date` (date) - تاريخ الانضمام
    - `expiry_date` (date) - تاريخ الانتهاء
    - `profile_image` (text) - صورة الملف الشخصي
    - `user_id` (uuid, foreign key) - حساب المستخدم
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 3. membership_requests - طلبات العضوية
    - `id` (uuid, primary key)
    - `request_number` (text, unique) - رقم الطلب
    - `full_name` (text) - الاسم الكامل
    - `email` (text) - البريد الإلكتروني
    - `phone` (text) - رقم الهاتف
    - `national_id` (text) - الرقم القومي
    - `date_of_birth` (date) - تاريخ الميلاد
    - `address` (text) - العنوان
    - `membership_type_id` (uuid, foreign key) - نوع العضوية المطلوب
    - `spouse_name` (text) - اسم الزوج/الزوجة
    - `spouse_national_id` (text) - الرقم القومي للزوج/الزوجة
    - `documents` (jsonb) - المستندات المرفوعة
    - `status` (text) - الحالة: pending, approved, rejected, under_review
    - `payment_status` (text) - حالة الدفع: pending, paid, failed
    - `payment_amount` (decimal) - المبلغ المدفوع
    - `admin_notes` (text) - ملاحظات الإدارة
    - `rejection_reason` (text) - سبب الرفض
    - `reviewed_by` (uuid) - المستخدم الذي راجع الطلب
    - `reviewed_at` (timestamptz) - تاريخ المراجعة
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. family_members - أفراد الأسرة
    - `id` (uuid, primary key)
    - `member_id` (uuid, foreign key) - معرف العضو
    - `request_id` (uuid, foreign key) - معرف الطلب (إذا كان من طلب)
    - `full_name` (text) - الاسم الكامل
    - `relationship` (text) - العلاقة: spouse, son, daughter
    - `national_id` (text) - الرقم القومي
    - `date_of_birth` (date) - تاريخ الميلاد
    - `created_at` (timestamptz)

  ### 5. payments - المدفوعات
    - `id` (uuid, primary key)
    - `payment_number` (text, unique) - رقم العملية
    - `member_id` (uuid, foreign key) - معرف العضو
    - `request_id` (uuid, foreign key) - معرف الطلب
    - `amount` (decimal) - المبلغ
    - `payment_type` (text) - نوع الدفع: membership, renewal, penalty
    - `payment_method` (text) - طريقة الدفع: cash, bank_transfer, card, online
    - `status` (text) - الحالة: pending, completed, failed, refunded
    - `transaction_id` (text) - معرف المعاملة
    - `payment_date` (timestamptz) - تاريخ الدفع
    - `notes` (text) - ملاحظات
    - `processed_by` (uuid) - المعالج
    - `created_at` (timestamptz)

  ### 6. subscriptions - الاشتراكات
    - `id` (uuid, primary key)
    - `member_id` (uuid, foreign key) - معرف العضو
    - `membership_type_id` (uuid, foreign key) - نوع العضوية
    - `start_date` (date) - تاريخ البداية
    - `end_date` (date) - تاريخ النهاية
    - `is_active` (boolean) - فعال
    - `auto_renew` (boolean) - تجديد تلقائي
    - `created_at` (timestamptz)

  ### 7. admin_users - مستخدمي لوحة التحكم
    - `id` (uuid, primary key)
    - `auth_user_id` (uuid, foreign key) - معرف المصادقة
    - `full_name` (text) - الاسم الكامل
    - `email` (text, unique) - البريد الإلكتروني
    - `role` (text) - الدور: super_admin, admin, finance, membership_manager, content_manager, support
    - `permissions` (jsonb) - الصلاحيات
    - `is_active` (boolean) - فعال
    - `last_login` (timestamptz) - آخر تسجيل دخول
    - `created_at` (timestamptz)

  ### 8. notifications - الإشعارات
    - `id` (uuid, primary key)
    - `recipient_id` (uuid) - معرف المستلم
    - `recipient_type` (text) - نوع المستلم: member, admin
    - `title` (text) - العنوان
    - `message` (text) - الرسالة
    - `type` (text) - النوع: email, sms, push, system
    - `status` (text) - الحالة: pending, sent, failed, read
    - `sent_at` (timestamptz) - تاريخ الإرسال
    - `read_at` (timestamptz) - تاريخ القراءة
    - `created_at` (timestamptz)

  ### 9. activity_logs - سجل النشاط
    - `id` (uuid, primary key)
    - `user_id` (uuid) - معرف المستخدم
    - `action` (text) - العملية
    - `entity_type` (text) - نوع الكيان
    - `entity_id` (uuid) - معرف الكيان
    - `details` (jsonb) - التفاصيل
    - `ip_address` (text) - عنوان IP
    - `created_at` (timestamptz)

  ### 10. cms_pages - صفحات المحتوى
    - `id` (uuid, primary key)
    - `slug` (text, unique) - المعرف
    - `title_ar` (text) - العنوان بالعربي
    - `title_en` (text) - العنوان بالإنجليزي
    - `content_ar` (text) - المحتوى بالعربي
    - `content_en` (text) - المحتوى بالإنجليزي
    - `images` (jsonb) - الصور
    - `seo_title` (text) - عنوان SEO
    - `seo_description` (text) - وصف SEO
    - `is_published` (boolean) - منشور
    - `created_by` (uuid)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 11. media_library - مكتبة الوسائط
    - `id` (uuid, primary key)
    - `file_name` (text) - اسم الملف
    - `file_url` (text) - رابط الملف
    - `file_type` (text) - نوع الملف: image, video, document
    - `file_size` (bigint) - حجم الملف
    - `category` (text) - التصنيف
    - `uploaded_by` (uuid) - رافع الملف
    - `created_at` (timestamptz)

  ### 12. settings - الإعدادات
    - `id` (uuid, primary key)
    - `key` (text, unique) - المفتاح
    - `value` (jsonb) - القيمة
    - `category` (text) - الفئة: general, membership, payment, email, notification
    - `updated_at` (timestamptz)

  ## الأمان (RLS)
  - تفعيل RLS على جميع الجداول
  - سياسات أمان مقيدة للمصادقين فقط
  - فحص الصلاحيات قبل السماح بالوصول
*/

-- إنشاء جدول أنواع العضويات
CREATE TABLE IF NOT EXISTS membership_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  price decimal(10, 2) NOT NULL DEFAULT 0,
  duration_months integer NOT NULL DEFAULT 12,
  benefits jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الأعضاء
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  national_id text NOT NULL,
  date_of_birth date,
  address text,
  membership_type_id uuid REFERENCES membership_types(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  join_date date DEFAULT CURRENT_DATE,
  expiry_date date,
  profile_image text,
  user_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول طلبات العضوية
CREATE TABLE IF NOT EXISTS membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  national_id text NOT NULL,
  date_of_birth date,
  address text,
  membership_type_id uuid REFERENCES membership_types(id),
  spouse_name text,
  spouse_national_id text,
  documents jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_amount decimal(10, 2) DEFAULT 0,
  admin_notes text,
  rejection_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول أفراد الأسرة
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  request_id uuid REFERENCES membership_requests(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  relationship text CHECK (relationship IN ('spouse', 'son', 'daughter')),
  national_id text,
  date_of_birth date,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول المدفوعات
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number text UNIQUE NOT NULL,
  member_id uuid REFERENCES members(id),
  request_id uuid REFERENCES membership_requests(id),
  amount decimal(10, 2) NOT NULL,
  payment_type text CHECK (payment_type IN ('membership', 'renewal', 'penalty')),
  payment_method text CHECK (payment_method IN ('cash', 'bank_transfer', 'card', 'online')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_date timestamptz DEFAULT now(),
  notes text,
  processed_by uuid,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الاشتراكات
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  membership_type_id uuid REFERENCES membership_types(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  auto_renew boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول مستخدمي لوحة التحكم
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'support' CHECK (role IN ('super_admin', 'admin', 'finance', 'membership_manager', 'content_manager', 'support')),
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  recipient_type text CHECK (recipient_type IN ('member', 'admin')),
  title text NOT NULL,
  message text NOT NULL,
  type text CHECK (type IN ('email', 'sms', 'push', 'system')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول سجل النشاط
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول صفحات المحتوى
CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text,
  content_en text,
  images jsonb DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text,
  is_published boolean DEFAULT false,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول مكتبة الوسائط
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text CHECK (file_type IN ('image', 'video', 'document')),
  file_size bigint,
  category text,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الإعدادات
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text CHECK (category IN ('general', 'membership', 'payment', 'email', 'notification')),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_membership_type ON members(membership_type_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON membership_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_payment_status ON membership_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_member ON subscriptions(member_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- تفعيل RLS على جميع الجداول
ALTER TABLE membership_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لمستخدمي الإدارة فقط (يجب أن يكون لديهم auth.uid())
CREATE POLICY "Admin users can view membership types"
  ON membership_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage membership types"
  ON membership_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view members"
  ON members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage members"
  ON members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view requests"
  ON membership_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage requests"
  ON membership_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view family members"
  ON family_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage family members"
  ON family_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Super admin can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

CREATE POLICY "Admin users can view notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can insert activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view CMS pages"
  ON cms_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage CMS pages"
  ON cms_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view media library"
  ON media_library FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can manage media library"
  ON media_library FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admin users can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Super admin can manage settings"
  ON settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- إدراج بيانات تجريبية لأنواع العضويات
INSERT INTO membership_types (name_ar, name_en, price, duration_months, benefits, is_active)
VALUES 
  ('عضوية عادية', 'Regular Membership', 5000.00, 12, '["استخدام المرافق الرياضية", "حضور الفعاليات", "خصم 10% على الأنشطة"]'::jsonb, true),
  ('عضوية عائلية', 'Family Membership', 8000.00, 12, '["استخدام المرافق الرياضية للعائلة", "حضور الفعاليات", "خصم 15% على الأنشطة", "عضوية لـ 4 أفراد"]'::jsonb, true),
  ('عضوية VIP', 'VIP Membership', 15000.00, 12, '["استخدام غير محدود للمرافق", "أولوية في الحجز", "خصم 25% على الأنشطة", "صالة VIP خاصة", "مدرب شخصي"]'::jsonb, true)
ON CONFLICT DO NOTHING;