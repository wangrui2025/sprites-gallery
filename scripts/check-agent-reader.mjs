import assert from 'node:assert/strict';
import fs from 'node:fs';
const root='dist/';
const j=JSON.parse(fs.readFileSync(root+'agent/site.json','utf8'));
const html=fs.readFileSync(root+'agent/index.html','utf8');
const llms=fs.readFileSync(root+'llms.txt','utf8');
assert.equal(j.home,"https://wangrui2025.github.io/sprites-gallery/");
assert.equal(j.title,"Pokémon Sprite Gallery");
assert.ok(j.sections.length>=1 && j.limitations.length>0);
assert.ok(html.includes('Agent Reader') && html.includes(j.title) && html.includes(j.source));
assert.ok(llms.includes(j.home+'agent/') && llms.includes(j.home+'agent/site.json'));
for(const section of j.sections){assert.ok(section.title&&section.description&&section.url.startsWith(j.home));assert.ok(Array.isArray(section.items));for(const item of section.items){assert.ok(item.title&&item.description&&/^https:\/\//.test(item.url));}}
assert.ok(j.sections[0].items.length>2);
assert.ok(!/PRIVATE KEY|github_pat_|ghp_[A-Za-z0-9]{25,}/.test(JSON.stringify(j)));
console.log('Reader HTML, JSON, llms.txt, source and boundaries PASS');
