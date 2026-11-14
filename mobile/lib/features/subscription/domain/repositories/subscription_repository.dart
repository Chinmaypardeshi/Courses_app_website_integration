import '../models/subscription_plan.dart';
import '../models/subscription_status.dart';

abstract class SubscriptionRepository {
  Future<List<SubscriptionPlan>> loadPlans();

  Future<SubscriptionStatus> loadStatus();
}

class SubscriptionRepositoryException implements Exception {
  const SubscriptionRepositoryException(this.message);

  final String message;
}
