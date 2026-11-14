import 'package:aspiria/app/app.dart';
import 'package:aspiria/features/authentication/data/repositories/api_authentication_repository.dart';
import 'package:aspiria/features/authentication/data/repositories/local_authentication_repository.dart';
import 'package:aspiria/features/authentication/domain/repositories/authentication_repository.dart';
import 'package:aspiria/features/study/data/repositories/local_study_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

Future<void> openLogin(
  WidgetTester tester, {
  AuthenticationRepository? authenticationRepository,
}) async {
  await tester.pumpWidget(
    AspiriaApp(
      authenticationRepository:
          authenticationRepository ?? LocalAuthenticationRepository(),
      studyRepository: LocalStudyRepository(),
    ),
  );
  await tester.pump(const Duration(seconds: 1));
  await tester.pumpAndSettle();

  expect(find.text('Learn with clarity'), findsOneWidget);

  await tester.tap(find.text('Skip'));
  await tester.pumpAndSettle();
}

Future<void> openStudy(WidgetTester tester) async {
  await openLogin(tester);

  final fields = find.byType(TextFormField);
  await tester.enterText(fields.at(0), 'learner@example.com');
  await tester.enterText(fields.at(1), 'aspiria');
  await tester.tap(find.text('Log in'));
  await tester.pumpAndSettle();

  await tester.tap(find.text('Study'));
  await tester.pumpAndSettle();
}

Future<void> openTests(WidgetTester tester) async {
  await openLogin(tester);

  final fields = find.byType(TextFormField);
  await tester.enterText(fields.at(0), 'learner@example.com');
  await tester.enterText(fields.at(1), 'aspiria');
  await tester.tap(find.text('Log in'));
  await tester.pumpAndSettle();

  await tester.tap(find.text('Tests'));
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('splash and onboarding lead to login', (
    WidgetTester tester,
  ) async {
    await openLogin(tester);

    expect(find.text('Welcome back'), findsOneWidget);
    expect(find.text('Log in'), findsOneWidget);
  });

  testWidgets('login displays validation errors for an incomplete form', (
    WidgetTester tester,
  ) async {
    await openLogin(tester);

    await tester.tap(find.text('Log in'));
    await tester.pump();

    expect(find.text('Enter your email address.'), findsOneWidget);
    expect(find.text('Enter your password.'), findsOneWidget);
  });

  testWidgets('authenticated login opens the shell and logout returns to login', (
    WidgetTester tester,
  ) async {
    await openLogin(tester);

    final fields = find.byType(TextFormField);
    await tester.enterText(fields.at(0), 'learner@example.com');
    await tester.enterText(fields.at(1), 'aspiria');
    await tester.tap(find.text('Log in'));
    await tester.pumpAndSettle();

    expect(find.text('Choose your focus'), findsOneWidget);

    await tester.tap(find.text('Profile'));
    await tester.pumpAndSettle();
    expect(find.text('Authenticated account'), findsOneWidget);

    await tester.scrollUntilVisible(find.text('Log out'), 300);
    await tester.tap(find.text('Log out'));
    await tester.pumpAndSettle();

    expect(find.text('Welcome back'), findsOneWidget);
  });

  testWidgets('backend login failure remains on login and shows its error', (
    WidgetTester tester,
  ) async {
    final repository = ApiAuthenticationRepository(
      baseUrl: 'http://example.test',
      client: MockClient(
        (_) async => http.Response(
          '{"error":"Invalid email or password."}',
          401,
        ),
      ),
    );
    await openLogin(tester, authenticationRepository: repository);

    final fields = find.byType(TextFormField);
    await tester.enterText(fields.at(0), 'learner@example.com');
    await tester.enterText(fields.at(1), 'wrongpass');
    await tester.tap(find.text('Log in'));
    await tester.pumpAndSettle();

    expect(find.text('Invalid email or password.'), findsOneWidget);
    expect(find.text('Welcome back'), findsOneWidget);
    expect(repository.isAuthenticated, isFalse);
  });

  testWidgets(
    'study catalogue opens a course and lesson, then updates progress',
    (WidgetTester tester) async {
      await openStudy(tester);

     expect(find.text('Your learning progress'), findsOneWidget);

await tester.scrollUntilVisible(
  find.text('Indian Polity'),
  300,
);

expect(find.text('Indian Polity'), findsOneWidget);

await tester.scrollUntilVisible(
  find.text('Constitutional Foundations'),
  300,
);

expect(find.text('Constitutional Foundations'), findsOneWidget);

await tester.tap(find.text('Constitutional Foundations'));
      await tester.pumpAndSettle();
      expect(find.text('Course details'), findsOneWidget);
      expect(find.text('The Preamble'), findsOneWidget);

      await tester.tap(find.text('The Preamble'));
      await tester.pumpAndSettle();
      expect(find.text('The Preamble'), findsOneWidget);
      expect(find.text('Mark as Complete'), findsOneWidget);

      await tester.tap(find.text('Mark as Complete'));
      await tester.pumpAndSettle();
      expect(find.text('Completed'), findsOneWidget);

      await tester.pageBack();
      await tester.pumpAndSettle();
      expect(find.text('Completed'), findsOneWidget);
    },
  );

  testWidgets('practice tests support answering, submission, and retry', (
    WidgetTester tester,
  ) async {
    await openTests(tester);

    expect(find.text('Practice tests'), findsOneWidget);
    expect(find.text('Polity Basics'), findsOneWidget);

    await tester.tap(find.text('Polity Basics'));
    await tester.pumpAndSettle();
    expect(find.text('Question 1 of 3'), findsOneWidget);

    await tester.tap(find.text('The Preamble'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Next'));
    await tester.pumpAndSettle();
    expect(find.text('Question 2 of 3'), findsOneWidget);

    await tester.tap(find.text('Next'));
    await tester.pumpAndSettle();
    expect(find.text('Question 3 of 3'), findsOneWidget);
    await tester.tap(find.text('Submit test'));
    await tester.pumpAndSettle();
    expect(find.text('Submit test?'), findsOneWidget);
    await tester.tap(find.text('Submit'));
    await tester.pumpAndSettle();

    expect(find.text('Test result'), findsOneWidget);
    expect(find.text('1/3'), findsOneWidget);
    expect(find.text('Review answers'), findsOneWidget);

    await tester.scrollUntilVisible(find.text('Retry test'), 300);
    await tester.tap(find.text('Retry test'));
    await tester.pumpAndSettle();
    expect(find.text('Question 1 of 3'), findsOneWidget);
    expect(find.text('0 of 3 answered'), findsOneWidget);
  });
}
