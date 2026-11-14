import 'package:flutter/material.dart';

import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../domain/models/subscription_plan.dart';
import '../../domain/models/subscription_status.dart';
import '../controllers/subscription_controller.dart';

class SubscriptionPage extends StatefulWidget {
  const SubscriptionPage({super.key, required this.subscriptionController});

  final SubscriptionController subscriptionController;

  @override
  State<SubscriptionPage> createState() => _SubscriptionPageState();
}

class _SubscriptionPageState extends State<SubscriptionPage> {
  SubscriptionController get _controller => widget.subscriptionController;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onChanged);
    if (!_controller.isLoading && _controller.status == null) {
      _controller.load();
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_onChanged);
    super.dispose();
  }

  void _onChanged() => setState(() {});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Subscription')),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _controller.load,
          child: ListView(
            padding: const EdgeInsets.all(AppSpacing.medium),
            children: [
              Text(
                'Aspiria Premium',
                style: textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: AppSpacing.small),
              Text(
                'Unlock premium lessons, focused practice, and advanced study resources as they become available.',
                style: textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: AppSpacing.large),
              if (_controller.isLoading)
                const _LoadingState()
              else if (_controller.errorMessage != null)
                _ErrorState(
                  message: _controller.errorMessage!,
                  onRetry: _controller.load,
                )
              else ...[
                _StatusCard(status: _controller.status),
                const SizedBox(height: AppSpacing.large),
                _PaywallCard(hasPremiumAccess: _controller.hasPremiumAccess),
                const SizedBox(height: AppSpacing.large),
                _PlansSection(plans: _controller.plans),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _LoadingState extends StatelessWidget {
  const _LoadingState();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(AppSpacing.large),
        child: Center(child: CircularProgressIndicator()),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.error_outline_rounded, color: colors.error),
            const SizedBox(height: AppSpacing.small),
            Text(message),
            const SizedBox(height: AppSpacing.medium),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Try again'),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({required this.status});

  final SubscriptionStatus? status;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final hasPremiumAccess = status?.hasPremiumAccess ?? false;
    final plan = status?.plan;
    final subscription = status?.subscription;

    return Card(
      color: hasPremiumAccess
          ? colors.primaryContainer
          : colors.surfaceContainerHighest,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.medium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  hasPremiumAccess
                      ? Icons.verified_rounded
                      : Icons.lock_outline_rounded,
                  color: hasPremiumAccess
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant,
                ),
                const SizedBox(width: AppSpacing.small),
                Expanded(
                  child: Text(
                    hasPremiumAccess ? 'Premium active' : 'Free plan',
                    style: textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.small),
            Text(
              hasPremiumAccess
                  ? '${plan?.name ?? 'Premium'} access is enabled for this account.'
                  : 'Upgrade is not connected to payment yet. An admin can activate access while billing is being prepared.',
              style: textTheme.bodyMedium,
            ),
            if (subscription?.expiresAt != null) ...[
              const SizedBox(height: AppSpacing.small),
              Text(
                'Valid until ${_formatDate(subscription!.expiresAt!)}',
                style: textTheme.bodySmall?.copyWith(
                  color: hasPremiumAccess
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _PaywallCard extends StatelessWidget {
  const _PaywallCard({required this.hasPremiumAccess});

  final bool hasPremiumAccess;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Container(
      decoration: BoxDecoration(
        borderRadius: AppRadius.medium,
        border: Border.all(color: colors.outlineVariant),
        color: colors.surface,
      ),
      padding: const EdgeInsets.all(AppSpacing.medium),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.workspace_premium_rounded, color: colors.primary),
              const SizedBox(width: AppSpacing.small),
              Text(
                'Premium access',
                style: textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.small),
          Text(
            hasPremiumAccess
                ? 'Premium learning areas are available on this account.'
                : 'Premium areas will show a lock until your subscription is active.',
          ),
          const SizedBox(height: AppSpacing.medium),
          Wrap(
            spacing: AppSpacing.small,
            runSpacing: AppSpacing.small,
            children: const [
              _FeatureChip(label: 'Premium courses'),
              _FeatureChip(label: 'Advanced practice'),
              _FeatureChip(label: 'Exclusive materials'),
            ],
          ),
        ],
      ),
    );
  }
}

class _FeatureChip extends StatelessWidget {
  const _FeatureChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Chip(
      avatar: const Icon(Icons.lock_open_rounded, size: 18),
      label: Text(label),
    );
  }
}

class _PlansSection extends StatelessWidget {
  const _PlansSection({required this.plans});

  final List<SubscriptionPlan> plans;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Plans',
          style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: AppSpacing.small),
        if (plans.isEmpty)
          const _EmptyPlansState()
        else
          ...plans.map((plan) => Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.small),
                child: _PlanTile(plan: plan),
              )),
      ],
    );
  }
}

class _EmptyPlansState extends StatelessWidget {
  const _EmptyPlansState();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(AppSpacing.medium),
        child: Text('No active subscription plans are available yet.'),
      ),
    );
  }
}

class _PlanTile extends StatelessWidget {
  const _PlanTile({required this.plan});

  final SubscriptionPlan plan;

 @override
Widget build(BuildContext context) {
  final colors = Theme.of(context).colorScheme;
  final textTheme = Theme.of(context).textTheme;

  return Card(
    child: Padding(
      padding: const EdgeInsets.all(AppSpacing.medium),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            plan.name,
            style: textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w800,
            ),
          ),
          if (plan.description.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.xSmall),
            Text(
              plan.description,
              style: textTheme.bodySmall?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
          ],
          const SizedBox(height: AppSpacing.small),
          Text('${plan.durationDays} days'),
          const SizedBox(height: AppSpacing.medium),
         Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    Text(
      _formatPrice(plan),
      style: textTheme.titleMedium?.copyWith(
        fontWeight: FontWeight.w800,
      ),
    ),
    const SizedBox(width: 12),
    const Text('Coming soon'),
  ],
),
        ],
      ),
    ),
  );
}
}
String _formatDate(DateTime date) =>
    '${date.day.toString().padLeft(2, '0')}/'
    '${date.month.toString().padLeft(2, '0')}/'
    '${date.year}';

String _formatPrice(SubscriptionPlan plan) {
  final amount = double.tryParse(plan.price);
  if (amount == null) return '${plan.currency} ${plan.price}';
  final whole = amount == amount.roundToDouble()
      ? amount.round().toString()
      : amount.toStringAsFixed(2);
  final formatted = whole.replaceAllMapped(
    RegExp(r'\B(?=(\d{3})+(?!\d))'),
    (_) => ',',
  );
  return plan.currency == 'INR' ? '₹$formatted' : '${plan.currency} $formatted';
}
