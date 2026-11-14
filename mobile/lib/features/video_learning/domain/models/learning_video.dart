/// A video learning item attached to an existing study course or lesson.
class LearningVideo {
  const LearningVideo({
    required this.id,
    required this.title,
    required this.description,
    required this.courseId,
    required this.duration,
    required this.videoReference,
    required this.order,
    this.lessonId,
  });

  final String id;
  final String title;
  final String description;
  final String courseId;
  final String? lessonId;
  final Duration duration;

  /// A source reference for a video player when one is connected.
  final Uri videoReference;
  final int order;
}
