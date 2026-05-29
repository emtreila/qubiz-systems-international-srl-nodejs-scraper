import { parseJobsFromHtml, mapToJobModel, transformJobsForSOLR } from "../../index.js";

describe("parseJobsFromHtml", () => {
  test("should extract jobs from HTML", () => {
    const html = `
      <ul>
        <li class="cr-card">
          <div class="cr-card-top">
            <span class="cr-card-category">FRONT-END DEVELOPER</span>
          </div>
          <h3 class="cr-card-title">Front-End Developer</h3>
          <p class="cr-card-meta">Cluj-Napoca, Oradea, Hybrid | Senior</p>
          <a class="cr-card-cta" href="/careers/front-end-developer">APPLY</a>
        </li>
      </ul>
    `;

    const jobs = parseJobsFromHtml(html);
    expect(jobs.length).toBe(1);
    expect(jobs[0].title).toBe("Front-End Developer");
    expect(jobs[0].location).toContain("Cluj-Napoca");
    expect(jobs[0].location).toContain("Oradea");
    expect(jobs[0].workmode).toBe("hybrid");
    expect(jobs[0].url).toBe("https://qubiz.com/careers/front-end-developer");
  });

  test("should return empty array for no job cards", () => {
    const jobs = parseJobsFromHtml("<html><body></body></html>");
    expect(jobs).toEqual([]);
  });
});

describe("mapToJobModel", () => {
  test("should map raw job to Solr model", () => {
    const rawJob = {
      url: "https://qubiz.com/careers/net-tech-lead",
      title: ".NET Tech Lead",
      location: ["Cluj-Napoca", "Oradea"],
      workmode: "hybrid",
      tags: ["tech lead", "senior"]
    };

    const result = mapToJobModel(rawJob, "24049362", "QUBIZ SRL");
    expect(result.url).toBe("https://qubiz.com/careers/net-tech-lead");
    expect(result.title).toBe(".NET Tech Lead");
    expect(result.company).toBe("QUBIZ SRL");
    expect(result.cif).toBe("24049362");
    expect(result.location).toEqual(["Cluj-Napoca", "Oradea"]);
    expect(result.tags).toEqual(["tech lead", "senior"]);
    expect(result.status).toBe("scraped");
  });
});

describe("transformJobsForSOLR", () => {
  test("should transform and validate jobs", () => {
    const payload = {
      source: "qubiz.com",
      company: "qubiz srl",
      cif: "24049362",
      jobs: [
        {
          url: "https://qubiz.com/careers/senior-data-engineer",
          title: "Senior Data Engineer",
          company: "qubiz srl",
          cif: "24049362",
          location: ["Cluj-Napoca", "Oradea"],
          workmode: "hybrid",
          date: "2026-01-01T00:00:00Z",
          status: "scraped"
        }
      ]
    };

    const result = transformJobsForSOLR(payload);
    expect(result.company).toBe("QUBIZ SRL");
    expect(result.jobs[0].location).toContain("Cluj-Napoca");
    expect(result.jobs[0].workmode).toBe("hybrid");
  });
});
