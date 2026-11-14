import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:aspiria/features/study/presentation/widgets/study_course_card.dart';
import 'package:aspiria/features/study/presentation/widgets/study_progress_indicator.dart';
import 'package:aspiria/features/study_material/presentation/controllers/study_material_controller.dart';
import 'package:aspiria/features/pyq/presentation/controllers/pyq_controller.dart';
import 'package:aspiria/features/video_learning/presentation/controllers/video_learning_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// The UPSC catalogue and the signed-in learner's study progress.
class StudyPage extends StatelessWidget {
  const StudyPage({
    super.key,
    required this.studyController,
    required this.videoLearningController,
    required this.studyMaterialController,
    required this.pyqController,
  });

  final StudyController studyController;
  final VideoLearningController videoLearningController;
  final StudyMaterialController studyMaterialController;
  final PyqController pyqController;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return SafeArea(
      child: AnimatedBuilder(
        animation: Listenable.merge([
          studyController,
          videoLearningController,
          studyMaterialController,
          pyqController,
        ]),
        builder: (context, _) {
          if (studyController.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (studyController.errorMessage != null) {
            return _StudyLoadError(
              message: studyController.errorMessage!,
              onRetry: studyController.loadCatalogue,
            );
          }
          final completed = studyController.completedLessonCount;
          final total = studyController.lessons.length;
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.medium),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Study',
                      style: textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () => context.goNamed(AppRoute.notes),
                    icon: const Icon(Icons.sticky_note_2_outlined),
                    label: const Text('Notes'),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xSmall),
              Text(
                'Build UPSC concepts one focused lesson at a time.',
                style: textTheme.bodyLarge?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: AppSpacing.large),
              Card(
                color: colors.primaryContainer,
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.large),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Your learning progress',
                        style: textTheme.titleLarge?.copyWith(
                          color: colors.onPrimaryContainer,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xSmall),
                      Text(
                        '$completed of $total lessons completed',
                        style: textTheme.bodyMedium?.copyWith(
                          color: colors.onPrimaryContainer,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.medium),
                      StudyProgressIndicator(
                        value: studyController.overallProgress,
                        label: 'Overall progress',
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xLarge),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.play_circle_outline_rounded),
                  title: const Text('Video Learning'),
                  subtitle: Text(
                    '${videoLearningController.watchedVideoCount} of ${videoLearningController.videos.length} sample videos watched this session',
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () => context.goNamed(AppRoute.videoLearning),
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.menu_book_outlined),
                  title: const Text('Study Material'),
                  subtitle: Text(
                    '${studyMaterialController.materials.length} local resources · ${studyMaterialController.bookmarkedMaterialCount} bookmarked this session',
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () => context.goNamed(AppRoute.studyMaterial),
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.quiz_outlined),
                  title: const Text('Question Bank'),
                  subtitle: Text(
                    '${pyqController.questions.length} local demo questions · ${pyqController.attemptedQuestionCount} checked this session',
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () => context.goNamed(AppRoute.pyq),
                ),
              ),
              const SizedBox(height: AppSpacing.xLarge),
              Text(
                'UPSC subjects',
                style: textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              for (final subject in studyController.subjects) ...[
                _SubjectHeader(
                  title: subject.title,
                  description: subject.description,
                  progress: studyController.subjectProgress(subject.id),
                ),
                const SizedBox(height: AppSpacing.small),
                for (final course in studyController.coursesForSubject(
                  subject.id,
                )) ...[
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
                const SizedBox(height: AppSpacing.medium),
              ],
            ],
          );
        },
      ),
    );
  }
}

class _StudyLoadError extends StatelessWidget {
  const _StudyLoadError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(AppSpacing.large),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.cloud_off_rounded, size: 40),
          const SizedBox(height: AppSpacing.medium),
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: AppSpacing.medium),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('Retry'),
          ),
        ],
      ),
    ),
  );
}

class _SubjectHeader extends StatelessWidget {
  const _SubjectHeader({
    required this.title,
    required this.description,
    required this.progress,
  });

  final String title;
  final String description;
  final double progress;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.all(AppSpacing.medium),
      decoration: BoxDecoration(
        color: colors.secondaryContainer,
        borderRadius: AppRadius.medium,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: AppSpacing.xSmall),
          Text(
            description,
            style: textTheme.bodySmall?.copyWith(
              color: colors.onSecondaryContainer,
            ),
          ),
          const SizedBox(height: AppSpacing.small),
          StudyProgressIndicator(value: progress, label: 'Subject progress'),
        ],
      ),
    );
  }
}
