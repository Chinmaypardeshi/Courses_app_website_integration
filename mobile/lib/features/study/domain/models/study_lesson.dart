/// A concise, locally authored lesson within a [StudyCourse].
class StudyLesson {
  const StudyLesson({
    required this.id,
    required this.courseId,
    required this.title,
    required this.content,
    this.videoUrl = '',
    this.duration = '45 mins',
  });

  final String id;
  final String courseId;
  final String title;
  final String content;
  final String videoUrl;
  final String duration;

  factory StudyLesson.fromJson(Map<String, dynamic> json) => StudyLesson(
    id: json['id'].toString(),
    courseId: (json['courseId'] ?? json['course_id'] ?? '').toString(),
    title: json['title'] as String? ?? '',
    content: json['content'] as String? ?? '',
    videoUrl: (json['videoUrl'] ?? json['video_url'] ?? '').toString(),
    duration: (json['duration'] ?? '45 mins').toString(),
  );
}
