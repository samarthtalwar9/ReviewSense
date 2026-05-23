/* ═══════════════════════════════════════════════
   REVIEWSENSE — JavaScript
   AI Sentiment Dashboard Logic (Production-Ready Polished)
   ═══════════════════════════════════════════════ */

/* ── PARTICLE CANVAS ─────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId = null;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(255,45,120,', 'rgba(124,58,237,', 'rgba(59,130,246,', 'rgba(168,85,247,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
      this.size = Math.random() * 1.5 + 0.3;
      this.speed = Math.random() * 0.4 + 0.1;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.drift = (Math.random() - 0.5) * 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      this.twinkle += this.twinkleSpeed;
      if (this.y < -10) this.reset();
    }
    draw() {
      const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.twinkle));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
    }
  }

  // Generate particles based on performance profiles
  const maxParticles = window.innerWidth < 640 ? 40 : 80;
  for (let i = 0; i < maxParticles; i++) particles.push(new Particle());

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();

  // Clean up animation on visibility change to save CPU/GPU cycles
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });
})();

/* ── SIDEBAR TOGGLE ──────────────────────────── */
const hamburger = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

hamburger?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});
overlay?.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

/* ── NAV ITEM CLICKS ─────────────────────────── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    if (window.innerWidth <= 900) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
});

/* ── DYNAMIC SYSTEM STATE ────────────────────── */
const state = {
  totalAnalyses: 0,
  positiveCount: 0,
  negativeCount: 0,
  neutralCount: 0,
  totalConfidence: 0,
  reviewsToday: 0,
  history: [],
  chartData: {
    Mon: { positive: 0, negative: 0, neutral: 0 },
    Tue: { positive: 0, negative: 0, neutral: 0 },
    Wed: { positive: 0, negative: 0, neutral: 0 },
    Thu: { positive: 0, negative: 0, neutral: 0 },
    Fri: { positive: 0, negative: 0, neutral: 0 },
    Sat: { positive: 0, negative: 0, neutral: 0 },
    Sun: { positive: 0, negative: 0, neutral: 0 }
  }
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const getTodayDay = () => {
  const d = new Date();
  return daysOfWeek[d.getDay()];
};

const getFormattedTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/* ── TOAST NOTIFICATIONS ─────────────────────── */
const showToast = (title, message, type = 'success') => {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '✨';
  if (type === 'success') icon = '✅';
  else if (type === 'error') icon = '❌';
  else if (type === 'warning') icon = '⚠️';
  else if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Smooth slide out
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
};

/* ── LOCALSTORAGE STATE ───────────────────────── */
const loadState = () => {
  try {
    const savedHistory = localStorage.getItem('reviewsense_history');
    const savedStats = localStorage.getItem('reviewsense_stats');
    
    if (savedHistory) {
      state.history = JSON.parse(savedHistory);
    }
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      state.totalAnalyses = stats.totalAnalyses || 0;
      state.positiveCount = stats.positiveCount || 0;
      state.negativeCount = stats.negativeCount || 0;
      state.neutralCount = stats.neutralCount || 0;
      state.totalConfidence = stats.totalConfidence || 0;
      state.reviewsToday = stats.reviewsToday || 0;
      state.chartData = stats.chartData || state.chartData;
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
};

const saveState = () => {
  try {
    localStorage.setItem('reviewsense_history', JSON.stringify(state.history));
    localStorage.setItem('reviewsense_stats', JSON.stringify({
      totalAnalyses: state.totalAnalyses,
      positiveCount: state.positiveCount,
      negativeCount: state.negativeCount,
      neutralCount: state.neutralCount,
      totalConfidence: state.totalConfidence,
      reviewsToday: state.reviewsToday,
      chartData: state.chartData
    }));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

/* ── METRICS DISPLAY ENGINE ──────────────────── */
const updateMetrics = () => {
  const totalEl = document.getElementById('totalAnalyses');
  const posRateEl = document.getElementById('positiveRate');
  const avgConfEl = document.getElementById('avgConfidence');
  const reviewsTodayEl = document.getElementById('reviewsToday');

  const totalTrendEl = document.getElementById('totalAnalysesTrend');
  const posTrendEl = document.getElementById('positiveRateTrend');
  const avgTrendEl = document.getElementById('avgConfidenceTrend');
  const reviewsTodayTrendEl = document.getElementById('reviewsTodayTrend');

  const total = state.totalAnalyses;

  // 1. Total Analyses
  if (totalEl) {
    totalEl.textContent = total < 10 ? '0' + total : total;
  }
  if (totalTrendEl) {
    totalTrendEl.textContent = total > 0 ? `+${total} total synced` : 'Waiting for data';
    totalTrendEl.className = total > 0 ? 'stat-change positive' : 'stat-change neutral';
  }

  // 2. Positive Rate
  const posRate = total > 0 ? Math.round((state.positiveCount / total) * 100) : 0;
  if (posRateEl) {
    posRateEl.textContent = posRate + '%';
  }
  if (posTrendEl) {
    posTrendEl.textContent = total > 0 ? `${state.positiveCount} of ${total} reviews` : 'Waiting for data';
    posTrendEl.className = total > 0 ? 'stat-change positive' : 'stat-change neutral';
  }

  // 3. Avg Confidence
  const avgConf = total > 0 ? Math.round(state.totalConfidence / total) : 0;
  if (avgConfEl) {
    avgConfEl.textContent = avgConf + '%';
  }
  if (avgTrendEl) {
    avgTrendEl.textContent = total > 0 ? 'Deep learning accuracy' : 'Waiting for data';
    avgTrendEl.className = total > 0 ? 'stat-change positive' : 'stat-change neutral';
  }

  // 4. Reviews Today
  const reviewsToday = state.reviewsToday;
  if (reviewsTodayEl) {
    reviewsTodayEl.textContent = reviewsToday < 10 ? '0' + reviewsToday : reviewsToday;
  }
  if (reviewsTodayTrendEl) {
    reviewsTodayTrendEl.textContent = total > 0 ? 'Active tracking live' : 'Waiting for data';
    reviewsTodayTrendEl.className = total > 0 ? 'stat-change positive' : 'stat-change neutral';
  }
};

/* ── CONFIDENCE RING ANIMATION ───────────────── */
const animateRing = (pct) => {
  const ring = document.getElementById('confidenceRing');
  const pctEl = document.getElementById('confidencePct');
  if (!ring || !pctEl) return;

  const circumference = 314;
  const offset = circumference * (1 - pct / 100);

  let current = parseFloat(ring.getAttribute('data-current') || '0');
  ring.style.strokeDashoffset = offset;
  ring.setAttribute('data-current', pct);

  let start = null;
  const animPct = (timestamp) => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / 800, 1);
    const ease = 1 - Math.pow(1 - prog, 3); // Cubic ease out
    const val = Math.floor(current + (pct - current) * ease);
    pctEl.textContent = val + '%';
    if (prog < 1) requestAnimationFrame(animPct);
  };
  requestAnimationFrame(animPct);
};

/* ── SENTIMENT BAR ANIMATION ─────────────────── */
const animateBar = (id, pctId, value) => {
  const bar = document.getElementById(id);
  const label = document.getElementById(pctId);
  if (!bar || !label) return;
  
  bar.style.width = value + '%';
  label.textContent = value + '%';
};

/* ── TEXTAREA FOCUS & TYPING EFFECT ───────────── */
const textarea = document.getElementById('reviewInput');
const charCount = document.getElementById('charCount');
const textareaContainer = document.querySelector('.textarea-container');

textarea?.addEventListener('focus', () => {
  textareaContainer?.classList.add('focused');
});
textarea?.addEventListener('blur', () => {
  textareaContainer?.classList.remove('focused');
  textareaContainer?.classList.remove('typing');
});
textarea?.addEventListener('input', () => {
  const len = textarea.value.length;
  charCount.textContent = len;
  
  if (len > 0) {
    textareaContainer?.classList.add('typing');
  } else {
    textareaContainer?.classList.remove('typing');
  }

  if (len > 900) charCount.style.color = 'var(--red)';
  else if (len > 700) charCount.style.color = 'var(--violet)';
  else charCount.style.color = '';
});

textarea?.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    analyze();
  }
});

/* ── SAMPLE CHIPS ────────────────────────────── */
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    textarea.value = chip.dataset.text;
    charCount.textContent = chip.dataset.text.length;
    
    if (textareaContainer) {
      textareaContainer.classList.add('typing');
    }
    textarea.focus();
    
    chip.classList.add('clicked');
    setTimeout(() => chip.classList.remove('clicked'), 500);
  });
});

/* ── BRAND SENTIMENT PRESENTATION STYLES ─────── */
const sentimentRules = {
  positive: {
    color: 'var(--pink)',
    tags: ['High Satisfaction', 'Positive Experience', 'Highly Recommended', 'Quality Standard'],
    summaries: [
      'Strong positive sentiment detected. Customer expresses high satisfaction and enthusiasm.',
      'Highly positive review with enthusiastic language. Likely to recommend.',
      'Excellent sentiment score. Indicates strong product/service satisfaction.'
    ]
  },
  negative: {
    color: 'var(--red)',
    tags: ['Critical Issue', 'Dissatisfaction', 'Escalation Alert', 'Refund Risk'],
    summaries: [
      'Strong negative sentiment. Customer is highly dissatisfied with product performance.',
      'Critical review with multiple negative signals. High customer attrition risk.',
      'Negative experience detected. Immediate quality check suggested.'
    ]
  },
  neutral: {
    color: 'var(--blue)',
    tags: ['Moderate Rating', 'Balanced Signals', 'Follow-up Recommended', 'Productive Feedback'],
    summaries: [
      'Neutral sentiment detected. Customer has no strong emotional polarity.',
      'Mixed or average review. Customer suggests functional satisfaction but limited impact.',
      'Standard language detected. Moderate experience score.'
    ]
  }
};

/* ── API BASE URL CONFIGURATION ──────────────── */
const getApiUrl = () => {
  // 1. LocalStorage overrides (useful for testing alternative APIs via console)
  const savedUrl = localStorage.getItem('reviewsense_api_url');
  if (savedUrl) return savedUrl;
  
  // 2. Load from centralized window config object if available
  if (window.ENV_CONFIG && window.ENV_CONFIG.API_BASE_URL) {
    // If local dev or relative resolution disabled, return config URL
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.ENV_CONFIG.AUTO_RESOLVE_RELATIVE) {
      return window.ENV_CONFIG.API_BASE_URL;
    }
  }
  
  // 3. Absolute relative path fallback for unified root/vercel configurations
  return '/predict';
};

/* ── SENTIMENT ANALYSIS ENGINE ───────────────── */
const analyze = async () => {
  const text = textarea.value.trim();
  if (!text) {
    showToast('Empty Input', 'Please type or select a review to analyze.', 'warning');
    textarea.focus();
    if (textareaContainer) {
      textareaContainer.style.borderColor = 'rgba(255,45,120,0.6)';
      setTimeout(() => textareaContainer.style.borderColor = '', 800);
    }
    return;
  }

  const btn = document.getElementById('analyzeBtn');
  const loading = document.getElementById('btnLoading');
  const cards = document.querySelectorAll('.glass-card');
  const aiOverlay = document.getElementById('aiLoadingOverlay');
  
  if (btn && loading) {
    btn.classList.add('loading');
    loading.classList.add('active');
    btn.disabled = true;
  }
  
  if (aiOverlay) {
    aiOverlay.classList.add('active');
  }

  // Trigger smooth card shimmers
  cards.forEach(card => card.classList.add('shimmering'));

  let sentimentVal = '';
  let confidenceVal = 0;
  let success = false;

  const url = getApiUrl();
  
  // Abort controller for timeouts - increased to 60 seconds for Render cold starts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  // Dynamic loading messages for Render cold start
  const subtitleEl = document.querySelector('.ai-loading-subtitle');
  const originalSubtitle = subtitleEl ? subtitleEl.textContent : "Processing neural networks & mapping semantic weights...";
  
  const wakeUpTimeoutId = setTimeout(() => {
    if (subtitleEl) {
      subtitleEl.textContent = "Waking up AI server... This may take a few seconds on first request.";
    }
  }, 3000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ review: text }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    clearTimeout(wakeUpTimeoutId);

    if (response.ok) {
      const data = await response.json();
      
      // Response validation
      if (data && typeof data.sentiment === 'string' && typeof data.confidence === 'number') {
        sentimentVal = data.sentiment;
        confidenceVal = data.confidence;
        success = true;
      } else {
        throw new Error('Response missing required sentiment or confidence parameters.');
      }
    } else {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    clearTimeout(wakeUpTimeoutId);
    console.error('API connection failure:', error);
    
    if (error.name === 'AbortError') {
      showToast('API Timeout', 'The analysis request timed out. Please try again.', 'error');
    } else {
      showToast('Connection Error', 'Could not reach the AI sentiment service. Ensure backend is running.', 'error');
    }
  } finally {
    // Restore original loading subtitle text for next requests
    if (subtitleEl) {
      subtitleEl.textContent = originalSubtitle;
    }
  }

  if (success) {
    const category = sentimentVal.toLowerCase();
    const confidence = Math.round(confidenceVal);

    let posPct = 0, negPct = 0, neutPct = 0;
    if (category === 'positive') {
      posPct = confidence;
      negPct = Math.round((100 - confidence) * 0.4);
      neutPct = 100 - posPct - negPct;
    } else if (category === 'negative') {
      negPct = confidence;
      posPct = Math.round((100 - confidence) * 0.3);
      neutPct = 100 - negPct - posPct;
    } else {
      neutPct = confidence;
      posPct = Math.round((100 - confidence) * 0.6);
      negPct = 100 - neutPct - posPct;
    }

    // Update state
    state.totalAnalyses += 1;
    state.reviewsToday += 1;
    state.totalConfidence += confidence;

    if (category === 'positive') state.positiveCount += 1;
    else if (category === 'negative') state.negativeCount += 1;
    else state.neutralCount += 1;

    const truncatedText = text.length > 80 ? text.slice(0, 78) + '…' : text;
    state.history.unshift({
      text: truncatedText,
      sentiment: category.charAt(0).toUpperCase() + category.slice(1),
      time: getFormattedTime()
    });

    if (state.history.length > 50) {
      state.history.pop();
    }

    const todayDayName = getTodayDay();
    state.chartData[todayDayName][category] += 1;

    saveState();

    // Reset input text
    textarea.value = '';
    charCount.textContent = '0';
    textareaContainer?.classList.remove('typing');

    // Rerender layout
    updateMetrics();
    
    const sentimentEmojiLabel = category === 'positive' ? '😊 Positive' : category === 'negative' ? '😠 Negative' : '😐 Neutral';
    const rules = sentimentRules[category];
    
    updateResult(sentimentEmojiLabel, rules, confidence, posPct, negPct, neutPct);
    renderHistory();
    if (redrawChart) redrawChart();

    showToast('Analysis Succeeded', `Sentiment: ${sentimentVal} (${confidence}% Conf)`, 'success');
  }

  // Clear loading indicators
  if (btn && loading) {
    btn.classList.remove('loading');
    loading.classList.remove('active');
    btn.disabled = false;
  }
  cards.forEach(card => card.classList.remove('shimmering'));
  if (aiOverlay) {
    aiOverlay.classList.remove('active');
  }
};

const updateResult = (sentiment, rules, confidence, pos, neg, neut) => {
  animateRing(Math.round(confidence));

  animateBar('posBar', 'posPct', pos);
  animateBar('negBar', 'negPct', neg);
  animateBar('neutBar', 'neutPct', neut);

  const placeholder = document.getElementById('resultPlaceholder');
  const content = document.getElementById('resultContent');
  const sentEl = document.getElementById('resultSentiment');
  const summEl = document.getElementById('resultSummary');
  const tagsEl = document.getElementById('resultTags');

  if (placeholder && content && sentEl && summEl && tagsEl) {
    placeholder.style.display = 'none';
    content.classList.remove('hidden');

    sentEl.textContent = sentiment;
    sentEl.style.background = rules.color === 'var(--pink)'
      ? 'linear-gradient(135deg, var(--pink), #ff6030)'
      : rules.color === 'var(--red)'
      ? 'linear-gradient(135deg, var(--red), #ff8c00)'
      : 'linear-gradient(135deg, var(--blue), var(--cyan))';
    sentEl.style.webkitBackgroundClip = 'text';
    sentEl.style.webkitTextFillColor = 'transparent';
    sentEl.style.backgroundClip = 'text';

    summEl.textContent = rules.summaries[Math.floor(Math.random() * rules.summaries.length)];

    tagsEl.innerHTML = rules.tags.map(tag =>
      `<span class="result-tag">${tag}</span>`
    ).join('');
  }
};

/* ── HISTORY RENDER ENGINE ───────────────────── */
const renderHistory = () => {
  const list = document.getElementById('historyList');
  if (!list) return;

  if (state.history.length === 0) {
    list.innerHTML = `
      <div class="history-empty" id="historyEmpty">
        <div class="empty-icon-wrap">
          <svg class="empty-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke-linecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke-linecap="round"/>
            <path d="M9 12H15M9 16H13" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="empty-title">History Empty</div>
        <div class="empty-desc">Your analyses will appear here</div>
      </div>
    `;
    return;
  }

  list.innerHTML = state.history.map(item => {
    const sentimentClass = item.sentiment.toLowerCase();
    return `
      <div class="history-item">
        <div class="history-item-top">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="history-sentiment-dot dot-${sentimentClass}"></span>
            <span class="history-label label-${sentimentClass}">${item.sentiment}</span>
          </div>
          <span class="history-time">${item.time}</span>
        </div>
        <div class="history-text">${item.text}</div>
      </div>
    `;
  }).join('');
};

/* ── ANALYZE BUTTON ──────────────────────────── */
document.getElementById('analyzeBtn')?.addEventListener('click', analyze);

/* ── SENTIMENT CHART ─────────────────────────── */
let redrawChart = () => {};

(function initChart() {
  const canvas = document.getElementById('sentimentChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Current interpolated values for smooth transitions
  let currentPos = [0, 0, 0, 0, 0, 0, 0];
  let currentNeg = [0, 0, 0, 0, 0, 0, 0];
  let currentNeut = [0, 0, 0, 0, 0, 0, 0];

  let animFrameId = null;

  const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    triggerDraw();
  };

  const triggerDraw = () => {
    // Cancel previous animations
    if (animFrameId) cancelAnimationFrame(animFrameId);
    
    // Extract target values from current state
    const targetPos = days.map(d => {
      const dayData = state.chartData[d];
      const total = dayData.positive + dayData.negative + dayData.neutral;
      return total > 0 ? Math.round((dayData.positive / total) * 100) : 0;
    });
    const targetNeg = days.map(d => {
      const dayData = state.chartData[d];
      const total = dayData.positive + dayData.negative + dayData.neutral;
      return total > 0 ? Math.round((dayData.negative / total) * 100) : 0;
    });
    const targetNeut = days.map(d => {
      const dayData = state.chartData[d];
      const total = dayData.positive + dayData.negative + dayData.neutral;
      return total > 0 ? Math.round((dayData.neutral / total) * 100) : 0;
    });

    const animate = () => {
      let active = false;
      const ease = 0.08; // Easing speed

      for (let i = 0; i < 7; i++) {
        const diffPos = targetPos[i] - currentPos[i];
        const diffNeg = targetNeg[i] - currentNeg[i];
        const diffNeut = targetNeut[i] - currentNeut[i];

        if (Math.abs(diffPos) > 0.1) { currentPos[i] += diffPos * ease; active = true; }
        else { currentPos[i] = targetPos[i]; }

        if (Math.abs(diffNeg) > 0.1) { currentNeg[i] += diffNeg * ease; active = true; }
        else { currentNeg[i] = targetNeg[i]; }

        if (Math.abs(diffNeut) > 0.1) { currentNeut[i] += diffNeut * ease; active = true; }
        else { currentNeut[i] = targetNeut[i]; }
      }

      renderCanvas(currentPos, currentNeg, currentNeut);

      if (active) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const renderCanvas = (posData, negData, neutData) => {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padL = 35, padR = 16, padT = 16, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const n = days.length;
    const stepX = chartW / (n - 1);

    // Draw Y-axis grid lines and labels
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + chartW, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText((100 - i * 25) + '%', padL - 8, y + 3.5);
    }

    // Draw X-axis day labels
    ctx.textAlign = 'center';
    days.forEach((d, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillText(d, padL + i * stepX, H - 8);
    });

    if (state.totalAnalyses === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.font = '500 12.5px Inter, sans-serif';
      ctx.fillText('Waiting for AI review input to plot trends...', W / 2 + 10, H / 2);
      return;
    }

    const drawLine = (data, color, alpha = 0.8) => {
      const pts = data.map((v, i) => ({
        x: padL + i * stepX,
        y: padT + chartH - (v / 100) * chartH
      }));

      // Draw Gradient Area Fill under the bezier line
      const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
      const startColor = color.includes('var') 
        ? (color.includes('pink') ? 'rgba(255,45,120,0.18)' : color.includes('red') ? 'rgba(255,26,74,0.18)' : 'rgba(59,130,246,0.18)')
        : color;
      grad.addColorStop(0, startColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const cpX = (pts[i-1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(cpX, pts[i-1].y, cpX, pts[i].y, pts[i].x, pts[i].y);
      }
      ctx.lineTo(pts[pts.length-1].x, padT + chartH);
      ctx.lineTo(pts[0].x, padT + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw the Bezier Line Stroke itself
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const cpX = (pts[i-1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(cpX, pts[i-1].y, cpX, pts[i].y, pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = color.includes('var') ? (color.includes('pink') ? '#ff2d78' : color.includes('red') ? '#ff1a4a' : '#3b82f6') : color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = alpha;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw interactive nodes (dots) representing active days
      pts.forEach((pt, i) => {
        const d = days[i];
        const dayTotal = state.chartData[d].positive + state.chartData[d].negative + state.chartData[d].neutral;
        if (dayTotal > 0) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    };

    drawLine(neutData, 'var(--blue)', 0.7);
    drawLine(negData,  'var(--red)', 0.7);
    drawLine(posData,  'var(--pink)', 0.85);
  };

  redrawChart = triggerDraw;
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);
})();

/* ── KEYBOARD SEARCH SHORTCUT ─────────────────── */
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.navbar-search input')?.focus();
  }
});

/* ── INITIALIZATION ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  document.querySelectorAll('.glass-card').forEach((card, i) => {
    card.style.animationDelay = `${0.1 + i * 0.05}s`;
  });
  
  updateMetrics();
  renderHistory();

  const initialAvgConf = state.totalAnalyses > 0 ? Math.round(state.totalConfidence / state.totalAnalyses) : 0;
  animateRing(initialAvgConf);
});
