import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/tests/presentation/controllers/test_controller.dart';
import 'package:aspiria/features/tests/presentation/widgets/test_card.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// The local UPSC practice-test catalogue and latest session results.
class TestsPage extends StatelessWidget {
  const TestsPage({super.key, required this.testController});

  final TestController testController;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return SafeArea(
      child: AnimatedBuilder(
        animation: testController,
        builder: (context, _) => ListView(
          padding: const EdgeInsets.all(AppSpacing.medium),
          children: [
            Text(
              'Practice tests',
              style: textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              'Test your UPSC preparation with focused practice sets.',
              style: textTheme.bodyLarge?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppSpacing.xLarge),
            for (final test in testController.tests) ...[
              TestCard(
                test: test,
                questionCount: testController.questionsForTest(test.id).length,
                latestAttempt: testController.latestAttemptFor(test.id),
                onTap: () {
                  testController.startAttempt(test.id);
                  context.goNamed(
                    AppRoute.testAttempt,
                    pathParameters: {'testId': test.id},
                  );
                },
              ),
              const SizedBox(height: AppSpacing.medium),
            ],
          ],
        ),
      ),
    );
  }
}
