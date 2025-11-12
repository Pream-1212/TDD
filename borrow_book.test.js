const borrow_book = require('./borrow_book');


describe("borrow_book function", () => {
  let available_books;

  beforeEach(() => {
    // Reset the available_books list before each test
    available_books = ["Peter Ngujiwathiog", "1988", "Weep Not Child"];
  });

  test("borrows a book that is available", () => {
    const message = borrow_book("1988", available_books);
    expect(message).toBe("You have borrowed '1988'.");
    expect(available_books).toEqual(["Peter Ngujiwathiog", "Weep Not Child"]);
  });

  test("tries to borrow a book that is not available", () => {
    const message = borrow_book("Discover", available_books);
    expect(message).toBe("Sorry, 'Discover' is not available.");
    expect(available_books).toEqual([
      "Peter Ngujiwathiog",
      "1988",
      "Weep Not Child",
    ]);
  });

  test("borrowing a book updates the list correctly", () => {
    borrow_book("Peter Ngujiwathiog", available_books);
    expect(available_books).toEqual(["1988", "Weep Not Child"]);
  });

  test("borrowing from an empty list", () => {
    available_books = [];
    const message = borrow_book("1988", available_books);
    expect(message).toBe("Sorry, '1988' is not available.");
    expect(available_books).toEqual([]);
  });
});
