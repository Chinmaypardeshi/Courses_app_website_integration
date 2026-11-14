import '../models/ai_message.dart';

abstract interface class AiMentorRepository {
  Future<String> sendMessage({
    required String message,
    List<AiMessage> history = const [],
    String? subject,
  });
}
