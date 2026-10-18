const fs=require('fs');
const path=require('path');
const root=process.argv[2];
const C={bg:'#081827',panel:'#102a3f',line:'#24465e',white:'#edf6ff',muted:'#a7bfd0',blue:'#79b9ff',mint:'#79dfd0'};
const esc=s=>s.replaceAll('&','&amp;');
function text(x,y,s,size=20,color=C.white,weight=400,extra=''){return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" ${extra}>${esc(s)}</text>`}
function svg(w,h,title,body){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(title)}</title><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b263c"/><stop offset="1" stop-color="#06131f"/></linearGradient><linearGradient id="accent"><stop stop-color="#79b9ff"/><stop offset="1" stop-color="#79dfd0"/></linearGradient></defs><g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif">${body}</g></svg>\n`}
function save(n,w,h,t,b){fs.writeFileSync(path.join(root,'assets',n+'.svg'),svg(w,h,t,b))}
let waves='';
for(let i=0;i<17;i++){let d=`M 680 ${100+i*16} C 800 ${-50+i*16}, 1010 ${370+i*4}, 1280 ${155+i*13}`;waves+=`<path d="${d}" fill="none" stroke="${i%4===0?C.mint:C.blue}" stroke-opacity="${i%4===0?.35:.12}" stroke-width="${i%4===0?1.7:1}"/>`}
let hero=`<rect x="1" y="1" width="1198" height="418" rx="25" fill="url(#bg)" stroke="${C.line}"/>${waves}<path d="M 620 68 H 1146 M 620 352 H 1146" stroke="${C.line}"/>`;
hero+=text(50,54,'OFEL / RESEARCH GROUP',14,C.mint,700,'letter-spacing="3"');
hero+=text(50,139,'Ocean science.',65,C.white,750,'letter-spacing="-2"');
hero+=text(50,214,'Quantitative thinking.',65,C.blue,750,'letter-spacing="-2"');
hero+=text(53,267,'Oceanic Fisheries Ecosystem Laboratory',23,C.white,500);
hero+=text(53,300,'Shanghai Ocean University · Fan Zhang Lab',18,C.muted);
hero+=`<path d="M 52 341 H 570" stroke="${C.line}"/>`+text(53,378,'Understanding ocean change. Informing fisheries.',18,C.muted);
hero+=text(1146,54,'SHANGHAI / CHINA',12,C.muted,600,'text-anchor="end" letter-spacing="2"');
hero+=`<circle cx="932" cy="214" r="108" fill="#11374a" fill-opacity=".45" stroke="${C.line}"/><circle cx="932" cy="214" r="79" fill="none" stroke="${C.line}"/><ellipse cx="932" cy="214" rx="45" ry="108" fill="none" stroke="${C.line}"/><path d="M 824 214 H 1040 M 842 160 H 1022 M 842 268 H 1022" stroke="${C.line}"/><path d="M 804 273 C 870 170, 967 269, 1062 151" stroke="${C.mint}" stroke-width="2.4" fill="none" stroke-dasharray="5 9"/><circle cx="833" cy="239" r="5" fill="${C.mint}"/><circle cx="1003" cy="207" r="6" fill="${C.blue}"/><circle cx="1062" cy="151" r="5" fill="${C.mint}"/>`;
hero+=text(932,374,'ONE CONNECTED OCEAN',13,C.mint,700,'text-anchor="middle" letter-spacing="2.2"');
save('cover',1200,420,'OFEL — Ocean science. Quantitative thinking. Oceanic Fisheries Ecosystem Laboratory, Shanghai Ocean University.',hero);
const cards=[
 {n:'01',k:'POPULATIONS',a:'Population dynamics',b:'& stock assessment',d:['Models of growth, recruitment','and mortality.'],icon:'<path d="M4 44V5m0 39h46M11 35c9-1 8-25 19-25s8 17 20 10"/>'},
 {n:'02',k:'FISHERIES DATA',a:'Artificial intelligence',b:'& vessel behaviour',d:['Fishing activity and fleet dynamics','through vessel-tracking data.'],icon:'<path d="M4 40 17 17l17 16L49 8" stroke-dasharray="3 4"/><circle cx="4" cy="40" r="3"/><circle cx="17" cy="17" r="3"/><circle cx="34" cy="33" r="3"/><circle cx="49" cy="8" r="3"/>'},
 {n:'03',k:'BIOLOGY & DNA',a:'Life histories',b:'& population structure',d:['Biological observations and','genetic evidence.'],icon:'<path d="M12 3c32 10 32 34 0 46M42 3c-32 10-32 34 0 46M18 8h18M15 44h24M16 16h22M16 36h22M14 26h26"/>'},
 {n:'04',k:'OCEAN CHANGE',a:'Climate change',b:'& marine ecosystems',d:['Environmental variability and','the responses of marine species.'],icon:'<path d="M1 29c8-12 17 12 26 0s17 12 26 0M1 42c8-12 17 12 26 0s17 12 26 0"/><circle cx="28" cy="11" r="7"/>'},
 {n:'05',k:'MANAGEMENT',a:'Climate-adaptive',b:'fisheries management',d:['Management approaches for','changing marine populations.'],icon:'<path d="M27 3 48 12v16c0 11-21 22-21 22S6 39 6 28V12Z"/><path d="m17 26 7 7 13-15"/>'},
 {n:'06',k:'OPEN METHODS',a:'Models into practice',b:'ALSCL / R + TMB',d:['Catch-at-length models for','fisheries stock assessment.'],icon:'<path d="m17 13-13 13 13 13M37 13l13 13-13 13M30 7l-8 39"/>'}
];
function overview(mobile){const w=mobile?780:1200,cols=mobile?2:3,cw=mobile?366:376,ch=mobile?258:244,gap=18,pad=15,head=110,rows=6/cols,h=head+rows*(ch+gap)+8;let out=`<rect x="1" y="1" width="${w-2}" height="${h-2}" rx="24" fill="${C.bg}" stroke="${C.line}"/>`;
 out+=text(30,41,'OUR RESEARCH',13,C.mint,700,'letter-spacing="2.3"')+text(30,81,'Five directions. One connected ocean.',mobile?27:32,C.white,650,'letter-spacing="-.7"');
 cards.forEach((c,i)=>{let x=pad+(i%cols)*(cw+gap),y=head+Math.floor(i/cols)*(ch+gap);out+=`<g transform="translate(${x} ${y})"><rect width="${cw}" height="${ch}" rx="16" fill="${C.panel}" stroke="${C.line}"/><path d="M23 0h68" stroke="${i%2?C.mint:C.blue}" stroke-width="2"/>${text(23,35,c.k,12,C.muted,600,'letter-spacing="1.5"')}${text(cw-23,35,c.n,13,C.mint,600,'text-anchor="end"')}<g transform="translate(23 56) scale(.63)" fill="none" stroke="${i%2?C.mint:C.blue}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${c.icon}</g>${text(23,124,c.a,24,C.white,650,'letter-spacing="-.5"')}${text(23,153,c.b,24,C.white,650,'letter-spacing="-.5"')}${text(23,193,c.d[0],mobile?20:16,C.muted)}${text(23,222,c.d[1],mobile?20:16,C.muted)}</g>`});save('research'+(mobile?'-mobile':''),w,h,'Five research directions — populations and assessment; AI and vessel behaviour; biology and DNA; ocean change; adaptive fisheries management. ALSCL puts these quantitative methods into practice.',out)}
overview(false);overview(true);
let strip=`<rect x="1" y="1" width="1198" height="140" rx="20" fill="${C.bg}" stroke="${C.line}"/>`+text(31,44,'METHODS & DATA',13,C.mint,700,'letter-spacing="2"')+text(31,82,'Tools we work with',25,C.white,650);
const tools=[['R','R LANGUAGE','#79b9ff'],['TMB','AUTO DIFF','#79dfd0'],['C++','COMPUTATION','#91a9ff'],['ggplot2','VISUALISATION','#f0c58b']];
tools.forEach(([a,b,color],i)=>{let x=385+i*199;strip+=`<rect x="${x}" y="26" width="49" height="49" rx="13" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-opacity=".4"/>${text(x+24.5,57,a,a==='ggplot2'?10:a==='TMB'?15:21,color,700,'text-anchor="middle"')}${text(x,106,b,10,C.muted,600,'letter-spacing="1"')}`});
save('methods',1200,142,'Methods and data — R, TMB automatic differentiation, C++ computation and ggplot2 visualisation.',strip);
function project(kind){const software=kind==='alscl';let out=`<rect x="1" y="1" width="589" height="238" rx="20" fill="url(#bg)" stroke="${C.line}"/>`;
 out+=text(27,36,software?'01 / SCIENTIFIC SOFTWARE':'02 / THE LABORATORY',12,C.mint,700,'letter-spacing="1.5"')+text(27,90,software?'ALSCL':'Explore OFEL',40,C.white,700,'letter-spacing="-1"')+text(27,128,software?'Fisheries stock assessment in R':'Research, people and publications',20,C.muted)+text(27,162,software?'Age- and length-structured catch-at-length models.':'A closer look at our work and the people behind it.',16,C.muted)+text(27,210,software?'CODE + DOCUMENTATION':'VISIT THE LAB WEBSITE',12,C.blue,700,'letter-spacing="1.4"');
 out+=`<path d="M 534 202h20m-7-7 7 7-7 7" fill="none" stroke="${C.mint}" stroke-width="2" stroke-linecap="round"/>`;save('project-'+kind,591,240,software?'ALSCL — R software for age- and length-structured catch-at-length stock assessment. Open the repository.':'Explore OFEL — research, people, publications and news. Open the laboratory website.',out)}
project('alscl');project('ofel');
for(const [name,label,w] of [['website','LAB WEBSITE',186],['ofel','GITHUB / OFEL',193],['alscl','ALSCL / SOFTWARE',225]]){save('nav-'+name,w,44,label,`<rect x=".5" y=".5" width="${w-1}" height="43" rx="22" fill="${C.panel}" stroke="${C.line}"/>${text(19,27,label,12,C.white,600,'letter-spacing="1"')}<path d="M ${w-37} 22h15m-5-5 5 5-5 5" fill="none" stroke="${C.mint}" stroke-width="1.5"/>`)}

let methodsMobile=`<rect x="1" y="1" width="778" height="348" rx="22" fill="${C.bg}" stroke="${C.line}"/>${text(30,42,'METHODS & DATA',18,C.mint,700,'letter-spacing="2"')}${text(30,82,'Tools we work with',30,C.white,650)}`;
tools.forEach(([a,b,color],i)=>{let x=30+(i%2)*380,y=110+Math.floor(i/2)*114;methodsMobile+=`<rect x="${x}" y="${y}" width="76" height="76" rx="18" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-opacity=".4"/>${text(x+38,y+48,a,a==='ggplot2'?16:a==='TMB'?23:32,color,700,'text-anchor="middle"')}${text(x+94,y+44,b,18,C.muted,600)}`});
save('methods-mobile',780,350,'Tools we work with: R, TMB, C++ and ggplot2.',methodsMobile);
