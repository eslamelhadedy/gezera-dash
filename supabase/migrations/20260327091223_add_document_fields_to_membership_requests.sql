/*
  # Add Document Upload Fields to Membership Requests

  1. Changes
    - Add `id_card_url` column to store ID card document (PDF/JPG, max 5MB)
    - Add `graduation_certificate_url` column to store graduation certificate (PDF/JPG, max 10MB)
    - Add `personal_photo_url` column to store personal photo (high resolution JPG)
  
  2. Notes
    - All fields are nullable to support existing records
    - These fields will store URLs to uploaded documents in storage
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_requests' AND column_name = 'id_card_url'
  ) THEN
    ALTER TABLE membership_requests ADD COLUMN id_card_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_requests' AND column_name = 'graduation_certificate_url'
  ) THEN
    ALTER TABLE membership_requests ADD COLUMN graduation_certificate_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_requests' AND column_name = 'personal_photo_url'
  ) THEN
    ALTER TABLE membership_requests ADD COLUMN personal_photo_url text;
  END IF;
END $$;