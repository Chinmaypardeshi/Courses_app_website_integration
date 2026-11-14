import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/tests/domain/models/test_option.dart';
import 'package:aspiria/features/tests/presentation/controllers/test_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Reviews an in-memory test result with the correct answer and explanation.
class TestResultPage extends StatelessWidget {
  const TestResultPage({
    super.key,
    required this.testController,
    required this.testId,
  });

  final TestController testController;
  final String testId;

  @override
  Widget build(BuildContext context) {
    final test = testController.testById(testId);
    final attempt = testController.latestAttemptFor(testId);
    final questions = testController.questionsForTest(testId);
    if (test == null || attempt == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Result not found.')),
      );
    }

    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Test result')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.medium),
        children: [
          Text(
            test.title,
            style: textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: AppSpacing.large),
          Container(
            padding: const EdgeInsets.all(AppSpacing.large),
            decoration: BoxDecoration(
              color: colors.primaryContainer,
              borderRadius: AppRadius.medium,
            ),
            child: Column(
              children: [
                Text(
                  '${attempt.score}/${attempt.totalQuestions}',
                  style: textTheme.displaySmall?.copyWith(
                    color: colors.onPrimaryContainer,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  '${attempt.percentage.round()}% score',
                  style: textTheme.titleMedium?.copyWith(
                    color: colors.onPrimaryContainer,
                  ),
                ),
                const SizedBox(height: AppSpacing.medium),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _ResultCount(label: 'Correct', count: attempt.correctCount),
                    _ResultCount(label: 'Incorrect', count: attempt.incorrectCount),
                    _ResultCount(label: 'Unanswered', count: attempt.unansweredCount),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xLarge),
          Text(
            'Review answers',
            style: textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: AppSpacing.small),
          for (final question in questions) ...[
            _QuestionReview(
              question: question.prompt,
              selectedOption: _optionById(
                question.options,
                attempt.selectedOptionIds[question.id],
              ),
              correctOption: _optionById(question.options, question.correctOptionId),
              explanation: question.explanation,
            ),
            const SizedBox(height: AppSpacing.medium),
          ],
          const SizedBox(height: AppSpacing.small),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                testController.startAttempt(test.id);
                context.goNamed(
                  AppRoute.testAttempt,
                  pathParameters: {'testId': test.id},
                );
              },
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Retry test'),
            ),
          ),
        ],
      ),
    );
  }

  TestOption? _optionById(List<TestOption> options, String? id) {
    for (final option in options) {
      if (option.id == id) return option;
    }
    return null;
  }
}

class _ResultCount extends StatelessWidget {
  const _ResultCount({required this.label, required this.count});

  final String label;
  final int count;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          '$count',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
              ),
        ),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}

class _QuestionReview extends StatelessWidget {
  const _QuestionReview({
    required this.question,
    required this.selectedOption,
    required this.correctOption,
    required this.explanation,
  });

  final String question;
  final TestOption? selectedOption;
  final TestOption? correctOption;
  final String explanation;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final isCorrect = selectedOption?.id == correctOption?.id;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(question, style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: AppSpacing.medium),
            Text(
              'Your answer: ${selectedOption?.label ?? 'Not answered'}',
              style: TextStyle(color: isCorrect ? colors.primary : colors.error),
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text('Correct answer: ${correctOption?.label ?? ''}'),
            const SizedBox(height: AppSpacing.small),
            Text(
              explanation,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
