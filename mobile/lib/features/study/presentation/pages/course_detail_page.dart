import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/study/domain/models/study_course.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:aspiria/features/study/presentation/widgets/study_progress_indicator.dart';
import 'package:aspiria/features/video_learning/domain/models/learning_video.dart';
import 'package:aspiria/features/video_learning/presentation/controllers/video_learning_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Lists the lessons and progress for one local study course.
class CourseDetailPage extends StatelessWidget {
  const CourseDetailPage({
    super.key,
    required this.studyController,
    required this.videoLearningController,
    required this.courseId,
  });

  final StudyController studyController;
  final VideoLearningController videoLearningController;
  final String courseId;

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
    final course = studyController.courseById(courseId);
    if (course == null) return const _StudyNotFoundPage(label: 'Course');

    return AnimatedBuilder(
      animation: Listenable.merge([studyController, videoLearningController]),
      builder: (context, _) => _CourseContent(
        studyController: studyController,
        videoLearningController: videoLearningController,
        course: course,
      ),
    );
  }
}

class _CourseContent extends StatelessWidget {
  const _CourseContent({
    required this.studyController,
    required this.videoLearningController,
    required this.course,
  });

  final StudyController studyController;
  final VideoLearningController videoLearningController;
  final StudyCourse course;

  @override
  Widget build(BuildContext context) {
    final lessons = studyController.lessonsForCourse(course.id);
    final videos = videoLearningController.videosForCourse(course.id);
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Course details')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.medium),
        children: [
          Text(
            course.title,
            style: textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: AppSpacing.small),
          Text(
            course.description,
            style: textTheme.bodyLarge?.copyWith(
              color: colors.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: AppSpacing.large),
          StudyProgressIndicator(
            value: studyController.courseProgress(course.id),
            label: '${lessons.length} lessons',
          ),
          const SizedBox(height: AppSpacing.xLarge),
          if (videos.isNotEmpty) ...[
            Text(
              'Video lessons',
              style: textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.small),
            Card(
              child: Column(
                children: [
                  for (var index = 0; index < videos.length; index++) ...[
                    _VideoLessonTile(
                      video: videos[index],
                      isWatched: videoLearningController.isVideoWatched(
                        videos[index].id,
                      ),
                      progress: videoLearningController.watchProgressFor(
                        videos[index].id,
                      ),
                      onTap: () => context.goNamed(
                        AppRoute.videoLearningDetail,
                        pathParameters: {
                          'courseId': course.id,
                          'videoId': videos[index].id,
                        },
                      ),
                    ),
                    if (index != videos.length - 1) const Divider(height: 1),
                  ],
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xLarge),
          ],
          Text(
            'Lessons',
            style: textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: AppSpacing.small),
          Card(
            child: Column(
              children: [
                for (var index = 0; index < lessons.length; index++) ...[
                  ListTile(
                    leading: Icon(
                      studyController.isLessonComplete(lessons[index].id)
                          ? Icons.check_circle_rounded
                          : Icons.radio_button_unchecked_rounded,
                      color: studyController.isLessonComplete(lessons[index].id)
                          ? colors.primary
                          : colors.onSurfaceVariant,
                    ),
                    title: Text(lessons[index].title),
                    subtitle: Text(
                      studyController.isLessonComplete(lessons[index].id)
                          ? 'Completed'
                          : 'Ready to study',
                    ),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: () => context.goNamed(
                      AppRoute.studyLesson,
                      pathParameters: {
                        'courseId': course.id,
                        'lessonId': lessons[index].id,
                      },
                    ),
                  ),
                  if (index != lessons.length - 1) const Divider(height: 1),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _VideoLessonTile extends StatelessWidget {
  const _VideoLessonTile({
    required this.video,
    required this.isWatched,
    required this.progress,
    required this.onTap,
  });

  final LearningVideo video;
  final bool isWatched;
  final double progress;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => ListTile(
    leading: Icon(
      isWatched
          ? Icons.check_circle_rounded
          : Icons.play_circle_outline_rounded,
    ),
    title: Text(video.title),
    subtitle: Text(
      isWatched
          ? 'Watched this session'
          : progress > 0
          ? '${(progress * 100).round()}% watched'
          : '${video.duration.inMinutes} min video',
    ),
    trailing: const Icon(Icons.chevron_right_rounded),
    onTap: onTap,
  );
}

class _StudyNotFoundPage extends StatelessWidget {
  const _StudyNotFoundPage({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Center(child: Text('$label not found.')),
    );
  }
}
