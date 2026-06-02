# SYNC-CHECKLIST.md — Verificare sincronizare cu EPAM

Cand EPAM (sablonul principal) primeste actualizari, verifica daca acestea
trebuie propagate in Qubiz. Vezi [FROM-EPAM.md](FROM-EPAM.md) pentru context.

## Checklist

- [x] `CHANGELOG.md` — istoric modificari
- [x] `CONTRIBUTING.md` — ghid contributie
- [x] `SECURITY.md` — politici securitate
- [x] `company-model.md` — model date companie
- [x] `job-model.md` — model date job
- [x] `instructions.md` — instructiuni operare
- [x] `files.md` — lista fisiere
- [x] `.github/CODEOWNERS` — code owners
- [x] `.github/workflows/deploy.yml` — deploy GitHub Pages
- [x] `.github/workflows/scrape.yml` — workflow scrape zilnic
- [x] `.github/workflows/test.yml` — workflow testare automata
- [x] `.gitignore` — fisiere ignorate
- [x] `package.json` — scripts, jest config
- [x] `README.md` — badge-uri, features, structura proiect
- [x] `company.js` — validare companie
- [x] `demoanaf.js` — CLI ANAF
- [x] `solr.js` — operatii SOLR
- [x] `index.js` — orchestrator scraper
- [x] `validate-qubiz-jobs.js` — validator URL-uri job
- [x] `docs/index.html` — pagina GitHub Pages
- [x] `AGENTS.md` — reguli AI, comenzi test, structura module
- [x] `ISSUES.md` — proces contributie, reguli issue
- [x] `ROBOTS.md` — analiza sursa job-uri (specific Qubiz)
- [x] `TOPICS.md` — topic-uri GitHub About
- [x] `UPDATE-REPO-ABOUT.md` — ghid actualizare About (necesita owner)
- [x] `FROM-EPAM.md` — relatia cu EPAM
- [x] `SYNC-CHECKLIST.md` — acest fisier
- [x] `src/anaf.js` — modul ANAF modular
- [x] `tests/` — teste unitare, integrare, e2e (verificate — toate trec)

## Cum se sincronizeaza

1. Verifica `git log` in EPAM pentru commit-uri noi
2. Pentru fiecare fisier din checklist, compara intre EPAM si Qubiz
3. Daca diferenta e doar de configurare (CIF, nume companie, URL sursa),
   aplica modificarea in Qubiz
4. Daca e o schimbare structurala, adapteaza pentru specificul Qubiz
5. Ruleaza `npm test` inainte de commit
