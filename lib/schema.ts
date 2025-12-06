
export const SQL_SCHEMA = `-- SCRIPT COMPLET DE REPARARE SI INITIALIZARE
-- Ruleaza acest script in Supabase SQL Editor

-- 1. REPARARE STRUCTURA (Daca e cazul)
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'content') THEN
        ALTER TABLE announcements ALTER COLUMN content DROP NOT NULL;
    END IF;
    -- Migrare continut vechi daca exista
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'content') THEN
       UPDATE announcements SET description = content WHERE description IS NULL;
    END IF;
    -- Redenumire coloane active
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_active') THEN
        ALTER TABLE announcements RENAME COLUMN is_active TO active;
    END IF;
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_active') THEN
        ALTER TABLE events RENAME COLUMN is_active TO active;
    END IF;
END $$;

-- 2. ENABLE UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. PROFILES TABLE & TRIGGER (FIX INREGISTRARE)
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

-- Functie Trigger FOARTE IMPORTANTA pentru creare automata profil
-- Foloseste SECURITY DEFINER pentru a rula cu drepturi de admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stergere trigger vechi si recreare
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Asigurare permisiuni pentru Trigger
GRANT ALL ON public.profiles TO postgres, service_role;

-- 4. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info', -- info, warning, critical
  country TEXT, -- null pt global
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CONTENT TABLES
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  image_url TEXT,
  date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_name TEXT,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('profile_images', 'profile_images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content_images', 'content_images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;

-- 7. POLICIES (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Resetare politici pentru a evita erorile de duplicare
DROP POLICY IF EXISTS "Public profiles" ON profiles;
DROP POLICY IF EXISTS "Users update own" ON profiles;
DROP POLICY IF EXISTS "Users insert own" ON profiles;

CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Alerts
DROP POLICY IF EXISTS "Public read alerts" ON alerts;
CREATE POLICY "Public read alerts" ON alerts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage alerts" ON alerts;
CREATE POLICY "Admin manage alerts" ON alerts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));

-- Content
DROP POLICY IF EXISTS "Public read content" ON announcements;
CREATE POLICY "Public read content" ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage announcements" ON announcements;
CREATE POLICY "Admin manage announcements" ON announcements FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));

DROP POLICY IF EXISTS "Public read events" ON events;
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage events" ON events;
CREATE POLICY "Admin manage events" ON events FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));

-- Documents
DROP POLICY IF EXISTS "Users see own docs" ON user_documents;
CREATE POLICY "Users see own docs" ON user_documents FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
DROP POLICY IF EXISTS "Users insert docs" ON user_documents;
CREATE POLICY "Users insert docs" ON user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage Policies (Resetare)
DROP POLICY IF EXISTS "Public View" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;

CREATE POLICY "Public View" ON storage.objects FOR SELECT USING (bucket_id IN ('profile_images', 'content_images', 'documents'));
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
`;
