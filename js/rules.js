/* Emberfall — rules.js : dice, races, classes, progression, saves, skills, creation */
'use strict';
const Rules = (() => {

  /* ---------------- dice ---------------- */
  const DIE = {d4:4,d6:6,d8:8,d10:10,d12:12,d20:20,d100:100};
  // roll("2d6+3") -> integer. rng optional (Math.random default).
  function roll(expr, rng) {
    rng = rng || Math.random;
    expr = String(expr).trim();
    let m = expr.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (!m) { const n = parseInt(expr,10); return isNaN(n)?0:n; }
    const n = m[1]===''||m[1]==null ? 1 : parseInt(m[1],10);
    const sides = parseInt(m[2],10), mod = m[3]?parseInt(m[3],10):0;
    let t = 0; for (let i=0;i<n;i++) t += 1+Math.floor(rng()*sides);
    return t + mod;
  }
  // roll with breakdown: {total, parts:[{n,sides,rolls}],mod}
  function rollDetail(expr, rng) {
    rng = rng || Math.random;
    expr = String(expr).trim();
    let m = expr.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (!m) { const n=parseInt(expr,10); return {total:isNaN(n)?0:n,parts:[],mod:0}; }
    const n = m[1]===''||m[1]==null?1:parseInt(m[1],10);
    const sides = parseInt(m[2],10), mod = m[3]?parseInt(m[3],10):0;
    const rolls=[]; let t=0;
    for (let i=0;i<n;i++){const r=1+Math.floor(rng()*sides); rolls.push(r); t+=r;}
    return {total:t+mod, parts:[{n,sides,rolls}], mod};
  }
  function describe(expr){ return expr; }
  function evalFixed(expr){ return roll(expr); } // fixed amount or dice; use rollDice for live

  /* ---------------- races ---------------- */
  const RACES = {
    human:   {name:'Human',    mv:12, adj:{},            cls:['F','P','R','M','C','T'], limits:{str:[3,18],dex:[3,18],con:[3,18],int:[3,18],wis:[3,18],cha:[3,18]}, thief:{pick:0,find:0,move:0,hide:0,hear:0,bs:0}, notes:'Any class. Versatile.'},
    dwarf:   {name:'Dwarf',    mv:10, adj:{con:1,cha:-1}, cls:['F','C','T'],      limits:{str:[3,18],dex:[3,18],con:[3,19],int:[3,18],wis:[3,18],cha:[3,17]}, thief:{pick:10,find:10,move:5,hide:15,hear:10,bs:0}, notes:'+1 CON, −1 CHA, MV 10. Save bonuses vs poison/rod. +1 hit/dmg vs giants.'},
    elf:     {name:'Elf',      mv:12, adj:{dex:1,con:-1}, cls:['F','R','M','C','T'], limits:{str:[3,18],dex:[3,19],con:[3,17],int:[3,18],wis:[3,18],cha:[3,18]}, thief:{pick:5,find:5,move:15,hide:10,hear:10,bs:0}, notes:'+1 DEX, −1 CON. 90% sleep resistance, secret doors, sword/bow bonuses.'},
    gnome:   {name:'Gnome',    mv:10, adj:{int:1,wis:-1}, cls:['F','C','T'],      limits:{str:[3,18],dex:[3,18],con:[3,19],int:[3,19],wis:[3,17],cha:[3,18]}, thief:{pick:10,find:5,move:0,hide:5,hear:5,bs:0}, notes:'+1 INT, −1 WIS, MV 10. Illusion/secret-door bonuses vs magical foes.'},
    halfelf: {name:'Half-Elf', mv:12, adj:{},            cls:['F','R','M','C','T'], limits:{str:[3,18],dex:[3,18],con:[3,18],int:[3,18],wis:[3,18],cha:[3,18]}, thief:{pick:5,find:5,move:10,hide:10,hear:5,bs:0}, notes:'No adjustments. 30% sleep resistance, secret doors.'},
    halfling:{name:'Halfling',mv:10, adj:{dex:1,str:-1}, cls:['F','C','T'],      limits:{str:[3,17],dex:[3,18],con:[3,18],int:[3,18],wis:[3,18],cha:[3,18]}, thief:{pick:10,find:5,move:15,hide:5,hear:10,bs:0}, notes:'+1 DEX, −1 STR, MV 10. Missile bonuses, save bonus vs poison.'},
  };

  /* ---------------- classes ---------------- */
  // xpTo[lvl] = cumulative XP needed to REACH lvl (index lvl). Group by table.
  const XP = {
    warrior:[0,0,2000,4000,8000,12000,16000,22000,28000,36000,44000,52000,64000,76000,88000,100000,120000,140000,165000,195000,225000],
    priest: [0,0,1500,3000,6000,9000,13000,17000,21000,26000,31000,36000,41000,46000,54000,62000,70000,78000,86000,94000,112000],
    thief:  [0,0,1250,2500,5000,7500,10000,12500,15000,20000,25000,30000,35000,40000,50000,60000,70000,80000,90000,100000,125000],
    mage:   [0,0,2500,5000,10000,15000,21000,27000,34000,41000,48000,55000,62000,69000,76000,83000,90000,100000,110000,120000,140000],
  };
  const CLASSES = {
    F:{name:'Fighter',   grp:'warrior',hd:'d10',min:{str:9},       prime:['str'],        gold:'5d4',   spec:true},
    P:{name:'Paladin',   grp:'warrior',hd:'d10',min:{str:12,con:9,wis:13,cha:17},prime:['str','cha'],gold:'5d4', races:['human'], align:['LG']},
    R:{name:'Ranger',    grp:'warrior',hd:'d10',min:{str:13,dex:13,con:14,wis:14},prime:['str','dex','wis'],gold:'5d4', align:['LG','NG','CG'], foes:['goblin','orc','kobold','undead','giant','troll']},
    M:{name:'Mage',      grp:'mage',    hd:'d4', min:{int:9},       prime:['int'],        gold:'1d4+1'},
    C:{name:'Cleric',    grp:'priest',  hd:'d8', min:{wis:9},       prime:['wis'],        gold:'3d6'},
    T:{name:'Thief',     grp:'thief',   hd:'d6', min:{dex:9},       prime:['dex'],        gold:'2d6', align:['CG','N','CE','LE','CN','NE','LN','LG','NG'], notAlign:['LG']},
  };
  const ALIGNMENTS = ['LG','NG','CG','LN','N','CN','LE','NE','CE'];
  const alignOk = (cls,al)=>{
    const c=CLASSES[cls];
    if(c.align && !c.align.includes(al)) return false;
    if(c.notAlign && c.notAlign.includes(al)) return false;
    return true;
  };
  const classXpTable = c => XP[CLASSES[c].grp];
  const xpFor = (c,lvl)=> classXpTable(c)[Math.min(lvl,20)];
  const nextXp = (c,lvl)=> lvl>=20?null:classXpTable(c)[lvl+1];

  /* ---------------- ability modifiers ---------------- */
  function mod(score){ return score>=15?Math.floor((score-10)/2):score<=6?Math.floor((score-10)/2):Math.floor((score-10)/2); }
  // 2e-style: 3-5:-2? Actually 2e: <=6 -1, 7-8 -1? Use standard: floor((s-10)/2) gives 6->-2.
  function abilityMod(s){
    if(s<=3) return -3; if(s<=5) return -2; if(s<=7) return -1;
    if(s<=14) return 0; if(s<=16) return 1; if(s<=17) return 2;
    if(s<=18) return 3; return Math.floor((s-10)/2);
  }
  function primeMult(c, scores){
    const cls=CLASSES[c]; let best=0;
    for(const p of cls.prime){ const m=abilityMod(scores[p]); if(m>best) best=m; }
    return best;
  }

  /* ---------------- derived stats ---------------- */
  function raceOf(ch){ return RACES[ch.race]||RACES.human; }
  function effScores(ch){
    const r=raceOf(ch), s={};
    for(const k of ['str','dex','con','int','wis','cha']){
      let v = ch[k]||10;
      if(k==='str'&&ch.strx) v=ch.strx;
      v += (r.adj[k]||0);
      s[k]=v;
    }
    return s;
  }
  function thac0(ch){
    const n=(ch.lvl||1)-1, grp=CLASSES[ch.cls].grp;
    if(grp==='warrior') return 20-n;
    if(grp==='priest') return 20-2*Math.floor(n/3);
    if(grp==='thief')  return 20-Math.floor(n/2);
    return 20-Math.floor(n/3); // mage
  }
  // save table: returns [p/p/d, rod/staff/wand, petrify/polymorph, breath, spell]
  const SAVE_T = {
    warrior:[[14,16,15,17,17],[13,15,14,16,16],[12,14,13,15,15],[11,13,12,14,14],[10,12,11,13,13],[9,11,10,12,12],[8,10,9,11,11],[7,9,8,10,10],[6,8,7,9,9],[5,7,6,8,8],[4,6,5,7,7],[3,5,4,6,6],[2,4,3,5,5],[1,3,2,4,4],[0,2,1,3,3],[-1,1,0,2,2],[-2,0,-1,1,1],[-3,-1,-2,0,0],[-4,-2,-3,-1,-1],[-5,-3,-4,-2,-2]],
    priest: [[12,14,13,15,16],[11,13,12,14,15],[10,12,11,13,14],[9,11,10,12,13],[8,10,9,11,12],[7,9,8,10,11],[6,8,7,9,10],[5,7,6,8,9],[4,6,5,7,8],[3,5,4,6,7],[2,4,3,5,6],[1,3,2,4,5],[0,2,1,3,4],[-1,1,0,2,3],[-2,0,-1,1,2],[-3,-1,-2,0,1],[-4,-2,-3,-1,0],[-5,-3,-4,-2,-1],[-6,-4,-5,-3,-2],[-7,-5,-6,-4,-3]],
    thief:  [[14,16,15,17,17],[13,15,14,16,16],[12,14,13,15,15],[11,13,12,14,14],[10,12,11,13,13],[9,11,10,12,12],[8,10,9,11,11],[7,9,8,10,10],[6,8,7,9,9],[5,7,6,8,8],[4,6,5,7,7],[3,5,4,6,6],[2,4,3,5,5],[1,3,2,4,4],[0,2,1,3,3],[-1,1,0,2,2],[-2,0,-1,1,1],[-3,-1,-2,0,0],[-4,-2,-3,-1,-1],[-5,-3,-4,-2,-2]],
    mage:   [[16,18,17,19,18],[15,17,16,18,17],[14,16,15,17,16],[13,15,14,16,15],[12,14,13,15,14],[11,13,12,14,13],[10,12,11,13,12],[9,11,10,12,11],[8,10,9,11,10],[7,9,8,10,9],[6,8,7,9,8],[5,7,6,8,7],[4,6,5,7,6],[3,5,4,6,5],[2,4,3,5,4],[1,3,2,4,3],[0,2,1,3,2],[-1,1,0,2,1],[-2,0,-1,1,0],[-3,-1,-2,0,-1]],
  };
  // paladin uses warrior saves with +2
  function saveTargets(ch){
    let t = SAVE_T[CLASSES[ch.cls].grp][Math.min((ch.lvl||1)-1,19)].slice();
    if(ch.cls==='P') t = t.map(v=>v-2);
    const s = effScores(ch);
    // WIS adjustment to mental saves (spell index 4 and petrify index 2 partially)
    const wisAdj = s.wis>=14?1:s.wis<=6?-1:0;
    t[2]-=wisAdj; t[4]-=wisAdj;
    if(raceOf(ch)===RACES.dwarf||raceOf(ch)===RACES.gnome||raceOf(ch)===RACES.halfling){
      const conAdj = s.con>=14?1:s.con<=6?-1:0;
      t[0]-=conAdj; t[2]-=conAdj;
      if(raceOf(ch)!==RACES.gnome) t[1]-=conAdj;
    }
    // fx bonuses: fx.saveBonus = [idx,amt][]
    for(const [i,a] of (ch.fx&&ch.fx.saveBonus)||[]) t[i]-=a;
    return t;
  }
  function saveRoll(ch, idx, bonus){
    const tgt = saveTargets(ch)[idx];
    const r = roll('1d20');
    const total = r + (bonus||0);
    return {roll:r,total,target:tgt,save:total>=tgt};
  }

  /* ---------------- spell slots ---------------- */
  const MAGE_SLOTS = { // by level: [l1..l9] max slots
    1:[1,0,0,0,0,0,0,0,0],2:[2,0,0,0,0,0,0,0,0],3:[2,1,0,0,0,0,0,0,0],4:[3,2,0,0,0,0,0,0,0],
    5:[3,2,1,0,0,0,0,0,0],6:[3,2,1,0,0,0,0,0,0],7:[4,3,1,0,0,0,0,0,0],8:[4,3,2,0,0,0,0,0,0],
    9:[4,3,2,1,0,0,0,0,0],10:[4,3,3,1,0,0,0,0,0],11:[4,4,3,2,0,0,0,0,0],12:[5,4,3,2,1,0,0,0,0],
    13:[5,4,3,2,1,0,0,0,0],14:[5,4,3,2,1,1,0,0,0],15:[5,4,4,2,1,1,0,0,0],16:[5,5,4,3,1,1,1,0,0],
    17:[5,5,4,3,2,1,1,0,0],18:[5,5,4,3,2,2,1,1,0],19:[6,5,5,4,2,2,1,1,0],20:[6,5,5,4,3,2,1,1,1],
  };
  const CLERIC_SLOTS = {
    1:[3,0,0,0,0,0,0,0,0],2:[4,0,0,0,0,0,0,0,0],3:[5,1,0,0,0,0,0,0,0],4:[6,2,0,0,0,0,0,0,0],
    5:[7,2,0,0,0,0,0,0,0],6:[8,3,1,0,0,0,0,0,0],7:[9,3,2,0,0,0,0,0,0],8:[10,4,2,1,0,0,0,0,0],
    9:[11,4,3,1,0,0,0,0,0],10:[12,5,3,2,0,0,0,0,0],11:[13,5,4,2,1,0,0,0,0],12:[14,6,4,3,1,0,0,0,0],
    13:[15,6,5,3,1,1,0,0,0],14:[16,7,5,4,2,1,0,0,0],15:[17,7,6,4,2,1,1,0,0],16:[18,8,6,5,2,2,1,0,0],
    17:[19,8,7,5,3,2,1,1,0],18:[20,9,7,6,3,2,1,1,0],19:[21,9,8,6,4,3,2,1,1],20:[22,10,9,7,4,3,2,2,1],
  };
  const PALADIN_SLOTS = { // caster level = clamp(lvl-8,1,9); slots by caster level
    9:[1,0,0,0,0,0,0,0,0],10:[2,0,0,0,0,0,0,0,0],11:[2,0,0,0,0,0,0,0,0],12:[2,1,0,0,0,0,0,0,0],
    13:[2,1,0,0,0,0,0,0,0],14:[3,1,0,0,0,0,0,0,0],15:[3,1,0,0,0,0,0,0,0],16:[3,1,1,0,0,0,0,0,0],
    17:[3,2,1,0,0,0,0,0,0],18:[3,2,1,0,0,0,0,0,0],19:[4,2,1,1,0,0,0,0,0],20:[4,2,2,1,0,0,0,0,0],
  };
  function slotTable(ch){
    if(ch.cls==='M') return MAGE_SLOTS[Math.min(ch.lvl,20)];
    if(ch.cls==='C') return CLERIC_SLOTS[Math.min(ch.lvl,20)];
    if(ch.cls==='P') return PALADIN_SLOTS[Math.min(Math.max(ch.lvl,9),20)];
    return null;
  }
  function casterLevel(ch){
    if(ch.cls==='M') return ch.lvl;
    if(ch.cls==='C') return ch.lvl;
    if(ch.cls==='P') return Math.max(1,Math.min(9,ch.lvl-8));
    return 0;
  }

  /* ---------------- thief skills ---------------- */
  const THIEF_SKILLS = ['pick','find','move','hide','hear','bs'];
  function thiefSkill(ch, key){
    const c=CLASSES[ch.cls]; if(c!==CLASSES.T) return 0;
    const r=raceOf(ch), s=effScores(ch);
    let v = THIEF_SKILLS.indexOf(key)*3 + (r.thief[key]||0) + (ch.lvl-1)*3 + abilityMod(s.dex);
    // diminishing returns
    v = Math.max(0, Math.min(95, Math.floor(v)));
    if(ch.fx&&ch.fx.thief&&ch.fx.thief[key]) v=Math.min(95,v+ch.fx.thief[key]);
    return v;
  }

  /* ---------------- combat stats ---------------- */
  function acOf(ch){
    const eq=ch.eq||{}; let ac=10;
    const armor = itemDef(eq.armor);
    if(armor && armor.ac!=null) ac = armor.ac;
    const sh = itemDef(eq.shield);
    if(sh && sh.acBonus) ac -= sh.acBonus;
    const dex = abilityMod(effScores(ch).dex);
    if(ch.cls!=='M' && (!armor || armor.light)) ac -= Math.max(0,dex);
    for(const slot of ['cloak','ring1','ring2','boots','gloves','belt','neck','charm']){
      const it=itemDef(eq[slot]); if(it&&it.fx&&it.fx.ac) ac-=it.fx.ac;
    }
    if(ch.fx&&ch.fx.ac) ac-=ch.fx.ac;
    if(ch.status&&ch.status.armorClass!=null) ac=ch.status.armorClass;
    return ac;
  }
  function itemDef(id){ return (typeof ITEMS!=='undefined'&&ITEMS[id])||null; }
  function attackMods(ch){
    const s=effScores(ch);
    const mods={hit:abilityMod(s.str),dmg:abilityMod(s.str)};
    // weapon magic, specialization etc applied at attack time via equipMods
    return mods;
  }
  function weaponOf(ch, slot){ return itemDef((ch.eq||{})[slot||'melee']); }
  // returns {toHit, dmgDice, dmgMod, attacks, reach}
  function weaponStats(ch, slot){
    const it = weaponOf(ch,slot||'melee');
    if(!it){ // unarmed fist
      return {toHit:abilityMod(effScores(ch).str), dmg:'1d2', dmgMod:abilityMod(effScores(ch).str), rate:'1/1'};
    }
    let w = it;
    // enchanted weapons carry a numeric dmg bonus; dice come from base item
    if(typeof w.dmg==='number' && it.base && ITEMS[it.base]) w = Object.assign({},ITEMS[it.base],it,{dmg:ITEMS[it.base].dmg});
    // specialization: if weapon family matches primary melee weapon
    const fam = ch.spec;
    const matches = fam && (it.fam===fam || (it.id||'')===fam || (it.base===fam));
    const hit = abilityMod(effScores(ch).str) + (matches?1:0) + (it.hit||0);
    const dmgMod = abilityMod(effScores(ch).str) + (matches?2:0) + (typeof it.dmg==='number'?it.dmg:0) + ((it.fx&&it.fx.dmg)||0);
    const half = matches? true : false;
    return {toHit:hit, dmg:w.dmg||'1d3', dmgMod, rate:w.rate||'1/1', half, item:it,
            twoHanded:!!w.twoHanded, missile:!!w.missile};
  }
  function attacksPerRound(ch){
    const n=ch.lvl-1;
    if(CLASSES[ch.cls].grp!=='warrior') return 1;
    if(n>=12) return 2;
    if(n>=6) return 1.5;
    return 1;
  }
  // specialization families
  const SPEC_FAMILIES = ['longsword','shortsword','bastardsword','greatsword','twohanded','battleaxe','handaxe','mace','flail','warhammer','spear','lance','trident','dagger','stiletto','club','quarterstaff','polearm','axe','bow','crossbow','sling','javelin','thrown'];

  /* ---------------- PC creation ---------------- */
  function rollScores(rng){
    rng=rng||Math.random;
    const s={};
    for(const k of ['str','dex','con','int','wis','cha']) s[k]=rollOneScore(rng);
    return s;
  }
  function rollOneScore(rng){
    rng=rng||Math.random;
    const r=[1+Math.floor(rng()*6),1+Math.floor(rng()*6),1+Math.floor(rng()*6),1+Math.floor(rng()*6)];
    r.sort((a,b)=>a-b);
    return r[1]+r[2]+r[3];
  }
  function exceptionalStr(rng){ // percentile for STR 18
    rng=rng||Math.random;
    const p=Math.floor(rng()*100); // 0-99
    const table=[13,14,15,16,17,18]; // approx mapping
    if(p<5) return '18/00'; if(p<15) return '18/01'; if(p<30) return '18/02';
    if(p<50) return '18/03'; if(p<75) return 18; return 18;
  }
  function legalClassFor(race, cls, scores){
    const r=RACES[race], c=CLASSES[cls];
    if(!r.cls.includes(cls)) return 'race';
    if(c.races&&!c.races.includes(race)) return 'race';
    for(const k in c.min) if(scores[k]<c.min[k]) return 'min:'+k;
    for(const k in r.limits){ if(scores[k]>r.limits[k][1]||scores[k]<r.limits[k][0]) return 'limit:'+k; }
    return null;
  }
  function makeCharacter(opts){
    // opts: {name,race,cls,align,color,scores?,lvl?,strx?,id?}
    const rng = opts.rng||Math.random;
    const scores = opts.scores || {str:rollOneScore(rng),dex:rollOneScore(rng),con:rollOneScore(rng),int:rollOneScore(rng),wis:rollOneScore(rng),cha:rollOneScore(rng)};
    const race=opts.race||'human', cls=opts.cls||'F', align=opts.align||'N';
    // race adjustments already applied? apply now on raw rolled scores (pre-adjustment)
    const adj = RACES[race].adj;
    const raw = {...scores};
    const ch = {
      id: opts.id || ('c'+Math.floor(rng()*1e9).toString(36)+Date.now().toString(36)),
      name:(opts.name||'Nameless').slice(0,20), race, cls, align,
      color: opts.color || ['#c8502c','#e3b54a','#6fae5c','#5a7fc8','#9a7fd4','#c87f9a'][Math.floor(rng()*6)],
      str:raw.str+ (adj.str||0), dex:raw.dex+(adj.dex||0), con:raw.con+(adj.con||0),
      int:raw.int+(adj.int||0), wis:raw.wis+(adj.wis||0), cha:raw.cha+(adj.cha||0),
      strx: opts.strx,
      lvl: opts.lvl||1, xp:0, hp:1, maxhp:1,
      eq:{melee:null,missile:null,armor:null,shield:null,ring1:null,ring2:null,cloak:null,boots:null,gloves:null,belt:null,neck:null,charm:null},
      inv:[], spec: opts.spec||null, foe: opts.foe||null,
      book:[], prep:{}, mem:{}, fx:{}, poison:null, dead:false, layUsed:false, lost:false,
      alignColor:opts.color,
    };
    if(cls==='M'){
      ch.book=['magic_missile','sleep','burning_hands','armor','shield'];
      ch.prep={}; ch.mem={};
      for(const s of ch.book) ch.prep[s]=1;
      ch.mem={magic_missile:1,sleep:1,burning_hands:1,armor:1,shield:1};
    }
    rollHp(ch, rng);
    ch.hp=ch.maxhp;
    if(cls==='T') ch.spec = null;
    return ch;
  }
  function hitDie(cls){ return CLASSES[cls].grp==='warrior'?'d10':CLASSES[cls].grp==='priest'?'d8':CLASSES[cls].grp==='thief'?'d6':'d4'; }
  function conHpBonus(ch){ return abilityMod(effScores(ch).con); }
  function rollHp(ch, rng){
    rng=rng||Math.random;
    const hd=hitDie(ch.cls);
    const maxRoll = hd==='d10'?10:hd==='d8'?8:hd==='d6'?6:4;
    const v = roll(hd,rng)+conHpBonus(ch);
    ch.maxhp = Math.max(1,v); ch.hp=Math.max(1,ch.hp||v);
    return ch.maxhp;
  }
  function hpGainOnLevel(ch, rng){
    rng=rng||Math.random;
    const grp=CLASSES[ch.cls].grp;
    let gain;
    if(ch.lvl<= (grp==='thief'||grp==='mage'?10:9)){
      gain = roll(hitDie(ch.cls),rng)+conHpBonus(ch);
    } else {
      gain = grp==='warrior'?3:grp==='priest'?2:grp==='thief'?2:1;
    }
    return Math.max(1,gain);
  }
  function levelUp(ch, rng){
    rng=rng||Math.random;
    ch.lvl = Math.min(20,ch.lvl+1);
    const g = hpGainOnLevel(ch,rng);
    ch.maxhp+=g; ch.hp+=g;
    if(ch.cls==='M' && ch.lvl>1){
      // compensate: learn one new spell of accessible level
      const known=new Set([...(ch.book||[])]);
      const avail = SPELLS_LIST.filter(s=>s.c==='M' && s.l<=Math.floor((ch.lvl-1)/2)+1 && !known.has(s.id));
      if(avail.length){ const s=avail[Math.floor(rng()*avail.length)]; ch.book.push(s.id); ch.prep[s.id]=1; }
    }
    return ch;
  }
  function canLevel(ch){ return ch.lvl<20 && ch.xp>=xpFor(ch.cls,ch.lvl+1); }

  /* ---------------- equipment helpers ---------------- */
  function equipChar(ch, itemId, slot){
    slot = slot || guessSlot(ch, itemId);
    if(!slot) return false;
    const prev = ch.eq[slot];
    if(prev) ch.inv.push(prev);
    ch.eq[slot]=itemId;
    return true;
  }
  function unequipChar(ch, slot){
    const it=ch.eq[slot]; if(!it) return null;
    ch.eq[slot]=null; ch.inv.push(it); return it;
  }
  function guessSlot(ch, id){
    const it=itemDef(id); if(!it) return null;
    if(it.t==='w'){ return it.missile?'missile':'melee'; }
    if(it.t==='a') return 'armor';
    if(it.t==='s') return 'shield';
    if(it.t==='m'){
      switch(it.slot){
        case 'ring': return (!ch.eq.ring1)?'ring1':(!ch.eq.ring2?'ring2':null);
        case 'cloak':return 'cloak';case 'boots':return 'boots';case 'gloves':return 'gloves';
        case 'belt':return 'belt';case 'neck':return 'neck';case 'charm':return 'charm';
        default:return null;
      }
    }
    return null;
  }
  function findRingSlot(ch){
    if(!ch.eq.ring1) return 'ring1'; if(!ch.eq.ring2) return 'ring2'; return null;
  }

  /* ---------------- time helpers ---------------- */
  function fmtTime(min){
    const day = Math.floor(min/1440)+1;
    const m = ((min%1440)+1440)%1440;
    const h=Math.floor(m/60), mm=m%60;
    const ap=h<12?'AM':'PM', hh=((h+11)%12)+1;
    return `Day ${day}, ${hh}:${String(mm).padStart(2,'0')} ${ap}`;
  }
  function timeLabel(min){ // short
    const m=((min%1440)+1440)%1440; const h=Math.floor(m/60),mm=m%60;
    const ap=h<12?'am':'pm', hh=((h+11)%12)+1;
    return `${hh}:${String(mm).padStart(2,'0')}${ap}`;
  }

  /* ---------------- grid repair ---------------- */
  const SAFE_CELL='.,=+Tn%~^F HBDLSG<>abcdefghijklmnopqrstuvwxyz0123456789';
  function normGrid(map){
    if(!map||!map.grid||!map.grid.length)return map;
    const g=map.grid, w=g[0].length;
    for(let y=0;y<g.length;y++){
      let r=g[y];
      if(r.length<w){ g[y]=r+'#'.repeat(w-r.length); }
      else if(r.length>w){
        // drop the last safe interior cell before the right border
        let i=-1;
        for(let j=w-1;j>=1;j--){ if('.,=+Tn%~^F '.includes(r[j])){i=j;break;} }
        if(i<0)i=w-2;
        g[y]=r.slice(0,i)+r.slice(i+1);
      }
    }
    return map;
  }
  function cellAt(map,x,y){
    if(!map||!map.grid)return '#';
    const g=map.grid;
    if(y<0||y>=g.length||x<0||x>=g[0].length)return '#';
    return g[y][x];
  }
  function setCellAt(map,x,y,c){
    const g=map.grid; if(y<0||y>=g.length||x<0||x>=g[0].length)return;
    g[y]=g[y].slice(0,x)+c+g[y].slice(x+1);
  }
  function passable(map,x,y,mods){
    let c=cellAt(map,x,y);
    if(mods){const m=mods[x+','+y];if(m)c=m;}
    // '#H^~' terrain walls; 'S' secret wall & 'L' locked door until mods reveal them
    if('#HB^~SL'.includes(c))return false;
    return true;
  }

  /* ---------------- misc ---------------- */
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rng=Math.random;
  const itemName = id => { const it=itemDef(id); return it?(it.n||it.name):String(id); };

  return {roll,rollDetail,describe,RACES,CLASSES,ALIGNMENTS,alignOk,XP,xpFor,nextXp,canLevel,
    abilityMod,effScores,thac0,saveTargets,saveRoll,slotTable,casterLevel,thac0,
    thiefSkill,acOf,attackMods,weaponStats,attacksPerRound,SPEC_FAMILIES,
    makeCharacter,rollScores,rollOneScore,hitDie,hpGainOnLevel,levelUp,rollHp,
    primeMult,canLevel,equipChar,unequipChar,guessSlot,findRingSlot,
    fmtTime,timeLabel,clamp,itemName,evalFixed,normGrid,cellAt,setCellAt,passable,rng};
})();
