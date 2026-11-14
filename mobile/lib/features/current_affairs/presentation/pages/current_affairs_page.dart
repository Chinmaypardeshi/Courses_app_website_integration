import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/current_affairs/domain/models/current_affairs_article.dart';
import 'package:aspiria/features/current_affairs/presentation/controllers/current_affairs_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Browse Current Affairs notes grouped by UPSC-relevant topic.
class CurrentAffairsPage extends StatefulWidget {
  const CurrentAffairsPage({super.key, required this.currentAffairsController});

  final CurrentAffairsController currentAffairsController;

  @override
  State<CurrentAffairsPage> createState() => _CurrentAffairsPageState();
}

class _CurrentAffairsPageState extends State<CurrentAffairsPage> {
  CurrentAffairsController get currentAffairsController =>
      widget.currentAffairsController;

  @override
  void initState() {
    super.initState();
    if (currentAffairsController.articles.isEmpty &&
        !currentAffairsController.isLoading) {
      currentAffairsController.loadArticles();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return SafeArea(
      child: AnimatedBuilder(
        animation: currentAffairsController,
        builder: (context, _) => RefreshIndicator(
          onRefresh: currentAffairsController.loadArticles,
          child: ListView(
            padding: const EdgeInsets.all(AppSpacing.medium),
            children: [
              Text(
                'Current Affairs',
                style: textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.xSmall),
              Text(
                'Curated UPSC learning notes for your current revision session.',
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
                    '${currentAffairsController.readArticleCount} of ${currentAffairsController.articles.length} articles read this session',
                    style: textTheme.titleMedium?.copyWith(
                      color: colors.onPrimaryContainer,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.large),
              if (currentAffairsController.isLoading)
                const _LoadingState()
              else if (currentAffairsController.errorMessage != null &&
                  currentAffairsController.articles.isEmpty)
                _ErrorState(
                  message: currentAffairsController.errorMessage!,
                  onRetry: currentAffairsController.loadArticles,
                )
              else if (currentAffairsController.articles.isEmpty)
                const _EmptyState()
              else ...[
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ChoiceChip(
                        label: const Text('All topics'),
                        selected:
                            currentAffairsController.selectedCategory == null,
                        onSelected: (_) =>
                            currentAffairsController.selectCategory(null),
                      ),
                      for (final category
                          in currentAffairsController.categories) ...[
                        const SizedBox(width: AppSpacing.small),
                        ChoiceChip(
                          label: Text(category),
                          selected:
                              currentAffairsController.selectedCategory ==
                              category,
                          onSelected: (_) =>
                              currentAffairsController.selectCategory(category),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.large),
                for (final article
                    in currentAffairsController.filteredArticles) ...[
                  _ArticleCard(
                    article: article,
                    isRead: currentAffairsController.isArticleRead(article.id),
                    onTap: () => context.goNamed(
                      AppRoute.currentAffairsArticle,
                      pathParameters: {'articleId': article.id},
                    ),
                  ),
                  const SizedBox(height: AppSpacing.medium),
                ],
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _LoadingState extends StatelessWidget {
  const _LoadingState();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(AppSpacing.large),
        child: Center(child: CircularProgressIndicator()),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(message),
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

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(AppSpacing.medium),
        child: Text('No current affairs articles are available yet.'),
      ),
    );
  }
}

class _ArticleCard extends StatelessWidget {
  const _ArticleCard({
    required this.article,
    required this.isRead,
    required this.onTap,
  });

  final CurrentAffairsArticle article;
  final bool isRead;
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
                    child: Text(article.category, style: textTheme.labelMedium),
                  ),
                  const Spacer(),
                  if (article.isPremium) ...[
                    Icon(Icons.lock_outline_rounded, color: colors.primary),
                    const SizedBox(width: AppSpacing.small),
                  ],
                  if (isRead)
                    Icon(
                      Icons.check_circle_rounded,
                      color: colors.primary,
                      size: 20,
                    ),
                ],
              ),
              const SizedBox(height: AppSpacing.medium),
              Text(
                article.title,
                style: textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.xSmall),
              Text(
                article.summary,
                style: textTheme.bodyMedium?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Text(
                '${article.readingTimeMinutes} min read',
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
