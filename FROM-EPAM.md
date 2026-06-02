# FROM-EPAM.md — Qubiz EPAM Sync Relationship

Acest document explica relatia dintre repo-urile scraper:

- **EPAM** — [`epam-systems-international-srl-nodejs-scraper`](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) — sablonul principal
- **Qubiz** — [`qubiz-systems-international-srl-nodejs-scraper`](https://github.com/emtreila/qubiz-systems-international-srl-nodejs-scraper) — repo derivat

## Scop

Repo-ul EPAM contine sablonul de referinta pentru structura, configurare si bune practici.
Qubiz este derivat din EPAM si ar trebui sa ramana sincronizat.

Pentru lista completa de verificare, vezi [SYNC-CHECKLIST.md](SYNC-CHECKLIST.md).

## Diferente cunoscute

| Aspect | EPAM | Qubiz |
|--------|------|-------|
| CIF | `33159615` | `24049362` |
| Company | `EPAM SYSTEMS INTERNATIONAL SRL` | `QUBIZ SRL` |
| Brand | `EPAM` | `Qubiz` |
| Sursa job-uri | API JSON (careers.epam.com) | HTML scraping (qubiz.com/careers) |
| Metoda scraping | JSON API + paginare | HTML DOM parsing cu cheerio |
| `src/anaf.js` | Da (modular) | Da (modular, sincronizat) |
