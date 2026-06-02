# Robots.txt Analysis — Qubiz Careers

Sursa: https://qubiz.com/careers

## Nota

Qubiz nu are un fisier `robots.txt` restrictionat. Scraperul acceseaza pagina HTML de cariere (https://qubiz.com/careers) si extrage job-urile din HTML.

## Metoda

Scraperul foloseste HTML scraping cu cheerio (nu API JSON):
- Fetch pagina HTML de la https://qubiz.com/careers
- Parseaza `li.cr-card` elementele din DOM
- Extrage titlu, locatie, work-mode, URL

## Reguli de acces

| Aspect | Detalii |
|--------|---------|
| Sursa | HTML scraping (cheerio) |
| Metoda | HTTP GET + DOM parsing |
| Rate limiting | 1000ms delay intre cereri |
| User-Agent | `job_seeker_ro_spider` |
| Risc | Scazut — pagina de cariere publica |

## Recomandare

- Scraperul este politicos: o singura cerere pe sesiune
- Nu se face scraping pe alte pagini decat https://qubiz.com/careers
- Rate limiting: 1000ms delay intre cereri
- User-Agent: `job_seeker_ro_spider`
