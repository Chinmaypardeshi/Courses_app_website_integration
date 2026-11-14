/// A concise, locally authored lesson within a [StudyCourse].
class StudyLesson {
  const StudyLesson({
    required this.id,
    required this.courseId,
    required this.title,
    required this.content,
  });

  final String id;
  final String courseId;
  final String title;
  final String content;

  factory StudyLesson.fromJson(Map<String, dynamic> json) => StudyLesson(
    id: json['id'].toString(),
    courseId: json['courseId'].toString(),
    title: json['title'] as String? ?? '',
    content: json['content'] as String? ?? '',
  );
}
