#!/usr/bin/env node

import { getCompanyFromANAF, getCompanyFromANAFWithFallback, searchCompany } from './src/anaf.js';

export { getCompanyFromANAF, getCompanyFromANAFWithFallback, searchCompany };

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === 'search' && args[1]) {
    const results = await searchCompany(args[1]);
    console.log(JSON.stringify(results, null, 2));
  } else if (args[0]) {
    const data = await getCompanyFromANAF(args[0]);
    console.log(JSON.stringify(data, null, 2));
  } else {
    const data = await getCompanyFromANAF('24049362');
    console.log(JSON.stringify(data, null, 2));
  }
}

if (process.argv[1]?.includes('demoanaf')) {
  main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
