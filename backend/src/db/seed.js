const path = require('path');
const { pool, targetSchema } = require('./pool');

async function seed() {
  const client = await pool.connect();
  try {
    console.log(`🌱 Starting enterprise database seeding on schema '${targetSchema}'...`);
    if (targetSchema && targetSchema !== 'public') {
      await client.query(`SET search_path TO "${targetSchema}", public;`);
    } else {
      await client.query('SET search_path TO public;');
    }
    await client.query('BEGIN');

    // 1. Subjects
    const subjects = [
      { slug: 'polity', name: 'Indian Polity & Governance', description: 'Constitution, public policy, governance, and rights issues.' },
      { slug: 'history', name: 'Indian & World History', description: 'Ancient, Medieval, Modern India and freedom struggle.' },
      { slug: 'economy', name: 'Indian Economy & Development', description: 'Macroeconomics, planning, banking, budget, and economic survey.' },
      { slug: 'geography', name: 'Geography & Environment', description: 'Physical, human, economic geography and ecology & climate change.' },
      { slug: 'science-tech', name: 'Science & Technology', description: 'Space, defence, biotechnology, AI, and IT developments.' },
      { slug: 'ethics', name: 'Ethics, Integrity & Aptitude', description: 'Moral philosophy, case studies, and administrative ethics.' },
    ];

    const subjectMap = {};
    for (const sub of subjects) {
      const res = await client.query(`
        INSERT INTO subjects (slug, name, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
        RETURNING id, slug
      `, [sub.slug, sub.name, sub.description]);
      subjectMap[sub.slug] = res.rows[0].id;
    }
    console.log(`✅ Seeded ${subjects.length} subjects.`);

    // 2. Courses
    const courses = [
      {
        slug: 'gs1-masterclass',
        subject_slug: 'history',
        title: 'GS Paper 1: History, Art & Geography Complete Masterclass 2027',
        category: 'UPSC CSE',
        faculty: 'Foundation Course Faculty 2027',
        language: 'Hinglish',
        poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        hours: '140 Hours',
        lectures: '60 Lectures',
        validity: '1 Year',
        price: 9999,
        original_price: 15000,
        discount: '33% OFF',
        access_tier: 'premium',
        description: 'Comprehensive coverage of Ancient, Medieval, Modern Indian History, Art & Culture, and Physical & Human Geography with Mains answer writing modules.',
        sort_order: 1
      },
      {
        slug: 'gs2-polity-ir',
        subject_slug: 'polity',
        title: 'GS Paper 2: Indian Polity, Governance & International Relations',
        category: 'UPSC CSE',
        faculty: 'Target CSE Mentorship Panel',
        language: 'Hinglish',
        poster: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        hours: '120 Hours',
        lectures: '50 Lectures',
        validity: '1 Year',
        price: 7999,
        original_price: 12000,
        discount: '33% OFF',
        access_tier: 'free',
        description: 'Covers the Indian Constitution, executive, legislative, judicial checks, statutory bodies, governance reforms, welfare schemes, and bilateral relations.',
        sort_order: 2
      },
      {
        slug: 'gs3-economy-environment',
        subject_slug: 'economy',
        title: 'GS Paper 3: Indian Economy, Environment & Science-Tech Special',
        category: 'UPSC CSE',
        faculty: 'Senior UPSC Ex-Servants Panel',
        language: 'Hinglish',
        poster: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
        hours: '130 Hours',
        lectures: '55 Lectures',
        validity: '1 Year',
        price: 8999,
        original_price: 14000,
        discount: '35% OFF',
        access_tier: 'premium',
        description: 'In-depth analysis of Macroeconomic indicators, Union Budget 2026-27, Economic Survey, Biodiversity conservation, COP summits, and AI applications.',
        sort_order: 3
      },
      {
        slug: 'upsc-foundation-full',
        subject_slug: 'polity',
        title: 'UPSC CSE 2027 Complete Foundation Batch (Prelims + Mains Integrated)',
        category: 'UPSC CSE',
        faculty: 'Director & Senior Faculty Board',
        language: 'Bilingual (Eng + Hin)',
        poster: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
        hours: '650 Hours',
        lectures: '280 Lectures',
        validity: '2 Years',
        price: 24999,
        original_price: 45000,
        discount: '44% OFF',
        access_tier: 'premium',
        description: 'Zero-to-hero 2-year integrated course covering Prelims GS + CSAT, Mains GS 1 to 4, Essay mastery, and one-on-one personal mentorship.',
        sort_order: 4
      },
      {
        slug: 'ssc-cgl-maths',
        subject_slug: 'science-tech',
        title: 'SSC CGL Tier 1 + Tier 2 Quantitative Aptitude & Reasoning Mastery',
        category: 'SSC CGL',
        faculty: 'Quant & Aptitude Specialists',
        language: 'Hinglish',
        poster: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        hours: '95 Hours',
        lectures: '40 Lectures',
        validity: '6 Months',
        price: 2999,
        original_price: 5999,
        discount: '50% OFF',
        access_tier: 'free',
        description: 'Complete shortcut tricks, arithmetic, advanced mathematics, logical deduction, and live speed tests designed for 99+ percentile aspirants.',
        sort_order: 5
      }
    ];

    const courseMap = {};
    for (const c of courses) {
      const subjectId = subjectMap[c.subject_slug] || null;
      const res = await client.query(`
        INSERT INTO courses (subject_id, slug, title, description, category, faculty, language, poster, hours, lectures, validity, price, original_price, discount, access_tier, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          access_tier = EXCLUDED.access_tier,
          poster = EXCLUDED.poster
        RETURNING id, slug
      `, [subjectId, c.slug, c.title, c.description, c.category, c.faculty, c.language, c.poster, c.hours, c.lectures, c.validity, c.price, c.original_price, c.discount, c.access_tier, c.sort_order]);
      courseMap[c.slug] = res.rows[0].id;
    }
    console.log(`✅ Seeded ${courses.length} courses.`);

    // 3. Lessons for Courses
    const lessons = [
      // Lessons for gs2-polity-ir
      {
        course_slug: 'gs2-polity-ir',
        slug: 'preamble-and-salient-features',
        title: 'Preamble and Salient Features of the Indian Constitution',
        content: `# Preamble & Constitutional Foundations\n\nThe Preamble embodies the philosophy and values that form the bedrock of the Constitution of India.\n\n### Key Keywords:\n- **Sovereign**: Supreme and independent authority without external control.\n- **Socialist**: Democratic socialism pursuing elimination of poverty, ignorance, and inequality.\n- **Secular**: Equal respect and state protection for all religions (Articles 25-28).\n- **Democratic**: Representative parliamentary democracy under universal adult franchise.\n- **Republic**: Head of State is elected (President of India), not hereditary.\n\n### Landmark Judgments:\n1. *Berubari Union Case (1960)*: Preamble not considered part of Constitution.\n2. *Kesavananda Bharati (1973)*: Overruled Berubari; affirmed Preamble is an integral part and subject to Basic Structure doctrine.`,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '45 mins',
        access_tier: 'free',
        sort_order: 1
      },
      {
        course_slug: 'gs2-polity-ir',
        slug: 'fundamental-rights-art-12-35',
        title: 'Fundamental Rights (Articles 12 to 35) & Judicial Review',
        content: `# Fundamental Rights & Doctrine of Basic Structure\n\nPart III of the Indian Constitution guarantees Fundamental Rights. Key doctrines include:\n- **Doctrine of Severability (Art 13(1))**\n- **Doctrine of Eclipse**\n- **Right to Equality (Art 14 - 18)**: Prohibits arbitrariness (*E.P. Royappa* test).\n- **Right to Freedom (Art 19 - 22)**: Protection of freedoms subject to reasonable restrictions (*Art 19(2)*).\n- **Right to Life and Personal Liberty (Art 21)**: Expanded via *Maneka Gandhi (1978)* to include right to clean environment, privacy (*Puttaswamy 2017*), and dignified livelihood.`,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '60 mins',
        access_tier: 'free',
        sort_order: 2
      },
      {
        course_slug: 'gs2-polity-ir',
        slug: 'directive-principles-and-duties',
        title: 'Directive Principles of State Policy & Fundamental Duties',
        content: `# DPSPs (Part IV) & Fundamental Duties (Part IVA)\n\n### Harmonious Construction\nIn *Minerva Mills (1980)*, the Supreme Court held that the Indian Constitution is founded on the bedrock of the balance between Fundamental Rights and DPSPs.\n\n### Classification of DPSPs:\n1. Socialistic Principles (Arts 38, 39, 39A, 41, 42, 43)\n2. Gandhian Principles (Arts 40, 43, 43B, 46, 47, 48)\n3. Liberal-Intellectual (Arts 44, 45, 48A, 49, 50, 51)`,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '50 mins',
        access_tier: 'premium',
        sort_order: 3
      },
      // Lessons for gs1-masterclass
      {
        course_slug: 'gs1-masterclass',
        slug: 'revolt-of-1857-origins-impact',
        title: 'The Great Revolt of 1857: Causes, Key Centers & Impact',
        content: `# The Revolt of 1857: Watershed Moment\n\n### Multi-dimensional Causes:\n- **Economic**: Ruin of handicrafts, drain of wealth, heavy land revenue assessments (Permanent, Ryotwari, Mahalwari).\n- **Political**: Doctrine of Lapse by Lord Dalhousie (Satara, Jhansi, Nagpur annexed).\n- **Military**: Discrimination in pay, general service enlistment act.\n- **Immediate**: Introduction of Enfield rifle cartridges.\n\n### Consequences:\n- Government of India Act 1858 transferred power from East India Company to the British Crown.\n- Queen Victoria's Proclamation promising non-interference in religious beliefs.`,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: '55 mins',
        access_tier: 'premium',
        sort_order: 1
      },
      {
        course_slug: 'gs1-masterclass',
        slug: 'plate-tectonics-geomorphology',
        title: 'Plate Tectonics & Continental Drift in Physical Geography',
        content: `# Plate Tectonics & Earth Dynamics\n\n### Key Concepts:\n- **Wegener Continental Drift Hypothesis (1912)**\n- **Sea Floor Spreading (Harry Hess 1960)**\n- **Plate Boundaries**:\n  1. Convergent (Destructive - Himalayas, Mariana Trench)\n  2. Divergent (Constructive - Mid-Atlantic Ridge)\n  3. Transform (Conservative - San Andreas Fault)\n\n### Volcanism & Seismic Belts:\nPacific Ring of Fire accounts for >75% of worldwide active volcanism and earthquakes.`,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: '65 mins',
        access_tier: 'premium',
        sort_order: 2
      }
    ];

    for (const l of lessons) {
      const courseId = courseMap[l.course_slug];
      if (!courseId) continue;
      await client.query(`
        INSERT INTO lessons (course_id, slug, title, content, video_url, duration, access_tier, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (course_id, slug) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          video_url = EXCLUDED.video_url,
          access_tier = EXCLUDED.access_tier
      `, [courseId, l.slug, l.title, l.content, l.video_url, l.duration, l.access_tier, l.sort_order]);
    }
    console.log(`✅ Seeded ${lessons.length} lessons with notes and video streams.`);

    // 4. Practice Tests & Questions
    const tests = [
      {
        slug: 'upsc-prelims-full-mock-1',
        subject_slug: 'polity',
        title: 'UPSC CSE Prelims Mock Test 2027: Indian Polity & Modern India',
        description: 'Comprehensive 100-mark test covering Constitution, statutory bodies, freedom struggle, and recent supreme court verdicts.',
        difficulty: 'medium',
        duration_minutes: 60,
        total_marks: 100,
        is_published: true,
        access_tier: 'free',
        questions: [
          {
            text: 'Which of the following bodies is NOT provided for in the Constitution of India?',
            explanation: 'NITI Aayog was established via an executive resolution of the Union Cabinet on Jan 1, 2015, replacing the Planning Commission. It is neither constitutional nor statutory.',
            marks: 2,
            options: [
              { key: 'A', text: 'Election Commission of India', is_correct: false },
              { key: 'B', text: 'Finance Commission', is_correct: false },
              { key: 'C', text: 'NITI Aayog', is_correct: true },
              { key: 'D', text: 'Union Public Service Commission', is_correct: false },
            ]
          },
          {
            text: 'Consider the following statements regarding the Governor of a State:\n1. The Governor holds office during the pleasure of the President.\n2. The Constitution specifies the grounds on which a Governor may be removed.\nWhich of the statements given above is/are correct?',
            explanation: 'Article 156(1) states the Governor holds office during the pleasure of the President. The Constitution does NOT specify any grounds or procedure for removal.',
            marks: 2,
            options: [
              { key: 'A', text: '1 only', is_correct: true },
              { key: 'B', text: '2 only', is_correct: false },
              { key: 'C', text: 'Both 1 and 2', is_correct: false },
              { key: 'D', text: 'Neither 1 nor 2', is_correct: false },
            ]
          },
          {
            text: 'Under Article 21 of the Indian Constitution, the Right to Privacy was declared a Fundamental Right in which landmark judgment?',
            explanation: 'In K.S. Puttaswamy v. Union of India (2017), a 9-judge constitutional bench unanimously held privacy is an intrinsic part of the Right to Life and Personal Liberty.',
            marks: 2,
            options: [
              { key: 'A', text: 'Navtej Singh Johar Case', is_correct: false },
              { key: 'B', text: 'Justice K.S. Puttaswamy (Retd.) v. Union of India', is_correct: true },
              { key: 'C', text: 'Shreya Singhal v. Union of India', is_correct: false },
              { key: 'D', text: 'Shayara Bano Case', is_correct: false },
            ]
          },
          {
            text: 'Which session of the Indian National Congress passed the historic Poorna Swaraj resolution?',
            explanation: 'In December 1929 at Lahore under the presidency of Jawaharlal Nehru, INC declared Poorna Swaraj (Complete Independence) as its goal and unfurled the tricolour on Jan 26, 1930.',
            marks: 2,
            options: [
              { key: 'A', text: 'Calcutta Session, 1928', is_correct: false },
              { key: 'B', text: 'Lahore Session, 1929', is_correct: true },
              { key: 'C', text: 'Karachi Session, 1931', is_correct: false },
              { key: 'D', text: 'Belgaum Session, 1924', is_correct: false },
            ]
          }
        ]
      },
      {
        slug: 'economy-budget-survey-mock',
        subject_slug: 'economy',
        title: 'Indian Economy & Union Budget 2026-27 High Yield Mock',
        description: 'Targeted mock test on inflation trends, fiscal deficit targets, capital expenditure, and RBI monetary policy transmission.',
        difficulty: 'advanced',
        duration_minutes: 45,
        total_marks: 50,
        is_published: true,
        access_tier: 'premium',
        questions: [
          {
            text: 'What is the primary indicator used by the Reserve Bank of India (RBI) to anchor inflation under the Flexible Inflation Targeting framework?',
            explanation: 'Since 2014 following Urjit Patel committee recommendations, the RBI uses Consumer Price Index (Combined) CPI-C inflation as its headline anchor targeted at 4% with a tolerance band of +/- 2%.',
            marks: 2,
            options: [
              { key: 'A', text: 'Wholesale Price Index (WPI)', is_correct: false },
              { key: 'B', text: 'Consumer Price Index (Combined)', is_correct: true },
              { key: 'C', text: 'Index of Industrial Production (IIP)', is_correct: false },
              { key: 'D', text: 'GDP Deflator', is_correct: false },
            ]
          }
        ]
      }
    ];

    for (const t of tests) {
      const subjectId = subjectMap[t.subject_slug] || null;
      const testRes = await client.query(`
        INSERT INTO practice_tests (subject_id, slug, title, description, difficulty, duration_minutes, total_marks, is_published, access_tier)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description
        RETURNING id
      `, [subjectId, t.slug, t.title, t.description, t.difficulty, t.duration_minutes, t.total_marks, t.is_published, t.access_tier]);
      const testId = testRes.rows[0].id;

      for (let i = 0; i < t.questions.length; i++) {
        const q = t.questions[i];
        const qRes = await client.query(`
          INSERT INTO test_questions (practice_test_id, question_text, explanation, marks, sort_order)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (practice_test_id, sort_order) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation
          RETURNING id
        `, [testId, q.text, q.explanation, q.marks, i + 1]);
        const questionId = qRes.rows[0].id;

        for (const opt of q.options) {
          await client.query(`
            INSERT INTO test_options (test_question_id, option_key, option_text, is_correct)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (test_question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text, is_correct = EXCLUDED.is_correct
          `, [questionId, opt.key, opt.text, opt.is_correct]);
        }
      }
    }
    console.log(`✅ Seeded ${tests.length} practice tests with full questions and options.`);

    // 5. Current Affairs Articles
    const articles = [
      {
        title: 'Supreme Court on Sub-Classification of Scheduled Castes and Scheduled Tribes',
        category: 'Polity & Governance',
        summary: 'A 7-judge Constitution Bench of the Supreme Court has permitted states to create sub-classifications within SC/ST categories to provide preferential treatment to more disadvantaged sub-castes.',
        content: `### Context\nIn a landmark 6:1 verdict, the Supreme Court ruled that state governments have the constitutional power under Articles 15(4) and 16(4) to make sub-classifications within SC and ST categories for reservations in jobs and education.\n\n### Key Principles Laid Down:\n1. **Sub-classification is not sub-division**: It does not tinker with the Presidential list under Article 341.\n2. **Empirical Data Requirement**: States must prove backwardness using verifiable empirical data.\n3. **Creamy Layer Consideration**: Several judges noted that identifying creamy layer within SC/ST is necessary to ensure benefits reach the most downtrodden.`,
        source: 'The Hindu',
        url: 'https://www.thehindu.com/news/national/',
        image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        published_at: new Date(Date.now() - 3600000 * 2)
      },
      {
        title: 'India Semiconductor Mission: New Fab Approvals & Strategic Impact',
        category: 'Science & Economy',
        summary: 'Cabinet approves multiple new semiconductor fabrication and ATMP units under the $10B India Semiconductor Mission, aiming to localize microchip production for automotive and AI hardware.',
        content: `### Strategic Semiconductor Independence\nIndia is positioning itself as a trusted global semiconductor hub under the ISM.\n\n### Pillars of Growth:\n- Silicon Fab establishments in Gujarat and Assam.\n- Compound semiconductors and packaging (OSAT/ATMP) facilities.\n- Design Linked Incentive (DLI) scheme empowering domestic startups with EDA tools.`,
        source: 'PIB India',
        url: 'https://pib.gov.in',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        published_at: new Date(Date.now() - 3600000 * 12)
      },
      {
        title: 'G20 Sustainable Finance & Global Biofuel Alliance Progress Report',
        category: 'Environment & International Relations',
        summary: 'Global Biofuels Alliance reaches 24 member nations, setting new technical standards for ethanol blending and sustainable aviation fuel (SAF).',
        content: `### Global Biofuel Alliance (GBA)\nLaunched on the sidelines of the New Delhi G20 Summit, GBA accelerates global adoption of biofuels.\n\n### Strategic Highlights:\n- Standardized blending benchmarks for E20.\n- Carbon credit methodology for biomass supply chains.\n- North-South technical transfer for second-generation (2G) cellulosic ethanol plants.`,
        source: 'Indian Express',
        url: 'https://indianexpress.com',
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        published_at: new Date(Date.now() - 3600000 * 24)
      }
    ];

    for (const art of articles) {
      await client.query(`
        INSERT INTO current_affairs (title, category, summary, content, source, url, image_url, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [art.title, art.category, art.summary, art.content, art.source, art.url, art.image_url, art.published_at]);
    }
    console.log(`✅ Seeded ${articles.length} verified current affairs articles.`);

    // 6. Study Materials (PDFs / Notes)
    const materials = [
      {
        title: 'Modern Indian History: Comprehensive Mind Maps & Chronology (1757-1947)',
        description: 'Complete high-yield visual mind maps covering all British governor-generals, tribal/peasant movements, and socio-religious reforms.',
        category: 'History',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'PDF',
        file_size: '14.2 MB',
        access_tier: 'free'
      },
      {
        title: 'Indian Polity Key Supreme Court Judgments Compendium (1950 - 2026)',
        description: 'Summary of 150+ milestone verdicts including Kesavananda, SR Bommai, Puttaswamy, NJAC, and recent Constitutional Bench decisions.',
        category: 'Polity',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'PDF',
        file_size: '8.7 MB',
        access_tier: 'free'
      },
      {
        title: 'Economic Survey & Union Budget 2026-27 Summary for Prelims & Mains',
        description: 'Official sector-wise breakdown, key graphs, macroeconomic projections, and expected questions for UPSC CSE 2027.',
        category: 'Economy',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'PDF',
        file_size: '18.5 MB',
        access_tier: 'premium'
      }
    ];

    for (const m of materials) {
      await client.query(`
        INSERT INTO study_materials (title, description, category, file_url, file_type, file_size, access_tier)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [m.title, m.description, m.category, m.file_url, m.file_type, m.file_size, m.access_tier]);
    }
    console.log(`✅ Seeded ${materials.length} downloadable study notes.`);

    // 7. Subscription Plans
    const plans = [
      {
        code: 'free-tier',
        name: 'Aspiria Free Explorer',
        description: 'Access to foundational study notes, daily news analysis, and introductory practice mocks.',
        price_inr: 0,
        duration_days: 365,
        features: JSON.stringify(['Daily Current Affairs Feed', 'Foundational Polity & History Syllabus', '5 Free Mock Tests', 'Community Doubts Forum'])
      },
      {
        code: 'prelims-pro',
        name: 'Prelims Booster & Test Series Pro',
        description: '30+ Full Length Mocks, AI Performance Analytics, detailed explanations, and NCERT fast-track modules.',
        price_inr: 4999,
        duration_days: 180,
        features: JSON.stringify(['30 Full-length Prelims Mocks', 'AI Speed & Weak-Area Diagnostic', 'All Downloadable Notes & Mind Maps', 'All High-Yield Video Lectures', 'Priority Doubt Resolution'])
      },
      {
        code: 'complete-foundation',
        name: 'Comprehensive UPSC CSE Prelims + Mains + AI Mentorship',
        description: 'Everything included: Live Classes, Unlimited Mains Answer AI Evaluation, 1-on-1 Mentor guidance, and complete optional subject modules.',
        price_inr: 19999,
        duration_days: 365,
        features: JSON.stringify(['Complete Prelims + Mains Syllabus Access', 'Unlimited AI Mains Answer Evaluations', 'Live Interactive Faculty Sessions', 'Personalized Study Planner', 'Interview Guidance Programme (IGP)'])
      }
    ];

    for (const p of plans) {
      await client.query(`
        INSERT INTO subscription_plans (code, name, description, price_inr, duration_days, features)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, price_inr = EXCLUDED.price_inr, features = EXCLUDED.features
      `, [p.code, p.name, p.description, p.price_inr, p.duration_days, p.features]);
    }
    console.log(`✅ Seeded ${plans.length} subscription plans.`);

    // 8. Sample Mains Submissions for Review
    const studentUser = await client.query('SELECT id, full_name, email FROM users WHERE role = $1 LIMIT 1', ['student']);
    if (studentUser.rowCount > 0) {
      const student = studentUser.rows[0];
      await client.query(`
        INSERT INTO mains_submissions (user_id, user_name, user_email, question, student_answer, score, feedback, strengths, improvements, status, evaluated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        student.id,
        student.full_name,
        student.email,
        'Examine the scope of Article 21 in light of recent judicial pronouncements. Has judicial activism broadened the concept of living with dignity? (150 words, 10 marks)',
        'Article 21 guarantees that no person shall be deprived of life or personal liberty except according to procedure established by law. In early cases like AK Gopalan, the Court took a literal approach. However, in Maneka Gandhi (1978), the court held procedure must be just, fair and reasonable. Through judicial activism, the right to dignity has been expanded to include right to privacy (Puttaswamy), right to clean air, right against manual scavenging, and emergency medical aid.',
        8.0,
        'Excellent answer with appropriate case law citations. You structured the progression from Gopalan to Maneka Gandhi and Puttaswamy very effectively.',
        'Clear chronological flow, relevant constitutional articles, and accurate landmark judgments cited.',
        'Could include a brief mention of the balance between judicial activism and separation of powers.',
        'evaluated',
        'ai'
      ]);

      // Seed Student Reminders
      await client.query(`
        INSERT INTO student_reminders (user_id, title, time, date, is_completed)
        VALUES 
          ($1, 'Polity: Revise President & Governor Powers', '07:00 AM', 'Daily', false),
          ($1, 'Daily The Hindu Editorial & Notes', '09:30 AM', 'Daily', true),
          ($1, 'Attempt GS Paper 1 Prelims Mock 2027', '02:00 PM', 'Sundays', false)
      `, [student.id]);
    }

    // 9. Course Reviews
    await client.query(`
      INSERT INTO reviews (course_id, user_name, rating, comment)
      VALUES
        ('gs2-polity-ir', 'Ananya Verma (AIR 84 CSE)', 5, 'The best conceptual clarity on Articles 14-32 and Basic Structure doctrine. The diagrams made revision effortless.'),
        ('gs1-masterclass', 'Vikramaditya Rao', 5, 'History used to be boring until this masterclass. The timeline flowcharts connect the events perfectly.'),
        ('upsc-foundation-full', 'Pooja Hegde', 5, 'Truly comprehensive. The integrated approach to Prelims and Mains saves 6 months of wandering.')
    `);

    // 10. CMS Content
    const homeCms = {
      heroHeading: 'India’s #1 AI-Powered Platform for UPSC Civil Services Preparation',
      heroSubheading: 'Learn from top civil servants and master Prelims, Mains answer writing, and current affairs with personalized 24/7 AI Mentorship.',
      bannerNotice: 'Admissions Open: UPSC CSE 2027 Comprehensive Foundation Batch (Prelims + Mains Integrated)',
      stats: {
        enrolledStudents: '50,000+',
        interviewSelections: '620+',
        questionsBank: '25,000+',
        liveLecturesHours: '3,000+'
      }
    };

    await client.query(`
      INSERT INTO cms_content (key, content)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
    `, ['home', JSON.stringify(homeCms)]);

    await client.query('COMMIT');
    console.log('🎉 Enterprise UPSC platform seed data inserted successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seed };
