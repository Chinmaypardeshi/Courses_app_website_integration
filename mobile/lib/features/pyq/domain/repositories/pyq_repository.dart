import '../models/pyq_question.dart';

/// Supplies the local student-side PYQ/question-bank catalogue.
abstract interface class PyqRepository {
  List<PyqQuestion> get questions;
}
