import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/tests/domain/models/test_option.dart';
import 'package:flutter/material.dart';

/// A selectable answer option for a single-choice practice question.
class AnswerOptionTile extends StatelessWidget {
  const AnswerOptionTile({
    super.key,
    required this.option,
    required this.selectedOptionId,
    required this.onSelected,
  });

  final TestOption option;
  final String? selectedOptionId;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final isSelected = selectedOptionId == option.id;
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.small),
      child: Material(
        color: isSelected ? colors.secondaryContainer : colors.surfaceContainerLow,
        borderRadius: AppRadius.small,
        child: InkWell(
          borderRadius: AppRadius.small,
          onTap: () => onSelected(option.id),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.small),
            child: RadioListTile<String>(
              value: option.id,
              groupValue: selectedOptionId,
              onChanged: (value) {
                if (value != null) onSelected(value);
              },
              title: Text(option.label),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.small,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
