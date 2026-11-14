/// A focused learning module that belongs to a [StudySubject].
class StudyCourse {
  const StudyCourse({
    required this.id,
    required this.subjectId,
    required this.title,
    required this.description,
  });

  final String id;
  final String subjectId;
  final String title;
  final String description;

  factory StudyCourse.fromJson(Map<String, dynamic> json) => StudyCourse(
    id: json['id'].toString(),
    subjectId: json['subjectId'].toString(),
    title: json['title'] as String? ?? '',
    description: json['description'] as String? ?? '',
  );
}
