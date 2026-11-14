import '../../domain/models/study_course.dart';
import '../../domain/models/study_catalogue.dart';
import '../../domain/models/study_lesson.dart';
import '../../domain/models/study_subject.dart';
import '../../domain/repositories/study_repository.dart';

/// Deterministic seed content used until study content is served remotely.
class LocalStudyRepository implements StudyRepository {
  final Set<String> _completedLessonIds = <String>{};

  @override
  Future<StudyCatalogue> loadCatalogue() async => const StudyCatalogue(
    subjects: _subjects,
    courses: _courses,
    lessons: _lessons,
  );

  @override
  Future<Set<String>> loadCompletedLessonIds() async =>
      Set<String>.of(_completedLessonIds);

  @override
  Future<void> setLessonComplete(String lessonId, bool isComplete) async {
    if (isComplete) {
      _completedLessonIds.add(lessonId);
    } else {
      _completedLessonIds.remove(lessonId);
    }
  }

  static const _subjects = <StudySubject>[
    StudySubject(
      id: 'polity',
      title: 'Indian Polity',
      description: 'Constitution and governance.',
    ),
    StudySubject(
      id: 'history',
      title: 'Indian History',
      description: 'India through the ages.',
    ),
    StudySubject(
      id: 'geography',
      title: 'Geography',
      description: 'Physical and human geography.',
    ),
    StudySubject(
      id: 'economy',
      title: 'Economy',
      description: 'Core economic concepts.',
    ),
    StudySubject(
      id: 'environment',
      title: 'Environment',
      description: 'Ecology and conservation.',
    ),
    StudySubject(
      id: 'current-affairs',
      title: 'Current Affairs',
      description: 'Issues in the news.',
    ),
    StudySubject(
      id: 'csat',
      title: 'CSAT',
      description: 'Aptitude and reasoning practice.',
    ),
  ];

  static const _courses = <StudyCourse>[
    StudyCourse(
      id: 'polity-foundations',
      subjectId: 'polity',
      title: 'Constitutional Foundations',
      description: 'Understand the Constitution, its values, and institutions.',
    ),
    StudyCourse(
      id: 'history-modern',
      subjectId: 'history',
      title: 'Modern India',
      description: 'Key developments in India’s freedom struggle.',
    ),
    StudyCourse(
      id: 'geography-india',
      subjectId: 'geography',
      title: 'Indian Geography',
      description: 'Landforms, climate, and resources of India.',
    ),
    StudyCourse(
      id: 'economy-basics',
      subjectId: 'economy',
      title: 'Economic Basics',
      description: 'Build a foundation for economic analysis.',
    ),
    StudyCourse(
      id: 'environment-ecology',
      subjectId: 'environment',
      title: 'Ecology Essentials',
      description: 'Learn ecosystems, biodiversity, and conservation.',
    ),
    StudyCourse(
      id: 'current-affairs-method',
      subjectId: 'current-affairs',
      title: 'Current Affairs Method',
      description: 'A practical framework for connecting news to the syllabus.',
    ),
    StudyCourse(
      id: 'csat-reasoning',
      subjectId: 'csat',
      title: 'Reasoning Fundamentals',
      description: 'Strengthen your analytical and problem-solving skills.',
    ),
  ];

  static const _lessons = <StudyLesson>[
    StudyLesson(
      id: 'polity-preamble',
      courseId: 'polity-foundations',
      title: 'The Preamble',
      content: 'The Preamble states the ideals of justice, liberty, equality, and fraternity that guide the Constitution. Read it as a lens for understanding constitutional provisions and public institutions.',
    ),
    StudyLesson(
      id: 'polity-features',
      courseId: 'polity-foundations',
      title: 'Key Features of the Constitution',
      content: 'India has a written Constitution, parliamentary government, federal features, an independent judiciary, and universal adult franchise. Connect each feature with how it works in practice.',
    ),
    StudyLesson(
      id: 'history-revolt',
      courseId: 'history-modern',
      title: 'The Revolt of 1857',
      content: 'The Revolt of 1857 brought together diverse grievances against Company rule. Study its causes, major centres, leadership, limitations, and long-term consequences.',
    ),
    StudyLesson(
      id: 'history-nationalism',
      courseId: 'history-modern',
      title: 'Rise of Nationalism',
      content: 'Indian nationalism grew through political associations, economic critique of colonialism, and mass movements. Place important organisations and ideas on a clear timeline.',
    ),
    StudyLesson(
      id: 'geography-relief',
      courseId: 'geography-india',
      title: 'Physiographic Divisions',
      content: 'The Himalayas, Northern Plains, Peninsular Plateau, coastal plains, islands, and desert form India’s major physiographic divisions. Link relief with rivers, climate, and settlement.',
    ),
    StudyLesson(
      id: 'geography-monsoon',
      courseId: 'geography-india',
      title: 'Indian Monsoon',
      content: 'The monsoon is shaped by differential heating, pressure systems, winds, and topography. Understand both the onset and retreat phases and their economic importance.',
    ),
    StudyLesson(
      id: 'economy-gdp',
      courseId: 'economy-basics',
      title: 'National Income',
      content: 'GDP measures the value of final goods and services produced within a country. Learn the difference between nominal and real GDP, and why per-capita measures matter.',
    ),
    StudyLesson(
      id: 'economy-inflation',
      courseId: 'economy-basics',
      title: 'Inflation',
      content: 'Inflation is a sustained rise in the general price level. Relate its causes and effects to monetary policy, household budgets, and economic growth.',
    ),
    StudyLesson(
      id: 'environment-ecosystem',
      courseId: 'environment-ecology',
      title: 'Ecosystems',
      content: 'An ecosystem includes living organisms and their physical environment. Energy flows through food chains while nutrients cycle through the system.',
    ),
    StudyLesson(
      id: 'environment-biodiversity',
      courseId: 'environment-ecology',
      title: 'Biodiversity Conservation',
      content: 'Biodiversity supports ecosystem stability and human well-being. Learn in-situ and ex-situ conservation along with the role of protected areas.',
    ),
    StudyLesson(
      id: 'current-syllabus',
      courseId: 'current-affairs-method',
      title: 'Read News Through the Syllabus',
      content: 'Map every significant issue to a syllabus topic before making notes. Focus on causes, stakeholders, institutions, impacts, and balanced solutions.',
    ),
    StudyLesson(
      id: 'current-notes',
      courseId: 'current-affairs-method',
      title: 'Make Revision-ready Notes',
      content: 'Keep notes short, structured, and linked to static topics. Use headings, data points, examples, and one balanced conclusion for each issue.',
    ),
    StudyLesson(
      id: 'csat-logic',
      courseId: 'csat-reasoning',
      title: 'Logical Reasoning',
      content: 'Break a reasoning question into statements, conditions, and conclusions. Eliminate options methodically instead of relying on intuition.',
    ),
    StudyLesson(
      id: 'csat-data',
      courseId: 'csat-reasoning',
      title: 'Data Interpretation',
      content: 'Start with what the question asks, then identify only the required values in the table or chart. Estimate when exact calculation is unnecessary.',
    ),
  ];
}
