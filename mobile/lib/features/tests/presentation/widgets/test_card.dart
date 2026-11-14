import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/tests/domain/models/practice_test.dart';
import 'package:aspiria/features/tests/domain/models/test_attempt.dart';
import 'package:flutter/material.dart';

/// Tappable overview of a locally available UPSC practice test.
class TestCard extends StatelessWidget {
  const TestCard({
    super.key,
    required this.test,
    required this.questionCount,
    required this.latestAttempt,
    required this.onTap,
  });

  final PracticeTest test;
  final int questionCount;
  final TestAttempt? latestAttempt;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.medium),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      test.title,
                      style: textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  Icon(Icons.arrow_forward_rounded, color: colors.primary),
                ],
              ),
              const SizedBox(height: AppSpacing.xSmall),
              Text(
                test.subject,
                style: textTheme.labelMedium?.copyWith(color: colors.primary),
              ),
              const SizedBox(height: AppSpacing.small),
              Text(
                test.description,
                style: textTheme.bodyMedium?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Wrap(
                spacing: AppSpacing.small,
                runSpacing: AppSpacing.small,
                children: [
                  Chip(label: Text('$questionCount questions')),
                  Chip(label: Text('${test.estimatedMinutes} min')),
                  Chip(label: Text(test.difficulty)),
                  if (latestAttempt != null)
                    Chip(label: Text('Latest score: ${latestAttempt!.score}/${latestAttempt!.totalQuestions}')),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
