/* Emberfall — journal.js : quest log, rumors, notes */
'use strict';
const Journal = (()=>{
  function open(){
    const g=Game.G;const body=UI.el('div','wide');
    body.innerHTML='<h3>Quests</h3>';
    const ql=UI.el('div','log-scroll');
    for(const qid in g.quests){
      const q=g.quests[qid];const def=QUESTS[qid];if(!def)continue;
      const row=UI.el('div','shop-row');
      row.innerHTML=`<span>${q.state==='done'?'✓':q.state==='failed'?'✗':'•'} ${def.name||qid}</span><span class="price">${q.prog}/${q.need}</span>`;
      ql.appendChild(row);
    }
    if(!ql.children.length)ql.innerHTML='<p>No quests yet.</p>';
    body.appendChild(ql);
    body.innerHTML+='<h3>Rumors</h3><div class="log-scroll">'+(g.rumors||[]).map(r=>`<div class="ln">• ${r}</div>`).join('')+'</div>';
    body.innerHTML+='<h3>Party</h3><div>'+(g.roster||[]).map(c=>`${c.name} ${c.race} ${c.cls} ${c.lvl} — ${Math.max(0,c.hp)}/${c.maxhp}hp`).join('<br>')+'</div>';
    body.innerHTML+='<h3>Gold</h3><div>'+g.gold+' gp</div>';
    UI.modal({title:'Journal',body,wide:true,actions:[{label:'Close',primary:true}]});
  }
  function rumor(){
    const g=Game.G;g.rumors=g.rumors||[];
    // gather rumor pool: current map > module > wilds > generic
    const m=MAPS[g.map];const mod=MODULES[g.module];
    let pool=(m&&m.rumors&&m.rumors.length)?m.rumors:(mod&&mod.rumors&&mod.rumors.length)?mod.rumors:
      ['Strange lights in the wilds.','Travelers speak of treasure.','The roads are not safe.'];
    const r=pool[Math.floor(Rules.rng()*pool.length)];
    if(!g.rumors.includes(r))g.rumors.unshift(r);if(g.rumors.length>30)g.rumors.pop();
  }
  function addQuest(qid){
    const g=Game.G;const q=QUESTS[qid];if(!q)return;
    g.quests[qid]={id:qid,state:'open',prog:0,need:q.steps||3};
    UI.log(`New quest: ${q.name||qid}`,'warn');
  }
  function progress(qid,n){
    const g=Game.G;const q=g.quests[qid];if(!q||q.state==='done')return;
    q.prog=(q.prog||0)+n;
    const def=QUESTS[qid];
    if(q.prog>=(q.need||def.steps||3)){q.state='done';UI.log(`Quest complete: ${def.name||qid}`,'good');if(def.gold)g.gold+=def.gold;}
  }
  return {open,rumor,addQuest,progress};
})();
