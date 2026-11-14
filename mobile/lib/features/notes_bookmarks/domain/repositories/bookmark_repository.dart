import '../models/bookmark.dart';

/// Storage contract for shared bookmarks. The current implementation is session-only.
abstract interface class BookmarkRepository {
  List<Bookmark> get bookmarks;
  bool add(Bookmark bookmark);
  bool remove(BookmarkContentType contentType, String contentId);
}
