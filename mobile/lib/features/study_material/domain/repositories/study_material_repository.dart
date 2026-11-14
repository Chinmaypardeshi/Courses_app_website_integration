import '../models/study_material.dart';

/// Supplies the available Study Material catalogue.
abstract interface class StudyMaterialRepository {
  List<StudyMaterial> get materials;
}
