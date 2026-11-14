import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/app_router.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../domain/models/bookmark.dart';
import '../controllers/bookmarks_controller.dart';

/// Displays every bookmark managed by the shared session-only bookmark store.
class BookmarksPage extends StatelessWidget {
  const BookmarksPage({super.key, required this.bookmarksController});

  final BookmarksController bookmarksController;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: AnimatedBuilder(
      animation: bookmarksController,
      builder: (context, _) {
        final bookmarks = bookmarksController.bookmarks;
        final textTheme = Theme.of(context).textTheme;
        return ListView(
          padding: const EdgeInsets.all(AppSpacing.medium),
          children: [
            Text(
              'Bookmarks',
              style: textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              'Saved learning items from this session.',
              style: textTheme.bodyLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            if (bookmarks.isEmpty)
              const _EmptyBookmarks()
            else
              for (final bookmark in bookmarks) ...[
                _BookmarkCard(
                  bookmark: bookmark,
                  onOpen: () => _openBookmark(context, bookmark),
                  onRemove: () => bookmarksController.removeBookmark(
                    bookmark.contentType,
                    bookmark.contentId,
                  ),
                ),
                const SizedBox(height: AppSpacing.medium),
              ],
          ],
        );
      },
    ),
  );

  void _openBookmark(BuildContext context, Bookmark bookmark) {
    switch (bookmark.contentType) {
      case BookmarkContentType.studyMaterial:
        context.goNamed(
          AppRoute.studyMaterialDetail,
          pathParameters: {'materialId': bookmark.contentId},
        );
      case BookmarkContentType.pyqQuestion:
        context.goNamed(
          AppRoute.pyqQuestion,
          pathParameters: {'questionId': bookmark.contentId},
        );
    }
  }
}

class _EmptyBookmarks extends StatelessWidget {
  const _EmptyBookmarks();

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(AppSpacing.large),
      child: Column(
        children: [
          const Icon(Icons.bookmark_border_rounded, size: 48),
          const SizedBox(height: AppSpacing.medium),
          Text(
            'No bookmarks yet',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: AppSpacing.xSmall),
          const Text(
            'Bookmark Study Material or a Question Bank item to find it here.',
          ),
        ],
      ),
    ),
  );
}

class _BookmarkCard extends StatelessWidget {
  const _BookmarkCard({
    required this.bookmark,
    required this.onOpen,
    required this.onRemove,
  });

  final Bookmark bookmark;
  final VoidCallback onOpen;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onOpen,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.medium),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 44,
                width: 44,
                decoration: BoxDecoration(
                  color: colors.secondaryContainer,
                  borderRadius: AppRadius.small,
                ),
                child: Icon(
                  bookmark.contentType == BookmarkContentType.studyMaterial
                      ? Icons.menu_book_outlined
                      : Icons.quiz_outlined,
                ),
              ),
              const SizedBox(width: AppSpacing.medium),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      bookmark.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: AppSpacing.xSmall),
                    Text(
                      [
                        bookmark.contentType.label,
                        bookmark.subject,
                        bookmark.context,
                      ].whereType<String>().join(' · '),
                      style: Theme.of(context).textTheme.bodySmall
                          ?.copyWith(color: colors.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
              IconButton(
                tooltip: 'Remove bookmark',
                onPressed: onRemove,
                icon: const Icon(Icons.bookmark_remove_outlined),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
