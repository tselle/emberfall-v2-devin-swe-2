/* Emberfall — bestiary.js : monster encyclopedia */
'use strict';
const Bestiary = (()=>{
  function open(filter){
    const g=Game.G;const body=UI.el('div','wide');
    body.innerHTML='<input id="bestiarySearch" placeholder="Search monsters…" style="width:100%;margin-bottom:8px">';
    const grid=UI.el('div');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;max-height:60vh;overflow:auto';
    body.appendChild(grid);
    const draw=(q)=>{
      grid.innerHTML='';
      const seen=new Set();
      // mark seen monsters
      for(const mid in g.monstersSeen||{})seen.add(mid);
      const list=Object.values(MONSTERS).filter(m=>{
        if(!m||!m.n)return false;
        if(q&&!m.n.toLowerCase().includes(q.toLowerCase()))return false;
        return seen.has(m.id)||!g.monstersSeen; // show all if none seen yet
      }).sort((a,b)=>a.n.localeCompare(b.n));
      for(const m of list.slice(0,200)){
        const card=UI.el('div');card.style.cssText='background:#1a1d26;border:1px solid #2a2d38;border-radius:6px;padding:6px;cursor:pointer;text-align:center';
        const cv=document.createElement('canvas');cv.width=96;cv.height=96;
        Figures.monsterPortrait(cv,m);
        const nm=UI.el('div','',m.n);nm.style.cssText='font-size:12px;color:#e9e2cf;margin-top:4px';
        card.appendChild(cv);card.appendChild(nm);
        card.onclick=()=>monsterDetail(m);
        grid.appendChild(card);
      }
    };
    body.querySelector('#bestiarySearch').oninput=e=>draw(e.target.value);
    draw('');
    UI.modal({title:'Bestiary',body,wide:true,actions:[{label:'Close',primary:true}]});
  }
  function monsterDetail(m){
    const kills=(Game.G.monsterKills&&Game.G.monsterKills[m.id])||0;
    const body=UI.el('div');
    body.innerHTML=`<h3>${m.n}</h3>
      <p><b>HD:</b> ${m.hd} · <b>AC:</b> ${m.ac} · <b>THAC0:</b> ${Rules.thac0ForHd?Rules.thac0ForHd(m.hd):'—'} · <b>Size:</b> ${m.size} · <b>XP:</b> ${m.xp||'—'}</p>
      <p><b>Attacks:</b> ${(m.atk||[]).map(a=>a[0]==='m'?`Melee ${a[1]}`:`${a[1]} range ${a[2]}`).join(', ')||'—'}</p>
      <p><b>Special:</b> ${m.spec||'—'}</p>
      <p><b>Morale:</b> ${m.morale??'—'} · <b>Frequency:</b> ${m.freq} · <b>Group:</b> ${m.group||'—'}</p>
      ${kills?`<p><b>Kills:</b> ${kills}</p>`:''}`;
    UI.modal({title:m.n,body,actions:[{label:'Close',primary:true}]});
  }
  function markSeen(monId){const g=Game.G;g.monstersSeen=g.monstersSeen||{};g.monstersSeen[monId]=(g.monstersSeen[monId]||0)+1;}
  function markKill(monId){const g=Game.G;g.monsterKills=g.monsterKills||{};g.monsterKills[monId]=(g.monsterKills[monId]||0)+1;markSeen(monId);}
  return {open,monsterDetail,markSeen,markKill};
})();
