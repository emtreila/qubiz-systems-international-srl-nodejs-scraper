import { jest } from '@jest/globals';

describe('solr.js', () => {
  let solr;

  beforeAll(async () => {
    process.env.SOLR_AUTH = 'test:test';
    solr = await import('../../solr.js');
  });

  afterAll(() => {
    delete process.env.SOLR_AUTH;
  });

  describe('getSolrAuth', () => {
    it('should return SOLR_AUTH from environment', () => {
      expect(solr.getSolrAuth()).toBe('test:test');
    });

    it('should return undefined if SOLR_AUTH not set', () => {
      delete process.env.SOLR_AUTH;
      expect(solr.getSolrAuth()).toBeUndefined();
      process.env.SOLR_AUTH = 'test:test';
    });
  });

  describe('querySOLR', () => {
    it('should throw error if SOLR_AUTH not set', async () => {
      delete process.env.SOLR_AUTH;
      await expect(solr.querySOLR('24049362')).rejects.toThrow('SOLR_AUTH');
      process.env.SOLR_AUTH = 'test:test';
    });

    it('should handle network errors gracefully', async () => {
      await expect(solr.querySOLR('24049362')).rejects.toThrow();
    });
  });

  describe('queryCompanySOLR', () => {
    it('should throw error if SOLR_AUTH not set', async () => {
      delete process.env.SOLR_AUTH;
      await expect(solr.queryCompanySOLR('company:QUBIZ*')).rejects.toThrow('SOLR_AUTH');
      process.env.SOLR_AUTH = 'test:test';
    });
  });

  describe('upsertJobs', () => {
    it('should throw error if SOLR_AUTH not set', async () => {
      delete process.env.SOLR_AUTH;
      await expect(solr.upsertJobs([])).rejects.toThrow('SOLR_AUTH');
      process.env.SOLR_AUTH = 'test:test';
    });
  });
});
