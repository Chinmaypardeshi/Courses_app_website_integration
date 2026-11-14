-- ==============================================================================
-- 🏛️ UPSC EDTECH PLATFORM - COMPLETE SUPABASE CLOUD SQL SCHEMA & SEED DATA
-- ==============================================================================
-- Instructions for Supabase Cloud:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Go to "SQL Editor" in the left sidebar
-- 3. Click "New query", paste the entire contents of this file, and click "Run"
-- 4. All 20 tables will be created and visible under the "Table Editor"
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  phone VARCHAR(50),
  avatar TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE SET NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'UPSC CSE',
  faculty VARCHAR(255) DEFAULT 'Senior UPSC Faculty',
  language VARCHAR(100) DEFAULT 'Hinglish',
  poster TEXT,
  hours VARCHAR(50) DEFAULT '120 Hours',
  lectures VARCHAR(50) DEFAULT '50 Lectures',
  validity VARCHAR(50) DEFAULT '1 Year',
  price NUMERIC(10, 2) DEFAULT 0,
  original_price NUMERIC(10, 2) DEFAULT 0,
  discount VARCHAR(50) DEFAULT '0% OFF',
  access_tier VARCHAR(50) DEFAULT 'free',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

-- 4. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
  slug VARCHAR(150) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url TEXT,
  duration VARCHAR(50) DEFAULT '45 mins',
  access_tier VARCHAR(50) DEFAULT 'free',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (course_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id);

-- 5. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

-- 6. Practice Tests Table
CREATE TABLE IF NOT EXISTS public.practice_tests (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE SET NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50) DEFAULT 'medium',
  duration_minutes INTEGER DEFAULT 60,
  total_marks INTEGER DEFAULT 100,
  is_published BOOLEAN DEFAULT TRUE,
  access_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Test Questions Table
CREATE TABLE IF NOT EXISTS public.test_questions (
  id SERIAL PRIMARY KEY,
  practice_test_id INTEGER REFERENCES public.practice_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  explanation TEXT,
  marks INTEGER DEFAULT 2,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (practice_test_id, sort_order)
);

-- 8. Test Options Table
CREATE TABLE IF NOT EXISTS public.test_options (
  id SERIAL PRIMARY KEY,
  test_question_id INTEGER REFERENCES public.test_questions(id) ON DELETE CASCADE,
  option_key VARCHAR(10) NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (test_question_id, option_key)
);

-- 9. Test Attempts Table
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  practice_test_id INTEGER REFERENCES public.practice_tests(id) ON DELETE CASCADE,
  score NUMERIC(6, 2) DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. User Answers Table
CREATE TABLE IF NOT EXISTS public.user_answers (
  id SERIAL PRIMARY KEY,
  test_attempt_id INTEGER REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  test_question_id INTEGER REFERENCES public.test_questions(id) ON DELETE CASCADE,
  selected_option_key VARCHAR(10),
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Current Affairs Table
CREATE TABLE IF NOT EXISTS public.current_affairs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'National',
  summary TEXT,
  content TEXT,
  source VARCHAR(100) DEFAULT 'The Hindu',
  url TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_current_affairs_cat ON public.current_affairs(category);
CREATE INDEX IF NOT EXISTS idx_current_affairs_date ON public.current_affairs(published_at DESC);

-- 12. Study Materials Table
CREATE TABLE IF NOT EXISTS public.study_materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'General Studies',
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) DEFAULT 'PDF',
  file_size VARCHAR(50) DEFAULT '5 MB',
  access_tier VARCHAR(50) DEFAULT 'free',
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_inr NUMERIC(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. User Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_sub ON public.user_subscriptions(user_id, status);

-- 15. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_id VARCHAR(100),
  signature VARCHAR(255),
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  course_id VARCHAR(100),
  course_name VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);

-- 16. Mains Submissions Table
CREATE TABLE IF NOT EXISTS public.mains_submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  question TEXT NOT NULL,
  student_answer TEXT NOT NULL,
  score NUMERIC(4, 1) DEFAULT 0,
  feedback TEXT,
  strengths TEXT,
  improvements TEXT,
  model_answer TEXT,
  evaluated_by VARCHAR(100) DEFAULT 'pending',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mains_sub_status ON public.mains_submissions(status);

-- 17. Student Reminders Table
CREATE TABLE IF NOT EXISTS public.student_reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  time VARCHAR(50) NOT NULL,
  date VARCHAR(50) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Live Class Messages Table
CREATE TABLE IF NOT EXISTS public.live_class_messages (
  id SERIAL PRIMARY KEY,
  class_id VARCHAR(100) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) DEFAULT 'student',
  message TEXT NOT NULL,
  is_doubt BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_live_class ON public.live_class_messages(class_id);

-- 19. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  course_id VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INTEGER DEFAULT 5,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON public.reviews(course_id);

-- 20. CMS Content Table
CREATE TABLE IF NOT EXISTS public.cms_content (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL CORE DATA & SEEDS (Admin, Student, Subjects, Courses, Tests)
-- ==============================================================================

-- 1. Default Admin & Student Accounts
INSERT INTO public.users (full_name, email, password_hash, role, is_active)
VALUES
  ('UPSC Platform Admin', 'admin@upscplatform.com', '$2a$10$w6K1NqWvP/LgJ5.5Oq9yC.KvZlqVqP4wzNq8x3Q2R1S0t9u8v7w6y', 'admin', TRUE),
  ('Rahul Sharma (UPSC Aspirant)', 'student@upscplatform.com', '$2a$10$7Z2aA0B1c2d3E4f5G6h7I8j9k0L1m2N3o4P5q6R7s8T9u0v1w2x3y', 'student', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 2. Subjects
INSERT INTO public.subjects (slug, name, description)
VALUES
  ('polity', 'Indian Polity & Governance', 'Constitution, public policy, governance, and rights issues.'),
  ('history', 'Indian & World History', 'Ancient, Medieval, Modern India and freedom struggle.'),
  ('economy', 'Indian Economy & Development', 'Macroeconomics, planning, banking, budget, and economic survey.'),
  ('geography', 'Geography & Environment', 'Physical, human, economic geography and ecology & climate change.'),
  ('science-tech', 'Science & Technology', 'Space, defence, biotechnology, AI, and IT developments.'),
  ('ethics', 'Ethics, Integrity & Aptitude', 'Moral philosophy, case studies, and administrative ethics.')
ON CONFLICT (slug) DO NOTHING;

-- 3. Courses
INSERT INTO public.courses (subject_id, slug, title, description, category, faculty, language, poster, hours, lectures, validity, price, original_price, discount, access_tier, sort_order)
VALUES
  (2, 'gs1-masterclass', 'GS Paper 1: History, Art & Geography Complete Masterclass 2027', 'Comprehensive coverage of Ancient, Medieval, Modern Indian History, Art & Culture, and Physical & Human Geography.', 'UPSC CSE', 'Foundation Course Faculty 2027', 'Hinglish', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', '140 Hours', '60 Lectures', '1 Year', 9999, 15000, '33% OFF', 'premium', 1),
  (1, 'gs2-polity-ir', 'GS Paper 2: Indian Polity, Governance & International Relations', 'Covers the Indian Constitution, executive, legislative, judicial checks, statutory bodies, governance reforms, welfare schemes, and bilateral relations.', 'UPSC CSE', 'Target CSE Mentorship Panel', 'Hinglish', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', '120 Hours', '50 Lectures', '1 Year', 7999, 12000, '33% OFF', 'free', 2),
  (3, 'gs3-economy-environment', 'GS Paper 3: Indian Economy, Environment & Science-Tech Special', 'In-depth analysis of Macroeconomic indicators, Union Budget, Economic Survey, Biodiversity conservation, COP summits, and AI applications.', 'UPSC CSE', 'Senior UPSC Ex-Servants Panel', 'Hinglish', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80', '130 Hours', '55 Lectures', '1 Year', 8999, 14000, '35% OFF', 'premium', 3),
  (1, 'upsc-foundation-full', 'UPSC CSE 2027 Complete Foundation Batch (Prelims + Mains Integrated)', 'Zero-to-hero 2-year integrated course covering Prelims GS + CSAT, Mains GS 1 to 4, Essay mastery, and one-on-one personal mentorship.', 'UPSC CSE', 'Director & Senior Faculty Board', 'Bilingual (Eng + Hin)', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80', '650 Hours', '280 Lectures', '2 Years', 24999, 45000, '44% OFF', 'premium', 4)
ON CONFLICT (slug) DO NOTHING;

-- 4. Subscription Plans
INSERT INTO public.subscription_plans (code, name, description, price_inr, duration_days, features)
VALUES
  ('free-tier', 'Aspiria Free Explorer', 'Access to foundational study notes, daily news analysis, and introductory practice mocks.', 0, 365, '["Daily Current Affairs Feed", "Foundational Polity & History Syllabus", "5 Free Mock Tests", "Community Doubts Forum"]'::jsonb),
  ('prelims-pro', 'Prelims Booster & Test Series Pro', '30+ Full Length Mocks, AI Performance Analytics, detailed explanations, and NCERT fast-track modules.', 4999, 180, '["30 Full-length Prelims Mocks", "AI Speed & Weak-Area Diagnostic", "All Downloadable Notes & Mind Maps", "All High-Yield Video Lectures", "Priority Doubt Resolution"]'::jsonb),
  ('complete-foundation', 'Comprehensive UPSC CSE Prelims + Mains + AI Mentorship', 'Everything included: Live Classes, Unlimited Mains Answer AI Evaluation, 1-on-1 Mentor guidance, and complete optional modules.', 19999, 365, '["Complete Prelims + Mains Syllabus Access", "Unlimited AI Mains Answer Evaluations", "Live Interactive Faculty Sessions", "Personalized Study Planner", "Interview Guidance Programme (IGP)"]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 5. CMS Content Default
INSERT INTO public.cms_content (key, content)
VALUES
  ('home', '{"heroHeading": "India’s #1 AI-Powered Platform for UPSC Civil Services Preparation", "heroSubheading": "Learn from top civil servants and master Prelims, Mains answer writing, and current affairs with personalized 24/7 AI Mentorship.", "bannerNotice": "Admissions Open: UPSC CSE 2027 Comprehensive Foundation Batch (Prelims + Mains Integrated)", "stats": {"enrolledStudents": "50,000+", "interviewSelections": "620+", "questionsBank": "25,000+", "liveLecturesHours": "3,000+"}}'::jsonb)
ON CONFLICT (key) DO NOTHING;
