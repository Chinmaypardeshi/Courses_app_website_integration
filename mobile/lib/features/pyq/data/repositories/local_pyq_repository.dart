import '../../domain/models/pyq_option.dart';
import '../../domain/models/pyq_question.dart';
import '../../domain/repositories/pyq_repository.dart';

/// Locally authored UPSC-style demonstration questions, not official PYQs.
class LocalPyqRepository implements PyqRepository {
  @override
  List<PyqQuestion> get questions => _questions;

  static const _questions = <PyqQuestion>[
    PyqQuestion(
      id: 'pyq-polity-remedies',
      prompt: 'Which institution is primarily empowered to issue writs for enforcement of Fundamental Rights?',
      year: 2023,
      examCategory: 'UPSC Prelims',
      subject: 'Indian Polity',
      topic: 'Fundamental Rights',
      options: [
        PyqOption(id: 'a', label: 'The Supreme Court and High Courts'),
        PyqOption(id: 'b', label: 'The Election Commission'),
        PyqOption(id: 'c', label: 'The Finance Commission'),
        PyqOption(id: 'd', label: 'The Union Public Service Commission'),
      ],
      correctOptionId: 'a',
      explanation: 'Articles 32 and 226 empower the Supreme Court and High Courts respectively to issue writs for the enforcement of rights.',
    ),
    PyqQuestion(
      id: 'pyq-history-1857',
      prompt: 'Which approach best explains why the Revolt of 1857 spread across several regions?',
      year: 2022,
      examCategory: 'UPSC Prelims',
      subject: 'Indian History',
      topic: 'Revolt of 1857',
      options: [
        PyqOption(
          id: 'a',
          label: 'It was caused only by a single military grievance.',
        ),
        PyqOption(
          id: 'b',
          label: 'It combined military, political, economic, and social grievances.',
        ),
        PyqOption(id: 'c', label: 'It was limited to coastal trading centres.'),
        PyqOption(id: 'd', label: 'It began as a post-independence movement.'),
      ],
      correctOptionId: 'b',
      explanation: 'The uprising reflected several overlapping grievances against Company rule, which helps explain its regional spread and varied participation.',
    ),
    PyqQuestion(
      id: 'pyq-geography-monsoon',
      prompt: 'Which factor most directly contributes to the seasonal reversal of winds over the Indian subcontinent?',
      year: 2023,
      examCategory: 'UPSC Prelims',
      subject: 'Geography',
      topic: 'Indian Monsoon',
      options: [
        PyqOption(id: 'a', label: 'Differential heating of land and sea'),
        PyqOption(id: 'b', label: 'Earthquake activity in the Himalayas'),
        PyqOption(id: 'c', label: 'Changes in ocean salinity alone'),
        PyqOption(id: 'd', label: 'Rotation of the Moon around Earth'),
      ],
      correctOptionId: 'a',
      explanation: 'Differential heating creates seasonal pressure differences that, together with other atmospheric factors, drive monsoon wind reversal.',
    ),
    PyqQuestion(
      id: 'pyq-economy-inflation',
      prompt:
          'A sustained rise in the general price level is best described as:',
      year: 2021,
      examCategory: 'UPSC Prelims',
      subject: 'Economy',
      topic: 'Inflation',
      options: [
        PyqOption(id: 'a', label: 'Deflation'),
        PyqOption(id: 'b', label: 'Inflation'),
        PyqOption(id: 'c', label: 'Depreciation only'),
        PyqOption(id: 'd', label: 'Fiscal deficit'),
      ],
      correctOptionId: 'b',
      explanation: 'Inflation refers to a sustained increase in the overall price level, reducing the purchasing power of money.',
    ),
    PyqQuestion(
      id: 'pyq-environment-biodiversity',
      prompt: 'Which is an example of in-situ biodiversity conservation?',
      year: 2022,
      examCategory: 'UPSC Prelims',
      subject: 'Environment',
      topic: 'Biodiversity Conservation',
      options: [
        PyqOption(id: 'a', label: 'A seed bank'),
        PyqOption(id: 'b', label: 'A botanical garden'),
        PyqOption(id: 'c', label: 'A national park'),
        PyqOption(id: 'd', label: 'A zoo breeding programme'),
      ],
      correctOptionId: 'c',
      explanation: 'In-situ conservation protects species in their natural habitats, such as national parks and wildlife sanctuaries.',
    ),
    PyqQuestion(
      id: 'pyq-csat-ratio',
      prompt: 'A learner answers 18 of 24 questions correctly. What percentage is correct?',
      year: 2021,
      examCategory: 'CSAT',
      subject: 'CSAT',
      topic: 'Basic Arithmetic',
      options: [
        PyqOption(id: 'a', label: '65%'),
        PyqOption(id: 'b', label: '70%'),
        PyqOption(id: 'c', label: '75%'),
        PyqOption(id: 'd', label: '80%'),
      ],
      correctOptionId: 'c',
      explanation: '18 ÷ 24 = 0.75, which equals 75%.',
    ),
  ];
}
