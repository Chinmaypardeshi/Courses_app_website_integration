import '../../domain/models/current_affairs_article.dart';
import '../../domain/repositories/current_affairs_repository.dart';

/// Curated sample content used until a Current Affairs source is connected.
class LocalCurrentAffairsRepository implements CurrentAffairsRepository {
  @override
  Future<List<CurrentAffairsArticle>> loadArticles() async => _articles;

  @override
  Future<CurrentAffairsArticle> loadArticle(String articleId) async {
    return _articles.firstWhere(
      (article) => article.id == articleId,
      orElse: () =>
          throw const CurrentAffairsRepositoryException('Article not found.'),
    );
  }

  static final _articles = <CurrentAffairsArticle>[
    CurrentAffairsArticle(
      id: 'climate-adaptation',
      title: 'Climate adaptation: moving from plans to local resilience',
      summary: 'How adaptation planning connects water, health, housing and disaster preparedness for UPSC answers.',
      content: '''Why it matters\n\nClimate adaptation focuses on reducing the harm caused by present and expected climate impacts. For India, local plans matter because heat, flooding, drought and coastal risks affect districts differently.\n\nUPSC lens\n\nLink the issue with disaster management, public health, urban planning and federal cooperation. Strong answers distinguish adaptation from mitigation: mitigation reduces emissions, while adaptation reduces vulnerability.\n\nPoints to remember\n\n• Risk mapping should include vulnerable groups and critical infrastructure.\n• Nature-based solutions such as wetlands can complement engineered infrastructure.\n• Local bodies need usable climate data, predictable finance and community participation.\n\nUse this as a framework for analysing any climate-resilience news report.''',
      category: 'Environment',
      date: DateTime(2026, 9, 16),
      readingTimeMinutes: 4,
    ),
    CurrentAffairsArticle(
      id: 'digital-public-infrastructure',
      title: 'Digital public infrastructure and inclusive service delivery',
      summary: 'A UPSC-ready way to examine public digital systems, access and safeguards.',
      content: '''Why it matters\n\nDigital public infrastructure can make public services easier to discover, access and deliver at scale. Its outcomes, however, depend on reliable connectivity, accessible design and effective grievance redressal.\n\nUPSC lens\n\nConnect this theme with governance, financial inclusion, privacy, cyber security and the digital divide. Evaluate both administrative efficiency and the rights of citizens.\n\nPoints to remember\n\n• Interoperability can reduce duplication across services.\n• Assisted access remains important for people with low digital literacy.\n• Data minimisation, consent and accountability build public trust.\n\nIn an answer, balance innovation with equity and institutional safeguards.''',
      category: 'Governance',
      date: DateTime(2026, 9, 16),
      readingTimeMinutes: 3,
    ),
    CurrentAffairsArticle(
      id: 'food-security',
      title: 'Food security: beyond availability of grain',
      summary: 'Understand access, nutrition and resilient agriculture through a current-affairs lens.',
      content: '''Why it matters\n\nFood security includes availability, access, utilisation and stability. A policy discussion therefore goes beyond production to affordability, nutrition, storage and resilience to shocks.\n\nUPSC lens\n\nRelate the subject to agriculture, poverty, women and child development, public distribution and climate resilience.\n\nPoints to remember\n\n• Dietary diversity is as important as calorie adequacy.\n• Efficient supply chains can reduce post-harvest losses.\n• Small farmers benefit from risk management, market access and extension services.\n\nFrame policy suggestions across production, distribution and nutrition outcomes.''',
      category: 'Economy',
      date: DateTime(2026, 9, 15),
      readingTimeMinutes: 4,
    ),
    CurrentAffairsArticle(
      id: 'maritime-cooperation',
      title: 'Maritime cooperation in the Indian Ocean',
      summary: 'Key themes for linking regional security, trade routes and humanitarian assistance.',
      content: '''Why it matters\n\nThe Indian Ocean is central to India’s trade, energy supplies and regional partnerships. Maritime cooperation includes safety of navigation, disaster response, sustainable ocean resources and capacity building.\n\nUPSC lens\n\nConnect the topic with India’s neighbourhood policy, the blue economy, international law of the sea and strategic autonomy.\n\nPoints to remember\n\n• Maritime domain awareness supports safety and emergency response.\n• Regional cooperation can improve search and rescue capability.\n• Sustainable use of marine resources is a governance as well as an economic concern.\n\nAvoid treating security and development as separate themes in your answer.''',
      category: 'International Relations',
      date: DateTime(2026, 9, 14),
      readingTimeMinutes: 3,
    ),
    CurrentAffairsArticle(
      id: 'urban-mobility',
      title: 'Urban mobility: planning for access, not only speed',
      summary: 'How public transport, walkability and land use shape inclusive cities.',
      content: '''Why it matters\n\nUrban mobility affects employment, education, safety and air quality. A people-centred approach considers the whole journey, including walking, cycling and first- and last-mile connections.\n\nUPSC lens\n\nUse this topic for urban governance, social justice, environment and infrastructure questions.\n\nPoints to remember\n\n• Affordable public transport improves access to opportunity.\n• Universal design makes streets and stations safer for all users.\n• Coordinated land-use and transport planning can limit congestion.\n\nSuggest measurable, citizen-focused outcomes instead of only adding road capacity.''',
      category: 'Society',
      date: DateTime(2026, 9, 13),
      readingTimeMinutes: 3,
    ),
  ];
}
