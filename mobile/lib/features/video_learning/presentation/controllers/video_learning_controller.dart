import 'package:flutter/foundation.dart';

import '../../domain/models/learning_video.dart';
import '../../domain/repositories/video_learning_repository.dart';

/// Holds the local Video Learning catalogue and session-only viewing state.
class VideoLearningController extends ChangeNotifier {
  VideoLearningController(this._repository);

  final VideoLearningRepository _repository;
  final Set<String> _watchedVideoIds = <String>{};
  final Map<String, double> _watchProgressByVideoId = <String, double>{};

  List<LearningVideo> get videos => _repository.videos;
  int get watchedVideoCount => _watchedVideoIds.length;
  double get overallWatchProgress {
    if (videos.isEmpty) return 0;
    return videos.fold<double>(
          0,
          (total, video) => total + watchProgressFor(video.id),
        ) /
        videos.length;
  }

  List<LearningVideo> videosForCourse(String courseId) =>
      videos
          .where((video) => video.courseId == courseId)
          .toList(growable: false)
        ..sort((first, second) => first.order.compareTo(second.order));

  List<LearningVideo> videosForLesson(String lessonId) =>
      videos
          .where((video) => video.lessonId == lessonId)
          .toList(growable: false)
        ..sort((first, second) => first.order.compareTo(second.order));

  LearningVideo? videoById(String id) {
    for (final video in videos) {
      if (video.id == id) return video;
    }
    return null;
  }

  bool isVideoWatched(String videoId) => _watchedVideoIds.contains(videoId);

  double watchProgressFor(String videoId) =>
      _watchProgressByVideoId[videoId] ?? 0;

  void updateWatchProgress(String videoId, double progress) {
    if (videoById(videoId) == null) return;
    final normalizedProgress = progress.clamp(0.0, 1.0).toDouble();
    if (watchProgressFor(videoId) == normalizedProgress) return;
    _watchProgressByVideoId[videoId] = normalizedProgress;
    if (normalizedProgress == 1) {
      _watchedVideoIds.add(videoId);
    } else {
      _watchedVideoIds.remove(videoId);
    }
    notifyListeners();
  }

  void markVideoWatched(String videoId) => updateWatchProgress(videoId, 1);
}
