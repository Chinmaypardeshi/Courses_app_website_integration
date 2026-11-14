import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/study_material/domain/models/study_material.dart';
import 'package:aspiria/features/study_material/presentation/controllers/study_material_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Browses local Study Material by subject and resource type.
class StudyMaterialPage extends StatelessWidget {
  const StudyMaterialPage({super.key, required this.studyMaterialController});

  final StudyMaterialController studyMaterialController;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: AnimatedBuilder(
      animation: studyMaterialController,
      builder: (context, _) {
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        final materials = studyMaterialController.filteredMaterials;
        return ListView(
          padding: const EdgeInsets.all(AppSpacing.medium),
          children: [
            Text(
              'Study Material',
              style: textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              'Topic-focused UPSC revision resources for this study session.',
              style: textTheme.bodyLarge?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            Card(
              color: colors.primaryContainer,
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.medium),
                child: Text(
                  '${studyMaterialController.bookmarkedMaterialCount} materials bookmarked this session',
                  style: textTheme.titleMedium?.copyWith(
                    color: colors.onPrimaryContainer,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            Text(
              'Subject',
              style: textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.small),
            _FilterRow(
              children: [
                ChoiceChip(
                  label: const Text('All subjects'),
                  selected: studyMaterialController.selectedSubjectId == null,
                  onSelected: (_) =>
                      studyMaterialController.selectSubject(null),
                ),
                for (final subjectId in studyMaterialController.subjectIds) ...[
                  const SizedBox(width: AppSpacing.small),
                  ChoiceChip(
                    label: Text(
                      studyMaterialController.materials
                          .firstWhere(
                            (material) => material.subjectId == subjectId,
                          )
                          .subjectTitle,
                    ),
                    selected:
                        studyMaterialController.selectedSubjectId == subjectId,
                    onSelected: (_) =>
                        studyMaterialController.selectSubject(subjectId),
                  ),
                ],
              ],
            ),
            const SizedBox(height: AppSpacing.medium),
            Text(
              'Material type',
              style: textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.small),
            _FilterRow(
              children: [
                ChoiceChip(
                  label: const Text('All types'),
                  selected: studyMaterialController.selectedType == null,
                  onSelected: (_) => studyMaterialController.selectType(null),
                ),
                for (final type in StudyMaterialType.values) ...[
                  const SizedBox(width: AppSpacing.small),
                  ChoiceChip(
                    label: Text(type.label),
                    selected: studyMaterialController.selectedType == type,
                    onSelected: (_) => studyMaterialController.selectType(type),
                  ),
                ],
              ],
            ),
            const SizedBox(height: AppSpacing.large),
            if (materials.isEmpty)
              Padding(
                padding: const EdgeInsets.all(AppSpacing.large),
                child: Text(
                  'No materials match these filters.',
                  textAlign: TextAlign.center,
                  style: textTheme.bodyLarge?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
              ),
            for (final material in materials) ...[
              _MaterialCard(
                material: material,
                isBookmarked: studyMaterialController.isBookmarked(material.id),
                onTap: () => context.goNamed(
                  AppRoute.studyMaterialDetail,
                  pathParameters: {'materialId': material.id},
                ),
                onBookmark: () =>
                    studyMaterialController.toggleBookmark(material.id),
              ),
              const SizedBox(height: AppSpacing.medium),
            ],
          ],
        );
      },
    ),
  );
}

class _FilterRow extends StatelessWidget {
  const _FilterRow({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
    scrollDirection: Axis.horizontal,
    child: Row(children: children),
  );
}

class _MaterialCard extends StatelessWidget {
  const _MaterialCard({
    required this.material,
    required this.isBookmarked,
    required this.onTap,
    required this.onBookmark,
  });

  final StudyMaterial material;
  final bool isBookmarked;
  final VoidCallback onTap;
  final VoidCallback onBookmark;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.medium),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: colors.secondaryContainer,
                  borderRadius: AppRadius.small,
                ),
                child: Icon(_iconFor(material.type), color: colors.primary),
              ),
              const SizedBox(width: AppSpacing.medium),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      material.title,
                      style: textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xSmall),
                    Text(
                      '${material.subjectTitle} · ${material.topic}',
                      style: textTheme.bodySmall?.copyWith(
                        color: colors.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.small),
                    Chip(
                      label: Text(material.type.label),
                      visualDensity: VisualDensity.compact,
                    ),
                  ],
                ),
              ),
              IconButton(
                tooltip: isBookmarked ? 'Remove bookmark' : 'Bookmark',
                onPressed: onBookmark,
                icon: Icon(
                  isBookmarked
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_border_rounded,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

IconData materialTypeIcon(StudyMaterialType type) => _iconFor(type);

IconData _iconFor(StudyMaterialType type) => switch (type) {
  StudyMaterialType.pdf => Icons.picture_as_pdf_outlined,
  StudyMaterialType.document => Icons.description_outlined,
  StudyMaterialType.image => Icons.image_outlined,
  StudyMaterialType.infographic => Icons.insert_chart_outlined_rounded,
  StudyMaterialType.notes => Icons.sticky_note_2_outlined,
  StudyMaterialType.mindMap => Icons.account_tree_outlined,
};
