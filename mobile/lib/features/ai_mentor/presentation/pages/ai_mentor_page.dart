import 'package:flutter/material.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../domain/models/ai_message.dart';
import '../controllers/ai_mentor_controller.dart';

class AiMentorPage extends StatefulWidget {
  const AiMentorPage({super.key, required this.controller});

  final AiMentorController controller;

  @override
  State<AiMentorPage> createState() => _AiMentorPageState();
}

class _AiMentorPageState extends State<AiMentorPage> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<String> _subjects = const [
    'All Subjects',
    'Polity (GS 2)',
    'History (GS 1)',
    'Economy (GS 3)',
    'Environment',
    'Ethics (GS 4)',
  ];

  final List<String> _quickPrompts = const [
    'Explain Basic Structure Doctrine with case laws',
    'How to structure a 10-mark Mains answer?',
    'Summarize Key provisions of Article 21',
    'Inflation targeting framework in India',
  ];

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSend([String? text]) {
    final prompt = text ?? _textController.text;
    if (prompt.trim().isEmpty) return;
    _textController.clear();
    widget.controller.sendPrompt(prompt);
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('UPSC AI Academic Mentor'),
            Text(
              'Powered by Groq LLaMA 3.3',
              style: textTheme.labelSmall?.copyWith(color: colors.primary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Clear Chat',
            icon: const Icon(Icons.refresh_rounded),
            onPressed: widget.controller.clearConversation,
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Subject chips selector
            SizedBox(
              height: 48,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.medium, vertical: AppSpacing.xSmall),
                scrollDirection: Axis.horizontal,
                itemCount: _subjects.length,
                separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.small),
                itemBuilder: (context, index) {
                  final sub = _subjects[index];
                  final isSelected = (widget.controller.selectedSubject == null && index == 0) ||
                      widget.controller.selectedSubject == sub;
                  return ChoiceChip(
                    label: Text(sub),
                    selected: isSelected,
                    onSelected: (selected) {
                      widget.controller.selectSubject(index == 0 ? null : sub);
                    },
                  );
                },
              ),
            ),
            const Divider(height: 1),

            // Messages List
            Expanded(
              child: AnimatedBuilder(
                animation: widget.controller,
                builder: (context, _) {
                  final messages = widget.controller.messages;
                  WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());

                  return ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(AppSpacing.medium),
                    itemCount: messages.length + (widget.controller.isLoading ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == messages.length) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: AppSpacing.small),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 16,
                                backgroundColor: colors.primaryContainer,
                                child: Icon(Icons.auto_awesome, size: 18, color: colors.primary),
                              ),
                              const SizedBox(width: AppSpacing.small),
                              Card(
                                elevation: 0,
                                color: colors.surfaceContainerHighest,
                                child: const Padding(
                                  padding: EdgeInsets.symmetric(horizontal: AppSpacing.medium, vertical: AppSpacing.small),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      SizedBox(
                                        width: 14,
                                        height: 14,
                                        child: CircularProgressIndicator(strokeWidth: 2),
                                      ),
                                      SizedBox(width: AppSpacing.small),
                                      Text('Aspiria AI is researching...'),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      }

                      final msg = messages[index];
                      final isUser = msg.sender == MessageSender.user;

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: AppSpacing.xSmall),
                        child: Row(
                          mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (!isUser) ...[
                              CircleAvatar(
                                radius: 16,
                                backgroundColor: colors.primaryContainer,
                                child: Icon(Icons.auto_awesome, size: 16, color: colors.primary),
                              ),
                              const SizedBox(width: AppSpacing.small),
                            ],
                            Flexible(
                              child: Container(
                                padding: const EdgeInsets.all(AppSpacing.medium),
                                decoration: BoxDecoration(
                                  color: isUser ? colors.primary : colors.surfaceContainerHighest,
                                  borderRadius: BorderRadius.only(
                                    topLeft: const Radius.circular(16),
                                    topRight: const Radius.circular(16),
                                    bottomLeft: Radius.circular(isUser ? 16 : 4),
                                    bottomRight: Radius.circular(isUser ? 4 : 16),
                                  ),
                                ),
                                child: SelectableText(
                                  msg.content,
                                  style: textTheme.bodyMedium?.copyWith(
                                    color: isUser ? colors.onPrimary : colors.onSurface,
                                    height: 1.4,
                                  ),
                                ),
                              ),
                            ),
                            if (isUser) const SizedBox(width: 8),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ),

            // Quick Prompt suggestions (if few messages)
            AnimatedBuilder(
              animation: widget.controller,
              builder: (context, _) {
                if (widget.controller.messages.length > 2 || widget.controller.isLoading) {
                  return const SizedBox.shrink();
                }
                return Container(
                  height: 40,
                  margin: const EdgeInsets.only(bottom: AppSpacing.xSmall),
                  child: ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.medium),
                    scrollDirection: Axis.horizontal,
                    itemCount: _quickPrompts.length,
                    separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.small),
                    itemBuilder: (context, idx) {
                      return ActionChip(
                        avatar: const Icon(Icons.bolt, size: 14),
                        label: Text(_quickPrompts[idx], style: const TextStyle(fontSize: 12)),
                        onPressed: () => _handleSend(_quickPrompts[idx]),
                      );
                    },
                  ),
                );
              },
            ),

            // Input Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.medium, vertical: AppSpacing.small),
              decoration: BoxDecoration(
                color: colors.surface,
                border: Border(top: BorderSide(color: colors.outlineVariant.withOpacity(0.5))),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: InputDecoration(
                        hintText: 'Ask UPSC concept, case laws, syllabus doubt...',
                        hintStyle: textTheme.bodySmall?.copyWith(color: colors.onSurfaceVariant),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide(color: colors.outlineVariant),
                        ),
                      ),
                      onSubmitted: (val) => _handleSend(),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.small),
                  IconButton.filled(
                    icon: const Icon(Icons.send_rounded),
                    onPressed: () => _handleSend(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
