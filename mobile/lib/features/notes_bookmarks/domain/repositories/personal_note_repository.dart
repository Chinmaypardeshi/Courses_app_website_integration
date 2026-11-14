import '../models/personal_note.dart';

/// Storage contract for personal notes. The current implementation is session-only.
abstract interface class PersonalNoteRepository {
  List<PersonalNote> get notes;
  void create(PersonalNote note);
  void update(PersonalNote note);
  bool delete(String noteId);
}
