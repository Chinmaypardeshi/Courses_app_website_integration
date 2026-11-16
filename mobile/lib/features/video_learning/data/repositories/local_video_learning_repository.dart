import '../../domain/models/learning_video.dart';
import '../../domain/repositories/video_learning_repository.dart';

/// Local sample catalogue used because the backend does not yet expose videos.
///
/// The references intentionally point to a public demo file; Aspiria does not
/// present them as hosted course videos.
class LocalVideoLearningRepository implements VideoLearningRepository {
  static final Uri _demoVideoReference = Uri.parse(
    'https://vjs.zencdn.net/v/oceans.mp4',
  );

  @override
  List<LearningVideo> get videos => _videos;

  static final List<LearningVideo> _videos = [
    LearningVideo(
      id: 'constitutional-preamble-video',
      title: 'Understanding the Preamble',
      description: 'A focused UPSC overview of the Preamble, its ideals, and how to use it in answers.',
      courseId: '1',
      lessonId: '1',
      duration: const Duration(minutes: 12),
      videoReference: _demoVideoReference,
      order: 1,
    ),
    LearningVideo(
      id: 'constitutional-values-video',
      title: 'Constitutional values in practice',
      description: 'Connect justice, liberty, equality, and fraternity to Indian institutions and governance.',
      courseId: '1',
      duration: const Duration(minutes: 16),
      videoReference: _demoVideoReference,
      order: 2,
    ),
    LearningVideo(
      id: 'revolt-1857-video',
      title: 'The Revolt of 1857: causes and consequences',
      description: 'Review the major causes, centres, leadership, limitations, and long-term significance.',
      courseId: '2',
      lessonId: '2',
      duration: const Duration(minutes: 14),
      videoReference: _demoVideoReference,
      order: 1,
    ),
  ];
}
