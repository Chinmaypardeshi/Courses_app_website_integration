import 'package:flutter/foundation.dart';

import '../../domain/models/bookmark.dart';
import '../../domain/repositories/bookmark_repository.dart';

/// Single source of truth for session-only bookmarks across learning features.
class BookmarksController extends ChangeNotifier {
  BookmarksController(this._repository);

  final BookmarkRepository _repository;

  List<Bookmark> get bookmarks => _repository.bookmarks;
  int get count => bookmarks.length;
  List<Bookmark> bookmarksOfType(BookmarkContentType type) => bookmarks
      .where((bookmark) => bookmark.contentType == type)
      .toList(growable: false);

  bool isBookmarked(BookmarkContentType contentType, String contentId) =>
      bookmarks.any(
        (bookmark) =>
            bookmark.contentType == contentType &&
            bookmark.contentId == contentId,
      );

  bool addBookmark(Bookmark bookmark) {
    final added = _repository.add(bookmark);
    if (added) notifyListeners();
    return added;
  }

  bool removeBookmark(BookmarkContentType contentType, String contentId) {
    final removed = _repository.remove(contentType, contentId);
    if (removed) notifyListeners();
    return removed;
  }

  bool toggleBookmark(Bookmark bookmark) =>
      isBookmarked(bookmark.contentType, bookmark.contentId)
      ? removeBookmark(bookmark.contentType, bookmark.contentId)
      : addBookmark(bookmark);
}
