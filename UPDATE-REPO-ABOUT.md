# Actualizare About repo pe GitHub

Pentru a actualiza sectiunea **About** din dreapta paginii principale a repo-ului pe GitHub (descriere, website, topics):

## CLI (gh)

```bash
# Descriere
gh repo edit emtreila/qubiz-systems-international-srl-nodejs-scraper \
  --description "web scraper pentru a aduce locurile de munca de la Qubiz in platforma peviitor.ro"

# Website
gh repo edit emtreila/qubiz-systems-international-srl-nodejs-scraper \
  --homepage "https://emtreila.github.io/qubiz-systems-international-srl-nodejs-scraper/"

# Topics
gh repo edit emtreila/qubiz-systems-international-srl-nodejs-scraper \
  --add-topic scraper --add-topic qubiz --add-topic peviitor --add-topic jobs --add-topic romania
```

## Web UI

1. Mergi la `https://github.com/emtreila/qubiz-systems-international-srl-nodejs-scraper`
2. Click pe **Settings** (tab-ul din dreapta sus)
3. Mergi la sectiunea **General** -> **Description**
4. Completeaza:
   - **Description**: textul de mai sus
   - **Website**: URL-ul GitHub Pages
   - **Topics**: cuvinte cheie separate prin spatiu
5. Click **Save changes**

## Verificare

```bash
gh repo view emtreila/qubiz-systems-international-srl-nodejs-scraper --json description,homepage,topics
```
