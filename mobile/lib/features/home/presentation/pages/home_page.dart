import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/current_affairs/presentation/controllers/current_affairs_controller.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:aspiria/features/study/presentation/widgets/study_course_card.dart';
import 'package:aspiria/features/tests/domain/models/practice_test.dart';
import 'package:aspiria/features/tests/domain/models/test_attempt.dart';
import 'package:aspiria/features/tests/presentation/controllers/test_controller.dart';

/// Temporary dashboard composition for the Phase 2 design foundation.
class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
    required this.studyController,
    required this.testController,
    required this.currentAffairsController,
  });

  final StudyController studyController;
  final TestController testController;
  final CurrentAffairsController currentAffairsController;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return AnimatedBuilder(
      animation: Listenable.merge([
        studyController,
        testController,
        currentAffairsController,
      ]),
      builder: (context, _) {
        final completedLessonCount = studyController.completedLessonCount;
        final lessonCount = studyController.lessons.length;
        final overallCompletion = (studyController.overallProgress * 100)
            .toStringAsFixed(0);
        final incompleteLessons = studyController.lessons
            .where((lesson) => !studyController.isLessonComplete(lesson.id))
            .toList(growable: false);
        final nextLesson = incompleteLessons.isEmpty
            ? null
            : incompleteLessons.first;
        final nextCourse = nextLesson == null
            ? null
            : studyController.courseById(nextLesson.courseId);

        return SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(AppSpacing.medium),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              'Aspiria',
                              style: textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(width: AppSpacing.small),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.green.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.green.withValues(alpha: 0.4),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: const BoxDecoration(
                                      color: Colors.green,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Cloud Live',
                                    style: textTheme.labelSmall?.copyWith(
                                      color: Colors.green.shade800,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 10,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.xSmall),
                        Text(
                          'UPSC CSE 2027 · Shared Web & Mobile Cloud',
                          style: textTheme.bodySmall?.copyWith(
                            color: colors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    tooltip: 'Notifications coming soon',
                    onPressed: () {},
                    icon: const Icon(Icons.notifications_none_rounded),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xLarge),
              Text(
                'Choose your focus',
                style: textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              SizedBox(
                height: 124,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _CategoryCard(
                      icon: Icons.account_balance_rounded,
                      label: 'UPSC CSE',
                      onTap: () => context.goNamed(AppRoute.study),
                    ),
                    _CategoryCard(
                      icon: Icons.gavel_rounded,
                      label: 'State PSC',
                      onTap: () => context.goNamed(AppRoute.study),
                    ),
                    _CategoryCard(
                      icon: Icons.menu_book_rounded,
                      label: 'SSC & Banking',
                      onTap: () => context.goNamed(AppRoute.study),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xLarge),
              Text(
                'Your progress',
                style: textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Card(
                color: colors.primaryContainer,
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.medium),
                  child: Row(
                    children: [
                      Icon(
                        Icons.insights_rounded,
                        color: colors.onPrimaryContainer,
                      ),
                      const SizedBox(width: AppSpacing.medium),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Completed lessons: '
                              '$completedLessonCount / $lessonCount',
                              style: textTheme.titleMedium?.copyWith(
                                color: colors.onPrimaryContainer,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: AppSpacing.xSmall),
                            Text(
                              'Overall completion: $overallCompletion%',
                              style: textTheme.bodyMedium?.copyWith(
                                color: colors.onPrimaryContainer,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xLarge),
              Text(
                'Continue learning',
                style: textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Card(
                clipBehavior: Clip.antiAlias,
                child: InkWell(
                  onTap: nextLesson == null || nextCourse == null
                      ? null
                      : () => context.goNamed(
                          AppRoute.studyLesson,
                          pathParameters: {
                            'courseId': nextCourse.id,
                            'lessonId': nextLesson.id,
                          },
                        ),
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.medium),
                    child: Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            borderRadius: AppRadius.small,
                            color: colors.primaryContainer,
                          ),
                          child: Icon(
                            Icons.play_lesson_rounded,
                            color: colors.onPrimaryContainer,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.medium),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                nextLesson == null
                                    ? 'All lessons completed'
                                    : nextLesson.title,
                                style: textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.xSmall),
                              Text(
                                nextLesson == null
                                    ? 'Great work. Your study catalogue is complete.'
                                    : nextCourse?.title ??
                                          'Continue with your next lesson.',
                                style: textTheme.bodySmall?.copyWith(
                                  color: colors.onSurfaceVariant,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_rounded),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xLarge),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Enrolled UPSC Batches',
                      style: textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.goNamed(AppRoute.study),
                    child: const Text('View all'),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.medium),
              if (studyController.courses.isEmpty)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.medium),
                    child: Row(
                      children: [
                        const Icon(Icons.sync_rounded, color: Colors.blue),
                        const SizedBox(width: AppSpacing.small),
                        Text(
                          'Syncing with UPSC cloud courses...',
                          style: textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                )
              else
                for (final course in studyController.courses.take(3)) ...[
                  StudyCourseCard(
                    course: course,
                    lessonCount: studyController
                        .lessonsForCourse(course.id)
                        .length,
                    progress: studyController.courseProgress(course.id),
                    onTap: () => context.goNamed(
                      AppRoute.studyCourse,
                      pathParameters: {'courseId': course.id},
                    ),
                  ),
                  const SizedBox(height: AppSpacing.medium),
                ],
              const SizedBox(height: AppSpacing.xLarge),
              _CurrentAffairsSection(
                currentAffairsController: currentAffairsController,
              ),
              const SizedBox(height: AppSpacing.xLarge),
              _TestPerformanceSection(testController: testController),
              const SizedBox(height: AppSpacing.xLarge),
              Text(
                'Quick actions',
                style: textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Wrap(
                spacing: AppSpacing.small,
                runSpacing: AppSpacing.small,
                children: [
                  _QuickAction(
                    icon: Icons.auto_awesome,
                    label: 'AI Mentor',
                    onPressed: () => context.goNamed(AppRoute.aiMentor),
                  ),
                  _QuickAction(
                    icon: Icons.quiz_outlined,
                    label: 'Practice',
                    onPressed: () => context.goNamed(AppRoute.tests),
                  ),
                  _QuickAction(
                    icon: Icons.calendar_today_outlined,
                    label: 'Plan study',
                    onPressed: () {},
                  ),
                  _QuickAction(
                    icon: Icons.bookmark_outline_rounded,
                    label: 'Bookmarks',
                    onPressed: () => context.goNamed(AppRoute.bookmarks),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

class _CurrentAffairsSection extends StatelessWidget {
  const _CurrentAffairsSection({required this.currentAffairsController});

  final CurrentAffairsController currentAffairsController;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final articles = currentAffairsController.todaysArticles;
    final firstArticle = articles.isEmpty ? null : articles.first;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Current Affairs',
                style: textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            TextButton(
              onPressed: () => context.goNamed(AppRoute.currentAffairs),
              child: const Text('View all'),
            ),
          ],
        ),
        Text(
          'Today’s sample notes for focused UPSC revision.',
          style: textTheme.bodyMedium?.copyWith(color: colors.onSurfaceVariant),
        ),
        const SizedBox(height: AppSpacing.medium),
        if (firstArticle != null)
          Card(
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: () => context.goNamed(
                AppRoute.currentAffairsArticle,
                pathParameters: {'articleId': firstArticle.id},
              ),
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.medium),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      firstArticle.category,
                      style: textTheme.labelLarge?.copyWith(
                        color: colors.primary,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xSmall),
                    Text(
                      firstArticle.title,
                      style: textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xSmall),
                    Text(
                      firstArticle.summary,
                      style: textTheme.bodySmall?.copyWith(
                        color: colors.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.medium),
                    Text(
                      '${firstArticle.readingTimeMinutes} min read',
                      style: textTheme.bodySmall?.copyWith(
                        color: colors.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _TestPerformanceSection extends StatelessWidget {
  const _TestPerformanceSection({required this.testController});

  final TestController testController;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final attempts = <_TestAttemptSummary>[];

    for (final test in testController.tests) {
      final attempt = testController.latestAttemptFor(test.id);
      if (attempt != null) {
        attempts.add(_TestAttemptSummary(test: test, attempt: attempt));
      }
    }

    if (attempts.isEmpty) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Test performance',
            style: textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: AppSpacing.medium),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'No practice tests attempted yet',
                    style: textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xSmall),
                  Text(
                    'Complete a practice test to see your current results.',
                    style: textTheme.bodyMedium?.copyWith(
                      color: colors.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.medium),
                  OutlinedButton.icon(
                    onPressed: () => context.goNamed(AppRoute.tests),
                    icon: const Icon(Icons.quiz_outlined),
                    label: const Text('Browse practice tests'),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    }

    final totalCorrect = attempts.fold<int>(
      0,
      (total, summary) => total + summary.attempt.correctCount,
    );
    final totalIncorrect = attempts.fold<int>(
      0,
      (total, summary) => total + summary.attempt.incorrectCount,
    );
    final totalQuestions = attempts.fold<int>(
      0,
      (total, summary) => total + summary.attempt.totalQuestions,
    );
    final averagePercentage =
        attempts.fold<double>(
          0,
          (total, summary) => total + summary.attempt.percentage,
        ) /
        attempts.length;
    final answeredCount = totalCorrect + totalIncorrect;
    final accuracy = answeredCount == 0
        ? null
        : (totalCorrect / answeredCount) * 100;
    final subjectPerformance = <String, _SubjectPerformance>{};

    for (final summary in attempts) {
      subjectPerformance
          .putIfAbsent(
            summary.test.subject,
            () => _SubjectPerformance(subject: summary.test.subject),
          )
          .add(summary.attempt);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Test performance',
          style: textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: AppSpacing.medium),
        Card(
          color: colors.secondaryContainer,
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.medium),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${attempts.length} tests attempted',
                  style: textTheme.titleMedium?.copyWith(
                    color: colors.onSecondaryContainer,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: AppSpacing.xSmall),
                Text(
                  'Current practice snapshot from the latest available attempt for each test.',
                  style: textTheme.bodySmall?.copyWith(
                    color: colors.onSecondaryContainer,
                  ),
                ),
                const SizedBox(height: AppSpacing.medium),
                Wrap(
                  spacing: AppSpacing.large,
                  runSpacing: AppSpacing.small,
                  children: [
                    _PerformanceMetric(
                      label: 'Average percentage',
                      value: '${averagePercentage.toStringAsFixed(0)}%',
                    ),
                    _PerformanceMetric(
                      label: 'Accuracy',
                      value: accuracy == null
                          ? 'No answers yet'
                          : '${accuracy.toStringAsFixed(0)}%',
                    ),
                    _PerformanceMetric(
                      label: 'Score',
                      value: '$totalCorrect / $totalQuestions',
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.medium),
        Text(
          'Subject snapshots',
          style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: AppSpacing.xSmall),
        Text(
          'Based only on available latest practice attempts.',
          style: textTheme.bodySmall?.copyWith(color: colors.onSurfaceVariant),
        ),
        const SizedBox(height: AppSpacing.small),
        Card(
          child: Column(
            children: [
              for (final performance in subjectPerformance.values)
                ListTile(
                  title: Text(performance.subject),
                  subtitle: Text(
                    '${performance.correctCount} / ${performance.totalQuestions} correct',
                  ),
                  trailing: Text(
                    '${performance.percentage.toStringAsFixed(0)}%',
                    style: textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _PerformanceMetric extends StatelessWidget {
  const _PerformanceMetric({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: textTheme.titleMedium?.copyWith(
            color: colors.onSecondaryContainer,
            fontWeight: FontWeight.w800,
          ),
        ),
        Text(
          label,
          style: textTheme.bodySmall?.copyWith(
            color: colors.onSecondaryContainer,
          ),
        ),
      ],
    );
  }
}

class _TestAttemptSummary {
  const _TestAttemptSummary({required this.test, required this.attempt});

  final PracticeTest test;
  final TestAttempt attempt;
}

class _SubjectPerformance {
  _SubjectPerformance({required this.subject});

  final String subject;
  var correctCount = 0;
  var totalQuestions = 0;

  double get percentage =>
      totalQuestions == 0 ? 0 : (correctCount / totalQuestions) * 100;

  void add(TestAttempt attempt) {
    correctCount += attempt.correctCount;
    totalQuestions += attempt.totalQuestions;
  }
}

class _CategoryCard extends StatelessWidget {
  const _CategoryCard({
    required this.icon,
    required this.label,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.medium),
      child: SizedBox(
        width: 152,
        child: Card(
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Icon(icon, color: colors.primary),
                  Text(
                    label,
                    style: textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  const _QuickAction({
    required this.icon,
    required this.label,
    required this.onPressed,
  });

  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      onPressed: onPressed,
    );
  }
}
