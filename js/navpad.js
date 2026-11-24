/* Emberfall — navpad.js : on-screen touch controls */
'use strict';
const NavPad = (()=>{
  let enabled=false;
  const BTNS=[
    ['n','▲'],['w','◀'],['e','▶'],['s','▼'],
    ['nw','↖'],['ne','↗'],['sw','↙'],['se','↘'],
    ['f','F'],['r','R'],['u','⚔'],['sp','⏸'],['mn','≡'],
  ];
  function init(){
    const host=document.getElementById('navpadHost');if(!host)return;
    host.innerHTML='';
    for(const [act,label] of BTNS){
      const b=document.createElement('button');b.textContent=label;b.dataset.act=act;
      b.style.cssText='width:34px;height:34px;margin:2px;font-size:14px;';
      b.addEventListener('click',()=>handle(act));
      b.addEventListener('touchstart',e=>{e.preventDefault();handle(act);},{passive:false});
      host.appendChild(b);
    }
    host.classList.add('hidden');
  }
  function handle(act){
    const g=Game.G;if(!g)return;
    if(g.screen==='combat'){
      if(act==='sp'){const u=Combat.B()&&Combat.B().active;if(u&&u.kind==='pc'&&u.hp>0){u.acted=true;Combat.advance();}}
      else if(act==='mn'){UI.menuDialog();}
      return;
    }
    if(g.screen==='wilds'){
      const map={n:'n',s:'s',w:'w',e:'e',nw:'nw',ne:'ne',sw:'sw',se:'se'}[act];
      if(map){Overland.move(map);return;}
      if(act==='f')Overland.forage();
      else if(act==='r')Overland.restWild();
      else if(act==='mn')UI.menuDialog();
      return;
    }
    switch(act){
      case 'n':Game.moveForward();break;
      case 's':Game.moveBack();break;
      case 'w':Game.turn(-1);break;
      case 'e':Game.turn(1);break;
      case 'nw':Game.strafe(-1);break;
      case 'ne':Game.strafe(1);break;
      case 'sw':case 'se':break;
      case 'f':Game.search();break;
      case 'r':Game.rest();break;
      case 'u':Game.useItem&&Game.useItem();break;
      case 'sp':Game.restHours(1);break;
      case 'mn':UI.menuDialog();break;
    }
  }
  function cycle(){enabled=!enabled;const h=document.getElementById('navpadHost');if(h)h.classList.toggle('hidden',!enabled);}
  function show(v){enabled=v;const h=document.getElementById('navpadHost');if(h)h.classList.toggle('hidden',!v);}
  return {init,handle,cycle,show,B:()=>enabled};
})();
