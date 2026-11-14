import 'package:aspiria/features/study/data/repositories/api_study_repository.dart';
import 'package:aspiria/features/study/domain/models/study_catalogue.dart';
import 'package:aspiria/features/study/domain/repositories/study_repository.dart';
import 'package:aspiria/features/study/presentation/controllers/study_controller.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  test('loads and maps the remote study catalogue', () async {
    final client = MockClient((request) async {
      switch (request.url.path) {
        case '/api/study/subjects':
          return http.Response(
            '{"subjects":[{"id":"1","title":"Indian Polity","description":"Constitution"}]}',
            200,
          );
        case '/api/study/courses':
          return http.Response(
            '{"courses":[{"id":"10","subjectId":"1","title":"Foundations","description":"Basics"}]}',
            200,
          );
        case '/api/study/courses/10/lessons':
          return http.Response(
            '{"lessons":[{"id":"100","courseId":"10","title":"Preamble","content":"Lesson content"}]}',
            200,
          );
        default:
          return http.Response('{}', 404);
      }
    });
    final repository = ApiStudyRepository(
      client: client,
      baseUrl: 'http://example.test',
      accessTokenProvider: () => 'token',
    );

    final catalogue = await repository.loadCatalogue();

    expect(catalogue.subjects.single.title, 'Indian Polity');
    expect(catalogue.courses.single.subjectId, '1');
    expect(catalogue.lessons.single.content, 'Lesson content');
  });

  test('loads and updates authenticated lesson progress', () async {
    final client = MockClient((request) async {
      expect(request.headers['authorization'], 'Bearer jwt-token');
      if (request.method == 'GET' && request.url.path == '/api/study/progress') {
        return http.Response('{"completedLessonIds":["100"]}', 200);
      }
      if (request.method == 'PUT' &&
          request.url.path == '/api/study/lessons/100/progress') {
        expect(request.body, '{"completed":true}');
        return http.Response('{"lessonId":"100","completed":true}', 200);
      }
      return http.Response('{}', 404);
    });
    final repository = ApiStudyRepository(
      client: client,
      baseUrl: 'http://example.test',
      accessTokenProvider: () => 'jwt-token',
    );

    expect(await repository.loadCompletedLessonIds(), {'100'});
    await repository.setLessonComplete('100', true);
  });

  test('reports an expired study-progress session', () async {
    final repository = ApiStudyRepository(
      client: MockClient(
        (_) async => http.Response('{"error":"Unauthorized"}', 401),
      ),
      baseUrl: 'http://example.test',
      accessTokenProvider: () => 'expired-token',
    );

    await expectLater(
      repository.loadCompletedLessonIds(),
      throwsA(
        isA<StudyApiException>().having(
          (error) => error.message,
          'message',
          'Your session has expired. Please sign in again.',
        ),
      ),
    );
  });

  test('exposes a retryable error state when the catalogue is unavailable', () async {
    final controller = StudyController(_FailingStudyRepository());

    await controller.loadCatalogue();

    expect(controller.isLoading, isFalse);
    expect(controller.errorMessage, isNotNull);
    expect(controller.subjects, isEmpty);
  });
}

class _FailingStudyRepository implements StudyRepository {
  @override
  Future<StudyCatalogue> loadCatalogue() =>
      Future<StudyCatalogue>.error(Exception('Network unavailable'));

  @override
  Future<Set<String>> loadCompletedLessonIds() async => <String>{};

  @override
  Future<void> setLessonComplete(String lessonId, bool isComplete) async {}
}
