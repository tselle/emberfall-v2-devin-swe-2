/* Emberfall — overland.js : wilderness map & travel (1 tile = 1 mile) */
'use strict';
const Overland = (()=>{
  const G=()=>Game.G;

  function map(){ return MAPS[G().map]; }
  function wild(){ return WILD[G().map]||WILD.wild||{}; }
  function cell(x,y){ const m=map(); if(!m||y<0||x<0||y>=m.grid.length||x>=m.grid[0].length)return'#'; return m.grid[y][x]; }
  function siteAt(x,y){ const m=map(); const ch=cell(x,y); return (m&&m.sites&&m.sites[ch])||null; }
  function isWater(ch){return ch==='~';}
  function passableXY(x,y){
    const ch=cell(x,y); if(ch==='#'||ch==='^')return false;
    if(ch==='~')return false; // rivers block; bridges are '='/'+' tiles
    return true;
  }
  /* ---- enter an overland map ---- */
  function enter(mapId,wx,wy){
    const g=G(); const m=MAPS[mapId]; if(!m||!m.overland){UI.log('No wilds here.','bad');return false;}
    Campaign.enterMap(mapId);
    g.screen='wilds';
    const st=m.start||{x:Math.floor(m.grid[0].length/2),y:2,dir:0};
    g.x=wx!==undefined?wx:st.x; g.y=wy!==undefined?wy:st.y;
    g.dir=st.dir||0;
    UI.log(`— ${m.name} — ${wild().name||''}`,'warn');
    drawMap();
    return true;
  }
  /* ---- movement ---- */
  const DIRS={n:[0,-1],s:[0,1],w:[-1,0],e:[1,0],nw:[-1,-1],ne:[1,-1],sw:[-1,1],se:[1,1]};
  function move(dir){
    const g=G(); const d=DIRS[dir]; if(!d)return;
    const nx=g.x+d[0],ny=g.y+d[1];
    if(!passableXY(nx,ny)){UI.log('You cannot pass that way.','dim');return;}
    g.x=nx;g.y=ny;
    Game.passTime(60); // ~1 hour per mile on foot
    drawMap();
    checkSite();
    checkDanger();
  }
  function checkSite(){
    const g=G(); const s=siteAt(g.x,g.y);
    if(s)visitSite(s);
  }
  function visitSite(s){
    const g=G();
    if(s.enter){ UI.log(s.name?`You reach ${s.name}.`:'You reach a settlement.','dim'); Campaign.enterMap(s.enter,'up'); return; }
    if(s.fight){ startEncounter([{id:s.fight,n:'2d4'}]); return; }
    if(s.heal){ // hermit/hospitaler
      const cost=10; const party=Game.partyChars().filter(c=>!c.dead&&c.hp>0);
      UI.modal({title:s.name||'Healer',body:`<p>${s.text||'A healer offers to mend your wounds.'} (${cost} gp for the company)</p>`,actions:[
        {label:`Heal (${cost} gp)`,primary:true,disabled:g.gold<cost||!party.length,fn:()=>{g.gold-=cost;party.forEach(c=>c.hp=c.maxhp);if(typeof c.layUsed!=='undefined')c.layUsed=false;UI.log('The party is healed.','good');}},
        {label:'Decline'}]});
      return;
    }
    if(s.holy){ // shrine: bless + maybe temple services
      g.roster.filter(c=>!c.dead).forEach(c=>{c.hp=Math.min(c.maxhp,c.hp+Rules.roll('1d8'));});
      UI.log('You receive a blessing at the shrine.','good');Journal.rumor();return;
    }
    if(s.hamlet){ // small settlement: inn/shop services
      UI.modal({title:s.name||'Hamlet',body:`<p>${s.text||'A quiet hamlet.'}</p>`,actions:[
        {label:'Rest at the inn (5 gp)',fn:()=>{if(g.gold>=5){g.gold-=5;Game.restHours(8);}}},
        {label:'Browse goods',fn:()=>UI.shopDialog('general',g.roster.find(c=>!c.dead)||g.roster[0])},
        {label:'Move on',primary:true}]});
      return;
    }
    if(s.text||s.name)UI.log((s.name?s.name+': ':'')+(s.text||''),'dim');
  }
  /* ---- encounters ---- */
  function pickFoe(){
    const w=wild(); const night=G().night;
    const table=(night&&w.encNight&&w.encNight.length)?w.encNight:w.enc;
    if(table&&table.length){
      let tot=0;for(const e of table)tot+=e[2]||10;
      let r=Rules.rng()*tot;
      for(const e of table){r-=(e[2]||10);if(r<=0)return e;}
      return table[0];
    }
    // fallback: map.enc monster ids
    const m=map();const enc=m&&m.enc;
    if(enc&&enc.length){const id=enc[Math.floor(Rules.rng()*enc.length)];return[id,'2d4',10];}
    return['wolf','2d4',10];
  }
  function startEncounter(foes,opts){
    const g=G();
    opts=opts||{};
    Combat.start(g.x,g.y,foes,{wild:true,gold:opts.gold,xp:opts.xp,loot:opts.loot});
    // award xp per foe type
    foes.forEach(f=>{const mon=MONSTERS[f.id||f.mon];if(mon)g.roster.filter(c=>!c.dead).forEach(c=>{c.xp+=(mon.xp||5)*(typeof f.n==='string'?Math.max(1,Math.round(parseInt(f.n)||2)):1);Campaign.checkLevel(c);});});
  }
  function checkDanger(){
    const g=G(); const w=wild(); const m=map();
    const ch=cell(g.x,g.y);
    const terr=TERRAIN_ENC[ch]||TERRAIN_ENC['.'];
    let chance=(terr.h||0.05)*(w.rate||1)*(m.encRate||1);
    if(g.night)chance*=1.6;
    if(Rules.rng()<chance){
      const e=pickFoe();
      const lvl=Math.max(1,Math.round(Game.partyAvgLvl()));
      const nDice=lvl>=8?'3d4':lvl>=4?'2d4':'1d6';
      startEncounter([{id:e[0],n:nDice}],{gold:Rules.roll('2d6')*lvl});
    }
  }
  /* ---- render ---- */
  function drawMap(){
    const g=G(); const m=map(); const w=wild();
    const cv=document.getElementById('overCanvas'); if(!cv)return;
    const W=m?m.grid[0].length:20,H=m?m.grid.length:14;
    cv.width=W*10;cv.height=H*10;
    const c=cv.getContext('2d');
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const ch=m.grid[y][x];let col='#22301c';
      if(ch==='#')col='#1a1408';else if(ch==='.')col='#2c3a22';else if(ch==='=')col='#4a3b28';
      else if(ch==='+')col='#5a4a30';else if(ch==='T')col='#1e3a18';else if(ch==='n')col='#3a3a26';
      else if(ch==='%')col='#1c2e20';else if(ch==='~')col='#14304a';else if(ch==='^')col='#4a4a52';
      else if(ch==='B')col='#5a4a2a';else if(ch==='H'||ch==='M'||ch==='K'||ch==='O'||ch==='W'||ch==='B'||ch==='T'||ch==='C'||ch==='S'||ch==='P'||ch==='R'||ch==='L'||ch==='V'||ch==='N'||ch==='E'||ch==='G'||ch==='F'||ch==='D'){
        // site tile: keep terrain-ish base + marker
        col='#3a3226';
      }
      c.fillStyle=col;c.fillRect(x*10,y*10,10,10);
      // site glyph
      const s=m.sites&&m.sites[ch];
      if(s){c.fillStyle='#e3b54a';c.font='bold 8px sans-serif';c.textAlign='center';c.fillText(ch,x*10+5,y*10+8);}
      else if('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(ch)&&ch!=='B'){c.fillStyle='#c8b890';c.font='7px sans-serif';c.textAlign='center';c.fillText(ch,x*10+5,y*10+8);}
    }
    // party
    c.fillStyle='#fff';c.beginPath();c.arc(g.x*10+5,g.y*10+5,4,0,7);c.fill();
    c.strokeStyle='#e3b54a';c.lineWidth=2;c.stroke();
    UI.log(`${m.name}: pos ${g.x},${g.y} · ${w.name||''} · ${Rules.fmtTime(G().time)}`,'dim');
  }
  function forage(){
    const g=G();
    const foodIds=Object.keys(ITEMS).filter(k=>ITEMS[k].t==='q'&&/ration|food|waterskin|bread/i.test(ITEMS[k].n||''));
    if(foodIds.length&&Rules.rng()<0.6){const id=foodIds[Math.floor(Rules.rng()*foodIds.length)];Combat.addLoot(g,{t:'i',i:id});UI.log('You forage and find '+(item(id)?item(id).n:'supplies')+'.','good');}
    else UI.log('The wilds provide little.','dim');
    Game.passTime(120);
  }
  function restWild(){
    const g=G();
    if(Rules.rng()<0.3){UI.log('You are ambushed in your sleep!','warn');const e=pickFoe();Combat.start(g.x,g.y,[{id:e[0],n:'2d4'}],{wild:true});}
    else{Game.restHours(8);UI.log('You rest.','dim');drawMap();}
  }
  /* ---- travel between modules ---- */
  function travelDialog(){
    const g=Game.G;const cur=MODULES[g.module];
    const opts=[{label:'← Back',fn:()=>{}}];
    // adjacent modules via links/next
    const links=[];
    if(cur){if(cur.next)links.push(cur.next);if(cur.links)links.push(...cur.links);}
    // also allow any module in same campaign band
    for(const id of (CAMPAIGN.order||[])){if(id!==g.module&&links.indexOf(id)<0)links.push(id);}
    const acts=links.filter(id=>MODULES[id]).map(id=>({label:MODULES[id].name,fn:()=>{UI.closeTop();Campaign.travelToModule(id);}}));
    acts.push({label:'Stay',primary:true});
    UI.modal({title:'Travel',body:'<p>Where will the company march?</p>',actions:acts});
  }
  function commands(){
    return [
      {label:'N',hint:'North',fn:()=>move('n')},{label:'S',hint:'South',fn:()=>move('s')},
      {label:'W',hint:'West',fn:()=>move('w')},{label:'E',hint:'East',fn:()=>move('e')},
      {label:'NW',fn:()=>move('nw')},{label:'NE',fn:()=>move('ne')},{label:'SW',fn:()=>move('sw')},{label:'SE',fn:()=>move('se')},
      {label:'Forage',hint:'F',fn:forage},{label:'Rest',hint:'R',fn:restWild},
      {label:'Map',fn:()=>MapUI.openFull()},{label:'Menu',fn:()=>UI.menuDialog()},
    ];
  }
  return {enter,map,wild,cell,siteAt,move,visitSite,checkDanger,pickFoe,forage,restWild,travelDialog,commands,drawMap,passable:passableXY};
})();
