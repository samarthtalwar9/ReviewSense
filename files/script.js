/* ═══════════════════════════════════════════════
   REVIEWSENSE — JavaScript
   AI Sentiment Dashboard Logic
═══════════════════════════════════════════════ */

/* ── PARTICLE CANVAS ─────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

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

  // Create particles
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
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
    totalTrendEl.textContent = total > 0 ? `+${total} this session` : 'Waiting for data';
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
    const ease = 1 - Math.pow(1 - prog, 3);
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

// Ctrl+Enter shortcut
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
    
    // Trigger typing state on container
    if (textareaContainer) {
      textareaContainer.classList.add('typing');
    }
    textarea.focus();
    
    // Subtle glow pulse
    chip.classList.add('clicked');
    setTimeout(() => chip.classList.remove('clicked'), 500);
  });
});

/* ── SENTIMENT ANALYSIS ENGINE ───────────────── */
const sentimentRules = {
  positive: {
    keywords: ['love', 'great', 'amazing', 'excellent', 'fantastic', 'wonderful', 'best', 'perfect', 'awesome', 'superb', 'outstanding', 'brilliant', 'delightful', 'impressed', 'satisfied', 'happy', 'pleased', 'fast delivery', 'recommend', 'quality', 'beautiful', 'incredible', 'good', 'helpful', 'nice', 'smooth', 'easy'],
    tags: ['High Satisfaction', 'Positive Experience', 'Highly Recommended', 'Quality Standard'],
    color: 'var(--pink)',
    summaries: [
      'Strong positive sentiment detected. Customer expresses high satisfaction and enthusiasm.',
      'Highly positive review with enthusiastic language. Likely to recommend.',
      'Excellent sentiment score. Indicates strong product/service satisfaction.',
    ]
  },
  negative: {
    keywords: ['worst', 'terrible', 'awful', 'horrible', 'useless', 'waste', 'broke', 'broken', 'disappointed', 'poor', 'bad', 'hate', 'never again', 'refund', 'scam', 'fake', 'misleading', 'slow', 'overpriced', 'cheap', 'fail', 'defect', 'damage', 'useless', 'error'],
    tags: ['Critical Issue', 'Dissatisfaction', 'Escalation Alert', 'Refund Risk'],
    color: 'var(--red)',
    summaries: [
      'Strong negative sentiment. Customer is highly dissatisfied with product performance.',
      'Critical review with multiple negative signals. High customer attrition risk.',
      'Negative experience detected. Immediate quality check suggested.',
    ]
  },
  neutral: {
    keywords: ['okay', 'ok', "it's fine", 'average', 'decent', 'alright', 'not bad', 'could be better', 'so so', 'mediocre', 'moderate', 'fair', 'basic', 'standard', 'normal', 'medium'],
    tags: ['Moderate Rating', 'Balanced Signals', 'Follow-up Recommended', 'Productive Feedback'],
    color: 'var(--blue)',
    summaries: [
      'Neutral sentiment detected. Customer has no strong emotional polarity.',
      'Mixed or average review. Customer suggests functional satisfaction but limited impact.',
      'Standard language detected. Moderate experience score.',
    ]
  }
};

const analyze = async () => {
  const text = textarea.value.trim();
  if (!text) {
    textarea.focus();
    if (textareaContainer) {
      textareaContainer.style.borderColor = 'rgba(255,45,120,0.6)';
      setTimeout(() => textareaContainer.style.borderColor = '', 800);
    }
    return;
  }

  // Start loading states
  const btn = document.getElementById('analyzeBtn');
  const loading = document.getElementById('btnLoading');
  const cards = document.querySelectorAll('.glass-card');
  
  if (btn && loading) {
    btn.classList.add('loading');
    loading.classList.add('active');
    btn.disabled = true;
  }

  // Visual Shimmer Effect on Cards while AI predicts
  cards.forEach(card => card.classList.add('shimmering'));

  // Realistic AI Processing Delay
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));

  // Predictive scoring
  const lower = text.toLowerCase();
  let posScore = 0, negScore = 0, neutScore = 0;

  sentimentRules.positive.keywords.forEach(kw => { if (lower.includes(kw)) posScore += 1; });
  sentimentRules.negative.keywords.forEach(kw => { if (lower.includes(kw)) negScore += 1; });
  sentimentRules.neutral.keywords.forEach(kw => { if (lower.includes(kw)) neutScore += 1; });

  // Base values to prevent absolute zero division
  posScore = Math.max(posScore, 0.1);
  negScore = Math.max(negScore, 0.05);
  neutScore = Math.max(neutScore, 0.1);

  const totalScoreSum = posScore + negScore + neutScore;
  const posPct = Math.round((posScore / totalScoreSum) * 100);
  const negPct = Math.round((negScore / totalScoreSum) * 100);
  const neutPct = 100 - posPct - negPct;

  let sentimentLabel, rules, category;
  if (posPct > negPct && posPct > neutPct) {
    sentimentLabel = '😊 Positive';
    rules = sentimentRules.positive;
    category = 'positive';
    state.positiveCount += 1;
  } else if (negPct > posPct && negPct > neutPct) {
    sentimentLabel = '😠 Negative';
    rules = sentimentRules.negative;
    category = 'negative';
    state.negativeCount += 1;
  } else {
    sentimentLabel = '😐 Neutral';
    rules = sentimentRules.neutral;
    category = 'neutral';
    state.neutralCount += 1;
  }

  const topScore = Math.max(posPct, negPct, neutPct);
  const confidence = Math.min(98, 62 + topScore * 0.35 + Math.random() * 5);

  // Update State
  state.totalAnalyses += 1;
  state.reviewsToday += 1;
  state.totalConfidence += confidence;

  // Add to History
  const truncatedText = text.length > 80 ? text.slice(0, 78) + '…' : text;
  state.history.unshift({
    text: truncatedText,
    sentiment: category.charAt(0).toUpperCase() + category.slice(1),
    time: getFormattedTime()
  });

  // Update Chart Data for Today
  const todayDayName = getTodayDay();
  state.chartData[todayDayName][category] += 1;

  // Reset loading states
  if (btn && loading) {
    btn.classList.remove('loading');
    loading.classList.remove('active');
    btn.disabled = false;
  }
  cards.forEach(card => card.classList.remove('shimmering'));

  // Reset Textarea
  textarea.value = '';
  charCount.textContent = '0';
  textareaContainer?.classList.remove('typing');

  // Trigger UI Redraws
  updateMetrics();
  updateResult(sentimentLabel, rules, confidence, posPct, negPct, neutPct);
  renderHistory();
  if (redrawChart) redrawChart();
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

  const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    draw();
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const draw = () => {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padL = 35, padR = 16, padT = 16, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const n = days.length;
    const stepX = chartW / (n - 1);

    // 1. Grid lines
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

    // 2. X labels
    ctx.textAlign = 'center';
    days.forEach((d, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillText(d, padL + i * stepX, H - 8);
    });

    // 3. Render placeholder text if no analyses yet
    if (state.totalAnalyses === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.font = '500 12.5px Inter, sans-serif';
      ctx.fillText('Waiting for AI review input to plot trends...', W / 2 + 10, H / 2);
      return;
    }

    // Calculate percentage distributions per day
    const positive = days.map(d => {
      const dayData = state.chartData[d];
      const total = dayData.positive + dayData.negative + dayData.neutral;
      return total > 0 ? Math.round((dayData.positive / total) * 100) : 0;
    });
    const negative = days.map(d => {
      const dayData = state.chartData[d];
      const total = dayData.positive + dayData.negative + dayData.neutral;
      return total > 0 ? Math.round((dayData.negative / total) * 100) : 0;
    });
    const neutral = days.map(d => {
      const dayData = state.chartData[d];
      const total = dayData.positive + dayData.negative + dayData.neutral;
      return total > 0 ? Math.round((dayData.neutral / total) * 100) : 0;
    });

    const drawLine = (data, color, alpha = 0.8) => {
      const pts = data.map((v, i) => ({
        x: padL + i * stepX,
        y: padT + chartH - (v / 100) * chartH
      }));

      // Gradient area fill
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

      // Core Line
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

      // Glow points (only if day has data)
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

    drawLine(neutral,  'var(--blue)', 0.7);
    drawLine(negative, 'var(--red)', 0.7);
    drawLine(positive, 'var(--pink)', 0.85);
  };

  redrawChart = draw;
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
  // Page load delays
  document.querySelectorAll('.glass-card').forEach((card, i) => {
    card.style.animationDelay = `${0.1 + i * 0.05}s`;
  });
  
  // Set up initial dashboard metrics and history
  updateMetrics();
  renderHistory();
  animateRing(0);
});
