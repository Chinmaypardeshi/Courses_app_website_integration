import 'study_course.dart';
import 'study_lesson.dart';
import 'study_subject.dart';

/// The complete catalogue used by the current Study screens.
class StudyCatalogue {
  const StudyCatalogue({
    required this.subjects,
    required this.courses,
    required this.lessons,
  });

  final List<StudySubject> subjects;
  final List<StudyCourse> courses;
  final List<StudyLesson> lessons;
}

