/// Immutable summary of a submitted local test attempt.
class TestAttempt {
  const TestAttempt({
    required this.testId,
    required this.selectedOptionIds,
    required this.correctCount,
    required this.incorrectCount,
    required this.unansweredCount,
    required this.totalQuestions,
  });

  final String testId;
  final Map<String, String> selectedOptionIds;
  final int correctCount;
  final int incorrectCount;
  final int unansweredCount;
  final int totalQuestions;

  int get score => correctCount;
  double get percentage =>
      totalQuestions == 0 ? 0 : (correctCount / totalQuestions) * 100;
}
