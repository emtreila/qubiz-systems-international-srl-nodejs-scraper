import { parseJobsFromHtml, mapToJobModel, transformJobsForSOLR } from '../../index.js';
import { getCompanyData } from '../../company.js';

describe('Scraper Workflow Integration', () => {
  test('should execute full scrape pipeline with mock data', async () => {
    const mockHtml = `
      <ul>
        <li class="cr-card">
          <div class="cr-card-top">
            <span class="cr-card-category">FRONT-END DEVELOPER</span>
          </div>
          <h3 class="cr-card-title">Front-End Developer</h3>
          <p class="cr-card-meta">Cluj-Napoca, Oradea, Hybrid | Senior</p>
          <a class="cr-card-cta" href="/careers/front-end-developer">APPLY</a>
        </li>
        <li class="cr-card">
          <div class="cr-card-top">
            <span class="cr-card-category">SENIOR DATA ENGINEER</span>
          </div>
          <h3 class="cr-card-title">Senior Data Engineer</h3>
          <p class="cr-card-meta">Cluj-Napoca, Oradea | Senior</p>
          <a class="cr-card-cta" href="/careers/senior-data-engineer">APPLY</a>
        </li>
      </ul>
    `;

    const jobs = parseJobsFromHtml(mockHtml);
    expect(jobs.length).toBe(2);
    expect(jobs[0].title).toBe('Front-End Developer');
    expect(jobs[1].title).toBe('Senior Data Engineer');

    const mappedJobs = jobs.map(job => mapToJobModel(job, '24049362', 'QUBIZ SRL'));
    expect(mappedJobs[0].cif).toBe('24049362');
    expect(mappedJobs[0].company).toBe('QUBIZ SRL');

    const payload = {
      source: 'qubiz.com',
      scrapedAt: new Date().toISOString(),
      company: 'QUBIZ SRL',
      cif: '24049362',
      jobs: mappedJobs
    };

    const transformed = transformJobsForSOLR(payload);
    expect(transformed.company).toBe('QUBIZ SRL');
    expect(transformed.jobs.length).toBe(2);
    expect(transformed.jobs[0].workmode).toBeDefined();
  });

  test('should filter invalid locations', () => {
    const jobs = [
      mapToJobModel(
        {
          url: 'https://qubiz.com/careers/some-job',
          title: 'Some Job',
          location: ['London', 'Cluj-Napoca'],
          workmode: 'remote',
          tags: ['developer']
        },
        '24049362',
        'QUBIZ SRL'
      )
    ];

    const payload = {
      source: 'qubiz.com',
      company: 'QUBIZ SRL',
      cif: '24049362',
      jobs
    };

    const result = transformJobsForSOLR(payload);
    expect(result.jobs[0].location).not.toContain('London');
    expect(result.jobs[0].location).toContain('Cluj-Napoca');
  });
});
