import '../features/ai_mentor/data/repositories/api_ai_mentor_repository.dart';
import '../features/ai_mentor/presentation/controllers/ai_mentor_controller.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../features/authentication/data/repositories/api_authentication_repository.dart';
import '../features/authentication/domain/repositories/authentication_repository.dart';
import '../features/current_affairs/data/repositories/api_current_affairs_repository.dart';
import '../features/current_affairs/domain/repositories/current_affairs_repository.dart';
import '../features/current_affairs/presentation/controllers/current_affairs_controller.dart';
import '../features/pyq/data/repositories/local_pyq_repository.dart';
import '../features/pyq/domain/repositories/pyq_repository.dart';
import '../features/pyq/presentation/controllers/pyq_controller.dart';
import '../features/notes_bookmarks/data/repositories/local_bookmark_repository.dart';
import '../features/notes_bookmarks/data/repositories/local_personal_note_repository.dart';
import '../features/notes_bookmarks/domain/repositories/bookmark_repository.dart';
import '../features/notes_bookmarks/domain/repositories/personal_note_repository.dart';
import '../features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import '../features/notes_bookmarks/presentation/controllers/personal_note_controller.dart';
import '../features/study/data/repositories/api_study_repository.dart';
import '../features/study/domain/repositories/study_repository.dart';
import '../features/study/presentation/controllers/study_controller.dart';
import '../features/subscription/data/repositories/api_subscription_repository.dart';
import '../features/subscription/domain/repositories/subscription_repository.dart';
import '../features/subscription/presentation/controllers/subscription_controller.dart';
import '../features/tests/data/repositories/api_test_repository.dart';
import '../features/tests/data/repositories/local_test_repository.dart';
import '../features/tests/domain/repositories/test_repository.dart';
import '../features/tests/presentation/controllers/test_controller.dart';
import '../features/study_material/data/repositories/local_study_material_repository.dart';
import '../features/study_material/domain/repositories/study_material_repository.dart';
import '../features/study_material/presentation/controllers/study_material_controller.dart';
import '../features/video_learning/data/repositories/local_video_learning_repository.dart';
import '../features/video_learning/domain/repositories/video_learning_repository.dart';
import '../features/video_learning/presentation/controllers/video_learning_controller.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

/// The root widget for the Aspiria application.
class AspiriaApp extends StatefulWidget {
  const AspiriaApp({
    super.key,
    this.router,
    this.authenticationRepository,
    this.studyRepository,
    this.testRepository,
    this.currentAffairsRepository,
    this.videoLearningRepository,
    this.studyMaterialRepository,
    this.pyqRepository,
    this.personalNoteRepository,
    this.bookmarkRepository,
    this.subscriptionRepository,
  });

  /// Allows tests to supply an isolated router instance.
  final GoRouter? router;

  /// Allows tests to supply an isolated local authentication state.
  final AuthenticationRepository? authenticationRepository;

  /// Allows tests to supply an isolated study catalogue.
  final StudyRepository? studyRepository;

  /// Allows tests to supply an isolated local practice-test catalogue.
  final TestRepository? testRepository;

  /// Allows tests to supply isolated Current Affairs content.
  final CurrentAffairsRepository? currentAffairsRepository;

  /// Allows tests to supply an isolated Video Learning catalogue.
  final VideoLearningRepository? videoLearningRepository;

  /// Allows tests to supply an isolated Study Material catalogue.
  final StudyMaterialRepository? studyMaterialRepository;

  /// Allows tests to supply an isolated PYQ/question-bank catalogue.
  final PyqRepository? pyqRepository;
  final PersonalNoteRepository? personalNoteRepository;
  final BookmarkRepository? bookmarkRepository;
  final SubscriptionRepository? subscriptionRepository;

  @override
  State<AspiriaApp> createState() => _AspiriaAppState();
}

class _AspiriaAppState extends State<AspiriaApp> {
  late final AuthenticationRepository _authenticationRepository =
      widget.authenticationRepository ?? ApiAuthenticationRepository();
  late final StudyRepository _studyRepository =
      widget.studyRepository ??
      ApiStudyRepository(
        accessTokenProvider: () => _authenticationRepository.accessToken,
      );
  late final StudyController _studyController = StudyController(
    _studyRepository,
  );
  late final TestRepository _testRepository =
      widget.testRepository ?? ApiTestRepository();
  late final TestController _testController = TestController(_testRepository);
  late final CurrentAffairsRepository _currentAffairsRepository =
      widget.currentAffairsRepository ??
      ApiCurrentAffairsRepository(
        accessTokenProvider: () => _authenticationRepository.accessToken,
      );
  late final CurrentAffairsController _currentAffairsController =
      CurrentAffairsController(_currentAffairsRepository);
  late final VideoLearningRepository _videoLearningRepository =
      widget.videoLearningRepository ?? LocalVideoLearningRepository();
  late final VideoLearningController _videoLearningController =
      VideoLearningController(_videoLearningRepository);
  late final StudyMaterialRepository _studyMaterialRepository =
      widget.studyMaterialRepository ?? LocalStudyMaterialRepository();
  late final BookmarkRepository _bookmarkRepository =
      widget.bookmarkRepository ?? LocalBookmarkRepository();
  late final BookmarksController _bookmarksController = BookmarksController(
    _bookmarkRepository,
  );
  late final StudyMaterialController _studyMaterialController =
      StudyMaterialController(_studyMaterialRepository, _bookmarksController);
  late final PyqRepository _pyqRepository =
      widget.pyqRepository ?? LocalPyqRepository();
  late final PyqController _pyqController = PyqController(_pyqRepository);
  late final PersonalNoteRepository _personalNoteRepository =
      widget.personalNoteRepository ?? LocalPersonalNoteRepository();
  late final PersonalNoteController _personalNoteController =
      PersonalNoteController(_personalNoteRepository);
  late final SubscriptionRepository _subscriptionRepository =
      widget.subscriptionRepository ??
      ApiSubscriptionRepository(
        accessTokenProvider: () => _authenticationRepository.accessToken,
      );
  late final SubscriptionController _subscriptionController =
      SubscriptionController(_subscriptionRepository);
  late final AiMentorController _aiMentorController = AiMentorController(
    ApiAiMentorRepository(
      accessTokenProvider: () => _authenticationRepository.accessToken,
    ),
  );
  late final GoRouter _router =
      widget.router ??
      AppRouter.createRouter(
        authenticationRepository: _authenticationRepository,
        studyController: _studyController,
        testController: _testController,
        currentAffairsController: _currentAffairsController,
        videoLearningController: _videoLearningController,
        studyMaterialController: _studyMaterialController,
        pyqController: _pyqController,
        personalNoteController: _personalNoteController,
        bookmarksController: _bookmarksController,
        subscriptionController: _subscriptionController,
        aiMentorController: _aiMentorController,
      );

  @override
  void initState() {
    super.initState();
    _authenticationRepository.addListener(_onAuthenticationChanged);
  }

  void _onAuthenticationChanged() {
    if (_authenticationRepository.isAuthenticated) {
      _studyController.loadCatalogue();
      _currentAffairsController.loadArticles();
      _subscriptionController.load();
    } else {
      _studyController.clearCompletionState();
      _currentAffairsController.clear();
      _subscriptionController.clear();
    }
  }

  @override
  void dispose() {
    _authenticationRepository.removeListener(_onAuthenticationChanged);
    if (widget.router == null) {
      _router.dispose();
    }
    if (widget.authenticationRepository == null) {
      _authenticationRepository.dispose();
    }
    _studyController.dispose();
    _testController.dispose();
    _currentAffairsController.dispose();
    _videoLearningController.dispose();
    _studyMaterialController.dispose();
    _pyqController.dispose();
    _personalNoteController.dispose();
    _bookmarksController.dispose();
    _subscriptionController.dispose();
    _aiMentorController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Aspiria',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      routerConfig: _router,
    );
  }
}
