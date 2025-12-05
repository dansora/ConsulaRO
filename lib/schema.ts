
export const SQL_SCHEMA = `-- SCRIPT COMPLET DE REPARARE SI INITIALIZARE
-- Ruleaza acest script in Supabase SQL Editor pentru a repara erorile 400, 42703, 23502, 42710

-- 1. REPARARE EROARE 23502 (null value in column "content")
-- Facem coloana veche 'content' optionala si ne asiguram ca avem 'description'
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'content') THEN
        ALTER TABLE announcements ALTER COLUMN content DROP NOT NULL;
    END IF;
    
    -- Daca avem date in content dar nu in description, le mutam
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'content') THEN
       UPDATE announcements SET description = content WHERE description IS NULL;
    END IF;
END $$;

-- 2. REPARARE EROARE 42703 (column "active" does not exist)
-- Redenumim is_active in active daca exista varianta veche
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_active') THEN
        ALTER TABLE announcements RENAME COLUMN is_active TO active;
    END IF;

    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_active') THEN
        ALTER TABLE events RENAME COLUMN is_active TO active;
    END IF;
END $$;

-- 3. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Create/Update Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  county TEXT,
  country TEXT,
  post_code TEXT,
  username TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asiguram ca toate coloanele exista (in caz ca tabelul exista deja)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS county TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS post_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS image TEXT; -- Legacy support

-- 5. Create/Update Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 6. Create/Update Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT,
  description TEXT,
  image_url TEXT,
  date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 7. Create User Documents Table
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_name TEXT,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE user_documents ADD COLUMN IF NOT EXISTS message TEXT;

-- 8. Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('profile_images', 'profile_images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content_images', 'content_images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING;

-- 9. Policies (RLS) - Drop first to ensure update
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles" ON profiles;
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Self insert profiles" ON profiles;
CREATE POLICY "Self insert profiles" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Self update profiles" ON profiles;
CREATE POLICY "Self update profiles" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Self delete profiles" ON profiles;
CREATE POLICY "Self delete profiles" ON profiles FOR DELETE USING (auth.uid() = id);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public announcements" ON announcements;
CREATE POLICY "Public announcements" ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert announcements" ON announcements;
CREATE POLICY "Admin insert announcements" ON announcements FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
DROP POLICY IF EXISTS "Admin update announcements" ON announcements;
CREATE POLICY "Admin update announcements" ON announcements FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
DROP POLICY IF EXISTS "Admin delete announcements" ON announcements;
CREATE POLICY "Admin delete announcements" ON announcements FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public events" ON events;
CREATE POLICY "Public events" ON events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert events" ON events;
CREATE POLICY "Admin insert events" ON events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
DROP POLICY IF EXISTS "Admin update events" ON events;
CREATE POLICY "Admin update events" ON events FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
DROP POLICY IF EXISTS "Admin delete events" ON events;
CREATE POLICY "Admin delete events" ON events FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));

ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own docs" ON user_documents;
CREATE POLICY "Users own docs" ON user_documents FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins all docs" ON user_documents;
CREATE POLICY "Admins all docs" ON user_documents FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
DROP POLICY IF EXISTS "Users insert docs" ON user_documents;
CREATE POLICY "Users insert docs" ON user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage Policies (Drop first to avoid 42710 error)
DROP POLICY IF EXISTS "Public Profiles" ON storage.objects;
CREATE POLICY "Public Profiles" ON storage.objects FOR SELECT USING (bucket_id = 'profile_images');
DROP POLICY IF EXISTS "Auth Upload Profiles" ON storage.objects;
CREATE POLICY "Auth Upload Profiles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile_images' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Update Profiles" ON storage.objects;
CREATE POLICY "Auth Update Profiles" ON storage.objects FOR UPDATE USING (bucket_id = 'profile_images' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Public Content" ON storage.objects;
CREATE POLICY "Public Content" ON storage.objects FOR SELECT USING (bucket_id = 'content_images');
DROP POLICY IF EXISTS "Auth Upload Content" ON storage.objects;
CREATE POLICY "Auth Upload Content" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content_images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Upload Docs" ON storage.objects;
CREATE POLICY "Auth Upload Docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Select Docs" ON storage.objects;
CREATE POLICY "Auth Select Docs" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid() = owner);
`;