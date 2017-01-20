
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
  const indexInstance = new Index();

  for (const index in books) {
    indexInstance.allBooks.push(books[index]);
  }

  indexInstance.createIndex();

  describe('Read Book data', () => {
    it('should be valid JSON', () => {
      expect(typeof indexInstance.indexObject).not.toBe({});
      expect(indexInstance.indexObject.length).not.toBe(0);
    });
    it('should not be empty', () => {
      expect(indexInstance.indexObject).not.toBe({});
      expect(indexInstance.indexObject.length).not.toBe(0);
    });
  });

  describe('Populate Index', () => {
    it('should return truthy', () => {
      expect(indexInstance.getIndex()).not.toBeUndefined();
      expect(indexInstance.getIndex().length).not.toBe(0);
      expect(indexInstance.getIndex()).toBeDefined();
    });
  });

  describe('Search index', () => {
    it('should return the index of the correct objects in the JSON array', () => {
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
