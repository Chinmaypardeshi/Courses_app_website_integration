import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../../../app/config/app_config.dart';
import '../../domain/models/current_affairs_article.dart';
import '../../domain/repositories/current_affairs_repository.dart';

class ApiCurrentAffairsRepository implements CurrentAffairsRepository {
  ApiCurrentAffairsRepository({
    http.Client? client,
    String? baseUrl,
    String? Function()? accessTokenProvider,
  }) : _client = client ?? http.Client(),
       _accessTokenProvider = accessTokenProvider,
       _baseUrl = (baseUrl ?? AppConfig.apiBaseUrl).replaceFirst(
         RegExp(r'/$'),
         '',
       );

  final http.Client _client;
  final String _baseUrl;
  final String? Function()? _accessTokenProvider;

  @override
  Future<List<CurrentAffairsArticle>> loadArticles() async {
    final body = await _request('/api/current-affairs');
    final items = body['currentAffairs'];
    if (items is! List) {
      throw const CurrentAffairsRepositoryException(
        'The current affairs response was invalid.',
      );
    }
    return items
        .whereType<Map<String, dynamic>>()
        .map(CurrentAffairsArticle.fromJson)
        .toList(growable: false);
  }

  @override
  Future<CurrentAffairsArticle> loadArticle(String articleId) async {
    final body = await _request('/api/current-affairs/$articleId');
    final article = body['currentAffair'];
    if (article is! Map<String, dynamic>) {
      throw const CurrentAffairsRepositoryException(
        'The current affairs article response was invalid.',
      );
    }
    return CurrentAffairsArticle.fromJson(article);
  }

  Future<Map<String, dynamic>> _request(String path) async {
    final token = _accessTokenProvider?.call();
    try {
      final response = await _client
          .get(
            Uri.parse('$_baseUrl$path'),
            headers: {
              if (token != null && token.isNotEmpty)
                'Authorization': 'Bearer $token',
            },
          )
          .timeout(const Duration(seconds: 10));
      final decoded = jsonDecode(response.body);
      final body = decoded is Map<String, dynamic> ? decoded : null;
      if (response.statusCode < 200 || response.statusCode >= 300) {
        final error = body?['error'];
        final code = body?['code'];
        throw CurrentAffairsRepositoryException(
          error is String && error.isNotEmpty
              ? error
              : 'Unable to load current affairs.',
          code: code is String ? code : null,
        );
      }
      if (body == null) {
        throw const CurrentAffairsRepositoryException(
          'The current affairs response was invalid.',
        );
      }
      return body;
    } on CurrentAffairsRepositoryException {
      rethrow;
    } catch (_) {
      throw const CurrentAffairsRepositoryException(
        'Unable to connect to current affairs.',
      );
    }
  }
}
