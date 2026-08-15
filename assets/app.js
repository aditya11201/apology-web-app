/* ============================================================
   Interactions — reveal, smooth scroll, chat, thoughts,
   loading bar, stars/hearts, runaway button, balloon pop,
   forgiveness climax + confetti.
   ============================================================ */
(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionQuery.matches;

  const updateMotionPreference = (event) => {
    reduceMotion = event.matches;
    if (reduceMotion) revealAllContent();
    updateAmbientMotion();
  };

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', updateMotionPreference);
  } else {
    motionQuery.addListener(updateMotionPreference);
  }

  /* ---------- helpers ---------- */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $all(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  function revealAllContent() {
    $all('.reveal, .thought').forEach(function (element) { element.classList.add('in'); });
  }

  if (reduceMotion) revealAllContent();

  function applyAmbientMotion(element) {
    element.style.animationDuration = reduceMotion ? '0.001s' : element.dataset.motionDuration;
    element.style.animationDelay = reduceMotion ? '0s' : element.dataset.motionDelay;
  }

  function updateAmbientMotion() {
    $all('.heart-float, .star').forEach(applyAmbientMotion);
  }

  function setAmbientMotion(element, duration, delay) {
    element.dataset.motionDuration = duration + 's';
    element.dataset.motionDelay = delay + 's';
    applyAmbientMotion(element);
  }

  function heartSVG(color) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('fill', color);
    path.setAttribute('d', 'M12 21s-7.5-4.9-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.2 0 4.8 3.4 3.2 6.7C19 16.1 12 21 12 21z');
    svg.appendChild(path);
    return svg;
  }

  function scrollToSel(selector) {
    const element = $(selector);
    if (!element) return;
    const top = element.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function startSectionSequence(id, sequence) {
    const section = document.getElementById(id);
    if (!section || section.dataset.played) return;
    section.dataset.played = '1';
    sequence();
  }

  function revealTarget(target) {
    target.classList.add('in');
    if (target.id === 's2') startSectionSequence('s2', playChat);
    if (target.id === 's4') startSectionSequence('s4', playThoughts);
    if (target.id === 's5') startSectionSequence('s5', playLoading);
  }

  /* ---------- reveal on scroll ---------- */
  if (window.IntersectionObserver) {
    const observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealTarget(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    $all('section').forEach(function (section) { observer.observe(section); });
    $all('.reveal').forEach(function (element) { observer.observe(element); });
  } else {
    revealAllContent();
    startSectionSequence('s2', playChat);
    startSectionSequence('s4', playThoughts);
    startSectionSequence('s5', playLoading);
  }

  /* ---------- CTA smooth scroll ---------- */
  $all('[data-scroll]').forEach(function (button) {
    button.addEventListener('click', function () {
      scrollToSel(button.getAttribute('data-scroll'));
    });
  });

  /* ---------- SECTION 1 & 6 floating hearts ---------- */
  function seedHearts(layerId, count, colors) {
    const layer = document.getElementById(layerId);
    if (!layer) return;
    for (let index = 0; index < count; index += 1) {
      const heart = document.createElement('span');
      heart.className = 'heart-float';
      const size = 12 + Math.random() * 16;
      heart.style.width = size + 'px';
      heart.style.height = size + 'px';
      heart.style.left = Math.random() * 100 + '%';
      setAmbientMotion(heart, 7 + Math.random() * 7, -Math.random() * 10);
      heart.appendChild(heartSVG(colors[index % colors.length]));
      layer.appendChild(heart);
    }
  }
  seedHearts('hearts-s1', 8, ['#FF8FAB', '#FFD6E0', '#B388EB', '#FF5C8A']);
  seedHearts('hearts-s6', 10, ['#FF5C8A', '#FFFFFF', '#FFD6E0', '#FF8FAB']);

  /* ---------- SECTION 2 chat sequence ---------- */
  function playChat() {
    const stage = $('#chatStage');
    const lines = [
      { t: 'Aku tadi niatnya bercanda…' },
      { t: 'Aku cuma pura-pura ngambek…' },
      { t: 'Tapi ternyata kamu yang beneran ngambek…' },
      { t: 'Dan aku kalah.', lost: true }
    ];
    let lineIndex = 0;

    function typing(on) {
      if (on) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing';
        typingIndicator.id = 'curTyping';
        for (let index = 0; index < 3; index += 1) {
          typingIndicator.appendChild(document.createElement('i'));
        }
        stage.appendChild(typingIndicator);
        stage.scrollTop = stage.scrollHeight;
      } else {
        const existingIndicator = $('#curTyping');
        if (existingIndicator) existingIndicator.remove();
      }
    }

    function next() {
      if (lineIndex >= lines.length) {
        const apology = document.createElement('div');
        apology.className = 'sorry';
        apology.textContent = 'Maaf ya…';
        stage.appendChild(apology);
        return;
      }
      typing(true);
      setTimeout(function () {
        typing(false);
        const bubble = document.createElement('div');
        bubble.className = 'bubble' + (lines[lineIndex].lost ? ' lost' : '');
        bubble.textContent = lines[lineIndex].t;
        stage.appendChild(bubble);
        stage.scrollTop = stage.scrollHeight;
        lineIndex += 1;
        setTimeout(next, reduceMotion ? 0 : 650);
      }, reduceMotion ? 200 : 850);
    }
    next();
  }

  /* ---------- SECTION 4 thoughts stagger ---------- */
  function playThoughts() {
    const thoughts = $all('#s4 .thought');
    thoughts.forEach(function (thought, index) {
      setTimeout(function () { thought.classList.add('in'); }, reduceMotion ? 60 : 700 * index + 300);
    });
  }

  /* ---------- SECTION 5 loading bar ---------- */
  function playLoading() {
    const bar = $('#progressBar');
    const percentage = $('#progressPct');
    const status = $('#progressStatus');
    const done = $('#doneTag');
    const statuses = [
      'menyiapkan permintaan maaf…',
      'merangkai kata-kata yang jujur…',
      'menimbang rasa salah…',
      'mencari cara biar kamu senyum…',
      'mengetik dengan tulus…'
    ];
    let progress = 0;
    let start = null;
    let previousDuration = null;
    let timelineEased = 0;
    let lastStatusText = status.textContent;

    function step(timestamp) {
      if (start === null) start = timestamp;
      const duration = reduceMotion ? 600 : 2300;
      if (previousDuration !== null && duration !== previousDuration) {
        const preservedRatio = 1 - Math.sqrt(1 - timelineEased);
        start = timestamp - preservedRatio * duration;
      }
      previousDuration = duration;
      const ratio = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - Math.pow(1 - ratio, 2);
      timelineEased = eased;
      progress = Math.round(eased * 100);
      bar.style.width = progress + '%';
      percentage.textContent = progress + '%';
      const nextStatusText = statuses[Math.min(statuses.length - 1, Math.floor(eased * statuses.length))];
      if (nextStatusText !== lastStatusText) {
        status.textContent = nextStatusText;
        lastStatusText = nextStatusText;
      }
      if (ratio < 1) {
        requestAnimationFrame(step);
      } else {
        const finalStatusText = 'Status: masih berharap dimaafin kakak cantik';
        if (finalStatusText !== lastStatusText) {
          status.textContent = finalStatusText;
          lastStatusText = finalStatusText;
        }
        done.classList.add('show');
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------- SECTION 4 stars ---------- */
  (function () {
    const layer = $('#starsLayer');
    if (!layer) return;
    const count = reduceMotion ? 18 : 46;
    for (let index = 0; index < count; index += 1) {
      const star = document.createElement('span');
      star.className = 'star' + (Math.random() > 0.8 ? ' big' : '');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      setAmbientMotion(star, 2 + Math.random() * 3, -Math.random() * 3);
      layer.appendChild(star);
    }
  })();

  /* ---------- Runaway button + balloon pop ---------- */
  let attempts = 0;
  let popping = false;
  let lastAttemptAt = 0;
  const ATTEMPT_COOLDOWN = 360;
  const FLEE_RADIUS = 120;
  const ROAM_PAD = 12;
  const FUNNY_MESSAGE = 'Eh, balon ngambek-nya pecah! Waktu ngambek-nya kelihatannya udah abis deh… yuk, maafin aku?';
  const roam = $('#roam');
  const wrap = $('#ngambekBtn');
  const face = $('#ngambekFace');
  const funnyMsg = $('#funnyMsg');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function clampPos(x, y) {
    const roamWidth = roam.clientWidth;
    const roamHeight = roam.clientHeight;
    const buttonWidth = wrap.offsetWidth;
    const buttonHeight = wrap.offsetHeight;
    const maxX = Math.max(ROAM_PAD, roamWidth - buttonWidth - ROAM_PAD);
    const maxY = Math.max(ROAM_PAD, roamHeight - buttonHeight - ROAM_PAD);
    return {
      x: Math.min(Math.max(x, ROAM_PAD), maxX),
      y: Math.min(Math.max(y, ROAM_PAD), maxY)
    };
  }

  function applyPos(x, y) {
    const roamWidth = roam.clientWidth;
    wrap.style.transform = 'translate(' + (x - roamWidth / 2) + 'px,' + y + 'px)';
  }

  function farPoint(pointerX, pointerY) {
    const buttonWidth = wrap.offsetWidth;
    const buttonHeight = wrap.offsetHeight;
    const roamWidth = roam.clientWidth;
    const roamHeight = roam.clientHeight;
    const candidates = [
      { x: ROAM_PAD, y: ROAM_PAD },
      { x: roamWidth - buttonWidth - ROAM_PAD, y: ROAM_PAD },
      { x: ROAM_PAD, y: roamHeight - buttonHeight - ROAM_PAD },
      { x: roamWidth - buttonWidth - ROAM_PAD, y: roamHeight - buttonHeight - ROAM_PAD },
      { x: (roamWidth - buttonWidth) / 2, y: (roamHeight - buttonHeight) / 2 }
    ].map(function (candidate) { return clampPos(candidate.x, candidate.y); });
    let best = candidates[0];
    let bestDistance = -1;
    candidates.forEach(function (candidate) {
      const distance = Math.hypot((candidate.x + buttonWidth / 2) - (pointerX || 0), (candidate.y + buttonHeight / 2) - (pointerY || 0));
      if (distance > bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    });
    return best;
  }

  function placeInitial() {
    wrap.style.transition = 'none';
    const position = clampPos((roam.clientWidth - wrap.offsetWidth) / 2, ROAM_PAD);
    applyPos(position.x, position.y);
    void wrap.offsetWidth;
    wrap.style.transition = '';
  }

  function tryFlee(pointerX, pointerY) {
    if (popping) return;
    if (reduceMotion) {
      popBalloon();
      return;
    }
    const now = performance.now();
    if (now - lastAttemptAt < ATTEMPT_COOLDOWN) return;
    lastAttemptAt = now;
    attempts += 1;
    if (attempts > 5) {
      popBalloon();
      return;
    }
    const position = farPoint(pointerX, pointerY);
    applyPos(position.x, position.y);
  }

  if (finePointer) {
    roam.addEventListener('pointermove', function (event) {
      if (popping || reduceMotion) return;
      const roamRect = roam.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const buttonX = wrapRect.left - roamRect.left + wrapRect.width / 2;
      const buttonY = wrapRect.top - roamRect.top + wrapRect.height / 2;
      if (Math.hypot((event.clientX - roamRect.left) - buttonX, (event.clientY - roamRect.top) - buttonY) < FLEE_RADIUS) {
        tryFlee(event.clientX - roamRect.left, event.clientY - roamRect.top);
      }
    });
  }
  wrap.addEventListener('pointerdown', function (event) {
    const roamRect = roam.getBoundingClientRect();
    tryFlee(event.clientX - roamRect.left, event.clientY - roamRect.top);
  });
  wrap.addEventListener('click', function () { tryFlee(); });

  function popBalloon() {
    popping = true;
    wrap.disabled = true;
    face.classList.add('popping');
    face.addEventListener('animationend', function () {
      face.style.visibility = 'hidden';
      spawnBurst();
      funnyMsg.textContent = FUNNY_MESSAGE;
      funnyMsg.classList.add('show');
      funnyMsg.focus();
    }, { once: true });
    setTimeout(function () {
      face.classList.remove('popping');
      face.style.visibility = '';
      attempts = 0;
      popping = false;
      lastAttemptAt = 0;
      wrap.disabled = false;
      wrap.focus();
      funnyMsg.classList.remove('show');
      funnyMsg.textContent = '';
      placeInitial();
    }, reduceMotion ? 100 : 3600);
  }

  function spawnBurst() {
    const colors = ['#FF5C8A', '#FF8FAB', '#FFB3C6', '#B388EB', '#FFD6E0'];
    const rect = wrap.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const flash = document.createElement('span');
    flash.className = 'pop-flash';
    flash.style.left = centerX + 'px';
    flash.style.top = centerY + 'px';
    document.body.appendChild(flash);
    setTimeout(function () { flash.remove(); }, reduceMotion ? 50 : 400);

    const count = 20;
    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'shard';
      particle.setAttribute('aria-hidden', 'true');
      const svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 10 10');
      svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', 'M1 1 Q7 0 8 5 Q9 9 3 9 Q0 6 1 1 Z');
      path.setAttribute('fill', colors[index % colors.length]);
      svg.appendChild(path);
      particle.appendChild(svg);
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      const angle = Math.PI * 2 * index / count + (Math.random() - 0.5) * 0.5;
      const distance = 52 + Math.random() * 72;
      particle.style.setProperty('--bx', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--by', Math.sin(angle) * distance + 'px');
      particle.style.setProperty('--rot', Math.random() * 540 - 270 + 'deg');
      particle.style.animationDuration = (reduceMotion ? 0.001 : 0.6 + Math.random() * 0.35) + 's';
      document.body.appendChild(particle);
      setTimeout(function () { particle.remove(); }, reduceMotion ? 50 : 1000);
    }
  }

  placeInitial();
  window.addEventListener('resize', function () {
    if (!popping) placeInitial();
  });

  /* ---------- Forgiveness climax ---------- */
  let forgivenessStarted = false;
  let confettiFired = false;
  $('#forgiveBtn').addEventListener('click', function () {
    if (forgivenessStarted) return;
    forgivenessStarted = true;
    const questionState = $('#qState');
    const finalState = $('#finalState');
    const finalHeading = $('#finalHeading');
    let finalStateStarted = false;
    let exitFallbackTimer;

    function startFinalState() {
      if (finalStateStarted) return;
      finalStateStarted = true;
      questionState.removeEventListener('transitionend', handleQuestionExit);
      clearTimeout(exitFallbackTimer);
      questionState.hidden = true;
      finalState.classList.add('show');
      fireConfetti();
      if (finalHeading) finalHeading.focus({ preventScroll: true });
    }

    function handleQuestionExit(event) {
      if (event.target !== questionState) return;
      if (event.propertyName !== 'opacity' && event.propertyName !== 'transform') return;
      startFinalState();
    }

    questionState.addEventListener('transitionend', handleQuestionExit);
    questionState.style.transition = 'opacity .5s ease, transform .5s ease';
    questionState.style.opacity = '0';
    questionState.style.transform = 'scale(.96)';
    exitFallbackTimer = setTimeout(startFinalState, reduceMotion ? 0 : 600);
  });

  function fireConfetti() {
    if (confettiFired) return;
    const layer = $('#confetti-layer');
    if (!layer) return;
    confettiFired = true;
    const colors = ['#FF8FAB', '#FF5C8A', '#B388EB', '#FFD6E0', '#FFB3C6', '#FFFFFF'];
    const count = reduceMotion ? 18 : 70;
    for (let index = 0; index < count; index += 1) {
      const heart = document.createElement('span');
      heart.className = 'confetti-heart';
      const size = 9 + Math.random() * 15;
      heart.style.width = size + 'px';
      heart.style.height = size + 'px';
      heart.style.left = 5 + Math.random() * 90 + '%';
      heart.style.top = -10 - Math.random() * 15 + '%';
      heart.style.setProperty('--dx', (Math.random() - 0.5) * 240 + 'px');
      heart.style.setProperty('--rot', Math.random() * 720 - 360 + 'deg');
      const duration = reduceMotion ? 0.001 : 2.6 + Math.random() * 2.6;
      const delay = reduceMotion ? 0 : Math.random() * 0.5;
      heart.style.animationDuration = duration + 's';
      heart.style.animationDelay = delay + 's';
      heart.appendChild(heartSVG(colors[index % colors.length]));
      layer.appendChild(heart);
      setTimeout(function () { heart.remove(); }, (duration + delay) * 1000 + (reduceMotion ? 50 : 500));
    }
  }

  /* ---------- scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    let ticking = false;
    function updateProgress() {
      const html = document.documentElement;
      const max = (html.scrollHeight - html.clientHeight) || 1;
      const progress = Math.min(1, Math.max(0, (html.scrollTop || document.body.scrollTop) / max));
      progressBar.style.transform = 'scaleX(' + progress + ')';
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();
  }

  function revealOpeningContent() {
    $all('#s1 .reveal').forEach(function (element) { element.classList.add('in'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealOpeningContent, { once: true });
  } else {
    revealOpeningContent();
  }
})();
