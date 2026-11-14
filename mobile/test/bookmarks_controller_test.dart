import 'package:aspiria/features/notes_bookmarks/data/repositories/local_bookmark_repository.dart';
import 'package:aspiria/features/notes_bookmarks/domain/models/bookmark.dart';
import 'package:aspiria/features/notes_bookmarks/presentation/controllers/bookmarks_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('adds, removes, toggles, and prevents duplicate shared bookmarks', () {
    final controller = BookmarksController(LocalBookmarkRepository());
    const material = Bookmark(
      contentType: BookmarkContentType.studyMaterial,
      contentId: 'material-1',
      title: 'Polity PDF',
      subject: 'Indian Polity',
    );
    const question = Bookmark(
      contentType: BookmarkContentType.pyqQuestion,
      contentId: 'question-1',
      title: 'PYQ prompt',
      subject: 'Environment',
    );

    expect(controller.addBookmark(material), isTrue);
    expect(controller.addBookmark(material), isFalse);
    expect(
      controller.isBookmarked(material.contentType, material.contentId),
      isTrue,
    );
    expect(controller.addBookmark(question), isTrue);
    expect(controller.count, 2);
    expect(
      controller.bookmarksOfType(BookmarkContentType.pyqQuestion),
      hasLength(1),
    );

    expect(controller.toggleBookmark(material), isTrue);
    expect(
      controller.isBookmarked(material.contentType, material.contentId),
      isFalse,
    );
    expect(
      controller.removeBookmark(question.contentType, question.contentId),
      isTrue,
    );
    expect(controller.count, 0);
  });
}
