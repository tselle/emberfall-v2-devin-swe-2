/* Emberfall — wilds.js : authored wilderness region data, encounter tables, rumors */
'use strict';
/* Region definitions referenced by overland maps. terrain weights and
   day/night-filtered encounter tables live here so maps stay pure geometry. */
const WILD = {
  thorn_wild:{
    name:'Thornwick Vale', rate:1.0,
    enc:[['giant_rat','2d4',20],['kobold','3d4',15],['wolf','2d4',20],['centipede','2d4',15],['kobold_archer','1d4',10],['dire_wolf','1d4',10]],
    encNight:[['dire_wolf','1d4',25],['wolf','3d4',30],['giant_rat','3d4',20],['worg','1d2',15]],
    rumors:['The cellars have gone wrong.','Kobolds in the vale.','Widow Marrow\'s ring.'],
    travellers:[['pedlar','Marta sells country goods.'],['pilgrim','A pilgrim shares a rumor.'],['peddler','A peddler offers trinkets.']],
    sites:{H:{enter:'thornwick'},K:{fight:'kobold'},W:{fight:'wolf'},B:{holy:true},T:{text:'A flooded chapel.'},O:{text:'Ott\'s farm.'},S:{text:'An old standing stone.'},R:{text:'The river road.'}},
  },
  wild:{
    name:'The Emberwild', rate:1.2,
    enc:[['wolf','3d4',15],['gnoll','3d4',15],['spider','3d4',10],['bandit','3d4',20],['dire_wolf','2d4',15],['bugbear','2d4',10],['ogre','1d2',8]],
    encNight:[['dire_wolf','3d4',20],['gnoll','4d4',20],['bandit','3d4',20],['worg','2d4',15],['spider','3d4',15]],
    rumors:['The Abbey of the Dawn has fallen.','Bloodmane gnolls raid the farms.','The watchtower needs help.'],
    travellers:[['pedlar','Marta sells country goods.'],['pilgrim','A pilgrim shares a rumor.'],['mercenary','A sellsword offers work.']],
    sites:{H:{enter:'town'},B:{fight:'bandit'},T:{enter:'tower'},C:{heal:true},M:{hamlet:true},F:{text:'The Hask farmstead.'},D:{text:'A flooded chapel.'},G:{text:'Greywater Pass.'},W:{fight:'spider'},S:{text:'Ancient dawnstones.'},P:{text:'Pilgrims rest here.'},R:{text:'Mill Road.'}},
  },
  cold_wild:{
    name:'Harrow Hills', rate:1.3,
    enc:[['bugbear','3d4',20],['ogre','2d4',20],['troll','1d4',15],['hill_giant','1d2',10],['werewolf','2d4',15],['yeti','1d2',8]],
    encNight:[['troll','2d4',25],['werewolf','3d4',25],['ogre','3d4',20],['hill_giant','1d2',15]],
    rumors:['The barrow of the Iron King stirs.','Bugbears hold the stockade.','Trolls in the pass.'],
    travellers:[['peddler','A peddler offers trinkets.'],['hunter','A hunter shares news.'],['pilgrim','A pilgrim rests.']],
    sites:{H:{enter:'cold_town'},V:{hamlet:true},B:{fight:'bugbear'},O:{fight:'ogre'},C:{text:'Ancient burial cairns.'},S:{holy:true},M:{heal:true},T:{text:'A troll pass.'},R:{text:'South Road.'}},
  },
  rav_wild:{
    name:'Northern Moors', rate:1.4,
    enc:[['troll','3d4',20],['hell_hound','3d4',15],['gargoyle','3d4',10],['raven_witch','2d4',15],['worg','3d4',20],['gnoll','2d4',10]],
    encNight:[['hell_hound','4d4',25],['raven_witch','3d4',20],['troll','3d4',20],['wraith','1d2',15],['worg','3d4',15]],
    rumors:['The Witch-Queen of Ravenmoor stirs.','Gnashrot the troll rules the moors.','The patrol has not returned.'],
    travellers:[['soldier','A Fort Ravel soldier.'],['pilgrim','A pilgrim shares a rumor.'],['hunter','A moor hunter.']],
    sites:{H:{enter:'rav_fort'},M:{enter:'rav_moor'},K:{enter:'rav_keep'},W:{fight:'worg'},G:{text:'Gallows Hill.'},N:{text:'An abandoned watch-post.'},C:{text:'Cairns of old kings.'},T:{text:"Old Tam's croft."},P:{text:'Pilgrims rest here.'},R:{text:'North Road.'}},
  },
};
/* terrain encounter weights: [symbol, baseHourly, theme] */
const TERRAIN_ENC={
  '.':{h:0.05,theme:'plains'}, '=':{h:0.035,theme:'road'}, '+':{h:0.035,theme:'road'},
  'T':{h:0.08,theme:'forest'}, 'n':{h:0.07,theme:'hills'}, '%':{h:0.09,theme:'swamp'},
};
const TERRAIN_COST={'.':1,'=':0.5,'+':0.5,'T':2,'n':2,'%':3};
/* site icon palette for overland painter */
const SITE_ICONS={home:'#e3b54a',road:'#9a937f',lair:'#c8502c',farm:'#6fae5c',holy:'#5a7fc8',hermit:'#9a7fd4',tower:'#8a8f9e',ruin:'#7a6f5a',hamlet:'#c8a86a',camp:'#b08a50',landmark:'#d4c9a8',pass:'#8a8f9e',forage:'#7a9a5a'};
