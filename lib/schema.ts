export const SQL_SCHEMA = `-- REPARARE EROARE 42703: Redenumire coloane is_active -> active
DO $$
BEGIN
    -- Verificăm și reparăm tabelul announcements
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_active') THEN
        ALTER TABLE announcements RENAME COLUMN is_active TO active;
    END IF;

    -- Verificăm și reparăm tabelul events
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_active') THEN
        ALTER TABLE events RENAME COLUMN is_active TO active;
    END IF;
END $$;

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (Users)
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
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'super_admin'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Announcements Table
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

-- 4. Create Events Table
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

-- 5. Create User Documents Table
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_name TEXT,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT, -- 'image' or 'pdf'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('profile_images', 'profile_images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content_images', 'content_images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING;

-- 7. Row Level Security (RLS) Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Announcements viewable by everyone" ON announcements;
CREATE POLICY "Announcements viewable by everyone" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert announcements" ON announcements;
CREATE POLICY "Admins can insert announcements" ON announcements FOR INSERT WITH CHECK ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')) );

DROP POLICY IF EXISTS "Admins can update announcements" ON announcements;
CREATE POLICY "Admins can update announcements" ON announcements FOR UPDATE USING ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')) );

DROP POLICY IF EXISTS "Admins can delete announcements" ON announcements;
CREATE POLICY "Admins can delete announcements" ON announcements FOR DELETE USING ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')) );

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events viewable by everyone" ON events;
CREATE POLICY "Events viewable by everyone" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert events" ON events;
CREATE POLICY "Admins can insert events" ON events FOR INSERT WITH CHECK ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')) );

DROP POLICY IF EXISTS "Admins can update events" ON events;
CREATE POLICY "Admins can update events" ON events FOR UPDATE USING ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')) );

DROP POLICY IF EXISTS "Admins can delete events" ON events;
CREATE POLICY "Admins can delete events" ON events FOR DELETE USING ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')) );

-- User Documents
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own docs" ON user_documents;
CREATE POLICY "Users view own docs" ON user_documents FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all docs" ON user_documents;
CREATE POLICY "Admins view all docs" ON user_documents FOR SELECT USING ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')) );

DROP POLICY IF EXISTS "Users insert own docs" ON user_documents;
CREATE POLICY "Users insert own docs" ON user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage Policies
-- Profile Images
DROP POLICY IF EXISTS "Profile Images Public" ON storage.objects;
CREATE POLICY "Profile Images Public" ON storage.objects FOR SELECT USING (bucket_id = 'profile_images');

DROP POLICY IF EXISTS "Profile Images Upload" ON storage.objects;
CREATE POLICY "Profile Images Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile_images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Profile Images Update" ON storage.objects;
CREATE POLICY "Profile Images Update" ON storage.objects FOR UPDATE USING (bucket_id = 'profile_images' AND auth.uid() = owner);

-- Content Images (Announcements/Events)
DROP POLICY IF EXISTS "Content Images Public" ON storage.objects;
CREATE POLICY "Content Images Public" ON storage.objects FOR SELECT USING (bucket_id = 'content_images');

DROP POLICY IF EXISTS "Content Images Upload" ON storage.objects;
CREATE POLICY "Content Images Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content_images' AND auth.role() = 'authenticated');

-- Documents (Private)
DROP POLICY IF EXISTS "Documents Upload" ON storage.objects;
CREATE POLICY "Documents Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Documents Select Own" ON storage.objects;
CREATE POLICY "Documents Select Own" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid() = owner);
`;