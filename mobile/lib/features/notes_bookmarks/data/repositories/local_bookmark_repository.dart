import '../../domain/models/bookmark.dart';
import '../../domain/repositories/bookmark_repository.dart';

/// In-memory shared bookmarks for the active application session.
class LocalBookmarkRepository implements BookmarkRepository {
  final Map<String, Bookmark> _bookmarks = <String, Bookmark>{};

  @override
  List<Bookmark> get bookmarks =>
      List<Bookmark>.unmodifiable(_bookmarks.values);

  @override
  bool add(Bookmark bookmark) {
    if (_bookmarks.containsKey(bookmark.key)) return false;
    _bookmarks[bookmark.key] = bookmark;
    return true;
  }

  @override
  bool remove(BookmarkContentType contentType, String contentId) =>
      _bookmarks.remove('${contentType.name}:$contentId') != null;
}
