import 'subscription_plan.dart';
import 'user_subscription.dart';

class SubscriptionStatus {
  const SubscriptionStatus({
    required this.hasPremiumAccess,
    required this.subscription,
    required this.plan,
  });

  final bool hasPremiumAccess;
  final UserSubscription? subscription;
  final SubscriptionPlan? plan;

  factory SubscriptionStatus.fromJson(Map<String, dynamic> json) {
    final subscription = json['subscription'];
    final plan = json['plan'];
    return SubscriptionStatus(
      hasPremiumAccess: json['hasPremiumAccess'] == true,
      subscription: subscription is Map<String, dynamic>
          ? UserSubscription.fromJson(subscription)
          : null,
      plan: plan is Map<String, dynamic> ? SubscriptionPlan.fromJson(plan) : null,
    );
  }
}
