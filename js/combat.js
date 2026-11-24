/* Emberfall — combat.js : tactical battle engine */
'use strict';
const Combat = (()=>{
  const G=()=>Game.G;
  let B=null;

  /* foes: [{id:monId, n:diceExpr|'1d1'}] or [{mon:monId}] — expanded to units */
  function start(x,y,foes,opts){
    opts=opts||{};
    const g=G();
    B={x,y,ret:{x:g.x,y:g.y},turn:0,active:null,units:[],round:0,over:false,opts,foes:foes||[]};
    B.grid=Array.from({length:10},()=>Array(14).fill('.'));
    for(let i=0;i<14;i++){B.grid[0][i]='#';B.grid[9][i]='#';}
    for(let j=0;j<10;j++){B.grid[j][0]='#';B.grid[j][13]='#';}
    const nObs=2+Math.floor(Rules.rng()*3);
    for(let i=0;i<nObs;i++){const ox=3+Math.floor(Rules.rng()*8),oy=2+Math.floor(Rules.rng()*6);B.grid[oy][ox]='#';}
    // party units
    g.roster.filter(c=>!c.dead).forEach((c,i)=>{
      const u={kind:'pc',ref:c,x:1,y:1+Math.min(i*2,7),side:'party',acted:false,
        hp:Math.max(0,c.hp),maxhp:c.maxhp,ac:Rules.acOf(c),thac0:Rules.thac0(c)};
      c._battle=u; B.units.push(u);
    });
    // expand foe entries
    let fi=0;
    for(const f of foes){
      const mon=MONSTERS[f.id||f.mon]; if(!mon)continue;
      const cnt=typeof f.n==='string'?Rules.roll(f.n):Math.max(1,f.n||1);
      for(let k=0;k<cnt;k++){
        const hp=Rules.roll(mon.hp||mon.hd||'1d4');
        B.units.push({kind:'mon',ref:mon,x:12,y:1+((fi*2)%7),side:'foe',acted:false,
          hp,maxhp:hp,ac:mon.ac,thac0:mon.thac0||15,n:mon.n});
        fi++;
      }
    }
    if(!B.units.some(u=>u.side==='foe')){ UI.log('No enemies appear.','dim'); end(); return null; }
    B.queue=B.units.slice().sort((a,b)=>{
      const da=a.kind==='pc'?(a.ref.dex||10):(10+(a.ref.mv||6));
      const db=b.kind==='pc'?(b.ref.dex||10):(10+(b.ref.mv||6));
      return db-da;
    });
    g.screen='combat'; g.combat=B;
    UI.log('Battle begins!','warn');
    Bestiary&&Bestiary.markSeen&&foes.forEach(f=>Bestiary.markSeen(f.id||f.mon));
    advance();
    return B;
  }
  function advance(){
    const g=G(); if(!B||B.over)return;
    let guard=0;
    while(guard++<400){
      const u=B.queue[B.turn%B.queue.length];
      if(!u.acted&&u.hp>0&&!u.fled){B.active=u;select(u);return;}
      B.turn++;
      if(B.turn%B.queue.length===0){B.round=(B.round||0)+1;B.units.forEach(u=>u.acted=false);
        UI.log('— Round '+B.round+' —','dim');}
    }
    checkEnd();
  }
  function select(u){
    B.active=u; render();
    if(u.kind==='mon'){ if(!u.held) setTimeout(()=>monsterAct(u),300); }
    else if(u.hp>0){ playerPrompt(u); }
  }
  function refreshCaster(c){
    // recompute mem from prep/book and slots
    const slots=Rules.slotTable(c); if(!slots)return;
    const lvl=Rules.casterLevel(c);
    if(!lvl)return;
    c.mem=c.mem||{};
    if(c.cls==='M'){
      // mem = prepared counts
      c.mem={};
      for(const id in (c.prep||{})){const sp=SPELLS[id];if(sp&&sp.l<=lvl)c.mem[id]=c.prep[id];}
    } else {
      // cleric/paladin: each known spell castable up to its level's slot count
      const nm={};
      for(const id of (c.book||[])){const sp=SPELLS[id];if(!sp)continue;
        const cap=slots[sp.l-1]||0; if(cap>0)nm[id]=cap;}
      c.mem=nm;
    }
  }
  /* ---------- prompts ---------- */
  function playerPrompt(u){
    const c=u.ref;
    const dead=c.dead||c.hp<=0;
    const acts=[];
    if(dead){UI.log(c.name+' is down!','bad');u.acted=true;advance();return;}
    acts.push({label:'Move',primary:true,fn:()=>{B.moveMode=u;UI.closeTop();UI.log(c.name+': click a reachable tile (Esc cancels).','dim');}});
    acts.push({label:'Attack',disabled:!nearestFoe(u,2),fn:()=>attackNearest(u)});
    const casters=['M','C','P'].includes(c.cls);
    if(casters&&Object.keys(c.mem||{}).some(id=>(c.mem[id]||0)>0))acts.push({label:'Cast',fn:()=>castMenu(u)});
    acts.push({label:'Item',fn:()=>itemMenu(u)});
    if(c.cls==='C'&&c.lvl>=1&&(c.layUsed||true)){acts.push({label:'Lay on Hands',fn:()=>layHands(u)});}
    if(c.cls==='T'){acts.push({label:'Pick Locks',fn:()=>thiefAction(u,'pick')});acts.push({label:'Hide',fn:()=>thiefAction(u,'hide')});acts.push({label:'Move Silent',fn:()=>thiefAction(u,'move')});}
    if(c.cls==='R'){acts.push({label:'Volley',fn:()=>volley(u)});if(c.lvl>=8)acts.push({label:'Hunt',fn:()=>hunt(u)});}
    acts.push({label:'Wait',fn:()=>{u.acted=true;advance();}});
    acts.push({label:'Flee',fn:()=>flee()});
    UI.modal({title:`${c.name}'s turn`,body:`<p>HP ${Math.max(0,u.hp)}/${u.maxhp} · AC ${u.ac} · THAC0 ${u.thac0}</p>`,actions:acts});
  }
  function nearestFoe(u,range){return B.units.filter(v=>v.side==='foe'&&v.hp>0).sort((a,b)=>dist(a,u)-dist(b,u))[0];}
  function dist(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);}
  /* ---------- movement ---------- */
  function bfsRange(u){
    const cls=Rules.CLASSES[u.ref.cls];
    let range=Rules.RACES[u.ref.race].mv; if(u.ref.fx&&u.ref.fx.speed)range*=2;
    range=Math.min(range,12);
    const seen=new Map();const q=[[u.x,u.y,0]];seen.set(u.x+','+u.y,0);
    while(q.length){const [x,y,d]=q.shift();if(d>=range)continue;
      for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;
        if(nx<1||ny<1||nx>12||ny>8||seen.has(k))continue;
        if(B.grid[ny][nx]==='#')continue;
        if(B.units.some(v=>v!==u&&v.x===nx&&v.y===ny&&v.hp>0&&!v.fled))continue;
        seen.set(k,d+1);q.push([nx,ny,d+1]);}}
    return seen;
  }
  function tryMove(u,tx,ty){
    const range=bfsRange(u);const k=tx+','+ty;
    if(!range.has(k))return false;
    u.x=tx;u.y=ty;B.moveMode=null;UI.closeTop();
    // opportunity: if ended adjacent to foe, allow attack prompt again? mark acted
    u.acted=true; advance(); return true;
  }
  /* ---------- attacks ---------- */
  function attack(att,def){
    const isPC=att.kind==='pc';
    const ch=isPC?att.ref:null;
    let ws=null;
    if(isPC){ws=Rules.weaponStats(ch,'melee');}
    const witem=isPC?item(ch.eq.missile||ch.eq.melee):null;
    const roll=Rules.roll('1d20');
    const hitBonus=isPC?(ws.toHit||0):0;
    // descending THAC0/AC: hit if d20 <= THAC0 - AC - to-hit bonus
    const needed=att.thac0-def.ac-hitBonus;
    const hit=roll<=needed;
    // natural 20 always hits, natural 1 always misses
    const nat20=roll===20,nat1=roll===1;
    if(nat1||(hit===false&&!nat20)){
      UI.log(`${isPC?ch.name:(att.ref.n||'Foe')} misses ${def.kind==='pc'?def.ref.name:def.ref.n||'foe'}.`,'dim');
      return false;
    }
    // damage
    let dmg=0,dice=isPC?(ws.dmg||'1d4'):(att.ref.atk&&att.ref.atk[0]?att.ref.atk[0][0]:'1d4');
    if(isPC&&witem&&witem.thrown){}
    dmg=Rules.roll(dice)+(isPC?(ws.dmgMod||0):0);
    // magic fx
    if(isPC){const it=item(ch.eq.melee);if(it&&it.fx){if(it.fx.dmg)dmg+=it.fx.dmg;}}
    dmg=Math.max(1,dmg);
    // vorpal/decap on nat20
    applyDamage(def,dmg,att);
    if(nat20&&isPC){const it=item(ch.eq.melee);if(it&&it.fx&&it.fx.vorpal){def.hp=0;UI.log('Vorpal hit!','warn');}}
    if(isPC&&ch.spec==='longsword'&&dice==='1d8'){}
    // lifedrinker
    if(isPC){const it=item(ch.eq.melee);if(it&&it.fx&&it.fx.lifedrain)ch.hp=Math.min(ch.maxhp,ch.hp+1);}
    UI.log(`${isPC?ch.name:(att.ref.n||'Foe')} hits ${def.kind==='pc'?def.ref.name:def.ref.n||'foe'} for ${dmg}.`,isPC?'good':'bad');
    if(def.hp<=0){
      if(def.kind==='pc'){def.ref.dead=true;def.ref.lost=true;Bestiary&&Bestiary.markKill&&Bestiary.markKill(def.ref._lastMonId||'');UI.log(def.ref.name+' falls!','bad');}
      else{Bestiary&&Bestiary.markKill&&Bestiary.markKill(def.ref.id);UI.log((def.ref.n||'A monster')+' is slain!','good');giveXp(def);}
    }
    checkEnd(); return true;
  }
  function giveXp(unit){
    const g=G();const xp=unit.ref.xp||5;
    g.roster.filter(c=>!c.dead).forEach(c=>{c.xp+=xp;Campaign.checkLevel(c);});
  }
  function applyDamage(def,dmg,att){def.hp-=dmg;if(def.kind==='pc'&&def.ref){def.ref.hp=Math.max(0,def.hp);if(def.hp<=0){def.ref.dead=true;def.ref.lost=true;}}}
  function checkEnd(){
    const foes=B.units.filter(u=>u.side==='foe'&&u.hp>0);
    const party=B.units.filter(u=>u.side==='party');
    if(!foes.length){B.over=true;win();}
    else if(party.every(u=>u.hp<=0)){B.over=true;lose();}
  }
  function win(){
    const g=G();const o=B.opts;
    if(o.gold)g.gold+=o.gold;
    if(o.loot)for(const l of o.loot)addLoot(g,l);
    g.screen='dungeon';g.combat=null;
    UI.log('Victory!'+(o.gold?` +${o.gold} gp`:''),'good');
    const map=MAPS[g.map];
    g.x=Rules.clamp(B.ret.x,0,map.grid[0].length-1);g.y=Rules.clamp(B.ret.y,0,map.grid.length-1);
    View3D.prepare(map,g.mods[g.map],g.seen[g.map]);
    UI.cmdbar(Game.exploreCommands());Game.refreshUI();
  }
  function lose(){
    const g=G();
    const lost=Math.floor(g.gold*0.2);g.gold-=lost;
    // dead stay dead unless raised
    g.roster.forEach(c=>{if(c._battle&&c._battle.hp<=0){c.dead=true;c.lost=true;c.hp=0;}});
    g.screen='dungeon';g.combat=null;
    const map=MAPS[g.map];
    let sx=map.start?map.start.x:1,sy=map.start?map.start.y:1;
    g.x=sx;g.y=sy;
    View3D.prepare(map,g.mods[g.map],g.seen[g.map]);
    UI.log('The party is defeated and flees, losing '+lost+' gp.','bad');
    UI.cmdbar(Game.exploreCommands());Game.refreshUI();
  }
  function flee(){
    if(Rules.rng()<0.5){B.over=true;const g=G();g.screen='dungeon';g.combat=null;
      View3D.prepare(MAPS[g.map],g.mods[g.map],g.seen[g.map]);
      UI.log('The party escapes!','dim');UI.cmdbar(Game.exploreCommands());Game.refreshUI();
    }else{UI.log('Cannot escape!','bad');advance();}
  }
  /* ---------- monster AI ---------- */
  function monsterAct(u){
    if(B.over||B.active!==u)return;
    if(u.held){u.held--;if(u.held<=0)u.held=0;u.acted=true;render();advance();return;}
    const targets=B.units.filter(v=>v.side==='party'&&v.hp>0&&!v.fled);
    if(!targets.length)return;
    targets.sort((a,b)=>dist(a,u)-dist(b,u));
    const t=targets[0];const d=dist(t,u);
    const mon=u.ref;
    // ranged attack?
    const ranged=mon.ranged; // [weapon,dice]
    if(ranged&&d<=4&&d>1&&Rules.rng()<0.6){
      const roll=Rules.roll('1d20');const hit=roll<=(u.thac0-t.ac);
      if(hit){const dmg=Rules.roll(ranged[1]||'1d6');applyDamage(t,dmg,u);UI.log(`${mon.n} hits ${t.ref.name} for ${dmg} (ranged).`,'bad');}
      else UI.log(`${mon.n} misses.`,'dim');
      u.acted=true;checkEnd();render();advance();return;
    }
    if(d<=1){
      const roll=Rules.roll('1d20');
      const hit=roll<=(u.thac0-t.ac);
      if(hit){
        let dmg=0;const parts=[];
        for(const a of (mon.atk||[])){const times=a[1]||1;for(let i=0;i<times;i++){const r=Rules.roll(a[0]||'1d4');dmg+=r;parts.push(r);}}
        if(!mon.atk||!mon.atk.length)dmg=Rules.roll('1d4');
        applyDamage(t,Math.max(1,dmg),u);
        UI.log(`${mon.n} hits ${t.ref.name} for ${dmg}.`,'bad');
        if(mon.poison&&Rules.rng()<0.3){t.ref.poison={ticks:6,dmg:'1d4'};UI.log(t.ref.name+' is poisoned!','bad');}
      }else UI.log(`${mon.n} misses.`,'dim');
    }else{
      // step toward target
      const dx=Math.sign(t.x-u.x),dy=Math.sign(t.y-u.y);
      const nx=u.x+dx,ny=u.y+(Math.abs(t.y-u.y)>Math.abs(t.x-u.x)?dy:0);
      const tryMove=(x,y)=>{if(x>=1&&y>=1&&x<=12&&y<=8&&B.grid[y][x]!=='#'&&!B.units.some(v=>v!==u&&v.x===x&&v.y===y&&v.hp>0&&!v.fled)){u.x=x;u.y=y;return true;}return false;};
      if(!tryMove(nx,ny))tryMove(u.x+dx,u.y)||tryMove(u.x,u.y+dy);
      if(dist(t,u)<=1&&Rules.rng()<0.5){monsterAct(u);return;}
    }
    u.acted=true;checkEnd();render();if(!B.over)advance();
  }
  /* ---------- player combat actions ---------- */
  function attackNearest(u){
    const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0).sort((a,b)=>dist(a,u)-dist(b,u));
    if(!foes.length)return;
    const t=foes[0];
    if(dist(t,u)>1){UI.log('Target out of reach — move first.','dim');return;}
    const ch=u.ref; ch._lastMonId=t.ref.id;
    attack(u,t);u.acted=true;checkEnd();render();advance();
  }
  function rangedAttack(u,foe){
    // use missile weapon
    const ch=u.ref;const wid=ch.eq.missile;
    if(!wid){UI.log('No missile weapon.','dim');return;}
    const it=item(wid);if(!it||!it.missile){UI.log('Not a missile weapon.','dim');return;}
    const roll=Rules.roll('1d20');
    const dexMod=Rules.abilityMod(Rules.effScores(ch).dex);
    const hit=roll<=Rules.thac0(ch)-foe.ac+dexMod+1;
    if(hit){const dmg=Rules.roll(it.dmg||'1d6')+dexMod+((it.fx&&it.fx.dmg)||0);applyDamage(foe,Math.max(1,dmg),u);UI.log(`${ch.name} shoots ${foe.ref.n} for ${dmg}.`,'good');}
    else UI.log(`${ch.name} misses.`,'dim');
    u.acted=true;checkEnd();render();advance();
  }
  /* ---------- spells ---------- */
  function castMenu(u){
    const c=u.ref;const known=(c.book||[]).map(id=>SPELLS[id]).filter(Boolean);
    if(!known.length){UI.log('No spells known.','dim');return;}
    const acts=known.map(sp=>({label:`${sp.n} (L${sp.l}) — ${c.mem[sp.id]||0} left`,disabled:(c.mem[sp.id]||0)<=0,fn:()=>castSpell(u,sp)}));
    acts.push({label:'Cancel',primary:true});
    UI.modal({title:`${c.name} casts`,actions:acts});
  }
  function castSpell(u,sp){
    const c=u.ref;
    if((c.mem[sp.id]||0)<=0){UI.log('No uses left.','bad');return;}
    // targets
    const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0&&!v.fled);
    const allies=B.units.filter(v=>v.side==='party'&&v.hp>0);
    const tgtByType=t=>{
      if(sp.tgt==='enemy')return foes.sort((a,b)=>dist(a,u)-dist(b,u))[0]?[foes.sort((a,b)=>dist(a,u)-dist(b,u))[0]]:[];
      if(sp.tgt==='ally')return [allies.sort((a,b)=>a.hp/b.hp)[0]].filter(Boolean);
      if(sp.tgt==='self')return [u];
      if(sp.tgt==='party'||sp.tgt==='party')return allies;
      return foes; // area/cone/line -> all foes (simplified)
    };
    const targets=tgtByType();
    if(!targets.length){UI.log('No valid target.','dim');return;}
    c.mem[sp.id]--;
    UI.closeTop();
    applySpell(u,sp,targets);
    u.acted=true;checkEnd();render();advance();
  }
  function saveOk(def,casterLvl){
    // spell save index: 4 = spell; use target's save
    const roll=Rules.roll('1d20');
    return roll; // raw; compare vs target save in apply
  }
  function applySpell(u,sp,targets){
    const cas=u.ref;const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0&&!v.fled);
    const allies=B.units.filter(v=>v.side==='party'&&v.hp>0);
    const heal=n=>{for(const a of allies){a.hp=Math.min(a.maxhp,a.hp+n);if(a.ref)a.ref.hp=a.hp;}};
    const hitAll=(dmg,src)=>{for(const f of foes){if(f.hp>0)applyDamage(f,dmg,src||u);}};
    const lvl=Rules.casterLevel(cas)||cas.lvl||1;
    // heal spells
    if(sp.heal){heal(Rules.roll(sp.heal));UI.log(`${sp.n}: party healed.`,'good');return;}
    if(sp.healAllBut){for(const a of allies){const missing=a.maxhp-a.hp;a.hp=a.maxhp-Math.min(missing,Rules.roll(sp.healAllBut));if(a.ref)a.ref.hp=a.hp;}UI.log(`${sp.n}: wounds closed.`,'good');return;}
    if(sp.revive){const d=B.units.find(v=>v.kind==='pc'&&v.hp<=0);if(d){d.hp=Math.floor(d.maxhp/2);d.ref.dead=false;d.ref.lost=false;d.ref.hp=d.hp;UI.log(`${sp.n}: ${d.ref.name} rises!`,'good');}else UI.log('No one to raise.','dim');return;}
    if(sp.tgt==='self'){
      if(sp.ac){u.ac-=sp.ac;UI.log(`${sp.n}: AC improved.`,'good');}
      if(sp.invis){allies.forEach(a=>a.invis=99);UI.log(`${sp.n}: invisible!`,'good');}
      if(sp.haste){allies.forEach(a=>a.haste=5);UI.log(`${sp.n}: hastened!`,'good');}
      if(sp.str){const s=Rules.effScores(cas);cas._strBonus=(cas._strBonus||0)+Rules.roll(sp.str||'1d4');UI.log(`${sp.n}: stronger!`,'good');}
      if(sp.images){u.images=(u.images||0)+sp.images;UI.log(`${sp.n}: images!`,'good');}
      return;
    }
    if(sp.tgt==='party'){
      if(sp.haste){allies.forEach(a=>a.haste=5);UI.log(`${sp.n}: party hastened!`,'good');}
      if(sp.hit){allies.forEach(a=>a.hitBuff=(a.hitBuff||0)+sp.hit);UI.log(`${sp.n}: party blessed!`,'good');}
      if(sp.dmg){allies.forEach(a=>applyDamage(a,Rules.roll(sp.dmg),u));UI.log(`${sp.n}: party harmed!`,'bad');}
      return;
    }
    if(sp.tgt==='ally'){
      const t=targets[0];if(!t)return;
      if(sp.ac)t.ac-=sp.ac;
      if(sp.invis)t.invis=99;
      if(sp.hit)t.hitBuff=(t.hitBuff||0)+1;
      UI.log(`${sp.n} on ${t.ref.name||'ally'}.`,'good');return;
    }
    // enemy/area/cone/line
    const dmgDice=sp.dmg;
    if(dmgDice){
      let total=0;
      if(sp.count){for(let i=0;i<sp.count;i++)total+=Rules.roll(dmgDice);}
      else total=Rules.roll(dmgDice);
      // per-level scaling for small dice
      if(/^1d/.test(dmgDice)){total+= (lvl-1)*(sp.per||0);}
      hitAll(total,u);
      UI.log(`${sp.n} deals ${total} damage!`,'warn');
    }
    if(sp.hd){ // sleep: HD worth
      const sleepHp=Rules.roll(sp.hd)*4;
      foes.slice().sort((a,b)=>a.hp-b.hp).forEach(f=>{if(f.hp<=sleepHp){f.hp=0;f.asleep=true;UI.log(f.ref.n+' sleeps!','good');}});
    }
    if(sp.hold){targets.forEach(f=>{if(f.hp>0){f.held=parseInt((sp.dur||'1d4 rounds').match(/\d+/)[0]||2);UI.log(f.ref.n+' is held!','good');}});}
    if(sp.flee){targets.forEach(f=>{if(f.hp>0){f.fled=true;UI.log(f.ref.n+' flees!','good');}});}
    if(sp.immobilize){targets.forEach(f=>{if(f.hp>0){f.webbed=3;UI.log(f.ref.n+' is webbed!','good');}});}
    if(sp.slow){foes.forEach(f=>f.slow=5);UI.log(`${sp.n}: foes slowed.`,'good');}
    if(sp.drac||sp.drain){targets.forEach(f=>{if(f.hp>0){const d=Rules.roll('1d10');applyDamage(f,d,u);cas.hp=Math.min(cas.maxhp,cas.hp+Math.floor(d/2));}});UI.log(`${sp.n}: life drained.`,'good');}
    if(sp.dispel){u.dispelled=(u.dispelled||0)+1;UI.log(`${sp.n}: magic disrupted.`,'dim');}
    if(sp.nausea){foes.forEach(f=>f.nausea=6);UI.log('Nausea!','warn');}
    if(sp.hpMax){targets.forEach(f=>{if(f.hp<=sp.hpMax){f.hp=0;UI.log(f.ref.n+' destroyed!','warn');}});}
    if(sp.blind){targets.forEach(f=>f.blind=4);UI.log('Blindness!','warn');}
    if(sp.frighten||sp.flee===undefined&&sp.tgt==='area'&&/fear|scare|spook/i.test(sp.n)){foes.forEach(f=>f.fled=true);}
    if(sp.poison){targets.forEach(f=>{if(f.hp>0)applyDamage(f,Rules.roll('2d6'),u);});}
    if(sp.stone){targets.forEach(f=>{if(f.hp>0&&Rules.roll('1d20')<=10){f.hp=0;f.stoned=true;UI.log(f.ref.n+' turned to stone!','warn');}});}
    if(!sp.dmg&&!sp.heal&&!sp.hd&&!sp.hold&&!sp.flee&&!sp.immobilize&&!sp.slow&&!sp.hpMax&&!sp.blind&&!sp.stone&&!sp.dispel&&!sp.drac){
      UI.log(`${sp.n}: ${sp.desc||'the spell takes effect.'}`,'dim');
    }
    checkEnd();
  }
  /* ---------- items ---------- */
  function itemMenu(u){
    const c=u.ref;const usable=(c.inv||[]).map(id=>({id,it:item(id)})).filter(x=>x.it&&(x.it.t==='p'||x.it.thrown||x.it.t==='d'||(x.it.t==='w'&&x.it.thrown)));
    if(!usable.length){UI.log('No usable items.','dim');return;}
    const acts=usable.map(x=>({label:x.it.n,fn:()=>{useItem(u,x.id);}}));
    acts.push({label:'Cancel',primary:true});
    UI.modal({title:`${c.name} uses`,actions:acts});
  }
  function useItem(u,sid){
    const c=u.ref;const idx=(c.inv||[]).indexOf(sid);const base=sid.split('#')[0];
    const it=item(base);if(!it)return;
    if(idx>=0)c.inv.splice(idx,1);
    if(it.t==='p'){drinkPotion(c,it);UI.log(`${c.name} drinks ${it.n}.`,'good');}
    else if(it.t==='d'){useDevice(u,it);}
    else if(it.thrown){const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0).sort((a,b)=>dist(a,u)-dist(b,u));if(foes[0]){applyDamage(foes[0],Rules.roll(it.thrown||it.dmg||'1d4'),u);UI.log(`${c.name} throws ${it.n}.`,'good');}}
    else UI.log(`${c.name} uses ${it.n}.`,'dim');
    checkEnd();render();u.acted=true;advance();
  }
  function drinkPotion(c,it){
    const p=it.power||'';
    const allies=B.units.filter(v=>v.side==='party'&&v.hp>0);
    if(p==='heal_light'){c.hp=Math.min(c.maxhp,c.hp+Rules.roll('2d4+2'));}
    else if(p==='heal_serious'){c.hp=Math.min(c.maxhp,c.hp+Rules.roll('2d8+1'));}
    else if(p==='heal_critical'){c.hp=Math.min(c.maxhp,c.hp+Rules.roll('3d8+3'));}
    else if(p==='heal_full'){c.hp=c.maxhp;}
    else if(p==='antidote'){c.poison=null;}
    else if(p==='gain_str'){c._strBonus=(c._strBonus||0)+Rules.roll('1d4');}
    else if(p==='heroism'){c._heroism=60;}
    else if(p==='invis'){allies.forEach(a=>a.invis=60);}
    else if(p==='restoration'){c.poison=null;c.dead=false;}
    else if(p==='raise_dead'){const d=B.units.find(v=>v.kind==='pc'&&v.hp<=0);if(d){d.hp=Math.floor(d.maxhp/2);d.ref.dead=false;d.ref.lost=false;d.ref.hp=d.hp;}}
    else if(p==='poison'){c.poison={ticks:12,dmg:'1d4'};UI.log(c.name+' is poisoned!','bad');}
    else{c.hp=Math.min(c.maxhp,c.hp+Rules.roll('1d8'));}
    if(c._battle)c._battle.hp=c.hp;
  }
  function useDevice(u,it){
    // wand/rod/staff/orb: cast first power
    const dev=it.dev;if(!dev){UI.log(it.n+' hums faintly.','dim');return;}
    const sp=SPELLS[dev.powers[0]];
    if(sp){const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0);if(foes[0]){applySpell(u,sp,[foes.sort((a,b)=>dist(a,u)-dist(b,u))[0]]);}}
    else UI.log(it.n+': '+(it.desc||'it glows.'),'dim');
  }
  /* ---------- special ---------- */
  function layHands(u){
    const c=u.ref;const allies=B.units.filter(v=>v.side==='party'&&v.hp>0&&v!==u).sort((a,b)=>a.hp-a.maxhp-(b.hp-b.maxhp))[0];
    if(!allies){UI.log('No one to heal.','dim');return;}
    c.layUsed=true;const amt=Rules.roll('2d8');allies.hp=Math.min(allies.maxhp,allies.hp+amt);if(allies.ref)allies.ref.hp=allies.hp;
    UI.log(`${c.name} lays on hands: ${allies.ref.name} +${amt} HP.`,'good');u.acted=true;advance();
  }
  function thiefAction(u,key){
    const c=u.ref;const sk=Rules.thiefSkill(c,key);
    if(key==='hide'){u.hidden=true;UI.log(`${c.name} hides (skill ${sk}).`,'good');}
    else if(key==='move'){u.stealth=true;UI.log(`${c.name} moves silently.`,'good');}
    else{const roll=Rules.roll('1d20');if(roll<=sk){UI.log(`${c.name} picks the lock!`,'good');/* unlock nearby L handled by game */Game&&Game.unlockNearby&&Game.unlockNearby(u.x,u.y);}else UI.log('Pick fails.','bad');}
    u.acted=true;advance();
  }
  function volley(u){
    const c=u.ref;const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0);
    foes.forEach(f=>{if(f.hp>0)applyDamage(f,Rules.roll('1d6'),u);});
    UI.log(`${c.name} looses a volley!`,'good');u.acted=true;checkEnd();render();advance();
  }
  function hunt(u){
    const c=u.ref;const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0);
    foes.forEach(f=>{if(f.hp>0)applyDamage(f,Rules.roll('1d8')+2,u);});
    UI.log(`${c.name} hunts!`,'good');u.acted=true;checkEnd();render();advance();
  }
  /* ---------- auto battle ---------- */
  function autoBattle(){
    let guard=0;
    while(!B.over&&guard++<800){
      const u=B.active;if(!u)break;
      if(u.kind==='mon'){monsterAct(u);}
      else if(u.hp>0){
        const foes=B.units.filter(v=>v.side==='foe'&&v.hp>0).sort((a,b)=>dist(a,u)-dist(b,u));
        const near=foes.find(f=>dist(f,u)<=1);
        if(near){attack(u,near);u.acted=true;}
        else{
          const t=foes[0];
          const nx=u.x+Math.sign(t.x-u.x),ny=u.y+Math.sign(t.y-u.y);
          if(nx>=1&&ny>=1&&nx<=12&&ny<=8&&B.grid[ny][nx]!=='#'&&!B.units.some(v=>v.x===nx&&v.y===ny&&v.hp>0&&!v.fled)){u.x=nx;u.y=ny;}
          const near2=B.units.filter(v=>v.side==='foe'&&v.hp>0).find(f=>dist(f,u)<=1);
          if(near2){attack(u,near2);}
          u.acted=true;
        }
        checkEnd();if(B.over)break;advance();
      }else{u.acted=true;advance();}
    }
  }
  function keyHandler(e){
    if(!B||B.over)return;
    if(e.key==='Escape'&&B.moveMode){B.moveMode=null;UI.log('Move cancelled.','dim');playerPrompt(B.active);return;}
    if(e.key===' '){const u=B.active;if(u&&u.kind==='pc'&&u.hp>0){u.acted=true;advance();}e.preventDefault();}
    if(e.key==='q'||e.key==='Q')autoBattle();
  }
  function clickTile(tx,ty){
    if(!B||B.over)return;
    if(B.moveMode){tryMove(B.moveMode,tx,ty);return;}
    const u=B.units.find(v=>v.x===tx&&v.y===ty&&v.hp>0&&!v.fled);
    if(u&&u.side==='foe'&&B.active&&B.active.kind==='pc'&&B.active.hp>0){
      if(dist(u,B.active)<=1){B.active.ref._lastMonId=u.ref.id;attack(B.active,u);B.active.acted=true;checkEnd();render();advance();}
      else rangedOrMove(B.active,u);
    }
  }
  function rangedOrMove(att,foe){
    const ch=att.ref;const wid=ch.eq.missile;
    if(wid&&item(wid)&&item(wid).missile){rangedAttack(att,foe);return;}
    UI.log('Out of reach.','dim');
  }
  function render(){
    const g=G();if(!B)return;
    B.units.forEach(u=>{if(u.kind==='pc'&&u.ref)u.ref.hp=Math.max(0,u.hp);});
    const sprites=[];
    for(const u of B.units){
      if(u.hp<=0||u.fled)continue;
      const ref=u.kind==='pc'?{fig:'humanoid',id:'pc'+u.ref.id,color:u.ref.color}:{fig:u.ref.fig||'humanoid',id:u.ref.id,color:u.ref.color||'#8a8f9e'};
      const img=Figures.figTex(ref,64);
      sprites.push({x:u.x+0.5,y:u.y+0.5,img,hp:u.hp,maxhp:u.maxhp});
    }
    View3D.setSprites(sprites);
    const rows=Array.from({length:10},(_,y)=>Array.from({length:14},(_,x)=>B.grid[y][x]).join(''));
    View3D.prepare({grid:rows,w:14,h:10,outdoor:false},{},null);
    View3D.render(0,0,0,{});
    const mm=document.getElementById('minimap');
    if(mm){mm.width=140;mm.height=100;View3D.minimap(mm,{grid:rows,w:14,h:10},0,0,0,null,null);}
    UI.partyList(g.roster,g.sheetFor);
  }
  function end(){B=null;if(Game.G)Game.G.combat=null;}
  function addLoot(g,l){
    if(!l)return;
    if(l.t==='g'){g.gold+=l.n||l.gold||0;return;}
    const id=l.i||l.id||l;
    // give to first able carrier's pack
    const c=g.roster.find(c=>!c.dead&&c.hp>0);
    if(c)(c.inv=c.inv||[]).push(id);else g.inv.push(id);
  }
  return {start,B:()=>B,advance,clickTile,keyHandler,autoBattle,end,render,bfsRange,dist,addLoot};
})();
