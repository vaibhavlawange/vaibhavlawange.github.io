// Shared leaf/nature animation system
function initLeaves() {
  const canvas = document.getElementById('leafCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const leafShapes = [
    // Simple leaf path functions
    (ctx, x, y, size, angle) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.8, -size * 0.5, size * 0.8, size * 0.5, 0, size * 0.3);
      ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.8, -size * 0.5, 0, -size);
      ctx.fill(); ctx.restore();
    },
    (ctx, x, y, size, angle) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    },
    (ctx, x, y, size, angle) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.9);
      ctx.bezierCurveTo(size, -size * 0.3, size * 0.6, size * 0.8, 0, size * 0.4);
      ctx.bezierCurveTo(-size * 0.6, size * 0.8, -size, -size * 0.3, 0, -size * 0.9);
      ctx.fill(); ctx.restore();
    }
  ];

  const colors = [
    'rgba(82,183,136,0.18)', 'rgba(45,106,79,0.15)',
    'rgba(183,228,199,0.2)', 'rgba(116,198,157,0.14)',
    'rgba(52,211,153,0.12)', 'rgba(167,243,208,0.16)'
  ];

  class Leaf {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : -60;
      this.size = 10 + Math.random() * 22;
      this.speedY = 0.4 + Math.random() * 0.8;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.sway = Math.random() * 0.4;
      this.swaySpeed = 0.005 + Math.random() * 0.01;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = Math.floor(Math.random() * leafShapes.length);
      this.opacity = 0.5 + Math.random() * 0.5;
    }
    update(t) {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(t * this.swaySpeed + this.swayOffset) * this.sway;
      this.angle += this.rotSpeed;
      if (this.y > canvas.height + 60) this.reset();
    }
    draw(t) {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      leafShapes[this.shape](ctx, this.x, this.y, this.size, this.angle);
      ctx.globalAlpha = 1;
    }
  }

  const leaves = Array.from({ length: 28 }, () => new Leaf());
  let t = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t++;
    leaves.forEach(l => { l.update(t); l.draw(t); });
    requestAnimationFrame(animate);
  }
  animate();
}

// Scroll reveal
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// Nav active
function initNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLeaves(); initReveal(); initNav();
});
