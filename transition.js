const transition=document.getElementById('transition');
const BAR_MS=1600;
const viaNav=sessionStorage.getItem('hd_nav');
if(viaNav){
  sessionStorage.removeItem('hd_nav');
  transition.classList.remove('cover');
}else{
  const dataWait=window.__pageReady?Promise.race([window.__pageReady,new Promise(r=>setTimeout(r,4000))]):Promise.resolve();
  Promise.all([
    new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true})),
    dataWait
  ]).then(()=>{
    transition.classList.remove('cover');
    transition.classList.add('active');
    setTimeout(()=>transition.classList.remove('active'),2200);
  });
}
document.querySelectorAll('a[href]').forEach(a=>{
  const href=a.getAttribute('href');
  if(!href||href.startsWith('http'))return;
  a.addEventListener('click',e=>{
    e.preventDefault();
    sessionStorage.setItem('hd_nav','1');
    transition.classList.add('active');
    setTimeout(()=>location.href=href,BAR_MS);
  });
});
