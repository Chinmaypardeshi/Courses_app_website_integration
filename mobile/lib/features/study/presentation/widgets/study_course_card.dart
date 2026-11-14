import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/study/domain/models/study_course.dart';
import 'package:flutter/material.dart';

import 'study_progress_indicator.dart';

/// Tappable overview of a course and its current session progress.
class StudyCourseCard extends StatelessWidget {
  const StudyCourseCard({
    super.key,
    required this.course,
    required this.lessonCount,
    required this.progress,
    required this.onTap,
  });

  final StudyCourse course;
  final int lessonCount;
  final double progress;
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
                      course.title,
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
                course.description,
                style: textTheme.bodyMedium?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              StudyProgressIndicator(
                value: progress,
                label: '$lessonCount lessons',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
