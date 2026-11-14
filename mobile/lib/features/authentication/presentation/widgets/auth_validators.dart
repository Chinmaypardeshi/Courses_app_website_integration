/// Validation messages for the local authentication forms.
abstract final class AuthValidators {
  static String? fullName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Enter your full name.';
    }
    return null;
  }

  static String? email(String? value) {
    final email = value?.trim() ?? '';
    if (email.isEmpty) {
      return 'Enter your email address.';
    }
    if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(email)) {
      return 'Enter a valid email address.';
    }
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return 'Enter your password.';
    }
    if (value.length < 6) {
      return 'Use at least 6 characters.';
    }
    return null;
  }

  static String? confirmPassword(String? value, String password) {
    final passwordError = AuthValidators.password(value);
    if (passwordError != null) {
      return passwordError;
    }
    if (value != password) {
      return 'Passwords do not match.';
    }
    return null;
  }
}
