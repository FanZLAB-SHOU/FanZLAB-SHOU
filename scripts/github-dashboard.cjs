// Public GitHub account metrics. No third-party statistics service or package dependencies.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const login = 'FanZLAB-SHOU';
const query = `query($login:String!){user(login:$login){login createdAt
 contributionsCollection{hasAnyRestrictedContributions restrictedContributionsCount totalCommitContributions
 contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}
 repositories(first:100,privacy:PUBLIC,ownerAffiliations:OWNER){totalCount pageInfo{hasNextPage}
 nodes{name isFork stargazerCount forkCount languages(first:100){edges{size node{name color}}}}}}}`;
function fetchData() {
  const result = JSON.parse(execFileSync('gh', ['api', 'graphql', '-f', 'query='+query, '-f', 'login='+login], {encoding:'utf8'}));
  if (result.errors) throw new Error(JSON.stringify(result.errors));
  const u = result.data.user, c = u.contributionsCollection;
  if (u.repositories.pageInfo.hasNextPage) throw new Error('Repository pagination is required before publishing metrics.');
  // Do not publish an owner-only private contribution count.
  if (c.hasAnyRestrictedContributions || c.restrictedContributionsCount) throw new Error('Only public contribution calendars may be published by this script.');
  const data = {schema:1, account:login, created_at:u.createdAt, updated_at:new Date().toISOString(), timezone:'America/Los_Angeles',
    source:'GitHub GraphQL API', contributions:{total:c.contributionCalendar.totalContributions, commits:c.totalCommitContributions,
    days:c.contributionCalendar.weeks.flatMap(w=>w.contributionDays).map(d=>({date:d.date,count:d.contributionCount}))},
    repositories:u.repositories.nodes.map(r=>({name:r.name, fork:r.isFork, stars:r.stargazerCount, forks:r.forkCount,
      languages:r.languages.edges.map(e=>({name:e.node.name,color:e.node.color,bytes:e.size}))}))};
  fs.writeFileSync(path.join(root,'data/github-metrics.json'), JSON.stringify(data,null,2)+'\n');
  return data;
}
const data = process.argv.includes('--snapshot') ? JSON.parse(fs.readFileSync(path.join(root,'data/github-metrics.json'),'utf8')) : fetchData();
const C={bg:'#081827',panel:'#102a3f',line:'#24465e',white:'#edf6ff',muted:'#a7bfd0',blue:'#79b9ff',mint:'#79dfd0'};
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const txt=(x,y,s,size=20,color=C.white,weight=400,attrs='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" ${attrs}>${esc(s)}</text>`;
const rect=(x,y,w,h,fill=C.panel,r=15,stroke=C.line)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const localDate = new Intl.DateTimeFormat('en-US',{timeZone:data.timezone,month:'short',day:'numeric',year:'numeric'}).format(new Date(data.updated_at));
const dateLabel=d=>new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'short',day:'numeric'}).format(new Date(d+'T12:00:00Z'));
function save(name,w,h,title,body) {
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(title)}</title><desc>Source: GitHub public contribution calendar and public repository language byte counts. Forks included in language statistics. Snapshot updated ${esc(localDate)} in America/Los_Angeles.</desc><defs><linearGradient id="area" x2="0" y2="1"><stop stop-color="${C.mint}" stop-opacity=".32"/><stop offset="1" stop-color="${C.mint}" stop-opacity=".01"/></linearGradient></defs><g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif">${rect(1,1,w-2,h-2,C.bg,23)}${body}</g></svg>\n`;
 fs.writeFileSync(path.join(root,'assets',name+'.svg'),svg);
}
function head(title,subtitle,mobile) {
 return txt(30,43,title,mobile?29:30,C.white,650)+txt(30,78,subtitle,mobile?20:17,C.muted);
}
const days=data.contributions.days;
const sum=days.reduce((n,d)=>n+d.count,0);
if(sum!==data.contributions.total)throw new Error('Calendar total does not match daily data.');
let longest=0,current=0;
for(const d of days){current=d.count>0?current+1:0;longest=Math.max(longest,current);}
const activeDays=days.filter(d=>d.count>0).length;
function overview(mobile){
 const w=mobile?780:1200,cols=mobile?2:4,cw=mobile?349:270,ch=mobile?139:140,h=mobile?447:287;
 let b=head('GitHub at a glance','Past year · public GitHub activity',mobile);
 const stats=[[data.contributions.total,'Contributions'],[data.contributions.commits,'Commit contributions'],[data.repositories.length,'Public repositories'],[activeDays,'Active days']];
 stats.forEach(([n,label],i)=>{const x=30+(i%cols)*(cw+20),y=105+Math.floor(i/cols)*(ch+16);b+=rect(x,y,cw,ch)+txt(x+23,y+68,n,mobile?55:52,i%2?C.blue:C.mint,700)+txt(x+23,y+111,label,mobile?21:18,C.muted)});
 b+=txt(30,h-18,`Updated ${localDate} · GitHub calendar dates`,mobile?17:15,C.muted);
 save('github-overview'+(mobile?'-mobile':''),w,h,`GitHub statistics for ${login}: ${data.contributions.total} contributions, ${data.contributions.commits} commit contributions, ${data.repositories.length} public repositories, ${activeDays} active days.`,b);
}
function activity(mobile){
 const w=mobile?780:1200,h=mobile?420:390,subset=days.slice(-30),max=Math.max(1,...subset.map(d=>d.count)),top=Math.max(2,Math.ceil(max/2)*2),x0=58,y0=118,pw=w-98,ph=mobile?213:185,base=y0+ph;
 let b=head('Contribution activity','Daily contributions · last 30 GitHub calendar days',mobile);
 for(let i=0;i<=4;i++){const y=y0+ph*i/4;b+=`<path d="M${x0} ${y}h${pw}" stroke="${C.line}" stroke-dasharray="3 6"/>`+txt(x0-15,y+5,Number((top*(1-i/4)).toFixed(1)),mobile?16:14,C.muted,400,'text-anchor="end"');}
 const pts=subset.map((d,i)=>[x0+i*pw/Math.max(1,subset.length-1),base-d.count/top*ph]);
 const line=pts.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ');
 b+=`<path d="${line}L${x0+pw} ${base}L${x0} ${base}Z" fill="url(#area)"/><path d="${line}" fill="none" stroke="${C.mint}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
 pts.forEach(([x,y],i)=>{if(subset[i].count>0)b+=`<circle cx="${x}" cy="${y}" r="4.5" fill="${C.blue}" stroke="${C.bg}" stroke-width="2"/>`;});
 for(const i of [0,7,14,21,29])if(subset[i])b+=txt(pts[i][0],base+30,dateLabel(subset[i].date),mobile?17:15,C.muted,400,`text-anchor="${i===0?'start':i===29?'end':'middle'}"`);
 b+=txt(30,h-18,`Longest streak: ${longest} ${longest===1?'day':'days'} · Source: GitHub contribution calendar`,mobile?17:15,C.muted);
 save('github-activity'+(mobile?'-mobile':''),w,h,'Daily contribution activity for the last 30 GitHub calendar days.',b);
}
const languages = new Map();
for(const r of data.repositories)for(const l of r.languages){const p=languages.get(l.name)||{name:l.name,color:l.color||C.blue,bytes:0};p.bytes+=l.bytes;languages.set(l.name,p);}
const langs=[...languages.values()].filter(l=>l.bytes>0).sort((a,b)=>b.bytes-a.bytes),totalBytes=langs.reduce((n,l)=>n+l.bytes,0);
function language(mobile){
 const w=mobile?780:1200,h=mobile?475:365,cx=mobile?154:175,cy=mobile?239:206,r=mobile?95:91,circ=2*Math.PI*r;
 let b=head('Code composition','Public repository language bytes · includes forks',mobile);
 let offset=0;
 if(!totalBytes)b+=txt(30,160,'No language data available yet.',22,C.muted);
 for(const l of langs){const fraction=l.bytes/totalBytes,len=fraction*circ;b+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${l.color}" stroke-width="25" stroke-dasharray="${len} ${circ-len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;offset+=len;}
 b+=txt(cx,cy+5,langs.length,43,C.white,700,'text-anchor="middle"')+txt(cx,cy+34,'languages',mobile?20:17,C.muted,400,'text-anchor="middle"');
 langs.forEach((l,i)=>{const x=mobile?310:360+(i%2)*400,y=mobile?126+i*44:134+Math.floor(i/2)*59;b+=`<circle cx="${x}" cy="${y-6}" r="6" fill="${l.color}"/>`+txt(x+20,y,l.name,mobile?23:21,C.white,600)+txt(mobile?732:x+320,y,(l.bytes/totalBytes*100).toFixed(1)+'%',mobile?23:21,C.muted,400,'text-anchor="end"');});
 b+=txt(30,h-41,'Language share by bytes across public repositories.',mobile?18:16,C.muted)+txt(30,h-17,`GitHub Linguist · ${data.repositories.length} public repositories · ${localDate}`,mobile?16:15,C.muted);
 save('github-languages'+(mobile?'-mobile':''),w,h,'Code language composition by bytes in public repositories, including forks. '+langs.map(l=>`${l.name}: ${(l.bytes/totalBytes*100).toFixed(1)}%`).join('; '),b);
}
function calendar(mobile){
 const w=mobile?780:1200,h=mobile?420:365,cols=mobile?14:20,step=mobile?43:50,cell=mobile?32:36,gridX=mobile?105:142,gridY=114;
 const last=new Date(days.at(-1).date+'T12:00:00Z'),end=new Date(last);end.setUTCDate(end.getUTCDate()+(6-end.getUTCDay()));
 const start=new Date(end);start.setUTCDate(start.getUTCDate()-(cols*7-1));
 const counts=new Map(days.map(d=>[d.date,d.count])),max=Math.max(1,...days.map(d=>d.count));
 let b=head('Activity calendar',`Recent ${cols} weeks · GitHub public contribution calendar`,mobile);
 for(const [day,label] of [[1,'Mon'],[3,'Wed'],[5,'Fri']])b+=txt(gridX-17,gridY+day*step+cell*.72,label,mobile?18:16,C.muted,400,'text-anchor="end"');
 const colours=['#142b3b','#194c61','#287f8e','#50b5b2','#79dfd0'];
 for(let i=0;i<cols*7;i++){const d=new Date(start);d.setUTCDate(d.getUTCDate()+i);if(d>last)continue;const date=d.toISOString().slice(0,10),n=counts.get(date)||0,level=n?Math.max(1,Math.ceil(n/max*4)):0,x=gridX+Math.floor(i/7)*step,y=gridY+(i%7)*step;b+=`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="5" fill="${colours[level]}"><title>${date}: ${n} contributions</title></rect>`;}
 // Match panel height to the grid; no empty values imply missing data.
 const finalH=gridY+7*step+72;
 const footer=txt(30,finalH-24,`Account created ${dateLabel(data.created_at.slice(0,10))}, ${data.created_at.slice(0,4)} · ${activeDays} active days in the past year`,mobile?18:16,C.muted);
 b+=footer;
 save('github-calendar'+(mobile?'-mobile':''),w,finalH,'A contribution heatmap covering recent GitHub calendar weeks. Individual cells contain date and contribution counts.',b);
}
for(const mobile of [false,true]){overview(mobile);activity(mobile);language(mobile);calendar(mobile);}
console.log(`Rendered real GitHub metrics: ${data.contributions.total} contributions, ${data.repositories.length} public repositories, ${langs.length} languages.`);
