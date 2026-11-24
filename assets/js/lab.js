(() => {
  'use strict';
  const canvas = document.querySelector('.hero-topology');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const nodes = [[.04,.25],[.18,.65],[.3,.18],[.42,.5],[.58,.12],[.64,.8],[.8,.35],[.94,.7]];
  const edges = [[0,2],[0,1],[1,3],[2,3],[3,4],[3,5],[4,6],[5,7],[6,7]];
  let frame=0, visible=true, width=0, height=0, last=0, pointer=null;
  function size() {
    const box=hero.getBoundingClientRect();
    width=box.width;height=box.height;
    const dpr=Math.min(devicePixelRatio || 1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
  }
  function stop() { if(frame)cancelAnimationFrame(frame);frame=0; }
  function eligible() {return visible&&!document.hidden&&!reduced.matches;}
  function draw(time) {
    frame=0;
    if(!eligible())return;
    frame=requestAnimationFrame(draw);
    if(time-last<50)return;
    last=time;
    const light=document.documentElement.dataset.theme==='light';
    const mint=light?'24,92,67':'125,240,196',warm=light?'180,83,9':'245,185,113';
    context.clearRect(0,0,width,height);
    const points=nodes.map(([x,y],i)=>[x*width+Math.sin(time*.00016+i)*7,y*height+Math.cos(time*.00012+i)*6]);
    context.lineWidth=1;
    edges.forEach(([a,b],i)=>{
      const p=points[a],q=points[b];
      context.strokeStyle='rgba('+mint+','+(light?.09:.13)+')';
      context.beginPath();context.moveTo(...p);context.lineTo(...q);context.stroke();
      if(i===3||i===7){
        context.strokeStyle='rgba('+warm+','+(light?.12:.2)+')';
        context.beginPath();context.moveTo(...p);context.quadraticCurveTo((p[0]+q[0])/2,(p[1]+q[1])/2-32,...q);context.stroke();
      }
    });
    points.forEach(([x,y],i)=>{
      const near=pointer?Math.max(0,1-Math.hypot(pointer[0]-x,pointer[1]-y)/150):0;
      context.fillStyle='rgba('+(i===3?warm:mint)+','+(.18+near*.45)+')';
      context.fillRect(x-3,y-3,6,6);
      context.strokeStyle='rgba('+mint+','+(.09+near*.2)+')';
      context.strokeRect(x-8,y-8,16,16);
    });
  }
  function sync() {
    stop();
    if(reduced.matches){context.clearRect(0,0,width,height);canvas.hidden=true;return;}
    canvas.hidden=false;
    if(eligible())frame=requestAnimationFrame(draw);
  }
  hero.addEventListener('pointermove',e=>{
    if(!fine.matches||reduced.matches)return;
    const r=hero.getBoundingClientRect();pointer=[e.clientX-r.left,e.clientY-r.top];
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{pointer=null;});
  if(typeof ResizeObserver==='function')new ResizeObserver(()=>{size();sync();}).observe(hero);
  else window.addEventListener('resize',()=>{size();sync();});
  if(typeof IntersectionObserver==='function')new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;sync();
  }).observe(hero);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  size();sync();
})();
