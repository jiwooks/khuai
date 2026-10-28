export const SPRITE=(()=>{
 const rnd=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return((h>>>0)%100000)/100000}};
 const rg=(id,st,cx=.36,cy=.3,r=.78)=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${st.map(([o,c,a=1])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
 const lg=(id,st,x1=0,y1=0,x2=1,y2=1)=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st.map(([o,c,a=1])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
 const sh=(cx=50,cy=91,rx=30,ry=4.5,o=.3)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#4A3020" opacity="${o}" filter="url(#b3)"/>`;
 const spec=(x,y,rx,ry,rot=20,o=.8)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${x} ${y})" filter="url(#b1)"/>`;
 const blob=(x,y,rx,ry,c,o,f='b6',rot=0)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${o}" filter="url(#${f})" transform="rotate(${rot} ${x} ${y})"/>`;
 const dots=(seed,n,cx,cy,R,fill,op,r0,r1)=>{const r=rnd(seed);let s='';for(let i=0;i<n;i++){const a=r()*6.283,d=Math.sqrt(r())*R;s+=`<circle cx="${(cx+Math.cos(a)*d).toFixed(1)}" cy="${(cy+Math.sin(a)*d).toFixed(1)}" r="${(r0+r()*(r1-r0)).toFixed(2)}" fill="${fill}" opacity="${op}"/>`}return s};
 const leaf=(x,y,rot,s=1)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
   <path d="M0 0C7-13 24-19 40-13C31 3 14 9 0 0Z" fill="url(#gLeaf)"/>
   <path d="M0 0C7-13 24-19 40-13C30-11 14-8 0 0Z" fill="#B8E880" opacity=".35"/>
   <path d="M0 0C12-5 26-10 40-13" stroke="#DDF7B0" stroke-width="1.1" fill="none" opacity=".8"/>
   <path d="M11-4.5L15-11M19-7.5L24-14M27-10L31-14M12-4.6L17 1M20-7.6L25-2M28-10L32-6" stroke="#2C6A1E" stroke-width=".7" opacity=".45" fill="none"/>
   <path d="M5-5C12-12 24-16 34-14" stroke="#fff" stroke-width="2.4" fill="none" opacity=".28" filter="url(#b1)"/></g>`;
 const stem=(d,w=3.4)=>`<path d="${d}" stroke="url(#gStem)" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#E2C090" stroke-width="${w/3}" fill="none" stroke-linecap="round" opacity=".5" transform="translate(-.6 0)"/>`;

 const PA='M50 30c-8-6-27-8-34 7-8 17 1 40 13 49 7 6 14 6 21 2 7 4 14 4 21-2 12-9 21-32 13-49-7-15-26-13-34-7z';
 const PP='M50 20c-8 0-11 9-11 17 0 8-4 12-10 20-9 12-6 27 7 33 8 4 20 4 28 0 13-6 16-21 7-33-6-8-10-12-10-20 0-8-3-17-11-17z';
 const PF='M64 14c3 0 5 5 6 9 12 6 21 18 19 32-2 14-13 21-25 21s-23-7-25-21c-2-14 7-26 19-32 1-4 3-9 6-9z';
 const PFh='M33 40c2.4 0 4 4 5 7 10 5 17 15 15.5 26.5C52 85 43 91 33 91s-19-6-20.5-17.5C11 62 18 52 28 47c1-3 2.6-7 5-7z';
 const yuzuPath=(()=>{let d='';for(let i=0;i<=120;i++){const t=i/120*6.2832,r=31+.55*Math.sin(t*14)+.7*Math.sin(t*5+1.3)+.3*Math.sin(t*23);d+=(i?'L':'M')+(50+Math.cos(t)*r).toFixed(2)+' '+(56+Math.sin(t)*r*.97).toFixed(2)}return d+'Z'})();

 const apple=(ugly)=>`${sh(50,90,29,4.5)}<path d="${PA}" fill="url(#aBase)"/>
  <g clip-path="url(#cA)">
   ${[24,33,42,58,67,76].map((x,i)=>`<path d="M${x} 30C${x+(i<3?-6:6)} 50 ${x+(i<3?-4:4)} 70 ${x} 92" stroke="#FFD27A" stroke-width="${2+i%3}" opacity=".2" fill="none" filter="url(#b1)"/>`).join('')}
   ${blob(72,76,28,22,'#4A0612',.5)}${blob(20,60,5,24,'#FFC0A8',.4,'b3')}${blob(82,58,4,18,'#FF9A80',.35,'b3')}
   ${ugly?blob(64,62,7,5,'#8A5A20',.6,'b1')+blob(56,73,4,3,'#7A4A18',.55,'b1')+blob(36,70,6,4,'#C8A040',.45,'b3'):''}
   ${dots('ap'+ugly,36,50,58,30,'#FFE3B8',.3,.25,.55)}
   ${blob(50,32,13,5,'#5A0812',.6,'b3')}</g>
  ${spec(33,47,5,10.5,22,.7)}<circle cx="37.5" cy="39.5" r="1.7" fill="#fff" opacity=".95"/>
  ${stem('M50 34C50 26 52 19 57 12')}${leaf(55,21,-18,.72)}`;
 const tangWhole=(cx,cy,r,ugly,id)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#tBase)"/>
  <g clip-path="url(#${id})">${dots(id+'d',90,cx,cy,r,'#C25A06',.28,.3,.75)}${dots(id+'l',60,cx-6,cy-6,r*.8,'#FFE6A8',.35,.3,.7)}
   ${blob(cx+r*.45,cy+r*.5,r*.9,r*.7,'#7A3000',.45)}${blob(cx-r*.85,cy,r*.18,r*.7,'#FFD8A0',.45,'b3')}
   ${ugly?blob(cx+8,cy+6,7,5,'#8A6020',.55,'b1')+blob(cx-6,cy+12,5,3.5,'#7A5A20',.5,'b1')+blob(cx+10,cy-10,9,7,'#B8B040',.35,'b3'):''}</g>
  ${spec(cx-r*.38,cy-r*.38,r*.17,r*.3,35,.7)}<circle cx="${cx-r*.25}" cy="${cy-r*.5}" r="1.4" fill="#fff" opacity=".9"/>
  <circle cx="${cx}" cy="${cy-r+2.5}" r="2.6" fill="#6E8A2A"/><path d="M${cx-2} ${cy-r+2.5}h4M${cx} ${cy-r+.5}v4" stroke="#4A6418" stroke-width=".7"/>`;
 const tangSlice=(cx,cy,r)=>{let seg='';const n=10;for(let i=0;i<n;i++){const a0=i/n*6.2832+.06,a1=(i+1)/n*6.2832-.06,rr=r*.82,ri=r*.12;
   const p=(a,R)=>`${(cx+Math.cos(a)*R).toFixed(2)} ${(cy+Math.sin(a)*R).toFixed(2)}`;
   seg+=`<path d="M${p(a0,ri)}L${p(a0,rr)}A${rr} ${rr} 0 0 1 ${p(a1,rr)}L${p(a1,ri)}Z" fill="url(#segG)"/>`;
   const am=(a0+a1)/2;for(let k=0;k<3;k++){const R=r*(.35+k*.17);seg+=`<ellipse cx="${(cx+Math.cos(am)*R).toFixed(2)}" cy="${(cy+Math.sin(am)*R).toFixed(2)}" rx="${(1.6-k*.2).toFixed(2)}" ry=".7" fill="#fff" opacity=".45" transform="rotate(${(am*57.3).toFixed(1)} ${(cx+Math.cos(am)*R).toFixed(2)} ${(cy+Math.sin(am)*R).toFixed(2)})"/>`}}
   return `${sh(cx,cy+r+2,r*.95,3.5,.3)}<circle cx="${cx}" cy="${cy+2.2}" r="${r}" fill="#C8600C"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#rindG)"/>
   <circle cx="${cx}" cy="${cy}" r="${r*.9}" fill="#FFF3DC"/>${seg}<circle cx="${cx}" cy="${cy}" r="${r*.13}" fill="#FFF6E6"/>
   ${blob(cx-r*.3,cy-r*.35,r*.35,r*.2,'#fff',.35,'b3',-30)}`};
 const kiwiSlice=(cx,cy,r)=>{let rays='',seeds='';const R=rnd('kw');for(let i=0;i<36;i++){const a=i/36*6.2832;rays+=`<line x1="${(cx+Math.cos(a)*r*.3).toFixed(2)}" y1="${(cy+Math.sin(a)*r*.3).toFixed(2)}" x2="${(cx+Math.cos(a)*r*.85).toFixed(2)}" y2="${(cy+Math.sin(a)*r*.85).toFixed(2)}" stroke="#FFF8C8" stroke-width=".7" opacity=".45"/>`}
   for(let i=0;i<26;i++){const a=i/26*6.2832+R()*.1,d=r*(.38+R()*.12),x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;seeds+=`<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx=".85" ry="2.1" fill="#2A1A06" transform="rotate(${(a*57.3+90).toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`}
   return `${sh(cx,cy+r+2,r,3.5,.32)}<circle cx="${cx}" cy="${cy+2.4}" r="${r}" fill="#6A4A20"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#8E6A36"/>
   <circle cx="${cx}" cy="${cy}" r="${r*.9}" fill="url(#kFlesh)"/>${rays}${seeds}<ellipse cx="${cx}" cy="${cy}" rx="${r*.24}" ry="${r*.19}" fill="#FFF7D6" filter="url(#b1)"/>
   ${blob(cx-r*.35,cy-r*.4,r*.3,r*.15,'#fff',.4,'b3',-30)}`};
 const berry=(x,y,r,d)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gBerry)"/>${d?`<circle cx="${x}" cy="${y}" r="${r}" fill="#3E5A10" opacity="${d}"/>`:''}
   <ellipse cx="${x-r*.35}" cy="${y-r*.4}" rx="${r*.28}" ry="${r*.17}" fill="#fff" opacity=".85" transform="rotate(-35 ${x-r*.35} ${y-r*.4})" filter="url(#b05)"/>
   <path d="M${x+r*.2} ${y+r*.75}A${r*.8} ${r*.8} 0 0 0 ${x+r*.75} ${y+r*.15}" stroke="#F2FFB8" stroke-width="1" fill="none" opacity=".55"/>`;
 const grapes=()=>{const B=[[36,32,0.25],[50,30,.25],[64,33,.25],[28,44,.15],[43,43,.12],[57,43,.12],[71,45,.15],[35,56,.06],[50,55,.04],[64,56,.06],[42,67,0],[57,67,0],[49,78,0]];
   return `${sh(50,94,26,4)}${stem('M50 24C50 17 51 12 54 6',3)}${stem('M50 22C44 19 38 22 34 27',2)}${stem('M51 23C57 21 62 24 66 28',2)}
   ${B.map(([x,y,d])=>berry(50+(x-50)*1.18,30+(y-30)*1.12,10,d)).join('')}${leaf(53,12,-25,.7)}`};
 const S={
  apple:apple(false), uapple:apple(true),
  pear:`${sh(50,91,25,4)}<path d="${PP}" fill="url(#pBase)"/><g clip-path="url(#cP)">${blob(68,62,12,18,'#F09040',.38)}${blob(64,80,22,14,'#5A4A08',.45)}${blob(26,64,5,20,'#FFFBD0',.45,'b3')}
   ${dots('pr',70,50,60,28,'#8A6A20',.35,.3,.7)}${blob(50,22,7,4,'#6A5A10',.5,'b1')}</g>
   ${spec(37,63,5,12,12,.65)}<circle cx="39" cy="55" r="1.5" fill="#fff" opacity=".9"/>${stem('M50 23C50 16 52 11 56 7',3.2)}${leaf(54,14,-12,.68)}`,
  shine:grapes(),
  persim:`${sh(50,90,34,4.5)}<path d="M14 60C14 40 30 33 50 33S86 40 86 60 70 88 50 88 14 80 14 60Z" fill="url(#kBase)"/>
   <g clip-path="url(#cK)">${blob(68,78,30,16,'#7A2E00',.5)}${blob(36,50,4,26,'#FFE0A0',.3,'b3')}${blob(64,50,4,26,'#B04A06',.25,'b3')}${blob(18,62,4,18,'#FFD098',.45,'b3')}${dots('ps',30,50,62,28,'#FFE8C0',.35,.3,.6)}</g>
   ${spec(30,48,5,9,40,.7)}<circle cx="34" cy="43" r="1.5" fill="#fff" opacity=".9"/>
   ${[[-50,1],[50,1],[-135,.75],[135,.75],[0,.6]].map(([r,s])=>`<g transform="translate(50 37) rotate(${r}) scale(${s*1.45} ${s*.8})"><path d="M0 0C-6-5-6-16 0-20 6-16 6-5 0 0Z" fill="url(#calyx)"/><path d="M0-2V-17" stroke="#A8C878" stroke-width="1" opacity=".6"/></g>`).join('')}
   <rect x="47.3" y="27" width="5.4" height="9" rx="2" fill="url(#gStem)"/>`,
  tang:`${tangWhole(58,46,29,false,'cT')}${leaf(58,18,-35,.75)}${tangSlice(31,68,20)}`,
  utang:`${sh(50,90,30,4.5)}${tangWhole(50,56,32,true,'cT2')}${leaf(50,26,-30,.8)}`,
  kiwi:`${sh(64,82,22,4,.25)}<ellipse cx="62" cy="44" rx="25" ry="30" fill="url(#kwSkin)" transform="rotate(30 62 44)"/>
   <g clip-path="url(#cKw)">${dots('kf',160,62,44,30,'#E8CC98',.35,.2,.5)}${blob(74,60,18,16,'#3A2408',.45)}</g>${blob(52,30,6,4,'#fff',.25,'b3',-30)}
   ${kiwiSlice(36,64,23)}`,
  fig:`${sh(62,83,22,4,.25)}<path d="${PF}" fill="url(#fBase)"/><g clip-path="url(#cF)">${[48,56,64,72,80].map((x,i)=>`<path d="M64 20C${x-8} 40 ${x-6} 62 ${x-2} 76" stroke="#D8A0C8" stroke-width="1.3" opacity=".3" fill="none" filter="url(#b1)"/>`).join('')}
   ${blob(64,22,8,9,'#8AA040',.6,'b3')}${blob(76,64,16,12,'#1E0818',.5)}${dots('fg',40,64,50,22,'#E8C0E0',.3,.3,.6)}</g>${spec(52,44,4,8,15,.5)}
   <path d="M64 14V7" stroke="url(#gStem)" stroke-width="3.2" stroke-linecap="round"/>
   ${sh(33,92,18,3.2)}<path d="${PFh}" fill="#5E2450"/><path d="${PFh}" fill="#F7E6D4" transform="translate(33 68) scale(.9) translate(-33 -68)"/>
   <path d="${PFh}" fill="url(#fFlesh)" transform="translate(33 68) scale(.78) translate(-33 -68)"/>
   <g clip-path="url(#cFh)">${(()=>{const R=rnd('fh');let s='';for(let i=0;i<46;i++){const a=R()*6.283,d=4+R()*12;const x=33+Math.cos(a)*d*.8,y=70+Math.sin(a)*d;s+=`<line x1="33" y1="70" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#FFE4E0" stroke-width=".5" opacity=".5"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r=".85" fill="#F8D27A"/>`}return s})()}
   <ellipse cx="33" cy="70" rx="5" ry="8" fill="#8A1830" opacity=".5" filter="url(#b1)"/></g>`,
  yuzu:`${sh(50,90,30,4.5)}<path d="${yuzuPath}" fill="url(#yBase)"/><g clip-path="url(#cY)">${dots('yz',140,50,56,31,'#B88A08',.3,.3,.8)}${dots('yl',70,44,50,24,'#FFF8C8',.45,.3,.7)}
   ${blob(66,74,24,18,'#7A5A00',.4)}${blob(20,58,4,20,'#FFF6C8',.5,'b3')}${blob(66,38,14,9,'#9AB040',.3,'b6')}</g>
   ${spec(36,44,5,9,35,.7)}<circle cx="40" cy="38" r="1.5" fill="#fff" opacity=".9"/><circle cx="50" cy="25.5" r="2.8" fill="#6E8A2A"/>${leaf(51,25,-40,.95)}`,
  leaf:`<g transform="translate(10 88) rotate(-45) scale(2.05)">${leaf(0,0,0,1).replace(/^<g[^>]*>|<\/g>$/g,'')}</g>`,
  basket:`${sh(50,94,40,4)}<path d="M10 45h80l-8 42a6 6 0 0 1-6 5H24a6 6 0 0 1-6-5z" fill="url(#bk)"/><path d="M8 40h84a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8z" fill="#2E8F65"/><path d="M10 41h80" stroke="#7FD6AE" stroke-width="1.2" opacity=".7"/>
   ${[22,34,46,58,70].map(x=>`<rect x="${x}" y="55" width="7" height="28" rx="3.5" fill="#1F6E4C" opacity=".55"/>`).join('')}<path d="M22 42c0-26 56-26 56 0" stroke="#2E8F65" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M24 38c3-20 49-20 52 0" stroke="#8FE0BC" stroke-width="1.2" fill="none" opacity=".6"/>`,
 };
 const defs=`<filter id="b05" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".5"/></filter>
  <filter id="b1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>
  <filter id="b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.6"/></filter>
  <filter id="b6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  ${rg('aBase',[[0,'#FF9A84'],[.3,'#F2483E'],[.7,'#C21E2C'],[1,'#7A0F1C']])}
  ${rg('pBase',[[0,'#FFFBD0'],[.35,'#EDE17A'],[.75,'#CDB540'],[1,'#8A7620']],.38,.55,.7)}
  ${rg('kBase',[[0,'#FFD27E'],[.35,'#FF9C30'],[.75,'#EC7012'],[1,'#A84406']],.35,.35,.75)}
  ${rg('tBase',[[0,'#FFD88A'],[.3,'#FFA834'],[.72,'#F27D10'],[1,'#B05006']])}
  ${rg('rindG',[[0,'#FFB040'],[1,'#EF7A12']],.5,.5,.5)}
  ${rg('segG',[[0,'#FFD27A'],[.6,'#FFAA38'],[1,'#F58A1C']],.5,.5,.55)}
  ${rg('kFlesh',[[0,'#FFF6C0'],[.4,'#F9DE58'],[.8,'#EAC232'],[1,'#C99E1E']],.5,.5,.5)}
  ${rg('kwSkin',[[0,'#CFAA70'],[.45,'#9C7642'],[1,'#5A3E1C']])}
  ${rg('gBerry',[[0,'#F6FFC0'],[.35,'#C8E66A'],[.75,'#8DB238'],[1,'#5E8220']],.38,.32,.7)}
  ${rg('fBase',[[0,'#C48AB6'],[.35,'#8C4478'],[.75,'#56204C'],[1,'#2E0E28']],.35,.4,.75)}
  ${rg('fFlesh',[[0,'#B8183A'],[.45,'#E8486A'],[.8,'#F7A0A0'],[1,'#FFE0D0']],.5,.55,.55)}
  ${rg('yBase',[[0,'#FFFAC8'],[.3,'#FFE65A'],[.72,'#F2C41C'],[1,'#B08206']])}
  ${lg('gLeaf',[[0,'#2F7F2A'],[.55,'#5CB33E'],[1,'#A6DE6A']],0,1,1,0)}
  ${lg('gStem',[[0,'#8A6038'],[1,'#4E3218']],0,0,1,0)}
  ${lg('calyx',[[0,'#94BC5A'],[1,'#3C6420']],0,0,0,1)}
  ${lg('bk',[[0,'#4CBB8A'],[1,'#25845A']],0,0,0,1)}
  <clipPath id="cA"><path d="${PA}"/></clipPath><clipPath id="cP"><path d="${PP}"/></clipPath>
  <clipPath id="cK"><path d="M14 60C14 40 30 33 50 33S86 40 86 60 70 88 50 88 14 80 14 60Z"/></clipPath>
  <clipPath id="cT"><circle cx="58" cy="46" r="29"/></clipPath><clipPath id="cT2"><circle cx="50" cy="56" r="32"/></clipPath>
  <clipPath id="cKw"><ellipse cx="62" cy="44" rx="25" ry="30" transform="rotate(30 62 44)"/></clipPath>
  <clipPath id="cF"><path d="${PF}"/></clipPath><clipPath id="cFh"><path d="${PFh}" transform="translate(33 68) scale(.78) translate(-33 -68)"/></clipPath>
  <clipPath id="cY"><path d="${yuzuPath}"/></clipPath>`;
 return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${defs}${Object.entries(S).map(([k,v])=>`<symbol id="fr-${k}" viewBox="0 0 100 100" overflow="visible">${v}</symbol>`).join('')}</defs></svg>`})();
