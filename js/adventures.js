/* Emberfall — adventures.js : deterministic generation of 50 adventures (5 bands x 10) */
'use strict';
/* Runs once at load. Emits ordinary registry entries (MAPS, MONSTERS, QUESTS, MODULES)
   and assembles CAMPAIGN.bands. Seeded: two boots yield identical content. */
(function(){
  const T = window.__MONSTER_THEMES || {THEMES:{},BAND_THEMES:[],LEADER_FIRST:[],LEADER_LAST:[],PLACE_FIRST:[],PLACE_SECOND:[],GIVER:[]};
  const THEMES=T.THEMES, BAND_THEMES=T.BAND_THEMES;
  const FIRST=T.LEADER_FIRST, LAST=T.LEADER_LAST, PF=T.PLACE_FIRST, PS=T.PLACE_SECOND, GIVER=T.GIVER;

  /* ---------- name helpers ---------- */
  const pick=(rng,a)=>a[Math.floor(rng()*a.length)];
  const placeName=(rng)=>pick(rng,PF)+pick(rng,PS);
  const leaderName=(rng)=>pick(rng,FIRST)+(rng()<0.7?' '+pick(rng,LAST):'');
  const giverName=(rng)=>pick(rng,GIVER)+' '+(rng()<0.5?pick(rng,['Maddoc','Halda','Bergen','Ysolde','Dask','Brask','Aldous','Vex','Runa','Tobin','Maren','Osric','Wenna','Holt','Isolde','Kett','Lyle','Mira','Nils','Orla']):placeName(rng));
  const townName=(rng)=>{ const p=pick(rng,PF); return p+'wick'; };
  const dungeonName=(rng,th)=>{ return 'The '+pick(rng,PF)+pick(rng,PS)+' of '+leaderName(rng); };

  /* ---------- grid helpers ---------- */
  function blankGrid(w,h,ch){ const g=[]; for(let y=0;y<h;y++){ let r=''; for(let x=0;x<w;x++) r+=ch; g.push(r);} return g; }
  function setCell(g,x,y,c){ if(y>=0&&y<g.length&&x>=0&&x<g[0].length){ g[y]=g[y].slice(0,x)+c+g[y].slice(x+1);} }
  function getCell(g,x,y){ return (y>=0&&y<g.length&&x>=0&&x<g[0].length)?g[y][x]:'#'; }
  function carveRoom(g,r){ for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++) setCell(g,x,y,'.'); }
  function carveCorridor(g,x1,y1,x2,y2){ // L-shaped
    let x=x1,y=y1;
    while(x!==x2){ setCell(g,x,y,'.'); x+=Math.sign(x2-x); }
    while(y!==y2){ setCell(g,x,y,'.'); y+=Math.sign(y2-y); }
    setCell(g,x,y,'.');
  }
  function borderWalls(g){ const w=g[0].length,h=g.length;
    for(let x=0;x<w;x++){setCell(g,x,0,'#');setCell(g,x,h-1,'#');}
    for(let y=0;y<h;y++){setCell(g,0,y,'#');setCell(g,w-1,y,'#');}
  }
  /* generate a dungeon floor: 25x19, rooms on 4x3 slot grid */
  function genFloor(rng,seedRng,depth,name){
    const w=25,h=19,g=blankGrid(w,h,'#'); borderWalls(g);
    // candidate room slots: 4 cols x 3 rows
    const cols=4,rows=3,cw=Math.floor(w/cols),chh=Math.floor(h/rows);
    const slots=[];
    for(let ry=0;ry<rows;ry++)for(let rx=0;rx<cols;rx++){
      const rw=3+Math.floor(rng()*3), rh=2+Math.floor(rng()*2);
      const x=1+rx*cw+Math.floor(rng()*2), y=1+ry*chh+Math.floor(rng()*1);
      if(x+rw<w-1&&y+rh<h-1) slots.push({x,y,w:rw,h:rh,cx:x+Math.floor(rw/2),cy:y+Math.floor(rh/2)});
    }
    // pick 3-5 rooms spread out
    const nRooms=3+Math.floor(rng()*3);
    const chosen=[];
    const used=new Set();
    while(chosen.length<nRooms&&chosen.length<slots.length){
      const s=slots[Math.floor(rng()*slots.length)];
      if(used.has(s))continue; used.add(s); chosen.push(s);
    }
    if(chosen.length<3){ // fallback: pick first 3
      for(const s of slots){ if(chosen.length>=3)break; if(!chosen.includes(s))chosen.push(s);}
    }
    chosen.sort((a,b)=>(a.cy*cols+a.cx)-(b.cy*cols+b.cx));
    for(const r of chosen) carveRoom(g,r);
    // connect rooms in order + a couple loops
    for(let i=1;i<chosen.length;i++){
      const a=chosen[i-1],b=chosen[i];
      carveCorridor(g,a.cx,a.cy,b.cx,b.cy);
    }
    if(chosen.length>3&&rng()<0.5){ // loop
      carveCorridor(g,chosen[0].cx,chosen[0].cy,chosen[chosen.length-1].cx,chosen[chosen.length-1].cy);
    }
    // prune: leave as is (good enough)
    // place doors 'D' at corridor mouths near room edges
    let doors=0;
    for(let y=1;y<h-1&&doors<8;y++)for(let x=1;x<w-1&&doors<8;x++){
      if(getCell(g,x,y)!=='.')continue;
      const walls=[getCell(g,x-1,y),getCell(g,x+1,y),getCell(g,x,y-1),getCell(g,x,y+1)];
      const open=walls.filter(c=>c==='.').length;
      if(open===1&&rng()<0.35){ setCell(g,x,y,'D'); doors++; }
    }
    const map={name,grid:g.slice(),wall:'#',floor:'.',start:null,ev:{},traps:{},stairs:{},wander:[]};
    // stairs: entry at first room, exit/deeper at last
    const first=chosen[0],last=chosen[chosen.length-1];
    map.start={x:first.cx,y:first.cy,dir:0};
    map.stairsUp={x:first.cx,y:first.cy};
    map.stairsDown={x:last.cx,y:last.cy};
    // event sites at remaining rooms
    const evChars='abcdefghij';
    let evIdx=0;
    for(let i=1;i<chosen.length-1&&evIdx<evChars.length;i++){
      const r=chosen[i];
      setCell(g,r.cx,r.cy,evChars[evIdx]);
      map.ev[evChars[evIdx]]={room:true,depth,i};
      evIdx++;
    }
    // traps 2-3 away from stairs/secrets
    let placed=0,tries=0;
    while(placed<2+Math.floor(rng()*2)&&tries<200){
      tries++;
      const x=2+Math.floor(rng()*(w-4)),y=2+Math.floor(rng()*(h-4));
      if(getCell(g,x,y)!=='.')continue;
      if(Math.abs(x-map.stairsUp.x)+Math.abs(y-map.stairsUp.y)<4)continue;
      if(Math.abs(x-map.stairsDown.x)+Math.abs(y-map.stairsDown.y)<4)continue;
      const types=['pit','dart','gas','fire','needle','spike'];
      map.traps[x+','+y]={type:pick(seedRng,types),text:'A trap!'};
      placed++;
    }
    // secret doors: 1-3 alcoves — mark S adjacent to a wall next to a room
    let secrets=0,tries2=0;
    while(secrets<1+Math.floor(rng()*3)&&tries2<200){
      tries2++;
      const x=2+Math.floor(rng()*(w-4)),y=2+Math.floor(rng()*(h-4));
      if(getCell(g,x,y)!=='#')continue;
      // must border a room '.'
      const near=[getCell(g,x-1,y),getCell(g,x+1,y),getCell(g,x,y-1),getCell(g,x,y+1)].includes('.');
      if(!near)continue;
      setCell(g,x,y,'S'); secrets++;
      map.secrets=map.secrets||[]; map.secrets.push({x,y});
    }
    map.grid=g.slice();
    return {map,rooms:chosen};
  }
  /* ---------- wilderness generator ---------- */
  function genWild(rng,name,homeMapId,level){
    const w=28+Math.floor(rng()*13), h=20+Math.floor(rng()*7); // 28x20..40x26
    const g=blankGrid(w,h,'.'); borderWalls(g);
    // mountain border patches
    for(let x=1;x<w-1;x++){ if(rng()<0.3)setCell(g,x,1,'^'); if(rng()<0.3)setCell(g,x,h-2,'^'); }
    for(let y=1;y<h-1;y++){ if(rng()<0.2)setCell(g,1,y,'^'); if(rng()<0.2)setCell(g,w-2,y,'^'); }
    // biome patches
    const patch=(ch,cx,cy,r)=>{ for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){ if(getCell(g,x,y)==='.'&&(rng()<0.8||(x===cx&&y===cy))) setCell(g,x,y,ch);} };
    for(let i=0;i<4;i++) patch('T',2+Math.floor(rng()*(w-4)),2+Math.floor(rng()*(h-4)),2+Math.floor(rng()*3));
    for(let i=0;i<3;i++) patch('n',2+Math.floor(rng()*(w-4)),2+Math.floor(rng()*(h-4)),1+Math.floor(rng()*2));
    for(let i=0;i<2;i++) patch('%',2+Math.floor(rng()*(w-4)),2+Math.floor(rng()*(h-4)),1+Math.floor(rng()*2));
    // river: winding vertical-ish with bridges
    const rx=4+Math.floor(rng()*(w-8));
    for(let y=1;y<h-1;y++){ const xx=rx+Math.round(Math.sin(y*0.4+rng()*0.5)*2); setCell(g,xx,y,'~'); }
    for(let i=0;i<2;i++){ const by=3+Math.floor(rng()*(h-6)); setCell(g,rx+Math.round(Math.sin(by*0.4)*2),by,'+'); }
    // roads: home north-center to south exit + a loop
    const hx=Math.floor(w/2), ex=Math.floor(w/2)+Math.floor(rng()*5)-2;
    for(let y=2;y<h-2;y++){ setCell(g,hx+Math.round(Math.sin(y*0.3)*1),y,'='); }
    for(let y=2;y<h-2;y++){ const xx=hx+Math.round(Math.sin(y*0.3)*1); if(rng()<0.7)setCell(g,xx+ (xx<ex?1:-1)*Math.floor(Math.abs(ex-hx)*y/(h-4)),y,'='); }
    const map={name,overland:true,grid:g.slice(),sites:{},start:{x:hx,y:3,dir:0},encRate:1,colors:{} ,rumors:[],travellers:[]};
    // sites
    const siteAt=(ch,sx,sy,def)=>{ setCell(g,sx,sy,ch); map.sites[ch]=def; };
    siteAt('H',hx,2,{name:townName(rng),icon:'home',enter:homeMapId});
    siteAt('R',hx,h-3,{name:'South Road',icon:'road',text:'The road south.'});
    siteAt('P',hx+3,h-5,{name:'Pilgrim Camp',icon:'camp',text:'Travelers rest here.'});
    // holy + healer
    siteAt('S',2+Math.floor(rng()*(w-4)),2+Math.floor(rng()*(h-4)),{name:'Shrine of '+pick(rng,['St. Brannoc','the Dawn','Old Faith']),icon:'holy',holy:true,text:'A quiet shrine.'});
    siteAt('C',2+Math.floor(rng()*(w-4)),2+Math.floor(rng()*(h-4)),{name:'Hermit\'s Hut',icon:'hermit',heal:true,text:'A hermit lives here.'});
    // hamlet from medium up (param via level)
    if(level>=2){ siteAt('M',2+Math.floor(rng()*(w-4)),2+Math.floor(rng()*(h-4)),{name:townName(rng)+' Hamlet',icon:'hamlet',hamlet:true,text:'A small hamlet.'}); }
    // lairs: 2-4 themed
    const nLairs=2+Math.floor(rng()*3);
    const lairChars='KOWBTDG';
    for(let i=0;i<nLairs;i++){
      const ch=lairChars[i]; const lx=2+Math.floor(rng()*(w-4)),ly=2+Math.floor(rng()*(h-4));
      siteAt(ch,lx,ly,{name:placeName(rng)+' '+pick(rng,['Den','Lair','Stronghold','Camp','Hollow']),icon:'lair',fight:pick(rng,['wolf','bandit','gnoll','goblin','spider','ogre','troll'])});
    }
    // landmark
    siteAt('L',2+Math.floor(rng()*(w-4)),2+Math.floor(rng()*(h-4)),{name:placeName(rng),icon:'landmark',text:'An old landmark.'});
    map.grid=g.slice();
    return map;
  }
  /* ---------- town generator ---------- */
  function genTown(rng,name,lvl,small){
    const w=small?19:23,h=small?15:17;
    const g=blankGrid(w,h,'#'); borderWalls(g);
    // streets: vertical + horizontal
    const cx=Math.floor(w/2), cy=Math.floor(h/2);
    for(let y=2;y<h-2;y++)setCell(g,cx,y,'.');
    for(let x=2;x<w-2;x++)setCell(g,x,cy,'.');
    // buildings as '#' blocks with doors 'D' facing street
    const bR=3,bC=3,bw=Math.floor(w/3)-1,bh=Math.floor(h/3)-1;
    const locs={}; let doorNum=1;
    const services=small?['inn','shop:general','temple','hall','train','tavern']:['inn','shop:armory','tavern','apothecary','temple','hall','train','barracks','shop:general','hermit'];
    let si=0;
    for(let by=0;by<bR;by++)for(let bx=0;bx<bC;bx++){
      const x0=1+bx*bw+1,y0=1+by*bh+1;
      // skip center cross streets
      if(x0<=cx&&x0+bw>=cx&&y0<=cy&&y0+bh>=cy) continue;
      for(let y=y0;y<y0+bh;y++)for(let x=x0;x<x0+bw;x++) if(getCell(g,x,y)!=='#')setCell(g,x,y,'#');
      // door on side facing nearest street
      let dx,dy,dd;
      if(Math.abs(x0+bw/2-cx)<Math.abs(y0+bh/2-cy)){ dx=cx< x0+bw/2?x0-1:x0+bw; dy=y0+Math.floor(bh/2); }
      else { dy=cy<y0+bh/2?y0-1:y0+bh; dx=x0+Math.floor(bw/2); }
      const svc=services[si%services.length]; si++;
      if(doorNum<=9 && !locs[String(doorNum)]){
        setCell(g,dx,dy,String(doorNum));
        locs[String(doorNum)]={name:placeName(rng),service:svc};
        doorNum++;
      }
    }
    // gate south
    const gx=Math.floor(w/2), gy=h-2; setCell(g,gx,gy,'G');
    const map={name,w:0,h:0,outdoor:true,safe:true,grid:g.slice(),locs,start:{x:cx,y:h-3,dir:0},ev:{},wander:[],rumors:[],traps:{}};
    map.w=g[0].length; map.h=g.length;
    return map;
  }
  /* ---------- monster selection ---------- */
  function monsterPower(m){ // rough power from xp field
    const xp=parseInt(String(m.xp||'0').replace(/d\d+/g,'0').replace(/\D/g,''))||10;
    return xp;
  }
  function pickMonsters(rng,themeKey,lvl,count){
    const th=THEMES[themeKey]||THEMES.vermin;
    const cands=th.mons.filter(id=>MONSTERS[id]);
    const out=[];
    for(let i=0;i<count;i++){
      const id=cands.length?pick(rng,cands):'kobold';
      const m=MONSTERS[id]; if(!m)continue;
      const cnt=1+Math.floor(rng()*2);
      out.push([id,cnt<=1?cnt:cnt+'d2']);
    }
    return out;
  }
  function scaleCount(rng,lvl){ return Math.max(1,Math.round(lvl*0.8+rng()*lvl*0.5)); }
  /* ---------- the module builder ---------- */
  const SIZES=['Small','Medium','Large','Huge'];
  const SIZE_IDX=[0,0,0,0,1,1,1,2,2,3]; // 10 modules per band
  const FLOOR_COUNT={Small:1,Medium:2,Large:3,Huge:5};
  let moduleCount=0;
  for(let t=1;t<=5;t++){
    for(let i=1;i<=10;i++){
      const themeKey=BAND_THEMES[t-1][i-1];
      const seed=7919*t+104729*i+31*(themeKey?themeKey.length:5);
      const rng=Treasure.mulberry32(seed);
      const rngW=Treasure.mulberry32(seed+15485863);
      const rngS=Treasure.mulberry32(seed+32452843);
      const lvlLo=(t-1)*4+1, lvlHi=t*4;
      const size=SIZES[SIZE_IDX[i-1]];
      const floors=FLOOR_COUNT[size];
      const modId='adv'+t+'_'+i;
      const code='T'+t+'-'+String(i).padStart(2,'0');
      const townNm=townName(rng);
      const dunNm=dungeonName(rng,THEMES[themeKey]||{});
      const wildNm=placeName(rng)+' '+pick(rng,['Wilds','Reach','Moor','Fell','Wild']);
      const giver=giverName(rng);
      const trainer=giverName(rng);
      const startLvl=lvlLo;
      const gold=Math.round(40*Math.pow(startLvl,1.5)/10)*10;
      const diff=Math.min(4,1+Math.floor((t-1)/2)+(size==='Huge'?1:0));
      /* town */
      const small=t===1&&i<=4;
      const townMapId=modId+'_town';
      MAPS[townMapId]=genTown(rng,townNm,startLvl,small);
      MAPS[townMapId].name=townNm;
      MAPS[townMapId].rumors=[];
      /* dungeon floors */
      const floorMaps=[];
      for(let f=0;f<floors;f++){
        const fm=modId+'_d'+(f+1);
        const depth=f+1;
        const {map,rooms}=genFloor(rngS,rngS,depth,dunNm+(floors>1?' — Level '+depth:''));
        MAPS[fm]=map; floorMaps.push({id:fm,map,rooms,depth});
      }
      /* link stairs between floors */
      for(let f=0;f<floorMaps.length;f++){
        const cur=floorMaps[f];
        const up=f>0?floorMaps[f-1].id:null;
        const down=f<floorMaps.length-1?floorMaps[f+1].id:null;
        // arrival coords: use rooms[0] center (entry) and last room center (exit)
        const entry=cur.rooms[0]||{cx:12,cy:9};
        const exitR=cur.rooms[cur.rooms.length-1]||{cx:12,cy:9};
        MAPS[cur.id].stairs={};
        if(up){ MAPS[cur.id].stairs[entry.cx+','+entry.cy]={to:up,x:MAPS[up].stairsDown?MAPS[up].stairsDown.x:12,y:MAPS[up].stairsDown?MAPS[up].stairsDown.y:9}; }
        else { MAPS[cur.id].stairs[entry.cx+','+entry.cy]={to:townMapId,x:MAPS[townMapId].start.x,y:MAPS[townMapId].start.y}; }
        if(down){ MAPS[cur.id].stairs[exitR.cx+','+exitR.cy]={to:down,x:MAPS[down].stairsUp?MAPS[down].stairsUp.x:12,y:MAPS[down].stairsUp?MAPS[down].stairsUp.y:9}; }
      }
      /* wilderness */
      const wildMapId=modId+'_wild';
      MAPS[wildMapId]=genWild(rngW,wildNm,townMapId,startLvl);
      MAPS[wildMapId].name=wildNm;
      MAPS[wildMapId].enc=pickMonsters(rngW,themeKey,startLvl,4).map(e=>e[0]);
      MAPS[wildMapId].rumors=(THEMES[themeKey]&&THEMES[themeKey].rumors)||[];
      /* populate dungeon events: set encounters + chests */
      const questIds=[];
      const mainCount=size==='Huge'?4:floors;
      let qn=0;
      for(const fl of floorMaps){
        const {map,rooms,depth}=fl;
        // leader on deepest quest floor; lieutenants on shallower
        const isBossFloor = depth===floors;
        const evKeys=Object.keys(map.ev);
        // pick 1-2 event sites for set battles
        for(const k of evKeys){
          const r=map.ev[k];
          if(!r||!r.room)continue;
          const cnt=scaleCount(rng,startLvl+depth-1);
          const mons=pickMonsters(rng,themeKey,startLvl+depth-1,Math.min(3,1+Math.floor(cnt/3)));
          // scale counts
          const scaled=mons.map(([id,c])=>{ const m=MONSTERS[id]; const base=1+Math.floor(rng()*Math.max(1,Math.round((startLvl+depth)/4))); return [id,c==='1d2'?base+'d2':String(base)]; });
          map.ev[k].enc={mons:scaled,text:(isBossFloor&&k===evKeys[0])?('The guardian of '+dunNm+'!'):'Monsters of the deep!'};
        }
        // place a chest event letter at far room
        const farRoom=rooms[rooms.length-1];
        const chL='z'; // use letter z for chest site? 'z' is walkable event; but might collide with ev letters a-j. use 'y'
        const chestChar = 'y';
        if(!map.ev[chestChar]){
          MAPS[fl.id].grid[farRoom.cy]=MAPS[fl.id].grid[farRoom.cy].slice(0,farRoom.cx)+chestChar+MAPS[fl.id].grid[farRoom.cy].slice(farRoom.cx+1);
          MAPS[fl.id].ev[chestChar]={chest:{text:'A treasure hoard!',gold:'',items:[]},guard:map.enc&&map.enc[0]?[map.enc[0]]:null};
        }
        qn++;
      }
      /* boss: clone theme monster into unique leader on final floor */
      const bossTheme=THEMES[themeKey]||THEMES.undead;
      const bossBase=pick(rng,bossTheme.mons.filter(id=>MONSTERS[id]&&MONSTERS[id].hd));
      const bossId=modId+'_boss';
      if(MONSTERS[bossBase]){
        const b=MONSTERS[bossBase];
        MONSTERS[bossId]=Object.assign({},b,{id:bossId,n:leaderName(rng)+' '+b.n,leader:true,morale:Math.max(16,b.morale||10),xp:Math.round((b.xp||50)*2),lore:b.lore+' A named terror of '+dunNm+'.'});
        // place boss encounter on final floor's first ev or chest room
        const lastFloor=floorMaps[floorMaps.length-1];
        const evKeys=Object.keys(lastFloor.map.ev).filter(k=>lastFloor.map.ev[k]&&lastFloor.map.ev[k].room);
        if(evKeys.length){ const k=evKeys[0]; lastFloor.map.ev[k].enc={mons:[[bossId,'1d1']],text:'The terror of '+dunNm+' blocks the way!'}; }
        else { const r=lastFloor.rooms[lastFloor.rooms.length-1]; lastFloor.map.ev['x']={enc:{mons:[[bossId,'1d1']],text:'The terror of '+dunNm+' blocks the way!'}}; }
      }
      /* quests: main deed per floor + item retrieval side */
      const qlist=[];
      for(let f=0;f<mainCount;f++){
        const qid=modId+'_q'+(f+1);
        const fl=floorMaps[Math.min(f,floorMaps.length-1)];
        const isFinal=f===mainCount-1;
        QUESTS[qid]={id:qid,name:(isFinal?'The Terror of ':'The Depths of ')+dunNm,side:false,giver,goal:isFinal?('Destroy the terror of '+dunNm+' in '+MAPS[fl.id].name+'.'):('Clear '+MAPS[fl.id].name+' of its guardians.'),offer:isFinal?('The final horror of '+dunNm+' must be destroyed.'):('The '+dunNm+' stirs on level '+(f+1)+'. Clear it.'),done:isFinal?dunNm+' is cleansed!':MAPS[fl.id].name+' is safe.',gold:Math.round(25*Math.pow(startLvl+f,1.3)/10)*10,xp:Math.round(40*Math.pow(startLvl+f,1.2)/10)*10,needItem:null,reveal:fl.id,map:fl.id,deed:qid+'_done'};
        qlist.push(qid);
      }
      // optional item-retrieval commission (two on huge)
      const itemQ=[];
      const nItemQ=size==='Huge'?2:1;
      for(let q=0;q<nItemQ;q++){
        const qid=modId+'_item'+q;
        const relicId=modId+'_relic'+q;
        ITEMS[relicId]={id:relicId,n:pick(rng,['Ancient Relic','Sealed Tome','Runed Idol','Hoarded Cache','Lost Ledger']),t:'q',price:0,desc:'A unique find of '+dunNm+'.'};
        const fl=floorMaps[Math.floor(rng()*floorMaps.length)];
        const farRoom=fl.rooms[fl.rooms.length-1];
        // place item on a chest at far room
        const chL2='y';
        MAPS[fl.id].ev[chL2]=MAPS[fl.id].ev[chL2]||{chest:{text:'A hidden cache!',gold:'',items:[]}};
        MAPS[fl.id].ev[chL2].chest.items=(MAPS[fl.id].ev[chL2].chest.items||[]).concat([relicId]);
        QUESTS[qid]={id:qid,name:'The Lost '+(q===0?'Relic':'Cache'),side:true,giver,goal:'Recover the '+ITEMS[relicId].n+' from '+MAPS[fl.id].name+'.',offer:'A valuable item lies hidden in '+MAPS[fl.id].name+'. Retrieve it.',done:'You found the '+ITEMS[relicId].n+'! Thank you.',gold:Math.round(15*Math.pow(startLvl,1.2)/10)*10,xp:Math.round(25*Math.pow(startLvl,1.1)/10)*10,needItem:relicId,reveal:fl.id,map:fl.id};
        itemQ.push(qid);
      }
      /* assemble module */
      const allMaps=[townMapId].concat(floorMaps.map(f=>f.id),[wildMapId]);
      MODULES[modId]={
        id:modId,code,name:(THEMES[themeKey]&&THEMES[themeKey].n?pick(rng,THEMES[themeKey].n)+' ':'')+dunNm,lvl:startLvl,levels:[lvlLo,lvlHi],
        diff,size,length:size==='Small'?'about an hour':size==='Medium'?'two hours':size==='Large'?'three hours':'four hours or more',
        hub:townMapId,maps:allMaps,wild:wildMapId,gold,next:null,
        quests:qlist,side:itemQ,final:qlist[qlist.length-1],
        names:{giver,trainer,places:[townNm,dunNm,wildNm].concat((THEMES[themeKey]&&THEMES[themeKey].n)||[])},
        rumors:[],blurb:(THEMES[themeKey]&&THEMES[themeKey].n?pick(rng,THEMES[themeKey].n)+' ':'')+'horror in '+wildNm+'.',
        intro:townNm+' needs adventurers. '+dunNm+' is not what it seems.',
        hint:'The way lies through '+wildNm+' and into '+dunNm+'.',
        victory:dunNm+' is cleansed! '+townNm+' celebrates.',
        lose:'The depths claim another company.',
        generated:true,tier:t,theme:themeKey,
      };
      // rumors from wild
      MODULES[modId].rumors=MAPS[wildMapId].rumors||[];
      // town rumors
      MAPS[townMapId].rumors=MODULES[modId].rumors;
      // link next
      moduleCount++;
      CAMPAIGN.bands[t-1].modules.push(modId);
    }
  }
  /* link module chain: last of band -> next band's first; T5-10 -> null */
  const all=[];
  for(let t=1;t<=5;t++) for(const id of CAMPAIGN.bands[t-1].modules) all.push(id);
  for(let i=0;i<all.length;i++){
    MODULES[all[i]].next = i<all.length-1? all[i+1] : null;
  }
  /* CAMPAIGNS band module lists already reference CAMPAIGN.bands arrays (live) */
  window.__ADVENTURES_DONE=true;
})();
