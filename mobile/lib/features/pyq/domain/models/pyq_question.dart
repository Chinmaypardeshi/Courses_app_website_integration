import 'pyq_option.dart';

/// A locally authored question-bank item modelled on UPSC preparation topics.
class PyqQuestion {
  const PyqQuestion({
    required this.id,
    required this.prompt,
    required this.year,
    required this.examCategory,
    required this.subject,
    required this.topic,
    required this.options,
    required this.correctOptionId,
    required this.explanation,
  });

  final String id;
  final String prompt;
  final int year;
  final String examCategory;
  final String subject;
  final String topic;
  final List<PyqOption> options;
  final String correctOptionId;
  final String explanation;
}
