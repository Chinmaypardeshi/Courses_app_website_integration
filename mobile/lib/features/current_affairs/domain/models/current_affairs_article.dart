/// A current-affairs learning item for UPSC preparation.
class CurrentAffairsArticle {
  const CurrentAffairsArticle({
    required this.id,
    required this.title,
    required this.summary,
    required this.content,
    required this.category,
    required this.date,
    required this.readingTimeMinutes,
    this.accessTier = 'free',
  });

  final String id;
  final String title;
  final String summary;
  final String content;
  final String category;
  final DateTime date;
  final int readingTimeMinutes;
  final String accessTier;

  bool get isPremium => accessTier == 'premium';

  factory CurrentAffairsArticle.fromJson(Map<String, dynamic> json) {
    final content = json['content'] is String ? json['content'] as String : '';
    final summary = json['summary'] is String ? json['summary'] as String : '';
    final rawDate = json['publishedDate'] ?? json['createdAt'];
    return CurrentAffairsArticle(
      id: '${json['id']}',
      title: json['title'] is String ? json['title'] as String : '',
      summary: summary,
      content: content,
      category: json['category'] is String ? json['category'] as String : '',
      date: rawDate is String
          ? DateTime.tryParse(rawDate) ?? DateTime.now()
          : DateTime.now(),
      readingTimeMinutes: _estimatedReadingTime(
        content.isNotEmpty ? content : summary,
      ),
      accessTier: json['accessTier'] is String
          ? json['accessTier'] as String
          : 'free',
    );
  }

  CurrentAffairsArticle copyWith({
    String? content,
    int? readingTimeMinutes,
    String? accessTier,
  }) {
    return CurrentAffairsArticle(
      id: id,
      title: title,
      summary: summary,
      content: content ?? this.content,
      category: category,
      date: date,
      readingTimeMinutes: readingTimeMinutes ?? this.readingTimeMinutes,
      accessTier: accessTier ?? this.accessTier,
    );
  }

  static int _estimatedReadingTime(String value) {
    final words = RegExp(r'\S+').allMatches(value).length;
    final minutes = (words / 180).ceil();
    if (minutes < 1) return 1;
    if (minutes > 60) return 60;
    return minutes;
  }
}
