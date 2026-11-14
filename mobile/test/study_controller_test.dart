import 'package:aspiria/features/study/data/repositories/local_study_repository.dart';
import 'package:aspiria/features/study/domain/models/study_catalogue.dart';
import 'package:aspiria/features/study/domain/models/study_course.dart';
import 'package:aspiria/features/study/domain/models/study_lesson.dart';
import 'package:aspiria/features/study/domain/models/study_subject.dart';
import 'package:aspiria/features/study/domain/repositories/study_repository.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('calculates and updates local study progress', () async {
    final controller = StudyController(LocalStudyRepository());

    await controller.loadCatalogue();

    expect(controller.overallProgress, 0);
    expect(controller.courseProgress('polity-foundations'), 0);
    expect(controller.subjectProgress('polity'), 0);

    await controller.setLessonComplete('polity-preamble', true);

    expect(controller.isLessonComplete('polity-preamble'), isTrue);
    expect(controller.courseProgress('polity-foundations'), 0.5);
    expect(controller.subjectProgress('polity'), 0.5);
    expect(controller.overallProgress, 1 / 14);

    await controller.setLessonComplete('polity-preamble', false);

    expect(controller.overallProgress, 0);
  });

  test('hydrates completion state and retains it when updates succeed', () async {
    final repository = _ProgressStudyRepository(completedLessonIds: {'lesson-1'});
    final controller = StudyController(repository);

    await controller.loadCatalogue();

    expect(controller.isLessonComplete('lesson-1'), isTrue);
    expect(controller.courseProgress('course-1'), 0.5);

    await controller.setLessonComplete('lesson-2', true);

    expect(repository.updates, [('lesson-2', true)]);
    expect(controller.courseProgress('course-1'), 1);
  });

  test('does not alter completion state when persistence fails', () async {
    final controller = StudyController(_ProgressStudyRepository(failUpdates: true));

    await controller.loadCatalogue();
    final saved = await controller.setLessonComplete('lesson-1', true);

    expect(saved, isFalse);
    expect(controller.isLessonComplete('lesson-1'), isFalse);
    expect(controller.progressErrorMessage, isNotNull);
  });
}

class _ProgressStudyRepository implements StudyRepository {
  _ProgressStudyRepository({Set<String>? completedLessonIds, this.failUpdates = false})
    : _completedLessonIds = completedLessonIds ?? <String>{};

  final Set<String> _completedLessonIds;
  final bool failUpdates;
  final List<(String, bool)> updates = [];

  @override
  Future<StudyCatalogue> loadCatalogue() async => const StudyCatalogue(
    subjects: [StudySubject(id: 'subject-1', title: 'Subject', description: '')],
    courses: [
      StudyCourse(
        id: 'course-1',
        subjectId: 'subject-1',
        title: 'Course',
        description: '',
      ),
    ],
    lessons: [
      StudyLesson(id: 'lesson-1', courseId: 'course-1', title: 'One', content: ''),
      StudyLesson(id: 'lesson-2', courseId: 'course-1', title: 'Two', content: ''),
    ],
  );

  @override
  Future<Set<String>> loadCompletedLessonIds() async =>
      Set<String>.of(_completedLessonIds);

  @override
  Future<void> setLessonComplete(String lessonId, bool isComplete) async {
    if (failUpdates) throw Exception('Network unavailable');
    updates.add((lessonId, isComplete));
    if (isComplete) {
      _completedLessonIds.add(lessonId);
    } else {
      _completedLessonIds.remove(lessonId);
    }
  }
}
