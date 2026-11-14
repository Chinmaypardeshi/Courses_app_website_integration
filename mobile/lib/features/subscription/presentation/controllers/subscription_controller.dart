import 'package:flutter/foundation.dart';

import '../../domain/models/subscription_plan.dart';
import '../../domain/models/subscription_status.dart';
import '../../domain/repositories/subscription_repository.dart';

class SubscriptionController extends ChangeNotifier {
  SubscriptionController(this._repository);

  final SubscriptionRepository _repository;

  List<SubscriptionPlan> _plans = const [];
  SubscriptionStatus? _status;
  var _isLoading = false;
  String? _errorMessage;

  List<SubscriptionPlan> get plans => _plans;
  SubscriptionStatus? get status => _status;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasPremiumAccess => _status?.hasPremiumAccess ?? false;

  Future<void> load() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait<Object>([
        _repository.loadPlans(),
        _repository.loadStatus(),
      ]);
      _plans = results[0] as List<SubscriptionPlan>;
      _status = results[1] as SubscriptionStatus;
    } catch (error) {
      _errorMessage = error is SubscriptionRepositoryException
          ? error.message
          : 'Unable to load subscription details. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clear() {
    _plans = const [];
    _status = null;
    _errorMessage = null;
    _isLoading = false;
    notifyListeners();
  }
}
