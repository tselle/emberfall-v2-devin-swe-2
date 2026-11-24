/* Emberfall — ui.js : DOM screens, modals, party drawer, sheets, shops, services */
'use strict';
const UI = (()=>{
  const $=id=>document.getElementById(id);
  function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function log(msg,cls){
    const L=$('log'); if(!L)return;
    const d=el('div','ln '+(cls||''),msg);
    L.appendChild(d);
    while(L.children.length>250)L.removeChild(L.firstChild);
    L.scrollTop=L.scrollHeight;
  }
  /* ---------- modal stack ---------- */
  const stack=[];
  function modal(opts){
    // opts: {title,body(node|string|html),actions:[{label,fn,primary,disabled}],closable,wide,onClose}
    return new Promise(resolve=>{
      const back=el('div','modal-back');
      const m=el('div','modal'+(opts.wide?' wide':''));
      const head=el('div','modal-head',`<span>${opts.title||''}</span>`);
      if(opts.closable!==false){const b=el('button','×','✕');b.onclick=()=>close();head.appendChild(b);}
      const body=el('div','modal-body');
      if(typeof opts.body==='string')body.innerHTML=opts.body;else if(opts.body)body.appendChild(opts.body);
      const foot=el('div','modal-foot');
      m.appendChild(head);m.appendChild(body);m.appendChild(foot);
      back.appendChild(m);$('modalRoot').appendChild(back);
      let closed=false;
      function close(val){ if(closed)return; closed=true;
        stack.splice(stack.indexOf(rec),1);
        back.remove(); if(opts.onClose)opts.onClose(val); resolve(val); }
      const rec={close,el:back,opts}; stack.push(rec);
      for(const a of (opts.actions||[])){
        const b=el('button',a.primary?'primary':'',a.label);
        if(a.disabled)b.disabled=true;
        b.onclick=()=>{ if(a.fn){const r=a.fn(); if(r!==false)close(r);} else close(a.value); };
        foot.appendChild(b);
      }
      if(!opts.actions||!opts.actions.length){const b=el('button','','Close');b.onclick=()=>close();foot.appendChild(b);}
      // enter key -> primary
      const onKey=e=>{ if(e.key==='Enter'&&!e.target.matches('input,select,textarea')){const p=foot.querySelector('button.primary:not(:disabled)')||foot.querySelector('button:not(:disabled)');if(p)p.click();} };
      back.addEventListener('keydown',onKey);
      back.tabIndex=-1; back.focus();
    });
  }
  function closeTop(val){ const r=stack[stack.length-1]; if(r)r.close(val); }
  function topModal(){return stack[stack.length-1];}
  function anyModal(){return stack.length>0;}
  /* ---------- command bar ---------- */
  function cmdbar(defs){
    const bar=$('cmdbar'); bar.innerHTML='';
    for(const d of defs){
      const b=el('button','',d.icon?`<span class="ic">${d.icon}</span>`:'');
      b.innerHTML=(d.icon?`<span class="ic">${d.icon}</span>`:'')+(d.label||'');
      b.title=d.hint||d.label||'';
      b.disabled=!!d.disabled;
      b.onclick=d.fn;
      bar.appendChild(b);
    }
    $('cmdhint').textContent=defs.find(d=>d.hint&&d.primary)||'';
  }
  /* ---------- party drawer ---------- */
  function partyList(chars,sel){
    const L=$('partyList'); L.innerHTML='';
    for(const ch of chars){
      const dead=ch.dead||ch.hp<=0;
      const card=el('div','pcard'+(sel===ch.id?' sel':''));
      card.style.setProperty('--pc',ch.color||'#888');
      const cv=document.createElement('canvas');cv.width=88;cv.height=88;
      Figures.portrait(cv,{kind:'pc',name:ch.name,race:ch.race,cls:ch.cls,lvl:ch.lvl,color:ch.color});
      const info=el('div');
      const hpPct=Math.max(0,ch.hp/ch.maxhp);
      const pips='';
      info.innerHTML=`<div class="pc-nm">${ch.name}${dead?' †':''}</div>
        <div class="pc-sub">${Rules.RACES[ch.race].name} ${Rules.CLASSES[ch.cls].name} ${ch.lvl}</div>
        <div class="hpbar"><i class="${hpPct<0.3?'low':''}" style="width:${hpPct*100}%"></i></div>
        <div class="pc-stats">HP <b>${Math.max(0,ch.hp)}/${ch.maxhp}</b> · AC <b>${Rules.acOf(ch)}</b> · THAC0 <b>${Rules.thac0(ch)}</b></div>
        <div class="pc-stats">${dead?'Dead':ch.hp<=0?'Down':ch.status&&ch.status.held?'Held':'Ready'}${ch.poison?' · Poisoned':''}</div>`;
      card.appendChild(cv);card.appendChild(info);
      card.onclick=()=>openSheet(ch.id);
      L.appendChild(card);
    }
  }
  function toggleParty(force){
    const p=$('party'); const show=force!==undefined?force:p.classList.contains('hidden');
    p.classList.toggle('hidden',!show);
    try{localStorage.setItem('emberfall.party',show?'1':'0');}catch(e){}
    return show;
  }
  /* ---------- character sheet ---------- */
  function openSheet(charId){
    const G=Game.G; const ch=G.roster.find(c=>c.id===charId); if(!ch)return;
    const s=Rules.effScores(ch);
    const rows=[
      ['Name',ch.name],['Race',Rules.RACES[ch.race].name],['Class',Rules.CLASSES[ch.cls].name+' '+ch.lvl],['Alignment',ch.align],
      ['HP',`${Math.max(0,ch.hp)} / ${ch.maxhp}`],['AC',Rules.acOf(ch)],['THAC0',Rules.thac0(ch)],
      ['XP',`${ch.xp} / ${Rules.nextXp(ch.cls,ch.lvl)||'—'}`],
      ['STR',`${ch.str}${ch.strx?' ('+ch.strx+')':''} (${Rules.abilityMod(s.str)>=0?'+':''}${Rules.abilityMod(s.str)})`],
      ['DEX',`${ch.dex} (${Rules.abilityMod(s.dex)>=0?'+':''}${Rules.abilityMod(s.dex)})`],
      ['CON',`${ch.con} (${Rules.abilityMod(s.con)>=0?'+':''}${Rules.abilityMod(s.con)})`],
      ['INT',`${ch.int} (${Rules.abilityMod(s.int)>=0?'+':''}${Rules.abilityMod(s.int)})`],
      ['WIS',`${ch.wis} (${Rules.abilityMod(s.wis)>=0?'+':''}${Rules.abilityMod(s.wis)})`],
      ['CHA',`${ch.cha} (${Rules.abilityMod(s.cha)>=0?'+':''}${Rules.abilityMod(s.cha)})`],
    ];
    const saves=Rules.saveTargets(ch).map(v=>v);
    const body=el('div','cols');
    const left=el('div'); left.innerHTML='<h3>Status</h3><table>'+rows.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')+'</table>';
    left.innerHTML+=`<h3>Saves</h3><div>P/P/D ${saves[0]} · Rod ${saves[1]} · Petrify ${saves[2]} · Breath ${saves[3]} · Spell ${saves[4]}</div>`;
    if(ch.cls==='M'||ch.cls==='C'||ch.cls==='P'){
      const slots=Rules.slotTable(ch); const cas=Rules.casterLevel(ch);
      left.innerHTML+=`<h3>Spells (level ${cas})</h3>`;
      if(slots){ left.innerHTML+='<div>'+slots.map((v,i)=>v?`L${i+1}: ${v}`:'').filter(Boolean).join(' · ')+'</div>'; }
      {
        left.innerHTML+='<h3>Spellbook</h3><div>'+(ch.book||[]).map(id=>{const sp=SPELLS[id];return sp?sp.name:'?';}).join(', ')+'</div>';
        left.innerHTML+='<h3>Prepared/Mem</h3><div>'+(ch.book||[]).map(id=>{const sp=SPELLS[id];if(!sp)return'';const p=(ch.prep&&ch.prep[id])||0,m=(ch.mem&&ch.mem[id])||0;return `${sp.name} ${m}/${p}`;}).filter(Boolean).join('<br>')+'</div>';
      }
    }
    const right=el('div');
    const eqSlots=['melee','missile','armor','shield','ring1','ring2','cloak','boots','gloves','belt','neck','charm'];
    right.innerHTML='<h3>Equipment</h3><table>'+eqSlots.map(sl=>{const id=ch.eq[sl];const it=id?item(id):null;return `<tr><th>${sl}</th><td>${it?it.n:id||'—'}</td></tr>`;}).join('')+'</table>';
    right.innerHTML+='<h3>Pack</h3><div>'+(ch.inv||[]).map(id=>{const it=item(id);return it?it.n:id;}).join(', ')+'</div>';
    const ground=(Game.G.ground&&Game.G.ground[Game.G.map]&&Game.G.ground[Game.G.map][Game.G.x+','+G.y])||[];
    if(ground.length) right.innerHTML+='<h3>On the ground</h3><div>'+ground.map(id=>{const it=item(id);return it?it.n:id;}).join(', ')+'</div>';
    body.appendChild(left);body.appendChild(right);
    modal({title:ch.name+' — Sheet',body,wide:true,closable:true,actions:[
      {label:'Close',primary:true},
      {label:'March Order',fn:()=>{Game.cycleOrder(ch.id);refresh();}},
    ]});
  }
  function refresh(){ if(window.Game)Game.refreshUI(); }
  /* ---------- shops / services ---------- */
  function shopDialog(shopId,buyer){
    const shop=SHOPS[shopId]||SHOPS.general;
    const G=Game.G;
    const body=el('div');
    body.innerHTML=`<p>${shop.name} — pooled funds: <b>${G.gold} gp</b>. Buyer: ${buyer.name}.</p>`;
    const list=el('div','log-scroll');
    for(const sid of shop.stock){
      const it=item(sid); if(!it)continue;
      const usable=canUse(buyer,it);
      const row=el('div','shop-row');
      row.innerHTML=`<span>${it.n} ${usable?'':'<span class="badge">n/a</span>'}</span><span class="price">${Math.ceil(it.price)} gp</span>`;
      const buy=el('button','Buy'); buy.disabled=!usable||G.gold<Math.ceil(it.price);
      buy.onclick=()=>{ if(G.gold<Math.ceil(it.price))return; G.gold-=Math.ceil(it.price); buyer.inv.push(sid); autoEquip(buyer,sid); UI.log(`Bought ${it.n} (${Math.ceil(it.price)} gp)`,'good'); shopDialog(shopId,buyer); };
      row.appendChild(buy);list.appendChild(row);
    }
    // sell pack items
    body.appendChild(el('h3','','Pack — sell for half'));
    const sell=el('div','log-scroll');
    for(const sid of (buyer.inv||[]).slice()){
      const it=item(sid); if(!it||it.t==='q')continue;
      const val=Math.floor((it.value&&it.value>0?it.value:it.price||10)/2);
      const row=el('div','shop-row');
      row.innerHTML=`<span>${it.n}</span><span class="price">+${val} gp</span>`;
      const b=el('button','Sell');b.onclick=()=>{buyer.inv.splice(buyer.inv.indexOf(sid),1);G.gold+=val;UI.log(`Sold ${it.n} (+${val} gp)`,'good');shopDialog(shopId,buyer);};
      row.appendChild(b);sell.appendChild(row);
    }
    body.appendChild(list);body.appendChild(sell);
    modal({title:shop.name,body,wide:true,actions:[{label:'Leave',primary:true}]});
  }
  function canUse(ch,it){
    if(!it)return false;
    if(it.t==='w'){ if(it.missile)return true; const c=Rules.CLASSES[ch.cls]; if(ch.cls==='M')return ['dagger','staff','dart','sling'].includes(it.fam); return true; }
    if(it.t==='a'){ const c=Rules.CLASSES[ch.cls]; if(ch.cls==='M')return false; if(ch.cls==='T'&&!it.light&&it.ac<6)return false; return true; }
    if(it.t==='s'){ const c=Rules.CLASSES[ch.cls]; if(ch.cls==='M'||ch.cls==='T'&&it.acBonus>1)return false; return true; }
    return true;
  }
  function autoEquip(ch,id){
    const it=item(id); if(!it)return;
    if(!canUse(ch,it))return;
    let slot=null;
    if(it.t==='w')slot=it.missile?'missile':'melee';
    else if(it.t==='a')slot='armor';else if(it.t==='s')slot='shield';
    else if(it.t==='m')slot=Rules.guessSlot(ch,id);
    if(slot&&ch.eq[slot]==null){ch.inv.splice(ch.inv.indexOf(id),1);ch.eq[slot]=id;UI.log(`${ch.name} equips ${it.n}`,'good');}
  }
  /* ---------- services ---------- */
  function innDialog(){
    const G=Game.G; const party=Game.partyChars().filter(c=>!c.dead);
    const cost=party.length;
    const body=el('div');
    body.innerHTML=`<p>The ${'inn'} charges ${cost} gp per night for the company. Rest restores HP, spells and lay on hands.</p>`;
    modal({title:'Inn',body,actions:[
      {label:`Rest (${cost} gp)`,primary:true,disabled:G.gold<cost||!party.length,fn:()=>{Game.restInn();}},
      {label:'Leave'},
    ]});
  }
  function templeDialog(){
    const G=Game.G; const party=Game.partyChars().filter(c=>!c.dead&&c.hp>0);
    const body=el('div'); body.innerHTML='<p>The temple offers healing for the faithful.</p>';
    const acts=[];
    const add=(label,cost,fn)=>acts.push({label:`${label} (${cost} gp)`,disabled:G.gold<cost||!party.length,fn});
    add('Cure Light Wounds',20,()=>{for(const c of party){if(c.hp<c.maxhp){c.hp=Math.min(c.maxhp,c.hp+Rules.roll('1d8'));}}G.gold-=20;UI.log('Temple heals the party.','good');});
    add('Cure Serious Wounds',60,()=>{for(const c of party){if(c.hp<c.maxhp)c.hp=Math.min(c.maxhp,c.hp+Rules.roll('2d8+1'));}G.gold-=60;UI.log('Temple heals the party.','good');});
    add('Neutralize Poison',80,()=>{for(const c of party)c.poison=null;G.gold-=80;UI.log('Poison lifted.','good');});
    const dead=G.roster.find(c=>c.dead&&!c.lost);
    if(dead)add('Raise Dead — '+dead.name,400,()=>{dead.dead=false;dead.lost=false;dead.hp=1;G.gold-=400;UI.log(dead.name+' rises!','good');});
    acts.push({label:'Leave',primary:true});
    modal({title:'Temple',body,actions:acts});
  }
  function tavernDialog(){
    const G=Game.G; const cost=2;
    const body=el('div'); body.innerHTML='<p>A round of drinks and local gossip.</p>';
    modal({title:'Tavern',body,actions:[
      {label:`Buy a round (${cost} gp)`,primary:true,disabled:G.gold<cost,fn:()=>{G.gold-=cost;Journal.rumor();UI.log('You hear a rumor. Check your journal.','dim');}},
      {label:'Leave'},
    ]});
  }
  function helpDialog(){
    const body=el('div');
    body.innerHTML=`<h3>Exploration</h3><p>W/↑ forward, S/↓ back, A/D or ←/→ turn, Q/E strafe. F search, R camp. On the road, WASD move N/W/S/E, Q/E/Z/C diagonal.</p>
    <h3>Combat</h3><p>Click tiles to move, enemies to attack. C cast, T turn undead, H hide, U use item, Space end turn, Q auto-battle.</p>
    <h3>Rest &amp; Training</h3><p>Inns restore HP and spells. The training hall levels eligible heroes for 100×level gp each.</p>
    <h3>Saves</h3><p>Auto-saves at checkpoints; three manual slots plus auto. Menu → Save/Load.</p>`;
    modal({title:'How to Play',body,wide:true,actions:[{label:'Close',primary:true}]});
  }
  function menuDialog(){
    const G=Game.G;
    modal({title:'Menu',actions:[
      {label:'Map',fn:()=>{closeTop();MapUI.openFull();}},
      {label:'Journal',fn:()=>{closeTop();Journal.open();}},
      {label:'Bestiary',fn:()=>{closeTop();Bestiary.open();}},
      {label:'Touch Controls',fn:()=>{closeTop();NavPad.cycle();}},
      {label:'Save',fn:()=>{closeTop();Game.saveGame();}},
      {label:'Load',fn:()=>{closeTop();Game.loadDialog();}},
      {label:'Campaign',fn:()=>{closeTop();Game.travelDialog();}},
      {label:'How to Play',fn:()=>{helpDialog();}},
      {label:'Quit to Title',fn:()=>{closeTop();Game.quitToTitle();}},
      {label:'Resume',primary:true},
    ]});
  }
  return {el,log,modal,closeTop,anyModal,topModal,cmdbar,partyList,toggleParty,openSheet,shopDialog,innDialog,templeDialog,tavernDialog,helpDialog,menuDialog,$};
})();
