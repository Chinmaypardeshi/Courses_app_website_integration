/// Supported formats for locally catalogued study resources.
enum StudyMaterialType {
  pdf('PDF'),
  document('Document'),
  image('Image'),
  infographic('Infographic'),
  notes('Notes'),
  mindMap('Mind map');

  const StudyMaterialType(this.label);

  final String label;
}

/// A study resource connected to an existing subject, course, or lesson topic.
class StudyMaterial {
  const StudyMaterial({
    required this.id,
    required this.title,
    required this.description,
    required this.subjectId,
    required this.subjectTitle,
    required this.topic,
    required this.type,
    this.courseId,
    this.lessonId,
  });

  final String id;
  final String title;
  final String description;
  final String subjectId;
  final String subjectTitle;
  final String topic;
  final StudyMaterialType type;
  final String? courseId;
  final String? lessonId;
}
