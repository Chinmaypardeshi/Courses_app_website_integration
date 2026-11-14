import 'package:aspiria/features/current_affairs/data/repositories/local_current_affairs_repository.dart';
import 'package:aspiria/features/current_affairs/presentation/controllers/current_affairs_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('filters articles and tracks session-only reading progress', () async {
    final controller = CurrentAffairsController(
      LocalCurrentAffairsRepository(),
    );
    await controller.loadArticles();

    expect(controller.articles, isNotEmpty);
    expect(controller.todaysArticles, isNotEmpty);
    expect(controller.readArticleCount, 0);
    expect(controller.readingProgress, 0);

    controller.selectCategory('Environment');

    expect(controller.filteredArticles, isNotEmpty);
    expect(
      controller.filteredArticles.every(
        (article) => article.category == 'Environment',
      ),
      isTrue,
    );

    final articleId = controller.filteredArticles.first.id;
    controller.markArticleRead(articleId);
    controller.markArticleRead(articleId);

    expect(controller.isArticleRead(articleId), isTrue);
    expect(controller.readArticleCount, 1);
    expect(controller.readingProgress, 1 / controller.articles.length);

    controller.selectCategory(null);
    expect(controller.filteredArticles.length, controller.articles.length);
  });
}
