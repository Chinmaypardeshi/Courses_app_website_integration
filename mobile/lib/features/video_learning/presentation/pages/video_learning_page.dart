import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:aspiria/features/video_learning/domain/models/learning_video.dart';
import 'package:aspiria/features/video_learning/presentation/controllers/video_learning_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Lists the locally available videos in their existing course context.
class VideoLearningPage extends StatelessWidget {
  const VideoLearningPage({
    super.key,
    required this.studyController,
    required this.videoLearningController,
  });

  final StudyController studyController;
  final VideoLearningController videoLearningController;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: AnimatedBuilder(
      animation: videoLearningController,
      builder: (context, _) {
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        final videos = videoLearningController.videos;
        return ListView(
          padding: const EdgeInsets.all(AppSpacing.medium),
          children: [
            Text(
              'Video Learning',
              style: textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              'Short UPSC concept videos organised by your study courses.',
              style: textTheme.bodyLarge?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            Card(
              color: colors.primaryContainer,
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.medium),
                child: Text(
                  '${videoLearningController.watchedVideoCount} of ${videos.length} videos watched this session',
                  style: textTheme.titleMedium?.copyWith(
                    color: colors.onPrimaryContainer,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            for (final video in videos) ...[
              _VideoListItem(
                video: video,
                courseTitle:
                    studyController.courseById(video.courseId)?.title ??
                    'Study course',
                isWatched: videoLearningController.isVideoWatched(video.id),
                progress: videoLearningController.watchProgressFor(video.id),
                onTap: () => context.goNamed(
                  AppRoute.videoLearningDetail,
                  pathParameters: {
                    'courseId': video.courseId,
                    'videoId': video.id,
                  },
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
            ],
          ],
        );
      },
    ),
  );
}

class _VideoListItem extends StatelessWidget {
  const _VideoListItem({
    required this.video,
    required this.courseTitle,
    required this.isWatched,
    required this.progress,
    required this.onTap,
  });

  final LearningVideo video;
  final String courseTitle;
  final bool isWatched;
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
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: colors.secondaryContainer,
                  borderRadius: AppRadius.small,
                ),
                child: Icon(
                  Icons.play_circle_fill_rounded,
                  color: colors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.medium),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      video.title,
                      style: textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xSmall),
                    Text(
                      courseTitle,
                      style: textTheme.bodySmall?.copyWith(
                        color: colors.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.small),
                    Text(
                      '${video.duration.inMinutes} min video',
                      style: textTheme.bodySmall?.copyWith(
                        color: colors.onSurfaceVariant,
                      ),
                    ),
                    if (progress > 0) ...[
                      const SizedBox(height: AppSpacing.small),
                      LinearProgressIndicator(value: progress),
                    ],
                  ],
                ),
              ),
              if (isWatched)
                Icon(Icons.check_circle_rounded, color: colors.primary),
            ],
          ),
        ),
      ),
    );
  }
}
