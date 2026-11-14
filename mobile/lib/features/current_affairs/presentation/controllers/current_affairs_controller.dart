import 'package:flutter/foundation.dart';

import '../../domain/models/current_affairs_article.dart';
import '../../domain/repositories/current_affairs_repository.dart';

/// Manages Current Affairs articles and session-only reading progress.
class CurrentAffairsController extends ChangeNotifier {
  CurrentAffairsController(this._repository);

  final CurrentAffairsRepository _repository;
  final Set<String> _readArticleIds = <String>{};
  List<CurrentAffairsArticle> _articles = const [];
  final Map<String, CurrentAffairsArticle> _articleDetails =
      <String, CurrentAffairsArticle>{};
  String? _selectedCategory;
  var _isLoading = false;
  final Set<String> _loadingArticleIds = <String>{};
  String? _errorMessage;
  String? _premiumRequiredArticleId;

  List<CurrentAffairsArticle> get articles => _articles;
  String? get selectedCategory => _selectedCategory;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  int get readArticleCount => _readArticleIds.length;
  double get readingProgress =>
      articles.isEmpty ? 0 : readArticleCount / articles.length;

  List<String> get categories => articles
      .map((article) => article.category)
      .toSet()
      .toList(growable: false);

  List<CurrentAffairsArticle> get filteredArticles => articles
      .where(
        (article) =>
            _selectedCategory == null || article.category == _selectedCategory,
      )
      .toList(growable: false);

  List<CurrentAffairsArticle> get todaysArticles {
    if (articles.isEmpty) return const [];
    final latestDate = articles
        .map((article) => article.date)
        .reduce((latest, date) => date.isAfter(latest) ? date : latest);
    return articles
        .where((article) => _isSameDay(article.date, latestDate))
        .toList(growable: false);
  }

  CurrentAffairsArticle? articleById(String id) {
    final detailedArticle = _articleDetails[id];
    if (detailedArticle != null) return detailedArticle;
    for (final article in articles) {
      if (article.id == id) return article;
    }
    return null;
  }

  bool isArticleLoading(String articleId) =>
      _loadingArticleIds.contains(articleId);

  bool isPremiumRequired(String articleId) =>
      _premiumRequiredArticleId == articleId;

  Future<void> loadArticles() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _articles = await _repository.loadArticles();
      if (_selectedCategory != null &&
          !categories.contains(_selectedCategory)) {
        _selectedCategory = null;
      }
    } catch (error) {
      _errorMessage = error is CurrentAffairsRepositoryException
          ? error.message
          : 'Unable to load current affairs.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadArticle(String articleId) async {
    if (_articleDetails.containsKey(articleId) ||
        _loadingArticleIds.contains(articleId)) {
      return;
    }
    _loadingArticleIds.add(articleId);
    _errorMessage = null;
    _premiumRequiredArticleId = null;
    notifyListeners();

    try {
      final article = await _repository.loadArticle(articleId);
      _articleDetails[article.id] = article;
      _articles = [
        for (final item in _articles) item.id == article.id ? article : item,
      ];
    } catch (error) {
      if (error is CurrentAffairsRepositoryException) {
        if (error.isPremiumRequired) {
          _premiumRequiredArticleId = articleId;
        }
        _errorMessage = error.message;
      } else {
        _errorMessage = 'Unable to load this article.';
      }
    } finally {
      _loadingArticleIds.remove(articleId);
      notifyListeners();
    }
  }

  bool isArticleRead(String articleId) => _readArticleIds.contains(articleId);

  void selectCategory(String? category) {
    if (category != null && !categories.contains(category)) return;
    if (_selectedCategory == category) return;
    _selectedCategory = category;
    notifyListeners();
  }

  void markArticleRead(String articleId) {
    if (articleById(articleId) == null || !_readArticleIds.add(articleId)) {
      return;
    }
    notifyListeners();
  }

  void clear() {
    _articles = const [];
    _articleDetails.clear();
    _readArticleIds.clear();
    _selectedCategory = null;
    _isLoading = false;
    _loadingArticleIds.clear();
    _errorMessage = null;
    _premiumRequiredArticleId = null;
    notifyListeners();
  }

  static bool _isSameDay(DateTime first, DateTime second) =>
      first.year == second.year &&
      first.month == second.month &&
      first.day == second.day;
}
