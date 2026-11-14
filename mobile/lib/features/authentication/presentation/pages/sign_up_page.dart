import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/authentication/domain/repositories/authentication_repository.dart';
import 'package:aspiria/features/authentication/presentation/controllers/authentication_controller.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_form_field.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_page_layout.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_validators.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Account creation form backed by the configured authentication repository.
class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key, required this.authenticationRepository});

  final AuthenticationRepository authenticationRepository;

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
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
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
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

    final signedUp = await _authenticationController.signUp(
      fullName: _nameController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );
    if (mounted && signedUp) {
      context.goNamed(AppRoute.home);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthPageLayout(
      title: 'Create your account',
      subtitle: 'Start building a focused preparation routine today.',
      showBackButton: true,
      children: [
        Form(
          key: _formKey,
          child: Column(
            children: [
              AuthFormField(
                controller: _nameController,
                label: 'Full name',
                keyboardType: TextInputType.name,
                autofillHints: const [AutofillHints.name],
                textInputAction: TextInputAction.next,
                validator: AuthValidators.fullName,
              ),
              const SizedBox(height: AppSpacing.medium),
              AuthFormField(
                controller: _emailController,
                label: 'Email address',
                hintText: 'you@example.com',
                keyboardType: TextInputType.emailAddress,
                autofillHints: const [AutofillHints.newUsername],
                textInputAction: TextInputAction.next,
                validator: AuthValidators.email,
              ),
              const SizedBox(height: AppSpacing.medium),
              AuthFormField(
                controller: _passwordController,
                label: 'Password',
                isPassword: true,
                autofillHints: const [AutofillHints.newPassword],
                textInputAction: TextInputAction.next,
                validator: AuthValidators.password,
              ),
              const SizedBox(height: AppSpacing.medium),
              AuthFormField(
                controller: _confirmPasswordController,
                label: 'Confirm password',
                isPassword: true,
                autofillHints: const [AutofillHints.newPassword],
                textInputAction: TextInputAction.done,
                validator: (value) => AuthValidators.confirmPassword(
                  value,
                  _passwordController.text,
                ),
                onFieldSubmitted: (_) => _submit(),
              ),
              const SizedBox(height: AppSpacing.large),
              if (_authenticationController.errorMessage case final message?) ...[
                Text(
                  message,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.medium),
              ],
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _authenticationController.isSubmitting
                      ? null
                      : _submit,
                  child: Text(
                    _authenticationController.isSubmitting
                        ? 'Creating account...'
                        : 'Create account',
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
            const Text('Already have an account?'),
            TextButton(
              onPressed: () => context.goNamed(AppRoute.login),
              child: const Text('Log in'),
            ),
          ],
        ),
      ],
    );
  }
}
