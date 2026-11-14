import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../../../app/config/app_config.dart';
import '../../domain/models/study_catalogue.dart';
import '../../domain/models/study_course.dart';
import '../../domain/models/study_lesson.dart';
import '../../domain/models/study_subject.dart';
import '../../domain/repositories/study_repository.dart';

/// Loads the Study catalogue and authenticated learner progress from the API.
class ApiStudyRepository implements StudyRepository {
  ApiStudyRepository({
    http.Client? client,
    String? baseUrl,
    String? Function()? accessTokenProvider,
  })
    : _client = client ?? http.Client(),
      _accessTokenProvider = accessTokenProvider,
      _baseUrl = (baseUrl ?? AppConfig.apiBaseUrl).replaceFirst(
        RegExp(r'/$'),
        '',
      );

  final http.Client _client;
  final String _baseUrl;
  final String? Function()? _accessTokenProvider;

  @override
  Future<StudyCatalogue> loadCatalogue() async {
    final responses = await Future.wait([
      _getList('/api/study/subjects', 'subjects'),
      _getList('/api/study/courses', 'courses'),
    ]);
    final subjects = responses[0]
        .map(StudySubject.fromJson)
        .toList(growable: false);
    final courses = responses[1]
        .map(StudyCourse.fromJson)
        .toList(growable: false);
    final lessonResponses = await Future.wait(
      courses.map(
        (course) =>
            _getList('/api/study/courses/${course.id}/lessons', 'lessons'),
      ),
    );
    final lessons = lessonResponses
        .expand((items) => items)
        .map(StudyLesson.fromJson)
        .toList(growable: false);
    return StudyCatalogue(subjects: subjects, courses: courses, lessons: lessons);
  }

  @override
  Future<Set<String>> loadCompletedLessonIds() async {
    final token = _accessTokenProvider?.call();
    if (token == null || token.isEmpty) {
      return <String>{};
    }
    final body = await _authorizedRequest(
      method: 'GET',
      path: '/api/study/progress',
      token: token,
    );
    final completedLessonIds = body['completedLessonIds'];
    if (completedLessonIds is! List ||
        completedLessonIds.any((id) => id is! String)) {
      throw const StudyApiException('The saved study progress was invalid.');
    }
    return completedLessonIds.cast<String>().toSet();
  }

  @override
  Future<void> setLessonComplete(String lessonId, bool isComplete) async {
    final token = _accessTokenProvider?.call();
    if (token == null || token.isEmpty) {
      throw const StudyApiException('Please sign in to save study progress.');
    }
    await _authorizedRequest(
      method: 'PUT',
      path: '/api/study/lessons/$lessonId/progress',
      token: token,
      body: {'completed': isComplete},
    );
  }

  Future<List<Map<String, dynamic>>> _getList(String path, String key) async {
    try {
      final response = await _client
          .get(Uri.parse('$_baseUrl$path'))
          .timeout(const Duration(seconds: 10));
      if (response.statusCode != 200) {
        throw StudyApiException('The study catalogue could not be loaded.');
      }
      final body = jsonDecode(response.body);
      if (body is! Map<String, dynamic> || body[key] is! List) {
        throw StudyApiException('The study catalogue response was invalid.');
      }
      return body[key]
          .whereType<Map<String, dynamic>>()
          .toList(growable: false);
    } on StudyApiException {
      rethrow;
    } catch (_) {
      throw StudyApiException('Unable to connect to the study catalogue.');
    }
  }

  Future<Map<String, dynamic>> _authorizedRequest({
    required String method,
    required String path,
    required String token,
    Map<String, dynamic>? body,
  }) async {
    try {
      final request = http.Request(method, Uri.parse('$_baseUrl$path'))
        ..headers.addAll({
          'Authorization': 'Bearer $token',
          if (body != null) 'Content-Type': 'application/json',
        });
      if (body != null) request.body = jsonEncode(body);
      final streamedResponse = await _client
          .send(request)
          .timeout(const Duration(seconds: 10));
      final response = await http.Response.fromStream(streamedResponse);
      final decoded = jsonDecode(response.body);
      final responseBody = decoded is Map<String, dynamic> ? decoded : null;
      if (response.statusCode == 401) {
        throw const StudyApiException('Your session has expired. Please sign in again.');
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        final error = responseBody?['error'];
        throw StudyApiException(
          error is String && error.isNotEmpty
              ? error
              : 'Unable to save study progress. Please try again.',
        );
      }
      if (responseBody == null) {
        throw const StudyApiException('The study progress response was invalid.');
      }
      return responseBody;
    } on StudyApiException {
      rethrow;
    } catch (_) {
      throw const StudyApiException('Unable to connect to study progress.');
    }
  }
}

class StudyApiException extends StudyRepositoryException {
  const StudyApiException(super.message);
}
