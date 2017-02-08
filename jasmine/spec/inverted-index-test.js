const Index = require('../../src/inverted-index.js');

const books = require('../../books.json');
const books2 = require('../../books2.json');

const indexInstance = new Index();

describe('Book Indexer', () => {
  const filename = 'books.json';
  const filename2 = 'books2.json';
  const refinedName = filename.replace(/\.json/g, '').replace(/\s/g, '');
  const refinedName2 = filename2.replace(/\.json/g, '').replace(/\s/g, '');
  indexInstance.addFiles(books, filename);
  indexInstance.addFiles(books2, filename2);

  describe('Inverted Index class', () => {
    it('should check that Index class has a createIndex method', () => {
      expect(typeof Index.prototype.createIndex).toBe('function');
    });

    it('should check that Index class has a getIndex method', () => {
      expect(typeof Index.prototype.getIndex).toBe('function');
    });

    it('should check that Index class has a searchIndex method', () => {
      expect(typeof Index.prototype.searchIndex).toBe('function');
    });
  });

  describe('Read Book data', () => {
    it('should be valid JSON', () => {
      expect(Index.isValidJson('[{"hello":"false"}]')).toBe(false);
      expect(Index.isValidJson(JSON.stringify(books))).toEqual(books);
    });

    it('should not be empty', () => {
      expect(Index.isValidJson(JSON.stringify(books)).length).not.toBe(0);
      expect(Index.isValidJson(JSON.stringify(books)).length).toBe(2);
    });
  });

  describe('Populate Index', () => {
    it('should confirm that index is created once JSON file has been read',
    () => {
      indexInstance.createIndex(refinedName, indexInstance
      .files[refinedName].books);

      expect(indexInstance.getIndex(refinedName)).toBeDefined();
      expect(typeof indexInstance.getIndex(refinedName)).toEqual('object');
      expect(indexInstance.getIndex(refinedName).length).not.toBe(0);
    });

    it('should be correct index', () => {
      indexInstance.createIndex(refinedName2, indexInstance
      .files[refinedName2].books);

      expect(indexInstance.getIndex(refinedName).alice).toEqual([0]);
      expect(Object.keys(indexInstance.getIndex(refinedName)).length)
      .toBeGreaterThan(0);
      expect(indexInstance.getIndex(refinedName).length).not.toEqual(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });
  });

  describe('Search index', () => {
    it('should return the correct results of the search', () => {
      expect(indexInstance.searchIndex('Alice', refinedName))
      .toEqual({ books: { alice: [0] } });
      expect(indexInstance.searchIndex('a'))
      .toEqual({ books: { a: [0, 1] }, books2: { a: [0, 1] } });
      expect(indexInstance.searchIndex('alliance'))
      .toEqual({ books: { alliance: [1] }, books2: { alliance: [] } });
    });

    it('should handle a varied number of search terms as arguments', () => {
      expect(indexInstance.searchIndex('lord rabbit man dwarf', refinedName))
      .toEqual({ books: { lord: [], rabbit: [0], man: [1], dwarf: [1] } });
      expect(indexInstance.searchIndex('a of elf', refinedName))
      .toEqual({ books: { a: [0, 1], of: [0, 1], elf: [1] } });
      expect(indexInstance.searchIndex('and', refinedName2))
      .not.toEqual({ books2: { and: [0] } });
    });

    it('should handle array of words as search terms', () => {
      expect(indexInstance
      .searchIndex(['lord', [['rabbit']], ['man', 'dwarf']], refinedName))
      .toEqual({ books: { lord: [], rabbit: [0], man: [1], dwarf: [1] } });
    });

    it('should handle empty values as search terms', () => {
      expect(indexInstance.searchIndex([])).toEqual(false);
      expect(indexInstance.searchIndex(' ')).toEqual(false);
    });
  });
});
