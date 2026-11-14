import 'package:aspiria/features/subscription/domain/models/subscription_plan.dart';
import 'package:aspiria/features/subscription/domain/models/subscription_status.dart';
import 'package:aspiria/features/subscription/domain/models/user_subscription.dart';
import 'package:aspiria/features/subscription/domain/repositories/subscription_repository.dart';
import 'package:aspiria/features/subscription/presentation/controllers/subscription_controller.dart';
import 'package:aspiria/features/subscription/presentation/pages/subscription_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('shows active premium plans and free upgrade state', (tester) async {
    await _pumpSubscriptionPage(
      tester,
      status: const SubscriptionStatus(
        hasPremiumAccess: false,
        subscription: null,
        plan: null,
      ),
    );

    expect(find.text('Free plan'), findsOneWidget);
    expect(find.text('Premium areas will show a lock until your subscription is active.'), findsOneWidget);
    expect(find.text('Monthly Premium'), findsOneWidget);
    expect(find.text('Yearly Premium'), findsOneWidget);
    expect(find.text('₹299'), findsOneWidget);
    expect(find.text('₹1,999'), findsOneWidget);
    expect(find.text('Coming soon'), findsNWidgets(2));
  });

  testWidgets('shows premium status for an active subscription', (tester) async {
    await _pumpSubscriptionPage(
      tester,
      status: SubscriptionStatus(
        hasPremiumAccess: true,
        subscription: UserSubscription(
          id: 'sub-1',
          planId: 'monthly',
          status: 'active',
          startsAt: DateTime(2026, 9, 1),
          expiresAt: DateTime(2026, 10, 1),
          hasPremiumAccess: true,
        ),
        plan: _plans.first,
      ),
    );

    expect(find.text('Premium active'), findsOneWidget);
    expect(find.text('Monthly Premium access is enabled for this account.'), findsOneWidget);
    expect(find.text('Valid until 01/10/2026'), findsOneWidget);
    expect(find.text('Premium learning areas are available on this account.'), findsOneWidget);
  });
}

Future<void> _pumpSubscriptionPage(
  WidgetTester tester, {
  required SubscriptionStatus status,
}) async {
  final controller = SubscriptionController(_FakeSubscriptionRepository(status));
  await tester.pumpWidget(
    MaterialApp(
      home: SubscriptionPage(subscriptionController: controller),
    ),
  );
  await tester.pump();
  await tester.pumpAndSettle();
}

const _plans = [
  SubscriptionPlan(
    id: 'monthly',
    name: 'Monthly Premium',
    description: 'Aspiria Premium access for 30 days.',
    price: '299.00',
    currency: 'INR',
    durationDays: 30,
    isActive: true,
  ),
  SubscriptionPlan(
    id: 'yearly',
    name: 'Yearly Premium',
    description: 'Aspiria Premium access for 365 days.',
    price: '1999.00',
    currency: 'INR',
    durationDays: 365,
    isActive: true,
  ),
];

class _FakeSubscriptionRepository implements SubscriptionRepository {
  const _FakeSubscriptionRepository(this.status);

  final SubscriptionStatus status;

  @override
  Future<List<SubscriptionPlan>> loadPlans() async => _plans;

  @override
  Future<SubscriptionStatus> loadStatus() async => status;
}
