import 'package:flutter/foundation.dart';

/// Central development configuration for calls to the unified backend.
abstract final class AppConfig {
  /// Resolves the backend base URL.
  /// Defaults to the live production Render backend service:
  /// https://courses-app-website-integration.onrender.com
  /// Can be overridden at run time with:
  /// --dart-define=API_BASE_URL=http://localhost:3000 (or http://10.0.2.2:3000 for local Android emulator)
  static String get apiBaseUrl {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) return fromEnv;

    return 'https://courses-app-website-integration.onrender.com';
  }
}
