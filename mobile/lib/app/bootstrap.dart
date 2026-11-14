import 'package:flutter/widgets.dart';

import 'app.dart';

/// Initializes the Flutter framework before starting Aspiria.
void bootstrap() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AspiriaApp());
}
