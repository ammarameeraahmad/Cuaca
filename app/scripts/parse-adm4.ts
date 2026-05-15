import fs from 'fs';
import path from 'path';

interface ADM4Entry {
  adm4: string;
  name: string;
  level: number;
  parentAdm4?: string;
}

// Parse listADM4.md file
const filePath = path.join(__dirname, '../listADM4.md');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const lines = fileContent.split('\n').filter(line => line.trim());

const allEntries: ADM4Entry[] = [];
const adm4Level4: ADM4Entry[] = []; // Hanya kelurahan/desa (level 4)

lines.forEach((line) => {
  const [adm4, name] = line.split(',');
  if (!adm4 || !name) return;

  const adm4Trimmed = adm4.trim();
  const nameTrimmed = name.trim();
  
  // Count dots to determine level
  const level = (adm4Trimmed.match(/\./g) || []).length + 1;

  const entry: ADM4Entry = {
    adm4: adm4Trimmed,
    name: nameTrimmed,
    level,
  };

  allEntries.push(entry);

  // Only push level 4 (kelurahan/desa) entries
  if (level === 4) {
    adm4Level4.push(entry);
  }
});

// Generate TypeScript file
const output = `// Auto-generated from listADM4.md
// DO NOT EDIT MANUALLY

export interface ADM4Location {
  adm4: string;
  name: string;
  searchText: string;
}

export const ADM4_CITIES: ADM4Location[] = [
${adm4Level4
  .map(
    (entry) =>
      `  { adm4: "${entry.adm4}", name: "${entry.name.replace(/"/g, '\\"')}", searchText: "${entry.name.toLowerCase().replace(/"/g, '\\"')}" }`
  )
  .join(',\n')}
];

export const DEFAULT_ADM4 = "34.04.13.2001";

export function searchADM4(query: string): ADM4Location[] {
  const q = query.toLowerCase().trim();
  if (!q) return ADM4_CITIES.slice(0, 10);

  return ADM4_CITIES.filter(
    (city) =>
      city.searchText.includes(q) ||
      city.adm4.includes(q)
  ).slice(0, 20);
}
`;

const outputPath = path.join(__dirname, '../data/adm4-cities.ts');
fs.writeFileSync(outputPath, output);

console.log(`✓ Generated ${adm4Level4.length} ADM4 locations`);
console.log(`✓ Saved to ${outputPath}`);
