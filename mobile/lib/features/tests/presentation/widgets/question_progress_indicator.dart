import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:flutter/material.dart';

/// Shows the learner's current position in a practice test.
class QuestionProgressIndicator extends StatelessWidget {
  const QuestionProgressIndicator({
    super.key,
    required this.currentQuestion,
    required this.totalQuestions,
  });

  final int currentQuestion;
  final int totalQuestions;

  @override
  Widget build(BuildContext context) {
    final progress = totalQuestions == 0 ? 0.0 : currentQuestion / totalQuestions;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Question $currentQuestion of $totalQuestions',
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: AppSpacing.small),
        ClipRRect(
          borderRadius: AppRadius.pill,
          child: LinearProgressIndicator(value: progress, minHeight: 8),
        ),
      ],
    );
  }
}
