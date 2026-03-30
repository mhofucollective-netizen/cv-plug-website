/* ============================================================
   CV PLUG — Main JavaScript
   ============================================================ */

// ╔══════════════════════════════════════════════════════════════╗
// ║  STRIPE PAYMENT LINKS                                        ║
// ║  Paste each link from: dashboard.stripe.com → Payment Links  ║
// ║  Format: 'https://buy.stripe.com/xxxxxxxxxxxx'               ║
// ╚══════════════════════════════════════════════════════════════╝
const STRIPE_LINKS = {
    'basic-cv':        '',   // Basic CV — £29
    'professional-cv': '',   // Professional CV — £59
    'cv-cover-letter': '',   // CV + Cover Letter — £79
    'cv-starter':      '',   // CV Starter — £149
    'career-pro':      '',   // Career Pro — £299/mo
    'full-service':    '',   // Full Service — £499/mo
};

// Package display metadata (do not edit unless prices change)
const PACKAGES = {
    'basic-cv':        { name: 'Basic CV',          price: '£29',     note: 'One-time payment · Work starts within 24hrs of confirmation' },
    'professional-cv': { name: 'Professional CV',   price: '£59',     note: 'One-time payment · Work starts within 24hrs of confirmation' },
    'cv-cover-letter': { name: 'CV + Cover Letter', price: '£79',     note: 'One-time payment · Work starts within 24hrs of confirmation' },
    'cv-starter':      { name: 'CV Starter',        price: '£149',    note: 'One-time payment · Work starts within 24hrs of confirmation' },
    'career-pro':      { name: 'Career Pro',        price: '£299/mo', note: 'Billed monthly · Cancel anytime · Work starts after first payment' },
    'full-service':    { name: 'Full Service',      price: '£499/mo', note: 'Billed monthly · Cancel anytime · Work starts after first payment' },
};

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

// ── Pricing card → auto-select package + inject Pay Now links ─
document.querySelectorAll('.price-cta[data-package]').forEach(btn => {
    const pkg = btn.dataset.package;

    // Inject "Pay Now" link on card if Stripe URL is set
    const stripeUrl = STRIPE_LINKS[pkg];
    if (stripeUrl) {
        const payLink = document.createElement('a');
        payLink.href = stripeUrl;
        payLink.className = 'pay-now-link';
        payLink.target = '_blank';
        payLink.rel = 'noopener noreferrer';
        payLink.dataset.track = 'pay_now_click';
        payLink.dataset.label = PACKAGES[pkg]?.name || pkg;
        payLink.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><rect x="1" y="5" width="11" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M4 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>Pay Now';
        btn.after(payLink);
    }

    // Click: auto-select radio + update summary + scroll to form
    btn.addEventListener('click', e => {
        e.preventDefault();
        const radio = document.querySelector(`input[name="package"][value="${pkg}"]`);
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        }
        updatePkgSummary(pkg);
        const target = document.getElementById('upload-cv');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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

// ── Package radio selection — summary + analytics ─────────────
function updatePkgSummary(value) {
    const info = PACKAGES[value];
    const summary = document.getElementById('pkgSummary');
    if (!summary || !info) return;
    document.getElementById('summaryName').textContent  = info.name;
    document.getElementById('summaryPrice').textContent = info.price;
    document.getElementById('summaryNote').textContent  = info.note;
    summary.classList.add('visible');
}

document.querySelectorAll('.package-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        updatePkgSummary(radio.value);
        track('package_select', { event_label: radio.value });
    });
});


// ── Form submissions ──────────────────────────────────────────
(function () {

    function showThankYou(selectedPkg) {
        const ty = document.getElementById('thank-you');
        if (!ty) return;
        ty.classList.add('show');
        ty.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Populate payment block if a package was selected
        const pkgInfo = selectedPkg ? PACKAGES[selectedPkg] : null;
        const stripeUrl = selectedPkg ? STRIPE_LINKS[selectedPkg] : null;
        const block = document.getElementById('tyPaymentBlock');

        if (pkgInfo && block) {
            document.getElementById('tyPkgName').textContent = pkgInfo.name;
            document.getElementById('tyPkgPrice').textContent = pkgInfo.price;
            document.getElementById('tyPayNote').textContent = pkgInfo.note;

            const payBtn = document.getElementById('tyPayBtn');
            if (stripeUrl) {
                payBtn.href = stripeUrl;
                payBtn.addEventListener('click', () => {
                    track('pay_now_click', { event_label: pkgInfo.name });
                }, { once: true });
            } else {
                // Stripe link not yet set — hide pay button, show WhatsApp as primary
                payBtn.style.display = 'none';
                document.querySelector('.payment-security-note').style.display = 'none';
            }
            block.style.display = 'block';
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
                    contactForm.closest('section') && (contactForm.closest('.form-card').style.display = 'none');
                    showThankYou(null);
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

            // Validate required fields
            const name  = uploadForm.querySelector('[name="name"]');
            const email = uploadForm.querySelector('[name="email"]');
            const pkg   = uploadForm.querySelector('[name="package"]:checked');

            if (!name.value.trim()) { name.focus(); name.style.borderColor = 'rgba(239,68,68,0.6)'; return; }
            name.style.borderColor = '';
            if (!email.value.trim() || !email.validity.valid) { email.focus(); email.style.borderColor = 'rgba(239,68,68,0.6)'; return; }
            email.style.borderColor = '';
            if (!pkg) {
                document.getElementById('pkgSummary')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.querySelector('.package-options').style.outline = '1px solid rgba(239,68,68,0.5)';
                document.querySelector('.package-options').style.borderRadius = '12px';
                setTimeout(() => { document.querySelector('.package-options').style.outline = ''; }, 2500);
                return;
            }

            const selectedPkg = pkg.value;
            const btn = uploadForm.querySelector('[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Submitting…';

            try {
                const res = await fetch(uploadForm.action, {
                    method: 'POST',
                    body: new FormData(uploadForm),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) {
                    track('cv_upload_submit', { event_label: selectedPkg || 'cv_upload' });
                    uploadForm.style.display = 'none';
                    showThankYou(selectedPkg);
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
