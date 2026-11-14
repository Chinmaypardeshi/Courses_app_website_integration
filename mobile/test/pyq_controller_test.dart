import 'package:aspiria/features/pyq/data/repositories/local_pyq_repository.dart';
import 'package:aspiria/features/pyq/presentation/controllers/pyq_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('filters the local question bank by subject, year, and category', () {
    final controller = PyqController(LocalPyqRepository());

    controller.selectSubject('Environment');
    expect(controller.filteredQuestions, hasLength(1));

    controller.selectSubject(null);
    controller.selectYear(2021);
    expect(controller.filteredQuestions, hasLength(2));

    controller.selectExamCategory('CSAT');
    expect(controller.filteredQuestions.single.subject, 'CSAT');

    controller.selectSubject('Indian Polity');
    expect(controller.filteredQuestions, isEmpty);
  });

  test('tracks selected and submitted answers for the current session', () {
    final controller = PyqController(LocalPyqRepository());
    const questionId = 'pyq-polity-remedies';

    expect(controller.submitAnswer(questionId), isFalse);
    controller.selectAnswer(questionId: questionId, optionId: 'a');

    expect(controller.selectedOptionFor(questionId), 'a');
    expect(controller.submitAnswer(questionId), isTrue);
    expect(controller.isSubmitted(questionId), isTrue);
    expect(controller.isCorrect(questionId), isTrue);
    expect(controller.attemptedQuestionCount, 1);

    controller.selectAnswer(questionId: questionId, optionId: 'b');
    expect(controller.selectedOptionFor(questionId), 'a');
  });
}
