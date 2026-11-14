import 'package:flutter/foundation.dart';

import '../../domain/models/personal_note.dart';
import '../../domain/repositories/personal_note_repository.dart';

/// Holds session-only personal-note CRUD and list filters.
class PersonalNoteController extends ChangeNotifier {
  PersonalNoteController(this._repository);

  final PersonalNoteRepository _repository;
  String _searchQuery = '';
  String? _selectedSubject;
  int _nextId = 1;

  List<PersonalNote> get notes => _sorted(_repository.notes);
  String get searchQuery => _searchQuery;
  String? get selectedSubject => _selectedSubject;
  List<String> get subjects => notes
      .map((note) => note.subject)
      .whereType<String>()
      .toSet()
      .toList(growable: false);
  List<PersonalNote> get filteredNotes => notes
      .where((note) {
        final query = _searchQuery.toLowerCase();
        return (_selectedSubject == null || note.subject == _selectedSubject) &&
            (query.isEmpty ||
                note.title.toLowerCase().contains(query) ||
                note.content.toLowerCase().contains(query) ||
                (note.contextLabel?.toLowerCase().contains(query) ?? false));
      })
      .toList(growable: false);

  PersonalNote? noteById(String id) {
    for (final note in _repository.notes) {
      if (note.id == id) return note;
    }
    return null;
  }

  void setSearchQuery(String value) {
    if (_searchQuery == value) return;
    _searchQuery = value;
    notifyListeners();
  }

  void selectSubject(String? subject) {
    if (subject != null && !subjects.contains(subject)) return;
    if (_selectedSubject == subject) return;
    _selectedSubject = subject;
    notifyListeners();
  }

  PersonalNote? createNote({
    required String title,
    required String content,
    String? subject,
    NoteContextType? contextType,
    String? contextId,
    String? contextLabel,
  }) {
    final trimmedTitle = title.trim();
    final trimmedContent = content.trim();
    if (trimmedTitle.isEmpty || trimmedContent.isEmpty) {
      return null;
    }
    final note = PersonalNote(
      id: 'personal-note-${DateTime.now().microsecondsSinceEpoch}-${_nextId++}',
      title: trimmedTitle,
      content: trimmedContent,
      subject: _clean(subject),
      contextType: contextType,
      contextId: _clean(contextId),
      contextLabel: _clean(contextLabel),
      updatedAt: DateTime.now(),
    );
    _repository.create(note);
    notifyListeners();
    return note;
  }

  bool updateNote({
    required String noteId,
    required String title,
    required String content,
    String? subject,
    NoteContextType? contextType,
    String? contextId,
    String? contextLabel,
  }) {
    final existing = noteById(noteId);
    final trimmedTitle = title.trim();
    final trimmedContent = content.trim();
    if (existing == null || trimmedTitle.isEmpty || trimmedContent.isEmpty) {
      return false;
    }
    _repository.update(
      PersonalNote(
        id: existing.id,
        title: trimmedTitle,
        content: trimmedContent,
        subject: _clean(subject),
        contextType: contextType,
        contextId: _clean(contextId),
        contextLabel: _clean(contextLabel),
        updatedAt: DateTime.now(),
      ),
    );
    notifyListeners();
    return true;
  }

  bool deleteNote(String noteId) {
    final deleted = _repository.delete(noteId);
    if (deleted) {
      notifyListeners();
    }
    return deleted;
  }

  List<PersonalNote> _sorted(List<PersonalNote> values) =>
      List<PersonalNote>.of(values)
        ..sort((first, second) => second.updatedAt.compareTo(first.updatedAt));
  String? _clean(String? value) =>
      value?.trim().isEmpty ?? true ? null : value!.trim();
}
