/// A top-level UPSC subject in the local study catalogue.
class StudySubject {
  const StudySubject({
    required this.id,
    required this.title,
    required this.description,
  });

  final String id;
  final String title;
  final String description;

  factory StudySubject.fromJson(Map<String, dynamic> json) => StudySubject(
    id: json['id'].toString(),
    title: json['title'] as String? ?? '',
    description: json['description'] as String? ?? '',
  );
}
