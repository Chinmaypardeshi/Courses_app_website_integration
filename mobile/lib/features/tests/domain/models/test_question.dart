import 'test_option.dart';

/// A locally authored multiple-choice question for a [PracticeTest].
class TestQuestion {
  const TestQuestion({
    required this.id,
    required this.testId,
    required this.prompt,
    required this.options,
    required this.correctOptionId,
    required this.explanation,
  });

  final String id;
  final String testId;
  final String prompt;
  final List<TestOption> options;
  final String correctOptionId;
  final String explanation;
}
