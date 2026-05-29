# Scraper Instructions

## Overview

This scraper extracts job listings from Qubiz Careers (https://qubiz.com/careers) and stores them in Solr for peviitor.ro.

## Company Details

- **Legal Name**: QUBIZ SRL
- **CIF/CUI**: 24049362
- **Registration**: J05/1563/2008
- **Address**: Strada Louis Pasteur 165, Oradea, Bihor, Romania
- **Website**: https://qubiz.com
- **Careers**: https://qubiz.com/careers
- **Industry**: Software Development (CAEN 6201 - Activitati de servicii in tehnologia informatiei)

## Workflow

1. The scraper runs daily at 6 AM UTC via GitHub Actions
2. Validates company data via ANAF (Romanian National Agency for Fiscal Administration)
3. Scrapes current job listings from Qubiz Careers
4. Transforms data to match the job model schema
5. Stores jobs in Solr via upsert operations
6. Uploads job data as artifacts

## Manual Run

```bash
npm run scrape
```

## Test

```bash
npm test
```
