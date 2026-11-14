import '../models/practice_test.dart';
import '../models/test_question.dart';

/// Read-only contract for a practice-test catalogue.
abstract class TestRepository {
  List<PracticeTest> get tests;
  List<TestQuestion> get questions;
}
