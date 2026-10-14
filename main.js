/**
 * YOUPULSE // BDE YOUCODE YOUSSOUFIA
 * Interactive Engine 3.0
 * - Ultra-reactive Sound Wave & Equalizer Canvas
 * - New Cybernetic Pass Cards with 3D Tilt & Tech Scanlines
 * - Bouncing Hamster Modal with Time Countdown Only (Zero Emojis)
 */

// --- 1. Sound Synthesis Engine (Web Audio API) ---
class SoundSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic audible whisper "SHHHHH!"
  playHamsterShhh() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 0.65;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * Math.pow(envelope, 0.7);
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4200, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + duration);
      filter.Q.setValueAtTime(4, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch (e) {}
  }

  // Cute squeak when clicking directly on the bouncing hamster
  playHamsterSqueak() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.16);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Tactile futuristic micro-blip
  playHoverBlip(freq = 600) {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }
}

const sound = new SoundSynth();

// --- 2. Advanced Audio Waveform & Equalizer Canvas Engine ---
class SoundWaveEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      prevX: this.width / 2,
      prevY: this.height / 2,
      speed: 0,
      active: false
    };

    this.sonars = [];
    this.particles = [];
    this.time = 0;
    this.waveLayers = 10;
    this.eqBars = 48;

    this.initParticles();
    this.bindEvents();
    this.render();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    const count = Math.min(Math.floor(this.width / 20), 70);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.3 ? '#00d2ff' : '#0066ff'
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - this.mouse.x;
      const dy = e.clientY - this.mouse.y;
      this.mouse.speed = Math.min(Math.hypot(dx, dy), 60);

      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;

      if (this.mouse.speed > 10 && Math.random() > 0.5) {
        this.emitSonar(this.mouse.x, this.mouse.y, this.mouse.speed);
      }
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.speed = 0;
    });

    window.addEventListener('click', (e) => {
      this.emitSonar(e.clientX, e.clientY, 40);
    });
  }

  emitSonar(x, y, power = 25) {
    this.sonars.push({
      x,
      y,
      radius: 4,
      maxRadius: Math.min(this.width, this.height) * 0.6,
      alpha: 1,
      speed: 8 + power * 0.2
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.time += 0.022;

    this.mouse.speed *= 0.94;

    // 1. Sonar Wave Rings
    for (let i = this.sonars.length - 1; i >= 0; i--) {
      const s = this.sonars[i];
      s.radius += s.speed;
      s.alpha = 1 - s.radius / s.maxRadius;

      if (s.alpha <= 0) {
        this.sonars.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 210, 255, ${s.alpha * 0.5})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius * 0.75, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 102, 255, ${s.alpha * 0.3})`;
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();
    }

    // 2. Bottom Equalizer Spectrum Bars
    const barWidth = this.width / this.eqBars;
    for (let i = 0; i < this.eqBars; i++) {
      const x = i * barWidth;
      let mouseBoost = 0;
      if (this.mouse.active) {
        const d = Math.abs(x - this.mouse.x);
        if (d < 300) {
          mouseBoost = (1 - d / 300) * 120 * (this.mouse.speed / 15 + 1);
        }
      }

      const freqHeight =
        Math.abs(Math.sin(i * 0.2 + this.time * 3) * Math.cos(i * 0.1 - this.time * 2)) * 70 +
        mouseBoost +
        15;

      const gradient = this.ctx.createLinearGradient(0, this.height - freqHeight, 0, this.height);
      gradient.addColorStop(0, 'rgba(0, 210, 255, 0.45)');
      gradient.addColorStop(1, 'rgba(0, 102, 255, 0.05)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x + 2, this.height - freqHeight, barWidth - 4, freqHeight);
    }

    // 3. Multi-Layer Sine Audio Waves
    const verticalGap = this.height / (this.waveLayers + 1);
    for (let i = 0; i < this.waveLayers; i++) {
      const baseY = verticalGap * (i + 1);
      const freq = 0.0025 + i * 0.0005;
      const baseAmp = 18 + (i % 4) * 8;
      const alpha = 0.18 + (i / this.waveLayers) * 0.35;

      this.drawWaveRibbon(baseY, freq, baseAmp, alpha, i);
    }

    // 4. Floating Audio Particles
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          const force = (1 - dist / 180) * 1.5;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = 0.6;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;

    requestAnimationFrame(() => this.render());
  }

  drawWaveRibbon(baseY, freq, baseAmp, alpha, index) {
    this.ctx.save();
    this.ctx.beginPath();

    this.ctx.strokeStyle = index % 2 === 0 
      ? `rgba(0, 210, 255, ${alpha})` 
      : `rgba(0, 102, 255, ${alpha * 1.2})`;
    this.ctx.lineWidth = index % 3 === 0 ? 2.5 : 1.5;

    const step = 6;
    for (let x = 0; x <= this.width; x += step) {
      let mouseSpike = 0;
      if (this.mouse.active) {
        const dist = Math.hypot(x - this.mouse.x, baseY - this.mouse.y);
        if (dist < 280) {
          const field = Math.cos((dist / 280) * (Math.PI / 2));
          const acousticVibe = Math.sin(x * 0.09 + this.time * 10) * (this.mouse.speed * 2.2);
          mouseSpike = field * (60 + acousticVibe);
        }
      }

      const y =
        baseY +
        Math.sin(x * freq + this.time * 2.5 + index) * baseAmp +
        Math.sin(x * freq * 2 - this.time * 1.8) * (baseAmp * 0.45) +
        mouseSpike;

      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();
    this.ctx.restore();
  }
}

// --- 3. The 6 Members Dataset (Zero Emojis) ---
const MEMBERS_DATA = [
  {
    id: 'yassine',
    number: '01',
    callsign: 'APEX',
    name: 'Yassine El Mansouri',
    role: 'Président du BDE',
    photo: 'assets/images/yassine.jpg',
    tagline: 'Transformer chaque ligne de code en opportunité réelle et chaque projet en souvenir inoubliable.'
  },
  {
    id: 'salma',
    number: '02',
    callsign: 'FLUX',
    name: 'Salma Bennani',
    role: 'Vice-Présidente',
    photo: 'assets/images/salma.jpg',
    tagline: 'Le trait d’union entre les développeurs, l’écoute bienveillante et l’énergie collective du campus.'
  },
  {
    id: 'amine',
    number: '03',
    callsign: 'CIPHER',
    name: 'Amine Tazi',
    role: 'Responsable Tech & Hackathons',
    photo: 'assets/images/amine.jpg',
    tagline: '0% de latence, 100% de code. Prêt pour des nuits blanches de hackathons et d’arènes LAN.'
  },
  {
    id: 'nour',
    number: '04',
    callsign: 'PRISM',
    name: 'Nour Cherkaoui',
    role: 'Directrice Artistique & Design',
    photo: 'assets/images/nour.jpg',
    tagline: 'Donner à YouCode une identité visuelle futuriste qui claque sur les réseaux et sur le campus.'
  },
  {
    id: 'mehdi',
    number: '05',
    callsign: 'VOLT',
    name: 'Mehdi Daoudi',
    role: 'Responsable Logistique & Événements',
    photo: 'assets/images/mehdi.jpg',
    tagline: 'Si le son ne fait pas vibrer les murs et que la régie traîne, ce n’est pas YouPulse.'
  },
  {
    id: 'rania',
    number: '06',
    callsign: 'ECHO',
    name: 'Rania Alami',
    role: 'Responsable Communication & Relations Étudiants',
    photo: 'assets/images/rania.jpg',
    tagline: 'Donner une voix à chaque promo, raconter nos réussites et faire rayonner YouPulse.'
  }
];

// --- 4. Render Redesigned Cybernetic Cards ---
function renderMemberCards() {
  const container = document.getElementById('members-grid');
  if (!container) return;

  container.innerHTML = MEMBERS_DATA.map(m => `
    <article class="member-card" data-id="${m.id}" tabindex="0" role="button" aria-label="Voir le profil de ${m.name}">
      
      <!-- Tech Corner Accents [ + ] -->
      <div class="card-tech-corners" aria-hidden="true"></div>

      <!-- Card Top Meta Bar -->
      <div class="card-meta-bar">
        <span class="card-callsign-tag">
          <span class="tag-dot"></span>
          CORE #${m.number} // ${m.callsign}
        </span>
        <div class="card-frequency-indicator" aria-hidden="true">
          <span class="mini-bar"></span>
          <span class="mini-bar"></span>
          <span class="mini-bar"></span>
          <span class="mini-bar"></span>
        </div>
      </div>

      <!-- Photo with Holographic Scanline -->
      <div class="card-photo-wrapper">
        <div class="card-portrait-scanline" aria-hidden="true"></div>
        <img class="card-portrait-img" src="${m.photo}" alt="${m.name} - ${m.role}" loading="lazy" />
        <div class="card-portrait-gradient" aria-hidden="true"></div>
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <div class="card-role-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          ${m.role}
        </div>
        <h3 class="card-name-title">${m.name}</h3>
        <p class="card-mission-text">${m.tagline}</p>

        <div class="card-footer-action">
          <span class="card-campus-code">YOUCODE YOUSSOUFIA</span>
          <button class="btn-inspect-dossier" type="button">
            DOSSIER
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>

    </article>
  `).join('');

  initMemberCardTilt();
}

// --- 5. 3D Perspective Tilt on Member Cards ---
function initMemberCardTilt() {
  const cards = document.querySelectorAll('.member-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -7;
      const rotY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseenter', () => {
      sound.playHoverBlip(720);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// --- 6. Monday ("Nhar Tnin") Countdown Engine ---
function getNextMondayAtNine() {
  const now = new Date();
  const result = new Date(now);
  const day = now.getDay(); // 0 is Sunday, 1 is Monday

  let daysUntilMonday = (1 + 7 - day) % 7;
  if (daysUntilMonday === 0 && now.getHours() >= 9) {
    daysUntilMonday = 7;
  } else if (daysUntilMonday === 0 && now.getHours() < 9) {
    daysUntilMonday = 0;
  }

  result.setDate(now.getDate() + daysUntilMonday);
  result.setHours(9, 0, 0, 0); // 09:00 AM
  return result;
}

function updateCountdown() {
  const target = getNextMondayAtNine();
  const now = new Date();
  const diff = target - now;

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = '00';
    if (hoursEl) hoursEl.textContent = '00';
    if (minsEl) minsEl.textContent = '00';
    if (secsEl) secsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
  if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
}

// --- 7. Bouncing Hamster Modal Logic ---
function openHamsterModal() {
  const modal = document.getElementById('hamster-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    sound.playHamsterShhh();
  }
}

function closeHamsterModal() {
  const modal = document.getElementById('hamster-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- 8. Initialize on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  // A. Start sound wave canvas engine
  const waveEngine = new SoundWaveEngine('soundwave-canvas');

  // B. Render redesigned cybernetic members cards
  renderMemberCards();

  // C. Start countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // D. Bind Hamster secret modal triggers
  const btnSecretHero = document.getElementById('btn-secret-program');
  const btnSecretHeader = document.getElementById('header-secret-cta');
  const iconCloseHamster = document.getElementById('modal-close-icon');
  const hamsterOverlay = document.getElementById('hamster-modal');
  const bouncingHamster = document.getElementById('bouncing-hamster-pic');

  if (btnSecretHero) {
    btnSecretHero.addEventListener('click', () => {
      openHamsterModal();
      waveEngine.emitSonar(window.innerWidth / 2, window.innerHeight / 2, 45);
    });
  }

  if (btnSecretHeader) {
    btnSecretHeader.addEventListener('click', () => {
      openHamsterModal();
      waveEngine.emitSonar(window.innerWidth / 2, window.innerHeight * 0.3, 45);
    });
  }

  if (iconCloseHamster) iconCloseHamster.addEventListener('click', closeHamsterModal);

  if (hamsterOverlay) {
    hamsterOverlay.addEventListener('click', (e) => {
      if (e.target === hamsterOverlay) closeHamsterModal();
    });
  }

  // Interactive Squeak on clicking the bouncing hamster
  if (bouncingHamster) {
    bouncingHamster.addEventListener('click', (e) => {
      sound.playHamsterSqueak();
      waveEngine.emitSonar(e.clientX, e.clientY, 50);
    });
  }

  // ESC key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHamsterModal();
    }
  });
});
