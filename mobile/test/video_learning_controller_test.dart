import 'package:aspiria/features/video_learning/data/repositories/local_video_learning_repository.dart';
import 'package:aspiria/features/video_learning/presentation/controllers/video_learning_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('retrieves videos by course and lesson', () {
    final controller = VideoLearningController(LocalVideoLearningRepository());

    expect(controller.videosForCourse('1'), hasLength(2));
    expect(controller.videosForLesson('1'), hasLength(1));
    expect(controller.videosForCourse('1').first.order, 1);
    expect(controller.videosForCourse('unknown'), isEmpty);
  });

  test('tracks viewing progress and watched state for the current session', () {
    final controller = VideoLearningController(LocalVideoLearningRepository());
    const videoId = 'constitutional-preamble-video';

    controller.updateWatchProgress(videoId, .25);
    expect(controller.watchProgressFor(videoId), .25);
    expect(controller.isVideoWatched(videoId), isFalse);

    controller.markVideoWatched(videoId);
    expect(controller.watchProgressFor(videoId), 1);
    expect(controller.isVideoWatched(videoId), isTrue);
    expect(controller.watchedVideoCount, 1);

    controller.updateWatchProgress(videoId, .75);
    expect(controller.isVideoWatched(videoId), isFalse);
    expect(controller.watchedVideoCount, 0);
  });
}
