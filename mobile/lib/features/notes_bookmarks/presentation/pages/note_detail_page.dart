import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/app_router.dart';
import '../../../../app/theme/app_spacing.dart';
import '../controllers/personal_note_controller.dart';

/// Displays a personal note and provides edit/delete actions.
class NoteDetailPage extends StatelessWidget {
  const NoteDetailPage({
    super.key,
    required this.personalNoteController,
    required this.noteId,
  });

  final PersonalNoteController personalNoteController;
  final String noteId;

  @override
  Widget build(BuildContext context) {
    final note = personalNoteController.noteById(noteId);
    if (note == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Note not found.')),
      );
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text('Personal note'),
        actions: [
          IconButton(
            tooltip: 'Edit note',
            onPressed: () => context.goNamed(
              AppRoute.noteEdit,
              pathParameters: {'noteId': note.id},
            ),
            icon: const Icon(Icons.edit_outlined),
          ),
          IconButton(
            tooltip: 'Delete note',
            onPressed: () async {
              final delete = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Delete note?'),
                  content: const Text(
                    'This session-only note will be removed.',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => context.pop(false),
                      child: const Text('Cancel'),
                    ),
                    FilledButton(
                      onPressed: () => context.pop(true),
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              );
              if (delete == true) {
                personalNoteController.deleteNote(note.id);
                if (context.mounted) {
                  context.goNamed(AppRoute.notes);
                }
              }
            },
            icon: const Icon(Icons.delete_outline_rounded),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.medium),
        children: [
          Text(
            note.title,
            style: Theme.of(context).textTheme.headlineSmall
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          if (note.subject != null || note.contextLabel != null) ...[
            const SizedBox(height: AppSpacing.medium),
            Text(
              [
                note.subject,
                note.contextType?.label,
                note.contextLabel,
              ].whereType<String>().join(' · '),
            ),
          ],
          const SizedBox(height: AppSpacing.large),
          Text(
            note.content,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.5),
          ),
        ],
      ),
    );
  }
}
