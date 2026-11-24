/* Emberfall — campaign.js : module transitions, party management, leveling */
'use strict';
const Campaign = (()=>{
  const G=()=>Game.G;
  /* ---- transitions ---- */
  function travelToModule(moduleId){
    const g=G();
    const m=MODULES[moduleId]||MODULES[moduleId]; if(!m)return false;
    g.module=moduleId;
    // enter the module's town hub (or first map)
    const entry=m.hub||m.maps[0];
    return enterMap(entry);
  }
  function enterMap(mapId,fromDir){
    const g=G();
    const map=MAPS[mapId];if(!map)return false;
    g.map=mapId;
    if(!g.seen[mapId])g.seen[mapId]=new Array(map.grid.length*map.grid[0].length).fill(0);
    if(!g.mods[mapId])g.mods[mapId]={};
    if(!g.ground[mapId])g.ground[mapId]={};
    if(!g.usedEvents[mapId])g.usedEvents[mapId]={};
    // position
    let tx=-1,ty=-1;
    const st=map.start;
    if(st){tx=st.x;ty=st.y;}
    if(tx<0){outer:for(let y=1;y<map.grid.length-1;y++)for(let x=1;x<map.grid[0].length-1;x++){const c=map.grid[y][x];if('.=+<>G0123456789'.includes(c)){tx=x;ty=y;break outer;}}}
    if(tx<0){tx=1;ty=1;}
    g.x=tx;g.y=ty;g.dir=(st&&st.dir!=null)?st.dir:0;
    g.screen=map.overland?'wilds':'dungeon';
    if(map.overland){Overland.drawMap();}
    else{View3D.prepare(map,g.mods[mapId],g.seen[mapId]);if(Game.revealAround)Game.revealAround();}
    const mod=MODULES[g.module];
    UI.log(`— ${map.name||'Unknown'} —`,map.overland?'warn':'dim');
    if(mod&&mod.blurb&&!g.flags[mod.id+'_intro']){g.flags[mod.id+'_intro']=1;UI.log(mod.blurb,'dim');}
    Game.refreshUI();
    return true;
  }
  /* ---- quests ---- */
  function initQuests(){
    const g=G();g.quests=g.quests||{};
    for(const qid in QUESTS){
      if(!g.quests[qid])g.quests[qid]={id:qid,state:'open',prog:0,need:QUESTS[qid].steps||1};
    }
  }
  /* ---- leveling ---- */
  const CASTER_CLASSES=['M','C','P'];
  function isCaster(ch){return CASTER_CLASSES.includes(ch.cls);}
  function checkLevel(ch){
    if(!ch||ch.dead)return;
    while(Rules.canLevel(ch)){
      // ability score ups every 4 levels
      if(ch.lvl%4===0){const s=['str','dex','con','int','wis','cha'].filter(k=>ch[k]<18);if(s.length){const k=s[Math.floor(Rules.rng()*s.length)];ch[k]++;UI.log(`${ch.name} gains +1 ${k.toUpperCase()}!`,'good');}}
      Rules.levelUp(ch,Rules.rng);
      // learn spells
      learnSpells(ch);
      UI.log(`${ch.name} reaches level ${ch.lvl}!`,'good');
    }
    refreshCasters(ch);
  }
  function spellPoolFor(ch){
    const pool=[];
    for(const id in SPELLS){const sp=SPELLS[id];
      if(sp.c==='M'&&ch.cls==='M'&&sp.l<=Math.floor((ch.lvl-1)/2)+1)pool.push(id);
      if(sp.c==='C'&&ch.cls==='C'&&sp.l<=ch.lvl)pool.push(id);
      if(sp.c==='C'&&ch.cls==='P'&&sp.l<=Math.min(3,Rules.casterLevel(ch)))pool.push(id);
    }
    return pool;
  }
  function learnSpells(ch){
    if(!isCaster(ch))return;
    ch.book=ch.book||[];const known=new Set(ch.book);
    const pool=spellPoolFor(ch).filter(id=>!known.has(id));
    // learn up to 2 new spells per level
    const n=ch.cls==='M'?2:1;
    for(let i=0;i<n&&pool.length;i++){const id=pool.splice(Math.floor(Rules.rng()*pool.length),1)[0];ch.book.push(id);UI.log(`${ch.name} learns ${SPELLS[id].n}.`,'good');}
    if(ch.cls==='M'&&ch.prep){for(const id of ch.book){if(!(id in ch.prep)&&SPELLS[id]&&SPELLS[id].l<=Rules.casterLevel(ch))ch.prep[id]=1;}}
  }
  function refreshCasters(ch){
    if(!isCaster(ch))return;
    const slots=Rules.slotTable(ch);if(!slots)return;
    ch.prep=ch.prep||{};
    const lvl=Rules.casterLevel(ch);
    const known=(ch.book||[]).map(id=>SPELLS[id]).filter(sp=>sp&&sp.l<=lvl).sort((a,b)=>a.l-b.l||a.n.localeCompare(b.n));
    // reset prep, then fill slots per level with distinct spells
    const np={};const used={};
    for(const sp of known){const l=sp.l;const cap=slots[l-1]||0;const u=used[l]||0;
      if(u<cap){np[sp.id]=1;used[l]=u+1;}}
    ch.prep=np;
    // mem mirrors prep (combat recomputes per-round anyway)
    ch.mem={};for(const id in np)ch.mem[id]=np[id];
  }
  /* ---- roster helpers ---- */
  function newCharacter(opts){return Rules.makeCharacter(opts);}
  function addToRoster(ch){G().roster.push(ch);learnSpells(ch);refreshCasters(ch);return ch;}
  function partyChars(){return G().roster.filter(c=>!c.dead);}
  function partyAvgLvl(){const p=partyChars();return p.length?p.reduce((s,c)=>s+c.lvl,0)/p.length:1;}
  /* ---- services by map locs ---- */
  function serviceForChar(ch){
    const g=G();const map=MAPS[g.map];
    if(!map)return null;
    // town locs: digits
    const loc=map.locs&&map.locs[ch];
    if(loc){openService(loc.service,loc.name);return true;}
    // letter services on maps (I inn, V vendor, N temple, T tavern, G gate)
    const svcMap={I:'inn',V:'shop:general',N:'temple',T:'tavern',G:'gate',H:'hall',A:'shop:armory',P:'apothecary',B:'barracks',E:'elder',R:'train'};
    if(svcMap[ch]){openService(svcMap[ch],null);return true;}
    return false;
  }
  function openService(svc,name){
    const g=G();const party=partyChars();
    const buyer=party[0]||g.roster[0];
    switch(svc){
      case 'inn':UI.innDialog();break;
      case 'temple':UI.templeDialog();break;
      case 'tavern':UI.tavernDialog();break;
      case 'shop:general':case 'shop:armory':case 'shop':UI.shopDialog(svc==='shop:armory'?'armory':'general',buyer);break;
      case 'apothecary':UI.shopDialog('general',buyer);break;
      case 'hall':UI.log('The town hall is quiet.','dim');break;
      case 'train':trainDialog();break;
      case 'barracks':UI.log('The barracks is full of off-duty soldiers.','dim');break;
      case 'elder':UI.log((name||'The elder')+' nods wisely.','dim');Journal.rumor();break;
      case 'smithy':UI.shopDialog('armory',buyer);break;
      case 'gate': // exit town to wilds
        if(MODULES[g.module]&&MAPS[MODULES[g.module].wild]){Overland.enter(MODULES[g.module].wild);UI.log('You leave the settlement for the wilds.','dim');}
        break;
      default:UI.log('Nothing happens.','dim');
    }
  }
  function trainDialog(){
    const g=G();const party=partyChars().filter(c=>!c.dead&&Rules.canLevel(c));
    const cost=party.map(c=>100*c.lvl);
    const body=document.createElement('div');
    body.innerHTML='<p>Training costs 100 gp × current level per hero.</p>';
    const acts=party.map((c,i)=>({label:`Train ${c.name} (${cost[i]} gp)`,disabled:g.gold<cost[i],fn:()=>{g.gold-=cost[i];Campaign.checkLevel(c);Rules.rollHp(c,Rules.rng);c.hp=c.maxhp;UI.log(c.name+' trains and improves!','good');}}));
    acts.push({label:'Leave',primary:true});
    UI.modal({title:'Training Hall',body,actions:acts.length?acts:[{label:'No one can train',primary:true}]});
  }
  /* ---- status tick ---- */
  function tickStatuses(){
    const g=G();
    for(const c of g.roster){
      if(c.poison){c.poison.ticks--;if(c.poison.ticks<=0){c.poison=null;UI.log(c.name+' recovers from poison.','good');}else if(c.poison.dmg)c.hp=Math.max(0,c.hp-Rules.roll(c.poison.dmg));}
      if(c.fx&&c.fx.regen)c.hp=Math.min(c.maxhp,c.hp+1);
    }
    g.roster.filter(c=>c.dead&&!c.lost).forEach(c=>{c.dead=false;c.lost=true;c.hp=0;});
  }
  return {travelToModule,enterMap,initQuests,checkLevel,isCaster,spellPoolFor,learnSpells,refreshCasters,prepSpells:refreshCasters,newCharacter,addToRoster,partyChars,partyAvgLvl,serviceForChar,openService,trainDialog,tickStatuses};
})();
