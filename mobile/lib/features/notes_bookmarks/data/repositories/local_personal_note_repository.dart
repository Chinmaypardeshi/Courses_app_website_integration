import '../../domain/models/personal_note.dart';
import '../../domain/repositories/personal_note_repository.dart';

/// In-memory personal notes for the active application session.
class LocalPersonalNoteRepository implements PersonalNoteRepository {
  LocalPersonalNoteRepository({List<PersonalNote>? initialNotes})
    : _notes = List<PersonalNote>.of(initialNotes ?? _sampleNotes);

  final List<PersonalNote> _notes;

  @override
  List<PersonalNote> get notes => List<PersonalNote>.unmodifiable(_notes);

  @override
  void create(PersonalNote note) => _notes.add(note);

  @override
  void update(PersonalNote note) {
    final index = _notes.indexWhere((item) => item.id == note.id);
    if (index != -1) _notes[index] = note;
  }

  @override
  bool delete(String noteId) {
    final index = _notes.indexWhere((note) => note.id == noteId);
    if (index == -1) return false;
    _notes.removeAt(index);
    return true;
  }

  static final _sampleNotes = <PersonalNote>[
    PersonalNote(
      id: 'note-fundamental-rights',
      title: 'Fundamental Rights revision',
      content: 'Revise Articles 12–35 with special attention to Articles 14, 19, 21, and constitutional remedies.',
      subject: 'Indian Polity',
      contextType: NoteContextType.topic,
      contextLabel: 'Fundamental Rights',
      updatedAt: DateTime(2026, 9, 1),
    ),
  ];
}
