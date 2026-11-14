enum MessageSender { user, assistant }

class AiMessage {
  const AiMessage({
    required this.id,
    required this.sender,
    required this.content,
    required this.timestamp,
    this.modelUsed,
  });

  final String id;
  final MessageSender sender;
  final String content;
  final DateTime timestamp;
  final String? modelUsed;
}
