import '../../domain/models/practice_test.dart';
import '../../domain/models/test_option.dart';
import '../../domain/models/test_question.dart';
import '../../domain/repositories/test_repository.dart';

/// Deterministic UPSC practice content used until remote tests are connected.
class LocalTestRepository implements TestRepository {
  @override
  List<PracticeTest> get tests => _tests;

  @override
  List<TestQuestion> get questions => _questions;

  static const _tests = <PracticeTest>[
    PracticeTest(id: 'polity-basics', title: 'Polity Basics', subject: 'Indian Polity', description: 'Check your grasp of constitutional foundations.', difficulty: 'Beginner', estimatedMinutes: 5),
    PracticeTest(id: 'history-modern', title: 'Modern History Quick Check', subject: 'Indian History', description: 'Revisit defining moments of the freedom struggle.', difficulty: 'Beginner', estimatedMinutes: 5),
    PracticeTest(id: 'geo-environment', title: 'Geography & Environment', subject: 'Geography · Environment', description: 'Apply core physical geography and ecology concepts.', difficulty: 'Intermediate', estimatedMinutes: 5),
    PracticeTest(id: 'economy-current', title: 'Economy & Current Affairs', subject: 'Economy · Current Affairs', description: 'Connect economic terms with contemporary issues.', difficulty: 'Intermediate', estimatedMinutes: 5),
    PracticeTest(id: 'csat-reasoning', title: 'CSAT Reasoning Drill', subject: 'CSAT', description: 'Practice concise logical and quantitative reasoning.', difficulty: 'Beginner', estimatedMinutes: 5),
  ];

  static const _questions = <TestQuestion>[
    TestQuestion(id: 'polity-1', testId: 'polity-basics', prompt: 'Which part of the Constitution states its guiding ideals?', options: [TestOption(id: 'a', label: 'The Preamble'), TestOption(id: 'b', label: 'The Schedules'), TestOption(id: 'c', label: 'Directive Principles only'), TestOption(id: 'd', label: 'The Appendices')], correctOptionId: 'a', explanation: 'The Preamble expresses the Constitution’s core ideals, including justice, liberty, equality, and fraternity.'),
    TestQuestion(id: 'polity-2', testId: 'polity-basics', prompt: 'India follows which form of government at the Union level?', options: [TestOption(id: 'a', label: 'Presidential system'), TestOption(id: 'b', label: 'Parliamentary system'), TestOption(id: 'c', label: 'Direct democracy'), TestOption(id: 'd', label: 'Military system')], correctOptionId: 'b', explanation: 'India has a parliamentary system in which the Council of Ministers is collectively responsible to the Lok Sabha.'),
    TestQuestion(id: 'polity-3', testId: 'polity-basics', prompt: 'Universal adult franchise means that:', options: [TestOption(id: 'a', label: 'Only taxpayers can vote'), TestOption(id: 'b', label: 'Every adult citizen can vote, subject to law'), TestOption(id: 'c', label: 'Only graduates can vote'), TestOption(id: 'd', label: 'Voting is optional for legislators')], correctOptionId: 'b', explanation: 'Universal adult franchise gives adult citizens the right to vote without discrimination based on property, education, or social status.'),
    TestQuestion(id: 'history-1', testId: 'history-modern', prompt: 'The Revolt of 1857 began at which place?', options: [TestOption(id: 'a', label: 'Meerut'), TestOption(id: 'b', label: 'Kolkata'), TestOption(id: 'c', label: 'Pune'), TestOption(id: 'd', label: 'Madras')], correctOptionId: 'a', explanation: 'The uprising began at Meerut in May 1857 before spreading to several centres in north and central India.'),
    TestQuestion(id: 'history-2', testId: 'history-modern', prompt: 'The Indian National Congress was founded in:', options: [TestOption(id: 'a', label: '1757'), TestOption(id: 'b', label: '1857'), TestOption(id: 'c', label: '1885'), TestOption(id: 'd', label: '1947')], correctOptionId: 'c', explanation: 'The Indian National Congress was founded in 1885 and became central to India’s national movement.'),
    TestQuestion(id: 'geo-1', testId: 'geo-environment', prompt: 'Which mountain range acts as a major climatic barrier for India?', options: [TestOption(id: 'a', label: 'Aravallis'), TestOption(id: 'b', label: 'Himalayas'), TestOption(id: 'c', label: 'Vindhyas'), TestOption(id: 'd', label: 'Satpuras')], correctOptionId: 'b', explanation: 'The Himalayas influence the monsoon and block cold central Asian winds from entering much of the subcontinent.'),
    TestQuestion(id: 'geo-2', testId: 'geo-environment', prompt: 'In an ecosystem, energy primarily flows through:', options: [TestOption(id: 'a', label: 'Food chains'), TestOption(id: 'b', label: 'Rock cycles'), TestOption(id: 'c', label: 'Legislatures'), TestOption(id: 'd', label: 'Rain gauges')], correctOptionId: 'a', explanation: 'Energy moves from producers to consumers through food chains and food webs.'),
    TestQuestion(id: 'economy-1', testId: 'economy-current', prompt: 'Real GDP differs from nominal GDP because it accounts for:', options: [TestOption(id: 'a', label: 'Population only'), TestOption(id: 'b', label: 'Price changes'), TestOption(id: 'c', label: 'Exports only'), TestOption(id: 'd', label: 'Government jobs only')], correctOptionId: 'b', explanation: 'Real GDP adjusts output for price changes, allowing more meaningful comparison across time.'),
    TestQuestion(id: 'economy-2', testId: 'economy-current', prompt: 'A balanced current-affairs note should connect an issue to:', options: [TestOption(id: 'a', label: 'Only a headline'), TestOption(id: 'b', label: 'The UPSC syllabus and relevant context'), TestOption(id: 'c', label: 'One social-media post'), TestOption(id: 'd', label: 'Only personal opinion')], correctOptionId: 'b', explanation: 'Mapping a news issue to the syllabus helps build analytical, revision-ready notes.'),
    TestQuestion(id: 'csat-1', testId: 'csat-reasoning', prompt: 'If every A is B and every B is C, which statement must be true?', options: [TestOption(id: 'a', label: 'Every C is A'), TestOption(id: 'b', label: 'Every A is C'), TestOption(id: 'c', label: 'No A is C'), TestOption(id: 'd', label: 'Every B is A')], correctOptionId: 'b', explanation: 'If A is a subset of B and B is a subset of C, A is necessarily a subset of C.'),
    TestQuestion(id: 'csat-2', testId: 'csat-reasoning', prompt: 'A value rises from 40 to 50. What is the percentage increase?', options: [TestOption(id: 'a', label: '10%'), TestOption(id: 'b', label: '20%'), TestOption(id: 'c', label: '25%'), TestOption(id: 'd', label: '50%')], correctOptionId: 'c', explanation: 'The increase is 10 on a base of 40, so the percentage increase is 10/40 × 100 = 25%.'),
    TestQuestion(id: 'csat-3', testId: 'csat-reasoning', prompt: 'When interpreting a data table, the best first step is to:', options: [TestOption(id: 'a', label: 'Read every number at once'), TestOption(id: 'b', label: 'Identify what the question asks'), TestOption(id: 'c', label: 'Ignore units'), TestOption(id: 'd', label: 'Choose the largest value')], correctOptionId: 'b', explanation: 'Starting with the question narrows attention to the relevant rows, columns, and units.'),
  ];
}
