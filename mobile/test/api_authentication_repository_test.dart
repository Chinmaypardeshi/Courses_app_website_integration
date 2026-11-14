import 'dart:convert';

import 'package:aspiria/features/authentication/data/repositories/api_authentication_repository.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  test('signs in with the backend response and retains the session user', () async {
    final repository = ApiAuthenticationRepository(
      baseUrl: 'http://example.test',
      client: MockClient((request) async {
        expect(request.method, 'POST');
        expect(request.url.path, '/api/auth/login');
        expect(request.headers['content-type'], 'application/json');
        expect(jsonDecode(request.body), {
          'email': 'learner@example.com',
          'password': 'aspiria123',
        });
        return http.Response(
          '{"user":{"id":"1","name":"Asha Sharma","email":"learner@example.com","role":"student"},"token":"jwt-token"}',
          200,
        );
      }),
    );

    await repository.signIn(
      email: 'learner@example.com',
      password: 'aspiria123',
    );

    expect(repository.isAuthenticated, isTrue);
    expect(repository.displayName, 'Asha Sharma');
    expect(repository.accessToken, 'jwt-token');
  });

  test('does not authenticate when the backend rejects credentials', () async {
    final repository = ApiAuthenticationRepository(
      baseUrl: 'http://example.test',
      client: MockClient(
        (_) async => http.Response(
          '{"error":"Invalid email or password."}',
          401,
        ),
      ),
    );

    await expectLater(
      repository.signIn(email: 'learner@example.com', password: 'wrongpass'),
      throwsA(
        isA<AuthenticationApiException>().having(
          (error) => error.message,
          'message',
          'Invalid email or password.',
        ),
      ),
    );

    expect(repository.isAuthenticated, isFalse);
    expect(repository.accessToken, isNull);
  });

  test('registers with the backend contract and clears the session on logout', () async {
    final repository = ApiAuthenticationRepository(
      baseUrl: 'http://example.test',
      client: MockClient((request) async {
        expect(request.url.path, '/api/auth/register');
        expect(jsonDecode(request.body), {
          'name': 'Asha Sharma',
          'email': 'learner@example.com',
          'password': 'aspiria123',
        });
        return http.Response(
          '{"user":{"id":"1","name":"Asha Sharma"},"token":"jwt-token"}',
          201,
        );
      }),
    );

    await repository.signUp(
      fullName: 'Asha Sharma',
      email: 'learner@example.com',
      password: 'aspiria123',
    );
    await repository.signOut();

    expect(repository.isAuthenticated, isFalse);
    expect(repository.displayName, 'Aspiria Learner');
    expect(repository.accessToken, isNull);
  });
}
