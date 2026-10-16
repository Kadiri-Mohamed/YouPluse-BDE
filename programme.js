/**
 * YOUPULSE // BDE YOUCODE YOUSSOUFIA
 * Official Programme Engine 2026 - 2027
 * Bilingual (ENG <-> FR), Interactive Filter, Web Audio FX & Dynamic Visuals
 */

// --- 1. Sound Synthesis Engine ---
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

  playHoverBlip(freq = 600) {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Interactive Squeak on clicking the bouncing hamster
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

// --- 2. Canvas Background Audio Synth Engine ---
class SoundWaveEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.sonars = [];
    this.particles = [];
    this.time = 0;
    this.width = window.innerWidth || 1200;
    this.height = window.innerHeight || 800;

    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;
    this.resize();

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      speed: 0,
      active: false
    };

    this.waveLayers = 8;
    this.eqBars = 40;

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
    // More numerous cosmic particles (120 to 150 on desktop)
    const count = Math.min(Math.floor(this.width / 11), 140);
    
    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      let radius, baseAlpha, isGlowing, color;

      if (typeRand < 0.6) {
        // Small cosmic distant stars (60%)
        radius = Math.random() * 1.3 + 0.9;
        baseAlpha = Math.random() * 0.35 + 0.55; // 0.55 - 0.90 bright
        isGlowing = false;
        color = Math.random() > 0.4 ? '#ffffff' : '#38bdf8';
      } else if (typeRand < 0.88) {
        // Medium floating space particles (28%)
        radius = Math.random() * 1.4 + 1.8;
        baseAlpha = Math.random() * 0.25 + 0.75; // 0.75 - 1.0
        isGlowing = Math.random() > 0.4;
        color = Math.random() > 0.5 ? '#00d2ff' : '#60a5fa';
      } else {
        // Luminous glowing cosmic nodes (12%)
        radius = Math.random() * 1.5 + 2.6;
        baseAlpha = 0.95;
        isGlowing = true;
        color = '#00d2ff';
      }

      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        // Zero-G drift velocities (slow, floating, graceful)
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius,
        baseAlpha,
        alpha: baseAlpha,
        color,
        isGlowing,
        // Zero-gravity space floating wave params ("kay3omo f fada2")
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.008,
        wobbleAmpX: Math.random() * 0.6 + 0.3,
        wobbleAmpY: Math.random() * 0.6 + 0.3,
        // Twinkle / Pulse
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    window.addEventListener('click', (e) => {
      this.emitSonar(e.clientX, e.clientY, 35);
    });
  }

  emitSonar(x, y, power = 25) {
    if (!this.sonars) this.sonars = [];
    this.sonars.push({
      x,
      y,
      radius: 4,
      maxRadius: Math.min(this.width, this.height) * 0.5,
      alpha: 0.85,
      speed: 6 + power * 0.18
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.time += 0.015;

    // 0. Sonar Wave Rings
    if (this.sonars) {
      for (let i = this.sonars.length - 1; i >= 0; i--) {
        const s = this.sonars[i];
        s.radius += s.speed;
        s.alpha = Math.max(0, 1 - s.radius / s.maxRadius);

        if (s.alpha <= 0) {
          this.sonars.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 210, 255, ${s.alpha * 0.45})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

    // 1. Faint cosmic constellation links between nearby floating stars
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < len; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 75) {
          const lineAlpha = (1 - dist / 75) * 0.22 * Math.min(p1.alpha, p2.alpha);
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }
    }

    // 2. Render each floating particle with zero-G drift & twinkling
    for (let p of this.particles) {
      // Zero-G undulating orbital drift ("kay3omo f fada2")
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.cos(p.wobble) * p.wobbleAmpX;
      p.y += p.vy + Math.sin(p.wobble * 0.85) * p.wobbleAmpY;

      // Mouse interactive micro-gravity deflection
      if (this.mouse.active) {
        const mdx = this.mouse.x - p.x;
        const mdy = this.mouse.y - p.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 140) {
          const repel = (1 - mDist / 140) * 1.2;
          p.x -= (mdx / mDist) * repel;
          p.y -= (mdy / mDist) * repel;
        }
      }

      // Smooth wrap around edges
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      // Twinkle & Pulsate brightness ("soto3")
      p.alpha = Math.max(0.35, Math.min(1, p.baseAlpha + Math.sin(this.time * 2 + p.pulsePhase) * 0.25));

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      // Luminous glow for larger or glowing particles
      if (p.isGlowing) {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00d2ff';
      }

      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.render());
  }
}

// --- 3. Complete Bilingual Content Dictionary for Programme (ENG <-> FR) ---
const TRANSLATIONS = {
  en: {
    page_title: "YouPulse // Official Programme 2026 - 2027",
    nav_home: "Back to Home",
    nav_masterplan: "Master Plan",
    nav_integration: "Integration",
    nav_competitions: "Competitions",
    nav_industry: "Industry Connect",
    nav_culture: "Well-being & Culture",
    hero_badge: "OFFICIAL PROGRAMME 2026 - 2027 // THE PULSE OF YOUCODE",
    hero_title: `EVENTS & ACTIVITIES <br /><span class="gradient-blue">THE MASTER PLAN</span>`,
    hero_desc: "The comprehensive roadmap of YouPulse. Uniting integration rituals, national hackathons with 1337 and ESAFE, startup engineering pipelines, and student well-being.",
    stat_events_num: "12+",
    stat_events_lbl: "Official Events & Challenges",
    stat_hackathons_num: "02",
    stat_hackathons_lbl: "National Hackathons",
    stat_alliances_num: "1337 & ESAFE",
    stat_alliances_lbl: "Nationwide Partnerships",
    stat_spirit_num: "100%",
    stat_spirit_lbl: "Student-Led Experience",

    filter_all: "All Tracks",
    filter_masterplan: "Master Plan",
    filter_integration: "Integration",
    filter_competitions: "Competitions",
    filter_industry: "Industry Connect",
    filter_culture: "Culture & Fun",

    // Master Plan Section
    mp_tag: "YEARLY OVERVIEW",
    mp_heading: `THE MASTER <span>PLAN</span>`,
    mp_sub: "Consolidated timeline and status of all major operations across 2026 - 2027.",
    th_category: "Category",
    th_events: "Highlighted Events",
    th_status: "Status",
    status_confirmed: "Confirmed",
    status_scheduled: "Scheduled",
    status_ongoing: "Ongoing (+ More)",
    status_secret: "Top Secret",

    // Track 1: Integration
    int_tag: "OCTOBER 31ST // INTEGRATION RITUAL",
    int_heading: `HALLOWEEN <span>INTEGRATION DAY</span>`,
    int_sub: "Shared campus experiences, adrenaline-filled team challenges, spooky catering, and collective art.",
    games_title: "Themed Games",
    g1_title: "Zombie Tag",
    g1_desc: "Survive the horde through agility and team coordination.",
    g2_title: "Mummy Relay",
    g2_desc: "Paper-wrapped high-speed sprint across campus.",
    g3_title: "Toxic Waste",
    g3_desc: "High-tension bungee ring container transport.",
    g4_title: "Blind Box",
    g4_desc: "Sensory texture and object identification blindfolded.",
    g5_title: "Blood Bank",
    g5_desc: "Sponge water transfer endurance race.",
    g6_title: "Vampire's Shadow",
    g6_desc: "Eerie, high-stakes Red Light, Green Light challenge.",
    g7_title: "Werewolf Village",
    g7_desc: "Immersive Halloween-themed psychological village game.",

    catering_title: "Halloween Catering",
    c1_title: "Bloody Pasta",
    c1_desc: "Tomato sauce eyeballs special.",
    c2_title: "Mummy Merguez",
    c2_desc: "Pastry-wrapped savory sausages.",
    c3_title: "Witch's Brew",
    c3_desc: "Bulk spicy pumpkin soup cauldron.",
    c4_title: "Graveyard Cups",
    c4_desc: "Chocolate dirt mousse dessert.",
    c5_title: "Bloody Milk or Mojitos",
    c5_desc: "Choose your spooky signature drink.",

    format_title: "Game Format",
    format_modes_title: "Two Modes",
    format_modes_desc: "Squad | Solo competition tiers.",
    format_teams_title: "Balanced Teams",
    format_teams_desc: "A local formula divides students equally across the houses.",

    portrait_tag: "INTEGRATION ACTIVITY",
    portrait_title: `COLLECTIVE <span>PORTRAIT</span>`,
    portrait_desc: "Students leave painted handmarks on a massive campus canvas. One monumental shared memory marking the start of our collective journey.",

    // Track 2: Competitions
    comp_tag: "ELITE HACKATHONS & ARENAS",
    comp_heading: `FLAGSHIP <span>COMPETITIONS</span>`,
    comp_sub: "Raising the bar with intense technical challenges, national alliances, and real production.",

    clubfight_tag: "COMPETITION",
    clubfight_title: "Club Fight Day",
    clubfight_desc: "A head-to-head battle between campus clubs. The exact challenges remain strictly classified for now.",
    clubfight_status: "STRICTLY CLASSIFIED",

    gamejam_tag: "COMPETITION // THE ALLIANCE",
    gamejam_title: "National Game Jam",
    gamejam_alliance: "1337 × YouCode",
    gamejam_alliance_desc: "Joint nationwide participation uniting Moroccan developer talent.",
    gamejam_qualifier_lbl: "Qualifier",
    gamejam_qualifier_val: "Game Dev Hackathon",
    gamejam_loc_lbl: "Location",
    gamejam_loc_val: "Benguerir Campus",
    gamejam_out_lbl: "Output",
    gamejam_out_val: "Fully Playable Game",

    hackathon_tag: "SUSTAINABILITY FOCUS",
    hackathon_title: "Web Hackathon: Smart Agriculture",
    hackathon_sprint_num: "72",
    hackathon_sprint_lbl: "HOUR SPRINT",
    hackathon_mvp_num: "1",
    hackathon_mvp_lbl: "WORKING MVP",
    hack_esafe_title: "ESAFE",
    hack_esafe_desc: "Agricultural validation & agronomy science.",
    hack_1337_title: "1337",
    hack_1337_desc: "Algorithmic engineering & systems logic.",
    hack_youcode_title: "YouCode",
    hack_youcode_desc: "Product prototyping, full-stack dev & UI/UX.",

    // Track 3: Industry Network
    ind_tag: "INDUSTRY NETWORK",
    ind_heading: `STARTUP & COMPANY <span>CONNECT</span>`,
    ind_sub: "A 3-phase pipeline bridging student talent with founders, live production code, and internships.",
    phase_first: "First",
    phase_pitch_title: "The Pitch",
    phase_pitch_desc: "Founders demo production architecture and assign a real operational challenge to student teams.",
    phase_second: "Second",
    phase_build_title: "The Build",
    phase_build_desc: "YouPulse facilitates dedicated offline engineering of diverse, robust software solutions.",
    phase_third: "Third",
    phase_handover_title: "The Handover",
    phase_handover_desc: "Curated solutions pitched back to executives to secure internships and PFE graduation projects.",

    // Track 4: Culture & Well-being
    cult_tag: "CULTURE & COMMUNITY",
    cult_heading: `WELL-BEING & <span>EXPERIENCES</span>`,
    cult_sub: "Recharging minds, celebrating Moroccan heritage, and nurturing an inclusive student family.",
    exp1_title: "Moroccan Traditional Night",
    exp1_desc: "Wedding-inspired festive evening with mint tea, traditional cuisine, and authentic dancing.",
    exp2_title: "March 8th Women's Day",
    exp2_desc: "Dedicated celebration empowering and honoring the women developers and leaders of YouCode.",
    exp3_title: "Pijama Night (Women Only)",
    exp3_desc: "A relaxed, cozy evening dedicated to bonding, movies, board games, and unwinding from code.",
    exp4_title: "Unprofessional Day",
    exp4_desc: "Reverse-corporate stress relief where students and staff rock wacky, humorous, informal outfits.",

    // Finale Manifesto
    mani_title: `STUDENT PARTICIPATION. <br /><span class="gradient-blue">AT THE CENTRE.</span>`,
    mani_desc: "Building a shared ecosystem of integration, competition, and professional growth. The Pulse of YouCode: Connect. Compete. Come Alive.",
    mani_cta_home: "EXPLORE FULL CAMPUS",
    mani_cta_bde: "YOUPULSE 2026 - 2027",

    footer_credits: "© 2026 YouPulse • The BDE of YouCode • Official Events & Activities Plan.",
    footer_sync: "ALL SYSTEMS SYNCHRONIZED // YOUCODE YOUSSOUFIA",

    // Lock screen translations (Postponed / Discord Announcement)
    lock_badge_status: "LAUNCH POSTPONED // ANNOUNCEMENT ON DISCORD",
    lock_headline: `THE PROGRAMME LAUNCH <br /><span class="gradient-blue">HAS BEEN POSTPONED</span>`,
    lock_subtext: "The official release has been temporarily suspended. The official time will be announced live on our Discord server.",
    lock_hamster_tag: "POSTPONED // ANNOUNCEMENT ON DISCORD",
    lock_discord_tag: "OFFICIAL CHANNEL // DISCORD",
    lock_discord_title: "THE OFFICIAL TIME WILL BE ANNOUNCED ON OUR DISCORD SERVER",
    lock_discord_sub: "The countdown is suspended. Head over to our Discord server to follow the live announcement.",
    lock_standby_label: "COUNTDOWN SUSPENDED // AWAITING ANNOUNCEMENT",
    lock_btn_home: "Back to Home Page",
    lock_system_tag: "STATUS: POSTPONED • OFFICIAL TIME WILL BE ANNOUNCED ON OUR DISCORD SERVER",
    count_days: "Days",
    count_hours: "Hours",
    count_mins: "Minutes",
    count_secs: "Seconds"
  },

  fr: {
    page_title: "YouPulse // Programme Officiel 2026 - 2027",
    nav_home: "Retour à l'Accueil",
    nav_masterplan: "Master Plan",
    nav_integration: "Intégration",
    nav_competitions: "Compétitions",
    nav_industry: "Réseau Pro",
    nav_culture: "Bien-être & Fun",
    hero_badge: "PROGRAMME OFFICIEL 2026 - 2027 // LE POULS DE YOUCODE",
    hero_title: `ÉVÉNEMENTS & ACTIVITÉS <br /><span class="gradient-blue">LE MASTER PLAN</span>`,
    hero_desc: "La feuille de route complète de YouPulse. Rassembler rituels d'intégration, hackathons nationaux avec 1337 et l'ESAFE, connexions startups et bien-être étudiant.",
    stat_events_num: "12+",
    stat_events_lbl: "Événements & Défis Officiels",
    stat_hackathons_num: "02",
    stat_hackathons_lbl: "Hackathons Nationaux",
    stat_alliances_num: "1337 & ESAFE",
    stat_alliances_lbl: "Partenariats Nationaux",
    stat_spirit_num: "100%",
    stat_spirit_lbl: "Expérience 100% Étudiante",

    filter_all: "Tout le Programme",
    filter_masterplan: "Master Plan",
    filter_integration: "Intégration",
    filter_competitions: "Compétitions",
    filter_industry: "Réseau Entreprises",
    filter_culture: "Culture & Fun",

    // Master Plan Section
    mp_tag: "VISION ANNUELLE",
    mp_heading: `LE MASTER <span>PLAN</span>`,
    mp_sub: "Calendrier consolidé et statuts de déploiement de toutes les opérations majeures 2026 - 2027.",
    th_category: "Catégorie",
    th_events: "Événements Phares",
    th_status: "Statut",
    status_confirmed: "Confirmé",
    status_scheduled: "Planifié",
    status_ongoing: "En cours (+ Plus)",
    status_secret: "Top Secret",

    // Track 1: Integration
    int_tag: "31 OCTOBRE // RITUEL D'INTÉGRATION",
    int_heading: `JOURNÉE D'INTÉGRATION <span>HALLOWEEN</span>`,
    int_sub: "Expériences partagées, défis collectifs riches en adrénaline, traiteur effrayant et œuvre artistique collective.",
    games_title: "Jeux Thématiques",
    g1_title: "Zombie Tag",
    g1_desc: "Survivez à la horde grâce à votre agilité et coordination.",
    g2_title: "Mummy Relay",
    g2_desc: "Sprint effréné emmailloté dans du papier sur tout le campus.",
    g3_title: "Toxic Waste",
    g3_desc: "Transport sous haute tension d'un container avec élastiques.",
    g4_title: "Blind Box",
    g4_desc: "Identification tactile et sensorielle d'objets à l'aveugle.",
    g5_title: "Blood Bank",
    g5_desc: "Course d'endurance de transfert d'eau à l'éponge.",
    g6_title: "Vampire's Shadow",
    g6_desc: "Le terrifiant Un, Deux, Trois, Soleil version nocturne.",
    g7_title: "Werewolf Village",
    g7_desc: "Partie de Loup-Garou immersive au cœur du village hanté.",

    catering_title: "Traiteur Halloween",
    c1_title: "Pâtes Sanglantes",
    c1_desc: "Sauce tomate et faux yeux pour une dégustation immersive.",
    c2_title: "Merguez Momie",
    c2_desc: "Saucisses croustillantes enroulées de pâte dorée.",
    c3_title: "Potion de Sorcière",
    c3_desc: "Soupe de potiron onctueuse servie au chaudron.",
    c4_title: "Coupes du Cimetière",
    c4_desc: "Mousse chocolat et crumble façon terre meuble.",
    c5_title: "Lait Sanglant ou Mojitos",
    c5_desc: "Choisissez votre cocktail signature rafraîchissant.",

    format_title: "Format des Épreuves",
    format_modes_title: "Deux Modes",
    format_modes_desc: "Épreuves en escouades | Défis solo.",
    format_teams_title: "Équipes Équilibrées",
    format_teams_desc: "Un algorithme équilibre harmonieusement les étudiants entre factions.",

    portrait_tag: "ACTIVITÉ D'INTÉGRATION",
    portrait_title: `PORTRAIT <span>COLLECTIF</span>`,
    portrait_desc: "Chaque étudiant appose l'empreinte peinte de sa main sur une fresque monumentale. Une mémoire collective partagée qui immortalisera notre promotion.",

    // Track 2: Competitions
    comp_tag: "HACKATHONS D'ÉLITE & ARÈNES",
    comp_heading: `COMPÉTITIONS <span>PHARES</span>`,
    comp_sub: "Placer la barre plus haut avec des hackathons intenses, des alliances nationales et du vrai code de production.",

    clubfight_tag: "COMPÉTITION",
    clubfight_title: "Club Fight Day",
    clubfight_desc: "Affrontement direct entre les clubs du campus. Les épreuves exactes restent strictement classifiées pour le moment.",
    clubfight_status: "STRICTEMENT CLASSIFIÉ",

    gamejam_tag: "COMPÉTITION // L'ALLIANCE",
    gamejam_title: "National Game Jam",
    gamejam_alliance: "1337 × YouCode",
    gamejam_alliance_desc: "Participation nationale conjointe unissant les meilleurs talents du code au Maroc.",
    gamejam_qualifier_lbl: "Épreuve",
    gamejam_qualifier_val: "Hackathon Game Dev",
    gamejam_loc_lbl: "Lieu",
    gamejam_loc_val: "Campus Benguerir",
    gamejam_out_lbl: "Livrable",
    gamejam_out_val: "Jeu 100% Jouable",

    hackathon_tag: "FOCUS DURABILITÉ",
    hackathon_title: "Web Hackathon: Smart Agriculture",
    hackathon_sprint_num: "72",
    hackathon_sprint_lbl: "HEURES DE SPRINT",
    hackathon_mvp_num: "1",
    hackathon_mvp_lbl: "MVP OPÉRATIONNEL",
    hack_esafe_title: "ESAFE",
    hack_esafe_desc: "Validation agronomique & recherche scientifique.",
    hack_1337_title: "1337",
    hack_1337_desc: "Ingénierie algorithmique & logique système.",
    hack_youcode_title: "YouCode",
    hack_youcode_desc: "Prototypage produit, développement web & UI/UX.",

    // Track 3: Industry Network
    ind_tag: "RÉSEAU ENTREPRISES",
    ind_heading: `STARTUP & COMPANY <span>CONNECT</span>`,
    ind_sub: "Un parcours en 3 phases reliant directement les compétences des étudiants aux fondateurs et recruteurs tech.",
    phase_first: "1ère Phase",
    phase_pitch_title: "Le Pitch",
    phase_pitch_desc: "Les fondateurs présentent leur architecture et confient un vrai défi opérationnel aux étudiants.",
    phase_second: "2ème Phase",
    phase_build_title: "Le Build",
    phase_build_desc: "YouPulse encadre et met à disposition les ressources pour développer des solutions robustes.",
    phase_third: "3ème Phase",
    phase_handover_title: "La Restitution",
    phase_handover_desc: "Pitch final devant les directions d'entreprise pour décrocher stages rémunérés et projets de fin d'études (PFE).",

    // Track 4: Culture & Well-being
    cult_tag: "CULTURE & COMMUNAUTÉ",
    cult_heading: `BIEN-ÊTRE & <span>EXPÉRIENCES</span>`,
    cult_sub: "Décompresser, honorer nos traditions marocaines et cultiver un esprit de famille soudé et chaleureux.",
    exp1_title: "Nuit Traditionnelle Marocaine",
    exp1_desc: "Soirée festive inspirée des mariages marocains avec thé à la menthe, dîner gastronomique et musique chaâbi.",
    exp2_title: "8 Mars — Journée des Droits des Femmes",
    exp2_desc: "Célébration dédiée à valoriser et inspirer les développeuses et leaders de YouCode.",
    exp3_title: "Soirée Pyjama (100% Féminine)",
    exp3_desc: "Soirée cocooning et détente pour discuter, jouer à des jeux de société et se relaxer entre filles.",
    exp4_title: "Journée Décalée (Unprofessional Day)",
    exp4_desc: "Anti-stress corporate déjanté où étudiants et encadrants viennent vêtus des tenues les plus drôles et improbables.",

    // Finale Manifesto
    mani_title: `LA PARTICIPATION ÉTUDIANTE. <br /><span class="gradient-blue">AU CŒUR DE TOUT.</span>`,
    mani_desc: "Bâtir un écosystème partagé d'intégration, de compétition et d'essor professionnel. Le pouls de YouCode : Connecter. Concourir. S'épanouir.",
    mani_cta_home: "EXPLORER LE SITE PRINCIPAL",
    mani_cta_bde: "YOUPULSE 2026 - 2027",

    footer_credits: "© 2026 YouPulse • Le BDE de YouCode • Plan d'Événements & Activités Officiel.",
    footer_sync: "TOUS LES SYSTÈMES SYNCHRONISÉS // YOUCODE YOUSSOUFIA",

    // Lock screen translations (Postponed / Discord Announcement)
    lock_badge_status: "LANCEMENT REPORTÉ // ANNONCE SUR DISCORD",
    lock_headline: `LE LANCEMENT DU PROGRAMME <br /><span class="gradient-blue">EST REPORTÉ</span>`,
    lock_subtext: "L'ouverture officielle a été temporairement suspendue. La nouvelle heure officielle sera annoncée en direct sur notre serveur Discord.",
    lock_hamster_tag: "REPORTÉ // ANNONCE SUR DISCORD",
    lock_discord_tag: "CANAL OFFICIEL // DISCORD",
    lock_discord_title: "L'HEURE OFFICIELLE SERA ANNONCÉE SUR NOTRE SERVEUR DISCORD",
    lock_discord_sub: "Le compte à rebours est suspendu. Rendez-vous sur le serveur Discord pour suivre l'annonce en direct.",
    lock_standby_label: "COMPTE À REBOURS SUSPENDU // EN ATTENTE D'ANNONCE",
    lock_btn_home: "Retourner à l'Accueil",
    lock_system_tag: "STATUT : REPORTÉ • L'HEURE OFFICIELLE SERA ANNONCÉE SUR NOTRE SERVEUR DISCORD",
    count_days: "Jours",
    count_hours: "Heures",
    count_mins: "Minutes",
    count_secs: "Secondes"
  }
};

let currentLang = localStorage.getItem('youpulse_lang') || 'fr';

// --- 4. Language Switcher Logic for Programme Page ---
function setLanguage(lang, playAudio = false) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('youpulse_lang', lang);
  document.documentElement.lang = lang;

  if (TRANSLATIONS[lang].page_title) {
    document.title = TRANSLATIONS[lang].page_title;
  }

  const langBtn = document.getElementById('lang-switch-btn');
  if (langBtn) {
    langBtn.setAttribute('data-current-lang', lang);
    const badges = langBtn.querySelectorAll('.lang-badge');
    badges.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang][key] !== undefined) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (TRANSLATIONS[lang][key] !== undefined) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  const cards = document.querySelectorAll('.programme-section, .programme-hero');
  cards.forEach(sec => {
    sec.classList.remove('lang-fade-transition');
    void sec.offsetWidth;
    sec.classList.add('lang-fade-transition');
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
        const nextLang = currentLang === 'en' ? 'fr' : 'en';
        setLanguage(nextLang, true);
      }
    });
  }

  setLanguage(currentLang, false);
}

// --- 5. Interactive Track Filter & Side-Spine Synchronizer ---
let currentTrackFilter = 'all';

function applyTrackFilter(targetFilter, shouldScroll = true, playBlip = false) {
  currentTrackFilter = targetFilter;
  const filterButtons = document.querySelectorAll('.filter-pill-btn');
  const sections = document.querySelectorAll('.programme-track-section');
  const dotItems = document.querySelectorAll('.programme-left-spine-nav .spine-dot-item');

  if (playBlip) {
    sound.playHoverBlip(680);
  }

  // Update top filter pills active state
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === targetFilter);
  });

  // Update left spine dots active state
  dotItems.forEach(dot => {
    const isTarget = dot.getAttribute('data-section') === targetFilter;
    dot.classList.toggle('is-active', isTarget);
  });

  // Filter sections display
  if (targetFilter === 'all') {
    sections.forEach(sec => {
      sec.style.display = 'block';
    });
  } else {
    sections.forEach(sec => {
      const secCategory = sec.getAttribute('data-category');
      sec.style.display = (secCategory === targetFilter) ? 'block' : 'none';
    });
  }

  // Smooth scroll to the target section
  if (shouldScroll) {
    const targetEl = (targetFilter === 'all')
      ? document.querySelector('.programme-track-section')
      : document.querySelector(`.programme-track-section[data-category="${targetFilter}"]`);

    if (targetEl) {
      const headerOffset = 95;
      const elementPos = targetEl.getBoundingClientRect().top;
      const offsetPos = elementPos + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
      });
    }
  }
}

function initTrackFilter() {
  const filterButtons = document.querySelectorAll('.filter-pill-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter');
      applyTrackFilter(targetFilter, true, true);
    });
  });
}

// --- 6. Programme Target Date & Realtime Lock Engine ---
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

function initProgrammeLockEngine(waveEngine) {
  const lockScreen = document.getElementById('programme-lock-screen');
  const mainContainer = document.querySelector('.programme-main-container');
  const daysEl = document.getElementById('lock-count-days');
  const hoursEl = document.getElementById('lock-count-hours');
  const minsEl = document.getElementById('lock-count-mins');
  const secsEl = document.getElementById('lock-count-secs');
  const hamsterPic = document.getElementById('lock-bouncing-hamster');

  if (!lockScreen) return;

  if (hamsterPic) {
    hamsterPic.addEventListener('click', (e) => {
      sound.playHamsterSqueak();
      if (waveEngine && typeof waveEngine.emitSonar === 'function') {
        waveEngine.emitSonar(e.clientX, e.clientY, 55);
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  // Manual test override only
  if (urlParams.has('unlock')) {
    document.documentElement.classList.remove('programme-locked-mode');
    lockScreen.style.display = 'none';
    if (mainContainer) {
      mainContainer.classList.add('programme-unlocked-reveal');
    }
    return;
  }

  // LAUNCH POSTPONED: Keep page strictly locked, countdown frozen on standby
  document.documentElement.classList.add('programme-locked-mode');
  lockScreen.style.display = 'block';

  if (daysEl) daysEl.textContent = '--';
  if (hoursEl) hoursEl.textContent = '--';
  if (minsEl) minsEl.textContent = '--';
  if (secsEl) secsEl.textContent = '--';
}

// --- 7. Programme Floating Left-Spine Navigator (Filter & Scroll Spy) ---
function initProgrammeLeftSpine(waveEngine) {
  const spineNav = document.getElementById('programme-left-spine');
  const toggleBtn = document.getElementById('spine-toggle-btn');
  const spineWrapper = document.getElementById('programme-left-spine-wrapper');
  if (!spineNav) return;

  const dotItems = spineNav.querySelectorAll('.spine-dot-item');
  const sectionIds = ['masterplan', 'integration', 'competitions', 'industry', 'culture'];
  let isThrottled = false;

  // Toggle drawer open/close
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = document.body.classList.toggle('left-spine-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      sound.playHoverBlip(isOpen ? 840 : 540);
      if (waveEngine && typeof waveEngine.emitSonar === 'function') {
        waveEngine.emitSonar(isOpen ? 220 : 35, window.innerHeight / 2, 45);
      }
    });
  }

  // Close when clicking outside of spine wrapper
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('left-spine-open')) {
      if (spineWrapper && !spineWrapper.contains(e.target)) {
        document.body.classList.remove('left-spine-open');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('left-spine-open')) {
      document.body.classList.remove('left-spine-open');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  function updateSpineScrollState() {
    // Show spine when scrolled down past hero (> 180px)
    if (window.scrollY > 180) {
      spineNav.classList.add('is-visible');
    } else {
      spineNav.classList.remove('is-visible');
    }

    // When in "all" tracks mode, track active section dynamically on scroll
    if (currentTrackFilter === 'all') {
      const scrollMiddle = window.scrollY + window.innerHeight * 0.38;
      let currentActiveId = null;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const secId = sectionIds[i];
        const secEl = document.getElementById(secId);
        if (secEl && secEl.style.display !== 'none') {
          const top = secEl.offsetTop;
          if (scrollMiddle >= top - 80) {
            currentActiveId = secId;
            break;
          }
        }
      }

      if (!currentActiveId && window.scrollY > 180) {
        for (const secId of sectionIds) {
          const secEl = document.getElementById(secId);
          if (secEl && secEl.style.display !== 'none') {
            currentActiveId = secId;
            break;
          }
        }
      }

      dotItems.forEach(item => {
        const itemSec = item.getAttribute('data-section');
        item.classList.toggle('is-active', itemSec === currentActiveId);
      });
    }
  }

  // Left spine clicks behave exactly like top filter buttons (filtering to that track)
  dotItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const secId = item.getAttribute('data-section');
      
      // Filter directly to that track section!
      applyTrackFilter(secId, true, true);

      if (waveEngine && typeof waveEngine.emitSonar === 'function') {
        waveEngine.emitSonar(45, window.innerHeight / 2, 45);
      }
    });

    item.addEventListener('mouseenter', () => {
      sound.playHoverBlip(820);
    });
  });

  // Throttled scroll listener
  window.addEventListener('scroll', () => {
    if (!isThrottled) {
      window.requestAnimationFrame(() => {
        updateSpineScrollState();
        isThrottled = false;
      });
      isThrottled = true;
    }
  }, { passive: true });

  // Initial check
  updateSpineScrollState();
}

// --- 8. DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  const waveEngine = new SoundWaveEngine('soundwave-canvas');
  initLanguageSwitcher();
  initTrackFilter();
  initProgrammeLockEngine(waveEngine);
  initProgrammeLeftSpine(waveEngine);

  // Micro-hover sound for interactive cards
  document.querySelectorAll('.game-item-card, .catering-item-card, .comp-feature-card, .pipeline-step-card, .exp-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      sound.playHoverBlip(780);
    });
  });
});


