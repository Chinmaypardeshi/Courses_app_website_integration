import '../../domain/repositories/authentication_repository.dart';

/// In-memory authentication used only until the backend integration exists.
///
/// This repository does not persist or retain credentials. Any validated sign-in
/// or sign-up action establishes a temporary local session for the running app.
class LocalAuthenticationRepository extends AuthenticationRepository {
  var _isAuthenticated = false;
  var _displayName = 'Aspiria Learner';
  String? _email;

  @override
  bool get isAuthenticated => _isAuthenticated;

  @override
  String get displayName => _displayName;

  @override
  String? get email => _email;

  @override
  String? get accessToken => null;

  @override
  Future<void> signIn({required String email, required String password}) async {
    _isAuthenticated = true;
    _email = email.trim();
    notifyListeners();
  }

  @override
  Future<void> signUp({
    required String fullName,
    required String email,
    required String password,
  }) async {
    _displayName = fullName.trim();
    _isAuthenticated = true;
    _email = email.trim();
    notifyListeners();
  }

  @override
  Future<void> signOut() async {
    _isAuthenticated = false;
    _displayName = 'Aspiria Learner';
    _email = null;
    notifyListeners();
  }
}
