import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../app/config/app_config.dart';
import '../../domain/models/ai_message.dart';
import '../../domain/repositories/ai_mentor_repository.dart';

class ApiAiMentorRepository implements AiMentorRepository {
  ApiAiMentorRepository({
    http.Client? client,
    String? baseUrl,
    String? Function()? accessTokenProvider,
  })  : _client = client ?? http.Client(),
        _accessTokenProvider = accessTokenProvider,
        _baseUrl = (baseUrl ?? AppConfig.apiBaseUrl).replaceFirst(RegExp(r'/$'), '');

  final http.Client _client;
  final String _baseUrl;
  final String? Function()? _accessTokenProvider;

  @override
  Future<String> sendMessage({
    required String message,
    List<AiMessage> history = const [],
    String? subject,
  }) async {
    final token = _accessTokenProvider?.call();
    final formattedHistory = history.map((m) {
      return {
        'role': m.sender == MessageSender.user ? 'user' : 'assistant',
        'content': m.content,
      };
    }).toList();

    formattedHistory.add({
      'role': 'user',
      'content': message,
    });

    final payload = {
      'message': message,
      'messages': formattedHistory,
      if (subject != null && subject.isNotEmpty) 'subject': subject,
    };

    try {
      final res = await _client.post(
        Uri.parse('$_baseUrl/api/ai/chat'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 25));

      if (res.statusCode >= 200 && res.statusCode < 300) {
        final decoded = jsonDecode(res.body);
        final reply = decoded['reply'] ?? decoded['response'] ?? '';
        if (reply is String && reply.isNotEmpty) {
          return reply;
        }
      }
      return 'The UPSC AI Mentor could not generate an answer right now. Please verify your connection.';
    } catch (e) {
      return 'Unable to reach Aspiria AI service. Please check your connection and try again.';
    }
  }
}
