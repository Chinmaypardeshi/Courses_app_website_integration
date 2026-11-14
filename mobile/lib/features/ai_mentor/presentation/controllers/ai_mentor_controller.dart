import 'package:flutter/foundation.dart';
import '../../domain/models/ai_message.dart';
import '../../domain/repositories/ai_mentor_repository.dart';

class AiMentorController extends ChangeNotifier {
  AiMentorController(this._repository) {
    // Add initial greeting
    _messages.add(
      AiMessage(
        id: 'msg_welcome',
        sender: MessageSender.assistant,
        content: 'Namaste! I am your 24/7 Aspiria AI Academic Mentor.\n\nAsk me anything on Polity, Modern History, Economics, Ethics case studies, or Mains answer writing frameworks. How can I help you today?',
        timestamp: DateTime.now(),
      ),
    );
  }

  final AiMentorRepository _repository;
  final List<AiMessage> _messages = [];
  bool _isLoading = false;
  String? _selectedSubject;

  List<AiMessage> get messages => List.unmodifiable(_messages);
  bool get isLoading => _isLoading;
  String? get selectedSubject => _selectedSubject;

  void selectSubject(String? subject) {
    _selectedSubject = subject;
    notifyListeners();
  }

  Future<void> sendPrompt(String text) async {
    final cleaned = text.trim();
    if (cleaned.isEmpty || _isLoading) return;

    final userMsg = AiMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}_user',
      sender: MessageSender.user,
      content: cleaned,
      timestamp: DateTime.now(),
    );

    _messages.add(userMsg);
    _isLoading = true;
    notifyListeners();

    try {
      final reply = await _repository.sendMessage(
        message: cleaned,
        history: _messages.sublist(0, _messages.length - 1),
        subject: _selectedSubject,
      );

      final assistantMsg = AiMessage(
        id: 'msg_${DateTime.now().millisecondsSinceEpoch}_ai',
        sender: MessageSender.assistant,
        content: reply,
        timestamp: DateTime.now(),
      );
      _messages.add(assistantMsg);
    } catch (_) {
      _messages.add(
        AiMessage(
          id: 'msg_${DateTime.now().millisecondsSinceEpoch}_err',
          sender: MessageSender.assistant,
          content: 'An error occurred while communicating with the AI mentor. Please try again.',
          timestamp: DateTime.now(),
        ),
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearConversation() {
    _messages.clear();
    _messages.add(
      AiMessage(
        id: 'msg_welcome_${DateTime.now().millisecondsSinceEpoch}',
        sender: MessageSender.assistant,
        content: 'Conversation reset. How can I assist with your UPSC CSE preparation today?',
        timestamp: DateTime.now(),
      ),
    );
    notifyListeners();
  }
}
