import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../../../app/config/app_config.dart';
import '../../domain/models/subscription_plan.dart';
import '../../domain/models/subscription_status.dart';
import '../../domain/repositories/subscription_repository.dart';

class ApiSubscriptionRepository implements SubscriptionRepository {
  ApiSubscriptionRepository({
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
  Future<List<SubscriptionPlan>> loadPlans() async {
    final body = await _request('/api/subscriptions/plans', requiresAuth: false);
    final plans = body['plans'];
    if (plans is! List) {
      throw const SubscriptionRepositoryException(
        'The subscription plans response was invalid.',
      );
    }
    return plans
        .whereType<Map<String, dynamic>>()
        .map(SubscriptionPlan.fromJson)
        .toList(growable: false);
  }

  @override
  Future<SubscriptionStatus> loadStatus() async {
    final body = await _request('/api/subscriptions/me');
    return SubscriptionStatus.fromJson(body);
  }

  Future<Map<String, dynamic>> _request(
    String path, {
    bool requiresAuth = true,
  }) async {
    final token = _accessTokenProvider?.call();
    if (requiresAuth && (token == null || token.isEmpty)) {
      throw const SubscriptionRepositoryException(
        'Please sign in to view your subscription.',
      );
    }
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
        throw SubscriptionRepositoryException(
          error is String && error.isNotEmpty
              ? error
              : 'Unable to load subscription details.',
        );
      }
      if (body == null) {
        throw const SubscriptionRepositoryException(
          'The subscription response was invalid.',
        );
      }
      return body;
    } on SubscriptionRepositoryException {
      rethrow;
    } catch (_) {
      throw const SubscriptionRepositoryException(
        'Unable to connect to subscriptions.',
      );
    }
  }
}
