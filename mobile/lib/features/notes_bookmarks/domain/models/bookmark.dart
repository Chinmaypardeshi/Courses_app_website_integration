/// Learning content types currently supported by the shared bookmark system.
enum BookmarkContentType {
  studyMaterial('Study material'),
  pyqQuestion('PYQ question');

  const BookmarkContentType(this.label);

  final String label;
}

/// A lightweight, extensible reference to bookmarked learning content.
class Bookmark {
  const Bookmark({
    required this.contentType,
    required this.contentId,
    required this.title,
    this.subject,
    this.context,
  });

  final BookmarkContentType contentType;
  final String contentId;
  final String title;
  final String? subject;
  final String? context;

  String get key => '${contentType.name}:$contentId';
}
