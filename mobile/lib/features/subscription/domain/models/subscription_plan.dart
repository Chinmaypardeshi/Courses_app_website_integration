class SubscriptionPlan {
  const SubscriptionPlan({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.currency,
    required this.durationDays,
    required this.isActive,
  });

  final String id;
  final String name;
  final String description;
  final String price;
  final String currency;
  final int durationDays;
  final bool isActive;

  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) =>
      SubscriptionPlan(
        id: json['id'].toString(),
        name: json['name'] as String? ?? '',
        description: json['description'] as String? ?? '',
        price: json['price'].toString(),
        currency: json['currency'] as String? ?? 'INR',
        durationDays: json['durationDays'] as int? ?? 0,
        isActive: json['isActive'] == true,
      );
}
