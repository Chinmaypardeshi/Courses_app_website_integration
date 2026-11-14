import 'package:aspiria/features/study_material/data/repositories/local_study_material_repository.dart';
import 'package:aspiria/features/study_material/presentation/controllers/study_material_controller.dart';
import 'package:aspiria/features/study_material/presentation/pages/study_material_page.dart';
import 'package:aspiria/features/notes_bookmarks/data/repositories/local_bookmark_repository.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('shows local materials and updates bookmark state', (
    tester,
  ) async {
    final controller = StudyMaterialController(
      LocalStudyMaterialRepository(),
      BookmarksController(LocalBookmarkRepository()),
    );
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StudyMaterialPage(studyMaterialController: controller),
        ),
      ),
    );

    expect(find.text('Study Material'), findsOneWidget);
    expect(find.text('Fundamental Rights: quick revision PDF'), findsOneWidget);

    await tester.tap(find.byTooltip('Bookmark').first);
    await tester.pump();

    expect(find.text('1 materials bookmarked this session'), findsOneWidget);
  });
}
