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
    } catch (e) {  }
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
    } catch (e)  { }
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
    } catch (e)  { }
  }

  // Celebratory cyber chime / unlock fanfare when timer hits 0
  playUnlockFanfare() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
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

// --- 3. Complete Bilingual Content Engine (ENG <-> FR) ---
const TRANSLATIONS = {
  en: {
    page_title: "YouPulse",
    page_meta_desc: "YouPulse - The BDE of YouCode. Events & Activities Plan. Connect. Compete. Come Alive.",
    nav_pillars: "Pillars",
    nav_clubs: "Clubs",
    nav_team: "Team",
    header_secret_cta: "SECRET PROGRAMME",
    hero_campus_badge: "YOUPULSE · THE BDE OF YOUCODE",
    hero_motto: "CONNECT. COMPETE. COME ALIVE.",
    hero_headline: `EVENTS & ACTIVITIES <br /><span class="gradient-blue">PLAN 2026 - 2027</span>`,
    hero_subtext: "Annual programme for students and professional partners. The Pulse of YouCode: uniting peer-learning, national hackathons, esports arenas, and student wellbeing.",
    btn_discover_program: "DISCOVER THE PROGRAMME",
    btn_status_day: "POSTPONED // DISCORD",
    btn_four_pillars: "FOUR ENGAGEMENT PILLARS",
    hud_synth_active: "AUDIO-SYNTH ACTIVE //",
    hud_synth_desc: "Move mouse or click to modulate soundwaves",
    pillars_tag: "STRATEGIC OVERVIEW",
    pillars_heading: `FOUR ENGAGEMENT <span>PILLARS</span>`,
    pillars_sub: "Why YouPulse Wanted to Be the BDE. The core foundation driving every event, competition, and student experience.",
    pillar_01_num: "PILLAR 01",
    pillar_01_title: "Integration",
    pillar_01_tagline: "Shared campus experiences.",
    pillar_01_why: "YouPulse puts YouCode on the map, giving it the visibility and standing of any major school on a global scale.",
    pillar_02_num: "PILLAR 02",
    pillar_02_title: "Competitions",
    pillar_02_tagline: "Intense technical hackathons.",
    pillar_02_why: "YouPulse raises the bar, preparing every participant for tougher and newer challenges.",
    pillar_03_num: "PILLAR 03",
    pillar_03_title: "Clubs",
    pillar_03_tagline: "Continuous skills practice.",
    pillar_03_why: "Clubs are the core training ground, with YouPulse and the clubs leading every stage of development.",
    pillar_04_num: "PILLAR 04",
    pillar_04_title: "Professional",
    pillar_04_tagline: "Direct industry networking.",
    pillar_04_why: "YouPulse strengthens YouCode's standing with industry and shows students the support they can count on in any situation.",
    pillar_why_label: "OUR WHY",
    clubs_tag: "CAMPUS LIFE",
    clubs_heading: `STUDENT <span>CLUBS</span>`,
    clubs_sub: "The core training ground where peers practice, build hardware, and launch projects.",
    clubs_col_tech: "Technical",
    club_cyber_name: "Cybersecurity",
    club_cyber_activity: "Local CTFs & ethical hacking",
    club_web_name: "Web",
    club_web_activity: "Architecture workshops & dev sprints",
    club_robotics_name: "Robotics",
    club_robotics_activity: "Hardware building & IoT prototyping",
    club_more_tech: "+ MORE TECH SQUADS",
    clubs_col_culture: "Culture & Community",
    club_art_name: "Art",
    club_art_activity: "Digital challenges & visual crafts",
    club_voluntary_name: "Voluntary",
    club_voluntary_activity: "Blood donation & charity drives",
    club_entrepreneurs_name: "Entrepreneurs",
    club_entrepreneurs_activity: "Idea pitch & startup incubation",
    club_boardgames_name: "Board Games",
    club_boardgames_activity: "Original creation & strategic tournaments",
    club_comm_name: "Communication",
    club_comm_activity: "Campus storytelling, event coverage & digital PR",
    club_more_campus: "+ MORE CAMPUS SQUADS",
    expansion_pill: "EXPANDING SQUAD NETWORK // MACHI GHIR HADI",
    expansion_title: "MORE CLUBS CURRENTLY IN DEPLOYMENT",
    expansion_desc: "This selection is just the starting point. YouPulse supports, incubates, and funds any new student initiative throughout the year.",
    expansion_chip_ai: "AI & Data Science",
    expansion_chip_mobile: "Mobile & Flutter",
    expansion_chip_esports: "E-Sports Arena",
    expansion_chip_chess: "Chess & Strategy",
    expansion_cta_text: "LAUNCH YOUR CLUB WITH YOUPULSE",
    team_tag: "EXECUTIVE BUREAU",
    team_heading: `THE CORE TEAM OF <span>YOUPULSE</span>`,
    team_sub: "The student leaders orchestrating integration, hackathons, clubs, and partnerships across YouCode.",
    card_core_label: "CORE",
    card_campus: "YOUCODE YOUSSOUFIA",
    card_dossier: "DOSSIER",
    welcome_pill: "EXCLUSIVE ACCESS // BDE YOUPULSE",
    welcome_title: `THE PROGRAMME <span class="gradient-blue">2026 - 2027</span>`,
    welcome_desc: "Hackathons, integration, tournaments, and student clubs. Would you like to check it out?",
    welcome_btn_view: "VIEW THE PROGRAMME",
    welcome_btn_skip: "Later, explore the website",
    welcome_footer: "CONFIDENTIAL ACCESS · YOUCODE YOUSSOUFIA",
    hamster_embargo: "LAUNCH POSTPONED // ANNOUNCEMENT ON DISCORD",
    modal_discord_notice: "The official time will be announced on our Discord server",
    modal_btn_see_programme: "POSTPONED // ANNOUNCEMENT ON DISCORD",
    modal_btn_locked_programme: "POSTPONED // ANNOUNCEMENT ON DISCORD",
    count_days: "Days",
    count_hours: "Hours",
    count_mins: "Minutes",
    count_secs: "Seconds",
    footer_motto: "CONNECT. COMPETE. COME ALIVE.",
    footer_credits: "© 2026 YouPulse • The BDE of YouCode • Building a shared ecosystem of integration, competition, and professional growth.",
    footer_sync: "ALL SYSTEMS SYNCHRONIZED // YOUCODE YOUSSOUFIA"
  },
  fr: {
    page_title: "YouPulse",
    page_meta_desc: "YouPulse - Le BDE de YouCode. Plan d'Événements & Activités. Connecter. Concourir. S'épanouir.",
    nav_pillars: "Piliers",
    nav_clubs: "Clubs",
    nav_team: "Équipe",
    header_secret_cta: "PROGRAMME SECRET",
    hero_campus_badge: "YOUPULSE · LE BDE DE YOUCODE",
    hero_motto: "CONNECTER. CONCOURIR. S'ÉPANOUIR.",
    hero_headline: `PLAN D'ÉVÉNEMENTS &amp; ACTIVITÉS <br /><span class="gradient-blue">2026 - 2027</span>`,
    hero_subtext: "Programme annuel pour étudiants et partenaires professionnels. Le pouls de YouCode : unifier peer-learning, hackathons nationaux, arènes esports et bien-être étudiant.",
    btn_discover_program: "DÉCOUVRIR LE PROGRAMME",
    btn_status_day: "REPORTÉ // DISCORD",
    btn_four_pillars: "LES 4 PILIERS D'ENGAGEMENT",
    hud_synth_active: "AUDIO-SYNTH ACTIF //",
    hud_synth_desc: "Bougez la souris ou cliquez pour moduler les ondes",
    pillars_tag: "VISION STRATÉGIQUE",
    pillars_heading: `QUATRE PILIERS <span>D'ENGAGEMENT</span>`,
    pillars_sub: "Pourquoi YouPulse s'engage pour le BDE. La fondation essentielle qui anime chaque événement, challenge et expérience étudiante.",
    pillar_01_num: "PILIER 01",
    pillar_01_title: "Intégration",
    pillar_01_tagline: "Expériences partagées sur le campus.",
    pillar_01_why: "YouPulse positionne YouCode au premier plan, en lui conférant la visibilité et le prestige d'une grande école de renommée.",
    pillar_02_num: "PILIER 02",
    pillar_02_title: "Compétitions",
    pillar_02_tagline: "Hackathons techniques d'intensité.",
    pillar_02_why: "YouPulse place la barre toujours plus haut, en préparant chaque étudiant à relever des défis techniques majeurs.",
    pillar_03_num: "PILIER 03",
    pillar_03_title: "Clubs",
    pillar_03_tagline: "Pratique continue et projets concrets.",
    pillar_03_why: "Les clubs constituent le véritable terrain d'entraînement, YouPulse et les clubs guidant chaque étape d'apprentissage.",
    pillar_04_num: "PILIER 04",
    pillar_04_title: "Professionnel",
    pillar_04_tagline: "Réseautage direct avec l'écosystème tech.",
    pillar_04_why: "YouPulse renforce la crédibilité de YouCode auprès des entreprises et offre aux étudiants un appui indéfectible.",
    pillar_why_label: "NOTRE RAISON D'ÊTRE",
    clubs_tag: "VIE ÉTUDIANTE",
    clubs_heading: `CLUBS <span>ÉTUDIANTS</span>`,
    clubs_sub: "Le terrain de jeu où les pairs s'entraînent, conçoivent du hardware et propulsent leurs projets.",
    clubs_col_tech: "Technique",
    club_cyber_name: "Cybersécurité",
    club_cyber_activity: "CTFs locaux & hacking éthique",
    club_web_name: "Web",
    club_web_activity: "Ateliers d'architecture & sprints de dev",
    club_robotics_name: "Robotique",
    club_robotics_activity: "Conception matérielle & prototypage IoT",
    club_more_tech: "+ D'ÉQUIPES TECHNIQUES",
    clubs_col_culture: "Culture & Communauté",
    club_art_name: "Art & Création",
    club_art_activity: "Défis graphiques & création visuelle",
    club_voluntary_name: "Bénévolat",
    club_voluntary_activity: "Dons du sang & actions solidaires",
    club_entrepreneurs_name: "Entrepreneuriat",
    club_entrepreneurs_activity: "Pitchs d'idées & incubation de startups",
    club_boardgames_name: "Jeux de Stratégie",
    club_boardgames_activity: "Créations originales & tournois stratégiques",
    club_comm_name: "Communication",
    club_comm_activity: "Storytelling du campus, couverture média & RP",
    club_more_campus: "+ D'ÉQUIPES DU CAMPUS",
    expansion_pill: "RÉSEAU EN EXPANSION // MACHI GHIR HADI",
    expansion_title: "PLUS DE CLUBS EN COURS DE DÉPLOIEMENT",
    expansion_desc: "Cette sélection n'est qu'un point de départ. YouPulse soutient, incube et finance toute nouvelle initiative étudiante tout au long de l'année.",
    expansion_chip_ai: "IA & Data Science",
    expansion_chip_mobile: "Mobile & Flutter",
    expansion_chip_esports: "Arène E-Sports",
    expansion_chip_chess: "Échecs & Stratégie",
    expansion_cta_text: "LANCEZ VOTRE CLUB AVEC YOUPULSE",
    team_tag: "BUREAU EXÉCUTIF",
    team_heading: `L'ÉQUIPE FONDATRICE DE <span>YOUPULSE</span>`,
    team_sub: "Les leaders étudiants orchestrant l'intégration, les hackathons, les clubs et les partenariats à YouCode.",
    card_core_label: "CORE",
    card_campus: "YOUCODE YOUSSOUFIA",
    card_dossier: "DOSSIER",
    welcome_pill: "ACCÈS EXCLUSIF // BDE YOUPULSE",
    welcome_title: `LE PROGRAMME <span class="gradient-blue">2026 - 2027</span>`,
    welcome_desc: "Hackathons, intégration, tournois et clubs étudiants. Souhaitez-vous le consulter ?",
    welcome_btn_view: "VOIR LE PROGRAMME",
    welcome_btn_skip: "Plus tard, explorer le site",
    welcome_footer: "ACCÈS CONFIDENTIEL · YOUCODE YOUSSOUFIA",
    hamster_embargo: "LANCEMENT REPORTÉ // ANNONCE SUR LE DISCORD",
    modal_discord_notice: "L'heure officielle sera annoncée sur notre serveur Discord",
    modal_btn_see_programme: "REPORTÉ // ANNONCE SUR DISCORD",
    modal_btn_locked_programme: "REPORTÉ // ANNONCE SUR DISCORD",
    count_days: "Jours",
    count_hours: "Heures",
    count_mins: "Minutes",
    count_secs: "Secondes",
    footer_motto: "CONNECTER. CONCOURIR. S'ÉPANOUIR.",
    footer_credits: "© 2026 YouPulse • Le BDE de YouCode • Bâtir un écosystème partagé d'intégration, de compétition et d'essor professionnel.",
    footer_sync: "TOUS LES SYSTÈMES SYNCHRONISÉS // YOUCODE YOUSSOUFIA"
  }
};

let currentLang = localStorage.getItem('youpulse_lang') || 'en';

// --- 4. The Official Members Dataset (9 Cores of YouPulse - Zero Emojis) ---
const MEMBERS_DATA = [
  {
    id: 'adam',
    number: '07',
    callsign: 'NEXUS',
    name: 'Adam Aarboubaa',
    role: {
      en: 'President',
      fr: 'Président'
    },
    photo: 'assets/images/adam.png',
    tagline: {
      en: 'Instilling an ambitious vision, uniting YouCode talents, and transforming our ideas into real impact.',
      fr: 'Insuffler une vision ambitieuse, fédérer les talents de YouCode et transformer nos idées en impact réel.'
    }
  },
  {
    id: 'otmane',
    number: '05',
    callsign: 'PRISM',
    name: 'Otman Mellouki',
    role: {
      en: 'General Secretary',
      fr: 'Secrétaire Général'
    },
    photo: 'assets/images/otmane.png',
    tagline: {
      en: 'Ensuring administrative rigor, streamlining internal coordination, and structuring every BDE action.',
      fr: 'Assurer la rigueur administrative, fluidifier la coordination interne et structurer chaque action du BDE.'
    }
  },
  {
    id: 'oumaima',
    number: '06',
    callsign: 'PULSE',
    name: 'Oumaima Boushama',
    role: {
      en: 'Vice President',
      fr: 'Vice-Présidente'
    },
    photo: 'assets/images/oumaima.jpg',
    tagline: {
      en: 'Co-steering the YouPulse vision, listening to every cohort, and guaranteeing team synergy.',
      fr: 'Co-piloter la vision YouPulse, être à l’écoute de chaque promo et garantir la cohésion de l’équipe.'
    }
  },
  {
    id: 'kadiri-mohammed',
    number: '01',
    callsign: 'LEAD',
    name: 'Mohamed Kadiri',
    role: {
      en: 'Head of Communication',
      fr: 'Responsable Communication'
    },
    photo: 'assets/images/kadiri.jpg',
    tagline: {
      en: 'Carrying the voice of YouPulse, connecting students, and amplifying every initiative across campus.',
      fr: 'Porter la voix de YouPulse, connecter les étudiants et faire résonner chaque initiative sur tout le campus.'
    }
  },
  {
    id: 'fatima',
    number: '02',
    callsign: 'FLUX',
    name: 'Fatima Id Ali',
    role: {
      en: 'Head of Clubs',
      fr: 'Responsable Clubs'
    },
    photo: 'assets/images/fatima.jpg',
    tagline: {
      en: 'Uniting passions, mentoring every student club, and fostering an active, innovative community.',
      fr: 'Fédérer les passions, accompagner chaque club étudiant et créer une communauté active et innovante.'
    }
  },
  {
    id: 'anas',
    number: '03',
    callsign: 'CIPHER',
    name: 'Anas Boutbagha',
    role: {
      en: 'Head of Events',
      fr: 'Responsable Événements'
    },
    photo: 'assets/images/anas.jpg',
    tagline: {
      en: 'Designing intense hackathons, electrifying competitions, and unforgettable student highlights.',
      fr: 'Concevoir des hackathons intenses, des compétitions stimulantes et des temps forts inoubliables.'
    }
  },
  {
    id: 'hiba',
    number: '04',
    callsign: 'ECHO',
    name: 'Hiba Zakif',
    role: {
      en: 'Head of Media',
      fr: 'Responsable Média'
    },
    photo: 'assets/images/hiba.png',
    tagline: {
      en: 'Capturing campus energy, producing striking visuals, and spotlighting YouCode achievements.',
      fr: 'Capturer l’énergie du campus, produire des visuels percutants et valoriser les réussites de YouCode.'
    }
  },
  {
    id: 'achraf',
    number: '08',
    callsign: 'BLAZE',
    name: 'Achraf Abdelhakim Es-saloua',
    role: {
      en: 'Head of Events',
      fr: 'Responsable Événements'
    },
    photo: 'assets/images/achraf.jpg',
    tagline: {
      en: 'Energizing student life with thrilling challenges, responsive production, and an electric atmosphere.',
      fr: 'Dynamiser la vie étudiante par des challenges stimulants, une régie réactive et une ambiance unique.'
    }
  },
  {
    id: 'redouane',
    number: '09',
    callsign: 'VOLT',
    name: 'Ridouane El Habib',
    role: {
      en: 'Treasurer',
      fr: 'Trésorier'
    },
    photo: 'assets/images/redouane.jpg',
    tagline: {
      en: 'Rigorous financial management, full transparency, and budget optimization to fund our ambitions.',
      fr: 'Gestion financière rigoureuse, transparence totale et optimisation des budgets pour financer nos ambitions.'
    }
  }
];

// --- 5. Render Redesigned Cybernetic Cards (Bilingual) ---
function renderMemberCards(lang = currentLang) {
  const container = document.getElementById('members-grid');
  if (!container) return;

  const campusText = TRANSLATIONS[lang]?.card_campus || 'YOUCODE YOUSSOUFIA';
  const dossierText = TRANSLATIONS[lang]?.card_dossier || 'DOSSIER';
  const coreLabel = TRANSLATIONS[lang]?.card_core_label || 'CORE';

  container.innerHTML = MEMBERS_DATA.map(m => {
    const role = typeof m.role === 'object' ? (m.role[lang] || m.role.en) : m.role;
    const tagline = typeof m.tagline === 'object' ? (m.tagline[lang] || m.tagline.en) : m.tagline;
    const ariaLabel = lang === 'fr' ? `Voir le profil de ${m.name}` : `View profile of ${m.name}`;

    return `
    <article class="member-card" data-id="${m.id}" tabindex="0" role="button" aria-label="${ariaLabel}">
      
      <!-- Tech Corner Accents [ + ] -->
      <div class="card-tech-corners" aria-hidden="true"></div>

      <!-- Card Top Meta Bar -->
      <div class="card-meta-bar">
        <span class="card-callsign-tag">
          <span class="tag-dot"></span>
          ${coreLabel} #${m.number} // ${m.callsign}
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
        <img class="card-portrait-img" src="${m.photo}" alt="${m.name} - ${role}" loading="lazy" />
        <div class="card-portrait-gradient" aria-hidden="true"></div>
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <div class="card-role-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          ${role}
        </div>
        <h3 class="card-name-title">${m.name}</h3>
        <p class="card-mission-text">${tagline}</p>

        <div class="card-footer-action">
          <span class="card-campus-code">${campusText}</span>
          <button class="btn-inspect-dossier" type="button" aria-label="${dossierText} ${m.name}">
            ${dossierText}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>

    </article>
    `;
  }).join('');

  initMemberCardTilt();
}

// --- 6. Language Switcher Engine (ENG <-> FR) ---
function setLanguage(lang, playAudio = false) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('youpulse_lang', lang);
  document.documentElement.lang = lang;

  // 1. Update Document Title & Meta Description
  if (TRANSLATIONS[lang].page_title) {
    document.title = TRANSLATIONS[lang].page_title;
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && TRANSLATIONS[lang].page_meta_desc) {
    metaDesc.setAttribute('content', TRANSLATIONS[lang].page_meta_desc);
  }

  // 2. Update Header Language Switch Button State
  const langBtn = document.getElementById('lang-switch-btn');
  if (langBtn) {
    langBtn.setAttribute('data-current-lang', lang);
    const badges = langBtn.querySelectorAll('.lang-badge');
    badges.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  // 3. Update all plain text elements with [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang][key] !== undefined) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });

  // 4. Update all HTML-formatted elements with [data-i18n-html]
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (TRANSLATIONS[lang][key] !== undefined) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  // 5. Re-render Member Cards with the selected language
  renderMemberCards(lang);

  // 6. Smooth Subtle Micro-Fade Transition across Main Content
  const animatedSections = document.querySelectorAll('.hero-wrap, .pillars-section, .clubs-section, .members-section');
  animatedSections.forEach(section => {
    section.classList.remove('lang-fade-transition');
    void section.offsetWidth; // trigger reflow for smooth re-trigger
    section.classList.add('lang-fade-transition');
  });

  if (playAudio) {
    sound.playHoverBlip(lang === 'en' ? 700 : 860);
  }
}

function initLanguageSwitcher() {
  const langBtn = document.getElementById('lang-switch-btn');
  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      const clickedBadge = e.target.closest('.lang-badge');
      let targetLang;
      if (clickedBadge) {
        targetLang = clickedBadge.getAttribute('data-lang');
      } else {
        targetLang = currentLang === 'en' ? 'fr' : 'en';
      }

      if (targetLang && targetLang !== currentLang) {
        setLanguage(targetLang, true);
      } else {
        // Toggle if user clicks anywhere on the button
        const nextLang = currentLang === 'en' ? 'fr' : 'en';
        setLanguage(nextLang, true);
      }
    });
  }

  // Apply initially active language
  setLanguage(currentLang, false);
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

// --- 6. Tomorrow 14:00 ("Ghda m3a 14:00") Countdown Engine ---
function getProgrammeTargetDate() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('test_sec')) {
    const sec = parseInt(urlParams.get('test_sec'), 10) || 10;
    const key = 'youpulse_test_target_sec_' + sec;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, String(Date.now() + sec * 1000));
    }
    return new Date(parseInt(sessionStorage.getItem(key), 10));
  }
  if (urlParams.has('unlock')) {
    return new Date(Date.now() - 5000);
  }
  if (urlParams.has('locked')) {
    return new Date(Date.now() + 3600000);
  }

  // Official Launch Target: Friday 16 October 2026 at 14:00:00 (Ghda m3a 14:00)
  return new Date(2026, 9, 16, 16, 0, 0);
}

let __hasCelebratedUnlock = false;

function updateCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');
  const embargoEl = document.querySelector('.time-embargo-label');
  const statusPills = document.querySelectorAll('[data-i18n="btn_status_day"]');
  const btnUnlockedProg = document.getElementById('btn-unlocked-programme');
  const navProgLink = document.querySelector('.nav-link-programme');

  // Freeze countdown digits on standby
  if (daysEl) daysEl.textContent = '--';
  if (hoursEl) hoursEl.textContent = '--';
  if (minsEl) minsEl.textContent = '--';
  if (secsEl) secsEl.textContent = '--';

  if (embargoEl) {
    embargoEl.textContent = currentLang === 'fr' 
      ? 'LANCEMENT REPORTÉ // ANNONCE SUR LE DISCORD' 
      : 'LAUNCH POSTPONED // ANNOUNCEMENT ON DISCORD';
    embargoEl.classList.remove('embargo-unlocked');
  }

  statusPills.forEach(p => {
    p.textContent = currentLang === 'fr' ? 'REPORTÉ // DISCORD' : 'POSTPONED // DISCORD';
    p.classList.remove('pill-unlocked');
  });

  if (btnUnlockedProg) {
    btnUnlockedProg.classList.add('is-locked-cta');
    btnUnlockedProg.classList.remove('is-unlocked-cta');
    const textSpan = btnUnlockedProg.querySelector('[data-i18n="modal_btn_see_programme"]') || btnUnlockedProg.querySelector('span:not(.btn-laser-glow):not(.btn-laser-content)');
    if (textSpan) {
      textSpan.textContent = currentLang === 'fr' 
        ? 'REPORTÉ // ANNONCE SUR DISCORD' 
        : 'POSTPONED // ANNOUNCEMENT ON DISCORD';
    }
  }

  if (navProgLink) {
    navProgLink.classList.add('is-nav-locked');
    navProgLink.classList.remove('is-nav-unlocked');
    navProgLink.setAttribute('title', currentLang === 'fr' 
      ? 'Programme Reporté // Annonce sur Discord' 
      : 'Programme Postponed // Announcement on Discord');
  }
}

// --- 7. Modal Handlers (Welcome Teaser & Bouncing Hamster) ---
function openWelcomeModal() {
  const modal = document.getElementById('welcome-teaser-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    sound.playHoverBlip(520);
  }
}

function closeWelcomeModal() {
  const modal = document.getElementById('welcome-teaser-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

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

  // B. Initialize Bilingual Language Switcher (applies saved/default language and renders cards)
  initLanguageSwitcher();

  // C. Start countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // D. Welcome Teaser Modal Elements
  const welcomeOverlay = document.getElementById('welcome-teaser-modal');
  const btnWelcomeView = document.getElementById('btn-welcome-view');
  const btnWelcomeSkip = document.getElementById('btn-welcome-skip');
  const btnWelcomeClose = document.getElementById('welcome-close-btn');

  // When user clicks "VOIR LE PROGRAMME" in the first-visit popup:
  if (btnWelcomeView) {
    btnWelcomeView.addEventListener('click', () => {
      const target = getProgrammeTargetDate();
      if (target - new Date() > 0) {
        closeWelcomeModal();
        sessionStorage.setItem('youpulse_welcome_seen', 'true');
        setTimeout(() => {
          openHamsterModal();
          waveEngine.emitSonar(window.innerWidth / 2, window.innerHeight / 2, 55);
        }, 180);
      } else {
        // Unlocked! Navigate straight to programme
        window.location.href = 'programme.html';
      }
    });
  }

  if (btnWelcomeSkip) {
    btnWelcomeSkip.addEventListener('click', () => {
      closeWelcomeModal();
      sessionStorage.setItem('youpulse_welcome_seen', 'true');
    });
  }

  if (btnWelcomeClose) {
    btnWelcomeClose.addEventListener('click', () => {
      closeWelcomeModal();
      sessionStorage.setItem('youpulse_welcome_seen', 'true');
    });
  }

  if (welcomeOverlay) {
    welcomeOverlay.addEventListener('click', (e) => {
      if (e.target === welcomeOverlay) {
        closeWelcomeModal();
        sessionStorage.setItem('youpulse_welcome_seen', 'true');
      }
    });
  }

  // Auto trigger the welcome "Voir Programme" popup on first visit after 900ms
  if (!sessionStorage.getItem('youpulse_welcome_seen')) {
    setTimeout(() => {
      openWelcomeModal();
    }, 900);
  }

  // E. Bind Hamster secret modal triggers
  const btnSecretHero = document.getElementById('btn-secret-program');
  const btnSecretHeader = document.getElementById('header-secret-cta');
  const iconCloseHamster = document.getElementById('modal-close-icon');
  const hamsterOverlay = document.getElementById('hamster-modal');
  const bouncingHamster = document.getElementById('bouncing-hamster-pic');
  const btnUnlockedProg = document.getElementById('btn-unlocked-programme');
  const navProgLink = document.querySelector('.nav-link-programme');

  // Nav link "Programme" click guard
  if (navProgLink) {
    navProgLink.addEventListener('click', (e) => {
      e.preventDefault();
      openHamsterModal();
      if (waveEngine && typeof waveEngine.emitSonar === 'function') {
        waveEngine.emitSonar(window.innerWidth / 2, window.innerHeight * 0.3, 45);
      }
    });
  }

  // Modal Programme CTA button click guard
  if (btnUnlockedProg) {
    btnUnlockedProg.addEventListener('click', (e) => {
      e.preventDefault();
      sound.playHamsterSqueak();
      if (waveEngine && typeof waveEngine.emitSonar === 'function') {
        waveEngine.emitSonar(e.clientX, e.clientY, 40);
      }
      const countdownGrid = document.querySelector('.countdown-digits-grid');
      if (countdownGrid) {
        countdownGrid.classList.remove('lock-shake');
        void countdownGrid.offsetWidth;
        countdownGrid.classList.add('lock-shake');
      }
    });
  }

  if (btnSecretHero) {
    btnSecretHero.addEventListener('click', () => {
      openHamsterModal();
      if (waveEngine && typeof waveEngine.emitSonar === 'function') {
        waveEngine.emitSonar(window.innerWidth / 2, window.innerHeight / 2, 45);
      }
    });
  }

  if (btnSecretHeader) {
    btnSecretHeader.addEventListener('click', () => {
      openHamsterModal();
      if (waveEngine && typeof waveEngine.emitSonar === 'function') {
        waveEngine.emitSonar(window.innerWidth / 2, window.innerHeight * 0.3, 45);
      }
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

  // ESC key closes any open modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeWelcomeModal();
      closeHamsterModal();
    }
  });
});
