// App icons for the installable (PWA / Android) version, drawn from the logo mark: a 3×3 grid of squares on graphite.
//   node tools/build-icons.js   →   icons/icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png
const fs=require('fs'),zlib=require('zlib'),path=require('path');
const OUT=path.join(__dirname,'..','icons');fs.mkdirSync(OUT,{recursive:true});
const CRC=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const crc=b=>{let c=0xffffffff;for(const v of b)c=CRC[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
function png(file,S,draw){const px=Buffer.alloc(S*S*4);draw((x,y,w,h,[r,g,b])=>{for(let j=Math.max(0,y);j<Math.min(S,y+h);j++)for(let i=Math.max(0,x);i<Math.min(S,x+w);i++)px.set([r,g,b,255],(j*S+i)*4);});
  const raw=Buffer.alloc((S*4+1)*S);for(let y=0;y<S;y++)px.copy(raw,y*(S*4+1)+1,y*S*4,(y+1)*S*4);
  const ih=Buffer.alloc(13);ih.writeUInt32BE(S,0);ih.writeUInt32BE(S,4);ih[8]=8;ih[9]=6;
  fs.writeFileSync(path.join(OUT,file),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]));}
const BG=[13,14,16],GREY=[138,143,152],ORANGE=[255,92,26],DIM=[27,29,34];
// The mark on a 64-unit grid: grey corners, orange centre and bottom-right, dim cells between (as in the brand lockup).
const CELLS=[[12,12,GREY],[26,12,DIM],[40,12,GREY],[12,26,DIM],[26,26,ORANGE],[40,26,DIM],[12,40,GREY],[26,40,DIM],[40,40,ORANGE]];
function icon(file,S,scale){png(file,S,rect=>{rect(0,0,S,S,BG);const u=S/64*scale,off=(S-64*u)/2;
  CELLS.forEach(([x,y,c])=>rect(Math.round(off+x*u),Math.round(off+y*u),Math.round(12*u),Math.round(12*u),c));});}
icon('icon-192.png',192,1);icon('icon-512.png',512,1);icon('apple-touch-icon.png',180,1);
icon('icon-maskable-512.png',512,0.72);   // inside the 80% safe zone Android masks to a circle or squircle
console.log('icons written to',OUT);
