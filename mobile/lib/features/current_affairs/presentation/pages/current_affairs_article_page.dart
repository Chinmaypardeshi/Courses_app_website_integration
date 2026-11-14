import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/current_affairs/presentation/controllers/current_affairs_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Displays one Current Affairs note and records a session-only read state.
class CurrentAffairsArticlePage extends StatefulWidget {
  const CurrentAffairsArticlePage({
    super.key,
    required this.currentAffairsController,
    required this.articleId,
  });

  final CurrentAffairsController currentAffairsController;
  final String articleId;

  @override
  State<CurrentAffairsArticlePage> createState() =>
      _CurrentAffairsArticlePageState();
}

class _CurrentAffairsArticlePageState extends State<CurrentAffairsArticlePage> {
  CurrentAffairsController get currentAffairsController =>
      widget.currentAffairsController;
  String get articleId => widget.articleId;

  @override
  void initState() {
    super.initState();
    currentAffairsController.loadArticle(articleId);
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Current Affairs')),
      body: AnimatedBuilder(
        animation: currentAffairsController,
        builder: (context, _) {
          final article = currentAffairsController.articleById(articleId);
          final isLoading = currentAffairsController.isArticleLoading(
            articleId,
          );
          if (isLoading && article == null) {
            return const Center(child: CircularProgressIndicator());
          }
          if (currentAffairsController.isPremiumRequired(articleId)) {
            return _PremiumRequiredState(
              message:
                  currentAffairsController.errorMessage ??
                  'Premium subscription required.',
            );
          }
          if (article == null) {
            return _ArticleErrorState(
              message:
                  currentAffairsController.errorMessage ?? 'Article not found.',
              onRetry: () => currentAffairsController.loadArticle(articleId),
            );
          }
          final isRead = currentAffairsController.isArticleRead(articleId);
          return SafeArea(
            child: ListView(
              padding: const EdgeInsets.all(AppSpacing.medium),
              children: [
                Text(
                  article.category,
                  style: textTheme.labelLarge?.copyWith(color: colors.primary),
                ),
                const SizedBox(height: AppSpacing.small),
                Text(
                  article.title,
                  style: textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: AppSpacing.small),
                Text(
                  '${article.readingTimeMinutes} min read',
                  style: textTheme.bodySmall?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: AppSpacing.large),
                if (isLoading)
                  const Center(child: CircularProgressIndicator())
                else if (article.content.isEmpty)
                  _PremiumRequiredState(
                    message: 'Premium subscription required.',
                    inline: true,
                  )
                else ...[
                  for (final section in article.content.split('\n\n')) ...[
                    Text(
                      section,
                      style: textTheme.bodyLarge?.copyWith(height: 1.55),
                    ),
                    const SizedBox(height: AppSpacing.medium),
                  ],
                  const SizedBox(height: AppSpacing.small),
                  FilledButton.icon(
                    onPressed: isRead
                        ? null
                        : () => currentAffairsController.markArticleRead(
                            articleId,
                          ),
                    icon: Icon(
                      isRead ? Icons.check_rounded : Icons.done_rounded,
                    ),
                    label: Text(
                      isRead ? 'Read in this session' : 'Mark as read',
                    ),
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}

class _ArticleErrorState extends StatelessWidget {
  const _ArticleErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.medium),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Try again'),
            ),
          ],
        ),
      ),
    );
  }
}

class _PremiumRequiredState extends StatelessWidget {
  const _PremiumRequiredState({required this.message, this.inline = false});

  final String message;
  final bool inline;

  @override
  Widget build(BuildContext context) {
    final content = Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.lock_outline_rounded),
            const SizedBox(height: AppSpacing.small),
            Text(message),
            const SizedBox(height: AppSpacing.medium),
            FilledButton.icon(
              onPressed: () => context.goNamed(AppRoute.subscription),
              icon: const Icon(Icons.workspace_premium_rounded),
              label: const Text('View subscription'),
            ),
          ],
        ),
      ),
    );
    if (inline) return content;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: content,
      ),
    );
  }
}
