import 'package:flutter/foundation.dart';

import '../../domain/models/practice_test.dart';
import '../../domain/models/test_attempt.dart';
import '../../domain/models/test_question.dart';
import '../../domain/repositories/test_repository.dart';

/// Manages a local, in-memory practice-test attempt and its latest results.
class TestController extends ChangeNotifier {
  TestController(this._repository);

  final TestRepository _repository;
  final Map<String, TestAttempt> _latestAttempts = <String, TestAttempt>{};
  final Map<String, String> _selectedOptionIds = <String, String>{};
  String? _activeTestId;
  var _currentQuestionIndex = 0;

  List<PracticeTest> get tests => _repository.tests;
  String? get activeTestId => _activeTestId;
  int get currentQuestionIndex => _currentQuestionIndex;

  PracticeTest? testById(String id) {
    for (final test in tests) {
      if (test.id == id) return test;
    }
    return null;
  }

  List<TestQuestion> questionsForTest(String testId) => _repository.questions
      .where((question) => question.testId == testId)
      .toList(growable: false);

  TestAttempt? latestAttemptFor(String testId) => _latestAttempts[testId];

  String? selectedOptionFor(String questionId) => _selectedOptionIds[questionId];

  int get answeredQuestionCount => _selectedOptionIds.length;

  void startAttempt(String testId) {
    if (testById(testId) == null) return;
    _activeTestId = testId;
    _currentQuestionIndex = 0;
    _selectedOptionIds.clear();
    notifyListeners();
  }

  void selectAnswer({
    required String questionId,
    required String optionId,
  }) {
    if (_activeTestId == null) return;
    final questions = questionsForTest(_activeTestId!);
    final question = questions.where((item) => item.id == questionId);
    if (question.isEmpty || !question.first.options.any((option) => option.id == optionId)) {
      return;
    }
    _selectedOptionIds[questionId] = optionId;
    notifyListeners();
  }

  void goToQuestion(int index) {
    final activeTestId = _activeTestId;
    if (activeTestId == null) return;
    final questionCount = questionsForTest(activeTestId).length;
    if (index < 0 || index >= questionCount || index == _currentQuestionIndex) {
      return;
    }
    _currentQuestionIndex = index;
    notifyListeners();
  }

  TestAttempt? submitAttempt() {
    final testId = _activeTestId;
    if (testId == null) return null;

    final questions = questionsForTest(testId);
    final selectedAnswers = Map<String, String>.unmodifiable(_selectedOptionIds);
    final correctCount = questions
        .where((question) => selectedAnswers[question.id] == question.correctOptionId)
        .length;
    final unansweredCount = questions
        .where((question) => !selectedAnswers.containsKey(question.id))
        .length;
    final attempt = TestAttempt(
      testId: testId,
      selectedOptionIds: selectedAnswers,
      correctCount: correctCount,
      incorrectCount: questions.length - correctCount - unansweredCount,
      unansweredCount: unansweredCount,
      totalQuestions: questions.length,
    );
    _latestAttempts[testId] = attempt;
    _activeTestId = null;
    _currentQuestionIndex = 0;
    _selectedOptionIds.clear();
    notifyListeners();
    return attempt;
  }
}
