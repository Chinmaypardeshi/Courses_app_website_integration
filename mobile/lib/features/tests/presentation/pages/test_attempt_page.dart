import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/tests/presentation/controllers/test_controller.dart';
import 'package:aspiria/features/tests/presentation/widgets/answer_option_tile.dart';
import 'package:aspiria/features/tests/presentation/widgets/question_progress_indicator.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// One-question-at-a-time local practice-test experience.
class TestAttemptPage extends StatelessWidget {
  const TestAttemptPage({
    super.key,
    required this.testController,
    required this.testId,
  });

  final TestController testController;
  final String testId;

  @override
  Widget build(BuildContext context) {
    final test = testController.testById(testId);
    final questions = testController.questionsForTest(testId);
    if (test == null || questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Test not found.')),
      );
    }

    return AnimatedBuilder(
      animation: testController,
      builder: (context, _) {
        final questionIndex = testController.currentQuestionIndex;
        final question = questions[questionIndex];
        final isLastQuestion = questionIndex == questions.length - 1;
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        return Scaffold(
          appBar: AppBar(title: Text(test.title)),
          body: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  QuestionProgressIndicator(
                    currentQuestion: questionIndex + 1,
                    totalQuestions: questions.length,
                  ),
                  const SizedBox(height: AppSpacing.xLarge),
                  Text(
                    question.prompt,
                    style: textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.large),
                  Expanded(
                    child: ListView(
                      children: [
                        for (final option in question.options)
                          AnswerOptionTile(
                            option: option,
                            selectedOptionId: testController.selectedOptionFor(
                              question.id,
                            ),
                            onSelected: (optionId) => testController.selectAnswer(
                              questionId: question.id,
                              optionId: optionId,
                            ),
                          ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: questionIndex == 0
                              ? null
                              : () => testController.goToQuestion(
                                  questionIndex - 1,
                                ),
                          child: const Text('Previous'),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.medium),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => isLastQuestion
                              ? _confirmSubmission(context)
                              : testController.goToQuestion(questionIndex + 1),
                          child: Text(isLastQuestion ? 'Submit test' : 'Next'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.small),
                  Text(
                    '${testController.answeredQuestionCount} of ${questions.length} answered',
                    style: textTheme.bodySmall?.copyWith(
                      color: colors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _confirmSubmission(BuildContext context) async {
    final shouldSubmit = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Submit test?'),
        content: const Text(
          'You can review unanswered questions before submitting.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Keep reviewing'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Submit'),
          ),
        ],
      ),
    );
    if (shouldSubmit != true || !context.mounted) return;
    final attempt = testController.submitAttempt();
    if (attempt != null && context.mounted) {
      context.goNamed(
        AppRoute.testResult,
        pathParameters: {'testId': testId},
      );
    }
  }
}
