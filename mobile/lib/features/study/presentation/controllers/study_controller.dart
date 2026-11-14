import 'package:flutter/foundation.dart';

import '../../domain/models/study_catalogue.dart';
import '../../domain/models/study_course.dart';
import '../../domain/models/study_lesson.dart';
import '../../domain/models/study_subject.dart';
import '../../domain/repositories/study_repository.dart';

/// Holds the current learner's catalogue and persisted completion state.
class StudyController extends ChangeNotifier {
  StudyController(this._repository) {
    loadCatalogue();
  }

  final StudyRepository _repository;
  final Set<String> _completedLessonIds = <String>{};
  List<StudySubject> _subjects = const [];
  List<StudyCourse> _courses = const [];
  List<StudyLesson> _lessons = const [];
  var _isLoading = true;
  String? _errorMessage;
  String? _progressErrorMessage;
  final Set<String> _updatingLessonIds = <String>{};
  var _loadGeneration = 0;

  List<StudySubject> get subjects => _subjects;
  List<StudyCourse> get courses => _courses;
  List<StudyLesson> get lessons => _lessons;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get progressErrorMessage => _progressErrorMessage;
  int get completedLessonCount => _completedLessonIds.length;
  double get overallProgress => _progressFor(lessons);

  Future<void> loadCatalogue() async {
    final loadGeneration = ++_loadGeneration;
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    try {
      final results = await Future.wait<Object>([
        _repository.loadCatalogue(),
        _repository.loadCompletedLessonIds(),
      ]);
      final catalogue = results[0] as StudyCatalogue;
      final completedLessonIds = results[1] as Set<String>;
      if (loadGeneration != _loadGeneration) return;
      _subjects = catalogue.subjects;
      _courses = catalogue.courses;
      _lessons = catalogue.lessons;
      _completedLessonIds
        ..clear()
        ..addAll(
          completedLessonIds.where((lessonId) => lessonById(lessonId) != null),
        );
    } catch (_) {
      if (loadGeneration != _loadGeneration) return;
      _errorMessage =
          'Unable to load study content. Check your connection and try again.';
    } finally {
      if (loadGeneration != _loadGeneration) return;
      _isLoading = false;
      notifyListeners();
    }
  }

  List<StudyCourse> coursesForSubject(String subjectId) => courses
      .where((course) => course.subjectId == subjectId)
      .toList(growable: false);

  List<StudyLesson> lessonsForCourse(String courseId) => lessons
      .where((lesson) => lesson.courseId == courseId)
      .toList(growable: false);

  StudyCourse? courseById(String id) {
    for (final course in courses) {
      if (course.id == id) return course;
    }
    return null;
  }

  StudyLesson? lessonById(String id) {
    for (final lesson in lessons) {
      if (lesson.id == id) return lesson;
    }
    return null;
  }

  bool isLessonComplete(String lessonId) =>
      _completedLessonIds.contains(lessonId);

  bool isSavingLesson(String lessonId) => _updatingLessonIds.contains(lessonId);

  Future<bool> setLessonComplete(String lessonId, bool isComplete) async {
    if (lessonById(lessonId) == null || isSavingLesson(lessonId)) return false;
    if (isLessonComplete(lessonId) == isComplete) return true;

    _updatingLessonIds.add(lessonId);
    _progressErrorMessage = null;
    notifyListeners();
    try {
      await _repository.setLessonComplete(lessonId, isComplete);
      if (isComplete) {
        _completedLessonIds.add(lessonId);
      } else {
        _completedLessonIds.remove(lessonId);
      }
      return true;
    } catch (error) {
      _progressErrorMessage = error is StudyRepositoryException
          ? error.message
          : 'Unable to save study progress. Please try again.';
      return false;
    } finally {
      _updatingLessonIds.remove(lessonId);
      notifyListeners();
    }
  }

  void clearCompletionState() {
    _loadGeneration++;
    _completedLessonIds.clear();
    _progressErrorMessage = null;
    notifyListeners();
  }

  double courseProgress(String courseId) =>
      _progressFor(lessonsForCourse(courseId));

  double subjectProgress(String subjectId) => _progressFor(
    coursesForSubject(subjectId)
        .expand((course) => lessonsForCourse(course.id))
        .toList(growable: false),
  );

  double _progressFor(List<StudyLesson> items) {
    if (items.isEmpty) return 0;
    return items.where((lesson) => isLessonComplete(lesson.id)).length /
        items.length;
  }
}
