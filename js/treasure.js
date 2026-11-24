/* Emberfall — treasure.js : weighted treasure tables + seeded generator */
'use strict';
const Treasure = (()=>{
  /* mulberry32 seeded PRNG */
  function mulberry32(seed){ let a=seed>>>0; return function(){ a|=0;a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
  /* category weights (spec) */
  const CAT_W={potion:20,scroll:15,ring:5,device:5,misc:15,armor:15,sword:11,weapon:14};
  /* pool tables by treasure tier 1..5 */
  const POOLS={
    potion:{1:['potion_heal','potion_antidote'],2:['potion_heal','potion_antidote','potion_serious'],3:['potion_serious','potion_critical','potion_antidote','potion_gainstr'],4:['potion_critical','potion_full','potion_restoration','potion_heroism','potion_invis'],5:['potion_full','potion_restoration','potion_heroism','potion_invis','potion_polymorph','potion_raise']},
    scroll:{1:['scroll:cure_light','scroll:magic_missile','scroll:sleep'],2:['scroll:hold_person','scroll:invisibility','scroll:strength','scroll:fireball'],3:['scroll:dispel_magic','scroll:ice_storm','scroll:stoneskin','scroll:slow'],4:['scroll:cone_of_cold','scroll:hold_monster','scroll:cloudkill','scroll:chain_lightning'],5:['scroll:disintegrate','scroll:flesh_to_stone','scroll:death_spell','scroll:resurrection']},
    ring:{1:['ring_protection1'],2:['ring_protection1','ring_protection2','ring_regen'],3:['ring_protection2','ring_regen','ring_fire','ring_cold'],4:['ring_protection2','ring_regen','ring_wizardry','ring_invis','ring_strength'],5:['ring_protection3','ring_regen','ring_wizardry','ring_invis','ring_strength','ring_protection_evil']},
    device:{1:['wand_magic_missile'],2:['wand_magic_missile','wand_paralysis','orb_protection'],3:['wand_fire','wand_lightning','wand_cold','staff_striking','orb_fire'],4:['wand_polymorph','wand_negation','staff_healing','staff_fire'],5:['wand_wonder','staff_power','rod_might','rod_rulership']},
    misc:{1:['gem','rope','torch','rations','holy_water','mirror','thieves_tools'],2:['gem','pearl','silver_coin','gold_coin','rope','thieves_tools'],3:['sapphire','ruby','emerald','diamond','silver_coin','gold_coin','ivory_tusk','silk_bolt'],4:['diamond','ruby','emerald','sapphire','gold_cup','silver_locket'],5:['diamond','ruby','emerald','sapphire','gold_cup','ivory_tusk','silk_bolt']},
    armor:{1:['leather','padded','shield_wood'],2:['studded','ring_mail','scale','hide','shield_steel'],3:['chain','banded','splint','shield_tower'],4:['plate','splint','elven_chain','shield_spell'],5:['plate','elven_chain','shield_spell']},
    sword:{1:['shortsword','longsword','dagger','mace','battleaxe','handaxe'],2:['longsword+1','mace+1','battleaxe+1','dagger+1','warhammer+1','morningstar+1'],3:['longsword+1','longsword+2','bastardsword+1','flail+1','spear+1','sword_wounding'],4:['longsword+2','longsword+3','twohandedsword+1','sunblade','demonbane','mace_disruption'],5:['longsword+3','vorpal','giantslayer','lifedrinker','dwarven_thrower','holy_avenger']},
    weapon:{1:['club','spear','quarterstaff','sling','dart','javelin','handaxe'],2:['shortbow','longbow','crossbow','lightcrossbow','silver_dagger','silver_longsword','silver_mace'],3:['longbow+1','crossbow+1','silver_bow','silver_axe','staff'],4:['longbow+2','silver_bow','dwarven_thrower','flametongue'],5:['holy_avenger','vorpal','giantslayer','dwarven_thrower']},
  };
  /* weighted pick at-or-below tier, favoring newer tiers at depth */
  function pickFromPool(rng,poolKey,tier){
    const entries=[];
    for(let t=1;t<=Math.min(5,tier);t++){
      for(const id of (POOLS[poolKey][t]||[])){
        // weight: newer tiers favored; older get small weight
        const w = t===tier?8 : t===tier-1?5 : 2;
        entries.push({id,w});
      }
    }
    let tot=0; for(const e of entries) tot+=e.w;
    let r=rng()*tot;
    for(const e of entries){ r-=e.w; if(r<=0) return e.id; }
    return entries[entries.length-1].id;
  }
  function rollCategory(rng){
    let tot=0; for(const k in CAT_W) tot+=CAT_W[k];
    let r=rng()*tot;
    for(const k in CAT_W){ r-=CAT_W[k]; if(r<=0) return k; }
    return 'misc';
  }
  /* roll treasure: {gold, items:[itemIds]} — deterministic given seed */
  function roll(rng,characterLevel,kind){
    kind=kind||'ordinary';
    rng=rng||Math.random;
    const tier=Math.max(1,Math.min(5,Math.ceil(characterLevel/4)));
    // coin scale: 25 * lvl^1.45 * (0.6..1.4), multipliers: ordinary 1, cache 2, hoard 6
    const mult=kind==='hoard'?6:kind==='cache'?2:1;
    const base=Math.round(25*Math.pow(characterLevel,1.45)*(0.6+rng()*0.8)*mult/5)*5;
    const gold=Math.max(0,base);
    const nItems = kind==='hoard'?3+Math.floor(rng()*3):kind==='cache'?2+Math.floor(rng()*2):1+Math.floor(rng()*2);
    const items=[];
    for(let i=0;i<nItems;i++){
      let cat=rollCategory(rng);
      // hoard may roll one tier higher
      let t=tier; if(kind==='hoard'&&rng()<0.3) t=Math.min(5,tier+1);
      let id=pickFromPool(rng,cat,t);
      // scrolls resolve dynamically
      if(cat==='scroll'){ items.push('scroll:'+id.slice(7)); }
      else items.push(id);
      // devices get charges
      if(cat==='device'){
        const def=item(id); if(def&&def.charges) items[items.length-1]=id+'#'+def.charges;
      }
    }
    return {gold,items};
  }
  return {mulberry32,roll,pickFromPool,rollCategory};
})();
