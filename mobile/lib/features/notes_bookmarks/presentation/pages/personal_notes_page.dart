import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/app_router.dart';
import '../../../../app/theme/app_spacing.dart';
import '../controllers/personal_note_controller.dart';
import '../widgets/note_card.dart';

/// Searches and filters personal notes saved during this session.
class PersonalNotesPage extends StatelessWidget {
  const PersonalNotesPage({super.key, required this.personalNoteController});

  final PersonalNoteController personalNoteController;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: AnimatedBuilder(
      animation: personalNoteController,
      builder: (context, _) {
        final colors = Theme.of(context).colorScheme;
        final textTheme = Theme.of(context).textTheme;
        final notes = personalNoteController.filteredNotes;
        return ListView(
          padding: const EdgeInsets.all(AppSpacing.medium),
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Personal Notes',
                    style: textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                FilledButton.icon(
                  onPressed: () => context.goNamed(AppRoute.noteEditor),
                  icon: const Icon(Icons.add_rounded),
                  label: const Text('New note'),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              'Notes are available for this session only.',
              style: textTheme.bodyMedium?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppSpacing.large),
            TextField(
              onChanged: personalNoteController.setSearchQuery,
              decoration: const InputDecoration(
                labelText: 'Search notes',
                prefixIcon: Icon(Icons.search_rounded),
                border: OutlineInputBorder(),
              ),
            ),
            if (personalNoteController.subjects.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.medium),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    ChoiceChip(
                      label: const Text('All subjects'),
                      selected: personalNoteController.selectedSubject == null,
                      onSelected: (_) =>
                          personalNoteController.selectSubject(null),
                    ),
                    for (final subject in personalNoteController.subjects) ...[
                      const SizedBox(width: AppSpacing.small),
                      ChoiceChip(
                        label: Text(subject),
                        selected:
                            personalNoteController.selectedSubject == subject,
                        onSelected: (_) =>
                            personalNoteController.selectSubject(subject),
                      ),
                    ],
                  ],
                ),
              ),
            ],
            const SizedBox(height: AppSpacing.large),
            if (notes.isEmpty)
              _EmptyNotes(onCreate: () => context.goNamed(AppRoute.noteEditor))
            else
              for (final note in notes) ...[
                NoteCard(
                  note: note,
                  onTap: () => context.goNamed(
                    AppRoute.noteDetail,
                    pathParameters: {'noteId': note.id},
                  ),
                ),
                const SizedBox(height: AppSpacing.medium),
              ],
          ],
        );
      },
    ),
  );
}

class _EmptyNotes extends StatelessWidget {
  const _EmptyNotes({required this.onCreate});
  final VoidCallback onCreate;

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(AppSpacing.large),
      child: Column(
        children: [
          const Icon(Icons.sticky_note_2_outlined, size: 48),
          const SizedBox(height: AppSpacing.medium),
          Text(
            'No notes found',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: AppSpacing.xSmall),
          const Text(
            'Create a note to capture a revision insight or learning context.',
          ),
          const SizedBox(height: AppSpacing.medium),
          OutlinedButton(onPressed: onCreate, child: const Text('Create note')),
        ],
      ),
    ),
  );
}
