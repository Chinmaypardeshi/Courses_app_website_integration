import 'package:flutter/foundation.dart';

import '../../data/repositories/api_authentication_repository.dart';
import '../../domain/repositories/authentication_repository.dart';

/// Keeps local authentication submission state out of page widgets.
class AuthenticationController extends ChangeNotifier {
  AuthenticationController(this._repository);

  final AuthenticationRepository _repository;
  var _isSubmitting = false;
  String? _errorMessage;

  bool get isSubmitting => _isSubmitting;
  String? get errorMessage => _errorMessage;

  Future<bool> signIn({required String email, required String password}) {
    return _run(() => _repository.signIn(email: email, password: password));
  }

  Future<bool> signUp({
    required String fullName,
    required String email,
    required String password,
  }) {
    return _run(
      () => _repository.signUp(
        fullName: fullName,
        email: email,
        password: password,
      ),
    );
  }

  Future<void> signOut() async {
    await _run(_repository.signOut);
  }

  Future<bool> _run(Future<void> Function() action) async {
    _isSubmitting = true;
    _errorMessage = null;
    notifyListeners();
    try {
      await action();
      return true;
    } on AuthenticationApiException catch (error) {
      _errorMessage = error.message;
      return false;
    } catch (_) {
      _errorMessage = 'Unable to complete this request. Please try again.';
      return false;
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }
}
