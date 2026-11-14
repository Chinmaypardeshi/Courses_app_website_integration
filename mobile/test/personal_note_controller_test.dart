import 'package:aspiria/features/notes_bookmarks/data/repositories/local_personal_note_repository.dart';
import 'package:aspiria/features/notes_bookmarks/domain/models/personal_note.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/personal_note_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('provides a sample note and supports create, edit, and delete', () {
    final controller = PersonalNoteController(LocalPersonalNoteRepository());

    expect(controller.notes, hasLength(1));
    final note = controller.createNote(
      title: 'Monsoon revision',
      content: 'Link onset to pressure gradients.',
      subject: 'Geography',
      contextType: NoteContextType.topic,
      contextLabel: 'Indian Monsoon',
    );
    expect(note, isNotNull);
    expect(controller.notes, hasLength(2));

    expect(
      controller.updateNote(
        noteId: note!.id,
        title: 'Monsoon revision updated',
        content: 'Link onset and retreat to pressure gradients.',
        subject: 'Geography',
        contextType: NoteContextType.topic,
        contextLabel: 'Indian Monsoon',
      ),
      isTrue,
    );
    expect(controller.noteById(note.id)?.title, 'Monsoon revision updated');
    expect(controller.deleteNote(note.id), isTrue);
    expect(controller.noteById(note.id), isNull);
  });

  test('searches and filters notes and rejects invalid or missing notes', () {
    final controller = PersonalNoteController(LocalPersonalNoteRepository());
    expect(controller.createNote(title: ' ', content: 'content'), isNull);
    expect(
      controller.updateNote(
        noteId: 'missing',
        title: 'Title',
        content: 'Content',
      ),
      isFalse,
    );
    expect(controller.deleteNote('missing'), isFalse);

    controller.setSearchQuery('fundamental');
    expect(controller.filteredNotes, hasLength(1));
    controller.setSearchQuery('');
    controller.selectSubject('Indian Polity');
    expect(controller.filteredNotes, hasLength(1));
    controller.createNote(
      title: 'Monsoon',
      content: 'Revision point.',
      subject: 'Geography',
    );
    controller.selectSubject('Geography');
    expect(controller.filteredNotes, hasLength(1));
  });
}
