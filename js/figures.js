/* Emberfall — figures.js : procedural figure/portrait drawing on canvas */
'use strict';
const Figures = (()=>{
  const cache={};
  function shade(hex,f){ // f -1..1
    const n=parseInt(hex.slice(1),16); let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    const t=f<0?0:255,p=Math.abs(f);
    r=Math.round(r+(t-r)*p);g=Math.round(g+(t-g)*p);b=Math.round(b+(t-b)*p);
    return `rgb(${r},${g},${b})`;
  }
  /* draw a monster/character figure. ctx,size px, desc:{fig,kind:'monster'|'pc',race,cls,color,gear,size} */
  function drawFig(ctx,s,desc){
    ctx.save(); ctx.translate(s/2,s/2);
    const u=s/64; // unit
    const fig=desc.fig||'humanoid';
    const col=desc.color||'#8a8f9e';
    const dark=shade(col,-0.4), lite=shade(col,0.3);
    ctx.lineWidth=Math.max(1,2*u); ctx.strokeStyle='rgba(0,0,0,.55)';
    const body=(x,y,w,h,c)=>{ctx.fillStyle=c||col;ctx.beginPath();ctx.ellipse(x*u,y*u,w*u,h*u,0,0,7);ctx.fill();ctx.stroke();};
    const poly=(pts,c)=>{ctx.fillStyle=c||col;ctx.beginPath();ctx.moveTo(pts[0][0]*u,pts[0][1]*u);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0]*u,pts[i][1]*u);ctx.closePath();ctx.fill();ctx.stroke();};
    const circ=(x,y,r,c)=>{ctx.fillStyle=c||col;ctx.beginPath();ctx.arc(x*u,y*u,r*u,0,7);ctx.fill();ctx.stroke();};
    const eye=(x,y,r)=>{ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x*u,y*u,r*u,0,7);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc((x+r*0.3)*u,y*u,r*0.4*u,0,7);ctx.fill();};
    switch(fig){
      case 'rat': body(0,-2,14,10,'#6b5a4a');circ(10,-2,5,'#6b5a4a');poly([[-12,-2],[-18,-6],[-18,2]],'#6b5a4a');circ(11,-3,1,'#e00');break;
      case 'spider': body(0,-2,14,10,'#3a3a4a');circ(10,-2,5,'#3a3a4a');for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-4*u,(-4+i*3)*u);ctx.lineTo(-14*u,(-8+i*5)*u);ctx.stroke();ctx.beginPath();ctx.moveTo(4*u,(-4+i*3)*u);ctx.lineTo(14*u,(-8+i*5)*u);ctx.stroke();}eye(-8,-3,1.5);eye(8,-3,1.5);break;
      case 'insect': body(0,-2,10,14,'#4a6a3a');circ(0,-14,6,'#4a6a3a');for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo((-6+i*6)*u,-8*u);ctx.lineTo((-8+i*8)*u,-20*u);ctx.stroke();}break;
      case 'wolf': case 'worg': body(0,-4,18,12,col);circ(14,-8,7,col);poly([[8,-10],[12,-16],[14,-10]],col);poly([[16,-10],[20,-16],[18,-10]],col);for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo((-8+i*6)*u,4*u);ctx.lineTo((-10+i*7)*u,14*u);ctx.stroke();}circ(16,-9,1.2,'#e00');break;
      case 'cat': case 'lion': body(0,-4,16,11,col);circ(12,-8,6,col);poly([[8,-12],[11,-16],[13,-11]],col);circ(16,-9,1.2,'#e00');for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo((-7+i*5)*u,4*u);ctx.lineTo((-9+i*6)*u,13*u);ctx.stroke();}if(fig==='lion'){ctx.beginPath();ctx.arc(0,-6*u? -6:0,0,0,0);}break;
      case 'horse': case 'pegasus': case 'unicorn': body(0,-6,22,13,col);circ(20,-10,7,col);poly([[16,-14],[19,-18],[21,-13]],col);circ(21,-11,1.2,'#e00');for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo((-10+i*7)*u,5*u);ctx.lineTo((-12+i*8)*u,16*u);ctx.stroke();}if(fig==='pegasus'||fig==='unicorn'){poly([[-2,-16],[2,-24],[-4,-18]],'#fff');}if(fig==='unicorn'){ctx.beginPath();ctx.moveTo(26*u,-12*u);ctx.lineTo(30*u,-18*u);ctx.stroke();}break;
      case 'bird': body(0,-6,12,10,col);circ(6,-10,6,col);poly([[10,-12],[18,-10],[10,-8]],'#e8a');circ(6,-11,1.2,'#e00');poly([[0,-14],[-4,-20],[2,-16]],col);break;
      case 'bat': body(0,-4,10,8,col);circ(0,-12,5,col);poly([[-4,-10],[-20,-18],[-8,-6]],col);poly([[4,-10],[20,-18],[8,-6]],col);break;
      case 'dragon': case 'wyvern': body(0,-2,20,14,col);circ(16,-6,9,col);poly([[10,-14],[14,-20],[16,-13]],col);poly([[18,-14],[22,-20],[20,-13]],col);circ(18,-7,1.5,'#e00');poly([[0,-8],[-16,-20],[-6,-4]],dark);for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo((-6+i*12)*u,10*u);ctx.lineTo((-8+i*14)*u,22*u);ctx.stroke();}break;
      case 'serpent': case 'turtle': body(0,0,24,12,col);circ(20,-2,7,col);circ(21,-3,1.2,'#e00');for(let i=0;i<5;i++)circ(-18+i*8,-6-i*2,4,col);if(fig==='turtle'){circ(-5,-4,10,'#4a6a3a');}break;
      case 'blob': case 'golem': case 'elemental': body(0,0,20,18,col);circ(-6,-6,4,'#fff');circ(6,-6,4,'#fff');ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-6*u,-6*u,2*u,0,7);ctx.arc(6*u,-6*u,2*u,0,7);ctx.fill();break;
      case 'orb': circ(0,0,18,col);circ(-5,-5,5,'#fff');circ(5,-5,5,'#fff');ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-5*u,-5*u,2*u,0,7);ctx.arc(5*u,-5*u,2*u,0,7);ctx.fill();break;
      case 'demon': body(0,-2,18,14,col);circ(14,-8,8,col);poly([[8,-14],[10,-20],[13,-13]],col);poly([[16,-14],[19,-20],[20,-13]],col);circ(16,-9,1.5,'#e00');circ(17,-11,1,'#fff');for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo((-6+i*12)*u,10*u);ctx.lineTo((-8+i*14)*u,20*u);ctx.stroke();}break;
      case 'giant': case 'humanoid': case 'centaur': default:{
        // humanoid: head, torso, arms, legs
        const big=(desc.size==='L'||desc.size==='G')?1.3:1;
        circ(0,-22*big,7*big,desc.skin||'#c8a080');
        body(0,-10*big,12*big,14*big,col); // torso
        // arms
        ctx.beginPath();ctx.moveTo(-8*big*u,-14*big*u);ctx.lineTo(-14*big*u,-4*big*u);ctx.stroke();
        ctx.beginPath();ctx.moveTo(8*big*u,-14*big*u);ctx.lineTo(14*big*u,-4*big*u);ctx.stroke();
        // legs
        ctx.beginPath();ctx.moveTo(-4*big*u,4*big*u);ctx.lineTo(-6*big*u,18*big*u);ctx.stroke();
        ctx.beginPath();ctx.moveTo(4*big*u,4*big*u);ctx.lineTo(6*big*u,18*big*u);ctx.stroke();
        // eyes
        ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-2.5*big*u,-23*big*u,1*u,0,7);ctx.arc(2.5*big*u,-23*big*u,1*u,0,7);ctx.fill();
        if(fig==='centaur'){body(0,8,20,10,col);for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo((-8+i*5)*u,(10+i*2)*u);ctx.lineTo((-10+i*6)*u,22*u);ctx.stroke();}}
        if(desc.gear==='shield'){ctx.fillStyle='#7a6a4a';ctx.beginPath();ctx.arc(16*u,-8*u,6*u,0,7);ctx.fill();ctx.stroke();}
        if(desc.gear==='sword'){ctx.strokeStyle='#ccc';ctx.beginPath();ctx.moveTo(14*u,-8*u);ctx.lineTo(22*u,-18*u);ctx.stroke();}
        break;
      }
      case 'undead':{ // skeletal/shadow figure
        circ(0,-22,7,'#d8d8d8');body(0,-10,12,14,'#b8b8b8');ctx.strokeStyle='#888';
        for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-4*u,(-2+i*5)*u);ctx.lineTo(4*u,(-2+i*5)*u);ctx.stroke();}
        ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-2.5*u,-23*u,1.2*u,0,7);ctx.arc(2.5*u,-23*u,1.2*u,0,7);ctx.fill();
        break;}
      case 'gargoyle': body(0,-4,16,12,'#6a6a7a');circ(12,-10,6,'#6a6a7a');poly([[-8,-8],[-16,-16],[-6,-4]],'#6a6a7a');poly([[8,-8],[16,-16],[6,-4]],'#6a6a7a');circ(14,-11,1.2,'#e00');break;
    }
    ctx.restore();
  }
  /* portrait: bigger head/shoulders for UI */
  function portrait(cv,desc){
    const ctx=cv.getContext('2d'); const w=cv.width,h=cv.height;
    ctx.clearRect(0,0,w,h);
    // backdrop
    const g=ctx.createRadialGradient(w/2,h*0.4,4,w/2,h/2,w*0.7);
    g.addColorStop(0,'#2a2d3a');g.addColorStop(1,'#10121a');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const isPC=desc.kind==='pc'||desc.race;
    const d=Object.assign({fig:isPC?'humanoid':(desc.fig||'humanoid'),color:desc.color||'#8a8f9e',race:desc.race,cls:desc.cls},desc);
    ctx.save();ctx.translate(0,h*0.18);drawFig(ctx,w*0.9,d);ctx.restore();
    if(isPC){ // class badge
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,h-18,w,18);
      ctx.fillStyle='#e3b54a';ctx.font='11px Georgia';ctx.textAlign='center';
      ctx.fillText((desc.name||'')+' — '+(desc.cls||'')+' '+(desc.lvl||''),w/2,h-5);
    }
  }
  /* monster card portrait */
  function monsterPortrait(cv,mon){
    const ctx=cv.getContext('2d');const w=cv.width,h=cv.height;
    ctx.clearRect(0,0,w,h);
    const g=ctx.createRadialGradient(w/2,h*0.4,4,w/2,h/2,w*0.7);
    g.addColorStop(0,'#2a2d3a');g.addColorStop(1,'#10121a');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const figColors={rat:'#8a6a5a',spider:'#5a5a6a',wolf:'#7a7a8a',dragon:'#a04a3a',giant:'#8a7a6a',humanoid:'#9a8a7a',undead:'#b8b8c8',orb:'#7a6ad4',blob:'#5a8a6a',serpent:'#6a8a5a',insect:'#6a7a4a',bird:'#8a7a5a',demon:'#a04a5a',gargoyle:'#7a7a8a',turtle:'#5a7a5a',beast:'#8a7a6a',cat:'#9a8a7a',horse:'#8a7a6a',bat:'#5a5a6a',lion:'#a08a5a',centaur:'#8a7a6a',golem:'#7a7a7a'};
    const d={fig:mon.fig||'humanoid',color:figColors[mon.fig]||'#8a8f9e',size:mon.size};
    ctx.save();ctx.translate(0,h*0.15);drawFig(ctx,w*0.85,d);ctx.restore();
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,h-16,w,16);
    ctx.fillStyle='#e9e2cf';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText(mon.n+' — '+mon.size, w/2, h-4);
  }
  function figTex(mon,size){ // offscreen canvas texture for 3D billboards
    const key='t'+mon.id+'_'+size;
    if(cache[key])return cache[key];
    const cv=document.createElement('canvas');cv.width=size;cv.height=size;
    const ctx=cv.getContext('2d');
    const figColors={rat:'#8a6a5a',spider:'#5a5a6a',wolf:'#7a7a8a',dragon:'#a04a3a',giant:'#8a7a6a',humanoid:'#9a8a7a',undead:'#b8b8c8',orb:'#7a6ad4',blob:'#5a8a6a',serpent:'#6a8a5a',insect:'#6a7a4a',bird:'#8a7a5a',demon:'#a04a5a',gargoyle:'#7a7a8a',turtle:'#5a7a5a',beast:'#8a7a6a',cat:'#9a8a7a',horse:'#8a7a6a',bat:'#5a5a6a',lion:'#a08a5a',centaur:'#8a7a6a',golem:'#7a7a7a'};
    const sc=size==='L'||size==='G'?1.25:size==='S'?0.7:1;
    drawFig(ctx,size,{fig:mon.fig||'humanoid',color:mon.color||figColors[mon.fig]||'#8a8f9e',size:mon.size});
    cache[key]=cv; return cv;
  }
  return {drawFig,portrait,monsterPortrait,figTex,shade};
})();
