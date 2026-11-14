import '../models/current_affairs_article.dart';

/// Supplies Current Affairs learning content.
abstract interface class CurrentAffairsRepository {
  Future<List<CurrentAffairsArticle>> loadArticles();

  Future<CurrentAffairsArticle> loadArticle(String articleId);
}

class CurrentAffairsRepositoryException implements Exception {
  const CurrentAffairsRepositoryException(this.message, {this.code});

  final String message;
  final String? code;

  bool get isPremiumRequired => code == 'PREMIUM_REQUIRED';
}
