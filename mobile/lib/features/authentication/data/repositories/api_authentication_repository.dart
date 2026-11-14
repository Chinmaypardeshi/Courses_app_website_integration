import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../../../app/config/app_config.dart';
import '../../domain/repositories/authentication_repository.dart';

/// Authenticates Aspiria learners through the Node.js REST API.
class ApiAuthenticationRepository extends AuthenticationRepository {
  ApiAuthenticationRepository({http.Client? client, String? baseUrl})
    : _client = client ?? http.Client(),
      _baseUrl = (baseUrl ?? AppConfig.apiBaseUrl).replaceFirst(
        RegExp(r'/$'),
        '',
      );

  final http.Client _client;
  final String _baseUrl;

  bool _isAuthenticated = false;
  String _displayName = 'Aspiria Learner';
  String? _accessToken;

  @override
  bool get isAuthenticated => _isAuthenticated;

  @override
  String get displayName => _displayName;

  /// The current backend-issued token, kept only for this app session.
  String? get accessToken => _accessToken;

  @override
  Future<void> signIn({required String email, required String password}) {
    return _authenticate('/api/auth/login', {
      'email': email,
      'password': password,
    }, expectedStatusCode: 200);
  }

  @override
  Future<void> signUp({
    required String fullName,
    required String email,
    required String password,
  }) {
    return _authenticate('/api/auth/register', {
      'name': fullName,
      'email': email,
      'password': password,
    }, expectedStatusCode: 201);
  }

  @override
  Future<void> signOut() async {
    _isAuthenticated = false;
    _displayName = 'Aspiria Learner';
    _accessToken = null;
    notifyListeners();
  }

  Future<void> _authenticate(
    String path,
    Map<String, String> payload, {
    required int expectedStatusCode,
  }) async {
    try {
      final response = await _client
          .post(
            Uri.parse('$_baseUrl$path'),
            headers: const {'Content-Type': 'application/json'},
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 10));
      final body = _decodeBody(response.body);

      if (response.statusCode != expectedStatusCode) {
        throw AuthenticationApiException(
          _errorMessage(body) ?? 'Unable to authenticate. Please try again.',
        );
      }

      final token = body?['token'];
      final user = body?['user'];
      final name = user is Map<String, dynamic> ? user['name'] : null;
      if (token is! String || token.isEmpty || name is! String || name.isEmpty) {
        throw const AuthenticationApiException(
          'The authentication response was invalid.',
        );
      }

      _accessToken = token;
      _displayName = name;
      _isAuthenticated = true;
      notifyListeners();
    } on AuthenticationApiException {
      rethrow;
    } catch (_) {
      throw const AuthenticationApiException(
        'Unable to connect to Aspiria. Please try again.',
      );
    }
  }

  Map<String, dynamic>? _decodeBody(String value) {
    try {
      final decoded = jsonDecode(value);
      return decoded is Map<String, dynamic> ? decoded : null;
    } on FormatException {
      return null;
    }
  }

  String? _errorMessage(Map<String, dynamic>? body) {
    final error = body?['error'];
    return error is String && error.isNotEmpty ? error : null;
  }
}

class AuthenticationApiException implements Exception {
  const AuthenticationApiException(this.message);

  final String message;
}
