import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_spacing.dart';
import '../../domain/models/personal_note.dart';
import '../controllers/personal_note_controller.dart';

/// Creates or edits one session-only personal note.
class NoteEditorPage extends StatefulWidget {
  const NoteEditorPage({
    super.key,
    required this.personalNoteController,
    this.noteId,
  });

  final PersonalNoteController personalNoteController;
  final String? noteId;

  @override
  State<NoteEditorPage> createState() => _NoteEditorPageState();
}

class _NoteEditorPageState extends State<NoteEditorPage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _titleController;
  late final TextEditingController _contentController;
  late final TextEditingController _subjectController;
  late final TextEditingController _contextController;
  NoteContextType? _contextType;

  PersonalNote? get _note => widget.noteId == null
      ? null
      : widget.personalNoteController.noteById(widget.noteId!);

  @override
  void initState() {
    super.initState();
    final note = _note;
    _titleController = TextEditingController(text: note?.title);
    _contentController = TextEditingController(text: note?.content);
    _subjectController = TextEditingController(text: note?.subject);
    _contextController = TextEditingController(text: note?.contextLabel);
    _contextType = note?.contextType;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    _subjectController.dispose();
    _contextController.dispose();
    super.dispose();
  }

  void _save() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final existing = _note;
    final created = existing == null
        ? widget.personalNoteController.createNote(
            title: _titleController.text,
            content: _contentController.text,
            subject: _subjectController.text,
            contextType: _contextType,
            contextLabel: _contextController.text,
          )
        : widget.personalNoteController.updateNote(
            noteId: existing.id,
            title: _titleController.text,
            content: _contentController.text,
            subject: _subjectController.text,
            contextType: _contextType,
            contextId: existing.contextId,
            contextLabel: _contextController.text,
          )
        ? existing
        : null;
    if (created != null && mounted) context.pop();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.noteId != null && _note == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Note not found.')),
      );
    }
    final editing = _note != null;
    return Scaffold(
      appBar: AppBar(
        title: Text(editing ? 'Edit note' : 'New note'),
        actions: [TextButton(onPressed: _save, child: const Text('Save'))],
      ),
      body: SafeArea(
        top: false,
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(AppSpacing.medium),
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Title',
                  border: OutlineInputBorder(),
                ),
                textInputAction: TextInputAction.next,
                validator: (value) => value?.trim().isEmpty ?? true
                    ? 'Enter a note title.'
                    : null,
              ),
              const SizedBox(height: AppSpacing.medium),
              TextFormField(
                controller: _contentController,
                decoration: const InputDecoration(
                  labelText: 'Content',
                  alignLabelWithHint: true,
                  border: OutlineInputBorder(),
                ),
                minLines: 8,
                maxLines: 14,
                validator: (value) => value?.trim().isEmpty ?? true
                    ? 'Enter note content.'
                    : null,
              ),
              const SizedBox(height: AppSpacing.large),
              Text(
                'Learning context (optional)',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: AppSpacing.medium),
              TextFormField(
                controller: _subjectController,
                decoration: const InputDecoration(
                  labelText: 'Subject',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              DropdownButtonFormField<NoteContextType>(
                initialValue: _contextType,
                decoration: const InputDecoration(
                  labelText: 'Context type',
                  border: OutlineInputBorder(),
                ),
                items: [
                  const DropdownMenuItem<NoteContextType>(
                    value: null,
                    child: Text('No context type'),
                  ),
                  for (final type in NoteContextType.values)
                    DropdownMenuItem(value: type, child: Text(type.label)),
                ],
                onChanged: (value) => setState(() => _contextType = value),
              ),
              const SizedBox(height: AppSpacing.medium),
              TextFormField(
                controller: _contextController,
                decoration: const InputDecoration(
                  labelText: 'Context label',
                  hintText: 'For example, Fundamental Rights',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: AppSpacing.large),
              FilledButton(
                onPressed: _save,
                child: Text(editing ? 'Save changes' : 'Create note'),
              ),
              TextButton(
                onPressed: () => context.pop(),
                child: const Text('Cancel'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
