import 'package:aspiria/features/notes_bookmarks/data/repositories/local_bookmark_repository.dart';
import 'package:aspiria/features/notes_bookmarks/data/repositories/local_personal_note_repository.dart';
import 'package:aspiria/features/notes_bookmarks/domain/models/bookmark.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/personal_note_controller.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/pages/bookmarks_page.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/pages/personal_notes_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('notes list shows sample notes and search empty state', (
    tester,
  ) async {
    final controller = PersonalNoteController(LocalPersonalNoteRepository());
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PersonalNotesPage(personalNoteController: controller),
        ),
      ),
    );

    expect(find.text('Personal Notes'), findsOneWidget);
    expect(find.text('Fundamental Rights revision'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'no match');
    await tester.pump();
    expect(find.text('No notes found'), findsOneWidget);
  });

  testWidgets('bookmarks page has an empty state and displays a saved item', (
    tester,
  ) async {
    final controller = BookmarksController(LocalBookmarkRepository());
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(body: BookmarksPage(bookmarksController: controller)),
      ),
    );
    expect(find.text('No bookmarks yet'), findsOneWidget);

    controller.addBookmark(
      const Bookmark(
        contentType: BookmarkContentType.studyMaterial,
        contentId: 'material-1',
        title: 'Polity PDF',
        subject: 'Indian Polity',
      ),
    );
    await tester.pump();
    expect(find.text('Polity PDF'), findsOneWidget);
  });
}
