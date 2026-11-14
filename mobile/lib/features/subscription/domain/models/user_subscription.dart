class UserSubscription {
  const UserSubscription({
    required this.id,
    required this.planId,
    required this.status,
    required this.startsAt,
    required this.expiresAt,
    required this.hasPremiumAccess,
  });

  final String id;
  final String planId;
  final String status;
  final DateTime? startsAt;
  final DateTime? expiresAt;
  final bool hasPremiumAccess;

  bool get isActive => hasPremiumAccess && status == 'active';

  factory UserSubscription.fromJson(Map<String, dynamic> json) =>
      UserSubscription(
        id: json['id'].toString(),
        planId: json['planId'].toString(),
        status: json['status'] as String? ?? 'pending',
        startsAt: _date(json['startsAt']),
        expiresAt: _date(json['expiresAt']),
        hasPremiumAccess: json['hasPremiumAccess'] == true,
      );

  static DateTime? _date(Object? value) =>
      value is String ? DateTime.tryParse(value) : null;
}
