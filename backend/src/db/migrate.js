const { pool, targetSchema } = require('./pool');
const bcrypt = require('bcryptjs');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log(`🔄 Starting database schema migration on target schema '${targetSchema}'...`);
    if (targetSchema && targetSchema !== 'public') {
      await client.query(`CREATE SCHEMA IF NOT EXISTS "${targetSchema}";`);
      await client.query(`SET search_path TO "${targetSchema}", public;`);
    } else {
      await client.query('SET search_path TO public;');
    }
    await client.query('BEGIN');

    // 1. Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
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
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    // 2. Subjects
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Courses
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
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
      CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
    `);

    // 4. Lessons
    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
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
      CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
    `);

    // 5. Lesson Progress
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        completed_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (user_id, lesson_id)
      );
    `);

    // 6. Practice Tests
    await client.query(`
      CREATE TABLE IF NOT EXISTS practice_tests (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
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
    `);

    // 7. Test Questions
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_questions (
        id SERIAL PRIMARY KEY,
        practice_test_id INTEGER REFERENCES practice_tests(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        explanation TEXT,
        marks INTEGER DEFAULT 2,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (practice_test_id, sort_order)
      );
    `);

    // 8. Test Options
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_options (
        id SERIAL PRIMARY KEY,
        test_question_id INTEGER REFERENCES test_questions(id) ON DELETE CASCADE,
        option_key VARCHAR(10) NOT NULL,
        option_text TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (test_question_id, option_key)
      );
    `);

    // 9. Test Attempts
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        practice_test_id INTEGER REFERENCES practice_tests(id) ON DELETE CASCADE,
        score NUMERIC(6, 2) DEFAULT 0,
        total_questions INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        completed_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 10. User Answers
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_answers (
        id SERIAL PRIMARY KEY,
        test_attempt_id INTEGER REFERENCES test_attempts(id) ON DELETE CASCADE,
        test_question_id INTEGER REFERENCES test_questions(id) ON DELETE CASCADE,
        selected_option_key VARCHAR(10),
        is_correct BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 11. Current Affairs
    await client.query(`
      CREATE TABLE IF NOT EXISTS current_affairs (
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
      CREATE INDEX IF NOT EXISTS idx_current_affairs_cat ON current_affairs(category);
      CREATE INDEX IF NOT EXISTS idx_current_affairs_date ON current_affairs(published_at DESC);
    `);

    // 12. Study Materials
    await client.query(`
      CREATE TABLE IF NOT EXISTS study_materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'General Studies',
        subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50) DEFAULT 'PDF',
        file_size VARCHAR(50) DEFAULT '5 MB',
        access_tier VARCHAR(50) DEFAULT 'free',
        download_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 13. Subscription Plans
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
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
    `);

    // 14. User Subscriptions
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'active',
        starts_at TIMESTAMPTZ DEFAULT NOW(),
        ends_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_user_sub ON user_subscriptions(user_id, status);
    `);

    // 15. Orders
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
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
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
    `);

    // 16. Mains Submissions
    await client.query(`
      CREATE TABLE IF NOT EXISTS mains_submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
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
      CREATE INDEX IF NOT EXISTS idx_mains_sub_status ON mains_submissions(status);
    `);

    // 17. Student Reminders
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_reminders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        time VARCHAR(50) NOT NULL,
        date VARCHAR(50) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 18. Live Class Messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS live_class_messages (
        id SERIAL PRIMARY KEY,
        class_id VARCHAR(100) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_role VARCHAR(50) DEFAULT 'student',
        message TEXT NOT NULL,
        is_doubt BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_live_class ON live_class_messages(class_id);
    `);

    // 19. Reviews
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        course_id VARCHAR(100) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        user_name VARCHAR(255) NOT NULL,
        rating INTEGER DEFAULT 5,
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);
    `);

    // 20. CMS Content
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_content (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        content JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create default Admin User if not exists
    const adminEmail = 'admin@upscplatform.com';
    const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminCheck.rowCount === 0) {
      const hash = await bcrypt.hash('Admin@UPSC2026', 10);
      await client.query(`
        INSERT INTO users (full_name, email, password_hash, role, is_active)
        VALUES ($1, $2, $3, 'admin', TRUE)
      `, ['UPSC Platform Admin', adminEmail, hash]);
      console.log('✅ Default administrator account created: admin@upscplatform.com');
    }

    // Create demo student if not exists
    const demoEmail = 'student@upscplatform.com';
    const studentCheck = await client.query('SELECT id FROM users WHERE email = $1', [demoEmail]);
    if (studentCheck.rowCount === 0) {
      const hash = await bcrypt.hash('Student@2026', 10);
      await client.query(`
        INSERT INTO users (full_name, email, password_hash, role, is_active)
        VALUES ($1, $2, $3, 'student', TRUE)
      `, ['Rahul Sharma (UPSC Aspirant)', demoEmail, hash]);
      console.log('✅ Demo student account created: student@upscplatform.com');
    }

    await client.query('COMMIT');
    console.log(`🎉 Database migration completed successfully on '${targetSchema}' schema!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { migrate };
