import 'package:flutter/foundation.dart';

import '../../domain/models/pyq_question.dart';
import '../../domain/repositories/pyq_repository.dart';

/// Manages local PYQ filters and session-only single-question attempts.
class PyqController extends ChangeNotifier {
  PyqController(this._repository);

  final PyqRepository _repository;
  final Map<String, String> _selectedOptionIds = <String, String>{};
  final Set<String> _submittedQuestionIds = <String>{};
  String? _selectedSubject;
  int? _selectedYear;
  String? _selectedExamCategory;

  List<PyqQuestion> get questions => _repository.questions;
  String? get selectedSubject => _selectedSubject;
  int? get selectedYear => _selectedYear;
  String? get selectedExamCategory => _selectedExamCategory;
  int get attemptedQuestionCount => _submittedQuestionIds.length;

  List<String> get subjects => questions
      .map((question) => question.subject)
      .toSet()
      .toList(growable: false);

  List<int> get years =>
      questions.map((question) => question.year).toSet().toList(growable: false)
        ..sort((first, second) => second.compareTo(first));

  List<String> get examCategories => questions
      .map((question) => question.examCategory)
      .toSet()
      .toList(growable: false);

  List<PyqQuestion> get filteredQuestions => questions
      .where(
        (question) =>
            (_selectedSubject == null ||
                question.subject == _selectedSubject) &&
            (_selectedYear == null || question.year == _selectedYear) &&
            (_selectedExamCategory == null ||
                question.examCategory == _selectedExamCategory),
      )
      .toList(growable: false);

  PyqQuestion? questionById(String id) {
    for (final question in questions) {
      if (question.id == id) return question;
    }
    return null;
  }

  String? selectedOptionFor(String questionId) =>
      _selectedOptionIds[questionId];
  bool isSubmitted(String questionId) =>
      _submittedQuestionIds.contains(questionId);
  bool isCorrect(String questionId) {
    final question = questionById(questionId);
    return question != null &&
        isSubmitted(questionId) &&
        selectedOptionFor(questionId) == question.correctOptionId;
  }

  void selectSubject(String? subject) {
    if (subject != null && !subjects.contains(subject)) return;
    if (_selectedSubject == subject) return;
    _selectedSubject = subject;
    notifyListeners();
  }

  void selectYear(int? year) {
    if (year != null && !years.contains(year)) return;
    if (_selectedYear == year) return;
    _selectedYear = year;
    notifyListeners();
  }

  void selectExamCategory(String? category) {
    if (category != null && !examCategories.contains(category)) return;
    if (_selectedExamCategory == category) return;
    _selectedExamCategory = category;
    notifyListeners();
  }

  void selectAnswer({required String questionId, required String optionId}) {
    final question = questionById(questionId);
    if (question == null ||
        isSubmitted(questionId) ||
        !question.options.any((option) => option.id == optionId)) {
      return;
    }
    if (selectedOptionFor(questionId) == optionId) return;
    _selectedOptionIds[questionId] = optionId;
    notifyListeners();
  }

  bool submitAnswer(String questionId) {
    if (questionById(questionId) == null ||
        selectedOptionFor(questionId) == null ||
        isSubmitted(questionId)) {
      return false;
    }
    _submittedQuestionIds.add(questionId);
    notifyListeners();
    return true;
  }
}
