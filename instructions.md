# Instructiuni

## Colectare locala

```bash
npm install
npm run scrape
```

## Testare

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Validare job-uri

```bash
# Varianta noua (EPAM port)
node validate-jobs.js 24049362
node validate-jobs.js 24049362 --delete

# Varianta veche
node tests/validate-qubiz-jobs.js --dry-run
node tests/validate-qubiz-jobs.js --delete
```

## Deploy

Push pe branch-ul master declanseaza deploy automat pe GitHub Pages.
