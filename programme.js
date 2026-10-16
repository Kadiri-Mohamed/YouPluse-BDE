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
}

const sound = new SoundSynth();

// --- 2. Canvas Background Audio Synth Engine ---
class SoundWaveEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      speed: 0,
      active: false
    };

    this.sonars = [];
    this.particles = [];
    this.time = 0;
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
    const count = Math.min(Math.floor(this.width / 24), 50);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
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
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.time += 0.018;

    // Equalizer spectrum
    const barWidth = this.width / this.eqBars;
    for (let i = 0; i < this.eqBars; i++) {
      const x = i * barWidth;
      let mouseBoost = 0;
      if (this.mouse.active) {
        const d = Math.abs(x - this.mouse.x);
        if (d < 250) {
          mouseBoost = (1 - d / 250) * 80;
        }
      }

      const freqHeight = Math.abs(Math.sin(i * 0.25 + this.time * 2.5)) * 50 + mouseBoost + 10;
      const gradient = this.ctx.createLinearGradient(0, this.height - freqHeight, 0, this.height);
      gradient.addColorStop(0, 'rgba(0, 210, 255, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 102, 255, 0.03)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x + 2, this.height - freqHeight, barWidth - 4, freqHeight);
    }

    // Sine Waves
    const verticalGap = this.height / (this.waveLayers + 1);
    for (let i = 0; i < this.waveLayers; i++) {
      const baseY = verticalGap * (i + 1);
      const freq = 0.0022 + i * 0.0004;
      const baseAmp = 14 + (i % 3) * 6;
      const alpha = 0.12 + (i / this.waveLayers) * 0.22;

      this.ctx.beginPath();
      this.ctx.strokeStyle = i % 2 === 0 ? `rgba(0, 210, 255, ${alpha})` : `rgba(0, 102, 255, ${alpha * 1.2})`;
      this.ctx.lineWidth = i % 3 === 0 ? 2 : 1.2;

      for (let x = 0; x <= this.width; x += 8) {
        const y = baseY + Math.sin(x * freq + this.time * 2 + i) * baseAmp;
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }

    // Particles
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = 0.5;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;

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
    footer_sync: "ALL SYSTEMS SYNCHRONIZED // YOUCODE YOUSSOUFIA"
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
    footer_sync: "TOUS LES SYSTÈMES SYNCHRONISÉS // YOUCODE YOUSSOUFIA"
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

// --- 5. Interactive Track Filter Bar ---
function initTrackFilter() {
  const filterButtons = document.querySelectorAll('.filter-pill-btn');
  const sections = document.querySelectorAll('.programme-track-section');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playHoverBlip(650);
      const targetFilter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetFilter === 'all') {
        sections.forEach(sec => {
          sec.style.display = 'block';
        });
      } else {
        sections.forEach(sec => {
          const secCategory = sec.getAttribute('data-category');
          if (secCategory === targetFilter) {
            sec.style.display = 'block';
          } else {
            sec.style.display = 'none';
          }
        });

        // Smooth scroll to first visible section
        const firstVisible = document.querySelector(`.programme-track-section[data-category="${targetFilter}"]`);
        if (firstVisible) {
          firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// --- 6. DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  new SoundWaveEngine('soundwave-canvas');
  initLanguageSwitcher();
  initTrackFilter();

  // Micro-hover sound for interactive cards
  document.querySelectorAll('.game-item-card, .catering-item-card, .comp-feature-card, .pipeline-step-card, .exp-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      sound.playHoverBlip(780);
    });
  });
});
