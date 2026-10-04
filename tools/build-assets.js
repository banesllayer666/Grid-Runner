// Builds the game-ready art in assets/ from the original packs (cars/, tracks/), which stay local and out of the repo.
//   node tools/build-assets.js
// - assets/cars.png: one sprite sheet with only the race cars the game uses, each rotated to face right and trimmed.
// - The sheet's coordinates are written into index_v5.html between /*ATLAS*/ and /*/ATLAS*/.
// - assets/tracks/: only the track tiles the race scenery uses.
// To add a car: add it to MODELS (and to a pool in index_v5.html). Mark it 'down' if its nose points down in the original
// (headlights at the bottom, small red tail lights at the top).
const fs=require('fs'),zlib=require('zlib'),path=require('path');
const ROOT=path.join(__dirname,'..');
// ── PNG read/write (8-bit, non-interlaced; enough for these packs) ──
function readPng(file){const b=fs.readFileSync(file);let o=8,w,h,bd,ct,il,idat=[],pal=null,trn=null;
  while(o<b.length){const len=b.readUInt32BE(o),t=b.toString('ascii',o+4,o+8),d=b.slice(o+8,o+8+len);
    if(t==='IHDR'){w=d.readUInt32BE(0);h=d.readUInt32BE(4);bd=d[8];ct=d[9];il=d[12];}else if(t==='PLTE')pal=d;else if(t==='tRNS')trn=d;else if(t==='IDAT')idat.push(d);else if(t==='IEND')break;o+=12+len;}
  if(il||bd!==8)throw new Error(file+': unsupported PNG (interlaced or not 8-bit)');
  const bpp={0:1,2:3,3:1,4:2,6:4}[ct],raw=zlib.inflateSync(Buffer.concat(idat)),stride=w*bpp,px=Buffer.alloc(w*h*4);let prev=Buffer.alloc(stride),p=0;
  for(let y=0;y<h;y++){const f=raw[p++],line=Buffer.from(raw.slice(p,p+stride));p+=stride;
    for(let x=0;x<stride;x++){const a=x>=bpp?line[x-bpp]:0,up=prev[x],c=x>=bpp?prev[x-bpp]:0;let v=line[x];
      if(f===1)v+=a;else if(f===2)v+=up;else if(f===3)v+=(a+up)>>1;else if(f===4){const q=a+up-c,pa=Math.abs(q-a),pb=Math.abs(q-up),pc=Math.abs(q-c);v+=pa<=pb&&pa<=pc?a:pb<=pc?up:c;}line[x]=v&255;}
    for(let x=0;x<w;x++){const i=x*bpp;let r,g,bl,al=255;
      if(ct===6){r=line[i];g=line[i+1];bl=line[i+2];al=line[i+3];}else if(ct===2){r=line[i];g=line[i+1];bl=line[i+2];}
      else if(ct===3){const k=line[i];r=pal[k*3];g=pal[k*3+1];bl=pal[k*3+2];al=trn&&k<trn.length?trn[k]:255;}else if(ct===0){r=g=bl=line[i];}else{r=g=bl=line[i];al=line[i+1];}
      px.set([r,g,bl,al],(y*w+x)*4);}prev=line;}
  return{w,h,px};}
const CRC=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc(buf){let c=0xffffffff;for(const v of buf)c=CRC[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(type,data){const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const td=Buffer.concat([Buffer.from(type,'ascii'),data]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([len,td,c]);}
function writePng(file,{w,h,px}){const raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;px.copy(raw,y*(w*4+1)+1,y*w*4,(y+1)*w*4);}
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;
  fs.writeFileSync(file,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]));}
// ── image ops ──
function rotate(img,cw){const{w,h,px}=img,o=Buffer.alloc(w*h*4);// result is h wide, w tall
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const nx=cw?h-1-y:y,ny=cw?x:w-1-x;px.copy(o,(ny*h+nx)*4,(y*w+x)*4,(y*w+x)*4+4);}return{w:h,h:w,px:o};}
function trim(img){const{w,h,px}=img;let x0=w,y0=h,x1=-1,y1=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(px[(y*w+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  const W=x1-x0+1,H=y1-y0+1,o=Buffer.alloc(W*H*4);for(let y=0;y<H;y++)px.copy(o,y*W*4,((y+y0)*w+x0)*4,((y+y0)*w+x1+1)*4);return{w:W,h:H,px:o};}
// ── the cars the game uses: key → [source file, 'up' | 'down'] ──
const O=n=>'cars/Other cars/car_'+String(n).padStart(3,'0')+'.png',S=s=>'cars/rally and drag/sprite/'+s+'.png',F=c=>'cars/Formula/'+c+'_car.png';
const DOWN_O=[8,28,31,37,46,48,49,52,53,80,81,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,100,102,104,105,106,107,108,109,110,111,112,113,114,115,117,118];
const USED_O=[1,2,5,7,8,9,10,12,14,15,16,17,18,28,30,31,36,37,46,48,49,52,53,57,58,75,78,80,81,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,100,102,104,105,106,107,108,109,110,111,112,113,114,115,117,118];
const MODELS={};
['black','blue','gray','green','lime','navyblue','orange','pink','red','white'].forEach(c=>MODELS['f'+c]=[F(c),'down']);
USED_O.forEach(n=>MODELS['o'+n]=[O(n),DOWN_O.includes(n)?'down':'up']);
['370z','500x','A4','Beetle','Corolla','DB9','F1','FType','Giulia','Giulietta','Jimny','Logan','Polo','Sandero','Tipo','Viper'].forEach(s=>MODELS['s'+s]=[S(s),'up']);
// ── build the sheet (simple shelf packing, 1px gap) ──
const sprites=Object.entries(MODELS).map(([k,[f,dir]])=>{const img=trim(rotate(readPng(path.join(ROOT,f)),dir==='up'));return{k,img};})
  .sort((a,b)=>b.img.h-a.img.h);
const SW=512;let x=0,y=0,rowH=0;const atlas={};
for(const s of sprites){if(x+s.img.w>SW){x=0;y+=rowH+1;rowH=0;}atlas[s.k]=[x,y,s.img.w,s.img.h];s.x=x;s.y=y;x+=s.img.w+1;rowH=Math.max(rowH,s.img.h);}
const SH=y+rowH,sheet={w:SW,h:SH,px:Buffer.alloc(SW*SH*4)};
for(const s of sprites)for(let r=0;r<s.img.h;r++)s.img.px.copy(sheet.px,((s.y+r)*SW+s.x)*4,r*s.img.w*4,(r+1)*s.img.w*4);
fs.mkdirSync(path.join(ROOT,'assets/tracks'),{recursive:true});
writePng(path.join(ROOT,'assets/cars.png'),sheet);
// ── track tiles actually used by the scenery ──
const TILES={'asphalt-kerb.png':'tracks/Asphalt road/road_asphalt02.png','asphalt.png':'tracks/Asphalt road/road_asphalt22.png','dirt-kerb.png':'tracks/Dirt road/road_dirt01.png',
  'dirt.png':'tracks/Dirt road/road_dirt21.png','grass.png':'tracks/Grass/land_grass04.png','grass-tufts.png':'tracks/Grass/land_grass11.png','sand.png':'tracks/Sand/land_sand05.png'};
for(const [to,from] of Object.entries(TILES))fs.copyFileSync(path.join(ROOT,from),path.join(ROOT,'assets/tracks',to));
// ── write coordinates into the game ──
const game=path.join(ROOT,'index_v5.html');let html=fs.readFileSync(game,'utf8');
const line='/*ATLAS*/const CAR_SHEET={w:'+SW+',h:'+SH+',a:'+JSON.stringify(atlas)+'};/*/ATLAS*/';
if(!/\/\*ATLAS\*\/[\s\S]*?\/\*\/ATLAS\*\//.test(html))throw new Error('ATLAS markers not found in index_v5.html');
html=html.replace(/\/\*ATLAS\*\/[\s\S]*?\/\*\/ATLAS\*\//,()=>line);fs.writeFileSync(game,html);
console.log('cars.png '+SW+'x'+SH+', '+sprites.length+' cars; '+Object.keys(TILES).length+' track tiles');
