# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- `validate-jobs.js` — standalone job URL validator (closes #1)
- `src/anaf.js` — modular ANAF library extracted from demoanaf.js
- Template docs: AGENTS.md, ISSUES.md, ROBOTS.md, TOPICS.md, FROM-EPAM.md, SYNC-CHECKLIST.md, UPDATE-REPO-ABOUT.md
- `.github/CODEOWNERS` — code ownership definition
- `AGENTS.md`, `ISSUES.md` — AI rules and issue process
- `solr.upsertCompany()` — upsert company data to SOLR company core

### Changed
- `demoanaf.js` — rewritten as CLI wrapper with `process.argv[1]` import guard
- `solr.js` — added `upsertCompany()`, User-Agent to `job_seeker_ro_spider`, fixed `getSolrAuth()` to return Basic auth header
- `company.js` — import ANAF from `src/anaf.js`, added CLI entry point, User-Agent fix
- `index.js` — added `upsertCompany` call with Qubiz brand/config, User-Agent fix, restructured to EPAM pattern
- `package.json` — added `--no-deprecation`, `testTimeout` (was `defaultTimeout`), jest reporter config, validate-jobs script
- `.github/workflows/test.yml` — added schedule trigger, simplified uploads, npm ci
- `.github/workflows/scrape.yml` — simplified, npm ci, always() on upload
- `README.md` — added badges, robots.txt section, updated project tree
- `files.md` — ref ANAF as `src/anaf.js`, added validate-jobs.js
- `instructions.md` — added validate-jobs.js usage

### Fixed
- `demoanaf.js` — CI failure from top-level `process.exit(1)` on import
- `solr.js` — `checkUrl()` used invalid `timeout` option (node-fetch v3), changed to `AbortSignal.timeout()`
- `tests/validate-qubiz-jobs.js` — fixed `timeout` to `AbortSignal.timeout()`, added export guard
- All User-Agents now use `job_seeker_ro_spider` consistently

## [1.0.0] - 2026-05-29

### Added
- Initial release
- Job scraping from Qubiz Careers page
- Company validation via ANAF
- Solr integration for job storage
- GitHub Actions workflows for daily scraping and testing
- Comprehensive test suite (unit, integration, E2E)
- ANAF API fallback with cached data support
- Node 24 compatibility

### Features
- Automated daily job scraping
- Company core validation and management
- Job URL validation
- Data integrity checks
- Romanian location filtering
- Work mode normalization

## License

Copyright (c) 2026 BOGA SEBASTIAN-NICOLAE
Licensed under MIT License
