/* ============================================================
   CV PLUG — Main JavaScript
   ============================================================ */

// ── Safe gtag wrapper (fires even if GA hasn't loaded yet) ────
function track(event, params) {
    if (typeof gtag === 'function') {
        gtag('event', event, params || {});
    }
}

// ── Progress bar + nav scroll state ──────────────────────────
window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const t = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('progress').style.width = (s / t * 100) + '%';
    document.getElementById('nav').classList.toggle('scrolled', s > 40);
}, { passive: true });

// ── Scroll reveal (IntersectionObserver) ─────────────────────
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => revealObs.observe(el));

// ── Confetti (job offer section) ─────────────────────────────
const confettiColors = ['#C49A2A','#FFD700','#10B981','#22D3EE','rgba(255,255,255,0.8)'];
const confettiWrap = document.getElementById('confetti');
if (confettiWrap) {
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'cp';
        const sz = 4 + Math.random() * 7;
        p.style.cssText = `left:${Math.random()*100}%;background:${confettiColors[i%confettiColors.length]};--cd:${2.4+Math.random()*2}s;--cdelay:${Math.random()*3}s;width:${sz}px;height:${sz}px;border-radius:${Math.random()>.5?'50%':'2px'}`;
        confettiWrap.appendChild(p);
    }
}

// ── Particles ────────────────────────────────────────────────
function mkParticles(id, n) {
    const c = document.getElementById(id);
    if (!c) return;
    for (let i = 0; i < n; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random()*100}%;bottom:0;--pd:${7+Math.random()*10}s;--pdelay:${Math.random()*8}s;--drift:${(Math.random()-.5)*60}px;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px`;
        c.appendChild(p);
    }
}
mkParticles('hp', 18);
mkParticles('cp2', 22);

// ── Timeline scroll activation ───────────────────────────────
const timeline = document.getElementById('timeline');
if (timeline) {
    const tlObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.tl-dot').forEach((d, i) =>
                    setTimeout(() => d.classList.add('on'), i * 320));
            }
        });
    }, { threshold: 0.3 });
    tlObs.observe(timeline);
}

// ── Exploding view — queue-based scroll scrub ─────────────────
(function () {
    const section = document.getElementById('exploding-view');
    const video   = document.getElementById('expVideo');
    const progBar = document.getElementById('expProgressBar');
    const sideBar = document.getElementById('expSidebarFill');
    const hint    = document.getElementById('expHint');
    if (!section || !video) return;

    video.pause();
    video.currentTime = 0;

    const panels = [
        { el: document.getElementById('expPanel1'), show: 0.04, hide: 0.33 },
        { el: document.getElementById('expPanel2'), show: 0.37, hide: 0.65 },
        { el: document.getElementById('expPanel3'), show: 0.68, hide: 0.97 },
    ];

    let isSeeking  = false;
    let nextTarget = null;

    function commitSeek(t) {
        isSeeking = true;
        video.currentTime = t;
    }

    video.addEventListener('seeked', () => {
        isSeeking = false;
        if (nextTarget !== null) {
            const t = nextTarget;
            nextTarget = null;
            commitSeek(t);
        }
    });

    function requestSeek(t) {
        if (!isSeeking) { commitSeek(t); } else { nextTarget = t; }
    }

    let rafId = null;
    let lastP  = -1;

    function update() {
        rafId = null;
        const rect        = section.getBoundingClientRect();
        const totalScroll = section.offsetHeight - window.innerHeight;
        const scrolled    = Math.max(0, -rect.top);
        const p           = Math.min(1, scrolled / totalScroll);

        if (Math.abs(p - lastP) < 0.0003) return;
        lastP = p;

        if (video.readyState >= 2 && video.duration) {
            requestSeek(p * video.duration);
        }

        if (progBar) progBar.style.width  = (p * 100).toFixed(2) + '%';
        if (sideBar) sideBar.style.height = (p * 100).toFixed(2) + '%';
        if (hint)    hint.classList.toggle('gone', p > 0.025);

        panels.forEach(({ el, show, hide }) => {
            if (el) el.classList.toggle('active', p >= show && p < hide);
        });
    }

    window.addEventListener('scroll', () => {
        if (!rafId) rafId = requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', () => {
        if (!rafId) rafId = requestAnimationFrame(update);
    }, { passive: true });

    requestAnimationFrame(update);
})();

// ── Mobile nav toggle ─────────────────────────────────────────
(function () {
    const burger = document.getElementById('navBurger');
    const drawer = document.getElementById('navDrawer');
    if (!burger || !drawer) return;

    function openMenu() {
        burger.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', e => {
        e.stopPropagation();
        burger.classList.contains('open') ? closeMenu() : openMenu();
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
        if (drawer.classList.contains('open') && !drawer.contains(e.target) && !burger.contains(e.target)) {
            closeMenu();
        }
    });
})();

// ── Parallax hero glow ────────────────────────────────────────
let heroTick = false;
window.addEventListener('scroll', () => {
    if (!heroTick) {
        requestAnimationFrame(() => {
            const g = document.querySelector('.hero-glow');
            if (g) g.style.transform = `scale(1) translateY(${window.scrollY * 0.14}px)`;
            heroTick = false;
        });
        heroTick = true;
    }
}, { passive: true });

// ── CTA event tracking ────────────────────────────────────────
document.addEventListener('click', e => {
    const t = e.target.closest('[data-track]');
    if (!t) return;
    const ev = t.dataset.track;
    const label = t.dataset.label || t.textContent.trim().slice(0, 60);
    track(ev, { event_label: label });
});

// ── FAQ accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

        // Toggle current
        if (!isOpen) item.classList.add('open');
    });
});

// ── Package radio selection (visual state) ────────────────────
document.querySelectorAll('.package-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.querySelectorAll('.package-option').forEach(opt => opt.classList.remove('selected'));
        radio.closest('.package-option').classList.add('selected');
        track('package_select', { event_label: radio.value });
    });
});

// ── File drag-drop ────────────────────────────────────────────
(function () {
    const area = document.getElementById('fileDropArea');
    const input = document.getElementById('cvFile');
    const label = document.getElementById('fileDropLabel');
    if (!area || !input) return;

    function updateLabel(files) {
        if (files && files.length) {
            label.textContent = files[0].name;
            area.classList.add('has-file');
        }
    }

    area.addEventListener('click', () => input.click());

    input.addEventListener('change', () => updateLabel(input.files));

    area.addEventListener('dragover', e => {
        e.preventDefault();
        area.classList.add('drag-over');
    });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', e => {
        e.preventDefault();
        area.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length) {
            // Transfer to input
            const dt = new DataTransfer();
            dt.items.add(files[0]);
            input.files = dt.files;
            updateLabel(files);
        }
    });
})();

// ── Form submissions ──────────────────────────────────────────
(function () {
    function showThankYou() {
        const ty = document.getElementById('thank-you');
        if (ty) {
            ty.classList.add('show');
            ty.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = contactForm.querySelector('[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Sending…';

            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) {
                    track('contact_form_submit', { event_label: 'contact' });
                    contactForm.style.display = 'none';
                    showThankYou();
                } else {
                    btn.disabled = false;
                    btn.textContent = 'Send Message';
                    alert('Something went wrong. Please try again or WhatsApp us directly.');
                }
            } catch {
                btn.disabled = false;
                btn.textContent = 'Send Message';
                alert('Something went wrong. Please check your connection and try again.');
            }
        });
    }

    // CV upload form
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = uploadForm.querySelector('[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Uploading…';

            try {
                const res = await fetch(uploadForm.action, {
                    method: 'POST',
                    body: new FormData(uploadForm),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) {
                    track('cv_upload_submit', { event_label: 'cv_upload' });
                    uploadForm.style.display = 'none';
                    showThankYou();
                } else {
                    btn.disabled = false;
                    btn.textContent = 'Submit My CV';
                    alert('Something went wrong. Please try again or WhatsApp us directly.');
                }
            } catch {
                btn.disabled = false;
                btn.textContent = 'Submit My CV';
                alert('Something went wrong. Please check your connection and try again.');
            }
        });
    }
})();
