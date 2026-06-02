# Topics — Repo GitHub About

Topics (etichetele) din sectiunea **About** a repo-ului pe GitHub se adauga cu `gh repo edit --add-topic <nume>` sau manual in Settings -> General -> Topics.

## Topic-uri active

| Topic | Descriere |
|-------|-----------|
| `job-seeker-ro-spider` | Numele scraperului (User-Agent-ul folosit in toate request-urile HTTP) |
| `peviitor-ro` | Platforma pentru care se face scraping-ul |

## Reguli

- GitHub topics accepta doar litere mici, cifre si **hyphens** (`-`). Underscore (`_`) nu e permis.
- Maxim 50 de caractere per topic.
- Adaugam topic-uri noi doar cu issue in GitHub Issues inainte.

## Adaugare topic nou

```bash
gh repo edit <owner>/<repo> --add-topic <nume-topic>
```

sau manual pe `https://github.com/<owner>/<repo>/settings`.
