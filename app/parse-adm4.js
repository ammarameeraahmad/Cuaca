const fs = require('fs');
const path = require('path');

// Read file
const content = fs.readFileSync(path.join(__dirname, 'listADM4.md'), 'utf-8');
const lines = content.split('\n').filter(l => l.trim());

// Parse entries dengan level 4 saja (kelurahan/desa)
const adm4Cities = [];
lines.forEach(line => {
  const parts = line.split(',');
  if (parts.length !== 2) return;
  const adm4 = parts[0].trim();
  const name = parts[1].trim();
  const level = (adm4.match(/\./g) || []).length + 1;
  if (level === 4) {
    adm4Cities.push({ adm4, name });
  }
});

// Generate TypeScript
let output = `// Auto-generated from listADM4.md
// ${adm4Cities.length} ADM4 level-4 locations (kelurahan/desa)

export interface ADM4Location {
  adm4: string;
  name: string;
  searchText: string;
}

export const ADM4_CITIES: ADM4Location[] = [
`;

adm4Cities.forEach((c, i) => {
  const escaped = c.name.replace(/'/g, "\\'");
  output += `  { adm4: '${c.adm4}', name: '${escaped}', searchText: '${escaped.toLowerCase()}' }${i < adm4Cities.length - 1 ? ',' : ''}
`;
});

output += `];

export const DEFAULT_ADM4 = '34.04.13.2001';

export function searchADM4(query: string): ADM4Location[] {
  const q = query.toLowerCase().trim();
  if (!q) return ADM4_CITIES.slice(0, 15);
  return ADM4_CITIES.filter(c => c.searchText.includes(q) || c.adm4.includes(q)).slice(0, 30);
}
`;

fs.writeFileSync(path.join(__dirname, 'data/adm4-cities.ts'), output);
console.log('✓ Generated', adm4Cities.length, 'ADM4 locations');
