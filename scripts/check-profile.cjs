const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const data=JSON.parse(read('data/github-metrics.json'));
assert.equal(data.account,'FanZLAB-SHOU');
assert.ok(!Number.isNaN(Date.parse(data.updated_at)));
const days=data.contributions.days;
assert.equal(new Set(days.map(d=>d.date)).size,days.length);
assert.deepEqual(days.map(d=>d.date),days.map(d=>d.date).sort());
assert.ok(days.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&Number.isInteger(d.count)&&d.count>=0));
assert.equal(days.reduce((n,d)=>n+d.count,0),data.contributions.total);
assert.ok(data.repositories.every(r=>r.languages.every(l=>l.bytes>=0)));
const md=read('README.md');
assert.ok(md.includes('Python')&&!md.includes('ggplot2'));
for(const match of md.matchAll(/https:\/\/raw\.githubusercontent\.com\/FanZLAB-SHOU\/FanZLAB-SHOU\/main\/([^"\s]+)/g)) {
 const file=match[1].split('?')[0];
 assert.ok(fs.existsSync(path.join(root,file)),file);
 const svg=read(file);
 assert.ok(svg.startsWith('<svg'),file);
 assert.ok(!/<script|<foreignObject|href="https?:/i.test(svg),file+' must be self-contained');
}
for(const name of ['overview','activity','languages','calendar'])for(const suffix of ['','-mobile']) {
 const svg=read('assets/github-'+name+suffix+'.svg');
 assert.ok(svg.includes('<title>')&&svg.includes('GitHub'),name);
}
assert.ok(read('assets/methods.svg').includes('python-original'), 'Use the actual Python logo');
assert.ok(read('assets/methods.svg').includes(read('assets/logos/cplusplus.svg').match(/<path[^>]+>/)[0]), 'Keep the C++ brand glyph');
console.log('Verified real calendar totals, dates, language byte data, README assets, desktop/mobile panels and tool logos.');
