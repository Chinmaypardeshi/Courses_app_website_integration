/// A focused learning module that belongs to a [StudySubject].
class StudyCourse {
  const StudyCourse({
    required this.id,
    required this.subjectId,
    required this.title,
    required this.description,
    this.faculty = 'Senior UPSC Faculty',
    this.category = 'UPSC CSE',
    this.price = 0,
    this.validity = '1 Year',
    this.lectures = '',
  });

  final String id;
  final String subjectId;
  final String title;
  final String description;
  final String faculty;
  final String category;
  final double price;
  final String validity;
  final String lectures;

  factory StudyCourse.fromJson(Map<String, dynamic> json) => StudyCourse(
    id: json['id'].toString(),
    subjectId: (json['subjectId'] ?? json['subject_id'] ?? '').toString(),
    title: json['title'] as String? ?? '',
    description: json['description'] as String? ?? '',
    faculty: json['faculty'] as String? ?? 'Senior UPSC Faculty',
    category: json['category'] as String? ?? 'UPSC CSE',
    price: (json['price'] as num?)?.toDouble() ?? 0.0,
    validity: json['validity'] as String? ?? '1 Year',
    lectures: json['lectures'] as String? ?? '',
  );
}
