const Index = require("../../src/inverted-index.js");

const books = require("../../books.json");

const indexInstance = new Index();

describe('Book Indexer', () => {
  const filename = "books.json";
  const refinedName = filename.replace(/\.json/g, '').replace(/\s/g, '');

  indexInstance.files[refinedName] = {};
  indexInstance.files[refinedName]['name'] = filename;
  indexInstance.files[refinedName]['books'] = books;
  indexInstance.createIndex(refinedName);
  indexInstance.createIndex(null, indexInstance.files);

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
      expect(indexInstance.isValidJSON('[{"hello":"false"}]')).toBe(false);
      expect(indexInstance.isValidJSON(JSON.stringify(books))).toEqual(books);
    });
    it('should not be empty', () => {
      expect(indexInstance.isValidJSON(JSON.stringify(books)).length).not.toBe(0);
      expect(indexInstance.isValidJSON(JSON.stringify(books)).length).toBe(2);
    });
  });

  describe('Populate Index', () => {
    it('should confirm that index is created once JSON file has been read', () => {
      expect(indexInstance.getIndex(refinedName)).not.toBeUndefined();
      expect(indexInstance.getIndex(refinedName).length).not.toBe(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });

    it('should be correct index', () => {
      expect(indexInstance.getIndex(refinedName).alice).toEqual([0]);
      expect(Object.keys(indexInstance.getIndex(refinedName)).length).toBeGreaterThan(0);
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
      expect(indexInstance.searchIndex('lord rabbit man dwarf')).toEqual({ lord: [], rabbit: [0], man: [1], dwarf: [1] });
      expect(indexInstance.searchIndex('a of elf')).toEqual({ a: [0, 1], of: [0, 1], elf: [1] });
    });
    it('should handle array of words as search terms', () => {
      expect(indexInstance.searchIndex(["lord", "rabbit", "man", "dwarf"])).toEqual({ lord: [], rabbit: [0], man: [1], dwarf: [1] });
    });
    it('should handle empty values as search terms', () => {
      expect(indexInstance.searchIndex([])).toEqual(false);
      expect(indexInstance.searchIndex(" ")).toEqual(false);
    });
  });
});
