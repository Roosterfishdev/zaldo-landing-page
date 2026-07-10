(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-animations');

  function initHeroAnimations() {
    var hero = document.querySelector('.hero');
    var heroShowcase = document.querySelector('.hero-showcase');
    if (!hero || !heroShowcase) return;

    function enableHeroFloating() {
      heroShowcase.querySelectorAll('.hero-float--left, .hero-float--right').forEach(function (el) {
        el.classList.add('is-floating');
      });
    }

    function animateHeroCards() {
      var walletCard = heroShowcase.querySelector('.hero-wallet-card');
      var chart = heroShowcase.querySelector('.hero-float-chart');
      if (walletCard) walletCard.classList.add('animated');
      if (chart) chart.classList.add('animated');
    }

    if (prefersReducedMotion) {
      hero.classList.add('is-loaded');
      heroShowcase.classList.add('is-visible');
      enableHeroFloating();
      animateHeroCards();
      return;
    }

    requestAnimationFrame(function () {
      hero.classList.add('is-loaded');
      setTimeout(function () {
        heroShowcase.classList.add('is-visible');
        setTimeout(function () {
          enableHeroFloating();
          animateHeroCards();
        }, 1350);
      }, 180);
    });
  }

  function initScrollReveal() {
    var revealSelector = [
      'section:not(.hero) header',
      'section:not(.hero) .how-step-card',
      'section:not(.hero) .features-bento-card',
      'section:not(.hero) .trust-note',
      'section:not(.hero) .how-cta',
      'section:not(.hero) .savings-inner > *',
      'section:not(.hero) .reviews-header',
      'section:not(.hero) .pricing-header',
      'section:not(.hero) .pricing-card',
      'section:not(.hero) .cta-final-inner',
      'section:not(.hero) .faq-intro',
      'section:not(.hero) .faq-item',
      'footer.site-footer .site-footer-inner',
      'footer.site-footer .site-footer-card'
    ].join(', ');

    var revealEls = document.querySelectorAll(revealSelector);
    revealEls.forEach(function (el) {
      el.classList.add('scroll-reveal');
    });

    if (prefersReducedMotion) {
      revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .scroll-reveal') : null;
        if (siblings && siblings.length > 1) {
          var index = Array.prototype.indexOf.call(siblings, el);
          if (index >= 0) el.style.transitionDelay = (index * 0.08) + 's';
        }

        el.classList.add('is-revealed');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  initHeroAnimations();
  initScrollReveal();
  initMobileNav();

  function initMobileNav() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    var overlay = document.querySelector('.nav-overlay');
    var menu = document.getElementById('nav-menu');
    if (!nav || !toggle || !menu) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      if (overlay) overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('nav-open', open);
    }

    function closeMenu() {
      setOpen(false);
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  var dropdown = document.getElementById('yearDropdown');
  if (dropdown) {
    var btn = dropdown.querySelector('.chart-dropdown-btn');
    var label = dropdown.querySelector('.chart-dropdown-label');
    var options = dropdown.querySelectorAll('.chart-dropdown-menu button');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        options.forEach(function (o) { o.classList.remove('active'); });
        opt.classList.add('active');
        label.textContent = opt.dataset.label;
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  var barChart = document.getElementById('barChart');
  var overlay = document.getElementById('balanceOverlay');

  if (barChart && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          barChart.querySelectorAll('.bar').forEach(function (bar) {
            bar.style.height = bar.dataset.height + '%';
          });
          barChart.classList.add('animated');
          if (overlay) overlay.classList.add('animated');
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    barChart.querySelectorAll('.bar').forEach(function (bar) {
      bar.style.height = '0';
    });
    observer.observe(barChart);
  } else if (barChart) {
    barChart.querySelectorAll('.bar').forEach(function (bar) {
      bar.style.height = bar.dataset.height + '%';
    });
    barChart.classList.add('animated');
    if (overlay) overlay.classList.add('animated');
  }

  var savingsGauge = document.getElementById('savingsGauge');
  if (savingsGauge) {
    var arcs = savingsGauge.querySelectorAll('.gauge-fill');

    function animateGauge() {
      arcs.forEach(function (arc) {
        var len = parseFloat(arc.dataset.length);
        var pct = parseFloat(arc.dataset.pct) / 100;
        var visible = len * pct;
        arc.style.strokeDasharray = visible + ' ' + len;
        arc.style.strokeDashoffset = '0';
      });
      savingsGauge.classList.add('animated');
    }

    arcs.forEach(function (arc) {
      var len = parseFloat(arc.dataset.length);
      arc.style.strokeDasharray = '0 ' + len;
      arc.style.strokeDashoffset = '0';
    });

    if ('IntersectionObserver' in window) {
      var gaugeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateGauge();
            gaugeObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });
      gaugeObserver.observe(savingsGauge);
    } else {
      animateGauge();
    }
  }

  var billingBtns = document.querySelectorAll('.billing-toggle-option[data-billing]');
  var billingToggle = document.querySelector('.billing-toggle');
  var pricingAmount = document.getElementById('pricingAmount');
  var pricingPeriod = document.getElementById('pricingPeriod');
  var pricingCompare = document.getElementById('pricingCompare');
  var pricingBilled = document.getElementById('pricingBilled');

  if (billingBtns.length && pricingAmount) {
    var prices = {
      monthly: {
        currency: '$',
        amount: '4.99',
        period: '/ mes',
        compare: '',
        billed: ''
      },
      annually: {
        currency: '$',
        amount: '2.99',
        period: '/ mes',
        compare: '$4.99',
        billed: 'Facturado anualmente a $35.88'
      }
    };

    function setBilling(billing) {
      billingBtns.forEach(function (b) {
        var isActive = b.dataset.billing === billing;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      if (billingToggle) {
        billingToggle.classList.toggle('is-annual', billing === 'annually');
      }
      var price = prices[billing];
      if (document.getElementById('pricingCurrency')) {
        document.getElementById('pricingCurrency').textContent = price.currency;
      }
      pricingAmount.textContent = price.amount;
      if (pricingPeriod) pricingPeriod.textContent = price.period;
      if (pricingCompare) {
        if (price.compare) {
          pricingCompare.textContent = price.compare;
          pricingCompare.hidden = false;
        } else {
          pricingCompare.hidden = true;
        }
      }
      if (pricingBilled) {
        if (price.billed) {
          pricingBilled.textContent = price.billed;
          pricingBilled.hidden = false;
        } else {
          pricingBilled.hidden = true;
        }
      }
    }

    billingBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setBilling(btn.dataset.billing);
      });
    });
  }

  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* FAQPage JSON-LD derived from the live FAQ markup so Q&A stay in sync. */
  (function injectFaqJsonLd() {
    var items = document.querySelectorAll('#faq .faq-item');
    if (!items.length) return;

    var mainEntity = [];
    items.forEach(function (item) {
      var questionEl = item.querySelector('.faq-question span:not(.faq-icon)');
      var answerEl = item.querySelector('.faq-answer-inner');
      if (!questionEl || !answerEl) return;

      var question = questionEl.textContent.replace(/\s+/g, ' ').trim();
      var answer = answerEl.textContent.replace(/\s+/g, ' ').trim();
      if (!question || !answer) return;

      mainEntity.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer
        }
      });
    });

    if (!mainEntity.length) return;

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: mainEntity
    });
    document.head.appendChild(script);
  })();

  /* Waiting list form: show success message after submit (ezlaunch still captures the lead). */
  (function initWaitlistForm() {
    var form = document.getElementById('waitlist-form');
    if (!form) return;

    var card = form.closest('.waitlist-card');
    var success = document.getElementById('waitlist-success');
    if (!card || !success) return;

    form.addEventListener('submit', function () {
      if (!form.checkValidity()) return;
      card.classList.add('is-success');
      success.hidden = false;
    });
  })();
})();
