# Files

## Root

| File | Descriere |
|------|-----------|
| index.js | Main scraper orchestrator |
| company.js | Company validation + ANAF integration |
| demoanaf.js | ANAF CLI wrapper around src/anaf.js |
| src/anaf.js | Core ANAF library (getCompanyFromANAF, searchCompany) |
| solr.js | Solr database operations |
| validate-jobs.js | Job URL validator |
| package.json | Node.js dependencies |
| company.json | Cached ANAF company data |

## Docs

| File | Descriere |
|------|-----------|
| docs/index.html | CV / documentation page |

## Tests

| File | Descriere |
|------|-----------|
| tests/unit/scraper.test.js | Unit tests for scraper |
| tests/unit/company.test.js | Unit tests for company module |
| tests/unit/demoanaf.test.js | Unit tests for ANAF module |
| tests/unit/solr.test.js | Unit tests for Solr module |
| tests/integration/workflow.test.js | Integration tests |
| tests/integration/anaf.test.js | ANAF integration tests |
| tests/e2e/scraper.test.js | End-to-end tests |
| tests/e2e/scrape.test.js | E2E scrape tests |
| tests/validate-qubiz-jobs.js | Standalone job validator |
