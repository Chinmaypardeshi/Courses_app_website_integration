import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/pyq/presentation/controllers/pyq_controller.dart';
import 'package:aspiria/features/pyq/presentation/widgets/pyq_option_tile.dart';
import 'package:aspiria/features/notes_bookmarks/domain/models/bookmark.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import 'package:flutter/material.dart';

/// Attempts one local PYQ demonstration question and reveals its explanation.
class PyqQuestionPage extends StatelessWidget {
  const PyqQuestionPage({
    super.key,
    required this.pyqController,
    required this.bookmarksController,
    required this.questionId,
  });

  final PyqController pyqController;
  final BookmarksController bookmarksController;
  final String questionId;

  @override
  Widget build(BuildContext context) {
    final question = pyqController.questionById(questionId);
    if (question == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Question not found.')),
      );
    }
    return AnimatedBuilder(
      animation: Listenable.merge([pyqController, bookmarksController]),
      builder: (context, _) {
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        final isSubmitted = pyqController.isSubmitted(question.id);
        final isCorrect = pyqController.isCorrect(question.id);
        final isBookmarked = bookmarksController.isBookmarked(
          BookmarkContentType.pyqQuestion,
          question.id,
        );
        return Scaffold(
          appBar: AppBar(
            title: const Text('Question Bank'),
            actions: [
              IconButton(
                tooltip: isBookmarked ? 'Remove bookmark' : 'Bookmark',
                onPressed: () => bookmarksController.toggleBookmark(
                  Bookmark(
                    contentType: BookmarkContentType.pyqQuestion,
                    contentId: question.id,
                    title: question.prompt,
                    subject: question.subject,
                    context: question.topic,
                  ),
                ),
                icon: Icon(
                  isBookmarked
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_border_rounded,
                ),
              ),
            ],
          ),
          body: SafeArea(
            top: false,
            child: ListView(
              padding: const EdgeInsets.all(AppSpacing.medium),
              children: [
                Text(
                  '${question.year} · ${question.examCategory}',
                  style: textTheme.labelLarge?.copyWith(
                    color: colors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: AppSpacing.xSmall),
                Text(
                  '${question.subject} · ${question.topic}',
                  style: textTheme.bodyMedium?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: AppSpacing.large),
                Text(
                  question.prompt,
                  style: textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: AppSpacing.large),
                for (final option in question.options)
                  PyqOptionTile(
                    option: option,
                    selectedOptionId: pyqController.selectedOptionFor(
                      question.id,
                    ),
                    correctOptionId: question.correctOptionId,
                    isSubmitted: isSubmitted,
                    onSelected: (optionId) => pyqController.selectAnswer(
                      questionId: question.id,
                      optionId: optionId,
                    ),
                  ),
                const SizedBox(height: AppSpacing.medium),
                if (!isSubmitted)
                  FilledButton(
                    onPressed: () {
                      if (!pyqController.submitAnswer(question.id)) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Select an option before checking your answer.',
                            ),
                          ),
                        );
                      }
                    },
                    child: const Text('Check answer'),
                  ),
                if (isSubmitted) ...[
                  Card(
                    color: isCorrect
                        ? colors.primaryContainer
                        : colors.errorContainer,
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.medium),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isCorrect ? 'Correct answer' : 'Review the answer',
                            style: textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xSmall),
                          Text(question.explanation),
                        ],
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: AppSpacing.large),
                Text(
                  'This is locally authored demonstration content for product development; it is not presented as an official UPSC PYQ source.',
                  style: textTheme.bodySmall?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
