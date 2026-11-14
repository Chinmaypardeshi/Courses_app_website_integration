import 'package:aspiria/app/router/app_router.dart';
import 'package:aspiria/app/theme/app_spacing.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_form_field.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_page_layout.dart';
import 'package:aspiria/features/authentication/presentation/widgets/auth_validators.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Temporary reset-link feedback form; no email is sent in Phase 3.
class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  var _isSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _sendResetLink() {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    setState(() => _isSent = true);
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return AuthPageLayout(
      title: 'Reset your password',
      subtitle: 'Enter your email and we will help you get back on track.',
      showBackButton: true,
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
                autofillHints: const [AutofillHints.email],
                textInputAction: TextInputAction.done,
                validator: AuthValidators.email,
                onFieldSubmitted: (_) => _sendResetLink(),
              ),
              const SizedBox(height: AppSpacing.large),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _sendResetLink,
                  child: const Text('Send reset link'),
                ),
              ),
            ],
          ),
        ),
        if (_isSent) ...[
          const SizedBox(height: AppSpacing.large),
          Semantics(
            liveRegion: true,
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.medium),
              decoration: BoxDecoration(
                color: colors.secondaryContainer,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                'If an account exists for this email, a reset link will be sent when email delivery is connected.',
                style: Theme.of(context).textTheme.bodyMedium
                    ?.copyWith(color: colors.onSecondaryContainer),
              ),
            ),
          ),
        ],
        const SizedBox(height: AppSpacing.large),
        Align(
          alignment: Alignment.center,
          child: TextButton(
            onPressed: () => context.goNamed(AppRoute.login),
            child: const Text('Back to log in'),
          ),
        ),
      ],
    );
  }
}
