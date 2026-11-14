/// A short UPSC practice test in the local catalogue.
class PracticeTest {
  const PracticeTest({
    required this.id,
    required this.title,
    required this.subject,
    required this.description,
    required this.difficulty,
    required this.estimatedMinutes,
  });

  final String id;
  final String title;
  final String subject;
  final String description;
  final String difficulty;
  final int estimatedMinutes;
}
