import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/authentication/domain/repositories/authentication_repository.dart';
import 'package:aspiria/features/subscription/presentation/controllers/subscription_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Account overview backed by the authenticated backend session.
class ProfilePage extends StatefulWidget {
  const ProfilePage({
    super.key,
    required this.authenticationRepository,
    required this.subscriptionController,
  });

  final AuthenticationRepository authenticationRepository;
  final SubscriptionController subscriptionController;

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  AuthenticationRepository get authenticationRepository =>
      widget.authenticationRepository;
  SubscriptionController get subscriptionController =>
      widget.subscriptionController;

  @override
  void initState() {
    super.initState();
    subscriptionController.addListener(_onSubscriptionChanged);
    if (!subscriptionController.isLoading &&
        subscriptionController.status == null) {
      subscriptionController.load();
    }
  }

  @override
  void dispose() {
    subscriptionController.removeListener(_onSubscriptionChanged);
    super.dispose();
  }

  void _onSubscriptionChanged() => setState(() {});

  Future<void> _logout(BuildContext context) async {
    await authenticationRepository.signOut();
    if (context.mounted) {
      context.goNamed(AppRoute.login);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(AppSpacing.medium),
        children: [
          Text(
            'Profile',
            style: textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: AppSpacing.large),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: colors.primaryContainer,
                    foregroundColor: colors.onPrimaryContainer,
                    child: const Icon(Icons.person_rounded, size: 30),
                  ),
                  const SizedBox(width: AppSpacing.medium),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          authenticationRepository.displayName,
                          style: textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xSmall),
                        Text(
                          'Authenticated account',
                          style: textTheme.bodyMedium?.copyWith(
                            color: colors.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.xLarge),
          _SubscriptionSummaryCard(
            isLoading: subscriptionController.isLoading,
            errorMessage: subscriptionController.errorMessage,
            hasPremiumAccess: subscriptionController.hasPremiumAccess,
            planName: subscriptionController.status?.plan?.name,
            onOpen: () => context.goNamed(AppRoute.subscription),
            onRetry: subscriptionController.load,
          ),
          const SizedBox(height: AppSpacing.xLarge),
          Text(
            'Account',
            style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: AppSpacing.small),
          Card(
            child: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.person_outline_rounded),
                  title: Text('Personal details'),
                  subtitle: Text('Available when profile editing is added'),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.settings_outlined),
                  title: Text('Settings'),
                  subtitle: Text('Preferences will be available here'),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xLarge),
          OutlinedButton.icon(
            onPressed: () => _logout(context),
            icon: const Icon(Icons.logout_rounded),
            label: const Text('Log out'),
            style: OutlinedButton.styleFrom(
              foregroundColor: colors.error,
              side: BorderSide(color: colors.error),
              shape: const RoundedRectangleBorder(
                borderRadius: AppRadius.small,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SubscriptionSummaryCard extends StatelessWidget {
  const _SubscriptionSummaryCard({
    required this.isLoading,
    required this.errorMessage,
    required this.hasPremiumAccess,
    required this.planName,
    required this.onOpen,
    required this.onRetry,
  });

  final bool isLoading;
  final String? errorMessage;
  final bool hasPremiumAccess;
  final String? planName;
  final VoidCallback onOpen;
  final VoidCallback onRetry;

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
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: hasPremiumAccess
                      ? colors.primaryContainer
                      : colors.secondaryContainer,
                  foregroundColor: hasPremiumAccess
                      ? colors.onPrimaryContainer
                      : colors.onSecondaryContainer,
                  child: Icon(
                    hasPremiumAccess
                        ? Icons.workspace_premium_rounded
                        : Icons.lock_outline_rounded,
                  ),
                ),
                const SizedBox(width: AppSpacing.medium),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        hasPremiumAccess ? 'Premium active' : 'Aspiria Free',
                        style: textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xSmall),
                      Text(
                        _subtitle,
                        style: textTheme.bodyMedium?.copyWith(
                          color: colors.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (errorMessage != null) ...[
              const SizedBox(height: AppSpacing.medium),
              Text(errorMessage!, style: TextStyle(color: colors.error)),
            ],
            const SizedBox(height: AppSpacing.medium),
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: isLoading ? null : onOpen,
                    icon: Icon(
                      hasPremiumAccess
                          ? Icons.verified_rounded
                          : Icons.arrow_upward_rounded,
                    ),
                    label: Text(hasPremiumAccess ? 'Manage plan' : 'Upgrade'),
                  ),
                ),
                if (errorMessage != null) ...[
                  const SizedBox(width: AppSpacing.small),
                  IconButton(
                    onPressed: isLoading ? null : onRetry,
                    icon: const Icon(Icons.refresh_rounded),
                    tooltip: 'Retry',
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  String get _subtitle {
    if (isLoading) return 'Checking subscription status...';
    if (errorMessage != null) return 'Unable to refresh subscription status.';
    if (hasPremiumAccess) return planName ?? 'Premium access enabled';
    return 'Unlock premium learning when billing is available.';
  }
}
