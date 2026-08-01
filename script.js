// ===== SKY / ABYSS BACKGROUND =====
const canvas=document.getElementById('bg');
const ctx=canvas.getContext('2d');
let W,H,stars=[],conn=110;
function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
function star(){return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.2,vx:(Math.random()-.5)*.16,vy:.04+Math.random()*.2,tw:Math.random()*Math.PI*2};}
function init(){resize();stars=Array.from({length:Math.floor(W*H/7000)},star);}
function tick(){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    s.x+=s.vx;s.y+=s.vy;s.tw+=.05;
    if(s.x<0)s.x=W;if(s.x>W)s.x=0;if(s.y>H)s.y=0;
    const depth=Math.max(0.1,1-s.y/H*1.25);
    const twinkle=.75+.25*Math.sin(s.tw);
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(175,185,235,${depth*twinkle})`;ctx.fill();
  }
  for(let i=0;i<stars.length;i++){
    for(let j=i+1;j<stars.length;j++){
      const a=stars[i],b=stars[j];
      const dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<conn){
        const depth=Math.max(0,1-((a.y+b.y)/2)/H*1.3);
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(124,92,255,${(1-d/conn)*.2*depth})`;ctx.lineWidth=.5;ctx.stroke();
      }
    }
  }
  requestAnimationFrame(tick);
}
addEventListener('resize',()=>{resize();stars=Array.from({length:Math.floor(W*H/7000)},star);});
init();tick();

// ===== SCROLL-FOLLOWING GRADIENT =====
const bgGrad=document.querySelector('.bg-gradient');
function updateGradient(){
  const max=document.body.scrollHeight-innerHeight;
  const p=max>0?window.scrollY/max:0;
  bgGrad.style.backgroundPosition=`0% ${(p*100).toFixed(2)}%`;
}
addEventListener('scroll',updateGradient,{passive:true});
updateGradient();

// ===== MOBILE MENU =====
const menuBtn=document.getElementById('menu-btn'),mNav=document.querySelector('nav');
menuBtn.addEventListener('click',()=>{
  const open=mNav.classList.toggle('open');
  menuBtn.classList.toggle('open',open);
});
mNav.addEventListener('click',e=>{
  if(e.target.tagName==='A'){mNav.classList.remove('open');menuBtn.classList.remove('open');}
});

// ===== SELECTION & CONTEXT MENU LOCK =====
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('keydown',e=>{
  if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(e.key.toUpperCase()))||(e.ctrlKey&&e.key.toLowerCase()==='u')){
    e.preventDefault();
  }
});

// ===== SMOOTH WHEEL SCROLLING =====
let smTarget=window.scrollY,smCurrent=window.scrollY,smActive=false,smWheel=false;
function smStep(){
  smCurrent+=(smTarget-smCurrent)*0.14;
  if(Math.abs(smTarget-smCurrent)<0.6){
    window.scrollTo({top:smTarget,behavior:'auto'});
    smActive=false;
    smWheel=false;
    return;
  }
  window.scrollTo({top:smCurrent,behavior:'auto'});
  requestAnimationFrame(smStep);
}
addEventListener('wheel',e=>{
  if(e.ctrlKey||e.metaKey)return;
  e.preventDefault();
  const max=document.documentElement.scrollHeight-innerHeight;
  smTarget=Math.max(0,Math.min(max,smTarget+e.deltaY));
  smWheel=true;
  if(!smActive){smActive=true;requestAnimationFrame(smStep);}
},{passive:false});
addEventListener('scroll',()=>{
  if(!smWheel&&!smActive){smTarget=window.scrollY;smCurrent=window.scrollY;}
},{passive:true});
