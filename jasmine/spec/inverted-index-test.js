describe('Book Indexer', () => {
  const Index = require('../../src/inverted-index.js');
  const fs = require('fs');
  const filename = "books.json";
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
  const indexInstance = new Index();
  let refinedName = filename.replace(/\.json/g, '').replace(/\s/g, '');

  indexInstance.files[refinedName] = {};
  indexInstance.files[refinedName]['name'] = filename;
  indexInstance.files[refinedName]['books'] = JSON.parse(fs.readFileSync('books.json'));
  indexInstance.createIndex(refinedName);
  describe('Read Book data', () => {
    it('should be valid JSON', () => {
      expect(indexInstance.isValidJSON('[{"hello":"false"}]')).toBe(false);
      expect(indexInstance.isValidJSON(JSON.stringify(books))).toEqual(books);
    });
    it('should not be empty', () => {
      expect(indexInstance.isValidJSON(JSON.stringify(books)).length).not.toBe(0);
      expect(indexInstance.isValidJSON(JSON.stringify(books)).length).toBe(2);
    });
  });

  describe('Populate Index', () => {
    it('should create index once JSON file has been read', () => {
      expect(indexInstance.getIndex(refinedName)).not.toBeUndefined();
      expect(indexInstance.getIndex(refinedName).length).not.toBe(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });

    it('should be correct index', () => {
      expect(indexInstance.getIndex(refinedName)).toEqual({ a: [0, 1], alice: [0], alliance: [1], an: [1], and: [0, 1], destroy: [1], dwarf: [1], elf: [1], enters: [0], falls: [0], full: [0], hobbit: [1], hole: [0], imagination: [0], into: [0], man: [1], of: [0, 1], powerful: [1], rabbit: [0], ring: [1], seek: [1], to: [1], unusual: [1], wizard: [1], world: [0] });
      expect(indexInstance.getIndex(refinedName).length).not.toEqual(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });
  });

  describe('Search index', () => {
    it('should return the correct results of the search', () => {
      expect(indexInstance.searchIndex('Alice', refinedName)).toEqual({ alice: [0] });
      expect(indexInstance.searchIndex('a')).toEqual({ a: [0, 1] });
      expect(indexInstance.searchIndex('alliance')).toEqual({ alliance: [1] });
    });

    it('should handle a varied number of search terms as arguments', () => {
      expect(indexInstance.searchIndex('lord rabbit man dwarf')).toEqual({ rabbit: [0], man: [1], dwarf: [1] });
      expect(indexInstance.searchIndex('a of elf')).toEqual({ a: [0, 1], of: [0, 1], elf: [1] });
    });
  });
});
