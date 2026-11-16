import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:aspiria/features/video_learning/domain/models/learning_video.dart';
import 'package:aspiria/features/video_learning/presentation/controllers/video_learning_controller.dart';
import 'package:aspiria/features/video_learning/presentation/widgets/video_player_widget.dart';
import 'package:flutter/material.dart';

/// A lightweight watch experience until a production video player is added.
class VideoDetailPage extends StatelessWidget {
  const VideoDetailPage({
    super.key,
    required this.studyController,
    required this.videoLearningController,
    required this.videoId,
  });

  final StudyController studyController;
  final VideoLearningController videoLearningController;
  final String videoId;

  @override
  Widget build(BuildContext context) {
    final video = videoLearningController.videoById(videoId);
    if (video == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Video not found.')),
      );
    }
    return AnimatedBuilder(
      animation: videoLearningController,
      builder: (context, _) => _VideoDetailContent(
        video: video,
        courseTitle:
            studyController.courseById(video.courseId)?.title ?? 'Study course',
        progress: videoLearningController.watchProgressFor(video.id),
        isWatched: videoLearningController.isVideoWatched(video.id),
        onProgressChanged: (progress) =>
            videoLearningController.updateWatchProgress(video.id, progress),
      ),
    );
  }
}

class _VideoDetailContent extends StatelessWidget {
  const _VideoDetailContent({
    required this.video,
    required this.courseTitle,
    required this.progress,
    required this.isWatched,
    required this.onProgressChanged,
  });

  final LearningVideo video;
  final String courseTitle;
  final double progress;
  final bool isWatched;
  final ValueChanged<double> onProgressChanged;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final progressPercent = (progress * 100).round();
    return Scaffold(
      appBar: AppBar(title: const Text('Video lesson')),
      body: SafeArea(
        top: false,
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.medium),
          children: [
            VideoPlayerWidget(
              videoUrl: video.videoReference.toString(),
              autoPlay: true,
              onProgressChanged: onProgressChanged,
            ),
            const SizedBox(height: AppSpacing.large),
            Text(
              courseTitle,
              style: textTheme.labelLarge?.copyWith(
                color: colors.primary,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              video.title,
              style: textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.small),
            Text(
              '${video.duration.inMinutes} min video',
              style: textTheme.bodyMedium?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppSpacing.medium),
            Text(
              video.description,
              style: textTheme.bodyLarge?.copyWith(
                color: colors.onSurfaceVariant,
                height: 1.5,
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            Text(
              'Watch progress',
              style: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.small),
            LinearProgressIndicator(value: progress),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              isWatched
                  ? 'Watched in this session'
                  : '$progressPercent% watched in this session',
              style: textTheme.bodySmall?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppSpacing.medium),
            Wrap(
              spacing: AppSpacing.small,
              runSpacing: AppSpacing.small,
              children: [
                OutlinedButton.icon(
                  onPressed: progress >= .25
                      ? null
                      : () => onProgressChanged(.25),
                  icon: const Icon(Icons.play_arrow_rounded),
                  label: const Text('Start watching'),
                ),
                OutlinedButton(
                  onPressed: progress >= .75
                      ? null
                      : () => onProgressChanged(.75),
                  child: const Text('Mark 75% watched'),
                ),
                FilledButton.icon(
                  onPressed: isWatched ? null : () => onProgressChanged(1),
                  icon: const Icon(Icons.check_circle_outline_rounded),
                  label: const Text('Mark as watched'),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.large),
            Row(
              children: [
                const Icon(
                  Icons.verified_rounded,
                  size: 16,
                  color: Colors.green,
                ),
                const SizedBox(width: AppSpacing.xSmall),
                Text(
                  'Connected to Live UPSC Cloud Video Stream',
                  style: textTheme.bodySmall?.copyWith(
                    color: colors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
