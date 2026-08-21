// ZFin GPT — Primary JavaScript Controller


document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('primary-nav-menu');

  // Highlight current page active nav link
  const rawPath = (window.location.pathname.split('/').pop() || '').replace('.html', '');
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    const cleanHref = href.replace('https://zfingpt.com/', '').replace('.html', '').replace(/^\//, '');
    const cleanCurrent = rawPath.replace('index', '').replace(/^\//, '');

    if (cleanHref === cleanCurrent || (cleanCurrent === '' && (cleanHref === '' || cleanHref === 'index' || cleanHref === 'https://zfingpt.com/'))) {
      link.classList.add('active');
    }
  });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').substring(1);
      if (targetId && targetId !== 'audit-modal') {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (navMenu) navMenu.classList.remove('open');
        }
      }
    });
  });


  // Tab Switcher for "Where This Shows Up"
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`tab-panel-${targetTab}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  // Proof & Testimonial Section Toggle Handler
  const proofBtns = document.querySelectorAll('.proof-toggle-btn');
  const proofViewResults = document.getElementById('proof-view-results');
  const proofViewTestimonial = document.getElementById('proof-view-testimonial');

  proofBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-proof');
      proofBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (mode === 'testimonial') {
        if (proofViewResults) proofViewResults.style.display = 'none';
        if (proofViewTestimonial) {
          proofViewTestimonial.style.display = 'block';
          proofViewTestimonial.classList.add('fade-in');
        }
      } else {
        if (proofViewTestimonial) proofViewTestimonial.style.display = 'none';
        if (proofViewResults) {
          proofViewResults.style.display = 'block';
          proofViewResults.classList.add('fade-in');
        }
      }
    });
  });

  // Contact Page Form Submission Handler
  const contactForm = document.getElementById('contact-page-form');
  const contactSuccess = document.getElementById('contact-success-banner');

  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      contactSuccess.style.display = 'block';
      contactSuccess.classList.add('fade-in');
    });
  }

  // MCP Gateway Live Simulator
  initMcpSimulator();
  
  // FAQ Accordion Logic
  initFaqAccordion();
  
  // Audit Booking Modal Manager
  initModal();
});

// MCP Gateway Live Simulator Function
function initMcpSimulator() {
  const SIMULATION_PRESETS = [
    {
      name: "Legacy Inventory Query",
      legacyPayload: "GET /api/v1/inventory/sku-8921/stock",
      mcpTranslation: "mcp:tool/check_sku_stock { sku: 'SKU-8921', warehouse: 'US-EAST' }",
      claudeAction: "Claude Agent: 'Stock level is 14 units. Threshold is 50. Reorder recommended.'",
      humanApproval: "Drafting PO #4091 for 100 units → Pending Human Approval"
    },
    {
      name: "Zoho Email Triage",
      legacyPayload: "ZOHO_INBOX_EVENT: New Onboarding Email received",
      mcpTranslation: "mcp:tool/read_mailbox { id: 'msg_90412', sender: 'client@acme.com' }",
      claudeAction: "Claude Agent: 'Drafted tailored onboarding response with attached PDF instructions.'",
      humanApproval: "Saved to Zoho Drafts → Waiting for Human Review"
    },
    {
      name: "Finance Commission Run",
      legacyPayload: "POST /api/v1/finance/sales/monthly-close",
      mcpTranslation: "mcp:tool/calculate_commissions { month: '2026-07', reps: 42 }",
      claudeAction: "Claude Agent: 'Reconciled 42 commission payouts against Zoho CRM closed deals.'",
      humanApproval: "Commission Summary Report Ready → Waiting for CFO Approval"
    }
  ];

  const simNode1 = document.getElementById('sim-payload-text');
  const simNode2 = document.getElementById('sim-mcp-text');
  const simNode3 = document.getElementById('sim-claude-text');
  const simNode4 = document.getElementById('sim-human-text');
  const presetBtns = document.querySelectorAll('.sim-preset-btn');
  const triggerBtn = document.getElementById('run-sim-btn');

  if (!simNode1 || !triggerBtn) return;

  let currentIndex = 0;

  function loadPreset(index) {
    const preset = SIMULATION_PRESETS[index];
    simNode1.textContent = preset.legacyPayload;
    simNode2.textContent = preset.mcpTranslation;
    simNode3.textContent = preset.claudeAction;
    simNode4.textContent = preset.humanApproval;

    presetBtns.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('active');
        btn.style.background = 'rgba(56, 189, 248, 0.25)';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'rgba(56, 189, 248, 0.08)';
      }
    });
  }

  presetBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      currentIndex = idx;
      loadPreset(currentIndex);
    });
  });

  triggerBtn.addEventListener('click', () => {
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Simulating MCP Payload...';
    
    const nodes = document.querySelectorAll('.mcp-node');
    nodes.forEach((n, i) => {
      setTimeout(() => {
        n.style.borderColor = '#38bdf8';
        n.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.4)';
        setTimeout(() => {
          n.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          n.style.boxShadow = 'none';
        }, 1200);
      }, i * 450);
    });

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % SIMULATION_PRESETS.length;
      loadPreset(currentIndex);
      triggerBtn.disabled = false;
      triggerBtn.textContent = '⚡ Run Next Simulation Scenario';
    }, 2000);
  });

  loadPreset(0);
}

// FAQ Accordion Handler
function initFaqAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      const container = item.closest('.accordion-container');
      if (container) {
        container.querySelectorAll('.accordion-item').forEach(child => {
          child.classList.remove('active');
        });
      }

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Audit Booking Modal Manager
function initModal() {
  const modalOverlay = document.getElementById('audit-modal');
  const openBtns = document.querySelectorAll('.open-audit-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const auditForm = document.getElementById('audit-booking-form');
  const toast = document.getElementById('toast-notification');

  if (!modalOverlay) return;

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast("Thanks — we'll get back to you within 1 business day.");
      auditForm.reset();
    });
  }

  function showToast(message) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-msg');
    if (msgEl) msgEl.textContent = message;
    
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}
