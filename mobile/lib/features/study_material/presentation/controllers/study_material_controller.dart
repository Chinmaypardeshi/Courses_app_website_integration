import 'package:flutter/foundation.dart';

import '../../domain/models/study_material.dart';
import '../../domain/repositories/study_material_repository.dart';
import '../../../notes_bookmarks/domain/models/bookmark.dart';
import '../../../notes_bookmarks/presentation/controllers/bookmarks_controller.dart';

/// Holds Study Material filters while shared bookmarks remain the source of truth.
class StudyMaterialController extends ChangeNotifier {
  StudyMaterialController(this._repository, this._bookmarksController) {
    _bookmarksController.addListener(_onBookmarksChanged);
  }

  final StudyMaterialRepository _repository;
  final BookmarksController _bookmarksController;
  String? _selectedSubjectId;
  StudyMaterialType? _selectedType;

  List<StudyMaterial> get materials => _repository.materials;
  String? get selectedSubjectId => _selectedSubjectId;
  StudyMaterialType? get selectedType => _selectedType;
  int get bookmarkedMaterialCount => _bookmarksController
      .bookmarksOfType(BookmarkContentType.studyMaterial)
      .length;

  List<String> get subjectIds => materials
      .map((material) => material.subjectId)
      .toSet()
      .toList(growable: false);

  List<StudyMaterial> get filteredMaterials => materials
      .where(
        (material) =>
            (_selectedSubjectId == null ||
                material.subjectId == _selectedSubjectId) &&
            (_selectedType == null || material.type == _selectedType),
      )
      .toList(growable: false);

  StudyMaterial? materialById(String id) {
    for (final material in materials) {
      if (material.id == id) return material;
    }
    return null;
  }

  bool isBookmarked(String materialId) => _bookmarksController.isBookmarked(
    BookmarkContentType.studyMaterial,
    materialId,
  );

  void selectSubject(String? subjectId) {
    if (subjectId != null && !subjectIds.contains(subjectId)) return;
    if (_selectedSubjectId == subjectId) return;
    _selectedSubjectId = subjectId;
    notifyListeners();
  }

  void selectType(StudyMaterialType? type) {
    if (_selectedType == type) return;
    _selectedType = type;
    notifyListeners();
  }

  void toggleBookmark(String materialId) {
    final material = materialById(materialId);
    if (material == null) return;
    _bookmarksController.toggleBookmark(
      Bookmark(
        contentType: BookmarkContentType.studyMaterial,
        contentId: material.id,
        title: material.title,
        subject: material.subjectTitle,
        context: material.topic,
      ),
    );
  }

  void _onBookmarksChanged() => notifyListeners();

  @override
  void dispose() {
    _bookmarksController.removeListener(_onBookmarksChanged);
    super.dispose();
  }
}
