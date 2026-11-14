import '../models/study_catalogue.dart';

/// Study catalogue and learner completion-state contract.
abstract class StudyRepository {
  Future<StudyCatalogue> loadCatalogue();

  Future<Set<String>> loadCompletedLessonIds();

  Future<void> setLessonComplete(String lessonId, bool isComplete);
}

/// A safe, user-facing failure from a study data source.
class StudyRepositoryException implements Exception {
  const StudyRepositoryException(this.message);

  final String message;
}
