import 'package:aspiria/features/pyq/data/repositories/local_pyq_repository.dart';
import 'package:aspiria/features/pyq/presentation/controllers/pyq_controller.dart';
import 'package:aspiria/features/pyq/presentation/pages/pyq_question_page.dart';
import 'package:aspiria/features/notes_bookmarks/data/repositories/local_bookmark_repository.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('selects an option and reveals explanation after checking', (
    tester,
  ) async {
    final controller = PyqController(LocalPyqRepository());
    final bookmarksController = BookmarksController(LocalBookmarkRepository());
    await tester.pumpWidget(
      MaterialApp(
        home: PyqQuestionPage(
          pyqController: controller,
          bookmarksController: bookmarksController,
          questionId: 'pyq-polity-remedies',
        ),
      ),
    );

    expect(find.text('Check answer'), findsOneWidget);
    await tester.tap(find.text('The Supreme Court and High Courts'));
    await tester.tap(find.text('Check answer'));
    await tester.pump();

    expect(find.text('Correct answer'), findsOneWidget);
    expect(find.textContaining('Articles 32 and 226'), findsOneWidget);

    await tester.tap(find.byTooltip('Bookmark'));
    await tester.pump();
    expect(bookmarksController.count, 1);
  });
}
