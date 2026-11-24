/* Emberfall — watch.js : real-time day/night cycle */
'use strict';
const Watch = (()=>{
  let timer=null,acc=0;
  const MIN_PER_TICK=5; // game minutes per real second
  function start(){stop();timer=setInterval(tick,1000);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  function tick(){
    const g=Game.G;if(!g||g.screen==='title'||g.screen==='gameover')return;
    acc+=MIN_PER_TICK;g.time+=acc;acc=0;
    // night falls 18:00-06:00
    const h=Rules.fmtTime(g.time).hour;
    g.night=(h>=18||h<6);
    // poison ticks & statuses each game hour
    if(g.time%60<MIN_PER_TICK)Campaign.tickStatuses();
    // autosave every in-game day
    if(g.time%1440<MIN_PER_TICK&&g.screen!=='title')Game.autosave();
    // update HUD clock
    const el=document.getElementById('clock');if(el)el.textContent=Rules.fmtTime(g.time).label;
  }
  function setSpeed(mult){MIN_PER_TICK=5*mult;}
  return {start,stop,setSpeed};
})();
