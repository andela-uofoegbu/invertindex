
// const Index = require("../../src/inverted-index.js");
const books = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
  }
];

describe('Book Indexer', () => {
  const indexInstance = new Index ();

  for (const index in books) {
    indexInstance.allBooks.push(books[index]);
  }

  indexInstance.createIndex();

  describe('Read Book data', () => {
    it('should be valid JSON', () => {
      expect(indexInstance.isValidJSON("hello")).toBe(false);
      expect(indexInstance.isValidJSON(books)).toBe(true);
    });
    it('should not be empty', () => {
      expect(indexInstance.indexObject).not.toBe({});
      expect(indexInstance.indexObject.length).not.toBe(0);
    });
  });

  describe('Populate Index', () => {
    it('should create index once JSON file has been read', () => {
      expect(indexInstance.getIndex()).not.toBeUndefined();
      expect(indexInstance.getIndex().length).not.toBe(0);
      expect(indexInstance.getIndex()).toBeDefined();
    });

    it('should be correct index', () => {
      expect(indexInstance.getIndex()).toEqual({ a: [ 0, 1 ], alice: [ 0 ], alliance: [ 1 ], an: [ 0, 1 ], and: [ 0, 1 ], destroy: [ 1 ], dwarf: [ 1 ], elf: [ 1 ], enters: [ 0 ], falls: [ 0 ], full: [ 0 ], hobbit: [ 1 ], hole: [ 0 ], imagination: [ 0 ], into: [ 0 ], man: [ 1 ], of: [ 0, 1 ], powerful: [ 1 ], rabbit: [ 0 ], ring: [ 1 ], seek: [ 1 ], to: [ 0, 1 ], unusual: [ 1 ], wizard: [ 1 ], world: [ 0 ] });
      expect(indexInstance.getIndex().length).not.toEqual(0);
      expect(indexInstance.getIndex()).toBeDefined();
    });
  });

  describe('Search index', () => {
    it('should return the correct results of the search', () => {
      expect(indexInstance.searchIndex('Alice')).toEqual({ alice: [0] });
      expect(indexInstance.searchIndex('a')).toEqual({ a: [0, 1] });
      expect(indexInstance.searchIndex('alliance')).toEqual({ alliance: [1] });
    });

    it('should handle a varied number of search terms as arguments', () => {
      // expect(indexInstance.searchIndex('lord', 'rabbit', 'man', 'dwarf')).toEqual([[1], [0], [1], [1]]);
      // expect(indexInstance.searchIndex('a', 'of', 'elf')).toEqual([[0, 1], [0, 1], [1]]);
      // expect(indexInstance.searchIndex('unusual', 'into', 'ifeanyi', 'hobbit')).toEqual([[1], [0], 'Word not found', [1]]);
    });
  });
});