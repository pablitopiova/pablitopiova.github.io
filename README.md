# Pablo Piovano: portfolio

Personal site of Pablo Piovano, Director of AI at OZ Digital, Microsoft MVP (AI) and Docker Captain. Static HTML, CSS and vanilla JS, published with GitHub Pages.

## Updating content

The site reads the generated `data.js`. The source data (`data/`) is kept locally and is not published.

- `node tools/import-month.mjs <month.csv>` appends a monthly CSV to `data/contributions.json`.
- `node tools/build-data.mjs` regenerates `data.js`.
- `node tools/serve.mjs` serves the site at http://localhost:4173.
