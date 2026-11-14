import 'package:aspiria/features/study_material/data/repositories/local_study_material_repository.dart';
import 'package:aspiria/features/study_material/domain/models/study_material.dart';
import 'package:aspiria/features/study_material/presentation/controllers/study_material_controller.dart';
import 'package:aspiria/features/notes_bookmarks/data/repositories/local_bookmark_repository.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('filters materials by subject and type', () {
    final controller = StudyMaterialController(
      LocalStudyMaterialRepository(),
      BookmarksController(LocalBookmarkRepository()),
    );

    expect(controller.materials, hasLength(7));
    controller.selectSubject('environment');
    expect(
      controller.filteredMaterials.single.type,
      StudyMaterialType.infographic,
    );

    controller.selectSubject(null);
    controller.selectType(StudyMaterialType.pdf);
    expect(controller.filteredMaterials, hasLength(2));
    expect(
      controller.filteredMaterials.every(
        (material) => material.type == StudyMaterialType.pdf,
      ),
      isTrue,
    );
  });

  test('bookmarks valid materials for the current session only', () {
    final bookmarksController = BookmarksController(LocalBookmarkRepository());
    final controller = StudyMaterialController(
      LocalStudyMaterialRepository(),
      bookmarksController,
    );
    const materialId = 'history-revolt-1857-notes';

    controller.toggleBookmark(materialId);
    expect(controller.isBookmarked(materialId), isTrue);
    expect(controller.bookmarkedMaterialCount, 1);
    expect(bookmarksController.count, 1);

    controller.toggleBookmark(materialId);
    expect(controller.isBookmarked(materialId), isFalse);
    expect(controller.bookmarkedMaterialCount, 0);
  });
}
