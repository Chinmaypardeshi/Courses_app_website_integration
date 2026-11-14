import 'package:flutter/widgets.dart';

/// Shared corner radii for Aspiria components.
abstract final class AppRadius {
  static const small = BorderRadius.all(Radius.circular(12));
  static const medium = BorderRadius.all(Radius.circular(16));
  static const large = BorderRadius.all(Radius.circular(24));
  static const pill = BorderRadius.all(Radius.circular(999));
}
