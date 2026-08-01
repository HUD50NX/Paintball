/* ============================================================
   PAINTBALL ARENA — MAPAS
   Arquivo separado: cada mapa tem seus obstáculos (em unidades
   do mundo fixo 900x420) e suas próprias rotinas de desenho de
   chão/borda (estáticas, pintadas uma vez por partida) e de
   obstáculo (desenhado ao vivo a cada frame, pode animar).
============================================================ */
(function(){
"use strict";

const WORLD_W = 900, WORLD_H = 420, ARENA_MARGIN = 30;

function buildNoisePattern(ctx, base, specks){
  const s = 96;
  const pc = document.createElement('canvas');
  pc.width = s; pc.height = s;
  const p = pc.getContext('2d');
  p.fillStyle = base;
  p.fillRect(0,0,s,s);
  for(let i=0;i<specks;i++){
    const x = Math.random()*s, y = Math.random()*s;
    const b = Math.random();
    p.fillStyle = `rgba(${b>0.5?255:0},${b>0.5?255:0},${b>0.5?255:0},${(Math.random()*0.05).toFixed(3)})`;
    p.fillRect(x,y,1.5,1.5);
  }
  return ctx.createPattern(pc, 'repeat');
}

function drawShadow(ctx,x,y,w,h){
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(x+w/2+3, y+h+6, w/2*0.9, h*0.22, 0, 0, Math.PI*2);
  ctx.fill();
}

/* ---------------- MAPA 1: ARENA URBANA (original) ---------------- */
const urban = {
  id:'urban', name:'Arena Urbana',
  obstacles:[
    {rx:0.20, ry:0.22, rw:0.16, rh:0.10},
    {rx:0.62, ry:0.20, rw:0.14, rh:0.10},
    {rx:0.40, ry:0.46, rw:0.12, rh:0.12},
    {rx:0.12, ry:0.68, rw:0.15, rh:0.10},
    {rx:0.68, ry:0.65, rw:0.16, rh:0.10},
    {rx:0.78, ry:0.40, rw:0.08, rh:0.13},
    {rx:0.14, ry:0.44, rw:0.08, rh:0.12},
  ],
  drawGround(ctx){
    const pat = buildNoisePattern(ctx, '#22262b', 220);
    const g = ctx.createRadialGradient(WORLD_W/2, WORLD_H*0.4, 50, WORLD_W/2, WORLD_H*0.5, Math.max(WORLD_W,WORLD_H)*0.8);
    g.addColorStop(0, '#2b3036'); g.addColorStop(1, '#15181b');
    ctx.fillStyle = g; ctx.fillRect(0,0,WORLD_W,WORLD_H);
    ctx.fillStyle = pat; ctx.fillRect(0,0,WORLD_W,WORLD_H);
  },
  drawBorder(ctx){
    const m = ARENA_MARGIN, sw = 22;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0,0,WORLD_W,WORLD_H);
    ctx.rect(sw,sw,WORLD_W-sw*2,WORLD_H-sw*2);
    ctx.clip('evenodd');
    for(let i=-WORLD_H;i<WORLD_W+WORLD_H;i+=26){
      ctx.fillStyle = (Math.floor(i/26)%2===0) ? '#ffb020' : '#1a1a1a';
      ctx.save(); ctx.translate(i,0); ctx.rotate(Math.PI/4); ctx.fillRect(0,-WORLD_H*2,18,WORLD_H*4); ctx.restore();
    }
    ctx.restore();
  },
  drawObstacle(ctx,o){
    const {x,y,w,h} = o;
    drawShadow(ctx,x,y,w,h);
    const grad = ctx.createLinearGradient(x,y,x,y+h);
    grad.addColorStop(0, '#8a5a2e'); grad.addColorStop(1, '#4d3016');
    ctx.fillStyle = grad; ctx.fillRect(x,y,w,h);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 3; ctx.strokeRect(x+1.5,y+1.5,w-3,h-3);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+w,y+h); ctx.moveTo(x+w,y); ctx.lineTo(x,y+h); ctx.stroke();
    ctx.fillStyle = 'rgba(255,176,32,0.85)'; ctx.fillRect(x, y+h*0.42, w, h*0.10);
  }
};

/* ---------------- MAPA 2: SETOR NEON ---------------- */
const neon = {
  id:'neon', name:'Setor Neon',
  obstacles:[
    {rx:0.09, ry:0.17, rw:0.18, rh:0.15},
    {rx:0.73, ry:0.68, rw:0.18, rh:0.15},
    {rx:0.68, ry:0.17, rw:0.14, rh:0.11},
    {rx:0.18, ry:0.72, rw:0.14, rh:0.11},
    {rx:0.42, ry:0.40, rw:0.16, rh:0.20},
    {rx:0.83, ry:0.42, rw:0.08, rh:0.16},
    {rx:0.09, ry:0.42, rw:0.08, rh:0.16},
  ],
  drawGround(ctx){
    const g = ctx.createRadialGradient(WORLD_W/2, WORLD_H/2, 40, WORLD_W/2, WORLD_H/2, Math.max(WORLD_W,WORLD_H)*0.75);
    g.addColorStop(0, '#141a2e'); g.addColorStop(1, '#05060a');
    ctx.fillStyle = g; ctx.fillRect(0,0,WORLD_W,WORLD_H);
    ctx.save();
    ctx.strokeStyle = 'rgba(0,220,255,0.16)'; ctx.lineWidth = 1;
    const step = 30;
    for(let x=0;x<=WORLD_W;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,WORLD_H); ctx.stroke(); }
    for(let y=0;y<=WORLD_H;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(WORLD_W,y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(0,220,255,0.35)'; ctx.shadowColor='rgba(0,220,255,0.6)'; ctx.shadowBlur=6;
    for(let x=0;x<=WORLD_W;x+=step*3){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,WORLD_H); ctx.stroke(); }
    for(let y=0;y<=WORLD_H;y+=step*3){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(WORLD_W,y); ctx.stroke(); }
    ctx.restore();
    for(let i=0;i<14;i++){
      const rx=40+Math.random()*(WORLD_W-80), ry=40+Math.random()*(WORLD_H-80), rr=20+Math.random()*40;
      const gg = ctx.createRadialGradient(rx,ry,0,rx,ry,rr);
      gg.addColorStop(0,'rgba(0,0,0,0.22)'); gg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(rx,ry,rr,0,Math.PI*2); ctx.fill();
    }
  },
  drawBorder(ctx){
    const m = ARENA_MARGIN;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,47,214,0.55)'; ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(255,47,214,0.9)'; ctx.shadowBlur = 16;
    ctx.strokeRect(m, m, WORLD_W-m*2, WORLD_H-m*2);
    ctx.strokeStyle = 'rgba(0,220,255,0.5)'; ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0,220,255,0.8)'; ctx.shadowBlur = 8;
    ctx.strokeRect(m-6, m-6, WORLD_W-(m-6)*2, WORLD_H-(m-6)*2);
    ctx.restore();
  },
  drawObstacle(ctx,o,idx){
    const {x,y,w,h} = o;
    drawShadow(ctx,x,y,w,h);
    const grad = ctx.createLinearGradient(x,y,x,y+h);
    grad.addColorStop(0,'#4a5560'); grad.addColorStop(0.5,'#2e363e'); grad.addColorStop(1,'#1c2126');
    ctx.fillStyle = grad; ctx.fillRect(x,y,w,h);
    ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1;
    for(let px=x+8; px<x+w-4; px+=10){ ctx.beginPath(); ctx.moveTo(px,y+3); ctx.lineTo(px,y+h-3); ctx.stroke(); }
    const neonCol = idx%2===0 ? '#00e0ff' : '#ff2fd6';
    ctx.strokeStyle = neonCol; ctx.lineWidth = 2; ctx.shadowColor = neonCol; ctx.shadowBlur = 10;
    ctx.strokeRect(x+1,y+1,w-2,h-2); ctx.shadowBlur = 0;
    const blink = Math.sin(performance.now()/220 + idx*2) > 0.3;
    ctx.beginPath(); ctx.arc(x+w-9,y+9,3.2,0,Math.PI*2);
    ctx.fillStyle = blink ? '#ff3030' : 'rgba(120,20,20,0.5)';
    if(blink){ ctx.shadowColor='#ff3030'; ctx.shadowBlur=8; }
    ctx.fill(); ctx.shadowBlur=0;
  }
};

/* ---------------- MAPA 3: TRINCHEIRA ---------------- */
const trench = {
  id:'trench', name:'Trincheira',
  obstacles:[
    {rx:0.40, ry:0.17, rw:0.20, rh:0.10},
    {rx:0.40, ry:0.73, rw:0.20, rh:0.10},
    {rx:0.10, ry:0.42, rw:0.11, rh:0.16},
    {rx:0.79, ry:0.42, rw:0.11, rh:0.16},
    {rx:0.22, ry:0.30, rw:0.12, rh:0.09},
    {rx:0.66, ry:0.61, rw:0.12, rh:0.09},
    {rx:0.66, ry:0.30, rw:0.12, rh:0.09},
    {rx:0.22, ry:0.61, rw:0.12, rh:0.09},
  ],
  drawGround(ctx){
    const g = ctx.createLinearGradient(0,0,0,WORLD_H);
    g.addColorStop(0,'#3c3a26'); g.addColorStop(1,'#241f14');
    ctx.fillStyle = g; ctx.fillRect(0,0,WORLD_W,WORLD_H);
    for(let i=0;i<160;i++){
      const x=Math.random()*WORLD_W, y=Math.random()*WORLD_H;
      ctx.fillStyle = `rgba(${60+Math.random()*30},${90+Math.random()*40},${30+Math.random()*20},0.5)`;
      ctx.fillRect(x,y,2+Math.random()*3,5+Math.random()*6);
    }
    for(let i=0;i<20;i++){
      const px=Math.random()*WORLD_W, py=Math.random()*WORLD_H, r=18+Math.random()*38;
      const gg = ctx.createRadialGradient(px,py,0,px,py,r);
      gg.addColorStop(0,'rgba(15,12,8,0.5)'); gg.addColorStop(1,'rgba(15,12,8,0)');
      ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(px,py,r,r*0.55,0,0,Math.PI*2); ctx.fill();
    }
    const fog = ctx.createLinearGradient(0,0,0,WORLD_H);
    fog.addColorStop(0,'rgba(180,180,170,0.10)'); fog.addColorStop(1,'rgba(0,0,0,0.2)');
    ctx.fillStyle = fog; ctx.fillRect(0,0,WORLD_W,WORLD_H);
  },
  drawBorder(ctx){
    const m = ARENA_MARGIN;
    ctx.save();
    ctx.strokeStyle = 'rgba(40,32,20,0.9)'; ctx.lineWidth = 3;
    ctx.strokeRect(m, m, WORLD_W-m*2, WORLD_H-m*2);
    ctx.strokeStyle = '#b8b0a0'; ctx.lineWidth = 1;
    const step = 14;
    for(let x=m; x<WORLD_W-m; x+=step){
      ctx.beginPath(); ctx.moveTo(x-3,m-8); ctx.lineTo(x+3,m-2); ctx.moveTo(x+3,m-8); ctx.lineTo(x-3,m-2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-3,WORLD_H-m+2); ctx.lineTo(x+3,WORLD_H-m+8); ctx.moveTo(x+3,WORLD_H-m+2); ctx.lineTo(x-3,WORLD_H-m+8); ctx.stroke();
    }
    for(let y=m; y<WORLD_H-m; y+=step){
      ctx.beginPath(); ctx.moveTo(m-8,y-3); ctx.lineTo(m-2,y+3); ctx.moveTo(m-8,y+3); ctx.lineTo(m-2,y-3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(WORLD_W-m+2,y-3); ctx.lineTo(WORLD_W-m+8,y+3); ctx.moveTo(WORLD_W-m+2,y+3); ctx.lineTo(WORLD_W-m+8,y-3); ctx.stroke();
    }
    ctx.restore();
  },
  drawObstacle(ctx,o){
    const {x,y,w,h} = o;
    drawShadow(ctx,x,y,w,h);
    const rows = Math.max(2, Math.round(h/16));
    const rowH = h/rows;
    for(let r=0;r<rows;r++){
      const offset = (r%2===0) ? 0 : 9;
      const ry = y + r*rowH;
      for(let bx = x-offset; bx<x+w; bx+=18){
        const cx = Math.max(x,bx), cw = Math.min(18,x+w-cx);
        if(cw<=0) continue;
        const grad = ctx.createLinearGradient(cx,ry,cx,ry+rowH);
        grad.addColorStop(0,'#a8945f'); grad.addColorStop(1,'#6e5c34');
        ctx.save();
        ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
        ctx.beginPath(); ctx.ellipse(cx+cw/2, ry+rowH/2, cw/2-1, rowH/2-1, 0,0,Math.PI*2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();
        ctx.restore();
      }
    }
    ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=2; ctx.strokeRect(x+1,y+1,w-2,h-2);
  }
};

/* ---------------- MAPA 4: PRAIA TROPICAL ---------------- */
const stripeColors = ['#ff5c6e','#3fc8ff','#ffd23f','#9dff2e','#ff9d3f'];
const beach = {
  id:'beach', name:'Praia Tropical',
  obstacles:[
    {rx:0.35, ry:0.17, rw:0.14, rh:0.10},
    {rx:0.35, ry:0.73, rw:0.14, rh:0.10},
    {rx:0.08, ry:0.43, rw:0.13, rh:0.14},
    {rx:0.79, ry:0.43, rw:0.13, rh:0.14},
    {rx:0.46, ry:0.44, rw:0.08, rh:0.12},
  ],
  drawGround(ctx){
    const g = ctx.createRadialGradient(WORLD_W/2, WORLD_H*0.4, 60, WORLD_W/2, WORLD_H*0.5, Math.max(WORLD_W,WORLD_H)*0.85);
    g.addColorStop(0,'#f0d8a0'); g.addColorStop(1,'#d4b478');
    ctx.fillStyle = g; ctx.fillRect(0,0,WORLD_W,WORLD_H);
    for(let i=0;i<500;i++){
      const x=Math.random()*WORLD_W, y=Math.random()*WORLD_H;
      ctx.fillStyle = Math.random()>0.5 ? 'rgba(255,255,255,0.15)' : 'rgba(120,90,40,0.12)';
      ctx.fillRect(x,y,1.4,1.4);
    }
    for(let i=0;i<10;i++){
      const x=60+Math.random()*(WORLD_W-120), y=60+Math.random()*(WORLD_H-120);
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(x,y,2.5,0,Math.PI*2); ctx.fill();
    }
  },
  drawBorder(ctx){
    const m = ARENA_MARGIN;
    ctx.save();
    const seaGrad = ctx.createLinearGradient(0,0,0,WORLD_H);
    seaGrad.addColorStop(0,'#0e7ba8'); seaGrad.addColorStop(1,'#0a5a80');
    ctx.fillStyle = seaGrad;
    ctx.beginPath(); ctx.rect(0,0,WORLD_W,WORLD_H); ctx.rect(m,m,WORLD_W-m*2,WORLD_H-m*2); ctx.fill('evenodd');
    ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(m,m); for(let x=m;x<=WORLD_W-m;x+=8) ctx.lineTo(x, m+Math.sin(x/14)*2.5);
    ctx.moveTo(m,WORLD_H-m); for(let x=m;x<=WORLD_W-m;x+=8) ctx.lineTo(x, WORLD_H-m+Math.sin(x/14+2)*2.5);
    ctx.moveTo(m,m); for(let y=m;y<=WORLD_H-m;y+=8) ctx.lineTo(m+Math.sin(y/14+1)*2.5, y);
    ctx.moveTo(WORLD_W-m,m); for(let y=m;y<=WORLD_H-m;y+=8) ctx.lineTo(WORLD_W-m+Math.sin(y/14+3)*2.5, y);
    ctx.stroke();
    ctx.restore();
  },
  drawObstacle(ctx,o,idx){
    const {x,y,w,h} = o;
    drawShadow(ctx,x,y,w,h);
    const grad = ctx.createLinearGradient(x,y,x,y+h);
    grad.addColorStop(0,'#e0b878'); grad.addColorStop(1,'#a67c42');
    ctx.fillStyle = grad; ctx.fillRect(x,y,w,h);
    ctx.save();
    ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
    ctx.fillStyle = stripeColors[idx % stripeColors.length]; ctx.globalAlpha = 0.8;
    for(let i=-h;i<w+h;i+=20){ ctx.save(); ctx.translate(x+i,y); ctx.rotate(Math.PI/4); ctx.fillRect(0,0,9,h*2.2); ctx.restore(); }
    ctx.restore();
    ctx.strokeStyle='rgba(90,60,20,0.6)'; ctx.lineWidth=2.5; ctx.strokeRect(x+1,y+1,w-2,h-2);
    ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x+w/2,y); ctx.lineTo(x+w/2,y+h); ctx.moveTo(x,y+h/2); ctx.lineTo(x+w,y+h/2); ctx.stroke();
  }
};

/* ---------------- MAPA 5: LINHA DE PRODUÇÃO (com caixa móvel) ---------------- */
const factory = {
  id:'factory', name:'Linha de Produção',
  obstacles:[
    {rx:0.12, ry:0.17, rw:0.15, rh:0.10},
    {rx:0.12, ry:0.73, rw:0.15, rh:0.10},
    {rx:0.73, ry:0.17, rw:0.15, rh:0.10},
    {rx:0.73, ry:0.73, rw:0.15, rh:0.10},
    {rx:0, ry:0, rw:0.10, rh:0.14, moving:true}, // posição real calculada por movingX(t)
  ],
  movingIndex: 4,
  movingBase: { y:180.6, minX:275, maxX:475, speed:0.35, w:90, h:58.8 },
  movingX(tSeconds){
    const b = this.movingBase;
    const range = (b.maxX - b.minX)/2;
    const center = b.minX + range;
    return center + Math.sin(tSeconds*b.speed)*range;
  },
  drawGround(ctx){
    const g = ctx.createLinearGradient(0,0,0,WORLD_H);
    g.addColorStop(0,'#2a2e33'); g.addColorStop(1,'#17191c');
    ctx.fillStyle = g; ctx.fillRect(0,0,WORLD_W,WORLD_H);
    ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1;
    for(let x=0;x<=WORLD_W;x+=20){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,WORLD_H); ctx.stroke(); }
    for(let y=0;y<=WORLD_H;y+=20){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(WORLD_W,y); ctx.stroke(); }
    const b = this.movingBase;
    const x0 = b.minX - b.w*0.5, x1 = b.maxX + b.w*0.5;
    ctx.save();
    ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fillRect(x0, b.y-6, (x1-x0), b.h+12);
    ctx.strokeStyle='rgba(255,176,32,0.6)'; ctx.lineWidth=2; ctx.setLineDash([10,8]);
    ctx.strokeRect(x0, b.y-6, (x1-x0), b.h+12);
    ctx.setLineDash([]);
    ctx.restore();
  },
  drawBorder(ctx){
    const m = ARENA_MARGIN;
    ctx.save();
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 8;
    ctx.strokeRect(m, m, WORLD_W-m*2, WORLD_H-m*2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(m-8,m-8,WORLD_W-(m-8)*2,WORLD_H-(m-8)*2);
    ctx.rect(m,m,WORLD_W-m*2,WORLD_H-m*2);
    ctx.clip('evenodd');
    for(let i=-WORLD_H;i<WORLD_W+WORLD_H;i+=22){
      ctx.fillStyle = (Math.floor(i/22)%2===0) ? '#ffb020' : '#1a1a1a';
      ctx.save(); ctx.translate(i,0); ctx.rotate(Math.PI/4); ctx.fillRect(0,-WORLD_H*2,14,WORLD_H*4); ctx.restore();
    }
    ctx.restore();
    ctx.restore();
  },
  drawObstacle(ctx,o){
    const {x,y,w,h} = o;
    drawShadow(ctx,x,y,w,h);
    const grad = ctx.createLinearGradient(x,y,x,y+h);
    if(o.moving){ grad.addColorStop(0,'#ffcf6b'); grad.addColorStop(1,'#c98a1f'); }
    else { grad.addColorStop(0,'#5a626b'); grad.addColorStop(1,'#33383d'); }
    ctx.fillStyle = grad; ctx.fillRect(x,y,w,h);
    ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=2.5; ctx.strokeRect(x+1,y+1,w-2,h-2);
    ctx.fillStyle = o.moving ? 'rgba(255,255,255,0.6)' : 'rgba(255,176,32,0.7)';
    ctx.fillRect(x, y+h*0.42, w, h*0.10);
    if(o.moving){
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.beginPath(); ctx.moveTo(x+w-6,y+h/2-6); ctx.lineTo(x+w+2,y+h/2); ctx.lineTo(x+w-6,y+h/2+6); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x+6,y+h/2-6); ctx.lineTo(x-2,y+h/2); ctx.lineTo(x+6,y+h/2+6); ctx.fill();
    }
  }
};

window.GAME_MAPS = { urban, neon, trench, beach, factory };
window.GAME_MAPS_ORDER = ['urban','neon','trench','beach','factory'];
})();
