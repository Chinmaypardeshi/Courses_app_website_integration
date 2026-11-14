import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/authentication/domain/repositories/authentication_repository.dart';
import 'package:aspiria/features/authentication/presentation/controllers/authentication_controller.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_form_field.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_page_layout.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_validators.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Sign-in form backed by the configured authentication repository.
class LoginPage extends StatefulWidget {
  const LoginPage({super.key, required this.authenticationRepository});

  final AuthenticationRepository authenticationRepository;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  late final AuthenticationController _authenticationController;

  @override
  void initState() {
    super.initState();
    _authenticationController = AuthenticationController(
      widget.authenticationRepository,
    )..addListener(_onControllerChanged);
  }

  @override
  void dispose() {
    _authenticationController
      ..removeListener(_onControllerChanged)
      ..dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onControllerChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final signedIn = await _authenticationController.signIn(
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );
    if (mounted && signedIn) {
      context.goNamed(AppRoute.home);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthPageLayout(
      title: 'Welcome back',
      subtitle: 'Continue your preparation with Aspiria.',
      children: [
        Form(
          key: _formKey,
          child: Column(
            children: [
              AuthFormField(
                controller: _emailController,
                label: 'Email address',
                hintText: 'you@example.com',
                keyboardType: TextInputType.emailAddress,
                autofillHints: const [AutofillHints.username],
                textInputAction: TextInputAction.next,
                validator: AuthValidators.email,
              ),
              const SizedBox(height: AppSpacing.medium),
              AuthFormField(
                controller: _passwordController,
                label: 'Password',
                isPassword: true,
                autofillHints: const [AutofillHints.password],
                textInputAction: TextInputAction.done,
                validator: AuthValidators.password,
                onFieldSubmitted: (_) => _submit(),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => context.goNamed(AppRoute.forgotPassword),
                  child: const Text('Forgot password?'),
                ),
              ),
              if (_authenticationController.errorMessage case final message?) ...[
                const SizedBox(height: AppSpacing.small),
                Text(
                  message,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                  textAlign: TextAlign.center,
                ),
              ],
              const SizedBox(height: AppSpacing.medium),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _authenticationController.isSubmitting
                      ? null
                      : _submit,
                  child: Text(
                    _authenticationController.isSubmitting
                        ? 'Signing in...'
                        : 'Log in',
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.large),
        Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            const Text('New to Aspiria?'),
            TextButton(
              onPressed: () => context.goNamed(AppRoute.signUp),
              child: const Text('Create account'),
            ),
          ],
        ),
      ],
    );
  }
}
