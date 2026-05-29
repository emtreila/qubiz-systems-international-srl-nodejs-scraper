import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";
import { fileURLToPath } from "url";
import { validateAndGetCompany } from "./company.js";
import { querySOLR, deleteJobByUrl, upsertJobs } from "./solr.js";

const COMPANY_CIF = "24049362";
const TIMEOUT = 10000;
const JOB_BASE = "https://qubiz.com";
const CAREERS_URL = "https://qubiz.com/careers";
let COMPANY_NAME = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchCareersPage() {
  const res = await fetch(CAREERS_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });

  if (!res.ok) {
    throw new Error(`Careers page error: ${res.status}`);
  }

  const html = await res.text();
  return html;
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

function mapToJobModel(rawJob, cif, companyName = COMPANY_NAME) {
  const now = new Date().toISOString();

  const job = {
    url: rawJob.url,
    title: rawJob.title,
    company: companyName,
    cif: cif,
    location: rawJob.location?.length ? rawJob.location : undefined,
    tags: rawJob.tags?.length ? rawJob.tags : undefined,
    workmode: rawJob.workmode || undefined,
    date: now,
    status: "scraped"
  };

  Object.keys(job).forEach((k) => job[k] === undefined && delete job[k]);

  return job;
}

function transformJobsForSOLR(payload) {
  const romanianCities = [
    'Bucharest', 'București', 'Cluj-Napoca', 'Cluj Napoca',
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
  ];

  const citySet = new Set(romanianCities.map(c => c.toLowerCase()));

  const normalizeWorkmode = (wm) => {
    if (!wm) return undefined;
    const lower = wm.toLowerCase();
    if (lower.includes('remote')) return 'remote';
    if (lower.includes('office') || lower.includes('on-site') || lower.includes('site')) return 'on-site';
    return 'hybrid';
  };

  const transformed = {
    ...payload,
    company: payload.company?.toUpperCase(),
    jobs: payload.jobs.map(job => {
      const validLocations = (job.location || []).filter(loc => {
        const lower = loc.toLowerCase().trim();
        if (lower === 'romania' || lower === 'românia') return true;
        return citySet.has(lower);
      }).map(loc => loc.toLowerCase() === 'romania' ? 'România' : loc);

      return {
        ...job,
        location: validLocations.length > 0 ? validLocations : ['România'],
        workmode: normalizeWorkmode(job.workmode)
      };
    })
  };

  return transformed;
}

async function main() {
  const testOnlyOnePage = process.argv.includes("--test");

  try {
    console.log("=== Step 1: Get existing jobs count ===");
    const existingResult = await querySOLR(COMPANY_CIF);
    const existingCount = existingResult.numFound;
    console.log(`Found ${existingCount} existing jobs in SOLR`);

    console.log("=== Step 2: Validate company via ANAF ===");
    const { company, cif } = await validateAndGetCompany();
    COMPANY_NAME = company;
    const localCif = cif;

    console.log("=== Step 3: Scrape Qubiz Careers ===");
    console.log(`Fetching careers page: ${CAREERS_URL}`);
    const html = await fetchCareersPage();
    const rawJobs = parseJobsFromHtml(html);
    const scrapedCount = rawJobs.length;
    console.log(`📊 Jobs scraped from Qubiz Careers: ${scrapedCount}`);

    rawJobs.forEach((job, i) => {
      console.log(`  ${i+1}. ${job.title} - ${job.location.join(", ") || "N/A"} (${job.workmode})`);
    });

    const jobs = rawJobs.map(job => mapToJobModel(job, localCif));

    const payload = {
      source: "qubiz.com",
      scrapedAt: new Date().toISOString(),
      company: COMPANY_NAME,
      cif: localCif,
      jobs
    };

    console.log("Transforming jobs for SOLR...");
    const transformedPayload = transformJobsForSOLR(payload);
    const validCount = transformedPayload.jobs.filter(j => j.location).length;
    console.log(`📊 Jobs with valid Romanian locations: ${validCount}`);

    fs.writeFileSync("jobs.json", JSON.stringify(transformedPayload, null, 2), "utf-8");
    console.log("Saved jobs.json");

    console.log("\n=== Step 4: Upsert jobs to SOLR ===");
    await upsertJobs(transformedPayload.jobs);

    const finalResult = await querySOLR(COMPANY_CIF);
    console.log(`\n📊 === SUMMARY ===`);
    console.log(`📊 Jobs existing in SOLR before scrape: ${existingCount}`);
    console.log(`📊 Jobs scraped from Qubiz website: ${scrapedCount}`);
    console.log(`📊 Jobs in SOLR after scrape: ${finalResult.numFound}`);
    console.log(`====================`);

    console.log("\n=== DONE ===");
    console.log("Scraper completed successfully!");

  } catch (err) {
    console.error("Scraper failed:", err);
    process.exit(1);
  }
}

export { parseJobsFromHtml, mapToJobModel, transformJobsForSOLR };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
