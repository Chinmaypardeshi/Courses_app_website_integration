import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../app/config/app_config.dart';
import '../../domain/models/practice_test.dart';
import '../../domain/models/test_option.dart';
import '../../domain/models/test_question.dart';
import '../../domain/repositories/test_repository.dart';
import 'local_test_repository.dart';

/// Loads live practice tests and questions from the unified backend API,
/// with offline fallback to local catalogue.
class ApiTestRepository implements TestRepository {
  ApiTestRepository({
    http.Client? client,
    String? baseUrl,
  })  : _client = client ?? http.Client(),
        _baseUrl = (baseUrl ?? AppConfig.apiBaseUrl).replaceFirst(RegExp(r'/$'), '') {
    // Populate with baseline data immediately
    _tests = List.of(_fallback.tests);
    _questions = List.of(_fallback.questions);
    // Fetch live updates from unified backend
    fetchRemoteTests();
  }

  final http.Client _client;
  final String _baseUrl;
  final LocalTestRepository _fallback = LocalTestRepository();

  List<PracticeTest> _tests = [];
  List<TestQuestion> _questions = [];

  @override
  List<PracticeTest> get tests => _tests;

  @override
  List<TestQuestion> get questions => _questions;

  Future<void> fetchRemoteTests() async {
    try {
      final res = await _client
          .get(Uri.parse('$_baseUrl/api/tests'))
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        final rawTests = decoded['tests'];
        if (rawTests is List && rawTests.isNotEmpty) {
          final loadedTests = <PracticeTest>[];
          final loadedQuestions = <TestQuestion>[];

          for (final t in rawTests) {
            final testId = (t['id'] ?? t['slug'] ?? '').toString();
            loadedTests.add(PracticeTest(
              id: testId,
              title: t['title'] ?? 'Practice Test',
              subject: t['subjectName'] ?? 'General Studies',
              description: t['description'] ?? '',
              difficulty: (t['difficulty'] ?? 'Medium').toString().toUpperCase(),
              estimatedMinutes: (t['durationMinutes'] as num?)?.toInt() ?? 10,
            ));

            // Fetch questions for this test
            try {
              final qRes = await _client
                  .get(Uri.parse('$_baseUrl/api/tests/$testId'))
                  .timeout(const Duration(seconds: 4));
              if (qRes.statusCode == 200) {
                final qDecoded = jsonDecode(qRes.body);
                final rawQ = qDecoded['questions'];
                if (rawQ is List) {
                  for (final q in rawQ) {
                    final opts = (q['options'] as List? ?? []).map((o) {
                      return TestOption(
                        id: (o['key'] ?? o['option_key'] ?? 'A').toString().toLowerCase(),
                        label: (o['text'] ?? o['option_text'] ?? '').toString(),
                      );
                    }).toList();

                    final correctOpt = (q['options'] as List? ?? []).firstWhere(
                      (o) => o['is_correct'] == true,
                      orElse: () => null,
                    );

                    loadedQuestions.add(TestQuestion(
                      id: (q['id'] ?? '').toString(),
                      testId: testId,
                      prompt: (q['questionText'] ?? q['question_text'] ?? '').toString(),
                      options: opts,
                      correctOptionId: (correctOpt?['key'] ?? 'a').toString().toLowerCase(),
                      explanation: (q['explanation'] ?? '').toString(),
                    ));
                  }
                }
              }
            } catch (_) {
              // Individual question failure non-fatal
            }
          }

          if (loadedTests.isNotEmpty) {
            _tests = [...loadedTests, ..._fallback.tests];
          }
          if (loadedQuestions.isNotEmpty) {
            _questions = [...loadedQuestions, ..._fallback.questions];
          }
        }
      }
    } catch (_) {
      // Fallback remains active
    }
  }
}
