import { parseJobsFromHtml } from "../../index.js";
import fetch from "node-fetch";

describe("Qubiz Careers E2E", () => {
  test("should fetch and parse real careers page", async () => {
    const res = await fetch("https://qubiz.com/careers", {
      headers: { "User-Agent": "job_seeker_ro_spider" },
      signal: AbortSignal.timeout(30000),
    });
    expect(res.ok).toBe(true);

    const html = await res.text();
    const jobs = parseJobsFromHtml(html);

    expect(Array.isArray(jobs)).toBe(true);

    if (jobs.length > 0) {
      expect(jobs[0].title).toBeDefined();
      expect(jobs[0].url).toBeDefined();
      expect(jobs[0].url).toContain("qubiz.com");
    }
  }, 30000);
});
