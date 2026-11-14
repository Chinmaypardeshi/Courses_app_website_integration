import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/study_material/presentation/controllers/study_material_controller.dart';
import 'package:aspiria/features/study_material/presentation/pages/study_material_page.dart';
import 'package:flutter/material.dart';

/// Shows material metadata until storage-backed document viewing is available.
class StudyMaterialDetailPage extends StatelessWidget {
  const StudyMaterialDetailPage({
    super.key,
    required this.studyMaterialController,
    required this.materialId,
  });

  final StudyMaterialController studyMaterialController;
  final String materialId;

  @override
  Widget build(BuildContext context) {
    final material = studyMaterialController.materialById(materialId);
    if (material == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Material not found.')),
      );
    }
    return AnimatedBuilder(
      animation: studyMaterialController,
      builder: (context, _) {
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        final isBookmarked = studyMaterialController.isBookmarked(material.id);
        return Scaffold(
          appBar: AppBar(
            title: const Text('Study material'),
            actions: [
              IconButton(
                tooltip: isBookmarked ? 'Remove bookmark' : 'Bookmark',
                onPressed: () =>
                    studyMaterialController.toggleBookmark(material.id),
                icon: Icon(
                  isBookmarked
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_border_rounded,
                ),
              ),
            ],
          ),
          body: ListView(
            padding: const EdgeInsets.all(AppSpacing.medium),
            children: [
              Container(
                height: 176,
                decoration: BoxDecoration(
                  color: colors.secondaryContainer,
                  borderRadius: AppRadius.medium,
                ),
                child: Center(
                  child: Icon(
                    materialTypeIcon(material.type),
                    size: 72,
                    color: colors.primary,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.large),
              Text(
                material.subjectTitle,
                style: textTheme.labelLarge?.copyWith(
                  color: colors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: AppSpacing.xSmall),
              Text(
                material.title,
                style: textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Text(
                material.description,
                style: textTheme.bodyLarge?.copyWith(
                  color: colors.onSurfaceVariant,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: AppSpacing.large),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.medium),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Material details',
                        style: textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.small),
                      Text('Topic: ${material.topic}'),
                      Text('Type: ${material.type.label}'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.large),
              Text(
                'This is a local catalogue entry. Viewing, file hosting, and downloads will be enabled when study-material storage and CMS integration are available.',
                style: textTheme.bodySmall?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
