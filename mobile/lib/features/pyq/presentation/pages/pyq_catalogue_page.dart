import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/pyq/domain/models/pyq_question.dart';
import 'package:aspiria/features/pyq/presentation/controllers/pyq_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Browses the local, UPSC-style question-bank demonstration catalogue.
class PyqCataloguePage extends StatelessWidget {
  const PyqCataloguePage({super.key, required this.pyqController});

  final PyqController pyqController;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: AnimatedBuilder(
      animation: pyqController,
      builder: (context, _) {
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        final questions = pyqController.filteredQuestions;
        return ListView(
          padding: const EdgeInsets.all(AppSpacing.medium),
          children: [
            Text(
              'Question Bank',
              style: textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              'Local UPSC-style demonstration questions for focused revision.',
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
                  '${pyqController.attemptedQuestionCount} of ${pyqController.questions.length} questions checked this session',
                  style: textTheme.titleMedium?.copyWith(
                    color: colors.onPrimaryContainer,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            _FilterLabel(label: 'Subject'),
            _FilterRow(
              children: [
                ChoiceChip(
                  label: const Text('All subjects'),
                  selected: pyqController.selectedSubject == null,
                  onSelected: (_) => pyqController.selectSubject(null),
                ),
                for (final subject in pyqController.subjects) ...[
                  const SizedBox(width: AppSpacing.small),
                  ChoiceChip(
                    label: Text(subject),
                    selected: pyqController.selectedSubject == subject,
                    onSelected: (_) => pyqController.selectSubject(subject),
                  ),
                ],
              ],
            ),
            const SizedBox(height: AppSpacing.medium),
            _FilterLabel(label: 'Year'),
            _FilterRow(
              children: [
                ChoiceChip(
                  label: const Text('All years'),
                  selected: pyqController.selectedYear == null,
                  onSelected: (_) => pyqController.selectYear(null),
                ),
                for (final year in pyqController.years) ...[
                  const SizedBox(width: AppSpacing.small),
                  ChoiceChip(
                    label: Text('$year'),
                    selected: pyqController.selectedYear == year,
                    onSelected: (_) => pyqController.selectYear(year),
                  ),
                ],
              ],
            ),
            const SizedBox(height: AppSpacing.medium),
            _FilterLabel(label: 'Category'),
            _FilterRow(
              children: [
                ChoiceChip(
                  label: const Text('All categories'),
                  selected: pyqController.selectedExamCategory == null,
                  onSelected: (_) => pyqController.selectExamCategory(null),
                ),
                for (final category in pyqController.examCategories) ...[
                  const SizedBox(width: AppSpacing.small),
                  ChoiceChip(
                    label: Text(category),
                    selected: pyqController.selectedExamCategory == category,
                    onSelected: (_) =>
                        pyqController.selectExamCategory(category),
                  ),
                ],
              ],
            ),
            const SizedBox(height: AppSpacing.large),
            if (questions.isEmpty)
              Padding(
                padding: const EdgeInsets.all(AppSpacing.large),
                child: Text(
                  'No questions match these filters.',
                  textAlign: TextAlign.center,
                  style: textTheme.bodyLarge?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
              ),
            for (final question in questions) ...[
              _QuestionCard(
                question: question,
                isAttempted: pyqController.isSubmitted(question.id),
                onTap: () => context.goNamed(
                  AppRoute.pyqQuestion,
                  pathParameters: {'questionId': question.id},
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
            ],
          ],
        );
      },
    ),
  );
}

class _FilterLabel extends StatelessWidget {
  const _FilterLabel({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) => Text(
    label,
    style: Theme.of(context).textTheme.titleSmall
        ?.copyWith(fontWeight: FontWeight.w800),
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

class _QuestionCard extends StatelessWidget {
  const _QuestionCard({
    required this.question,
    required this.isAttempted,
    required this.onTap,
  });

  final PyqQuestion question;
  final bool isAttempted;
  final VoidCallback onTap;

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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.small,
                      vertical: AppSpacing.xSmall,
                    ),
                    decoration: BoxDecoration(
                      color: colors.secondaryContainer,
                      borderRadius: AppRadius.small,
                    ),
                    child: Text(
                      '${question.year} · ${question.examCategory}',
                      style: textTheme.labelMedium,
                    ),
                  ),
                  const Spacer(),
                  if (isAttempted)
                    Icon(
                      Icons.check_circle_rounded,
                      color: colors.primary,
                      size: 20,
                    ),
                ],
              ),
              const SizedBox(height: AppSpacing.medium),
              Text(
                question.prompt,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.small),
              Text(
                '${question.subject} · ${question.topic}',
                style: textTheme.bodySmall?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
