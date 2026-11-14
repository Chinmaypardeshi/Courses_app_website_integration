import '../../domain/models/study_material.dart';
import '../../domain/repositories/study_material_repository.dart';

/// Curated UPSC sample materials used until storage and CMS support exist.
class LocalStudyMaterialRepository implements StudyMaterialRepository {
  @override
  List<StudyMaterial> get materials => _materials;

  static const _materials = <StudyMaterial>[
    StudyMaterial(
      id: 'polity-fundamental-rights-pdf',
      title: 'Fundamental Rights: quick revision PDF',
      description: 'A concise guide to Articles 12–35, remedies, reasonable restrictions, and important distinctions.',
      subjectId: 'polity',
      subjectTitle: 'Indian Polity',
      topic: 'Fundamental Rights',
      type: StudyMaterialType.pdf,
      courseId: 'polity-foundations',
    ),
    StudyMaterial(
      id: 'history-revolt-1857-notes',
      title: 'The Revolt of 1857: structured notes',
      description: 'Causes, major centres, leaders, limitations, and consequences arranged for Prelims and Mains revision.',
      subjectId: 'history',
      subjectTitle: 'Indian History',
      topic: 'Revolt of 1857',
      type: StudyMaterialType.notes,
      courseId: 'history-modern',
      lessonId: 'history-revolt',
    ),
    StudyMaterial(
      id: 'polity-constitutional-amendment-document',
      title: 'Constitutional amendment reference document',
      description: 'A structured reference on amendment procedures, limitations, and the basic-structure doctrine.',
      subjectId: 'polity',
      subjectTitle: 'Indian Polity',
      topic: 'Constitutional Amendments',
      type: StudyMaterialType.document,
      courseId: 'polity-foundations',
    ),
    StudyMaterial(
      id: 'geography-monsoon-mind-map',
      title: 'Indian Monsoon mind map',
      description: 'Visual links between pressure systems, winds, onset, retreat, rainfall patterns, and economic effects.',
      subjectId: 'geography',
      subjectTitle: 'Geography',
      topic: 'Indian Monsoon',
      type: StudyMaterialType.mindMap,
      courseId: 'geography-india',
      lessonId: 'geography-monsoon',
    ),
    StudyMaterial(
      id: 'geography-physiographic-divisions-image',
      title: 'India: physiographic divisions map image',
      description: 'A labelled visual reference for the Himalayas, plains, plateau, coasts, islands, and desert.',
      subjectId: 'geography',
      subjectTitle: 'Geography',
      topic: 'Physiographic Divisions',
      type: StudyMaterialType.image,
      courseId: 'geography-india',
      lessonId: 'geography-relief',
    ),
    StudyMaterial(
      id: 'economy-inflation-pdf',
      title: 'Inflation: concepts and policy responses',
      description: 'A revision PDF covering measures of inflation, causes, impacts, and monetary-policy tools.',
      subjectId: 'economy',
      subjectTitle: 'Economy',
      topic: 'Inflation',
      type: StudyMaterialType.pdf,
      courseId: 'economy-basics',
      lessonId: 'economy-inflation',
    ),
    StudyMaterial(
      id: 'environment-biodiversity-infographic',
      title: 'Biodiversity conservation infographic',
      description: 'An at-a-glance comparison of in-situ and ex-situ conservation with protected-area examples.',
      subjectId: 'environment',
      subjectTitle: 'Environment',
      topic: 'Biodiversity Conservation',
      type: StudyMaterialType.infographic,
      courseId: 'environment-ecology',
      lessonId: 'environment-biodiversity',
    ),
  ];
}
