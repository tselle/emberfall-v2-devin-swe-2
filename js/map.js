/* Emberfall — map.js : overworld + local map rendering */
'use strict';
const MapUI = (()=>{
  function openFull(){
    const g=Game.G;
    const cv=UI.el('canvas');cv.width=640;cv.height=480;
    const body=UI.el('div');body.appendChild(cv);
    if(g.screen==='wilds'){
      const r=Overland.map()||{grid:[],w:0,h:0};const w=r.grid[0].length,h=r.grid.length;
      const c=cv.getContext('2d');const s=Math.min(640/w,480/h);
      c.fillStyle='#0d0e13';c.fillRect(0,0,640,480);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const ch=r.grid[y][x];let col='#1c2416';
        if(ch==='#')col='#2a2f24';else if(ch==='.')col='#3a3428';else if(ch==='R')col='#4a3f2c';
        else if(ch==='T')col='#243d1e';else if(ch==='F'||ch==='f')col='#1e3a18';
        else if(ch==='M'||ch==='H'||ch==='E'||ch==='P')col='#4a4a52';else if(ch==='~'||ch==='w'||ch==='I')col='#1a3a5a';
        else if(ch==='S')col='#2a3a5a';else if(ch==='V'||ch==='N')col='#3a2a1a';
        else if('HVWSENB'.includes(ch))col='#5a4a8a';
        c.fillStyle=col;c.fillRect(x*s,y*s,s,s);
      }
      c.fillStyle='#fff';c.beginPath();c.arc((g.x+0.5)*s,(g.y+0.5)*s,s*0.4,0,7);c.fill();
      cv.onclick=e=>{const r=cv.getBoundingClientRect();const mx=Math.floor((e.clientX-r.left)/s),my=Math.floor((e.clientY-r.top)/s);
        if(mx>=0&&my>=0&&mx<w&&my<h){const dx=mx-g.x,dy=my-g.y;
          const dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'e':'w'):(dy>0?'s':'n');
          Overland.move(dir);UI.closeTop();}};
    } else {
      const map=MAPS[g.map];if(!map)return;
      View3D.fullMap(cv,map,g.x,g.y,g.dir,g.seen[g.map],g.mods[g.map],collectMarks());
      cv.onclick=e=>{ /* could pathfind; keep simple */ };
    }
    UI.modal({title:'Map',body,wide:true,actions:[{label:'Close',primary:true}]});
  }
  function collectMarks(){
    const g=Game.G;const marks=[];
    const ground=g.ground[g.map]||{};
    for(const k in ground){const [x,y]=k.split(',').map(Number);marks.push({x,y,col:'#e3b54a'});}
    // monsters on map
    const map=MAPS[g.map];if(!map)return marks;
    for(let y=0;y<map.grid.length;y++)for(let x=0;x<map.grid[0].length;x++){
      const ch=map.grid[y][x];if('abcdefghijklmnopqrstuvwxyz'.includes(ch)){const m=MONSTERS[ch];if(m)marks.push({x,y,col:'#c8502c'});}
    }
    return marks;
  }
  return {openFull,collectMarks};
})();
