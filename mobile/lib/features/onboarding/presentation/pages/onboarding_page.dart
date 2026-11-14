import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_radius.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Introduces Aspiria's learning experience without persisting user state.
class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  var _currentPage = 0;

  static const _pages = [
    _OnboardingContent(
      icon: Icons.auto_stories_rounded,
      title: 'Learn with clarity',
      description:
          'Build strong concepts with focused learning paths for your exam.',
    ),
    _OnboardingContent(
      icon: Icons.fact_check_rounded,
      title: 'Practice with purpose',
      description:
          'Turn preparation into progress through structured practice.',
    ),
    _OnboardingContent(
      icon: Icons.workspace_premium_rounded,
      title: 'Achieve with confidence',
      description:
          'Stay consistent, understand your growth, and move toward your goal.',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _completeOnboarding() => context.goNamed(AppRoute.login);

  void _continue() {
    if (_currentPage == _pages.length - 1) {
      _completeOnboarding();
      return;
    }
    _pageController.nextPage(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.large),
          child: Column(
            children: [
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: _completeOnboarding,
                  child: const Text('Skip'),
                ),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: _pages.length,
                  onPageChanged: (index) =>
                      setState(() => _currentPage = index),
                  itemBuilder: (context, index) {
                    final page = _pages[index];
                    return _OnboardingPanel(page: page);
                  },
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_pages.length, (index) {
                  final isSelected = index == _currentPage;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    margin: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.xSmall,
                    ),
                    height: AppSpacing.small,
                    width: isSelected ? AppSpacing.large : AppSpacing.small,
                    decoration: BoxDecoration(
                      borderRadius: AppRadius.pill,
                      color: isSelected
                          ? colors.primary
                          : colors.outlineVariant,
                    ),
                  );
                }),
              ),
              const SizedBox(height: AppSpacing.large),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _continue,
                  child: Text(
                    _currentPage == _pages.length - 1
                        ? 'Get Started'
                        : 'Continue',
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.small),
              Text(
                'Your preparation, organized.',
                style: textTheme.bodySmall?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OnboardingPanel extends StatelessWidget {
  const _OnboardingPanel({required this.page});

  final _OnboardingContent page;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 132,
          height: 132,
          decoration: BoxDecoration(
            color: colors.primaryContainer,
            borderRadius: AppRadius.large,
          ),
          child: Icon(page.icon, size: 64, color: colors.onPrimaryContainer),
        ),
        const SizedBox(height: AppSpacing.xxLarge),
        Text(
          page.title,
          style: textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.medium),
        Text(
          page.description,
          style: textTheme.bodyLarge?.copyWith(color: colors.onSurfaceVariant),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

class _OnboardingContent {
  const _OnboardingContent({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;
}
