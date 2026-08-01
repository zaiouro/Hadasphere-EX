const transition=document.getElementById('transition');
const BAR_MS=1600;
const dataWait=window.__pageReady?Promise.race([window.__pageReady,new Promise(r=>setTimeout(r,4000))]):Promise.resolve();
Promise.all([
  new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true})),
  dataWait
]).then(()=>{
  transition.classList.remove('cover');
  transition.classList.add('active');
  setTimeout(()=>transition.classList.remove('active'),2200);
});
document.querySelectorAll('a[href]').forEach(a=>{
  const href=a.getAttribute('href');
  if(!href||href.startsWith('http'))return;
  a.addEventListener('click',e=>{
    e.preventDefault();
    transition.classList.add('active');
    setTimeout(()=>location.href=href,BAR_MS);
  });
});
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
