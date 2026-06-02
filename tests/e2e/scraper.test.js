import { parseJobsFromHtml } from '../../index.js';
import fetch from 'node-fetch';

describe('Qubiz Careers E2E', () => {
  test('should fetch and parse real careers page', async () => {
    const res = await fetch('https://qubiz.com/careers', {
      headers: { 'User-Agent': 'job_seeker_ro_spider' },
      signal: AbortSignal.timeout(30000),
    });
    expect(res.ok).toBe(true);

    const html = await res.text();
    const jobs = parseJobsFromHtml(html);

    expect(Array.isArray(jobs)).toBe(true);

    if (jobs.length > 0) {
      expect(jobs[0].title).toBeDefined();
      expect(jobs[0].url).toBeDefined();
      expect(jobs[0].url).toContain('qubiz.com');
      expect(jobs[0].location).toBeDefined();
      expect(jobs[0].workmode).toBeDefined();
    }
  }, 30000);

  test('should have valid job URLs', async () => {
    const res = await fetch('https://qubiz.com/careers', {
      headers: { 'User-Agent': 'job_seeker_ro_spider' },
      signal: AbortSignal.timeout(30000),
    });
    const html = await res.text();
    const jobs = parseJobsFromHtml(html);

    for (const job of jobs.slice(0, 3)) {
      const jobRes = await fetch(job.url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'job_seeker_ro_spider' },
        signal: AbortSignal.timeout(10000),
      });
      expect(jobRes.ok).toBe(true);
    }
  }, 60000);

  test('should extract work mode correctly', async () => {
    const res = await fetch('https://qubiz.com/careers', {
      headers: { 'User-Agent': 'job_seeker_ro_spider' },
      signal: AbortSignal.timeout(30000),
    });
    const html = await res.text();
    const jobs = parseJobsFromHtml(html);

    const validModes = ['remote', 'on-site', 'hybrid'];
    for (const job of jobs) {
      expect(validModes).toContain(job.workmode);
    }
  }, 30000);
});
