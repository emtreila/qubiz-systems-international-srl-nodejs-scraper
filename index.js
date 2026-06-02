import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";
import { pathToFileURL } from "url";
import * as company from "./company.js";
import * as solr from "./solr.js";

const COMPANY_BRAND = "Qubiz";
const COMPANY_CIF = "24049362";
const COMPANY_NAME = "QUBIZ SRL";
const CAREERS_URL = "https://qubiz.com/careers";
const JOB_BASE = "https://qubiz.com";
const TIMEOUT = 10000;

const ROMANIAN_CITIES = new Set([
  'Bucharest', 'București', 'Cluj-Napoca', 'Cluj Napoca', 'Cluj',
  'Timișoara', 'Timisoara', 'Iași', 'Iasi', 'Brașov', 'Brasov',
  'Constanța', 'Constanta', 'Craiova', 'Bacău', 'Sibiu',
  'Târgu Mureș', 'Targu Mures', 'Oradea', 'Baia Mare', 'Satu Mare',
  'Ploiești', 'Ploiesti', 'Pitești', 'Pitesti', 'Arad', 'Galați', 'Galati',
  'Brăila', 'Braila', 'Drobeta-Turnu Severin', 'Râmnicu Vâlcea', 'Ramnicu Valcea',
  'Buzău', 'Buzau', 'Botoșani', 'Botosani', 'Zalău', 'Zalau', 'Hunedoara', 'Deva',
  'Suceava', 'Bistrița', 'Bistrita', 'Tulcea', 'Călărași', 'Calarasi',
  'Giurgiu', 'Alba Iulia', 'Slatina', 'Piatra Neamț', 'Piatra Neamt', 'Roman',
  'Dumbrăvița', 'Dumbravita', 'Voluntari', 'Popești-Leordeni', 'Popesti-Leordeni',
  'Chitila', 'Mogoșoaia', 'Mogosoaia', 'Otopeni'
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCareersPage() {
  const response = await fetch(CAREERS_URL, {
    headers: {
      "User-Agent": "job_seeker_ro_spider",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    },
    signal: AbortSignal.timeout(TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Careers page error: ${response.status}`);
  }

  return response.text();
}

function parseJobsFromHtml(html) {
  const $ = cheerio.load(html);
  const jobs = [];

  $("li.cr-card").each((i, el) => {
    const category = $(el).find(".cr-card-category").text().trim();
    const title = $(el).find(".cr-card-title").text().trim();
    const meta = $(el).find(".cr-card-meta").text().trim();
    const href = $(el).find(".cr-card-cta").attr("href");

    if (!title || !href) return;

    const location = [];
    let workmode = "hybrid";
    let seniority = "";

    if (meta) {
      const parts = meta.split("|").map(p => p.trim());
      const locationPart = parts[0] || "";
      const seniorityPart = parts[1] || "";

      const locations = locationPart.split(",").map(l => l.trim()).filter(Boolean);
      locations.forEach(loc => {
        const cleanLoc = loc.replace(/\s*\(.*?\)\s*/g, "").trim();
        if (cleanLoc && cleanLoc.length > 0) {
          location.push(cleanLoc);
        }
      });

      if (meta.toLowerCase().includes("hybrid")) workmode = "hybrid";
      else if (meta.toLowerCase().includes("remote")) workmode = "remote";
      else if (meta.toLowerCase().includes("on-site") || meta.toLowerCase().includes("office")) workmode = "on-site";

      seniority = seniorityPart;
    }

    const url = href.startsWith("http") ? href : `${JOB_BASE}${href}`;

    const tags = [category.toLowerCase()];
    if (seniority) tags.push(seniority.toLowerCase());

    jobs.push({
      url,
      title,
      uid: href.replace("/careers/", ""),
      workmode,
      location,
      tags,
      category,
      seniority
    });
  });

  return jobs;
}

function mapToJobModel(rawJob, cif, companyName) {
  const job = {
    url: rawJob.url,
    title: rawJob.title,
    company: companyName,
    cif,
    location: rawJob.location,
    tags: rawJob.tags,
    workmode: rawJob.workmode,
    date: new Date().toISOString(),
    status: 'scraped',
  };

  Object.keys(job).forEach(key => {
    if (job[key] === undefined) delete job[key];
  });

  return job;
}

function transformJobsForSOLR(payload) {
  const citySet = new Set(Array.from(ROMANIAN_CITIES).map(c => c.toLowerCase()));

  const normalizeWorkmode = (wm) => {
    if (!wm) return undefined;
    const lower = wm.toLowerCase();
    if (lower.includes('remote')) return 'remote';
    if (lower.includes('office') || lower.includes('on-site') || lower.includes('site')) return 'on-site';
    return 'hybrid';
  };

  const transformed = {
    ...payload,
    company: COMPANY_NAME,
    jobs: payload.jobs.map(job => {
      const validLocations = (job.location || []).filter(loc => {
        const lower = loc.toLowerCase().trim();
        if (lower === 'romania' || lower === 'românia') return true;
        return citySet.has(lower);
      }).map(loc => loc.toLowerCase() === 'romania' ? 'România' : loc);

      return {
        ...job,
        company: COMPANY_NAME,
        location: validLocations.length > 0 ? validLocations : ['România'],
        workmode: normalizeWorkmode(job.workmode)
      };
    })
  };

  return transformed;
}

async function main() {
  console.log(`[${COMPANY_BRAND} Scraper] Starting...`);

  try {
    try {
      const existingResult = await solr.querySOLR(COMPANY_CIF);
      const existingCount = existingResult?.response?.numFound || 0;
      console.log(`[${COMPANY_BRAND} Scraper] Existing jobs in SOLR: ${existingCount}`);
    } catch (e) {
      console.warn(`[${COMPANY_BRAND} Scraper] SOLR unavailable (${e.message}), continuing without existing count`);
    }

    try {
      const companyData = await company.validateAndGetCompany();
      if (companyData && companyData.status === 'active') {
        console.log(`[${COMPANY_BRAND} Scraper] Company validated: ${companyData.company} (CIF: ${companyData.cif})`);
        try {
          await solr.upsertCompany({
            id: COMPANY_CIF,
            company: COMPANY_NAME,
            brand: COMPANY_BRAND,
            status: 'activ',
            location: ['Oradea', 'Cluj-Napoca'],
            website: ['https://www.qubiz.com'],
            career: ['https://qubiz.com/careers'],
            lastScraped: new Date().toISOString().split('T')[0],
            scraperFile: 'https://raw.githubusercontent.com/emtreila/qubiz-systems-international-srl-nodejs-scraper/master/.github/workflows/scrape.yml'
          });
        } catch (err) {
          console.log(`[${COMPANY_BRAND} Scraper] Note: Could not upsert company to SOLR core: ${err.message}`);
        }
      } else {
        console.warn(`[${COMPANY_BRAND} Scraper] Company validation: ${companyData?.status || 'unknown'}`);
      }
    } catch (e) {
      console.warn(`[${COMPANY_BRAND} Scraper] Company validation skipped (${e.message})`);
    }

    console.log(`[${COMPANY_BRAND} Scraper] Fetching careers page: ${CAREERS_URL}`);
    const html = await fetchCareersPage();
    const rawJobs = parseJobsFromHtml(html);
    console.log(`[${COMPANY_BRAND} Scraper] Scraped ${rawJobs.length} raw jobs`);

    rawJobs.forEach((job, i) => {
      console.log(`  ${i+1}. ${job.title} - ${job.location.join(", ") || "N/A"} (${job.workmode})`);
    });

    const mappedJobs = rawJobs.map(job => mapToJobModel(job, COMPANY_CIF, COMPANY_NAME));
    console.log(`[${COMPANY_BRAND} Scraper] Mapped ${mappedJobs.length} jobs`);

    const solrReadyJobs = transformJobsForSOLR({ source: "qubiz.com", company: COMPANY_NAME, cif: COMPANY_CIF, jobs: mappedJobs });
    console.log(`[${COMPANY_BRAND} Scraper] Transformed ${solrReadyJobs.jobs.length} jobs for SOLR`);

    if (solrReadyJobs.jobs.length > 0) {
      try {
        console.log(`[${COMPANY_BRAND} Scraper] Deleting existing jobs for CIF ${COMPANY_CIF}...`);
        await solr.deleteJobsByCIF(COMPANY_CIF);
        console.log(`[${COMPANY_BRAND} Scraper] Old jobs deleted. Upserting ${solrReadyJobs.jobs.length} jobs...`);
        const result = await solr.upsertJobs(solrReadyJobs.jobs);
        console.log(`[${COMPANY_BRAND} Scraper] Upsert result:`, result);
      } catch (e) {
        console.warn(`[${COMPANY_BRAND} Scraper] SOLR upsert failed (${e.message}), saving locally only`);
      }
    }

    writeFileSync('jobs.json', JSON.stringify(solrReadyJobs.jobs, null, 2));
    console.log(`[${COMPANY_BRAND} Scraper] Jobs saved to jobs.json`);

    console.log(`[${COMPANY_BRAND} Scraper] Done! ${solrReadyJobs.jobs.length} jobs processed.`);
  } catch (err) {
    console.error(`[${COMPANY_BRAND} Scraper] Error:`, err.message);
    process.exit(1);
  }
}

export { parseJobsFromHtml, mapToJobModel, transformJobsForSOLR };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
