import 'package:flutter/foundation.dart';

/// Contract for authentication state and actions.
///
/// The local implementation is intentionally replaceable by a future API-backed
/// repository without changing presentation code.
abstract class AuthenticationRepository extends ChangeNotifier {
  bool get isAuthenticated;

  String get displayName;

  /// User email associated with the authenticated session, if available.
  String? get email => null;

  /// Backend-issued token for the current session, if the implementation has one.
  String? get accessToken;

  Future<void> signIn({required String email, required String password});

  Future<void> signUp({
    required String fullName,
    required String email,
    required String password,
  });

  Future<void> signOut();
}
