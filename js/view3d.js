/* Emberfall — view3d.js : software raycaster, billboards, minimap. No rule side-effects. */
'use strict';
const View3D = (()=>{
  let cv,ctx,W,H,buf;
  const TEX={}; // name->canvas
  let prepared=null; // {w,h,cells,walls,ceil,floorTex,...}
  let texCache={};
  const FOG='#0d0e13';

  function init(canvas){ cv=canvas; ctx=cv.getContext('2d'); resize(); }
  function resize(){
    const r=cv.getBoundingClientRect();
    const dpr=Math.min(2,window.devicePixelRatio||1);
    W=Math.max(320,Math.round(r.width*dpr)); H=Math.max(240,Math.round(r.height*dpr));
    cv.width=W; cv.height=H;
  }
  /* ---- procedural textures (64 design px, painted 256) ---- */
  function tex(name,fn){
    if(TEX[name])return TEX[name];
    const c=document.createElement('canvas');c.width=256;c.height=256;
    const x=c.getContext('2d'); fn(x,256);
    TEX[name]=c; return c;
  }
  function grain(x,s,base,grain){
    x.fillStyle=base;x.fillRect(0,0,s,s);
    for(let i=0;i<s*3;i++){x.fillStyle=`rgba(${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()<.5?0:255},${grain})`;x.fillRect(Math.random()*s,Math.random()*s,1+Math.random()*2,1+Math.random()*2);}
  }
  function bricks(x,s,base,mortar){
    grain(x,s,base,0.05); x.strokeStyle=mortar;x.lineWidth=2;
    const bh=s/8;
    for(let y=0;y<8;y++){x.beginPath();x.moveTo(0,y*bh);x.lineTo(s,y*bh);x.stroke();
      const off=(y%2)?s/8:0; for(let bx=off;bx<s;bx+=s/4){x.beginPath();x.moveTo(bx,y*bh);x.lineTo(bx,(y+1)*bh);x.stroke();}}
  }
  function stoneTex(x,s){ grain(x,s,'#3a3f4a',0.06);x.strokeStyle='#22262e';x.lineWidth=2;
    for(let i=0;i<6;i++){const px=Math.random()*s,py=Math.random()*s;x.strokeRect(px,py,s/4,s/4);} }
  function woodTex(x,s){ grain(x,s,'#4a3a28',0.07);x.strokeStyle='#2a2018';x.lineWidth=3;
    for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,i*s/6);x.lineTo(s,i*s/6);x.stroke();} }
  function cryptTex(x,s){ grain(x,s,'#2a2d38',0.08);x.strokeStyle='#1a1d26';
    for(let i=0;i<8;i++){x.beginPath();x.arc(Math.random()*s,Math.random()*s,8+Math.random()*14,0,7);x.stroke();} }
  function wallFor(cell){
    switch(cell){
      case '#': return 'stone';
      case 'H': return 'wood';
      case 'B': return 'brick';
      case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': return 'door';
      case 'D': return 'door';
      case 'L': return 'lock';
      case 'S': return 'stone'; // secret looks like wall
      default: return 'stone';
    }
  }
  const TEXFN={
    stone:(x,s)=>{stoneTex(x,s);},
    wood:(x,s)=>{woodTex(x,s);},
    brick:(x,s)=>{bricks(x,s,'#5a4a42','#3a2f2a');},
    door:(x,s)=>{woodTex(x,s);x.fillStyle='#2a2018';x.fillRect(s*0.42,s*0.1,s*0.16,s*0.8);x.fillStyle='#e3b54a';x.beginPath();x.arc(s*0.52,s*0.5,3,0,7);x.fill();},
    lock:(x,s)=>{woodTex(x,s);x.fillStyle='#8a8f9e';x.fillRect(s*0.42,s*0.3,s*0.16,s*0.4);x.beginPath();x.arc(s*0.5,s*0.3,5,0,7);x.stroke();},
  };
  /* ---- prepare map into render buffers ---- */
  function prepare(map,mods,seen){
    // mods: G.mods[mapId] {'x,y':char}; seen: G.seen[mapId] mask
    const w=map.grid[0].length,h=map.grid.length;
    const cells=new Array(w*h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      let c=map.grid[y][x];
      const m=mods&&mods[x+','+y]; if(m)c=m;
      cells[y*w+x]=c;
    }
    prepared={map,w,h,cells,px:0,py:0,dir:0};
    return prepared;
  }
  function cellAt(x,y){
    if(!prepared)return'#';
    const {w,h,cells}=prepared;
    if(x<0||y<0||x>=w||y>=h)return'#';
    return cells[y*w+x];
  }
  const solid=c=>{return c==='#'||c==='H'||c==='B'||c==='T'||c==='F'||c==='^'||c==='~'||c==='1'||c==='2'||c==='3'||c==='4'||c==='5'||c==='6'||c==='7'||c==='8'||c==='9'||c==='D'||c==='L'||c==='S';};
  const doorish=c=>c==='D'||c==='L';
  /* ---- render ---- */
  let lastDraw=0;
  function render(px,py,dir,opts){
    opts=opts||{};
    if(!prepared){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);return;}
    const {w,h}=prepared;
    const posX=px+0.5,posY=py+0.5;
    const ang=(dir-1)*Math.PI/2; // dir0=N(-y? we'll define)
    // Actually dir:0=N,1=E,2=S,3=W ; angle for ray dir
    const baseA=[-Math.PI/2,0,Math.PI/2,Math.PI][dir]||0;
    const plane=0.66;
    const horizon=H/2;
    // ceiling & floor gradient
    let g=ctx.createLinearGradient(0,0,0,horizon);
    g.addColorStop(0,'#0a0b12');g.addColorStop(1,'#1a1420');ctx.fillStyle=g;ctx.fillRect(0,0,W,horizon);
    g=ctx.createLinearGradient(0,horizon,0,H);
    g.addColorStop(0,'#241a12');g.addColorStop(1,'#120e0a');ctx.fillStyle=g;ctx.fillRect(0,horizon,W,H-horizon);
    // sky for outdoor
    if(prepared.map.outdoor){ drawSky(W,H,horizon); }
    // walls via DDA
    const colW=W/320; // column width for perf (subsample)
    for(let x=0;x<W;x+=colW){
      const camX=2*x/W-1;
      const rdx=Math.cos(baseA)-Math.sin(baseA)*camX*plane*0+Math.cos(baseA+Math.PI/2)*camX*0; // compute properly below
    }
    // proper loop
    for(let x=0;x<W;x+=colW){
      const camX=2*x/W-1;
      const dirX=Math.cos(baseA+Math.atan(camX*plane)); // approximate fisheye-free
      // Use standard: rayDir = dir + plane*camX rotated
      const ca=Math.cos(baseA),sa=Math.sin(baseA);
      // plane perpendicular
      const px_= -sa*plane, py_= ca*plane;
      let rdx=ca+px_*camX, rdy=sa+py_*camX;
      const len=Math.hypot(rdx,rdy); rdx/=len;rdy/=len;
      let mapX=Math.floor(posX),mapY=Math.floor(posY);
      const ddx=Math.abs(1/(rdx||1e-9)),ddy=Math.abs(1/(rdy||1e-9));
      let stepX,stepY,sx,sy;
      if(rdx<0){stepX=-1;sx=(posX-mapX)*ddx;}else{stepX=1;sx=(mapX+1-posX)*ddx;}
      if(rdy<0){stepY=-1;sy=(posY-mapY)*ddy;}else{stepY=1;sy=(mapY+1-posY)*ddy;}
      let side=0,cell='#',guard=0;
      while(guard++<64){
        if(sx<sy){sx+=ddx;mapX+=stepX;side=0;}else{sy+=ddy;mapY+=stepY;side=1;}
        cell=cellAt(mapX,mapY);
        if(solid(cell)||(doorish(cell)&&cell!=='D'))break;
        if(cell==='D')break; // doors opaque
      }
      let dist=(side===0?sx-ddx:sy-ddy);
      if(dist<0.05)dist=0.05;
      const lineH=H/dist;
      const y0=horizon-lineH/2;
      // texture
      const tname=wallFor(cell);
      const tx=Math.floor(((side===0?posY+dist*rdy:posX+dist*rdx)%1)*256);
      const img=TEX[tname]||(TEX[tname]=tex(tname,TEXFN[tname]||TEXFN.stone));
      // shading: side + distance fog
      const fogF=Math.min(1,dist/14);
      ctx.globalAlpha=1-fogF*0.85;
      ctx.drawImage(img,tx,0,1,256,x,y0,colW,lineH);
      if(side===1)ctx.fillStyle='rgba(0,0,0,0.25)',ctx.fillRect(x,y0,colW,lineH);
      ctx.globalAlpha=1;
    }
    // billboards: monsters, chests, stairs, loot
    drawBillboards(px,py,dir);
  }
  function drawSky(W,H,horizon){
    const g=ctx.createLinearGradient(0,0,0,horizon);
    const night=prepared&&prepared.night;
    g.addColorStop(0,night?'#05060e':'#1a2340');g.addColorStop(0.7,night?'#0d1024':'#3a4a6a');g.addColorStop(1,night?'#1a1430':'#c88a5a');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,horizon);
    // stars
    if(night){ctx.fillStyle='#fff';for(let i=0;i<40;i++){const sx=(i*137)%W,sy=(i*89)%(horizon*0.7);ctx.fillRect(sx,sy,1.5,1.5);}}
    // hills
    ctx.fillStyle=night?'#0a0c18':'#2a3a2a';
    ctx.beginPath();ctx.moveTo(0,horizon);
    for(let x=0;x<=W;x+=8){ctx.lineTo(x,horizon-20-Math.sin(x*0.02)*15-Math.sin(x*0.005)*20);}
    ctx.lineTo(W,horizon);ctx.fill();
  }
  /* billboards: sprites sorted by depth */
  let sprites=[]; // {x,y,canvas|draw,h}
  function setSprites(list){ sprites=list||[]; }
  function drawBillboards(px,py,dir){
    const {w,h}=prepared; const posX=px+0.5,posY=py+0.5;
    const baseA=[-Math.PI/2,0,Math.PI/2,Math.PI][dir]||0;
    const items=[];
    for(const s of sprites){
      const dx=s.x-posX,dy=s.y-posY;
      const dist=Math.hypot(dx,dy); if(dist<0.3||dist>14)continue;
      // transform to camera space
      const ca=Math.cos(-baseA),sa=Math.sin(-baseA);
      const rx=dx*ca-dy*sa, ry=dx*sa+dy*ca;
      if(ry<=0.1)continue; // behind
      items.push({s,rx,ry,dist});
    }
    items.sort((a,b)=>b.dist-a.dist);
    const horizon=H/2;
    for(const it of items){
      const {s,rx,ry}=it;
      const sx=(rx/(ry*0.66)+1)/2*W;
      const size=(0.9/ry)*H;
      const y=horizon+size/2;
      ctx.save();
      // billboard: draw texture centered
      const img=s.img||(s.draw?null:null);
      if(img){
        const asp=img.width/img.height;
        const dw=size*asp,dh=size;
        ctx.drawImage(img,sx-dw/2,y-dh,sx?dw:dw,dh);
      } else if(s.draw){
        ctx.translate(sx,y);ctx.scale(size/32,size/32);s.draw(ctx);
      }
      ctx.restore();
      if(s.hp!==undefined){ // hp bar
        const bw=size*0.6;
        ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(sx-bw/2,y-size-4,bw,3);
        ctx.fillStyle='#6fae5c';ctx.fillRect(sx-bw/2,y-size-4,bw*Math.max(0,s.hp/s.maxhp),3);
      }
    }
  }
  /* minimap */
  function minimap(cv2,map,px,py,dir,seen,mods){
    const c=cv2.getContext('2d'); const w=map.grid[0].length,h=map.grid.length;
    const cs=Math.min(cv2.width/w,cv2.height/h);
    c.fillStyle='#0a0b10';c.fillRect(0,0,cv2.width,cv2.height);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const idx=y*w+x;
      if(seen&&!seen[idx])continue;
      let ch=map.grid[y][x];const m=mods&&mods[x+','+y];if(m)ch=m;
      let col='#3a3f4a';
      if(ch==='#')col='#5a5f6a';else if(ch==='.'||ch===',')col='#2a2d38';
      else if('DGL'.includes(ch))col='#e3b54a';else if('<>'.includes(ch))col='#9a7fd4';
      else if('123456789'.includes(ch))col='#6fae5c';
      else if('abcxyz'.includes(ch))col='#c8502c';
      c.fillStyle=col;c.fillRect(x*cs,y*cs,cs,cs);
    }
    // party arrow
    c.save();c.translate(px*cs+cs/2,py*cs+cs/2);c.rotate((dir)*Math.PI/2);
    c.fillStyle='#e3b54a';c.beginPath();c.moveTo(0,-cs*1.2);c.lineTo(cs,c*0+cs);c.lineTo(0,cs*0.4);c.lineTo(-cs,cs);c.closePath();c.fill();c.restore();
  }
  /* full map painter */
  function fullMap(cv2,map,px,py,dir,seen,mods,marks){
    const c=cv2.getContext('2d');
    const scale=Math.min(cv2.width/map.grid[0].length,cv2.height/map.grid.length);
    const ox=(cv2.width-map.grid[0].length*scale)/2,oy=(cv2.height-map.grid.length*scale)/2;
    c.fillStyle='#0d0e13';c.fillRect(0,0,cv2.width,cv2.height);
    for(let y=0;y<map.grid.length;y++)for(let x=0;x<map.grid[0].length;x++){
      const idx=y*map.grid[0].length+x;
      if(seen&&!seen[idx])continue;
      let ch=map.grid[y][x];const m=mods&&mods[x+','+y];if(m)ch=m;
      let col='#2a2d38';
      if(ch==='#'||ch==='H'||ch==='B')col='#4a4f5e';else if(ch==='.')col='#33363f';
      else if(ch===',')col='#2f3a2a';else if(ch==='T')col='#1f3a1f';else if(ch==='F')col='#2a4a6a';
      else if('DGL'.includes(ch))col='#c8a860';else if('<>'.includes(ch))col='#9a7fd4';
      else if('123456789'.includes(ch))col='#6fae5c';else if('abcdefghijklmnopqrstuvwxyz'.includes(ch))col='#c8502c';
      else if(ch==='S')col='#4a4f5e'; // secret stays wall-colored
      c.fillStyle=col;c.fillRect(ox+x*scale,oy+y*scale,scale,scale);
    }
    // marks (chests, loot, foes)
    if(marks)for(const mk of marks){
      c.fillStyle=mk.col||'#e3b54a';
      c.fillRect(ox+mk.x*scale-2,oy+mk.y*scale-2,scale+4,scale+4);
    }
    // party
    c.save();c.translate(ox+(px+0.5)*scale,oy+(py+0.5)*scale);c.rotate(dir*Math.PI/2);
    c.fillStyle='#e3b54a';c.beginPath();c.moveTo(0,-scale*1.4);c.lineTo(scale*1.4,scale*1.4);c.lineTo(0,scale*0.5);c.lineTo(-scale*1.4,scale*1.4);c.closePath();c.fill();c.restore();
    return {ox,oy,scale};
  }
  return {init,resize,prepare,render,setSprites,minimap,fullMap,cellAt,tex,wallFor,TEX};
})();
