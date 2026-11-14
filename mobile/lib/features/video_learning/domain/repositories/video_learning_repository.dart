import '../models/learning_video.dart';

/// Supplies the available Video Learning catalogue.
abstract interface class VideoLearningRepository {
  List<LearningVideo> get videos;
}
