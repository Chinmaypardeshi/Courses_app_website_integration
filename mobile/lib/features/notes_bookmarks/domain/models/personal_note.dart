/// The optional learning resource a personal note is connected to.
enum NoteContextType {
  subject('Subject'),
  chapter('Chapter'),
  topic('Topic'),
  lesson('Lesson'),
  studyMaterial('Study material'),
  pyqQuestion('PYQ question');

  const NoteContextType(this.label);

  final String label;
}

/// A learner-created note kept locally for the current application session.
class PersonalNote {
  const PersonalNote({
    required this.id,
    required this.title,
    required this.content,
    required this.updatedAt,
    this.subject,
    this.contextType,
    this.contextId,
    this.contextLabel,
  });

  final String id;
  final String title;
  final String content;
  final DateTime updatedAt;
  final String? subject;
  final NoteContextType? contextType;
  final String? contextId;
  final String? contextLabel;

  PersonalNote copyWith({
    String? title,
    String? content,
    DateTime? updatedAt,
    String? subject,
    NoteContextType? contextType,
    String? contextId,
    String? contextLabel,
    bool clearSubject = false,
    bool clearContext = false,
  }) => PersonalNote(
    id: id,
    title: title ?? this.title,
    content: content ?? this.content,
    updatedAt: updatedAt ?? this.updatedAt,
    subject: clearSubject ? null : subject ?? this.subject,
    contextType: clearContext ? null : contextType ?? this.contextType,
    contextId: clearContext ? null : contextId ?? this.contextId,
    contextLabel: clearContext ? null : contextLabel ?? this.contextLabel,
  );
}
