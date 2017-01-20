
var books = [
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
];

describe("Book Indexer", function () {
  var indexInstance = new Index();

  for(var index in books) {
    indexInstance.allBooks.push(books[index]);
  }

  indexInstance.createIndex();

  describe("Read Book data", function () {
    it("should not be empty", function () {
      expect(indexInstance.indexObject).not.toBe({});
      expect(indexInstance.indexObject.length).not.toBe(0);
    });
  });

  describe("Populate Index", function () {
    it("should return truthy", function () {
      expect(indexInstance.getIndex()).not.toBeUndefined();
      expect(indexInstance.getIndex().length).not.toBe(0);
      expect(indexInstance.getIndex()).toBeDefined();
    });

    it("should return the index of the correct objects in the JSON array", function () {
      expect(indexInstance.searchIndex("Alice")).toEqual({'alice':[0]});
      expect(indexInstance.searchIndex("a")).toEqual({'a':[0, 1]});
      expect(indexInstance.searchIndex("alliance")).toEqual({'alliance':[1]});
      // expect(getIndex.a).toEqual([0, 1]);
      // expect(getIndex.of).toEqual([0, 1]);
      // expect(getIndex.alliance).toEqual([1]);
    });
  });

  describe("Search index", function () {
    it("should return truthy", function () {
      // expect(indexInstance.searchIndex).toEqual(jasmine.any(Function));
    });

    it("should return the correct results when searched.", function () {
      // expect(indexInstance.searchIndex('alice')).toEqual([[0]]);
      // expect(indexInstance.searchIndex('wonderland')).toEqual([[0]]);
      // expect(indexInstance.searchIndex('ring')).toEqual([[1]]);
      // expect(indexInstance.searchIndex('cool')).toEqual(['Word not found']);
    });

    it("should handle a varied number of search terms as arguments", function () {
      // expect(indexInstance.searchIndex('lord', 'rabbit', 'man', 'dwarf')).toEqual([[1], [0], [1], [1]]);
      // expect(indexInstance.searchIndex('a', 'of', 'elf')).toEqual([[0, 1], [0, 1], [1]]);
      // expect(indexInstance.searchIndex('unusual', 'into', 'ifeanyi', 'hobbit')).toEqual([[1], [0], 'Word not found', [1]]);
    });
  });
});