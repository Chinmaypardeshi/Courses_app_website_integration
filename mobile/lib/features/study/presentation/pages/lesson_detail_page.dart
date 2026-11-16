import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:aspiria/features/video_learning/presentation/controllers/video_learning_controller.dart';
import 'package:aspiria/features/video_learning/presentation/widgets/video_player_widget.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Presents a lesson and lets learners persist completion progress.
class LessonDetailPage extends StatelessWidget {
  const LessonDetailPage({
    super.key,
    required this.studyController,
    required this.videoLearningController,
    required this.lessonId,
  });

  final StudyController studyController;
  final VideoLearningController videoLearningController;
  final String lessonId;

  Future<void> _setLessonComplete(BuildContext context, bool isComplete) async {
    final saved = await studyController.setLessonComplete(lessonId, isComplete);
    final errorMessage = studyController.progressErrorMessage;
    if (!saved && context.mounted && errorMessage != null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(errorMessage)));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (studyController.isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (studyController.errorMessage != null) {
      return Scaffold(
        appBar: AppBar(),
        body: Center(child: Text(studyController.errorMessage!)),
      );
    }
    final lesson = studyController.lessonById(lessonId);
    if (lesson == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Lesson not found.')),
      );
    }

    return AnimatedBuilder(
      animation: Listenable.merge([studyController, videoLearningController]),
      builder: (context, _) {
        final isComplete = studyController.isLessonComplete(lesson.id);
        final isSaving = studyController.isSavingLesson(lesson.id);
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        final lessonVideos = videoLearningController.videosForLesson(lesson.id);
        final effectiveVideoUrl = lesson.videoUrl.isNotEmpty
            ? lesson.videoUrl
            : (lessonVideos.isNotEmpty
                ? lessonVideos.first.videoReference.toString()
                : '');
        return Scaffold(
          appBar: AppBar(title: const Text('Lesson')),
          body: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    lesson.title,
                    style: textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.medium),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (effectiveVideoUrl.isNotEmpty) ...[
                            VideoPlayerWidget(
                              videoUrl: effectiveVideoUrl,
                              aspectRatio: 16 / 9,
                            ),
                            const SizedBox(height: AppSpacing.medium),
                          ],
                          Text(
                            lesson.content,
                            style: textTheme.bodyLarge?.copyWith(
                              color: colors.onSurfaceVariant,
                              height: 1.55,
                            ),
                          ),
                          if (lessonVideos.isNotEmpty) ...[
                            const SizedBox(height: AppSpacing.large),
                            Card(
                              child: ListTile(
                                leading: const Icon(
                                  Icons.play_circle_outline_rounded,
                                ),
                                title: const Text('Watch the lesson video'),
                                subtitle: Text(
                                  '${lessonVideos.first.duration.inMinutes} min video',
                                ),
                                trailing: const Icon(
                                  Icons.chevron_right_rounded,
                                ),
                                onTap: () => context.goNamed(
                                  AppRoute.videoLearningDetail,
                                  pathParameters: {
                                    'courseId': lesson.courseId,
                                    'videoId': lessonVideos.first.id,
                                  },
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.medium),
                  SizedBox(
                    width: double.infinity,
                    child: isComplete
                        ? OutlinedButton.icon(
                            onPressed: isSaving
                                ? null
                                : () => _setLessonComplete(context, false),
                            icon: const Icon(Icons.check_circle_rounded),
                            label: Text(isSaving ? 'Saving...' : 'Completed'),
                          )
                        : ElevatedButton.icon(
                            onPressed: isSaving
                                ? null
                                : () => _setLessonComplete(context, true),
                            icon: const Icon(
                              Icons.check_circle_outline_rounded,
                            ),
                            label: Text(
                              isSaving ? 'Saving...' : 'Mark as Complete',
                            ),
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
}
