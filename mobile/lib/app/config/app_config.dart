import 'package:flutter/foundation.dart';

/// Central development configuration for calls to the unified backend.
abstract final class AppConfig {
  /// Resolves the optimal default host:
  /// - Web / Windows / macOS / Linux / iOS: http://localhost:3000
  /// - Android Emulator: http://10.0.2.2:3000
  /// Can be overridden at build time with --dart-define=API_BASE_URL=http://...
  static String get apiBaseUrl {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) return fromEnv;

    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }
}
