import '../../features/ai_mentor/data/repositories/api_ai_mentor_repository.dart';
import '../../features/ai_mentor/presentation/controllers/ai_mentor_controller.dart';
import '../../features/ai_mentor/presentation/pages/ai_mentor_page.dart';
import 'package:go_router/go_router.dart';

import '../../features/app_shell/presentation/app_shell.dart';
import '../../features/authentication/domain/repositories/authentication_repository.dart';
import '../../features/authentication/presentation/pages/forgot_password_page.dart';
import '../../features/authentication/presentation/pages/login_page.dart';
import '../../features/authentication/presentation/pages/sign_up_page.dart';
import '../../features/current_affairs/presentation/controllers/current_affairs_controller.dart';
import '../../features/current_affairs/presentation/pages/current_affairs_article_page.dart';
import '../../features/current_affairs/presentation/pages/current_affairs_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/onboarding/presentation/pages/onboarding_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/pyq/presentation/controllers/pyq_controller.dart';
import '../../features/pyq/presentation/pages/pyq_catalogue_page.dart';
import '../../features/pyq/presentation/pages/pyq_question_page.dart';
import '../../features/splash/presentation/pages/splash_page.dart';
import '../../features/subscription/presentation/controllers/subscription_controller.dart';
import '../../features/subscription/presentation/pages/subscription_page.dart';
import '../../features/study/presentation/pages/study_page.dart';
import '../../features/study/presentation/controllers/study_controller.dart';
import '../../features/study/presentation/pages/course_detail_page.dart';
import '../../features/study/presentation/pages/lesson_detail_page.dart';
import '../../features/tests/presentation/pages/tests_page.dart';
import '../../features/tests/presentation/controllers/test_controller.dart';
import '../../features/tests/presentation/pages/test_attempt_page.dart';
import '../../features/tests/presentation/pages/test_result_page.dart';
import '../../features/study_material/presentation/controllers/study_material_controller.dart';
import '../../features/study_material/presentation/pages/study_material_detail_page.dart';
import '../../features/study_material/presentation/pages/study_material_page.dart';
import '../../features/video_learning/presentation/controllers/video_learning_controller.dart';
import '../../features/video_learning/presentation/pages/video_detail_page.dart';
import '../../features/video_learning/presentation/pages/video_learning_page.dart';
import '../../features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import '../../features/notes_bookmarks/presentation/controllers/personal_note_controller.dart';
import '../../features/notes_bookmarks/presentation/pages/bookmarks_page.dart';
import '../../features/notes_bookmarks/presentation/pages/note_detail_page.dart';
import '../../features/notes_bookmarks/presentation/pages/note_editor_page.dart';
import '../../features/notes_bookmarks/presentation/pages/personal_notes_page.dart';

/// Named routes owned by the application navigation layer.
abstract final class AppRoute {
  static const splash = 'splash';
  static const onboarding = 'onboarding';
  static const login = 'login';
  static const signUp = 'sign-up';
  static const forgotPassword = 'forgot-password';
  static const home = 'home';
  static const currentAffairs = 'current-affairs';
  static const currentAffairsArticle = 'current-affairs-article';
  static const study = 'study';
  static const studyCourse = 'study-course';
  static const studyLesson = 'study-lesson';
  static const videoLearning = 'video-learning';
  static const videoLearningDetail = 'video-learning-detail';
  static const studyMaterial = 'study-material';
  static const studyMaterialDetail = 'study-material-detail';
  static const pyq = 'pyq';
  static const pyqQuestion = 'pyq-question';
  static const tests = 'tests';
  static const testAttempt = 'test-attempt';
  static const testResult = 'test-result';
  static const profile = 'profile';
  static const subscription = 'subscription';
  static const bookmarks = 'bookmarks';
  static const notes = 'notes';
  static const noteEditor = 'note-editor';
  static const noteDetail = 'note-detail';
  static const noteEdit = 'note-edit';
  static const aiMentor = 'ai-mentor';
}

/// Creates the application's router with temporary local route protection.
abstract final class AppRouter {
  static GoRouter createRouter({
    required AuthenticationRepository authenticationRepository,
    required StudyController studyController,
    required TestController testController,
    required CurrentAffairsController currentAffairsController,
    required VideoLearningController videoLearningController,
    required StudyMaterialController studyMaterialController,
    required PyqController pyqController,
    required PersonalNoteController personalNoteController,
    required BookmarksController bookmarksController,
    required SubscriptionController subscriptionController,
    AiMentorController? aiMentorController,
  }) {
    return GoRouter(
      initialLocation: '/splash',
      refreshListenable: authenticationRepository,
      redirect: (context, state) {
        final location = state.matchedLocation;
        final isLaunchFlow = location == '/splash' || location == '/onboarding';
        final isAuthenticationRoute =
            location == '/login' ||
            location == '/signup' ||
            location == '/forgot-password';

        if (isLaunchFlow) {
          return null;
        }
        if (!authenticationRepository.isAuthenticated &&
            !isAuthenticationRoute) {
          return '/login';
        }
        if (authenticationRepository.isAuthenticated && isAuthenticationRoute) {
          return '/home';
        }
        return null;
      },
      routes: [
        GoRoute(
          path: '/splash',
          name: AppRoute.splash,
          builder: (context, state) => const SplashPage(),
        ),
        GoRoute(
          path: '/onboarding',
          name: AppRoute.onboarding,
          builder: (context, state) => const OnboardingPage(),
        ),
        GoRoute(
          path: '/login',
          name: AppRoute.login,
          builder: (context, state) =>
              LoginPage(authenticationRepository: authenticationRepository),
        ),
        GoRoute(
          path: '/signup',
          name: AppRoute.signUp,
          builder: (context, state) =>
              SignUpPage(authenticationRepository: authenticationRepository),
        ),
        GoRoute(
          path: '/forgot-password',
          name: AppRoute.forgotPassword,
          builder: (context, state) => const ForgotPasswordPage(),
        ),
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) {
            return AppShell(navigationShell: navigationShell);
          },
          branches: [
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/home',
                  name: AppRoute.home,
                  builder: (context, state) => HomePage(
                    studyController: studyController,
                    testController: testController,
                    currentAffairsController: currentAffairsController,
                  ),
                  routes: [
                    GoRoute(
                      path: 'bookmarks',
                      name: AppRoute.bookmarks,
                      builder: (context, state) => BookmarksPage(
                        bookmarksController: bookmarksController,
                      ),
                    ),
                    GoRoute(
                      path: 'ai-mentor',
                      name: AppRoute.aiMentor,
                      builder: (context, state) => AiMentorPage(
                        controller: aiMentorController ??
                            AiMentorController(ApiAiMentorRepository()),
                      ),
                    ),
                    GoRoute(
                      path: 'current-affairs',
                      name: AppRoute.currentAffairs,
                      builder: (context, state) => CurrentAffairsPage(
                        currentAffairsController: currentAffairsController,
                      ),
                      routes: [
                        GoRoute(
                          path: 'article/:articleId',
                          name: AppRoute.currentAffairsArticle,
                          builder: (context, state) =>
                              CurrentAffairsArticlePage(
                                currentAffairsController:
                                    currentAffairsController,
                                articleId: state.pathParameters['articleId']!,
                              ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/study',
                  name: AppRoute.study,
                  builder: (context, state) => StudyPage(
                    studyController: studyController,
                    videoLearningController: videoLearningController,
                    studyMaterialController: studyMaterialController,
                    pyqController: pyqController,
                  ),
                  routes: [
                    GoRoute(
                      path: 'notes',
                      name: AppRoute.notes,
                      builder: (context, state) => PersonalNotesPage(
                        personalNoteController: personalNoteController,
                      ),
                      routes: [
                        GoRoute(
                          path: 'new',
                          name: AppRoute.noteEditor,
                          builder: (context, state) => NoteEditorPage(
                            personalNoteController: personalNoteController,
                          ),
                        ),
                        GoRoute(
                          path: ':noteId',
                          name: AppRoute.noteDetail,
                          builder: (context, state) => NoteDetailPage(
                            personalNoteController: personalNoteController,
                            noteId: state.pathParameters['noteId']!,
                          ),
                          routes: [
                            GoRoute(
                              path: 'edit',
                              name: AppRoute.noteEdit,
                              builder: (context, state) => NoteEditorPage(
                                personalNoteController: personalNoteController,
                                noteId: state.pathParameters['noteId']!,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    GoRoute(
                      path: 'question-bank',
                      name: AppRoute.pyq,
                      builder: (context, state) =>
                          PyqCataloguePage(pyqController: pyqController),
                      routes: [
                        GoRoute(
                          path: ':questionId',
                          name: AppRoute.pyqQuestion,
                          builder: (context, state) => PyqQuestionPage(
                            pyqController: pyqController,
                            bookmarksController: bookmarksController,
                            questionId: state.pathParameters['questionId']!,
                          ),
                        ),
                      ],
                    ),
                    GoRoute(
                      path: 'materials',
                      name: AppRoute.studyMaterial,
                      builder: (context, state) => StudyMaterialPage(
                        studyMaterialController: studyMaterialController,
                      ),
                      routes: [
                        GoRoute(
                          path: ':materialId',
                          name: AppRoute.studyMaterialDetail,
                          builder: (context, state) => StudyMaterialDetailPage(
                            studyMaterialController: studyMaterialController,
                            materialId: state.pathParameters['materialId']!,
                          ),
                        ),
                      ],
                    ),
                    GoRoute(
                      path: 'videos',
                      name: AppRoute.videoLearning,
                      builder: (context, state) => VideoLearningPage(
                        studyController: studyController,
                        videoLearningController: videoLearningController,
                      ),
                    ),
                    GoRoute(
                      path: 'course/:courseId',
                      name: AppRoute.studyCourse,
                      builder: (context, state) => CourseDetailPage(
                        studyController: studyController,
                        videoLearningController: videoLearningController,
                        courseId: state.pathParameters['courseId']!,
                      ),
                      routes: [
                        GoRoute(
                          path: 'lesson/:lessonId',
                          name: AppRoute.studyLesson,
                          builder: (context, state) => LessonDetailPage(
                            studyController: studyController,
                            videoLearningController: videoLearningController,
                            lessonId: state.pathParameters['lessonId']!,
                          ),
                        ),
                        GoRoute(
                          path: 'video/:videoId',
                          name: AppRoute.videoLearningDetail,
                          builder: (context, state) => VideoDetailPage(
                            studyController: studyController,
                            videoLearningController: videoLearningController,
                            videoId: state.pathParameters['videoId']!,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/tests',
                  name: AppRoute.tests,
                  builder: (context, state) =>
                      TestsPage(testController: testController),
                  routes: [
                    GoRoute(
                      path: 'attempt/:testId',
                      name: AppRoute.testAttempt,
                      builder: (context, state) => TestAttemptPage(
                        testController: testController,
                        testId: state.pathParameters['testId']!,
                      ),
                    ),
                    GoRoute(
                      path: 'result/:testId',
                      name: AppRoute.testResult,
                      builder: (context, state) => TestResultPage(
                        testController: testController,
                        testId: state.pathParameters['testId']!,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/profile',
                  name: AppRoute.profile,
                  builder: (context, state) => ProfilePage(
                    authenticationRepository: authenticationRepository,
                    subscriptionController: subscriptionController,
                  ),
                  routes: [
                    GoRoute(
                      path: 'subscription',
                      name: AppRoute.subscription,
                      builder: (context, state) => SubscriptionPage(
                        subscriptionController: subscriptionController,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }
}
