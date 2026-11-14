import 'package:aspiria/features/tests/data/repositories/local_test_repository.dart';
import 'package:aspiria/features/tests/presentation/controllers/test_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('calculates submitted test results and resets a retry attempt', () {
    final controller = TestController(LocalTestRepository());

    controller.startAttempt('polity-basics');
    controller.selectAnswer(questionId: 'polity-1', optionId: 'a');
    controller.selectAnswer(questionId: 'polity-2', optionId: 'a');

    final attempt = controller.submitAttempt();

    expect(attempt, isNotNull);
    expect(attempt!.correctCount, 1);
    expect(attempt.incorrectCount, 1);
    expect(attempt.unansweredCount, 1);
    expect(attempt.percentage, closeTo(100 / 3, 0.001));
    expect(controller.latestAttemptFor('polity-basics'), same(attempt));

    controller.startAttempt('polity-basics');

    expect(controller.activeTestId, 'polity-basics');
    expect(controller.answeredQuestionCount, 0);
    expect(controller.currentQuestionIndex, 0);
  });
}
