import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/pyq/domain/models/pyq_option.dart';
import 'package:flutter/material.dart';

/// A selectable PYQ option with answer feedback after submission.
class PyqOptionTile extends StatelessWidget {
  const PyqOptionTile({
    super.key,
    required this.option,
    required this.selectedOptionId,
    required this.correctOptionId,
    required this.isSubmitted,
    required this.onSelected,
  });

  final PyqOption option;
  final String? selectedOptionId;
  final String correctOptionId;
  final bool isSubmitted;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final isSelected = selectedOptionId == option.id;
    final isCorrect = option.id == correctOptionId;
    final background = isSubmitted && isCorrect
        ? colors.primaryContainer
        : isSubmitted && isSelected
        ? colors.errorContainer
        : isSelected
        ? colors.secondaryContainer
        : colors.surfaceContainerLow;
    final icon = isSubmitted && isCorrect
        ? Icons.check_circle_rounded
        : isSubmitted && isSelected
        ? Icons.cancel_rounded
        : isSelected
        ? Icons.radio_button_checked_rounded
        : Icons.radio_button_unchecked_rounded;
    final iconColor = isSubmitted && isCorrect
        ? colors.primary
        : isSubmitted && isSelected
        ? colors.error
        : colors.onSurfaceVariant;

    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.small),
      child: Material(
        color: background,
        borderRadius: AppRadius.small,
        child: InkWell(
          borderRadius: AppRadius.small,
          onTap: isSubmitted ? null : () => onSelected(option.id),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.medium),
            child: Row(
              children: [
                Icon(icon, color: iconColor),
                const SizedBox(width: AppSpacing.small),
                Expanded(child: Text(option.label)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
