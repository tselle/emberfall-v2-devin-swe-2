/* Emberfall — data.js : base ITEMS, SHOPS, SPELLS, MONSTERS, MAPS, QUESTS, heroes */
'use strict';
/* ============================ ITEMS ============================ */
const ITEMS = {};
function _it(id,o){ o.id=id; ITEMS[id]=o; return o; }
/* weapons: w=melee/missile. dmg dice, rate 'a/b' attacks per round, hit/dmg magic bonus, fam for spec */
const W=(id,n,dmg,o)=>_it(id,Object.assign({n,t:'w',dmg,price:o&&o.price||10,desc:o&&o.desc||''},o));
W('dagger','Dagger','1d4',{price:4,fam:'dagger',thrown:'1d4',desc:'Small blade. Can be thrown.'});
W('shortsword','Short Sword','1d6',{price:8,fam:'shortsword',desc:'Quick one-handed blade.'});
W('longsword','Long Sword','1d8',{price:15,fam:'longsword',thrown:'1d6',desc:'The soldier\'s blade.'});
W('bastardsword','Bastard Sword','1d8',{price:35,fam:'bastardsword',twoHanded:true,desc:'Two-handed arming sword.'});
W('greatsword','Great Sword','2d4',{price:50,fam:'greatsword',twoHanded:true,desc:'Heavy two-handed blade.'});
W('twohandedsword','Two-Handed Sword','1d10',{price:75,fam:'twohanded',twoHanded:true,desc:'Massive two-handed sword.'});
W('mace','Mace','1d6',{price:5,fam:'mace',desc:'Blunt weapon; good vs undead.'});
W('morningstar','Morning Star','1d8',{price:12,fam:'morningstar',desc:'Spiked ball on a chain.'});
W('flail','Flail','1d6',{price:8,fam:'flail',desc:'Spiked ball flail.'});
W('warhammer','War Hammer','1d6',{price:12,fam:'warhammer',desc:'Crushing hammer.'});
W('battleaxe','Battle Axe','1d8',{price:10,fam:'battleaxe',desc:'Heavy chopping axe.'});
W('handaxe','Hand Axe','1d6',{price:6,fam:'handaxe',thrown:'1d6',desc:'Throwing axe.'});
W('spear','Spear','1d6',{price:2,fam:'spear',thrown:'1d6',desc:'Can be thrown or braced.'});
W('trident','Trident','1d8',{price:10,fam:'trident',desc:'Three-pronged spear.'});
W('club','Club','1d4',{price:1,fam:'club',desc:'Wooden cudgel.'});
W('quarterstaff','Quarterstaff','1d6',{price:2,fam:'quarterstaff',desc:'Six-foot staff.'});
W('shortbow','Short Bow','1d6',{price:25,missile:true,range:3,fam:'bow',desc:'Fast small bow.'});
W('longbow','Long Bow','1d8',{price:35,missile:true,range:5,fam:'bow',desc:'Long-range bow.'});
W('crossbow','Crossbow','1d8',{price:30,missile:true,range:4,rate:'1/2',fam:'crossbow',desc:'Slow but powerful.'});
W('lightcrossbow','Light Crossbow','1d6',{price:20,missile:true,range:4,rate:'1/2',fam:'crossbow',desc:'Hand crossbow.'});
W('sling','Sling','1d3',{price:1,missile:true,range:4,fam:'sling',desc:'Simple sling.'});
W('dart','Dart','1d3',{price:0.2,missile:true,range:3,fam:'thrown',thrown:'1d3',desc:'Thrown dart.'});
W('javelin','Javelin','1d6',{price:1,missile:true,range:4,fam:'thrown',thrown:'1d6',desc:'Throwing spear.'});
W('staff','Staff','1d4',{price:3,fam:'staff',desc:'Plain wooden staff.'});
W('silver_dagger','Silver Dagger','1d4',{price:25,fam:'dagger',silver:true,desc:'Counts as silver for silver-only foes.'});
W('silver_longsword','Silver Long Sword','1d8',{price:60,fam:'longsword',silver:true,desc:'Silver blade for the accursed.'});
W('silver_mace','Silver Mace','1d6',{price:45,fam:'mace',silver:true,desc:'Silver mace.'});
W('silver_axe','Silver Battle Axe','1d8',{price:55,fam:'battleaxe',silver:true,desc:'Silver axe.'});
W('silver_bow','Silver Long Bow','1d8',{price:90,missile:true,range:5,fam:'bow',silver:true,desc:'Silver arrows for the accursed.'});
/* enchanted weapons */
const EW=(id,n,base,o)=>_it(id,Object.assign({n,t:'w',dmg:ITEMS[base].dmg,price:o&&o.price||80,fam:ITEMS[base].fam,missile:ITEMS[base].missile,range:ITEMS[base].range,thrown:ITEMS[base].thrown,twoHanded:ITEMS[base].twoHanded,base,desc:o&&o.desc||('Magic '+ITEMS[base].n)},o));
EW('longsword+1','Long Sword +1','longsword',{hit:1,dmg:1});
EW('longsword+2','Long Sword +2','longsword',{hit:2,dmg:2});
EW('longsword+3','Long Sword +3','longsword',{hit:3,dmg:3});
EW('shortsword+1','Short Sword +1','shortsword',{hit:1,dmg:1});
EW('shortsword+2','Short Sword +2','shortsword',{hit:2,dmg:2});
EW('mace+1','Mace +1','mace',{hit:1,dmg:1});
EW('mace+2','Mace +2','mace',{hit:2,dmg:2});
EW('battleaxe+1','Battle Axe +1','battleaxe',{hit:1,dmg:1});
EW('dagger+1','Dagger +1','dagger',{hit:1,dmg:1});
EW('dagger+2','Dagger +2','dagger',{hit:2,dmg:2});
EW('dagger+3','Dagger +3','dagger',{hit:3,dmg:3});
EW('warhammer+1','War Hammer +1','warhammer',{hit:1,dmg:1});
EW('morningstar+1','Morning Star +1','morningstar',{hit:1,dmg:1});
EW('flail+1','Flail +1','flail',{hit:1,dmg:1});
EW('handaxe+1','Hand Axe +1','handaxe',{hit:1,dmg:1});
EW('spear+1','Spear +1','spear',{hit:1,dmg:1});
EW('longbow+1','Long Bow +1','longbow',{hit:1,dmg:1});
EW('longbow+2','Long Bow +2','longbow',{hit:2,dmg:2});
EW('shortbow+1','Short Bow +1','shortbow',{hit:1,dmg:1});
EW('crossbow+1','Crossbow +1','crossbow',{hit:1,dmg:1});
EW('twohandedsword+1','Two-Handed Sword +1','twohandedsword',{hit:1,dmg:1});
EW('bastardsword+1','Bastard Sword +1','bastardsword',{hit:1,dmg:1});
_it('flametongue', {n:'Flame Tongue',t:'w',dmg:'1d8',price:4000,fam:'longsword',base:'longsword',desc:'Longsword wreathed in fire. 1d6 fire damage, ignites wood.',fx:{fire:'1d6'}});
_it('vorpal', {n:'Vorpal Sword',t:'w',dmg:'1d8',price:8000,fam:'longsword',base:'longsword',desc:'On a natural 20, decapitates.',fx:{vorpal:true}});
_it('demonbane', {n:'Demonbane',t:'w',dmg:'1d8',price:5000,fam:'longsword',base:'longsword',desc:'+2 hit/damage vs demons and devils; disrupts.',fx:{hit:2,dmg:2,disrupt:['demon','devil']}});
_it('giantslayer', {n:'Giant Slayer',t:'w',dmg:'1d10',price:6000,fam:'twohanded',twoHanded:true,base:'twohandedsword',desc:'+4 hit vs giants, double damage on a hit.',fx:{giant:4,giantDmg:2}});
_it('lifedrinker', {n:'Lifedrinker',t:'w',dmg:'1d8',price:7000,fam:'longsword',base:'longsword',desc:'Heals 1 HP per hit dealt.',fx:{lifedrain:1}});
_it('dwarven_thrower', {n:'Dwarven Thrower',t:'w',dmg:'1d6',price:6000,fam:'handaxe',thrown:'1d6',missile:true,base:'handaxe',desc:'Returns to hand; +2 hit/damage; kills giants.',fx:{returning:true,hit:2,dmg:2,giantKill:true}});
_it('holy_avenger', {n:'Holy Avenger',t:'w',dmg:'2d4',price:20000,fam:'greatsword',twoHanded:true,base:'greatsword',desc:'Blessed blade; +3 hit/damage; bane of evil.',fx:{hit:3,dmg:3,baneEvil:true}});
_it('mace_disruption', {n:'Mace of Disruption',t:'w',dmg:'1d6',price:4000,fam:'mace',base:'mace',desc:'+1 hit; disrupts undead on hit.',fx:{hit:1,dmg:1,disrupt:['undead']}});
_it('sword_wounding', {n:'Sword of Wounding',t:'w',dmg:'1d8',price:3000,fam:'longsword',base:'longsword',desc:'+1 hit; wounds ignore armor.',fx:{hit:1,dmg:1,ignoreArmor:1}});
_it('nine_lives', {n:'Sword of Nine Lives',t:'w',dmg:'1d8',price:15000,fam:'longsword',base:'longsword',desc:'Grants 1 extra life.',fx:{lives:1}});
_it('sunblade', {n:'Sunblade',t:'w',dmg:'1d8',price:9000,fam:'longsword',base:'longsword',desc:'+2 hit/damage vs undead; holy light.',fx:{hit:2,dmg:2,undeadBonus:2}});
/* armor */
const A=(id,n,ac,o)=>_it(id,Object.assign({n,t:'a',ac,price:o&&o.price||20,desc:o&&o.desc||''},o));
A('padded','Padded Armor',8,{price:5,light:true});
A('leather','Leather Armor',7,{price:8,light:true});
A('studded','Studded Leather',6,{price:15,light:true});
A('ring_mail','Ring Mail',6,{price:20});
A('scale','Scale Mail',5,{price:30});
A('chain','Chain Mail',5,{price:30});
A('banded','Banded Mail',4,{price:45});
A('splint','Splint Mail',4,{price:60});
A('plate','Plate Mail',3,{price:120});
A('elven_chain','Elven Chain',5,{price:400,light:true,desc:'Silent elven mail.'});
A('hide','Hide Armor',7,{price:10,light:true});
/* shields */
const S=(id,n,b,o)=>_it(id,Object.assign({n,t:'s',acBonus:b,price:o&&o.price||3,desc:o&&o.desc||''},o));
S('shield_wood','Wooden Shield',1,{price:1});
S('shield_steel','Steel Shield',1,{price:5});
S('shield_tower','Tower Shield',2,{price:10});
S('shield_spell','Spell Guard Shield',2,{price:3000,fx:{spellGuard:1},desc:'Grants resistance to spells.'});
/* worn items (m) */
const M=(id,n,slot,o)=>_it(id,Object.assign({n,t:'m',slot,price:o&&o.price||50,desc:o&&o.desc||''},o));
M('ring_protection1','Ring of Protection +1','ring',{fx:{ac:1},price:1000});
M('ring_protection2','Ring of Protection +2','ring',{fx:{ac:2},price:4000});
M('ring_protection3','Ring of Protection +3','ring',{fx:{ac:3},price:9000});
M('ring_regen','Ring of Regeneration','ring',{fx:{regen:1},price:6000,desc:'Regenerate 1 HP/round.'});
M('ring_fire','Ring of Fire Resistance','ring',{fx:{resist:{fire:50}},price:5000});
M('ring_cold','Ring of Cold Resistance','ring',{fx:{resist:{cold:50}},price:5000});
M('ring_electric','Ring of Electrical Resistance','ring',{fx:{resist:{electric:50}},price:5000});
M('ring_invis','Ring of Invisibility','ring',{fx:{invis:1},price:8000,desc:'Invisible on command.'});
M('ring_wizardry','Ring of Wizardry','ring',{fx:{wizardry:1},price:9000,desc:'Doubles mage spell slots.'});
M('ring_strength','Ring of Strength','ring',{fx:{str:1},price:7000,desc:'+1 STR.'});
M('ring_protection_evil','Ring of Protection from Evil','ring',{fx:{protEvil:1},price:3000});
M('cloak_protection1','Cloak of Protection +1','cloak',{fx:{ac:1},price:1000});
M('cloak_protection2','Cloak of Protection +2','cloak',{fx:{ac:2},price:4000});
M('cloak_elvenkind','Cloak of Elvenkind','cloak',{fx:{hide:15},price:3000,desc:'Harder to spot.'});
M('cloak_displacement','Cloak of Displacement','cloak',{fx:{displacement:1},price:6000});
M('boots_speed','Boots of Speed','boots',{fx:{speed:1},price:5000,desc:'Move as if MV doubled.'});
M('boots_striding','Boots of Striding','boots',{fx:{mv:2},price:1500,desc:'+2 movement.'});
M('boots_levitation','Boots of Levitation','boots',{fx:{levitate:1},price:4000});
M('gloves_ogre','Gauntlets of Ogre Power','gloves',{fx:{str:2},price:8000,desc:'+2 STR (18 max).'});
M('gloves_dexterity','Gauntlets of Dexterity','gloves',{fx:{dex:1},price:4000});
M('gloves_thievery','Gloves of Thievery','gloves',{fx:{thief:{pick:10,find:10,move:10,hide:10}},price:5000});
M('belt_giant','Belt of Giant Strength','belt',{fx:{str:4},price:12000,desc:'+4 STR.'});
M('belt_fire','Belt of Fire Resistance','belt',{fx:{resist:{fire:50}},price:4000});
M('belt_cold','Belt of Cold Resistance','belt',{fx:{resist:{cold:50}},price:4000});
M('neck_proof_poison','Periapt of Proof vs Poison','neck',{fx:{vsPoison:1},price:3000});
M('neck_amulet','Amulet of Natural Armor','neck',{fx:{ac:2},price:5000});
M('charm_lucky','Lucky Charm','charm',{fx:{luck:1},price:2000,desc:'Small fortune.'});
M('charm_protection','Protection Charm','charm',{fx:{ac:1},price:1500});
/* potions */
const P=(id,n,o)=>_it(id,Object.assign({n,t:'p',price:o&&o.price||50,desc:o&&o.desc||''},o));
P('potion_heal','Potion of Healing',{price:50,power:'heal_light',desc:'Restores 2d4+2 HP.'});
P('potion_serious','Potion of Extra Healing',{price:100,power:'heal_serious',desc:'Restores 2d8+1 HP.'});
P('potion_critical','Potion of Supreme Healing',{price:150,power:'heal_critical',desc:'Restores 3d8+3 HP.'});
P('potion_full','Potion of Full Healing',{price:400,power:'heal_full',desc:'Fully restores HP.'});
P('potion_poison','Potion of Poison',{price:30,power:'poison',desc:'Poisons the drinker.'});
P('potion_antidote','Potion of Antidote',{power:'antidote',desc:'Cures poison.',price:40});
P('potion_gainstr','Potion of Gain Strength',{power:'gain_str',desc:'+1d4 STR for an hour.',price:200});
P('potion_heroism','Potion of Heroism',{power:'heroism',desc:'+1 to hit and damage for 1 hour.',price:200});
P('potion_fire','Potion of Fire Breath',{power:'fire_breath',desc:'Breathes fire in combat.',price:150});
P('potion_cold','Potion of Cold Breath',{power:'cold_breath',desc:'Breathes cold in combat.',price:150});
P('potion_invis','Potion of Invisibility',{power:'invis',desc:'Invisible for a time.',price:300});
P('potion_polymorph','Potion of Polymorph',{power:'polymorph_self',desc:'Transform self.',price:600});
P('potion_raise','Potion of Raising',{power:'raise_dead',desc:'Raises the dead.',price:5000});
P('potion_restoration','Potion of Restoration',{power:'restoration',desc:'Cures afflictions.',price:400});
/* devices */
const D=(id,n,o)=>_it(id,Object.assign({n,t:'d',price:o&&o.price||200,desc:o&&o.desc||''},o));
D('wand_magic_missile','Wand of Magic Missile',{dev:{powers:['magic_missile'],level:1},charges:3,price:500});
D('wand_fire','Wand of Fire',{dev:{powers:['burning_hands','fireball'],level:5},charges:4,price:2000});
D('wand_lightning','Wand of Lightning',{dev:{powers:['lightning_bolt'],level:3},charges:4,price:2500});
D('wand_cold','Wand of Cold',{dev:{powers:['ice_storm','cone_of_cold'],level:5},charges:4,price:2500});
D('wand_paralysis','Wand of Paralysis',{dev:{powers:['hold_person'],level:2},charges:5,price:1500});
D('wand_polymorph','Wand of Polymorph',{dev:{powers:['polymorph'],level:4},charges:3,price:5000});
D('wand_negation','Wand of Negation',{dev:{powers:['dispel_magic'],level:3},charges:5,price:2000});
D('wand_wonder','Wand of Wonder',{dev:{powers:['wonder'],level:1,random:true},charges:4,price:8000,desc:'Calls a random spell.'});
D('rod_might','Rod of Lordly Might',{dev:{powers:['call_lightning','fireball'],level:6},charges:3,price:9000});
D('rod_rulership','Rod of Rulership',{dev:{powers:['hold_person','hold_monster'],level:5},charges:3,price:7000});
D('staff_power','Staff of Power',{dev:{powers:['fireball','lightning_bolt','ice_storm'],level:6},charges:8,price:15000});
D('staff_striking','Staff of Striking',{dev:{powers:['magic_missile'],level:2},charges:8,price:2500,desc:'Strikes like a +2 weapon.'});
D('staff_healing','Staff of Healing',{dev:{powers:['cure_light','cure_serious','cure_critical','heal'],level:4,camp:true},charges:8,price:5000});
D('staff_fire','Staff of Fire',{dev:{powers:['burning_hands','fireball','flame_strike'],level:5},charges:6,price:8000});
M('staff_wizardry','Staff of Wizardry','ring',{fx:{wizardry:1},price:9000,desc:'Doubles mage spell slots.'});
M('orb_protection','Orb of Protection','neck',{fx:{saveAll:1},price:6000,desc:'+1 all saves.'});
D('orb_fire','Orb of Fire',{dev:{powers:['fireball'],level:5},charges:3,price:6000});
/* ability books (k) */
const K=(id,n,ability,o)=>_it(id,Object.assign({n,t:'k',ability,price:o&&o.price||800,desc:o&&o.desc||('Study to raise '+ability+' by 1 (max 18).')},o));
K('book_str','Book of Strength','str'); K('book_dex','Book of Dexterity','dex'); K('book_con','Book of Constitution','con');
K('book_int','Book of Intelligence','int'); K('book_wis','Book of Wisdom','wis'); K('book_cha','Book of Charisma','cha');
/* valuables (v) */
const V=(id,n,val,o)=>_it(id,Object.assign({n,t:'v',value:val,price:o&&o.price||val,desc:o&&o.desc||''},o));
V('gem','Gem',25); V('pearl','Pearl',50); V('sapphire','Sapphire',100); V('ruby','Ruby',100); V('emerald','Emerald',150);
V('diamond','Diamond',300); V('gold_cup','Gold Cup',150); V('silver_locket','Silver Locket',60); V('ivory_tusk','Ivory Tusk',80); V('silk_bolt','Bolt of Silk',40);
V('gold_coin','Gold Coin',1); V('silver_coin','Silver Coin',0.1); V('copper_coin','Copper Coin',0.01);
/* quest items */
_it('cellar_key',{n:'Brass Cellar Key',t:'q',price:0,desc:'Opens Skarrik\'s locked cellar.'});
_it('widow_ring',{n:"Widow Marrow's Ring",t:'q',price:0,desc:'Return to Widow Marrow.'});
_it('dawn_reliquary',{n:'Dawn Reliquary',t:'q',price:0,desc:'A relic of the Abbey of the Dawn.'});
_it('ogre_key',{n:"Ogre's Iron Key",t:'q',price:0,desc:'Opens the barrow descent.'});
_it('iron_king_seal',{n:"Iron King's Seal",t:'q',price:0,desc:'Proof of the Iron King\'s fall.'});
_it('foreman_tally',{n:"Foreman's Tally Book",t:'q',price:0,desc:'Record of the mine\'s yield.'});
_it('patrol_badges',{n:'Patrol Badges',t:'q',price:0,desc:'Twelve badges of the Ravenmoor patrol.'});
_it('gnashrot_head',{n:"Gnashrot's Head",t:'q',price:0,desc:'The troll chieftain\'s head.'});
_it('tamsin_medal',{n:"Tamsin's Token",t:'q',price:0,desc:'A Hask family token.'});
_it('witch_crown',{n:'Witch-Queen\'s Crown',t:'q',price:0,desc:'Vharra\'s crown.'});
/* generic supplies */
_it('rope',{n:'Rope (50 ft)',t:'v',value:10,price:10,desc:'Useful in dungeons.'});
_it('torch',{n:'Torch',t:'v',value:0.1,price:1,desc:'Burns for an hour.'});
_it('rations',{n:'Rations',t:'v',value:5,price:5,desc:'A day\'s food.'});
_it('holy_water',{n:'Holy Water',t:'v',value:25,price:25,desc:'Burns the unclean.'});
_it('mirror',{n:'Mirror',t:'v',value:10,price:10,desc:'Shows your reflection.'});
_it('thieves_tools',{n:'Thieves\' Tools',t:'v',value:25,price:25,desc:'Pick locks and disarm traps.'});
_it('ladder',{n:'Ladder',t:'v',value:5,price:5,desc:'Ten feet of rope ladder.'});
/* scroll resolver */
function item(id){
  if(!id) return null;
  if(ITEMS[id]) return ITEMS[id];
  if(id.startsWith('scroll:')){
    const sid=id.slice(7); const sp=SPELLS[sid];
    return sp?{id,n:'Scroll of '+sp.name,t:'x',spell:sid,price:SPELL_PRICE[sp.l]||50,desc:'A spell scroll.'}:null;
  }
  const h=id.indexOf('#');
  if(h>0 && ITEMS[id.slice(0,h)]){
    const base=ITEMS[id.slice(0,h)];
    return Object.assign({},base,{id,charges:parseInt(id.slice(h+1),10)});
  }
  return null;
}
const SPELL_PRICE={1:25,2:75,3:150,4:300,5:600,6:1200,7:2000,8:4000,9:8000};
const ITEM_LIST=Object.keys(ITEMS);

/* ============================ SHOPS ============================ */
const SHOPS={
  general:{name:'General Goods',stock:['rope','torch','rations','holy_water','mirror','thieves_tools','ladder','sling','dart','club','spear','leather','shield_wood','potion_heal','potion_antidote'],buys:true},
  armory:{name:'Outfitter',stock:['leather','studded','hide','ring_mail','scale','chain','banded','splint','plate','shield_wood','shield_steel','shield_tower','shortsword','longsword','mace','battleaxe','handaxe','warhammer','morningstar','flail','spear','trident','club','quarterstaff','staff','shortbow','longbow','crossbow','sling','dart','javelin','silver_dagger','silver_longsword','silver_mace','silver_axe','silver_bow','dagger','longsword+1','mace+1','battleaxe+1','longbow+1','potion_heal'],buys:true},
  apothecary:{name:'Apothecary',stock:['potion_heal','potion_serious','potion_critical','potion_full','potion_poison','potion_antidote','potion_gainstr','potion_heroism','potion_fire','potion_cold','potion_invis','potion_polymorph','potion_raise','potion_restoration','wand_magic_missile','wand_paralysis','staff_healing','orb_protection'],buys:true},
};

/* ============================ SPELLS ============================ */
/* c:'M' wizard, 'C' priest. tgt: enemy|ally|self|party|area|cone|line|explore. range in tiles. */
const SPELLS={};
function _sp(id,n,c,l,tgt,o){o=Object.assign({n,tgt,range:o&&o.range||5,c,l,desc:o&&o.desc||''},o);SPELLS[id]=o;return o;}
/* wizard 1 */
_sp('magic_missile','Magic Missile','M',1,'enemy',{auto:true,dmg:'1d4+1',desc:'2d4 missiles (1d4+1 each) auto-hit.'});
_sp('sleep','Sleep','M',1,'area',{hd:'2d4',radius:1,desc:'Puts HD-worth of creatures to sleep.'});
_sp('burning_hands','Burning Hands','M',1,'cone',{len:3,dmg:'1d6',per:1,desc:'Cone of fire, 1d6 per level.'});
_sp('armor','Armor','M',1,'self',{ac:6,dur:'dmg8',desc:'AC 6 until 8+level damage taken.'});
_sp('shield','Shield','M',1,'self',{block:'magic_missile',dur:'rounds:5',desc:'Blocks magic missile & minor spells.'});
_sp('color_spray','Color Spray','M',1,'area',{radius:1,save:2,blind:'1d4 rounds',desc:'Blinds on failed save.'});
_sp('spook','Spook','M',1,'area',{radius:1,save:0,flee:'1d4 rounds',desc:'Frightens creatures.'});
/* wizard 2 */
_sp('stinking_cloud','Stinking Cloud','M',2,'area',{radius:2,dur:'6 rounds',nausea:true,desc:'Nauseating cloud; repeated saves.'});
_sp('mirror_image','Mirror Image','M',2,'self',{images:2,desc:'Creates mirror images that intercept hits.'});
_sp('strength','Strength','M',2,'ally',{str:1,dur:'1 hour',desc:'+1d4 STR for 1 hour.'});
_sp('knock','Knock','M',2,'explore',{desc:'Opens a locked door.'});
_sp('web','Web','M',2,'area',{radius:2,dur:'4 rounds',immobilize:true,desc:'Webs a 2-square area.'});
_sp('acid_arrow','Acid Arrow','M',2,'enemy',{dmg:'1d8',acid:true,desc:'Arrow of acid, ignores some AC.'});
_sp('invisibility','Invisibility','M',2,'ally',{invis:'perm',desc:'Makes target invisible.'});
_sp('blindness','Blindness','M',2,'enemy',{save:1,desc:'Blinds target.'});
_sp('scare','Scare','M',2,'area',{radius:2,flee:true,save:0,desc:'Causes fear.'});
/* wizard 3 */
_sp('fireball','FireBall','M',3,'area',{radius:2.3,range:12,dmg:'10d6',desc:'Fireball, save for half; hits allies too.'});
_sp('lightning_bolt','Lightning Bolt','M',3,'line',{len:12,dmg:'6d6',desc:'Line of lightning.'});
_sp('haste','Haste','M',3,'party',{haste:true,dur:'5 rounds',desc:'Doubles movement and attacks.'});
_sp('hold_person','Hold Person','M',3,'enemy',{save:0,hold:true,dur:'1d4 rounds',desc:'Paralyzes a person.'});
_sp('slow','Slow','M',3,'area',{radius:2,slow:true,dur:'5 rounds',desc:'Slows enemies, can undo haste.'});
_sp('dispel_magic','Dispel Magic','M',3,'enemy',{dispel:3,desc:'Dispel magical effects.'});
_sp('vampiric_touch','Vampiric Touch','M',3,'enemy',{dmg:'1d10',drain:true,desc:'Drains life to heal caster.'});
/* wizard 4 */
_sp('ice_storm','Ice Storm','M',4,'area',{radius:2,dmg:'3d10',desc:'Hail of ice.'});
_sp('stoneskin','Stoneskin','M',4,'ally',{acBonus:2,charges:'1d8',desc:'+2 AC, absorbs blows.'});
_sp('fear','Fear','M',4,'area',{radius:2,flee:true,save:0,desc:'Powerful fear.'});
/* wizard 5 */
_sp('cone_of_cold','Cone of Cold','M',5,'cone',{len:5,dmg:'8d8',desc:'Cone of cold, save half.'});
_sp('hold_monster','Hold Monster','M',5,'enemy',{save:0,hold:true,dur:'1d4 rounds',desc:'Holds any monster.'});
_sp('cloudkill','Cloudkill','M',5,'area',{radius:2,dmg:'2d8',desc:'Poison gas kills.'});
/* wizard 6 */
_sp('chain_lightning','Chain Lightning','M',6,'enemy',{dmg:'6d6',chain:2,desc:'Lightning arcs to nearby foes.'});
_sp('disintegrate','Disintegrate','M',6,'enemy',{save:0,desc:'Disintegrates on failed save.'});
_sp('flesh_to_stone','Flesh to Stone','M',6,'enemy',{save:0,petrify:true,desc:'Turns to stone.'});
_sp('death_spell','Death Spell','M',6,'area',{radius:3,dmg:'3d10',desc:'Kills the weak.'});
/* wizard 7 */
_sp('delayed_blast','Delayed Blast Fireball','M',7,'area',{radius:3,dmg:'10d6+10',delay:true,desc:'Delayed fireball.'});
_sp('finger_of_death','Finger of Death','M',7,'enemy',{save:0,desc:'Death on failed save.'});
_sp('power_word_stun','Power Word Stun','M',7,'enemy',{hpMax:40,stun:true,desc:'Stuns creatures ≤40 HP.'});
/* wizard 8 */
_sp('incendiary_cloud','Incendiary Cloud','M',8,'area',{radius:3,dur:'3 rounds',dmg:'6d6',desc:'Burning cloud.'});
_sp('power_word_blind','Power Word Blind','M',8,'enemy',{hpMax:80,blind:true,desc:'Blinds ≤80 HP.'});
/* wizard 9 */
_sp('meteor_swarm','Meteor Swarm','M',9,'area',{radius:3,dmg:'8d6',count:4,desc:'Four meteors.'});
_sp('power_word_kill','Power Word Kill','M',9,'enemy',{hpMax:20,desc:'Instant death ≤20 HP.'});
/* priest 1 */
_sp('cure_light','Cure Light Wounds','C',1,'ally',{heal:'1d8',desc:'Heals 1d8 HP.'});
_sp('bless','Bless','C',1,'party',{hit:1,dur:'4 rounds',desc:'+1 to hit.'});
_sp('protection_evil','Protection from Evil','C',1,'party',{vsEvil:true,dur:'5 rounds',desc:'Defends vs evil.'});
_sp('command','Command','C',1,'enemy',{save:0,flee:true,dur:'1 round',desc:'Commands a creature.'});
_sp('cause_light','Cause Light Wounds','C',1,'enemy',{dmg:'1d6',save:0,desc:'Hurts undead/evil.'});
_sp('magical_stone','Magical Stone','C',1,'self',{dmg:'2d4',ranged:true,desc:'Hurls a magical stone.'});
/* priest 2 */
_sp('hold_person_c','Hold Person','C',2,'enemy',{save:0,hold:true,dur:'1d4 rounds',desc:'Holds a person.'});
_sp('aid','Aid','C',2,'party',{acBonus:1,dur:'4 rounds',desc:'+1 AC to party.'});
_sp('slow_poison','Slow Poison','C',2,'ally',{desc:'Slows poison.'});
_sp('silence','Silence 15 Radius','C',2,'area',{radius:1,silence:true,dur:'5 rounds',desc:'Silences area.'});
_sp('resist_fire','Resist Fire','C',2,'party',{resist:{fire:50},dur:'5 rounds',desc:'Resist fire.'});
_sp('resist_cold','Resist Cold','C',2,'party',{resist:{cold:50},dur:'5 rounds',desc:'Resist cold.'});
/* priest 3 */
_sp('prayer','Prayer','C',3,'party',{hit:1,dmg:1,dur:'4 rounds',desc:'+1 hit & damage party.'});
_sp('dispel_magic_c','Dispel Magic','C',3,'enemy',{dispel:3,desc:'Dispel magic.'});
_sp('remove_paralysis','Remove Paralysis','C',3,'ally',{desc:'Removes paralysis.'});
_sp('magical_vestment','Magical Vestment','C',3,'ally',{acBonus:1,dur:'2 hours',desc:'+1 AC to armor.'});
_sp('cause_blindness','Cause Blindness','C',3,'enemy',{blind:true,save:0,desc:'Causes blindness.'});
_sp('cure_blindness','Cure Blindness','C',3,'ally',{desc:'Cures blindness.'});
_sp('cure_serious','Cure Serious Wounds','C',4,'ally',{heal:'2d8+1',desc:'Heals 2d8+1.'});
_sp('neutralize_poison','Neutralize Poison','C',4,'ally',{desc:'Neutralizes poison.'});
_sp('cause_serious','Cause Serious Wounds','C',4,'enemy',{dmg:'2d8+1',save:0,desc:'Hurts enemies.'});
_sp('free_action','Free Action','C',4,'ally',{freeAction:true,dur:'4 rounds',desc:'Immune to paralysis.'});
_sp('protection_evil_10','Protection from Evil 10 Radius','C',4,'party',{vsEvil:true,dur:'5 rounds',desc:'Party protection vs evil.'});
_sp('cure_critical','Cure Critical Wounds','C',5,'ally',{heal:'3d8+3',desc:'Heals 3d8+3.'});
_sp('flame_strike','Flame Strike','C',5,'area',{radius:2,dmg:'4d6',desc:'Pillar of flame.'});
_sp('cause_critical','Cause Critical Wounds','C',5,'enemy',{dmg:'3d8+3',save:0,desc:'Hurts enemies.'});
_sp('slay_living','Slay Living','C',5,'enemy',{dmg:'4d8',save:0,desc:'Slays the living.'});
_sp('dispel_evil','Dispel Evil','C',5,'enemy',{dispel:3,desc:'Dispel evil magic.'});
_sp('raise_dead','Raise Dead','C',5,'explore',{revive:true,conCheck:true,desc:'Raises dead companion at 1 HP.'});
_sp('heal','Heal','C',6,'ally',{healAllBut:'1d4',desc:'Heals all but 1d4 missing HP.'});
_sp('blade_barrier','Blade Barrier','C',6,'party',{wall:true,dmg:'6d6',desc:'Wall of blades.'});
_sp('harm','Harm','C',6,'enemy',{dmg:'5d8',desc:'Harms enemies.'});
_sp('holy_word','Holy Word','C',7,'area',{radius:3,dmg:'4d6',desc:'Holy word smites.'});
_sp('destruction','Destruction','C',7,'enemy',{dmg:'5d6',desc:'Destructive word.'});
_sp('resurrection','Resurrection','C',7,'explore',{revive:true,full:true,desc:'Resurrects fully.'});
/* fix level numbering: cure_serious etc are priest level 4; listed under level4 col in spec — ok */
const SPELLS_LIST=Object.keys(SPELLS).map(id=>SPELLS[id]);
/* palette of priest-only list for paladins: levels 1-3 only plus a few */
const PALADIN_SPELLS = SPELLS_LIST.filter(s=>s.c==='C' && s.l<=3).map(s=>s.id);

/* ============================ MONSTERS ============================ */
/* id,name,hd,hp,ac,mv,thac0,atk:[[dmg,n]],size,ml,xp,gold,tags,fig,lore,morale,ranged?,undead?,caster? */
const MONSTERS={};
function _m(id,o){o.id=id;MONSTERS[id]=o;return o;}
_m('giant_rat',{n:'Giant Rat',hd:'1d4',hp:'1d4',ac:7,mv:6,thac0:19,atk:[['1d3',1]],size:'S',ml:'rat',xp:2,gold:'1d4',tags:['vermin','rat'],fig:'rat',lore:'A bloated sewer rat, quick and disease-ridden.',morale:6});
_m('centipede',{n:'Giant Centipede',hd:'1d4',hp:'1d4',ac:9,mv:4,thac0:20,atk:[['1d3',1]],size:'S',ml:'insect',xp:2,gold:0,tags:['vermin','insect'],fig:'insect',lore:'A foot-long centipede that squirms through cracks.',morale:6,poison:'1d4'});
_m('kobold',{n:'Kobold',hd:'1d4',hp:'1d4',ac:7,mv:6,thac0:20,atk:[['1d4',1]],size:'S',ml:'humanoid',xp:3,gold:'1d4',tags:['humanoid','kobold'],fig:'humanoid',lore:'Small reptilian humanoids, cowardly in numbers.',morale:7});
_m('kobold_archer',{n:'Kobold Archer',hd:'1d4',hp:'1d4',ac:7,mv:6,thac0:19,atk:[['1d4',1]],size:'S',ml:'humanoid',xp:4,gold:'1d4',tags:['humanoid','kobold'],fig:'humanoid',lore:'Kobold with a shortbow.',morale:7,ranged:['shortbow','1d6']});
_m('kobold_cook',{n:'Kobold Cook',hd:'1d6',hp:'1d6',ac:7,mv:6,thac0:18,atk:[['1d6',1]],size:'S',ml:'humanoid',xp:5,gold:'1d6',tags:['humanoid','kobold'],fig:'humanoid',lore:'A burly kobold with a cleaver.',morale:8});
_m('giant_beetle',{n:'Giant Beetle',hd:'2d8',hp:'2d8',ac:3,mv:3,thac0:18,atk:[['1d6',1],['1d4',1]],size:'L',ml:'beast',xp:8,gold:0,tags:['beast','insect'],fig:'insect',lore:'Armored beetles that burrow through stone.',morale:9});
_m('giant_spider',{n:'Giant Spider',hd:'3d8',hp:'3d8',ac:4,mv:9,thac0:17,atk:[['1d6',1],['1d4',1]],size:'L',ml:'arachnid',xp:20,gold:'1d6',tags:['beast','arachnid'],fig:'spider',lore:'Web-spinning hunters of the deep places.',morale:8,poison:'1d6'});
_m('wolf',{n:'Wolf',hd:'1d8+1',hp:'1d8+1',ac:7,mv:12,thac0:19,atk:[['1d6',1]],size:'M',ml:'canine',xp:6,gold:0,tags:['beast','wolf'],fig:'wolf',lore:'Pack hunter of the vale.',morale:7});
_m('dire_wolf',{n:'Dire Wolf',hd:'3d8+2',hp:'3d8+2',ac:6,mv:12,thac0:16,atk:[['1d8',1]],size:'L',ml:'canine',xp:25,gold:'1d4',tags:['beast','wolf'],fig:'wolf',lore:'A huge grey wolf, larger than a pony.',morale:9});
_m('gnoll',{n:'Gnoll',hd:'2d8',hp:'2d8',ac:5,mv:12,thac0:17,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:12,gold:'1d4',tags:['humanoid','gnoll'],fig:'humanoid',lore:'Hyena-folk raiders of the moors.',morale:8});
_m('gnoll_packlord',{n:'Gnoll Packlord',hd:'4d8',hp:'4d8',ac:4,mv:12,thac0:16,atk:[['1d8',1],['1d4',1]],size:'M',ml:'humanoid',xp:40,gold:'3d6',tags:['humanoid','gnoll'],fig:'humanoid',lore:'Leader of a gnoll pack, crowned in bone.',morale:10});
_m('ghoul',{n:'Ghoul',hd:'2d8',hp:'2d8',ac:6,mv:12,thac0:17,atk:[['1d4',1],['paralysis',1]],size:'M',ml:'undead',xp:18,gold:'1d6',tags:['undead','ghoul'],fig:'undead',lore:'Flesh-eating undead; paralytic touch.',morale:8,undead:'rank1'});
_m('ghast',{n:'Ghast',hd:'4d8',hp:'4d8',ac:4,mv:12,thac0:16,atk:[['1d6',1],['paralysis',1]],size:'M',ml:'undead',xp:45,gold:'2d6',tags:['undead','ghoul'],fig:'undead',lore:'A powerful ghoul that spreads stench.',morale:10,undead:'rank2'});
_m('skeleton',{n:'Skeleton',hd:'1d8',hp:'1d8',ac:8,mv:12,thac0:20,atk:[['1d4',1]],size:'M',ml:'undead',xp:6,gold:'1d6',tags:['undead','skeleton'],fig:'undead',lore:'Animated bones, immune to normal weapons.',morale:7,undead:'rank1',resist:{bludgeon:false}});
_m('zombie',{n:'Zombie',hd:'2d8',hp:'2d8',ac:8,mv:6,thac0:18,atk:[['1d8',1]],size:'M',ml:'undead',xp:10,gold:0,tags:['undead','zombie'],fig:'undead',lore:'Shambling corpse.',morale:12,undead:'rank1'});
_m('cultist',{n:'Cultist',hd:'1d8',hp:'1d8',ac:7,mv:12,thac0:18,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:10,gold:'1d6',tags:['humanoid','cult'],fig:'humanoid',lore:'A hooded servant of dark gods.',morale:8});
_m('cult_fanatic',{n:'Cult Fanatic',hd:'3d8',hp:'3d8',ac:5,mv:12,thac0:17,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:25,gold:'2d6',tags:['humanoid','cult'],fig:'humanoid',lore:'A battle-caster of the cult.',morale:10,caster:{list:'cause_light,cause_serious,cure_light,hold_person',lvl:3}});
_m('ogre',{n:'Ogre',hd:'5d8+5',hp:'5d8+5',ac:5,mv:9,thac0:15,atk:[['1d10',1]],size:'L',ml:'giant',xp:60,gold:'3d6',tags:['giant','ogre'],fig:'giant',lore:'A brutish giant standing two stories tall.',morale:12});
_m('ogre_brute',{n:'Ogre Brute',hd:'7d8+7',hp:'7d8+7',ac:4,mv:9,thac0:14,atk:[['2d6',1]],size:'L',ml:'giant',xp:100,gold:'4d6',tags:['giant','ogre'],fig:'giant',lore:'A massive ogre with a spiked club.',morale:14});
_m('troll',{n:'Troll',hd:'6d8+6',hp:'6d8+6',ac:4,mv:12,thac0:15,atk:[['1d8',1],['1d4',1]],size:'L',ml:'giant',xp:80,gold:'2d6',tags:['giant','troll'],fig:'giant',lore:'A regenerating giant of the moors.',morale:13,regen:true});
_m('hill_giant',{n:'Hill Giant',hd:'8d8+8',hp:'8d8+8',ac:4,mv:12,thac0:14,atk:[['2d8',1]],size:'L',ml:'giant',xp:150,gold:'5d10',tags:['giant'],fig:'giant',lore:'A hulking giant of the hills.',morale:14});
_m('boulder_thrower',{n:'Boulder-Throwing Giant',hd:'9d8+9',hp:'9d8+9',ac:3,mv:12,thac0:13,atk:[['2d8',1]],size:'L',ml:'giant',xp:200,gold:'6d10',tags:['giant'],fig:'giant',lore:'A giant who hurls boulders with terrifying force.',morale:15,ranged:['boulder','3d8']});
_m('bugbear',{n:'Bugbear',hd:'3d8',hp:'3d8',ac:5,mv:9,thac0:17,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:20,gold:'2d4',tags:['humanoid','bugbear'],fig:'humanoid',lore:'A large, hairy goblinoid warrior.',morale:9});
_m('goblin',{n:'Goblin',hd:'1d8',hp:'1d8',ac:6,mv:6,thac0:20,atk:[['1d6',1]],size:'S',ml:'humanoid',xp:5,gold:'1d4',tags:['humanoid','goblin'],fig:'humanoid',lore:'Small green raiders.',morale:7});
_m('orc',{n:'Orc',hd:'1d8',hp:'1d8',ac:6,mv:9,thac0:19,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:8,gold:'1d6',tags:['humanoid','orc'],fig:'humanoid',lore:'Tusked humanoid warrior.',morale:8});
_m('warg',{n:'Warg',hd:'4d8+4',hp:'4d8+4',ac:5,mv:15,thac0:15,atk:[['1d8',1],['1d4',1]],size:'L',ml:'canine',xp:35,gold:0,tags:['beast','wolf'],fig:'wolf',lore:'A dire wolf ridden by goblins.',morale:10});
_m('hell_hound',{n:'Hell Hound',hd:'5d8',hp:'5d8',ac:5,mv:12,thac0:15,atk:[['1d8',1]],size:'L',ml:'fiend',xp:50,gold:0,tags:['fiend','fire'],fig:'wolf',lore:'A fire-breathing hound of the pit.',morale:12,breath:'4d6'});
_m('gargoyle',{n:'Gargoyle',hd:'4d8',hp:'4d8',ac:3,mv:6,thac0:16,atk:[['1d6',1]],size:'M',ml:'construct',xp:45,gold:'2d6',tags:['construct','stone'],fig:'gargoyle',lore:'A stone statue that comes alive. Needs magic to harm.',morale:12,immune:{nonmagic:true}});
_m('raven_witch',{n:'Raven Witch',hd:'6d8',hp:'6d8',ac:5,mv:9,thac0:14,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:90,gold:'4d6',tags:['humanoid','witch'],fig:'humanoid',lore:'A gaunt sorceress of the moors.',morale:14,caster:{list:'magic_missile,fireball,hold_person,invisibility,cone_of_cold',lvl:7}});
_m('drow',{n:'Drow',hd:'3d8',hp:'3d8',ac:5,mv:12,thac0:17,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:30,gold:'2d6',tags:['humanoid','drow'],fig:'humanoid',lore:'Dark elf of the underdark.',morale:9,caster:{list:'magic_missile,invisibility,hold_person',lvl:5}});
_m('gelatinous_cube',{n:'Gelatinous Cube',hd:'6d8',hp:'6d8',ac:8,mv:6,thac0:14,atk:[['2d4',1]],size:'L',ml:'ooze',xp:60,gold:'1d10',tags:['ooze'],fig:'blob',lore:'A transparent cube of digestive jelly.',morale:14});
_m('rust_monster',{n:'Rust Monster',hd:'3d8',hp:'3d8',ac:2,mv:6,thac0:16,atk:[['rust',1]],size:'L',ml:'beast',xp:50,gold:'1d10',tags:['beast'],fig:'insect',lore:'A metallic insect that corrodes armor.',morale:10});
_m('shadow',{n:'Shadow',hd:'4d8',hp:'4d8',ac:8,mv:12,thac0:15,atk:[['1d6',1]],size:'M',ml:'undead',xp:50,gold:'2d6',tags:['undead','shadow'],fig:'undead',lore:'A darkness that feeds on light.',morale:14,undead:'rank2',incorporeal:true});
_m('wraith',{n:'Wraith',hd:'5d8',hp:'5d8',ac:4,mv:12,thac0:14,atk:[['1d6',1],['drain',1]],size:'M',ml:'undead',xp:80,gold:'3d6',tags:['undead','wraith'],fig:'undead',lore:'A specter that drains life force.',morale:15,undead:'rank2',incorporeal:true});
_m('vampire',{n:'Vampire',hd:'7d8',hp:'7d8',ac:2,mv:12,thac0:13,atk:[['1d8',1],['drain',1]],size:'M',ml:'undead',xp:200,gold:'5d10',tags:['undead','vampire'],fig:'undead',lore:'An undead noble of the night.',morale:16,undead:'rank3'});
_m('lich',{n:'Lich',hd:'11d8',hp:'11d8',ac:0,mv:12,thac0:10,atk:[['1d10',1]],size:'M',ml:'undead',xp:500,gold:'1d100',tags:['undead','lich'],fig:'undead',lore:'An undead archmage of terrible power.',morale:18,undead:'rank3',caster:{list:'fireball,lightning_bolt,hold_monster,disintegrate',lvl:10}});
_m('mind_flayer',{n:'Mind Flayer',hd:'7d8',hp:'7d8',ac:0,mv:12,thac0:13,atk:[['1d4',2],['stun',1]],size:'M',ml:'aberration',xp:250,gold:'3d6',tags:['aberration'],fig:'humanoid',lore:'A brain-eating horror of the deep.',morale:14});
_m('beholder',{n:'Beholder',hd:'10d8',hp:'10d8',ac:0,mv:9,thac0:10,atk:[['1d4',10]],size:'L',ml:'aberration',xp:700,gold:'5d10',tags:['aberration','eye'],fig:'orb',lore:'A floating eye that disintegrates with a gaze.',morale:18,fly:true});
_m('dragon_wyrmling',{n:'Wyrmling',hd:'8d8',hp:'8d8',ac:2,mv:12,thac0:12,atk:[['1d8',1],['1d6',1]],size:'L',ml:'dragon',xp:300,gold:'3d10',tags:['dragon','fire'],fig:'dragon',lore:'A young dragon, barely more than a lizard.',morale:16,breath:'6d6'});
_m('young_dragon',{n:'Young Dragon',hd:'12d8',hp:'12d8',ac:0,mv:15,thac0:10,atk:[['2d6',1],['1d6',1]],size:'L',ml:'dragon',xp:800,gold:'8d10',tags:['dragon','fire'],fig:'dragon',lore:'A winged dragon with deadly breath.',morale:18,breath:'8d6',fly:true});
_m('adult_dragon',{n:'Adult Dragon',hd:'15d8',hp:'15d8',ac:-1,mv:15,thac0:8,atk:[['2d8',1],['1d8',1]],size:'G',ml:'dragon',xp:2000,gold:'1d100',tags:['dragon','fire'],fig:'dragon',lore:'A fully grown dragon, terror of the sky.',morale:20,breath:'10d6',fly:true});
_m('blue_dragon_wyrmling',{n:'Blue Dragon Wyrmling',hd:'8d8',hp:'8d8',ac:1,mv:12,thac0:12,atk:[['1d8',1]],size:'L',ml:'dragon',xp:350,gold:'3d10',tags:['dragon','lightning'],fig:'dragon',lore:'A blue-scaled wyrmling.',morale:16,breath:'6d6 lightning'});
_m('white_dragon',{n:'White Dragon',hd:'10d8',hp:'10d8',ac:1,mv:12,thac0:11,atk:[['1d8',1],['1d6',1]],size:'L',ml:'dragon',xp:600,gold:'5d10',tags:['dragon','cold'],fig:'dragon',lore:'A white dragon of the frozen north.',morale:18,breath:'8d6 cold'});
_m('black_dragon',{n:'Black Dragon',hd:'11d8',hp:'11d8',ac:0,mv:12,thac0:10,atk:[['2d6',1],['1d8',1]],size:'L',ml:'dragon',xp:900,gold:'8d10',tags:['dragon','acid'],fig:'dragon',lore:'A black dragon of acid and decay.',morale:18,breath:'8d8 acid'});
_m('green_dragon',{n:'Green Dragon',hd:'12d8',hp:'12d8',ac:-1,mv:12,thac0:9,atk:[['2d6',1],['1d6',1]],size:'L',ml:'dragon',xp:1200,gold:'1d100',tags:['dragon','poison'],fig:'dragon',lore:'A green dragon of toxic breath.',morale:20,breath:'10d8 poison'});
_m('red_dragon',{n:'Red Dragon',hd:'14d8',hp:'14d8',ac:-1,mv:15,thac0:8,atk:[['2d8',1],['2d6',1]],size:'G',ml:'dragon',xp:2500,gold:'1d100',tags:['dragon','fire'],fig:'dragon',lore:'The greatest of dragons.',morale:20,breath:'12d6 fire',fly:true});
_m('elemental',{n:'Elemental',hd:'9d8',hp:'9d8',ac:2,mv:12,thac0:11,atk:[['2d8',1]],size:'L',ml:'elemental',xp:500,gold:'1d10',tags:['elemental'],fig:'blob',lore:'A being of raw elemental force.',morale:18});
_m('fire_elemental',{n:'Fire Elemental',hd:'8d8',hp:'8d8',ac:3,mv:12,thac0:12,atk:[['2d6',1]],size:'L',ml:'elemental',xp:400,gold:'1d10',tags:['elemental','fire'],fig:'blob',lore:'A living flame.',morale:16,immune:{fire:true}});
_m('ice_elemental',{n:'Ice Elemental',hd:'8d8',hp:'8d8',ac:3,mv:12,thac0:12,atk:[['2d6',1]],size:'L',ml:'elemental',xp:400,gold:'1d10',tags:['elemental','cold'],fig:'blob',lore:'A living glacier.',morale:16,immune:{cold:true}});
_m('earth_elemental',{n:'Earth Elemental',hd:'9d8',hp:'9d8',ac:2,mv:6,thac0:11,atk:[['2d8',1]],size:'L',ml:'elemental',xp:450,gold:'1d10',tags:['elemental','earth'],fig:'blob',lore:'A living stone.',morale:18});
_m('water_elemental',{n:'Water Elemental',hd:'8d8',hp:'8d8',ac:4,mv:12,thac0:12,atk:[['1d8',2]],size:'L',ml:'elemental',xp:380,gold:'1d10',tags:['elemental','water'],fig:'blob',lore:'A living torrent.',morale:16});
_m('djinni',{n:'Djinni',hd:'7d8',hp:'7d8',ac:2,mv:15,thac0:13,atk:[['1d6',1]],size:'L',ml:'genie',xp:400,gold:'2d10',tags:['genie','fire'],fig:'giant',lore:'A genie of fire and boundless power.',morale:16,fly:true,caster:{list:'fireball,hold_monster,lightning_bolt',lvl:8}});
_m('efreeti',{n:'Efreeti',hd:'10d8',hp:'10d8',ac:1,mv:15,thac0:10,atk:[['2d6',1]],size:'L',ml:'genie',xp:800,gold:'5d10',tags:['genie','fire'],fig:'giant',lore:'A mighty efreet of the burning sands.',morale:18,fly:true,caster:{list:'fireball,cone_of_cold,hold_monster',lvl:10}});
_m('marid',{n:'Marid',hd:'9d8',hp:'9d8',ac:1,mv:15,thac0:11,atk:[['2d6',1]],size:'L',ml:'genie',xp:600,gold:'4d10',tags:['genie','water'],fig:'giant',lore:'A marid of the deep waters.',morale:18,fly:true});
_m('demon_imp',{n:'Imp',hd:'2d4',hp:'2d4',ac:8,mv:12,thac0:18,atk:[['1d4',1],['sting',1]],size:'S',ml:'fiend',xp:15,gold:'1d6',tags:['fiend','demon'],fig:'insect',lore:'A small demon that stings.',morale:6});
_m('demon_quasit',{n:'Quasit',hd:'3d4',hp:'3d4',ac:7,mv:12,thac0:17,atk:[['1d4',1]],size:'S',ml:'fiend',xp:30,gold:'2d4',tags:['fiend','demon'],fig:'insect',lore:'A mischievous little demon.',morale:7,caster:{list:'magic_missile,scare',lvl:3}});
_m('demon_babau',{n:'Babau',hd:'4d8',hp:'4d8',ac:4,mv:12,thac0:15,atk:[['1d6',1]],size:'M',ml:'fiend',xp:60,gold:'2d6',tags:['fiend','demon'],fig:'insect',lore:'A demon of nightmare.',morale:10});
_m('demon_vrock',{n:'Vrock',hd:'7d8',hp:'7d8',ac:1,mv:15,thac0:12,atk:[['2d6',1]],size:'L',ml:'fiend',xp:300,gold:'4d10',tags:['fiend','demon'],fig:'demon',lore:'A winged demon of the pit.',morale:16,fly:true});
_m('demon_balor',{n:'Balor',hd:'11d8',hp:'11d8',ac:-2,mv:15,thac0:9,atk:[['2d10',1],['1d8',1]],size:'L',ml:'fiend',xp:2000,gold:'1d100',tags:['fiend','demon'],fig:'demon',lore:'A balor of the abyss.',morale:20,fly:true});
_m('devil_imp',{n:'Devil Imp',hd:'2d4',hp:'2d4',ac:9,mv:12,thac0:18,atk:[['1d4',1]],size:'S',ml:'fiend',xp:12,gold:'1d4',tags:['fiend','devil'],fig:'insect',lore:'A diabolical imp.',morale:7});
_m('devil_barbed',{n:'Barbed Devil',hd:'5d8',hp:'5d8',ac:3,mv:12,thac0:14,atk:[['1d6',2]],size:'M',ml:'fiend',xp:150,gold:'2d6',tags:['fiend','devil'],fig:'demon',lore:'A devil covered in barbs.',morale:14});
_m('devil_erinyes',{n:'Erinyes',hd:'7d8',hp:'7d8',ac:2,mv:12,thac0:12,atk:[['1d8',1],['1d6',1]],size:'M',ml:'fiend',xp:400,gold:'3d10',tags:['fiend','devil'],fig:'demon',lore:'A winged devil of the nine.',morale:18,fly:true});
_m('devil_arch',{n:'Arch-Devil',hd:'12d8',hp:'12d8',ac:-1,mv:12,thac0:8,atk:[['2d8',1],['2d6',1]],size:'L',ml:'fiend',xp:3000,gold:'1d100',tags:['fiend','devil'],fig:'demon',lore:'A lord of the nine hells.',morale:20});
_m('yeti',{n:'Yeti',hd:'6d8',hp:'6d8',ac:6,mv:12,thac0:14,atk:[['1d10',1]],size:'L',ml:'giant',xp:120,gold:'1d6',tags:['giant','yeti'],fig:'giant',lore:'An abominable snowman of the frozen peaks.',morale:14});
_m('frost_giant',{n:'Frost Giant',hd:'10d8',hp:'10d8',ac:3,mv:12,thac0:11,atk:[['2d8',1]],size:'G',ml:'giant',xp:600,gold:'3d10',tags:['giant','cold'],fig:'giant',lore:'A giant of the frozen north.',morale:16,breath:'6d6 cold'});
_m('fire_giant',{n:'Fire Giant',hd:'11d8',hp:'11d8',ac:2,mv:12,thac0:10,atk:[['2d8',1]],size:'G',ml:'giant',xp:800,gold:'4d10',tags:['giant','fire'],fig:'giant',lore:'A giant of the molten depths.',morale:16,breath:'6d6 fire'});
_m('stone_giant',{n:'Stone Giant',hd:'11d8',hp:'11d8',ac:1,mv:12,thac0:10,atk:[['2d8',1]],size:'G',ml:'giant',xp:800,gold:'4d10',tags:['giant'],fig:'giant',lore:'A giant of the mountain crags.',morale:16,ranged:['boulder','3d8']});
_m('cloud_giant',{n:'Cloud Giant',hd:'12d8',hp:'12d8',ac:0,mv:12,thac0:9,atk:[['2d10',1]],size:'G',ml:'giant',xp:1200,gold:'5d10',tags:['giant'],fig:'giant',lore:'A giant of the storm peaks.',morale:18,fly:true});
_m('hill_giant_elder',{n:'Elder Hill Giant',hd:'12d8',hp:'12d8',ac:2,mv:12,thac0:9,atk:[['2d8',1]],size:'G',ml:'giant',xp:1000,gold:'5d10',tags:['giant'],fig:'giant',lore:'An elder giant chief.',morale:18});
_m('fomorian',{n:'Fomorian',hd:'14d8',hp:'14d8',ac:1,mv:6,thac0:8,atk:[['2d8',1],['2d6',1]],size:'G',ml:'giant',xp:2000,gold:'6d10',tags:['giant','fomorian'],fig:'giant',lore:'A brutish giant of primordial evil.',morale:20});
_m('titan',{n:'Titan',hd:'20d8',hp:'20d8',ac:-2,mv:15,thac0:5,atk:[['4d8',1]],size:'G',ml:'giant',xp:8000,gold:'1d1000',tags:['giant','titan'],fig:'giant',lore:'A titan of the old world.',morale:20,fly:true});
_m('beast_giant',{n:'Beast Giant',hd:'8d8',hp:'8d8',ac:4,mv:15,thac0:12,atk:[['2d6',1]],size:'L',ml:'giant',xp:400,gold:'3d6',tags:['giant','beast'],fig:'giant',lore:'A giant who hunts in beast form.',morale:14});
_m('ettin',{n:'Ettin',hd:'9d8',hp:'9d8',ac:3,mv:12,thac0:11,atk:[['2d6',1]],size:'L',ml:'giant',xp:500,gold:'3d10',tags:['giant','ettin'],fig:'giant',lore:'A two-headed giant.',morale:16});
_m('troll_brute',{n:'Troll Brute',hd:'8d8+8',hp:'8d8+8',ac:3,mv:12,thac0:13,atk:[['2d6',1],['1d6',1]],size:'L',ml:'giant',xp:150,gold:'3d6',tags:['giant','troll'],fig:'giant',lore:'A massive regenerating troll.',morale:15,regen:true});
_m('ogre_magi',{n:'Ogre Mage',hd:'8d8',hp:'8d8',ac:4,mv:9,thac0:12,atk:[['1d8',1]],size:'L',ml:'giant',xp:200,gold:'4d6',tags:['giant','ogre','caster'],fig:'giant',lore:'An ogre who commands fire.',morale:14,caster:{list:'burning_hands,fireball,hold_person,lightning_bolt',lvl:6}});
_m('ogre_jarl',{n:'Ogre Jarl',hd:'9d8',hp:'9d8',ac:3,mv:9,thac0:11,atk:[['2d8',1]],size:'L',ml:'giant',xp:250,gold:'5d6',tags:['giant','ogre'],fig:'giant',lore:'A chief of ogres.',morale:16});
_m('hill_giant_kidnapper',{n:'Hill Giant Kidnapper',hd:'10d8',hp:'10d8',ac:3,mv:12,thac0:11,atk:[['2d8',1]],size:'L',ml:'giant',xp:500,gold:'4d10',tags:['giant'],fig:'giant',lore:'A giant who takes children.',morale:14});
_m('stone_giant_seer',{n:'Stone Giant Seer',hd:'11d8',hp:'11d8',ac:2,mv:12,thac0:10,atk:[['2d8',1]],size:'L',ml:'giant',xp:600,gold:'4d10',tags:['giant','caster'],fig:'giant',lore:'A stone giant who reads the future.',morale:16,caster:{list:'hold_person,lightning_bolt,ice_storm',lvl:7}});
_m('verbeeg',{n:'Verbeeg',hd:'15d8',hp:'15d8',ac:0,mv:12,thac0:7,atk:[['3d8',1]],size:'G',ml:'giant',xp:3000,gold:'1d100',tags:['giant','verbeeg'],fig:'giant',lore:'A huge goblinoid giant.',morale:20});
_m('cyclops',{n:'Cyclops',hd:'10d8',hp:'10d8',ac:3,mv:12,thac0:11,atk:[['2d8',1]],size:'L',ml:'giant',xp:600,gold:'4d10',tags:['giant','cyclops'],fig:'giant',lore:'A one-eyed giant.',morale:16});
_m('ettin_twohead',{n:'Two-Headed Ettin',hd:'10d8',hp:'10d8',ac:2,mv:12,thac0:10,atk:[['2d8',1],['1d8',1]],size:'L',ml:'giant',xp:700,gold:'5d10',tags:['giant','ettin'],fig:'giant',lore:'An ettin with two heads and two attacks.',morale:18});
_m('ogre_lord',{n:'Ogre Lord',hd:'10d8',hp:'10d8',ac:2,mv:9,thac0:10,atk:[['2d8',1],['1d8',1]],size:'L',ml:'giant',xp:400,gold:'6d6',tags:['giant','ogre'],fig:'giant',lore:'A lord of ogres.',morale:18});
_m('drow_elder',{n:'Drow Elder',hd:'8d8',hp:'8d8',ac:2,mv:12,thac0:11,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:400,gold:'5d6',tags:['humanoid','drow','caster'],fig:'humanoid',lore:'An elder dark elf.',morale:16,caster:{list:'magic_missile,invisibility,hold_person,fireball',lvl:9}});
_m('githyanki',{n:'Githyanki',hd:'7d8',hp:'7d8',ac:3,mv:12,thac0:13,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:300,gold:'3d6',tags:['humanoid','gith'],fig:'humanoid',lore:'A warrior of the astral plane.',morale:16});
_m('githzerai',{n:'Githzerai',hd:'7d8',hp:'7d8',ac:4,mv:12,thac0:13,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:280,gold:'3d6',tags:['humanoid','gith'],fig:'humanoid',lore:'A monk of the gith.',morale:16});
_m('mind_flayer_illithid',{n:'Illithid',hd:'8d8',hp:'8d8',ac:0,mv:12,thac0:11,atk:[['1d4',2],['stun',1]],size:'M',ml:'aberration',xp:400,gold:'4d6',tags:['aberration','mindflayer'],fig:'humanoid',lore:'A mind flayer of great power.',morale:16});
_m('beholder_zombie',{n:'Beholder Zombie',hd:'10d8',hp:'10d8',ac:0,mv:9,thac0:10,atk:[['1d4',10]],size:'L',ml:'aberration',xp:600,gold:'4d10',tags:['aberration','eye','undead'],fig:'orb',lore:'A beholder animated by necromancy.',morale:16,undead:'rank1'});
_m('beholder_gazer',{n:'Gazer',hd:'8d8',hp:'8d8',ac:1,mv:9,thac0:11,atk:[['1d4',8]],size:'L',ml:'aberration',xp:500,gold:'4d10',tags:['aberration','eye'],fig:'orb',lore:'A beholderkin with fewer eyes.',morale:16});
_m('kuo_toa',{n:'Kuo-toa',hd:'4d8',hp:'4d8',ac:5,mv:6,thac0:15,atk:[['1d6',1],['1d4',1]],size:'M',ml:'humanoid',xp:80,gold:'2d4',tags:['humanoid','kuo'],fig:'humanoid',lore:'A fish-folk of the underdark.',morale:10});
_m('sahuagin',{n:'Sahuagin',hd:'4d8',hp:'4d8',ac:4,mv:12,thac0:15,atk:[['1d6',1],['1d4',1]],size:'M',ml:'humanoid',xp:70,gold:'2d4',tags:['humanoid','sahuagin'],fig:'humanoid',lore:'A shark-folk raider.',morale:10});
_m('lizardfolk',{n:'Lizardfolk',hd:'4d8',hp:'4d8',ac:5,mv:9,thac0:15,atk:[['1d6',1],['1d4',1]],size:'M',ml:'humanoid',xp:60,gold:'2d4',tags:['humanoid','lizard'],fig:'humanoid',lore:'Reptilian humanoids of the swamps.',morale:9});
_m('troglodyte',{n:'Troglodyte',hd:'2d8',hp:'2d8',ac:5,mv:9,thac0:17,atk:[['1d4',1]],size:'M',ml:'humanoid',xp:20,gold:'1d6',tags:['humanoid','troglodyte'],fig:'humanoid',lore:'Cave-dwelling reptilian folk.',morale:8,stink:true});
_m('basilisk',{n:'Basilisk',hd:'8d8',hp:'8d8',ac:4,mv:6,thac0:12,atk:[['1d8',1]],size:'L',ml:'reptile',xp:300,gold:'3d6',tags:['reptile','basilisk'],fig:'serpent',lore:'A lizard whose gaze petrifies.',morale:14,petrifyGaze:true});
_m('cockatrice',{n:'Cockatrice',hd:'4d8',hp:'4d8',ac:5,mv:9,thac0:15,atk:[['1d4',1]],size:'M',ml:'reptile',xp:80,gold:'1d6',tags:['reptile','cockatrice'],fig:'bird',lore:'A rooster-headed serpent.',morale:10,petrifyGaze:true});
_m('wyvern',{n:'Wyvern',hd:'8d8',hp:'8d8',ac:3,mv:15,thac0:12,atk:[['2d6',1],['1d6',1]],size:'L',ml:'dragon',xp:500,gold:'3d10',tags:['dragon','wyvern'],fig:'dragon',lore:'A two-legged dragon.',morale:16,fly:true});
_m('couatl',{n:'Couatl',hd:'7d8',hp:'7d8',ac:4,mv:15,thac0:13,atk:[['1d6',1]],size:'L',ml:'reptile',xp:400,gold:'3d6',tags:['reptile','couatl'],fig:'serpent',lore:'A feathered serpent of wisdom.',morale:16,fly:true});
_m('pseudo_dragon',{n:'Pseudo-Dragon',hd:'4d8',hp:'4d8',ac:4,mv:15,thac0:15,atk:[['1d4',1]],size:'S',ml:'dragon',xp:100,gold:'1d6',tags:['dragon'],fig:'dragon',lore:'A small friendly dragon.',morale:10,fly:true});
_m('pteranodon',{n:'Pteranodon',hd:'5d8',hp:'5d8',ac:4,mv:15,thac0:14,atk:[['1d6',1],['1d4',1]],size:'L',ml:'beast',xp:120,gold:'1d6',tags:['beast','flyer'],fig:'bird',lore:'A flying reptile.',morale:10,fly:true});
_m('roc',{n:'Roc',hd:'10d8',hp:'10d8',ac:2,mv:15,thac0:10,atk:[['2d6',1]],size:'G',ml:'beast',xp:800,gold:'2d6',tags:['beast','flyer'],fig:'bird',lore:'A giant bird of prey.',morale:18,fly:true});
_m('griffon',{n:'Griffon',hd:'7d8',hp:'7d8',ac:3,mv:15,thac0:12,atk:[['2d4',1]],size:'L',ml:'beast',xp:300,gold:'2d6',tags:['beast','flyer'],fig:'bird',lore:'A lion-eagle hybrid.',morale:14,fly:true});
_m('pegasus',{n:'Pegasus',hd:'6d8',hp:'6d8',ac:5,mv:18,thac0:13,atk:[['1d6',1]],size:'L',ml:'beast',xp:200,gold:'2d6',tags:['beast','flyer'],fig:'horse',lore:'A winged horse.',morale:14,fly:true});
_m('unicorn',{n:'Unicorn',hd:'7d8',hp:'7d8',ac:3,mv:15,thac0:12,atk:[['2d6',1]],size:'L',ml:'beast',xp:400,gold:'3d6',tags:['beast','unicorn'],fig:'horse',lore:'A magical horse with a horn.',morale:16});
_m('centaur',{n:'Centaur',hd:'6d8',hp:'6d8',ac:4,mv:15,thac0:13,atk:[['1d8',1],['1d6',1]],size:'L',ml:'humanoid',xp:250,gold:'3d6',tags:['humanoid','centaur'],fig:'centaur',lore:'A half-human, half-horse warrior.',morale:14});
_m('satyr',{n:'Satyr',hd:'4d8',hp:'4d8',ac:5,mv:15,thac0:15,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:100,gold:'2d4',tags:['humanoid','satyr'],fig:'humanoid',lore:'A goat-legged reveler.',morale:10});
_m('dryad',{n:'Dryad',hd:'4d8',hp:'4d8',ac:6,mv:12,thac0:15,atk:[['1d6',1]],size:'M',ml:'fey',xp:150,gold:'2d6',tags:['fey','dryad'],fig:'humanoid',lore:'A tree spirit.',morale:12,caster:{list:'cure_light,hold_person,invisibility',lvl:5}});
_m('sprite',{n:'Sprite',hd:'2d4',hp:'2d4',ac:8,mv:15,thac0:18,atk:[['1d2',1]],size:'S',ml:'fey',xp:20,gold:'1d4',tags:['fey','sprite'],fig:'humanoid',lore:'A tiny winged fey.',morale:6,fly:true});
_m('pixie',{n:'Pixie',hd:'2d4',hp:'2d4',ac:9,mv:18,thac0:19,atk:[['1d2',1]],size:'S',ml:'fey',xp:25,gold:'1d4',tags:['fey','pixie'],fig:'humanoid',lore:'A mischievous tiny fey.',morale:6,fly:true});
_m('nymph',{n:'Nymph',hd:'3d8',hp:'3d8',ac:8,mv:12,thac0:17,atk:[['1d4',1]],size:'M',ml:'fey',xp:80,gold:'2d4',tags:['fey','nymph'],fig:'humanoid',lore:'A spirit of nature.',morale:10});
_m('faerie_dragon',{n:'Faerie Dragon',hd:'3d8',hp:'3d8',ac:5,mv:15,thac0:16,atk:[['1d4',1]],size:'S',ml:'dragon',xp:100,gold:'1d6',tags:['dragon','faerie'],fig:'dragon',lore:'A tiny playful dragon.',morale:8,fly:true});
_m('will_o_wisp',{n:'Will-o\'-the-Wisp',hd:'3d8',hp:'3d8',ac:4,mv:15,thac0:16,atk:[['1d6',1],['drain',1]],size:'S',ml:'undead',xp:100,gold:'1d6',tags:['undead','wisp'],fig:'orb',lore:'A ghostly light that lures travelers.',morale:12,incorporeal:true,undead:'rank1'});
_m('ghost',{n:'Ghost',hd:'5d8',hp:'5d8',ac:4,mv:15,thac0:14,atk:[['1d6',1]],size:'M',ml:'undead',xp:120,gold:'2d6',tags:['undead','ghost'],fig:'undead',lore:'A spirit bound to the mortal world.',morale:14,incorporeal:true,undead:'rank1'});
_m('specter',{n:'Specter',hd:'6d8',hp:'6d8',ac:3,mv:15,thac0:13,atk:[['1d8',1],['drain',1]],size:'M',ml:'undead',xp:180,gold:'3d6',tags:['undead','specter'],fig:'undead',lore:'A powerful draining spirit.',morale:16,incorporeal:true,undead:'rank2'});
_m('banshee',{n:'Banshee',hd:'7d8',hp:'7d8',ac:2,mv:15,thac0:12,atk:[['1d6',1]],size:'M',ml:'undead',xp:250,gold:'4d6',tags:['undead','banshee'],fig:'undead',lore:'A wailing spirit that kills with its cry.',morale:18,incorporeal:true,undead:'rank2',caster:{list:'hold_person,death_spell',lvl:9}});
_m('night_hag',{n:'Night Hag',hd:'8d8',hp:'8d8',ac:3,mv:15,thac0:11,atk:[['1d4',2],['dream',1]],size:'M',ml:'fiend',xp:400,gold:'3d6',tags:['fiend','hag'],fig:'humanoid',lore:'A hag that steals children in dreams.',morale:16,fly:true});
_m('green_hag',{n:'Green Hag',hd:'7d8',hp:'7d8',ac:4,mv:9,thac0:12,atk:[['1d4',2]],size:'M',ml:'humanoid',xp:300,gold:'3d6',tags:['humanoid','hag'],fig:'humanoid',lore:'A hideous swamp hag.',morale:14,caster:{list:'hold_person,cause_serious',lvl:6}});
_m('sea_hag',{n:'Sea Hag',hd:'6d8',hp:'6d8',ac:5,mv:9,thac0:13,atk:[['1d4',2]],size:'M',ml:'humanoid',xp:250,gold:'3d6',tags:['humanoid','hag'],fig:'humanoid',lore:'A hag of the sea.',morale:12});
_m('vampire_spawn',{n:'Vampire Spawn',hd:'5d8',hp:'5d8',ac:2,mv:15,thac0:13,atk:[['1d6',1],['drain',1]],size:'M',ml:'undead',xp:300,gold:'3d6',tags:['undead','vampire'],fig:'undead',lore:'A lesser vampire risen from the grave.',morale:14,undead:'rank2'});
_m('vampire_bat',{n:'Vampire Bat',hd:'3d8',hp:'3d8',ac:6,mv:18,thac0:16,atk:[['1d4',1]],size:'S',ml:'undead',xp:60,gold:'1d4',tags:['undead','bat'],fig:'bat',lore:'A bat that drains blood.',morale:10,undead:'rank1',fly:true});
_m('giant_vampire_bat',{n:'Giant Vampire Bat',hd:'6d8',hp:'6d8',ac:5,mv:18,thac0:13,atk:[['1d6',1],['drain',1]],size:'L',ml:'undead',xp:200,gold:'2d6',tags:['undead','bat'],fig:'bat',lore:'A huge blood-drinking bat.',morale:12,undead:'rank1',fly:true});
_m('swarm_rat',{n:'Rat Swarm',hd:'2d8',hp:'2d8',ac:7,mv:12,thac0:18,atk:[['1d4',1]],size:'L',ml:'vermin',xp:25,gold:'1d4',tags:['vermin','swarm'],fig:'rat',lore:'A writhing mass of rats.',morale:10});
_m('swarm_insect',{n:'Insect Swarm',hd:'3d8',hp:'3d8',ac:8,mv:15,thac0:18,atk:[['1d4',1]],size:'L',ml:'vermin',xp:40,gold:'1d4',tags:['vermin','swarm','insect'],fig:'insect',lore:'A cloud of biting insects.',morale:12});
_m('swarm_bat',{n:'Bat Swarm',hd:'3d8',hp:'3d8',ac:8,mv:18,thac0:18,atk:[['1d4',1]],size:'L',ml:'vermin',xp:45,gold:'1d4',tags:['vermin','swarm','bat'],fig:'bat',lore:'A swarm of bats.',morale:12,fly:true});
_m('swarm_spider',{n:'Spider Swarm',hd:'3d8',hp:'3d8',ac:6,mv:12,thac0:17,atk:[['1d4',1]],size:'L',ml:'vermin',xp:50,gold:'1d4',tags:['vermin','swarm','arachnid'],fig:'spider',lore:'A swarm of spiders.',morale:12});
_m('carrion_crawler',{n:'Carrion Crawler',hd:'3d8',hp:'3d8',ac:3,mv:9,thac0:16,atk:[['1d6',1],['paralysis',1]],size:'L',ml:'vermin',xp:70,gold:'1d6',tags:['vermin','crawler'],fig:'insect',lore:'A scavenging crawler that paralyzes.',morale:10});
_m('ankheg',{n:'Ankheg',hd:'5d8',hp:'5d8',ac:4,mv:9,thac0:14,atk:[['1d8',1],['1d6',1]],size:'L',ml:'vermin',xp:150,gold:'2d6',tags:['vermin','ankheg'],fig:'insect',lore:'A burrowing insect with a fearsome bite.',morale:12});
_m('purple_worm',{n:'Purple Worm',hd:'12d8',hp:'12d8',ac:2,mv:6,thac0:9,atk:[['3d6',1]],size:'G',ml:'vermin',xp:2000,gold:'1d100',tags:['vermin','worm'],fig:'serpent',lore:'A colossal burrowing worm.',morale:20});
_m('remorhaz',{n:'Remorhaz',hd:'9d8',hp:'9d8',ac:4,mv:9,thac0:11,atk:[['2d6',1]],size:'L',ml:'vermin',xp:500,gold:'3d6',tags:['vermin','remorhaz'],fig:'serpent',lore:'A cold-blooded burrower.',morale:16});
_m('rust_beetle',{n:'Rust Beetle',hd:'2d8',hp:'2d8',ac:4,mv:9,thac0:17,atk:[['1d4',1]],size:'M',ml:'vermin',xp:20,gold:'1d4',tags:['vermin','beetle'],fig:'insect',lore:'A beetle that corrodes metal.',morale:8});
_m('giant_owl',{n:'Giant Owl',hd:'4d8',hp:'4d8',ac:6,mv:12,thac0:15,atk:[['1d6',1]],size:'L',ml:'beast',xp:80,gold:'1d6',tags:['beast','owl'],fig:'bird',lore:'A huge owl.',morale:10,fly:true});
_m('dire_bat',{n:'Dire Bat',hd:'2d8',hp:'2d8',ac:6,mv:18,thac0:18,atk:[['1d4',1]],size:'S',ml:'beast',xp:25,gold:'1d4',tags:['beast','bat'],fig:'bat',lore:'A large bat.',morale:8,fly:true});
_m('giant_bat',{n:'Giant Bat',hd:'3d8',hp:'3d8',ac:5,mv:18,thac0:16,atk:[['1d6',1]],size:'M',ml:'beast',xp:50,gold:'1d4',tags:['beast','bat'],fig:'bat',lore:'A bat the size of a wolf.',morale:9,fly:true});
_m('shadow_drake',{n:'Shadow Drake',hd:'9d8',hp:'9d8',ac:2,mv:15,thac0:11,atk:[['2d6',1],['1d6',1]],size:'L',ml:'dragon',xp:600,gold:'4d10',tags:['dragon','shadow'],fig:'dragon',lore:'A drake of living shadow.',morale:18,fly:true});
_m('drake',{n:'Drake',hd:'6d8',hp:'6d8',ac:4,mv:12,thac0:13,atk:[['1d8',1]],size:'L',ml:'dragon',xp:250,gold:'2d10',tags:['dragon','drake'],fig:'dragon',lore:'A lesser dragon.',morale:14});
_m('dragon_turtle',{n:'Dragon Turtle',hd:'14d8',hp:'14d8',ac:2,mv:6,thac0:8,atk:[['2d8',1]],size:'G',ml:'dragon',xp:4000,gold:'1d100',tags:['dragon','turtle'],fig:'turtle',lore:'A massive turtle-dragon of the sea.',morale:20});
_m('kraken',{n:'Kraken',hd:'12d8',hp:'12d8',ac:1,mv:6,thac0:9,atk:[['2d8',1]],size:'G',ml:'beast',xp:2000,gold:'1d100',tags:['beast','kraken'],fig:'serpent',lore:'A tentacled sea monster.',morale:20});
_m('sahuagin_priest',{n:'Sahuagin Priest',hd:'6d8',hp:'6d8',ac:3,mv:12,thac0:13,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:200,gold:'3d6',tags:['humanoid','sahuagin','caster'],fig:'humanoid',lore:'A sahuagin shaman.',morale:12,caster:{list:'cause_light,cause_serious,cure_light,hold_person',lvl:5}});
_m('sahuagin_barbarian',{n:'Sahuagin Barbarian',hd:'6d8',hp:'6d8',ac:4,mv:15,thac0:13,atk:[['2d4',1]],size:'M',ml:'humanoid',xp:180,gold:'3d6',tags:['humanoid','sahuagin'],fig:'humanoid',lore:'A fierce sahuagin warrior.',morale:12});
_m('lizardfolk_shaman',{n:'Lizardfolk Shaman',hd:'6d8',hp:'6d8',ac:4,mv:9,thac0:13,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:200,gold:'3d6',tags:['humanoid','lizard','caster'],fig:'humanoid',lore:'A lizardfolk medicine man.',morale:12,caster:{list:'cure_light,hold_person,invisibility',lvl:5}});
_m('tabaxi',{n:'Tabaxi',hd:'3d8',hp:'3d8',ac:6,mv:15,thac0:16,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:60,gold:'2d4',tags:['humanoid','tabaxi'],fig:'humanoid',lore:'A cat-folk wanderer.',morale:9});
_m('aasimar',{n:'Aasimar',hd:'4d8',hp:'4d8',ac:5,mv:12,thac0:15,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:100,gold:'2d6',tags:['humanoid','aasimar'],fig:'humanoid',lore:'A celestial-touched human.',morale:10});
_m('tiefling',{n:'Tiefling',hd:'4d8',hp:'4d8',ac:5,mv:12,thac0:15,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:90,gold:'2d6',tags:['humanoid','tiefling'],fig:'humanoid',lore:'A fiend-touched human.',morale:9});
_m('kenku',{n:'Kenku',hd:'3d8',hp:'3d8',ac:6,mv:12,thac0:16,atk:[['1d4',2]],size:'M',ml:'humanoid',xp:70,gold:'2d4',tags:['humanoid','kenku'],fig:'humanoid',lore:'A winged crow-folk rogue.',morale:9,fly:true});
_m('autognome',{n:'Autognome',hd:'2d8',hp:'2d8',ac:6,mv:9,thac0:17,atk:[['1d4',1]],size:'S',ml:'humanoid',xp:30,gold:'1d4',tags:['humanoid','gnome'],fig:'humanoid',lore:'A mechanical gnome construct.',morale:8});
_m('grimlock',{n:'Grimlock',hd:'3d8',hp:'3d8',ac:5,mv:12,thac0:16,atk:[['1d4',2]],size:'M',ml:'humanoid',xp:60,gold:'1d4',tags:['humanoid','grimlock'],fig:'humanoid',lore:'A blind cave dweller.',morale:8});
_m('deep_gnome',{n:'Deep Gnome',hd:'3d8',hp:'3d8',ac:5,mv:9,thac0:16,atk:[['1d6',1]],size:'S',ml:'humanoid',xp:80,gold:'2d4',tags:['humanoid','gnome'],fig:'humanoid',lore:'A gnome of the underdark.',morale:10});
_m('svirfneblin',{n:'Svirfneblin',hd:'2d8',hp:'2d8',ac:6,mv:9,thac0:17,atk:[['1d4',1]],size:'S',ml:'humanoid',xp:40,gold:'1d4',tags:['humanoid','gnome'],fig:'humanoid',lore:'A deep gnome illusionist.',morale:8,caster:{list:'invisibility,mirror_image,blink',lvl:3}});
_m('duergar',{n:'Duergar',hd:'4d8',hp:'4d8',ac:4,mv:9,thac0:15,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:120,gold:'3d6',tags:['humanoid','duergar'],fig:'humanoid',lore:'A gray dwarf of the underdark.',morale:12});
_m('deep_dwarf',{n:'Deep Dwarf',hd:'5d8',hp:'5d8',ac:3,mv:9,thac0:14,atk:[['1d8',1],['1d4',1]],size:'M',ml:'humanoid',xp:150,gold:'3d6',tags:['humanoid','dwarf'],fig:'humanoid',lore:'A dwarf of the deep places.',morale:12});
_m('morlock',{n:'Morlock',hd:'4d8',hp:'4d8',ac:5,mv:12,thac0:15,atk:[['1d4',2]],size:'M',ml:'humanoid',xp:100,gold:'1d4',tags:['humanoid','morlock'],fig:'humanoid',lore:'A sightless cave dweller.',morale:10});
_m('derro',{n:'Derro',hd:'3d8',hp:'3d8',ac:6,mv:12,thac0:16,atk:[['1d4',1]],size:'S',ml:'humanoid',xp:80,gold:'2d4',tags:['humanoid','derro'],fig:'humanoid',lore:'A twisted little demon-folk.',morale:9});
_m('quaggoth',{n:'Quaggoth',hd:'4d8',hp:'4d8',ac:5,mv:12,thac0:15,atk:[['1d4',2]],size:'M',ml:'humanoid',xp:90,gold:'2d4',tags:['humanoid','quaggoth'],fig:'humanoid',lore:'A bestial troglodyte kin.',morale:10});
_m('thri_kreen',{n:'Thri-kreen',hd:'5d8',hp:'5d8',ac:4,mv:12,thac0:14,atk:[['1d6',1],['1d4',1]],size:'M',ml:'vermin',xp:150,gold:'2d6',tags:['vermin','thri'],fig:'insect',lore:'An insectoid warrior.',morale:12});
_m('ettin_almost',{n:'Almost-Adult Ettin',hd:'8d8',hp:'8d8',ac:4,mv:12,thac0:12,atk:[['2d6',1]],size:'L',ml:'giant',xp:400,gold:'3d10',tags:['giant','ettin'],fig:'giant',lore:'A young ettin.',morale:14});
_m('roc_chick',{n:'Roc Chick',hd:'8d8',hp:'8d8',ac:3,mv:15,thac0:12,atk:[['2d4',1]],size:'L',ml:'beast',xp:400,gold:'1d6',tags:['beast','flyer'],fig:'bird',lore:'A young roc.',morale:14,fly:true});
_m('young_remorhaz',{n:'Young Remorhaz',hd:'7d8',hp:'7d8',ac:5,mv:9,thac0:12,atk:[['1d10',1]],size:'L',ml:'vermin',xp:300,gold:'2d6',tags:['vermin','remorhaz'],fig:'serpent',lore:'A young remorhaz.',morale:12});
_m('ankheg_swarmling',{n:'Ankheg Swarmling',hd:'3d8',hp:'3d8',ac:5,mv:9,thac0:16,atk:[['1d6',1]],size:'M',ml:'vermin',xp:60,gold:'1d4',tags:['vermin','ankheg'],fig:'insect',lore:'A young ankheg.',morale:9});
_m('manticore',{n:'Manticore',hd:'6d8',hp:'6d8',ac:3,mv:15,thac0:13,atk:[['1d6',1],['spikes',1]],size:'L',ml:'beast',xp:300,gold:'3d6',tags:['beast','manticore'],fig:'lion',lore:'A lion-bodied monster that hurls spikes.',morale:14});
_m('displacer_beast',{n:'Displacer Beast',hd:'5d8',hp:'5d8',ac:3,mv:15,thac0:14,atk:[['1d6',2]],size:'L',ml:'beast',xp:250,gold:'2d6',tags:['beast','displacer'],fig:'beast',lore:'A cat-like beast that bends light.',morale:12});
_m('chimera',{n:'Chimera',hd:'9d8',hp:'9d8',ac:3,mv:15,thac0:11,atk:[['1d6',3]],size:'L',ml:'beast',xp:600,gold:'4d10',tags:['beast','chimera'],fig:'beast',lore:'A lion-goat-dragon hybrid.',morale:16});
_m('rust_dragon',{n:'Rust Dragon',hd:'11d8',hp:'11d8',ac:0,mv:12,thac0:10,atk:[['2d6',1],['rust',1]],size:'L',ml:'dragon',xp:1500,gold:'8d10',tags:['dragon','rust'],fig:'dragon',lore:'A dragon that corrodes metal.',morale:20});
_m('dragon_lizard',{n:'Dragon Lizard',hd:'8d8',hp:'8d8',ac:4,mv:15,thac0:12,atk:[['2d6',1]],size:'L',ml:'dragon',xp:400,gold:'2d10',tags:['dragon','lizard'],fig:'dragon',lore:'A flying lizard-dragon.',morale:14,fly:true});
_m('beholderkin_eye',{n:'Eye Tyrant',hd:'12d8',hp:'12d8',ac:0,mv:9,thac0:9,atk:[['1d4',12]],size:'G',ml:'aberration',xp:2000,gold:'1d100',tags:['aberration','eye'],fig:'orb',lore:'A beholder lord with many eyes.',morale:20});
_m('illithid_drone',{n:'Illithid Drone',hd:'6d8',hp:'6d8',ac:1,mv:12,thac0:13,atk:[['1d4',2],['stun',1]],size:'M',ml:'aberration',xp:250,gold:'3d6',tags:['aberration','mindflayer'],fig:'humanoid',lore:'A mind flayer drone.',morale:12});
_m('duergar_underdark',{n:'Duergar Warrior',hd:'5d8',hp:'5d8',ac:3,mv:9,thac0:14,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:200,gold:'3d6',tags:['humanoid','duergar'],fig:'humanoid',lore:'A gray dwarf warrior.',morale:14});
_m('drow_priestess',{n:'Drow Priestess',hd:'7d8',hp:'7d8',ac:4,mv:12,thac0:12,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:350,gold:'4d6',tags:['humanoid','drow','caster'],fig:'humanoid',lore:'A drow priestess of Lolth.',morale:14,caster:{list:'cure_light,hold_person,invisibility,fireball',lvl:7}});
_m('derro_savage',{n:'Derro Savage',hd:'4d8',hp:'4d8',ac:5,mv:12,thac0:15,atk:[['1d4',2]],size:'S',ml:'humanoid',xp:100,gold:'2d4',tags:['humanoid','derro'],fig:'humanoid',lore:'A savage derro.',morale:10});
_m('quaggoth_thonot',{n:'Quaggoth Thonot',hd:'5d8',hp:'5d8',ac:4,mv:12,thac0:14,atk:[['1d4',2]],size:'M',ml:'humanoid',xp:150,gold:'2d6',tags:['humanoid','quaggoth'],fig:'humanoid',lore:'A quaggoth hunter.',morale:12});
_m('svirfneblin_invisible',{n:'Svirfneblin Invisible Stalker',hd:'4d8',hp:'4d8',ac:3,mv:15,thac0:14,atk:[['1d4',2]],size:'S',ml:'humanoid',xp:200,gold:'2d6',tags:['humanoid','gnome','invisible'],fig:'humanoid',lore:'An invisible gnome stalker.',morale:12,invisible:true});
_m('deep_dwarf_slayer',{n:'Deep Dwarf Slayer',hd:'8d8',hp:'8d8',ac:2,mv:9,thac0:11,atk:[['2d6',1]],size:'M',ml:'humanoid',xp:500,gold:'4d10',tags:['humanoid','dwarf'],fig:'humanoid',lore:'A deep dwarf assassin.',morale:16});
_m('morlock_hunter',{n:'Morlock Hunter',hd:'7d8',hp:'7d8',ac:3,mv:12,thac0:12,atk:[['1d8',2]],size:'M',ml:'humanoid',xp:300,gold:'3d6',tags:['humanoid','morlock'],fig:'humanoid',lore:'A morlock warrior.',morale:14});
_m('illithid_psion',{n:'Illithid Psion',hd:'9d8',hp:'9d8',ac:0,mv:12,thac0:10,atk:[['1d4',2],['stun',1]],size:'M',ml:'aberration',xp:600,gold:'5d6',tags:['aberration','mindflayer','caster'],fig:'humanoid',lore:'A psionic mind flayer.',morale:16,caster:{list:'hold_monster,disintegrate,invisibility',lvl:9}});
_m('beholder_death',{n:'Beholder Death Tyrant',hd:'13d8',hp:'13d8',ac:0,mv:9,thac0:8,atk:[['1d4',13]],size:'G',ml:'aberration',xp:3000,gold:'1d100',tags:['aberration','eye'],fig:'orb',lore:'A beholder of death.',morale:20});
_m('beholder_wonder',{n:'Beholder Wonder',hd:'11d8',hp:'11d8',ac:1,mv:9,thac0:9,atk:[['1d4',11]],size:'G',ml:'aberration',xp:1500,gold:'8d10',tags:['aberration','eye'],fig:'orb',lore:'A beholder of wonder.',morale:18});
_m('dracolich',{n:'Dracolich',hd:'16d8',hp:'16d8',ac:-1,mv:15,thac0:7,atk:[['2d8',2]],size:'G',ml:'undead',xp:5000,gold:'1d100',tags:['undead','dragon','lich'],fig:'dragon',lore:'An undead dragon of terrible power.',morale:20,undead:'rank3',caster:{list:'fireball,cone_of_cold,disintegrate,meteor_swarm',lvl:12},breath:'10d8 fire',fly:true});
_m('dragon_ancient',{n:'Ancient Dragon',hd:'18d8',hp:'18d8',ac:-2,mv:15,thac0:6,atk:[['3d8',1],['2d6',1]],size:'G',ml:'dragon',xp:8000,gold:'1d100',tags:['dragon','fire'],fig:'dragon',lore:'An ancient dragon of legend.',morale:20,breath:'15d6 fire',fly:true});
_m('hydra',{n:'Hydra',hd:'12d8',hp:'12d8',ac:1,mv:9,thac0:10,atk:[['1d8',5]],size:'G',ml:'beast',xp:1500,gold:'5d10',tags:['beast','hydra'],fig:'serpent',lore:'A many-headed serpent.',morale:20});
_m('seastorm',{n:'Sea Serpent',hd:'10d8',hp:'10d8',ac:2,mv:9,thac0:11,atk:[['2d8',1]],size:'G',ml:'beast',xp:800,gold:'3d10',tags:['beast','serpent'],fig:'serpent',lore:'A giant sea serpent.',morale:16});
_m('roc_matriarch',{n:'Roc Matriarch',hd:'14d8',hp:'14d8',ac:1,mv:15,thac0:9,atk:[['3d6',1]],size:'G',ml:'beast',xp:2000,gold:'5d10',tags:['beast','flyer'],fig:'bird',lore:'A mother roc of great size.',morale:20,fly:true});
_m('griffon_matriarch',{n:'Griffon Matriarch',hd:'9d8',hp:'9d8',ac:2,mv:15,thac0:11,atk:[['2d6',1]],size:'L',ml:'beast',xp:600,gold:'3d10',tags:['beast','flyer'],fig:'bird',lore:'A mother griffon.',morale:16,fly:true});
_m('unicorn_stallion',{n:'Unicorn Stallion',hd:'8d8',hp:'8d8',ac:2,mv:18,thac0:11,atk:[['2d6',1]],size:'L',ml:'beast',xp:500,gold:'4d6',tags:['beast','unicorn'],fig:'horse',lore:'A powerful unicorn.',morale:16});
_m('centaur_chieftain',{n:'Centaur Chieftain',hd:'8d8',hp:'8d8',ac:2,mv:18,thac0:11,atk:[['2d6',1]],size:'L',ml:'humanoid',xp:500,gold:'4d6',tags:['humanoid','centaur'],fig:'centaur',lore:'A centaur chief.',morale:16});
_m('satyr_lord',{n:'Satyr Lord',hd:'6d8',hp:'6d8',ac:3,mv:18,thac0:13,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:200,gold:'3d4',tags:['humanoid','satyr','caster'],fig:'humanoid',lore:'A satyr lord of revelry.',morale:12,caster:{list:'hold_person,invisibility',lvl:5}});
_m('dryad_queen',{n:'Dryad Queen',hd:'8d8',hp:'8d8',ac:4,mv:15,thac0:11,atk:[['1d8',1]],size:'L',ml:'fey',xp:600,gold:'4d6',tags:['fey','dryad'],fig:'humanoid',lore:'A queen of the dryads.',morale:16,caster:{list:'cure_light,hold_person,invisibility,cone_of_cold',lvl:9}});
_m('sprite_queen',{n:'Sprite Queen',hd:'4d4',hp:'4d4',ac:7,mv:18,thac0:15,atk:[['1d2',1]],size:'S',ml:'fey',xp:100,gold:'2d4',tags:['fey','sprite'],fig:'humanoid',lore:'A queen of sprites.',morale:8,fly:true});
_m('pixie_queen',{n:'Pixie Queen',hd:'4d4',hp:'4d4',ac:8,mv:18,thac0:16,atk:[['1d2',1]],size:'S',ml:'fey',xp:120,gold:'2d4',tags:['fey','pixie'],fig:'humanoid',lore:'A queen of pixies.',morale:8,fly:true});
_m('nymph_changelin',{n:'Changelin',hd:'5d8',hp:'5d8',ac:6,mv:15,thac0:14,atk:[['1d6',1]],size:'M',ml:'fey',xp:200,gold:'3d4',tags:['fey','nymph'],fig:'humanoid',lore:'A fey of shifting form.',morale:12});
_m('faerie_dragon_ancient',{n:'Ancient Faerie Dragon',hd:'8d8',hp:'8d8',ac:2,mv:18,thac0:11,atk:[['1d6',2]],size:'S',ml:'dragon',xp:600,gold:'4d6',tags:['dragon','faerie'],fig:'dragon',lore:'An ancient faerie dragon.',morale:16,fly:true});
_m('will_o_wisp_dread',{n:'Dread Wisp',hd:'6d8',hp:'6d8',ac:2,mv:18,thac0:12,atk:[['2d6',1],['drain',1]],size:'S',ml:'undead',xp:400,gold:'3d6',tags:['undead','wisp'],fig:'orb',lore:'A dread wisp of the deep dark.',morale:16,incorporeal:true,undead:'rank2'});
_m('ghost_poltergeist',{n:'Poltergeist',hd:'7d8',hp:'7d8',ac:2,mv:18,thac0:12,atk:[['1d8',1]],size:'M',ml:'undead',xp:300,gold:'3d6',tags:['undead','ghost'],fig:'undead',lore:'A violent ghost.',morale:16,incorporeal:true,undead:'rank2'});
_m('specter_dread',{n:'Dread Specter',hd:'8d8',hp:'8d8',ac:1,mv:18,thac0:11,atk:[['2d6',1],['drain',1]],size:'M',ml:'undead',xp:500,gold:'4d6',tags:['undead','specter'],fig:'undead',lore:'A dread specter.',morale:18,incorporeal:true,undead:'rank2'});
_m('banshee_queen',{n:'Banshee Queen',hd:'9d8',hp:'9d8',ac:0,mv:18,thac0:10,atk:[['1d8',1]],size:'M',ml:'undead',xp:800,gold:'5d6',tags:['undead','banshee'],fig:'undead',lore:'A queen banshee.',morale:20,incorporeal:true,undead:'rank3',caster:{list:'hold_person,death_spell,destruction',lvl:10}});
_m('night_hag_dread',{n:'Dread Night Hag',hd:'10d8',hp:'10d8',ac:2,mv:18,thac0:9,atk:[['1d6',2],['dream',1]],size:'M',ml:'fiend',xp:800,gold:'4d6',tags:['fiend','hag'],fig:'humanoid',lore:'A dread night hag.',morale:18,fly:true});
_m('green_hag_coven',{n:'Green Hag Coven',hd:'9d8',hp:'9d8',ac:3,mv:9,thac0:11,atk:[['1d6',2]],size:'M',ml:'humanoid',xp:500,gold:'4d6',tags:['humanoid','hag'],fig:'humanoid',lore:'A green hag of a coven.',morale:16,caster:{list:'hold_person,cause_serious,cone_of_cold',lvl:8}});
_m('sea_hag_dread',{n:'Dread Sea Hag',hd:'8d8',hp:'8d8',ac:4,mv:9,thac0:11,atk:[['1d6',2]],size:'M',ml:'humanoid',xp:400,gold:'3d6',tags:['humanoid','hag'],fig:'humanoid',lore:'A dread sea hag.',morale:14});
_m('vampire_lord',{n:'Vampire Lord',hd:'10d8',hp:'10d8',ac:1,mv:18,thac0:10,atk:[['2d6',1],['drain',1]],size:'M',ml:'undead',xp:1500,gold:'6d10',tags:['undead','vampire'],fig:'undead',lore:'A vampire lord of the night.',morale:20,undead:'rank3'});
_m('vampire_bat_swarm',{n:'Vampire Bat Swarm',hd:'6d8',hp:'6d8',ac:4,mv:18,thac0:13,atk:[['1d6',2],['drain',1]],size:'L',ml:'undead',xp:300,gold:'3d4',tags:['undead','bat','swarm'],fig:'bat',lore:'A swarm of vampire bats.',morale:12,undead:'rank1',fly:true});
_m('giant_vampire_bat_lord',{n:'Giant Vampire Bat Lord',hd:'9d8',hp:'9d8',ac:3,mv:18,thac0:11,atk:[['2d6',1],['drain',1]],size:'L',ml:'undead',xp:800,gold:'4d6',tags:['undead','bat'],fig:'bat',lore:'A lord of vampire bats.',morale:16,undead:'rank1',fly:true});
_m('swarm_rat_giant',{n:'Giant Rat Swarm',hd:'4d8',hp:'4d8',ac:5,mv:15,thac0:15,atk:[['1d6',1]],size:'G',ml:'vermin',xp:100,gold:'2d4',tags:['vermin','swarm','rat'],fig:'rat',lore:'A swarm of giant rats.',morale:14});
_m('swarm_insect_giant',{n:'Giant Insect Swarm',hd:'5d8',hp:'5d8',ac:6,mv:18,thac0:14,atk:[['1d6',1]],size:'G',ml:'vermin',xp:200,gold:'2d4',tags:['vermin','swarm','insect'],fig:'insect',lore:'A swarm of giant insects.',morale:14});
_m('swarm_bat_giant',{n:'Giant Bat Swarm',hd:'5d8',hp:'5d8',ac:6,mv:18,thac0:14,atk:[['1d6',1]],size:'G',ml:'vermin',xp:220,gold:'2d4',tags:['vermin','swarm','bat'],fig:'bat',lore:'A swarm of giant bats.',morale:14,fly:true});
_m('swarm_spider_giant',{n:'Giant Spider Swarm',hd:'5d8',hp:'5d8',ac:4,mv:15,thac0:13,atk:[['1d6',1]],size:'G',ml:'vermin',xp:250,gold:'2d4',tags:['vermin','swarm','arachnid'],fig:'spider',lore:'A swarm of giant spiders.',morale:14});
_m('carrion_crawler_elder',{n:'Elder Carrion Crawler',hd:'6d8',hp:'6d8',ac:2,mv:9,thac0:12,atk:[['1d8',1],['paralysis',1]],size:'L',ml:'vermin',xp:300,gold:'3d6',tags:['vermin','crawler'],fig:'insect',lore:'An elder carrion crawler.',morale:14});
_m('ankheg_elder',{n:'Elder Ankheg',hd:'8d8',hp:'8d8',ac:3,mv:9,thac0:11,atk:[['2d6',1],['1d8',1]],size:'L',ml:'vermin',xp:600,gold:'3d10',tags:['vermin','ankheg'],fig:'insect',lore:'An elder ankheg.',morale:16});
_m('purple_worm_elder',{n:'Elder Purple Worm',hd:'16d8',hp:'16d8',ac:0,mv:6,thac0:7,atk:[['4d8',1]],size:'G',ml:'vermin',xp:6000,gold:'2d100',tags:['vermin','worm'],fig:'serpent',lore:'An elder purple worm.',morale:22});
_m('remorhaz_elder',{n:'Elder Remorhaz',hd:'12d8',hp:'12d8',ac:2,mv:9,thac0:8,atk:[['3d6',1]],size:'L',ml:'vermin',xp:1200,gold:'4d10',tags:['vermin','remorhaz'],fig:'serpent',lore:'An elder remorhaz.',morale:18});
_m('rust_beetle_giant',{n:'Giant Rust Beetle',hd:'5d8',hp:'5d8',ac:3,mv:9,thac0:14,atk:[['1d6',1]],size:'L',ml:'vermin',xp:150,gold:'2d6',tags:['vermin','beetle'],fig:'insect',lore:'A giant rust beetle.',morale:10});
_m('giant_owl_ancient',{n:'Ancient Giant Owl',hd:'8d8',hp:'8d8',ac:4,mv:15,thac0:11,atk:[['1d8',2]],size:'L',ml:'beast',xp:500,gold:'3d6',tags:['beast','owl'],fig:'bird',lore:'An ancient giant owl.',morale:14,fly:true});
_m('dire_bat_lord',{n:'Dire Bat Lord',hd:'5d8',hp:'5d8',ac:4,mv:18,thac0:13,atk:[['1d6',2]],size:'L',ml:'beast',xp:200,gold:'3d4',tags:['beast','bat'],fig:'bat',lore:'A lord of dire bats.',morale:12,fly:true});
_m('giant_bat_lord',{n:'Giant Bat Lord',hd:'6d8',hp:'6d8',ac:3,mv:18,thac0:12,atk:[['1d8',2]],size:'L',ml:'beast',xp:300,gold:'3d4',tags:['beast','bat'],fig:'bat',lore:'A lord of giant bats.',morale:14,fly:true});
_m('shadow_drake_elder',{n:'Elder Shadow Drake',hd:'12d8',hp:'12d8',ac:1,mv:18,thac0:9,atk:[['2d8',1],['1d8',1]],size:'L',ml:'dragon',xp:1200,gold:'6d10',tags:['dragon','shadow'],fig:'dragon',lore:'An elder shadow drake.',morale:20,fly:true});
_m('drake_elder',{n:'Elder Drake',hd:'9d8',hp:'9d8',ac:3,mv:15,thac0:10,atk:[['2d6',1],['1d6',1]],size:'L',ml:'dragon',xp:600,gold:'3d10',tags:['dragon','drake'],fig:'dragon',lore:'An elder drake.',morale:16,fly:true});
_m('dragon_turtle_elder',{n:'Elder Dragon Turtle',hd:'17d8',hp:'17d8',ac:0,mv:6,thac0:6,atk:[['3d8',1]],size:'G',ml:'dragon',xp:6000,gold:'2d100',tags:['dragon','turtle'],fig:'turtle',lore:'An elder dragon turtle.',morale:22});
_m('kraken_elder',{n:'Elder Kraken',hd:'15d8',hp:'15d8',ac:0,mv:6,thac0:7,atk:[['3d8',1]],size:'G',ml:'beast',xp:4000,gold:'2d100',tags:['beast','kraken'],fig:'serpent',lore:'An elder kraken.',morale:22});
_m('sahuagin_priest_elder',{n:'Elder Sahuagin Priest',hd:'9d8',hp:'9d8',ac:2,mv:15,thac0:10,atk:[['2d6',1]],size:'M',ml:'humanoid',xp:500,gold:'4d6',tags:['humanoid','sahuagin','caster'],fig:'humanoid',lore:'An elder sahuagin priest.',morale:16,caster:{list:'cause_light,cause_serious,cure_light,hold_person,lightning_bolt',lvl:9}});
_m('sahuagin_barbarian_lord',{n:'Sahuagin Barbarian Lord',hd:'9d8',hp:'9d8',ac:2,mv:18,thac0:10,atk:[['2d8',1]],size:'M',ml:'humanoid',xp:500,gold:'4d6',tags:['humanoid','sahuagin'],fig:'humanoid',lore:'A sahuagin barbarian lord.',morale:16});
_m('lizardfolk_shaman_elder',{n:'Elder Lizardfolk Shaman',hd:'9d8',hp:'9d8',ac:3,mv:9,thac0:10,atk:[['2d6',1]],size:'M',ml:'humanoid',xp:500,gold:'4d6',tags:['humanoid','lizard','caster'],fig:'humanoid',lore:'An elder lizardfolk shaman.',morale:16,caster:{list:'cure_light,hold_person,invisibility,cone_of_cold',lvl:9}});
_m('tabaxi_lord',{n:'Tabaxi Lord',hd:'6d8',hp:'6d8',ac:4,mv:18,thac0:12,atk:[['1d8',2]],size:'M',ml:'humanoid',xp:250,gold:'3d6',tags:['humanoid','tabaxi'],fig:'humanoid',lore:'A tabaxi lord.',morale:14});
_m('aasimar_lord',{n:'Aasimar Lord',hd:'7d8',hp:'7d8',ac:3,mv:15,thac0:12,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:350,gold:'4d6',tags:['humanoid','aasimar','caster'],fig:'humanoid',lore:'An aasimar lord.',morale:14,caster:{list:'cure_light,cure_serious,hold_person',lvl:7}});
_m('tiefling_lord',{n:'Tiefling Lord',hd:'7d8',hp:'7d8',ac:3,mv:15,thac0:12,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:300,gold:'4d6',tags:['humanoid','tiefling','caster'],fig:'humanoid',lore:'A tiefling lord.',morale:14,caster:{list:'cause_light,cause_serious,hold_person',lvl:6}});
_m('kenku_lord',{n:'Kenku Lord',hd:'6d8',hp:'6d8',ac:4,mv:15,thac0:13,atk:[['1d6',2]],size:'M',ml:'humanoid',xp:300,gold:'3d6',tags:['humanoid','kenku'],fig:'humanoid',lore:'A kenku lord.',morale:14,fly:true});
_m('autognome_elder',{n:'Elder Autognome',hd:'5d8',hp:'5d8',ac:4,mv:9,thac0:14,atk:[['1d6',1]],size:'S',ml:'humanoid',xp:200,gold:'2d6',tags:['humanoid','gnome'],fig:'humanoid',lore:'An elder autognome.',morale:12});
_m('grimlock_elder',{n:'Elder Grimlock',hd:'6d8',hp:'6d8',ac:3,mv:15,thac0:13,atk:[['1d6',2]],size:'M',ml:'humanoid',xp:300,gold:'3d4',tags:['humanoid','grimlock'],fig:'humanoid',lore:'An elder grimlock.',morale:14});
_m('deep_gnome_elder',{n:'Elder Deep Gnome',hd:'6d8',hp:'6d8',ac:3,mv:9,thac0:13,atk:[['1d8',1]],size:'S',ml:'humanoid',xp:300,gold:'3d4',tags:['humanoid','gnome','caster'],fig:'humanoid',lore:'An elder deep gnome.',morale:14,caster:{list:'invisibility,mirror_image,hold_person',lvl:6}});
_m('svirfneblin_elder',{n:'Elder Svirfneblin',hd:'5d8',hp:'5d8',ac:4,mv:9,thac0:14,atk:[['1d6',1]],size:'S',ml:'humanoid',xp:250,gold:'3d4',tags:['humanoid','gnome','caster'],fig:'humanoid',lore:'An elder svirfneblin.',morale:12,caster:{list:'invisibility,mirror_image,blink',lvl:6}});
_m('duergar_elder',{n:'Elder Duergar',hd:'7d8',hp:'7d8',ac:2,mv:9,thac0:12,atk:[['2d6',1]],size:'M',ml:'humanoid',xp:400,gold:'4d6',tags:['humanoid','duergar'],fig:'humanoid',lore:'An elder duergar.',morale:16});
_m('deep_dwarf_king',{n:'Deep Dwarf King',hd:'10d8',hp:'10d8',ac:1,mv:9,thac0:9,atk:[['2d8',1],['1d8',1]],size:'M',ml:'humanoid',xp:1000,gold:'6d10',tags:['humanoid','dwarf'],fig:'humanoid',lore:'A king of the deep dwarves.',morale:20});
_m('morlock_elder',{n:'Elder Morlock',hd:'8d8',hp:'8d8',ac:2,mv:15,thac0:11,atk:[['1d8',2],['1d4',1]],size:'M',ml:'humanoid',xp:500,gold:'3d6',tags:['humanoid','morlock'],fig:'humanoid',lore:'An elder morlock.',morale:16});
_m('derro_elder',{n:'Derro Elder',hd:'6d8',hp:'6d8',ac:4,mv:15,thac0:13,atk:[['1d6',2]],size:'S',ml:'humanoid',xp:300,gold:'3d6',tags:['humanoid','derro'],fig:'humanoid',lore:'An elder derro.',morale:14});
_m('quaggoth_elder',{n:'Elder Quaggoth',hd:'7d8',hp:'7d8',ac:3,mv:15,thac0:12,atk:[['1d6',2]],size:'M',ml:'humanoid',xp:400,gold:'3d6',tags:['humanoid','quaggoth'],fig:'humanoid',lore:'An elder quaggoth.',morale:16});
_m('thri_kreen_elder',{n:'Elder Thri-kreen',hd:'8d8',hp:'8d8',ac:2,mv:15,thac0:11,atk:[['1d8',1],['1d6',1],['1d4',1]],size:'M',ml:'vermin',xp:600,gold:'3d10',tags:['vermin','thri'],fig:'insect',lore:'An elder thri-kreen.',morale:18});
_m('thri_kreen_psion',{n:'Thri-kreen Psion',hd:'9d8',hp:'9d8',ac:1,mv:15,thac0:10,atk:[['1d8',1]],size:'M',ml:'vermin',xp:800,gold:'4d10',tags:['vermin','thri','caster'],fig:'insect',lore:'A thri-kreen psion.',morale:18,caster:{list:'magic_missile,hold_monster,invisibility',lvl:9}});
/* saga bosses & leaders */
_m('skarrik',{n:'Skarrik',hd:'3d8',hp:'3d8',ac:4,mv:9,thac0:16,atk:[['1d6',1]],size:'M',ml:'humanoid',xp:80,gold:'4d6',tags:['humanoid','kobold','boss'],fig:'humanoid',lore:'Skarrik the kobold king, self-crowned in the cellars.',morale:16,leader:true});
_m('redfang',{n:'Redfang',hd:'5d8',hp:'5d8',ac:4,mv:15,thac0:14,atk:[['2d6',1]],size:'M',ml:'humanoid',xp:200,gold:'8d6',tags:['humanoid','gnoll','boss'],fig:'humanoid',lore:'Redfang, chieftain of the gnolls.',morale:18,leader:true});
_m('malvek',{n:'Malvek the Ashen',hd:'8d8',hp:'8d8',ac:2,mv:9,thac0:12,atk:[['1d8',1]],size:'M',ml:'undead',xp:500,gold:'10d6',tags:['undead','cult','boss'],fig:'undead',lore:'Malvek the Ashen, cult leader of the crypts.',morale:20,undead:'rank2',leader:true,caster:{list:'fireball,hold_person,invisibility,dispel_magic',lvl:9}});
_m('gorrak',{n:'Gorrak Skullsplitter',hd:'9d8',hp:'9d8',ac:3,mv:12,thac0:11,atk:[['2d8',1]],size:'L',ml:'giant',xp:600,gold:'10d6',tags:['giant','ogre','boss'],fig:'giant',lore:'Gorrak Skullsplitter, warlord of the deep mine.',morale:20,leader:true});
_m('iron_king',{n:'The Iron King',hd:'11d8',hp:'11d8',ac:0,mv:9,thac0:9,atk:[['2d8',1],['drain',1]],size:'L',ml:'undead',xp:1200,gold:'1d100',tags:['undead','iron_king','boss'],fig:'undead',lore:'The Iron King, an armored revenant of the barrow.',morale:22,undead:'rank3',leader:true,caster:{list:'fireball,hold_monster,disintegrate',lvl:10},regen:true});
_m('gnashrot',{n:'Gnashrot',hd:'8d8',hp:'8d8',ac:4,mv:15,thac0:12,atk:[['1d8',2]],size:'L',ml:'giant',xp:500,gold:'10d6',tags:['giant','troll','boss'],fig:'giant',lore:'Gnashrot, the troll chieftain of the moors.',morale:20,leader:true,regen:true});
_m('grull',{n:'Grull',hd:'12d8',hp:'12d8',ac:1,mv:18,thac0:8,atk:[['2d10',1],['2d6',1]],size:'G',ml:'giant',xp:2000,gold:'2d100',tags:['giant','boss'],fig:'giant',lore:'Grull, hill giant of Ravenmoor, hurling boulders.',morale:22,leader:true,ranged:['boulder','4d6']});
_m('vharra',{n:'Vharra, Witch-Queen',hd:'10d8',hp:'10d8',ac:2,mv:15,thac0:10,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:1500,gold:'5d10',tags:['humanoid','witch','boss','caster'],fig:'humanoid',lore:'Vharra, the Witch-Queen of Ravenmoor.',morale:22,leader:true,caster:{list:'fireball,cone_of_cold,hold_monster,disintegrate,meteor_swarm',lvl:12},fly:true});
_m('packlord',{n:'Bloodmane Packlord',hd:'5d8',hp:'5d8',ac:4,mv:15,thac0:14,atk:[['2d6',1]],size:'L',ml:'canine',xp:120,gold:'4d6',tags:['beast','wolf','boss'],fig:'wolf',lore:'The Bloodmane Packlord, a dire wolf with a mane of blood.',morale:18,leader:true});
_m('skarrik_kobold_king',{n:'Skarrik Kobold King',hd:'4d8',hp:'4d8',ac:3,mv:9,thac0:15,atk:[['1d8',1]],size:'M',ml:'humanoid',xp:100,gold:'5d6',tags:['humanoid','kobold','boss'],fig:'humanoid',lore:'Skarrik, self-crowned kobold king.',morale:16,leader:true});
/* named generated leaders pool */
const LEADER_NAMES=['Vex','Morgrath','Ashka','Zuloon','Tharok','Bryn','Karza','Durgan','Elara','Fenrik','Gorim','Hesta','Ignar','Jorik','Kessa','Lothar','Mira','Narg','Odo','Pyra','Quin','Ragna','Soren','Tamsin','Ulric','Vera','Wren','Xara','Yara','Zev'];
const MONSTER_LIST=Object.keys(MONSTERS);

/* ============================ MAPS (authored saga) ============================ */
const MAPS={};
function _map(id,o){o.id=id;MAPS[id]=o;return o;}
/* helper: make grid from strings. '#'=wall etc per spec legend. */
/* --- E0 Thornwick village --- */
_map('thornwick',{name:'Thornwick',w:19,h:15,outdoor:true,safe:true,grid:[
'###################',
'#........#........#',
'#..T.....#...T....#',
'#........G........#',
'#...F....#....F...#',
'#........#........#',
'#..1..2...3..4..5..#',
'#........#........#',
'#....6....7....8..#',
'#........#........#',
'#..T.....#...T....#',
'#........#........#',
'######<####>######',
'#................#',
'###################'],
locs:{'1':{name:'Elder\'s Longhouse',service:'elder'},'2':{name:'Inn',service:'inn'},'3':{name:'General Goods',service:'shop:general'},'4':{name:'Shrine of the Dawn',service:'temple'},'5':{name:'Tavern',service:'tavern'},'6':{name:'Training Hall',service:'train'},'7':{name:'Barracks',service:'barracks'},'8':{name:'Smithy',service:'smithy'}},
start:{x:9,y:13,dir:0},ev:{a:{text:'An old man waves you over. "New faces in Thornwick? The cellars under the brewery have gone wrong — rats, then worse. Take this." He presses a brass key into your palm. (Received Brass Cellar Key)','item':'cellar_key',deed:'met_elder'}},
traps:{'9,3':{type:'pit',text:'A hidden pit!'}},wander:[['giant_rat','2d4',20],['kobold','1d6',15]],
rumors:['Cellars under the brewery have gone wrong.','Widow Marrow lost her ring in the cellars.','Kobolds carry a brass key.'],
});
/* --- E0 cellar --- */
_map('thorn_cellar',{name:'Thornwick Cellars',w:21,h:15,grid:[
'#####################',
'#.........#.........#',
'#..T......#....T....#',
'#.........L.........#',
'#....a....#....b....#',
'#.........#.........#',
'#..###.####.###.####',
'#..#...#.....#...#.#',
'#..#...D.....D...#.#',
'#..#...#.....#...#.#',
'#..#...#..c..#...#.#',
'#..#...#.....#...#.#',
'#..####.#####.####.#',
'#.........#.........#',
'#####################'],
start:{x:10,y:14,dir:0},
stairs:{'10,13':'thornwick'},exit:{x:10,y:14},
ev:{
a:{text:'A pool of greasy water. Giant rats scatter.',enc:{mons:[['giant_rat','3d4'],['giant_rat','1d4']],text:'Giant rats!'}},
b:{text:'A hidden cache! You find a dagger.',item:'dagger+1',chest:true},
c:{text:'Skarrik\'s hoard! Coins and trinkets glitter.',enc:{mons:[['kobold','2d4']],text:'Kobolds defend the hoard!',chest:true,guard:true},chest:{gold:'4d6',items:['cellar_key','gem','potion_heal']}},
},
enc:{mons:[['kobold','2d4'],['kobold_archer','1d4']],text:'Kobolds ambush you!'},
chest:{text:'A wooden chest.',gold:'3d6',items:['dagger','potion_heal'],guard:'skarrik'},
traps:{'10,7':{type:'needle',text:'A needle trap! Darts shoot from the walls.'},'5,4':{type:'pit',text:'A hidden pit!'}},
keyItem:'cellar_key',lockText:'A locked door. You need a key or tools.',
wander:[['centipede','2d4',25],['giant_beetle','1d4',15]],
});
/* --- E0 Thornwick Vale (wilderness) --- */
_map('thorn_wild',{name:'Thornwick Vale',overland:true,w:30,h:20,grid:[
'##############################',
'#............................#',
'#..T....T......T......T....T..#',
'#............................#',
'#......===......===......====.#',
'#............................#',
'#..T....T......T......T....T..#',
'#............................#',
'#......===......===......====.#',
'#............................#',
'#..T....T......T......T....T..#',
'#............................#',
'#......===......===......====.#',
'#............................#',
'#..T....T......T......T....T..#',
'#............................#',
'#......===......===......====.#',
'#............................#',
'#............................#',
'##############################'],
sites:{'H':{name:'Thornwick',icon:'home',enter:'thornwick'},'R':{name:'River Road',icon:'road'},'K':{name:'Kobold Lookout',icon:'lair',fight:'kobold'},'W':{name:'Wolf Den',icon:'lair',fight:'wolf'},'O':{name:'Ott\'s Farm',icon:'farm',text:'A small farm. Ott waves.'},'S':{name:'Wayfarer\'s Stone',icon:'landmark',text:'An old standing stone.'},'B':{name:'Mother Brina\'s Croft',icon:'holy',holy:true},'T':{name:'The Drowned Chapel',icon:'ruin',text:'A flooded chapel.'}},
start:{x:15,y:19,dir:0},enc:[['giant_rat','2d4'],['wolf','2d4'],['kobold','3d4'],['dire_wolf','1d4']],
encRate:1,rumors:['The cellars have gone wrong.','Kobolds in the vale.','Widow Marrow\'s ring.'],
});
/* --- E1 Emberfall town --- */
_map('town',{name:'Emberfall',w:25,h:21,outdoor:true,safe:true,grid:[
'#########################',
'#.........#.............#',
'#..T......#......T......#',
'#.........#.............#',
'#....F....G........F....#',
'#.........#.............#',
'#..1..2..3..4..5..6..7..8#',
'#.........#.............#',
'#..9......#......10.....#',
'#.........#.............#',
'#...T.....#.....T.......#',
'#.........#.............#',
'#....11...12....13......#',
'#.........#.............#',
'#..T......#......T......#',
'#.........#.............#',
'#....14...15....16......#',
'#.........#.............#',
'#..T......#......T......#',
'#.........#.............#',
'#########################'],
locs:{'1':{name:'Drowsy Lantern',service:'inn'},'2':{name:'Ironhand Outfitters',service:'shop:armory'},'3':{name:'Gilded Tankard',service:'tavern'},'4':{name:'Gilded Mortar',service:'apothecary'},'5':{name:'Temple of the Dawn',service:'temple'},'6':{name:'Town Hall',service:'hall'},'7':{name:'Training Hall',service:'train'},'8':{name:'Barracks',service:'barracks'},'9':{name:'Smithy',service:'smithy'},'10':{name:'Stables',service:'stables'},'11':{name:'Chandler',service:'shop:general'},'12':{name:'Weaver',service:'shop:general'},'13':{name:'Alchemist',service:'shop:general'},'14':{name:'Shrine',service:'temple'},'15':{name:'Hermit',service:'hermit'},'16':{name:'Gatehouse',service:'gate'}},
start:{x:12,y:19,dir:0},ev:{},wander:[],rumors:['The Abbey of the Dawn has fallen.','Goblins in the crypts.','The abbey relic must be recovered.'],
});
/* --- E1 crypts --- */
_map('crypt1',{name:'Abbey Undercroft',w:25,h:21,grid:[
'#########################',
'#........#......#.......#',
'#..T.....#..T...#..T....#',
'#........#......#.......#',
'#...##...D..##..D..##...#',
'#...##...#..##..#..##...#',
'#........#......#.......#',
'#..#..#..#..a...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..###..###..#..#.#',
'#..#..#.....b......#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..#..c...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#........D..##..D......#',
'#...##...#..##..#..##..#',
'#...##...#......#..##..#',
'#........#..T...#......#',
'#..T.....#......#..T...#',
'#........#......#......#',
'#########################'],
start:{x:12,y:19,dir:0},stairs:{'12,19':'town','12,1':'crypt2'},exit:{x:12,y:19},
ev:{a:{text:'A sarcophagus. Something stirs...',enc:{mons:[['ghoul','2d4'],['skeleton','2d4']],text:'The dead rise!'}},b:{text:'A hidden cache behind a loose stone!',item:'dawn_reliquary',chest:true},c:{text:'An ogre guards the passage!',enc:{mons:[['ogre','1d1'],['skeleton','2d4']],text:'An ogre blocks the way!'}},},
enc:{mons:[['ghoul','2d4'],['skeleton','2d4'],['cultist','2d4']],text:'The crypts are alive!'},
chest:{text:'A stone coffer.',gold:'4d6',items:['potion_serious','gem']},
traps:{'12,10':{type:'dart',text:'A dart trap!'},'8,7':{type:'pit',text:'A hidden pit!'}},
keyItem:'ogre_key',lockText:'A locked iron door.',
wander:[['skeleton','3d4',30],['ghoul','2d4',20],['cultist','2d4',15]],
});
_map('crypt2',{name:'Abbey Vaults',w:25,h:21,grid:[
'#########################',
'#........#......#.......#',
'#..T.....#..T...#..T....#',
'#........#......#.......#',
'#...##...D..##..D..##...#',
'#...##...#..##..#..##...#',
'#........#......#.......#',
'#..#..#..#..a...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..###..###..#..#.#',
'#..#..#.....b......#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..#..c...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#........D..##..D......#',
'#...##...#..##..#..##..#',
'#...##...#......#..##..#',
'#........#..T...#......#',
'#..T.....#......#..T...#',
'#........#......#......#',
'#########################'],
start:{x:12,y:19,dir:0},stairs:{'12,19':'crypt1'},exit:{x:12,y:19},
ev:{a:{text:'The reliquary glows with dawn-light!',item:'dawn_reliquary',chest:true},b:{text:'A ghoul shrine!',enc:{mons:[['ghast','1d1'],['ghoul','3d4']],text:'The ghoul shrine is guarded!'}},c:{text:'Malvek\'s circle gathers!',enc:{mons:[['malvek','1d1'],['cult_fanatic','2d4']],text:'Malvek the Ashen appears!'}},},
enc:{mons:[['ghoul','3d4'],['ghast','1d2'],['cult_fanatic','2d4']],text:'The vaults are cursed!'},
chest:{text:'A gilded chest.',gold:'6d6',items:['dawn_reliquary','potion_critical','ring_protection1'],guard:'malvek'},
traps:{'12,10':{type:'gas',text:'A gas trap!'},'8,7':{type:'fire',text:'A fire rune!'}},
keyItem:'ogre_key',lockText:'A locked crypt door.',
wander:[['ghoul','3d4',30],['skeleton','3d4',20],['cult_fanatic','2d4',15]],
});
/* --- E1 Emberwild wilderness --- */
_map('wild',{name:'The Emberwild',overland:true,w:48,h:32,grid:[
'################################################',
'#..............................................#',
'#..T....T....T....T....T....T....T....T....T...#',
'#..............................................#',
'#......===......===......===......===......====.#',
'#..............................................#',
'#..T....T....T....T....T....T....T....T....T...#',
'#..............................................#',
'#......===......===......===......===......====.#',
'#..............................................#',
'#..T....T....T....T....T....T....T....T....T...#',
'#..............................................#',
'#......===......===......===......===......====.#',
'#..............................................#',
'#..T....T....T....T....T....T....T....T....T...#',
'#..............................................#',
'#......===......===......===......===......====.#',
'#..............................................#',
'#..T....T....T....T....T....T....T....T....T...#',
'#..............................................#',
'#......===......===......===......===......====.#',
'#..............................................#',
'#..T....T....T....T....T....T....T....T....T...#',
'#..............................................#',
'#......===......===......===......===......====.#',
'#..............................................#',
'#..T....T....T....T....T....T....T....T....T...#',
'#..............................................#',
'#......===......===......===......===......====.#',
'#..............................................#',
'#..............................................#',
'#..............................................#',
'#..............................................#',
'################################################'],
sites:{'H':{name:'Emberfall',icon:'home',enter:'town'},'R':{name:'Mill Road',icon:'road'},'B':{name:'Brigand Camp',icon:'lair',fight:'bandit'},'S':{name:'Dawnstones',icon:'landmark',text:'Ancient standing stones.'},'F':{name:'Hask Farmstead',icon:'farm',text:'The Hask farmstead.'},'D':{name:'Drowned Chapel',icon:'ruin',text:'A flooded chapel.'},'T':{name:'Bloodmane Watchtower',icon:'tower',enter:'tower'},'C':{name:'Hermit\'s Cottage',icon:'hermit',heal:true},'G':{name:'Greywater Pass',icon:'pass',text:'A mountain pass.'},'W':{name:'Spider Hollow',icon:'lair',fight:'spider'},'M':{name:'Millbrook',icon:'hamlet',hamlet:true},'P':{name:'Pilgrim Camp',icon:'camp',text:'Travelers rest here.'}},
start:{x:24,y:30,dir:0},enc:[['wolf','3d4'],['gnoll','3d4'],['spider','3d4'],['bandit','3d4'],['dire_wolf','2d4']],
encRate:1.2,rumors:['The Abbey of the Dawn has fallen.','Bloodmane gnolls raid the farms.','The watchtower needs help.'],
});
/* --- E1 watchtower --- */
_map('tower',{name:'Bloodmane Watchtower',w:19,h:15,grid:[
'###################',
'#.................#',
'#..T...........T..#',
'#.................#',
'#....###...###....#',
'#....#...a...#....#',
'#....#.......#....#',
'#....###...###....#',
'#.........b.......#',
'#.........#.......#',
'#....###..#..###..#',
'#....#....#....#..#',
'#....#....c....#..#',
'#....###..#..###..#',
'###################'],
start:{x:9,y:13,dir:0},stairs:{'9,13':'wild'},exit:{x:9,y:13},
ev:{a:{text:'The watchtower! You can see the moors below.',text:'A vantage point over the wilds.'},b:{text:'Gnolls! They flee when cornered.',enc:{mons:[['gnoll','3d4'],['gnoll_packlord','1d1']],text:'Gnolls attack!'}},c:{text:'A hidden cache!',item:'potion_serious',chest:true},},
enc:{mons:[['gnoll','3d4'],['wolf','2d4']],text:'Gnolls infest the tower!'},
chest:{text:'A supply chest.',gold:'3d6',items:['potion_serious','rope']},
traps:{'9,8':{type:'pit',text:'A hidden pit!'}},
wander:[['gnoll','2d4',20],['wolf','2d4',15]],
});
/* --- E2 Coldharrow town --- */
_map('cold_town',{name:'Coldharrow',w:23,h:17,outdoor:true,safe:true,grid:[
'#######################',
'#.........#...........#',
'#..T......#.....T.....#',
'#.........#...........#',
'#....F....G.......F...#',
'#.........#...........#',
'#..1..2..3..4..5..6..7.#',
'#.........#...........#',
'#..8......#......9....#',
'#.........#...........#',
'#...T.....#......T....#',
'#.........#...........#',
'#....10...11...12.....#',
'#.........#...........#',
'#..T......#......T....#',
'#.........#...........#',
'#######################'],
locs:{'1':{name:'Frozen Hearth',service:'inn'},'2':{name:'Dunmore\'s Forge',service:'shop:armory'},'3':{name:'The Gilded Boar',service:'tavern'},'4':{name:'Apothecary',service:'apothecary'},'5':{name:'Temple of St. Brannoc',service:'temple'},'6':{name:'Town Hall',service:'hall'},'7':{name:'Training Hall',service:'train'},'8':{name:'General Goods',service:'shop:general'},'9':{name:'Barracks',service:'barracks'},'10':{name:'Chandler',service:'shop:general'},'11':{name:'Weaver',service:'shop:general'},'12':{name:'Hermit',service:'hermit'}},
start:{x:11,y:15,dir:0},ev:{},wander:[],rumors:['The barrow of the Iron King stirs.','Dunmore needs silver for the mine.','The old king sleeps uneasily.'],
});
/* --- E2 mine --- */
_map('cold_mine',{name:'Deepcut Mine',w:25,h:21,grid:[
'#########################',
'#........#......#.......#',
'#..T.....#..T...#..T....#',
'#........#......#.......#',
'#...##...D..##..D..##...#',
'#...##...#..##..#..##...#',
'#........#......#.......#',
'#..#..#..#..a...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..###..###..#..#.#',
'#..#..#.....b......#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..#..c...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#........D..##..D......#',
'#...##...#..##..#..##..#',
'#...##...#......#..##..#',
'#........#..T...#......#',
'#..T.....#......#..T...#',
'#........#......#......#',
'#########################'],
start:{x:12,y:19,dir:0},stairs:{'12,19':'cold_town','12,1':'cold_barrow'},exit:{x:12,y:19},
ev:{a:{text:'The mine! Timber supports groan.',enc:{mons:[['kobold','2d4'],['giant_spider','2d4']],text:'The mine is infested!'}},b:{text:'A hidden vein of silver!',item:'silver_coin',chest:true},c:{text:'Gorrak Skullsplitter!',enc:{mons:[['gorrak','1d1'],['ogre','2d4']],text:'Gorrak blocks the way!'}},},
enc:{mons:[['kobold','2d4'],['giant_spider','2d4'],['bugbear','2d4']],text:'The mine is dangerous!'},
chest:{text:'A miner\'s chest.',gold:'5d6',items:['silver_coin','potion_heal','pickaxe']},
traps:{'12,10':{type:'pit',text:'A hidden pit!'},'8,7':{type:'gas',text:'A gas trap!'}},
keyItem:'ogre_key',lockText:'A locked mine door.',
wander:[['kobold','3d4',25],['giant_spider','2d4',20],['bugbear','2d4',15]],
});
/* --- E2 barrow --- */
_map('cold_barrow',{name:'Barrow of the Iron King',w:25,h:21,grid:[
'#########################',
'#........#......#.......#',
'#..T.....#..T...#..T....#',
'#........#......#.......#',
'#...##...D..##..D..##...#',
'#...##...#..##..#..##...#',
'#........#......#.......#',
'#..#..#..#..a...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..###..###..#..#.#',
'#..#..#.....b......#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..#..c...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#........D..##..D......#',
'#...##...#..##..#..##..#',
'#...##...#......#..##..#',
'#........#..T...#......#',
'#..T.....#......#..T...#',
'#........#......#......#',
'#########################'],
start:{x:12,y:19,dir:0},stairs:{'12,19':'cold_mine'},exit:{x:12,y:19},
ev:{a:{text:'The barrow! Bones litter the floor.',enc:{mons:[['skeleton','3d4'],['zombie','2d4']],text:'The dead rise!'}},b:{text:'The Iron King\'s seal!',item:'iron_king_seal',chest:true},c:{text:'The Iron King awakens!',enc:{mons:[['iron_king','1d1'],['skeleton','3d4']],text:'The Iron King stirs!'}},},
enc:{mons:[['skeleton','3d4'],['zombie','2d4'],['ghoul','2d4']],text:'The barrow is cursed!'},
chest:{text:'A royal sarcophagus.',gold:'8d6',items:['iron_king_seal','potion_critical','ring_protection2'],guard:'iron_king'},
traps:{'12,10':{type:'fire',text:'A fire rune!'},'8,7':{type:'pit',text:'A hidden pit!'}},
keyItem:'ogre_key',lockText:'A locked barrow door.',
wander:[['skeleton','3d4',30],['ghoul','2d4',20],['zombie','2d4',15]],
});
/* --- E2 Harrow Hills wilderness --- */
_map('cold_wild',{name:'Harrow Hills',overland:true,w:36,h:24,grid:[
'####################################',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..................................#',
'####################################'],
sites:{'H':{name:'Coldharrow',icon:'home',enter:'cold_town'},'R':{name:'South Road',icon:'road'},'V':{name:'Vellen',icon:'hamlet',hamlet:true},'B':{name:'Bugbear Stockade',icon:'lair',fight:'bugbear'},'O':{name:'Ogre Cave',icon:'lair',fight:'ogre'},'C':{name:'Old Cairns',icon:'ruin',text:'Ancient burial cairns.'},'S':{name:'Shrine of St. Brannoc',icon:'holy',holy:true},'M':{name:'Morra\'s Hut',icon:'hermit',heal:true},'T':{name:'Troll Pass',icon:'pass',text:'A troll-infested pass.'}},
start:{x:18,y:22,dir:0},enc:[['bugbear','3d4'],['ogre','2d4'],['troll','1d4'],['hill_giant','1d2']],
encRate:1.3,rumors:['The barrow of the Iron King stirs.','Bugbears hold the stockade.','Trolls in the pass.'],
});
/* --- E3 Ravenmoor fort --- */
_map('rav_fort',{name:'Fort Ravel',w:21,h:12,outdoor:true,safe:true,grid:[
'#####################',
'#........#..........#',
'#..T.....#....T.....#',
'#........#..........#',
'#....F...G.....F....#',
'#........#..........#',
'#..1..2..3..4..5.....#',
'#........#..........#',
'#..6.....#....7.....#',
'#........#..........#',
'#..T.....#....T.....#',
'#####################'],
locs:{'1':{name:'Mess Hall',service:'inn'},'2':{name:'Armory',service:'shop:armory'},'3':{name:'Tavern',service:'tavern'},'4':{name:'Apothecary',service:'apothecary'},'5':{name:'Temple',service:'temple'},'6':{name:'Hall',service:'hall'},'7':{name:'Training Hall',service:'train'}},
start:{x:10,y:10,dir:0},ev:{},wander:[],rumors:['The Witch-Queen of Ravenmoor stirs.','Gnashrot the troll rules the moors.','The patrol has not returned.'],
});
/* --- E3 moor village --- */
_map('rav_moor',{name:'Burned Village',w:25,h:21,grid:[
'#########################',
'#........#......#.......#',
'#..T.....#..T...#..T....#',
'#........#......#.......#',
'#...##...D..##..D..##...#',
'#...##...#..##..#..##...#',
'#........#......#.......#',
'#..#..#..#..a...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..###..###..#..#.#',
'#..#..#.....b......#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..#..c...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#........D..##..D......#',
'#...##...#..##..#..##..#',
'#...##...#......#..##..#',
'#........#..T...#......#',
'#..T.....#......#..T...#',
'#........#......#......#',
'#########################'],
start:{x:12,y:19,dir:0},stairs:{'12,19':'rav_fort'},exit:{x:12,y:19},
ev:{a:{text:'The burned village! Gnashrot\'s trolls rule here.',enc:{mons:[['troll','2d4'],['gnashrot','1d1']],text:'Trolls attack!'}},b:{text:'A hidden chest!',item:'patrol_badges',chest:true},c:{text:'The troll chieftain!',enc:{mons:[['gnashrot','1d1'],['troll','3d4']],text:'Gnashrot appears!'}},},
enc:{mons:[['troll','3d4'],['hell_hound','2d4'],['gargoyle','2d4']],text:'The moors are cursed!'},
chest:{text:'A burned chest.',gold:'6d6',items:['patrol_badges','potion_critical'],guard:'gnashrot'},
traps:{'12,10':{type:'fire',text:'A fire rune!'},'8,7':{type:'gas',text:'A gas trap!'}},
keyItem:'patrol_badges',lockText:'A locked door.',
wander:[['troll','2d4',20],['hell_hound','2d4',15],['gargoyle','2d4',10]],
});
/* --- E3 keep --- */
_map('rav_keep',{name:'Ravenmoor Keep',w:25,h:19,grid:[
'#########################',
'#........#......#.......#',
'#..T.....#..T...#..T....#',
'#........#......#.......#',
'#...##...D..##..D..##...#',
'#...##...#..##..#..##...#',
'#........#......#.......#',
'#..#..#..#..a...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..###..###..#..#.#',
'#..#..#.....b......#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..#..c...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#........D..##..D......#',
'#...##...#..##..#..##..#',
'#...##...#......#..##..#',
'#........#..T...#......#',
'#########################'],
start:{x:12,y:17,dir:0},stairs:{'12,17':'rav_moor','12,1':'rav_pit'},exit:{x:12,y:17},
ev:{a:{text:'The keep! Grull the giant holds court.',enc:{mons:[['grull','1d1'],['hill_giant','2d4']],text:'Grull blocks the way!'}},b:{text:'A hidden cache!',item:'patrol_badges',chest:true},c:{text:'The Witch-Queen\'s throne!',enc:{mons:[['vharra','1d1'],['raven_witch','2d4']],text:'Vharra awaits!'}},},
enc:{mons:[['gargoyle','3d4'],['raven_witch','2d4'],['troll','2d4']],text:'The keep is cursed!'},
chest:{text:'A royal chest.',gold:'8d6',items:['patrol_badges','potion_critical','ring_protection3'],guard:'vharra'},
traps:{'12,10':{type:'gas',text:'A gas trap!'},'8,7':{type:'fire',text:'A fire rune!'}},
keyItem:'patrol_badges',lockText:'A locked keep door.',
wander:[['gargoyle','3d4',25],['raven_witch','2d4',20],['troll','2d4',15]],
});
/* --- E3 witch-pit --- */
_map('rav_pit',{name:'Witch-Pit',w:25,h:18,grid:[
'#########################',
'#........#......#.......#',
'#..T.....#..T...#..T....#',
'#........#......#.......#',
'#...##...D..##..D..##...#',
'#...##...#..##..#..##...#',
'#........#......#.......#',
'#..#..#..#..a...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..###..###..#..#.#',
'#..#..#.....b......#..#.#',
'#..#..#..#......#..#..#.#',
'#..#..#..#..c...#..#..#.#',
'#..#..#..#......#..#..#.#',
'#........D..##..D......#',
'#...##...#..##..#..##..#',
'#...##...#......#..##..#',
'#########################'],
start:{x:12,y:16,dir:0},stairs:{'12,16':'rav_keep'},exit:{x:12,y:16},
ev:{a:{text:'The witch-pit! Vharra\'s power radiates.',enc:{mons:[['vharra','1d1'],['raven_witch','3d4']],text:'Vharra descends!'}},b:{text:'The Witch-Queen\'s crown!',item:'witch_crown',chest:true},c:{text:'The final battle!',enc:{mons:[['vharra','1d1'],['raven_witch','3d4'],['gargoyle','2d4']],text:'Vharra the Witch-Queen!'}},},
enc:{mons:[['raven_witch','3d4'],['gargoyle','3d4'],['hell_hound','2d4']],text:'The pit is a trap!'},
chest:{text:'A dark chest.',gold:'10d6',items:['witch_crown','potion_critical','ring_protection3'],guard:'vharra'},
traps:{'12,10':{type:'gas',text:'A gas trap!'},'8,7':{type:'fire',text:'A fire rune!'}},
keyItem:'witch_crown',lockText:'A locked pit door.',
wander:[['raven_witch','3d4',25],['gargoyle','3d4',20],['hell_hound','2d4',15]],
});
/* --- E3 Northern Moors wilderness --- */
_map('rav_wild',{name:'Northern Moors',overland:true,w:36,h:24,grid:[
'####################################',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..T....T....T....T....T....T....T..#',
'#..................................#',
'#......===......===......===......==#',
'#..................................#',
'#..................................#',
'####################################'],
sites:{'H':{name:'Fort Ravel',icon:'home',enter:'rav_fort'},'R':{name:'North Road',icon:'road'},'M':{name:'Burned Village',icon:'ruin',enter:'rav_moor'},'K':{name:'Ravenmoor Keep',icon:'tower',enter:'rav_keep'},'W':{name:'Worg Den',icon:'lair',fight:'worg'},'G':{name:'Gallows Hill',icon:'landmark',text:'A hill of the hanged.'},'N':{name:'North Watch-post',icon:'ruin',text:'An abandoned watch-post.'},'C':{name:'Cairn of the Old Kings',icon:'ruin',text:'Ancient kings\' cairns.'},'T':{name:'Old Tam\'s Croft',icon:'farm',text:'An old man\'s croft.'},'P':{name:'Pilgrim Camp',icon:'camp',text:'Travelers rest here.'}},
start:{x:18,y:22,dir:0},enc:[['troll','3d4'],['hell_hound','3d4'],['gargoyle','3d4'],['raven_witch','2d4'],['worg','3d4']],
encRate:1.4,rumors:['The Witch-Queen of Ravenmoor stirs.','Gnashrot the troll rules the moors.','The patrol has not returned.'],
});
/* --- E0-E3 additional service maps --- */
_map('shop', {name:'Shop', w:15,h:13, indoor:true, safe:true, grid:[
'###############',
'#.............#',
'#..T......T...#',
'#.............#',
'#...1.....2...#',
'#.............#',
'#..T......T...#',
'#.............#',
'#.............#',
'#.............#',
'#..T......T...#',
'###############'],locs:{'1':{name:'Counter',service:'shop'},'2':{name:'Door',service:'exit'}},start:{x:7,y:10,dir:0},ev:{},wander:[]});
/* ---------------- QUESTS ---------------- */
const QUESTS={
thorn_kobolds:{id:'thorn_kobolds',name:'The Kobold Menace',side:false,giver:'Elder Maddoc',goal:'Kill Skarrik the kobold king in the Thornwick cellars.',offer:'Kobolds have infested the cellars beneath the brewery. Their king, Skarrik, must be destroyed.',done:'Skarrik is dead! The cellars are safe.',gold:150,xp:200,needItem:null,reveal:null,map:'thorn_cellar'},
thorn_ring:{id:'thorn_ring',name:"Widow Marrow's Ring",side:true,giver:'Widow Marrow',goal:'Recover Widow Marrow\'s ring from the cellars.',offer:'My late husband\'s ring fell into the cellars. Please bring it back.',done:'You found my ring! Bless you.',gold:50,xp:50,needItem:'widow_ring',reveal:'thorn_cellar'},
redfang:{id:'redfang',name:'The Redfang Menace',side:false,giver:'Reeve Halda',goal:'Kill Redfang, chieftain of the gnolls.',offer:'Redfang\'s gnolls raid our farms. Kill their chieftain.',done:'Redfang is dead! The farms are safe.',gold:250,xp:190,needItem:null,reveal:'wild'},
reliquary:{id:'reliquary',name:'The Dawn Reliquary',side:false,giver:'Reeve Halda',goal:'Recover the Dawn Reliquary from the Abbey crypts.',offer:'The Abbey of the Dawn fell. Its reliquary must be recovered.',done:'The reliquary is safe! The Abbey will rise again.',gold:300,xp:250,needItem:'dawn_reliquary',reveal:'crypt1'},
malvek:{id:'malvek',name:'Malvek the Ashen',side:false,giver:'Reeve Halda',goal:'Destroy Malvek the Ashen and his circle.',offer:'Malvek the Ashen leads a cult in the vaults. End his reign.',done:'Malvek is destroyed! The crypts are cleansed.',gold:400,xp:400,needItem:null,reveal:'crypt2'},
gnolls:{id:'gnolls',name:'The Bloodmane Pack',side:true,giver:'Tamsin Hask',goal:'Defeat the Bloodmane Packlord.',offer:'The Bloodmane gnolls took my brother! Defeat their packlord.',done:'My brother is safe! Thank you!',gold:150,xp:150,needItem:null,reveal:'wild'},
cold_mine:{id:'cold_mine',name:'Gorrak Skullsplitter',side:false,giver:'Thane Bergen',goal:'Kill Gorrak Skullsplitter in the Deepcut Mine.',offer:'Gorrak Skullsplitter leads ogres in the mine. He must die.',done:'Gorrak is dead! The mine is safe.',gold:300,xp:300,needItem:null,reveal:'cold_mine'},
cold_king:{id:'cold_king',name:'The Iron King',side:false,giver:'Thane Bergen',goal:'Lay the Iron King to rest in the barrow.',offer:'The Iron King rises in the barrow. Put him to rest.',done:'The Iron King is at peace. The barrow is silent.',gold:500,xp:500,needItem:null,reveal:'cold_barrow'},
cold_tally:{id:'cold_tally',name:"Foreman's Tally",side:true,giver:'Foreman Dask',goal:'Recover the foreman\'s tally book from the mine.',offer:'My tally book fell in the mine. Bring it back.',done:'You found my tally! Thank you.',gold:100,xp:100,needItem:'foreman_tally',reveal:'cold_mine'},
rav_moor:{id:'rav_moor',name:'Gnashrot',side:false,giver:'Commander Ysolde',goal:'Kill Gnashrot, the troll chieftain.',offer:'Gnashrot the troll rules the moors. He must be destroyed.',done:'Gnashrot is dead! The moors are safe.',gold:500,xp:400,needItem:null,reveal:'rav_moor'},
rav_keep:{id:'rav_keep',name:'Grull of Ravenmoor',side:false,giver:'Commander Ysolde',goal:'Kill Grull, the hill giant of Ravenmoor Keep.',offer:'Grull the giant holds Ravenmoor Keep. He must fall.',done:'Grull is dead! The keep is ours.',gold:600,xp:500,needItem:null,reveal:'rav_keep'},
rav_witch:{id:'rav_witch',name:'The Witch-Queen',side:false,giver:'Commander Ysolde',goal:'Destroy Vharra, the Witch-Queen of Ravenmoor.',offer:'Vharra the Witch-Queen must be destroyed. Her crown proves it.',done:'Vharra is destroyed! Ravenmoor is free.',gold:1000,xp:800,needItem:'witch_crown',reveal:'rav_pit'},
rav_patrol:{id:'rav_patrol',name:'The Lost Patrol',side:true,giver:'Commander Ysolde',goal:'Recover twelve patrol badges from the moors.',offer:'My patrol never returned. Find their badges.',done:'The badges! My patrol can rest now.',gold:300,xp:300,needItem:'patrol_badges',reveal:'rav_wild'},
};
/* ============================ HEROES (pregens) ============================ */
const CLASS_GOLD={F:'5d4',P:'5d4',R:'5d4',M:'1d4+1',C:'3d6',T:'2d6'};
function _pre(id,n,r,c,a,o){const ch=Rules.makeCharacter(Object.assign({id,name:n,race:r,cls:c,align:a,lvl:1},o));return ch;}
const PREGENS=[
_pre('aldric','Aldric Thorne','human','F','LG',{scores:{str:17,dex:12,con:16,int:10,wis:11,cha:10},spec:'longsword',color:'#c8502c'}),
_pre('seraphine','Seraphine Vale','human','P','LG',{scores:{str:14,dex:12,con:13,int:10,wis:16,cha:18},color:'#e3b54a'}),
_pre('borin','Borin Stonehand','dwarf','C','NG',{scores:{str:14,dex:10,con:15,int:8,wis:16,cha:9},color:'#6fae5c'}),
_pre('lyra','Lyra Windwhisper','halfelf','R','NG',{scores:{str:14,dex:16,con:12,int:12,wis:16,cha:13},foe:'goblin',color:'#5a7fc8'}),
_pre('pip','Pip Quickfinger','halfling','T','NG',{scores:{str:9,dex:17,con:13,int:12,wis:11,cha:15},color:'#9a7fd4'}),
_pre('elowen','Elowen Starfall','elf','M','NG',{scores:{str:8,dex:14,con:11,int:17,wis:13,cha:12},color:'#c87f9a'}),
];
/* give pregens their kit */
(function(){
  const give=(ch,eq,inv)=>{ch.eq=Object.assign(ch.eq,eq);ch.inv=(ch.inv||[]).concat(inv||[]);};
  give(PREGENS[0],{melee:'longsword',missile:'shortbow',armor:'chain',shield:'shield_steel'},['leather','potion_heal','rations','torch','rope']);
  give(PREGENS[1],{melee:'bastardsword',missile:'longbow',armor:'chain',shield:'shield_steel'},['potion_heal','potion_antidote','rations','torch','holy_water']);
  give(PREGENS[2],{melee:'mace',missile:'sling',armor:'chain',shield:'shield_steel'},['potion_heal','cure_light'===undefined?'potion_antidote':'potion_antidote','thieves_tools','rations']);
  give(PREGENS[3],{melee:'longsword',missile:'longbow',armor:'studded',shield:null},['potion_heal','potion_antidote','rations','rope','thieves_tools']);
  give(PREGENS[4],{melee:'shortsword',missile:'sling',armor:'leather',shield:null},['potion_heal','potion_antidote','rations','thieves_tools','rope']);
  give(PREGENS[5],{melee:'staff',missile:'dart',armor:null,shield:null},['potion_heal','scroll:magic_missile','scroll:sleep','rations','torch']);
  // fix cleric mace (blunt ok) and ensure each has gold rolled
  for(const ch of PREGENS){ ch.gold=Rules.roll(CLASS_GOLD[ch.cls]||'1d4'); ch.lvl=1; Rules.rollHp(ch); ch.hp=ch.maxhp; }
})();
