/* Emberfall — modules.js : adventure definitions, campaign order, service names */
'use strict';
/* Adventure: code,name,lvl,levels:[min,max],diff:1..4,size,length,hub,maps,gold,next,quests,side,final,names,rumors,blurb,intro,hint,victory,lose */
const MODULES = {
  thornwick:{
    id:'thornwick', code:'E0', name:'The Cellars of Thornwick', lvl:1, levels:[1,2], diff:1,
    size:'Short', length:'about an hour', hub:'thornwick',
    maps:['thornwick','thorn_cellar','thorn_wild'], wild:'thorn_wild',
    gold:40, next:'hollow',
    quests:['thorn_kobolds'], side:['thorn_ring'], final:'thorn_kobolds',
    names:{giver:'Elder Maddoc',trainer:'Sergeant Brask',places:['Thornwick','Thornwick Vale','Kobold Lookout','Wolf Den','Ott\'s Farm','Wayfarer\'s Stone','Mother Brina\'s Croft','River Road']},
    rumors:['Cellars under the brewery have gone wrong.','Widow Marrow lost her ring in the cellars.','Kobolds carry a brass key.'],
    blurb:'A quiet village. A wrong cellar. A kobold king.',
    intro:'Thornwick seems peaceful, but the cellars beneath the brewery have gone wrong. Rats first, then worse. Elder Maddoc needs brave adventurers.',
    hint:'The Brass Cellar Key opens the locked door. Skarrik waits below.',
    victory:'Skarrik is dead! The cellars are safe. Thornwick owes you a debt.',
    lose:'The cellars claim another company. The village grieves.',
  },
  hollow:{
    id:'hollow', code:'E1', name:'The Hollow Vaults', lvl:1, levels:[1,3], diff:2,
    size:'Large', length:'several hours', hub:'town',
    maps:['town','crypt1','crypt2','wild','tower'], wild:'wild',
    gold:60, next:'coldharrow',
    quests:['redfang','reliquary','malvek'], side:['gnolls'], final:'malvek',
    names:{giver:'Reeve Halda',trainer:'Captain Aldous',places:['Emberfall','The Emberwild','Brigand Camp','Dawnstones','Hask Farmstead','Drowned Chapel','Bloodmane Watchtower','Greywater Pass','Millbrook','Hermit\'s Cottage','Spider Hollow','Mill Road']},
    rumors:['The Abbey of the Dawn has fallen.','Goblins in the crypts.','The abbey relic must be recovered.'],
    blurb:'The Abbey of the Dawn has fallen. Its reliquary lies in the crypts below.',
    intro:'Emberfall prospered until the Abbey of the Dawn fell. Now the crypts crawl with the dead, and a cult stirs in the vaults. Reeve Halda needs heroes.',
    hint:'The ogre\'s iron key opens the locked descent. The reliquary is hidden in the undercroft.',
    victory:'Malvek is destroyed! The crypts are cleansed. Emberfall will remember you.',
    lose:'The crypts keep their secrets. Emberfall mourns.',
  },
  coldharrow:{
    id:'coldharrow', code:'E2', name:'Barrow of the Iron King', lvl:3, levels:[3,5], diff:3,
    size:'Medium', length:'two to three hours', hub:'cold_town',
    maps:['cold_town','cold_mine','cold_barrow','cold_wild'], wild:'cold_wild',
    gold:150, next:'ravenmoor',
    quests:['cold_mine','cold_king'], side:['cold_tally'], final:'cold_king',
    names:{giver:'Thane Bergen',trainer:'Dunmore Ironforge',places:['Coldharrow','Harrow Hills','Vellen','Bugbear Stockade','Ogre Cave','Old Cairns','Shrine of St. Brannoc','Morra\'s Hut','South Road','Troll Pass']},
    rumors:['The barrow of the Iron King stirs.','Dunmore needs silver for the mine.','The old king sleeps uneasily.'],
    blurb:'An old king sleeps uneasily in his barrow. Gorrak and the Iron King must be stopped.',
    intro:'Coldharrow sits at the edge of the Harrow Hills. The old Iron King sleeps in his barrow, and Gorrak Skullsplitter has taken the Deepcut Mine. Thane Bergen needs silver and steel.',
    hint:'Dunmore\'s Forge sells silver. The ogre\'s key opens the barrow descent.',
    victory:'The Iron King is at peace. Coldharrow sings again.',
    lose:'The barrow keeps its king. Coldharrow endures.',
  },
  ravenmoor:{
    id:'ravenmoor', code:'E3', name:'The Witch-Queen of Ravenmoor', lvl:5, levels:[5,7], diff:4,
    size:'Large', length:'three hours or more', hub:'rav_fort',
    maps:['rav_fort','rav_moor','rav_keep','rav_pit','rav_wild'], wild:'rav_wild',
    gold:500, next:null,
    quests:['rav_moor','rav_keep','rav_witch'], side:['rav_patrol'], final:'rav_witch',
    names:{giver:'Commander Ysolde',trainer:'Sergeant Vex',places:['Fort Ravel','Northern Moors','Burned Village','Ravenmoor Keep','Witch-Pit','Worg Den','Gallows Hill','North Watch-post','Cairn of the Old Kings','Old Tam\'s Croft']},
    rumors:['The Witch-Queen of Ravenmoor stirs.','Gnashrot the troll rules the moors.','The patrol has not returned.'],
    blurb:'The Witch-Queen Vharra rules the moors. Gnashrot, Grull and Vharra must fall.',
    intro:'Fort Ravel is the last bastion against the Witch-Queen of Ravenmoor. Commander Ysolde needs a company of legends to end her reign.',
    hint:'The keep entry is gated by the troll deed. Vharra waits in the Witch-Pit.',
    victory:'Vharra is destroyed! Ravenmoor is free. The saga ends in legend.',
    lose:'The Witch-Queen rules still. Fort Ravel mourns.',
  },
};
/* campaign order and tabs */
const CAMPAIGN = {
  order:['thornwick','hollow','coldharrow','ravenmoor'],
  bands:[{id:'band1',name:'Band I',lvl:[1,4],modules:[]},{id:'band2',name:'Band II',lvl:[5,8],modules:[]},{id:'band3',name:'Band III',lvl:[9,12],modules:[]},{id:'band4',name:'Band IV',lvl:[13,16],modules:[]},{id:'band5',name:'Band V',lvl:[17,20],modules:[]}],
};
const CAMPAIGNS = [
  {id:'saga',name:'Emberwild Saga',desc:'The four-module hand-written saga',modules:['thornwick','hollow','coldharrow','ravenmoor']},
  {id:'band1',name:'Band I',desc:'Adventures for levels 1–4',modules:CAMPAIGN.bands[0].modules},
  {id:'band2',name:'Band II',desc:'Adventures for levels 5–8',modules:CAMPAIGN.bands[1].modules},
  {id:'band3',name:'Band III',desc:'Adventures for levels 9–12',modules:CAMPAIGN.bands[2].modules},
  {id:'band4',name:'Band IV',desc:'Adventures for levels 13–16',modules:CAMPAIGN.bands[3].modules},
  {id:'band5',name:'Band IV',desc:'Adventures for levels 17–20',modules:CAMPAIGN.bands[4].modules},
];
/* service names by id */
const SERVICE_NAMES={inn:'Inn',hall:'Town Hall',train:'Training Hall',temple:'Temple',tavern:'Tavern',shop:'Shop',smithy:'Smithy',stables:'Stables',barracks:'Barracks',elder:'Elder',hermit:'Hermit',gate:'Gate'};
/* tier kits for generated modules */
const TIER_KITS={
  1:['leather','shield_wood','club','sling','potion_heal','rations','torch'],
  2:['studded','shield_steel','shortsword','shortbow','potion_heal','potion_antidote','rations'],
  3:['chain','shield_steel','longsword','longbow','potion_serious','rations','rope'],
  4:['scale','shield_steel','longsword+1','longbow+1','potion_critical','holy_water','thieves_tools'],
  5:['plate','shield_tower','longsword+2','longbow+2','potion_full','potion_raise','mirror'],
};
