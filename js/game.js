/* Emberfall — game.js : state, saves, input, bootstrap */
'use strict';
const Game = (()=>{
  let G=null;
  const SAVE_PREFIX='emberfall.save.';
  const DIRV=[[0,-1],[1,0],[0,1],[-1,0]]; // 0=N 1=E 2=S 3=W
  const keys={};

  /* ================= state ================= */
  function newGameState(){
    return {v:1,screen:'title',module:null,map:null,x:0,y:0,dir:0,
      gold:0,time:8*60,night:false,roster:[],inv:[],quests:{},rumors:[],
      seen:{},mods:{},ground:{},usedEvents:{},flags:{},
      monstersSeen:{},monsterKills:{},rngState:1};
  }
  /* ================= boot ================= */
  function boot(){
    G=newGameState();
    // normalize all grids
    for(const id in MAPS)Rules.normGrid(MAPS[id]);
    View3D.init(document.getElementById('view3d'));
    NavPad.init();
    bindUI();
    bindKeys();
    bindCanvas();
    Watch.start();
    showTitle();
    requestAnimationFrame(loop);
  }
  function showScreen(name){
    for(const s of ['title','campaign','assembly','game']){
      document.getElementById(s).classList.toggle('hidden',s!==name);
    }
    G.screen=name==='game'?(G.screen==='combat'?'combat':G.screen):name;
  }
  function showTitle(){
    G.screen='title';
    showScreen('title');
    // animated backdrop
    const cv=document.getElementById('titleFx');
    if(cv){const c=cv.getContext('2d');cv.width=800;cv.height=450;
      let t=0;(function anim(){t+=0.01;c.fillStyle='#0a0b12';c.fillRect(0,0,800,450);
        for(let i=0;i<60;i++){const x=(i*137+t*30)%800,y=(i*89+t*60)%450;c.fillStyle=`rgba(227,181,74,${0.1+0.1*Math.sin(t+i)})`;c.fillRect(x,y,2,2);}
        // ember particles
        for(let i=0;i<40;i++){const x=(i*97+t*80)%800,y=450-((t*40+i*30)%450);c.fillStyle=`rgba(200,80,44,${0.3*(1-y/450)})`;c.beginPath();c.arc(x,y,1.5,0,7);c.fill();}
        requestAnimationFrame(anim);})();}
    document.getElementById('titleMeta').textContent='A gold-box party RPG · '+Object.keys(MODULES).length+' modules · '+Object.keys(MAPS).length+' maps';
  }
  /* ================= campaign / assembly ================= */
  function campaignScreen(){
    showScreen('campaign');
    const tabs=document.getElementById('campaignTabs');tabs.innerHTML='';
    const cards=document.getElementById('campaignCards');cards.innerHTML='';
    for(const camp of CAMPAIGNS){
      const b=document.createElement('button');b.className='camp-card';
      b.innerHTML=`<b>${camp.name}</b><span>${camp.desc||''}</span><em>${camp.modules.length} modules</em>`;
      b.onclick=()=>{G.campaign=camp.id;assemblyScreen();};
      cards.appendChild(b);
    }
  }
  let asmSel=null,asmParty=[];
  function assemblyScreen(){
    showScreen('assembly');
    asmSel=null;asmParty=[];
    renderAssembly();
  }
  function renderAssembly(){
    const camp=CAMPAIGNS.find(c=>c.id===G.campaign)||CAMPAIGNS[0];
    document.getElementById('asmTitle').textContent='Assemble Your Company — '+camp.name;
    document.getElementById('asmIntro').textContent=(MODULES[camp.modules[0]]||{}).intro||'The adventure begins.';
    const avail=[...PREGENS];
    const waiting=document.getElementById('asmWaiting');waiting.innerHTML='';
    for(const ch of avail){
      const used=asmParty.includes(ch.id);
      const card=document.createElement('div');card.className='pcard'+(asmSel===ch.id?' sel':'');
      const cv=document.createElement('canvas');cv.width=72;cv.height=72;
      Figures.portrait(cv,{kind:'pc',name:ch.name,race:ch.race,cls:ch.cls,lvl:ch.lvl,color:ch.color});
      card.appendChild(cv);
      card.insertAdjacentHTML('beforeend',`<div class="pc-nm">${ch.name}</div><div class="pc-sub">${Rules.RACES[ch.race].name} ${Rules.CLASSES[ch.cls].name} ${ch.lvl}</div><div class="pc-stats">HP ${ch.hp}/${ch.maxhp} · AC ${Rules.acOf(ch)}</div>`);
      card.onclick=()=>{asmSel=ch.id;renderAssembly();};
      waiting.appendChild(card);
    }
    const partyEl=document.getElementById('asmParty');partyEl.innerHTML='';
    asmParty.forEach((id,i)=>{
      const ch=avail.find(c=>c.id===id);if(!ch)return;
      const row=document.createElement('div');row.className='asm-row';
      row.innerHTML=`<span>${i+1}. ${ch.name} — ${Rules.CLASSES[ch.cls].name} ${ch.lvl}</span>`;
      const x=document.createElement('button');x.textContent='×';x.onclick=()=>{asmParty.splice(i,1);renderAssembly();};
      row.appendChild(x);partyEl.appendChild(row);
    });
    document.getElementById('asmCount').textContent=`(${asmParty.length}/6)`;
    // funds = sum of member gold + pooled
    const gold=asmParty.reduce((s,id)=>{const c=avail.find(c=>c.id===id);return s+(c?c.gold||0:0);},0);
    document.getElementById('asmFunds').textContent=`Company funds: ${gold} gp`;
    document.getElementById('btnBegin').disabled=asmParty.length<1;
  }
  function beginGame(){
    const camp=CAMPAIGNS.find(c=>c.id===G.campaign)||CAMPAIGNS[0];
    const avail=[...PREGENS];
    G.roster=asmParty.map(id=>{const c=avail.find(c=>c.id===id)||heroStash.find(c=>c.id===id);return c?JSON.parse(JSON.stringify(c)):null;}).filter(Boolean);
    G.gold=G.roster.reduce((s,c)=>s+(c.gold||0),0)+100;
    G.roster.forEach(c=>{Campaign.learnSpells(c);Campaign.refreshCasters(c);});
    G.module=camp.modules[0];
    G.time=8*60;G.flags={};
    Campaign.initQuests();
    G.screen='game';
    showScreen('game');
    const m=MODULES[G.module];
    const entry=m.hub||m.maps[0];
    Campaign.enterMap(entry);
    UI.log(`The saga begins: ${m.name}. ${m.intro||''}`,'warn');
    Journal.rumor();
    autosave();
  }
  /* ---- character creation ---- */
  function createHeroDialog(){
    const body=document.createElement('div');body.className='cols';
    body.innerHTML=`<div>
      <label>Name <input id="nhName" maxlength="20" value=""></label><br><br>
      <label>Race <select id="nhRace"></select></label><br><br>
      <label>Class <select id="nhCls"></select></label><br><br>
      <label>Alignment <select id="nhAlign"></select></label><br><br>
      <label>Scores <span id="nhScores"></span></label><br>
      <button id="nhRoll">Roll Scores</button>
    </div><div id="nhInfo"></div>`;
    const raceSel=body.querySelector('#nhRace'),clsSel=body.querySelector('#nhCls'),alSel=body.querySelector('#nhAlign');
    for(const r in Rules.RACES)raceSel.innerHTML+=`<option value="${r}">${Rules.RACES[r].name}</option>`;
    for(const a of Rules.ALIGNMENTS)alSel.innerHTML+=`<option>${a}</option>`;
    let scores=null;
    const roll=()=>{scores=Rules.rollScores(Rules.rng);paint();};
    function paint(){
      const race=raceSel.value,cls=clsSel.value;
      clsSel.innerHTML='';
      for(const c of Rules.RACES[race].cls){clsSel.innerHTML+=`<option value="${c}">${Rules.CLASSES[c].name}</option>`;}
      alSel.innerHTML='';for(const a of Rules.ALIGNMENTS)alSel.innerHTML+=`<option>${a}</option>`;
      body.querySelector('#nhScores').textContent=scores?`STR ${scores.str} DEX ${scores.dex} CON ${scores.con} INT ${scores.int} WIS ${scores.wis} CHA ${scores.cha}`:'—';
      body.querySelector('#nhInfo').innerHTML=`<p><b>${Rules.CLASSES[clsSel.value].name}</b> — ${Rules.CLASSES[clsSel.value].grp}. Prime: ${(Rules.CLASSES[clsSel.value].prime||[]).join(', ')}.</p><p>${Rules.RACES[race].notes||''}</p>`;
    }
    raceSel.onchange=paint;clsSel.onchange=paint;body.querySelector('#nhRoll').onclick=roll;
    raceSel.value='human';paint();roll();
    UI.modal({title:'Create Hero',body,wide:true,actions:[
      {label:'Cancel'},
      {label:'Create',primary:true,fn:()=>{
        const name=body.querySelector('#nhName').value.trim()||'Nameless';
        const ch=Rules.makeCharacter({name,race:raceSel.value,cls:clsSel.value,align:alSel.value,scores});
        ch.gold=Rules.roll(Rules.CLASSES[ch.cls].gold||'1d4');
        Campaign.learnSpells(ch);Campaign.refreshCasters(ch);
        asmParty.push(ch.id);stashHero(ch);
        UI.log(ch.name+' joins the company!','good');
        renderAssembly();
      }},
    ]});
  }
  const heroStash=[];
  function stashHero(ch){heroStash.push(ch);}
  /* ================= in-game UI ================= */
  function bindUI(){
    document.getElementById('btnNew').onclick=()=>{newGameState();campaignScreen();};
    document.getElementById('btnContinue').onclick=()=>{if(loadGame('auto'))enterLoaded();else UI.log('No save found.','bad');};
    document.getElementById('btnLoad').onclick=loadDialog;
    document.getElementById('btnHelpTitle').onclick=()=>UI.helpDialog();
    document.getElementById('btnCampBack').onclick=()=>showTitle();
    document.getElementById('btnAssemble').onclick=()=>assemblyScreen();
    document.getElementById('btnAsmBack').onclick=()=>campaignScreen();
    document.getElementById('btnBegin').onclick=beginGame;
    document.getElementById('btnAdd').onclick=()=>{if(asmSel&&!asmParty.includes(asmSel)&&asmParty.length<6){asmParty.push(asmSel);asmSel=null;renderAssembly();}};
    document.getElementById('btnRemove').onclick=()=>{if(asmSel){asmParty=asmParty.filter(i=>i!==asmSel);asmSel=null;renderAssembly();}};
    document.getElementById('btnNewHero').onclick=createHeroDialog;
    document.getElementById('btnDelHero').onclick=()=>{if(asmSel){asmParty=asmParty.filter(i=>i!==asmSel);asmSel=null;renderAssembly();}};
    document.getElementById('hudParty').onclick=()=>UI.toggleParty();
    document.getElementById('partyClose').onclick=()=>UI.toggleParty(false);
    // restore party drawer pref
    try{if(localStorage.getItem('emberfall.party')==='1')UI.toggleParty(true);}catch(e){}
  }
  function exploreCommands(){
    return [
      {label:'Forward',hint:'W/↑',fn:()=>moveForward()},
      {label:'Back',hint:'S/↓',fn:()=>moveBack()},
      {label:'Left',hint:'A/←',fn:()=>turn(-1)},
      {label:'Right',hint:'D/→',fn:()=>turn(1)},
      {label:'Strafe L',hint:'Q',fn:()=>strafe(-1)},
      {label:'Strafe R',hint:'E',fn:()=>strafe(1)},
      {label:'Search',hint:'F',fn:()=>search()},
      {label:'Rest',hint:'R',fn:()=>rest()},
      {label:'Map',fn:()=>MapUI.openFull()},
      {label:'Journal',fn:()=>Journal.open()},
      {label:'Bestiary',fn:()=>Bestiary.open()},
      {label:'Menu',fn:()=>UI.menuDialog()},
    ];
  }
  function wildsCommands(){return Overland.commands();}
  /* ================= dungeon movement ================= */
  function map(){return MAPS[G.map];}
  function cellAt(x,y){return Rules.cellAt(map(),x,y);}
  function passable(x,y){return Rules.passable(map(),x,y,G.mods[G.map]);}
  function tryStep(dx,dy){
    const g=G;const m=map();if(!m)return;
    const nx=g.x+dx,ny=g.y+dy;
    if(nx<0||ny<0||nx>=m.grid[0].length||ny>=m.grid.length)return false;
    if(!passable(nx,ny)){
      // door 'D' is passable; 'L' locked; 'S' secret — handled inside passable via mods
      const c=Rules.cellAt(m,nx,ny);const mod=G.mods[G.map][nx+','+ny];
      if(c==='L'&&!mod){
        if(m.keyItem&&partyHasItem(m.keyItem)){G.mods[G.map][nx+','+ny]='D';UI.log('The '+item(m.keyItem).n+' turns the lock!','good');}
        else{UI.log(m.lockText||'A locked door bars the way.','dim');return false;}
      }
      if(c==='S'&&!mod){UI.log('A wall of stone.','dim');return false;}
      if(c==='#'||c==='H'||c==='B'||c==='^'||c==='~'){UI.log('You cannot pass.','dim');return false;}
    }
    g.x=nx;g.y=ny;
    // reveal
    revealAround();
    onEnterCell();
    return true;
  }
  function moveForward(){const d=DIRV[G.dir];tryStep(d[0],d[1]);}
  function moveBack(){const d=DIRV[G.dir];tryStep(-d[0],-d[1]);}
  function turn(n){G.dir=(G.dir+n+4)%4;refreshView();}
  function strafe(n){const d=DIRV[(G.dir+n+4)%4];tryStep(d[0],d[1]);}
  /* ================= cell events ================= */
  function onEnterCell(){
    const g=G;const m=map();if(!m)return;
    const key=g.x+','+g.y;
    // stairs
    const st=m.stairs&&m.stairs[key];
    if(st){takeStairs(st);return;}
    // '<' '>' generic stairs fallback
    const c=Rules.cellAt(m,g.x,g.y);
    if(c==='<'||c==='>'){followGenericStairs(c);return;}
    // services & locs
    if(/\d/.test(c)&&m.locs&&m.locs[c]){Campaign.serviceForChar(c);return;}
    if('IVNTGAEBRPEH'.includes(c)){if(Campaign.serviceForChar(c))return;}
    // map events
    if(m.ev&&m.ev[c]&&!g.usedEvents[G.map][key]){triggerEvent(c);return;}
    // ground loot
    const pile=(g.ground[G.map]||{})[key];
    if(pile&&pile.length){pickupGround(key);return;}
    // trap?
    if(m.traps){const t=m.traps[key]||m.traps[c];if(t&&!g.usedEvents[G.map]['trap'+key]){g.usedEvents[G.map]['trap'+key]=1;springTrap(t);}}
    // wander encounters
    if(m.wander&&Rules.rng()<0.02){wanderEncounter();}
    // one-time map guardian encounter
    if(m.enc&&m.enc.mons&&!g.flags['enc_'+G.map]){g.flags['enc_'+G.map]=1;if(m.enc.text)UI.log(m.enc.text,'warn');startDungeonFight(m.enc.mons,m.enc.text);}
    passTimeSmall();
  }
  function passTimeSmall(){passTime(5);}
  function takeStairs(st){
    const g=G;
    if(typeof st==='string'){Campaign.enterMap(st);return;}
    if(st.to){
      const target=st.to;
      Campaign.enterMap(target);
      if(st.x!=null){g.x=st.x;g.y=st.y;}
    }
  }
  function followGenericStairs(c){
    // find module order: dungeon maps in module.maps; '<' goes up, '>' down
    const g=G;const mod=MODULES[g.module];if(!mod)return;
    const idx=mod.maps.indexOf(g.map);
    if(c==='>'&&idx>=0&&idx<mod.maps.length-1){Campaign.enterMap(mod.maps[idx+1],'down');}
    else if(c==='<'&&idx>0){Campaign.enterMap(mod.maps[idx-1],'up');}
    else if(c==='<'&&idx===0){ /* town exit handled by stairs dict usually */ }
  }
  function triggerEvent(c){
    const g=G;const m=map();const ev=m.ev[c];
    g.usedEvents[G.map][g.x+','+g.y]=1;
    if(ev.text)UI.log(ev.text,'dim');
    if(ev.chest){openChest(ev.chest,c);return;}
    if(ev.item){Combat.addLoot(g,{t:'i',i:ev.item});UI.log('You take '+item(ev.item).n+'.','good');return;}
    if(ev.enc){if(ev.enc.text)UI.log(ev.enc.text,'warn');startDungeonFight(ev.enc.mons,ev.enc.text);return;}
    if(ev.text)UI.log(ev.text,'dim');
  }
  function openChest(chestDef,c){
    const g=G;
    const gold=chestDef.gold?Rules.roll(chestDef.gold):0;
    const items=(chestDef.items||[]).slice();
    if(chestDef.text)UI.log(chestDef.text,'dim');
    if(gold)g.gold+=gold;
    items.forEach(i=>Combat.addLoot(g,{t:'i',i}));
    UI.log(`Chest: +${gold} gp, ${items.length} item(s).`,'good');
    if(chestDef.quest)Journal.progress(chestDef.quest,1);
  }
  function pickupGround(key){
    const g=G;const pile=g.ground[G.map][key];
    pile.forEach(id=>Combat.addLoot(g,{t:'i',i:id}));
    UI.log('You pick up '+pile.length+' item(s).','good');
    delete g.ground[G.map][key];
  }
  function springTrap(t){
    const g=G;
    if(t.dmg){const dmg=Rules.roll(t.dmg);g.roster.forEach(c=>{if(!c.dead)c.hp=Math.max(0,c.hp-dmg);});UI.log('Trap! The party takes '+dmg+' damage.','bad');}
    if(t.text)UI.log(t.text,'bad');
    if(t.poisongas)g.roster.forEach(c=>{if(!c.dead&&Rules.rng()<0.5)c.poison={ticks:8,dmg:'1d4'};});
  }
  function startDungeonFight(mons,text){
    const foes=(mons||[]).map(m=>({id:m[0],n:m[1]||'1d4'}));
    if(!foes.length)return;
    // scale: party level vs monster xp — cap count
    Combat.start(G.x,G.y,foes,{gold:Rules.roll('3d6')*Math.max(1,Math.round(Campaign.partyAvgLvl())),loot:null});
  }
  function wanderEncounter(){
    const g=G;const m=map();
    if(!m.wander||!m.wander.length)return;
    let tot=0;for(const w of m.wander)tot+=w[2]||10;
    let r=Rules.rng()*tot;let pick=m.wander[0];
    for(const w of m.wander){r-=(w[2]||10);if(r<=0){pick=w;break;}}
    startDungeonFight([[pick[0],pick[1]||'1d4']]);
  }
  function search(){
    const g=G;const m=map();
    // reveal secret doors adjacent
    let found=false;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const nx=g.x+dx,ny=g.y+dy;
      if(Rules.cellAt(m,nx,ny)==='S'){
        const thief=g.roster.find(c=>c.cls==='T');
        const sk=thief?Rules.thiefSkill(thief,'find'):10;
        if(Rules.roll('1d20')<=sk+10||!thief){G.mods[G.map][nx+','+ny]='.';found=true;UI.log('You find a secret door!','good');}
      }
      if(Rules.cellAt(m,nx,ny)==='L'&&g.flags['key_'+G.map]){G.mods[G.map][nx+','+ny]='D';found=true;UI.log('You unlock a door.','good');}
    }
    if(!found)UI.log('You find nothing.','dim');
    passTimeSmall();
  }
  function rest(){
    const g=G;
    if(g.screen==='wilds'){Overland.restWild();return;}
    // dungeon rest: risky
    if(Rules.rng()<0.15){UI.log('You are set upon in your sleep!','warn');wanderEncounter();return;}
    restHours(8);
  }
  function restHours(h){
    const g=G;
    g.time+=h*60;
    // restore hp slowly (half), spells
    g.roster.forEach(c=>{if(!c.dead){c.hp=Math.min(c.maxhp,c.hp+Math.ceil(c.maxhp*0.5));if(c.layUsed)c.layUsed=false;}});
    g.roster.forEach(c=>Campaign.refreshCasters(c));
    Campaign.tickStatuses();
    UI.log('The party rests for '+h+' hours.','dim');
    refreshUI();
  }
  function restInn(){
    const g=G;const party=Campaign.partyChars();
    const cost=party.length;
    if(g.gold<cost)return;
    g.gold-=cost;
    party.forEach(c=>{c.hp=c.maxhp;c.layUsed=false;if(c.poison)c.poison=null;});
    g.roster.forEach(c=>Campaign.refreshCasters(c));
    g.time+=10*60;
    UI.log('A restful night. The party wakes restored.','good');
    refreshUI();
  }
  function passTime(min){
    const g=G;g.time+=min;
    const wasNight=g.night;g.night=(Rules.fmtTime(g.time).hour>=18||Rules.fmtTime(g.time).hour<6);
    Campaign.tickStatuses();
    if(g.time%1440<min)autosave();
    refreshUI();
  }
  function unlockNearby(bx,by){
    const g=G;const m=map();
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      if(Rules.cellAt(m,bx+dx,by+dy)==='L'){G.mods[G.map][bx+dx+','+(by+dy)]='D';UI.log('A lock clicks open.','good');}
    }
  }
  /* ================= rendering ================= */
  function refreshView(){
    const g=G;const m=map();if(!m)return;
    if(g.screen==='wilds'){Overland.drawMap();return;}
    if(g.screen==='combat'){Combat.render&&Combat.render();return;}
    // dungeon raycast
    View3D.prepare(m,g.mods[g.map],g.seen[g.map]);
    buildSprites();
    View3D.render(g.x,g.y,g.dir,{});
    const mm=document.getElementById('minimap');
    if(mm){mm.width=150;mm.height=110;View3D.minimap(mm,m,g.x,g.y,g.dir,g.seen[g.map],g.mods[g.map]);}
  }
  function buildSprites(){
    const g=G;const m=map();const sprites=[];
    const seen=g.seen[G.map]||[];
    const w=m.grid[0].length;
    // monsters visible in seen cells
    for(let y=0;y<m.grid.length;y++)for(let x=0;x<w;x++){
      const idx=y*w+x;if(!seen[idx])continue;
      const ch=m.grid[y][x];
      if(ch>='a'&&ch<='z'){
        const mon=MONSTERS[ch];if(!mon)continue;
        const img=Figures.figTex({fig:mon.fig||'humanoid',id:'m'+ch,color:'#9a8a7a'},48);
        sprites.push({x:x+0.5,y:y+0.5,img,hp:mon.hp?Rules.roll(mon.hp):10,maxhp:10});
      } else if(ch==='y'||m.ev&&m.ev[ch]&&m.ev[ch].chest){
        sprites.push({x:x+0.5,y:y+0.5,draw:c=>{c.fillStyle='#8a6a3a';c.fillRect(-6,-6,12,10);c.fillStyle='#e3b54a';c.fillRect(-2,-2,4,3);}});
      } else if(m.stairs&&m.stairs[x+','+y]){
        sprites.push({x:x+0.5,y:y+0.5,draw:c=>{c.fillStyle='#9a7fd4';c.beginPath();c.moveTo(0,-8);c.lineTo(6,4);c.lineTo(-6,4);c.closePath();c.fill();}});
      }
    }
    View3D.setSprites(sprites);
  }
  function revealAround(){
    const g=G;const m=map();if(!m)return;
    const w=m.grid[0].length;const seen=g.seen[G.map];
    // simple FOV: mark cells within radius 8 and line-of-sight-ish (skip walls block)
    const R=8;
    for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){
      const nx=g.x+dx,ny=g.y+dy;
      if(nx<0||ny<0||nx>=w||ny>=m.grid.length)continue;
      if(dx*dx+dy*dy>R*R)continue;
      const d=Math.max(Math.abs(dx),Math.abs(dy));
      // raycast-ish: check midpoint cells aren't walls
      let blocked=false;
      for(let t=1;t<d;t++){
        const ix=Math.round(g.x+dx*t/d),iy=Math.round(g.y+dy*t/d);
        const c=Rules.cellAt(m,ix,iy);
        if('#H^~B'.includes(c)){blocked=true;break;}
      }
      if(!blocked)seen[ny*w+nx]=1;
    }
  }
  function loop(){
    if(G&&G.screen!=='title'&&G.screen!=='combat')refreshView();
    requestAnimationFrame(loop);
  }
  /* ================= HUD ================= */
  function refreshUI(){
    if(!G)return;
    const g=G;
    document.getElementById('hudLoc').textContent=g.map?(map().name||g.map):'';
    document.getElementById('hudTime').textContent=Rules.fmtTime(g.time);
    document.getElementById('hudGold').textContent=g.gold+' gp';
    document.getElementById('hudAhead').textContent=g.module?(MODULES[g.module]?MODULES[g.module].name:'') : '';
    UI.partyList(g.roster,g.sheetFor);
    // canvas visibility
    const wild=g.screen==='wilds',combat=g.screen==='combat';
    document.getElementById('view3d').classList.toggle('hidden',wild||combat);
    document.getElementById('overCanvas').classList.toggle('hidden',!wild);
    document.getElementById('combatCanvas').classList.toggle('hidden',!combat);
    // command bar per screen
    if(combat){UI.cmdbar([{label:'Auto',hint:'Q',fn:()=>Combat.autoBattle()},{label:'End Turn',hint:'Space',fn:()=>{const u=Combat.B()&&Combat.B().active;if(u){u.acted=true;Combat.advance();}}},{label:'Flee',fn:()=>{const u=Combat.B()&&Combat.B().active;if(u){u.acted=true;/* flee via prompt */}}}]);}
    else if(wild){UI.cmdbar(wildsCommands());}
    else if(g.screen==='game'||g.screen==='dungeon'){UI.cmdbar(exploreCommands());}
    if(wild)Overland.drawMap();
  }
  /* ================= input ================= */
  function bindKeys(){
    window.addEventListener('keydown',e=>{
      if(UI.anyModal())return;
      const k=e.key.toLowerCase();keys[k]=true;
      if(G.screen==='combat'){Combat.keyHandler(e);return;}
      if(G.screen!=='game'&&G.screen!=='dungeon'&&G.screen!=='wilds')return;
      if(k==='w'||k==='arrowup')moveForward();
      else if(k==='s'||k==='arrowdown')moveBack();
      else if(k==='a'||k==='arrowleft')turn(-1);
      else if(k==='d'||k==='arrowright')turn(1);
      else if(k==='q')strafe(-1);
      else if(k==='e')strafe(1);
      else if(k==='z'){G.dir=(G.dir+3)%4;} // reverse turn? no—z unused
      else if(k==='c'){/* strafe handled by q/e */}
      else if(k==='f')search();
      else if(k==='r')rest();
      else if(k==='p')UI.toggleParty();
      else if(k==='m')MapUI.openFull();
      else if(k==='j')Journal.open();
      else if(k==='b')Bestiary.open();
      else if(k==='escape')UI.menuDialog();
      else if(k==='h')UI.helpDialog();
      else if(g.screen==='wilds'){
        if(k==='n'||k==='w'){} // wilds uses WASD via navpad; add arrows
        if(k==='arrowup')Overland.move('n');
        if(k==='arrowdown')Overland.move('s');
        if(k==='arrowleft')Overland.move('w');
        if(k==='arrowright')Overland.move('e');
      }
      e.preventDefault();
    });
    window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
  }
  function bindCanvas(){
    const cv=document.getElementById('view3d');
    cv.addEventListener('click',e=>{
      if(!G||G.screen==='combat'){if(G&&G.screen==='combat')combatClick(e);return;}
      // dungeon: click = move toward? simple: forward
      moveForward();
    });
    const cc=document.getElementById('combatCanvas');
    cc.addEventListener('click',combatClick);
  }
  function combatClick(e){
    // map click coords to battle tile (approximate: canvas center is origin)
    const r=e.target.getBoundingClientRect();
    const cx=r.width/2,cy=r.height/2;
    const dx=e.clientX-r.left-cx,dy=e.clientY-r.top-cy;
    const scale=r.height/14; // 14 rows
    const tx=Math.round(7+dx/scale),ty=Math.round(5+dy/scale);
    Combat.clickTile(tx,ty);
  }
  /* ================= save / load ================= */
  function serialize(){
    const g=G;
    // strip runtime refs
    const roster=g.roster.map(c=>{const{_battle,...rest}=c;return rest;});
    return JSON.stringify({v:1,screen:'dungeon',module:g.module,map:g.map,x:g.x,y:g.y,dir:g.dir,
      gold:g.gold,time:g.time,roster,inv:g.inv,quests:g.quests,rumors:g.rumors,
      seen:g.seen,mods:g.mods,ground:g.ground,usedEvents:g.usedEvents,flags:g.flags,
      monstersSeen:g.monstersSeen,monsterKills:g.monsterKills,campaign:G.campaign});
  }
  function saveGame(slot){
    if(!G)return;
    try{localStorage.setItem(SAVE_PREFIX+(slot||'auto'),serialize());UI.log('Game saved.','good');}
    catch(e){UI.log('Save failed: '+e.message,'bad');}
  }
  function autosave(){if(G&&G.screen!=='title')saveGame('auto');}
  function loadGame(slot){
    try{
      const raw=localStorage.getItem(SAVE_PREFIX+slot);if(!raw)return false;
      const d=JSON.parse(raw);
      if(G===null)G=newGameState();
      Object.assign(G,d);G.screen='game';G.combat=null;
      Campaign.initQuests();
      return true;
    }catch(e){UI.log('Load failed: '+e.message,'bad');return false;}
  }
  function enterLoaded(){
    showScreen('game');
    const m=MAPS[G.map];
    if(m&&m.overland){Overland.drawMap();}
    else{View3D.prepare(m,G.mods[G.map],G.seen[G.map]);refreshView();}
    UI.cmdbar(exploreCommands());
    refreshUI();
    UI.log('Welcome back.','dim');
  }
  function loadDialog(){
    const slots=['auto','1','2','3'];
    const body=document.createElement('div');
    const acts=[];
    for(const s of slots){
      let info='empty';
      try{const raw=localStorage.getItem(SAVE_PREFIX+s);if(raw){const d=JSON.parse(raw);info=`Day ${Math.floor(d.time/1440)+1} — ${d.roster.length} heroes — ${d.gold} gp`;}}catch(e){}
      acts.push({label:`${s==='auto'?'Auto':s}: ${info}`,disabled:info==='empty',fn:()=>{if(loadGame(s)){enterLoaded();UI.closeTop();}}});
    }
    acts.push({label:'Cancel',primary:true});
    UI.modal({title:'Load Game',body,actions:acts});
  }
  function saveDialog(){
    const acts=[{label:'Save to Auto',fn:()=>saveGame('auto')},
      {label:'Slot 1',fn:()=>saveGame('1')},{label:'Slot 2',fn:()=>saveGame('2')},{label:'Slot 3',fn:()=>saveGame('3')},
      {label:'Cancel',primary:true}];
    UI.modal({title:'Save Game',actions:acts});
  }
  /* ================= misc ================= */
  function partyAvgLvl(){return Campaign.partyAvgLvl();}
  function partyHasItem(id){const g=G;return g.roster.some(c=>(c.inv||[]).concat(Object.values(c.eq||{})).includes(id))||((g.inv||[]).indexOf(id)>=0);}
  function quitToTitle(){G=newGameState();showTitle();}
  function travelDialog(){Overland.travelDialog();}
  function cycleOrder(id){const i=G.roster.findIndex(c=>c.id===id);if(i>=0){const c=G.roster.splice(i,1)[0];G.roster.push(c);refreshUI();}}
  function checkWin(){
    const g=G;const mod=MODULES[g.module];
    if(mod&&mod.final&&g.quests[mod.final]&&g.quests[mod.final].state==='done'){
      UI.log('— '+mod.victory+' —','good');
      if(mod.next){UI.modal({title:'Module Complete',body:`<p>${mod.victory}</p><p>Continue to ${MODULES[mod.next].name}?</p>`,actions:[{label:'Continue',primary:true,fn:()=>Campaign.travelToModule(mod.next)},{label:'Stay'}]});}
    }
  }
  /* boot on DOM ready */
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  return {get G(){return G;},set G(v){G=v;},
    newGameState,showTitle,campaignScreen,assemblyScreen,beginGame,createHeroDialog,
    exploreCommands,wildsCommands,moveForward,moveBack,turn,strafe,search,rest,restInn,restHours,
    passTime,partyAvgLvl,partyHasItem,revealAround,refreshUI,refreshView,saveGame,autosave,loadGame,loadDialog,saveDialog,
    enterLoaded,quitToTitle,travelDialog,cycleOrder,checkWin,item,boot};
})();
