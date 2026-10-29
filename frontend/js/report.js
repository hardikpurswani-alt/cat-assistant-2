/* ──────────────────────────────────────────────
   Report generation: PDF (print) and TXT
   ────────────────────────────────────────────── */

function downloadAsTXT() {
    closeModal('downloadModal');
    const baseApi = window.API || (typeof API !== 'undefined' ? API : window.location.origin);
    const sid = window.SESSION_ID || (typeof SESSION_ID !== 'undefined' ? SESSION_ID : localStorage.getItem('SESSION_ID') || '');
    const url = baseApi + '/api/report/' + sid;
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbt-report-${sid || 'summary'}.txt`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
    }, 1000);
}

async function downloadAsPDF() {
    closeModal('downloadModal');

    // Immediately open target window in synchronous user click handler to avoid popup blockers
    let win = null;
    try {
        win = window.open('about:blank', '_blank');
        if (win && win.document) {
            win.document.write('<!DOCTYPE html><html><head><title>Generating CBT Summary...</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:80vh;color:#444;background:#f8f7f5;margin:0;}</style></head><body><div style="text-align:center;padding:24px;"><h2>Generating CBT Summary Report...</h2><p style="color:#777;">Collecting diary entries, assessments, and mood tracking data...</p></div></body></html>');
        }
    } catch (e) {
        console.warn('Direct popup creation intercepted:', e);
    }

    const baseApi = window.API || (typeof API !== 'undefined' ? API : window.location.origin);
    const sid = window.SESSION_ID || (typeof SESSION_ID !== 'undefined' ? SESSION_ID : localStorage.getItem('SESSION_ID') || '');

    // Collect all data
    const moodLog = JSON.parse(localStorage.getItem('moodLog') || '[]');
    const sleepLog = JSON.parse(localStorage.getItem('sleepLog') || '[]');
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const phqHist = JSON.parse(localStorage.getItem('phqHistory') || '[]');
    const gadHist = JSON.parse(localStorage.getItem('gadHistory') || '[]');

    let thoughts = [];
    try {
        const res = await fetch(baseApi + '/api/thoughts/' + sid).then(r => r.json());
        thoughts = res.thought_records || [];
    } catch (_) { }

    // Stats
    const avgMood = moodLog.length
        ? (moodLog.slice(-14).reduce((a, e) => a + e.score, 0) / Math.min(moodLog.length, 14)).toFixed(1)
        : null;
    const avgSleep = sleepLog.length
        ? (sleepLog.slice(-7).reduce((a, e) => a + parseFloat(e.durHrs || e.hours || 0), 0) / Math.min(sleepLog.length, 7)).toFixed(1)
        : null;
    const doneActs = activities.filter(a => a.done).length;
    const lastPHQ = phqHist.length ? phqHist[phqHist.length - 1] : null;
    const lastGAD = gadHist.length ? gadHist[gadHist.length - 1] : null;

    // Build mood chart data (last 14 entries)
    const moodRecent = [...moodLog].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14);
    const moodLabels = moodRecent.map(e => {
        const d = new Date(e.date);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    });
    const moodScores = moodRecent.map(e => e.score);

    // Sleep chart data (last 7 entries)
    const sleepRecent = [...sleepLog].sort((a, b) => new Date(a.isoDate || 0) - new Date(b.isoDate || 0)).slice(-7);
    const sleepLabels = sleepRecent.map(e => {
        const d = new Date(e.isoDate || Date.now());
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    });
    const sleepHours = sleepRecent.map(e => parseFloat(e.durHrs || e.hours || 0));
    const sleepQuality = sleepRecent.map(e => parseFloat(e.quality || 0));

    // Thought records (last 10)
    const thoughtsHTML = thoughts.slice(-10).reverse().map(r => {
        const d = new Date(r.timestamp);
        const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) +
            ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="thought-card">
                <div class="thought-date">${dateStr}</div>
                ${r.situation ? `<div class="field"><span class="label">Situation</span><span class="value">${r.situation}</span></div>` : ''}
                ${r.thought ? `<div class="field"><span class="label">Thought</span><span class="value">${r.thought}</span></div>` : ''}
                ${r.emotion ? `<div class="field"><span class="label">Emotion</span><span class="value">${r.emotion}${r.intensity ? ' · ' + r.intensity + '/10' : ''}</span></div>` : ''}
                ${r.rational_response ? `<div class="field"><span class="label">Rational Response</span><span class="value">${r.rational_response}</span></div>` : ''}
                ${r.distortion ? `<div class="distortion-tag">${r.distortion}</div>` : ''}
            </div>`;
    }).join('');

    // PHQ/GAD history rows
    const testRows = [...phqHist.map(e => ({ ...e, type: 'PHQ-9' })),
    ...gadHist.map(e => ({ ...e, type: 'GAD-7' }))]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
        .map(e => {
            const d = new Date(e.date);
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            return `<tr><td>${e.type}</td><td>${dateStr}</td><td><strong>${e.score}</strong></td><td>${e.interpretation || e.level || '—'}</td></tr>`;
        }).join('');

    // Activities
    const actRows = activities.slice(-15).map(a =>
        `<tr><td>${a.text || a.activity_text || '—'}</td><td>${a.done ? '✓ Completed' : '○ Planned'}</td></tr>`
    ).join('');

    const now = new Date();
    const reportDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CBT Discharge Summary · ${reportDate}</title>
<script src="/vendor/chart.min.js"><\/script>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f7f5; color: #1a1a2e; font-size: 13px; }
  .page { max-width: 820px; margin: 0 auto; padding: 40px 48px; }

  /* Header */
  .report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; padding-bottom: 20px; border-bottom: 2px solid #797298; }
  .report-title { font-size: 26px; font-weight: 700; color: #1a1a2e; }
  .report-subtitle { font-size: 13px; color: #888; margin-top: 4px; }
  .report-date { text-align: right; font-size: 12px; color: #888; }
  .report-badge { background: #797298; color: #fff; font-size: 11px; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-top: 6px; }

  /* Stats */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 36px; }
  .stat-card { background: #fff; border-radius: 12px; padding: 16px; border-left: 3px solid #797298; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .stat-val { font-size: 24px; font-weight: 700; color: #1a1a2e; }
  .stat-label { font-size: 11px; color: #888; margin-top: 3px; }

  /* Sections */
  .section { background: #fff; border-radius: 14px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .section-title { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; padding-bottom: 10px; border-bottom: 1px solid #f0eef8; }
  .section-title::before { content: ''; display: inline-block; width: 4px; height: 16px; background: #797298; border-radius: 2px; }

  /* Thought cards */
  .thought-card { border: 1px solid #f0eef8; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
  .thought-card:last-child { margin-bottom: 0; }
  .thought-date { font-size: 11px; color: #888; margin-bottom: 10px; }
  .field { display: flex; gap: 8px; margin-bottom: 7px; font-size: 13px; }
  .label { min-width: 130px; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; padding-top: 2px; }
  .value { flex: 1; line-height: 1.55; color: #1a1a2e; }
  .distortion-tag { display: inline-block; background: #f0eef8; color: #797298; border-radius: 20px; padding: 3px 10px; font-size: 11px; margin-top: 6px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #aaa; font-weight: 700; padding: 0 0 10px; border-bottom: 1px solid #f0eef8; }
  td { padding: 8px 0; border-bottom: 1px solid #f8f7f5; vertical-align: top; }
  tr:last-child td { border-bottom: none; }

  /* Charts */
  .chart-wrap { position: relative; height: 160px; margin-top: 8px; }

  /* Empty */
  .empty { color: #aaa; font-size: 13px; text-align: center; padding: 20px 0; }

  /* Footer */
  .report-footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #bbb; text-align: center; }

  /* Print */
  @media print {
    body { background: #fff; }
    .page { padding: 20px 30px; }
    .no-print { display: none !important; }
    .section { box-shadow: none; border: 1px solid #eee; page-break-inside: avoid; }
    .thought-card { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="report-header">
    <div>
      <div class="report-title">CBT Summary Report</div>
      <div class="report-subtitle">Thought Diary · Mood · Sleep · Activities</div>
    </div>
    <div class="report-date">
      <div>${reportDate}</div>
      <div class="report-badge">Automated Summary</div>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-val">${avgMood ?? '—'}</div>
      <div class="stat-label">Average Mood (14d)</div>
    </div>
    <div class="stat-card" style="border-left-color:#38bdf8;">
      <div class="stat-val">${avgSleep ? avgSleep + 'h' : '—'}</div>
      <div class="stat-label">Average Sleep (7d)</div>
    </div>
    <div class="stat-card" style="border-left-color:#10b981;">
      <div class="stat-val">${doneActs}</div>
      <div class="stat-label">Activities Completed</div>
    </div>
    <div class="stat-card" style="border-left-color:${lastPHQ ? '#f59e0b' : '#ccc'};">
      <div class="stat-val">${lastPHQ ? lastPHQ.score : '—'}</div>
      <div class="stat-label">Latest PHQ-9</div>
    </div>
  </div>

  <!-- Mood Chart -->
  ${moodScores.length >= 2 ? `
  <div class="section">
    <div class="section-title">Mood — Recent ${moodScores.length} Entries</div>
    <div class="chart-wrap"><canvas id="moodChart"></canvas></div>
  </div>` : ''}

  <!-- Sleep Chart -->
  ${sleepHours.length >= 2 ? `
  <div class="section">
    <div class="section-title">Sleep — Recent ${sleepHours.length} Days</div>
    <div class="chart-wrap"><canvas id="sleepChart"></canvas></div>
  </div>` : ''}

  <!-- Thought diary -->
  <div class="section">
    <div class="section-title">Thought Diary (Recent ${Math.min(thoughts.length, 10)} Entries)</div>
    ${thoughtsHTML || '<div class="empty">No entries recorded</div>'}
  </div>

  <!-- Tests -->
  ${testRows ? `
  <div class="section">
    <div class="section-title">Assessment Results</div>
    <table>
      <thead><tr><th>Test</th><th>Date</th><th>Score</th><th>Interpretation</th></tr></thead>
      <tbody>${testRows}</tbody>
    </table>
  </div>` : ''}

  <!-- Activities -->
  ${actRows ? `
  <div class="section">
    <div class="section-title">Activities</div>
    <table>
      <thead><tr><th>Task</th><th>Status</th></tr></thead>
      <tbody>${actRows}</tbody>
    </table>
  </div>` : ''}

  <div class="report-footer">
    Generated by CBT Assistant · Educational tool, not a medical diagnosis
  </div>

  <!-- Print button (hidden in print) -->
  <div class="no-print" style="text-align:center;margin-top:28px;">
    <button onclick="window.print()" style="background:#797298;color:#fff;border:none;border-radius:24px;padding:12px 32px;font-size:14px;cursor:pointer;font-family:inherit;">
      ↓ Save as PDF
    </button>
    <p style="color:#aaa;font-size:11px;margin-top:8px;">Select "Save as PDF" in the print dialog</p>
  </div>
</div>

<script>
const MOOD_LABELS  = ${JSON.stringify(moodLabels)};
const MOOD_SCORES  = ${JSON.stringify(moodScores)};
const SLEEP_LABELS  = ${JSON.stringify(sleepLabels)};
const SLEEP_HOURS   = ${JSON.stringify(sleepHours)};
const SLEEP_QUALITY = ${JSON.stringify(sleepQuality)};

window.addEventListener('load', () => {
  if (MOOD_SCORES.length >= 2) {
    new Chart(document.getElementById('moodChart'), {
      type: 'line',
      data: {
        labels: MOOD_LABELS,
        datasets: [{
          label: 'Mood',
          data: MOOD_SCORES,
          borderColor: '#797298',
          backgroundColor: 'rgba(121,114,152,0.12)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#797298',
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 10, grid: { color: '#f0eef8' }, ticks: { font: { size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }
  if (SLEEP_HOURS.length >= 2) {
    new Chart(document.getElementById('sleepChart'), {
      type: 'bar',
      data: {
        labels: SLEEP_LABELS,
        datasets: [
          { label: 'Sleep Hours', data: SLEEP_HOURS, backgroundColor: 'rgba(56,189,248,0.7)', borderRadius: 6, yAxisID: 'y' },
          { label: 'Sleep Quality', data: SLEEP_QUALITY, type: 'line', borderColor: '#f59e0b', pointBackgroundColor: '#f59e0b', borderWidth: 2, pointRadius: 3, tension: 0.4, yAxisID: 'y2' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } },
        scales: {
          y:  { min: 0, max: 12, grid: { color: '#f0eef8' }, ticks: { font: { size: 11 } }, title: { display: true, text: 'Hours', font: { size: 10 } } },
          y2: { min: 0, max: 10, position: 'right', grid: { display: false }, ticks: { font: { size: 11 } }, title: { display: true, text: 'Quality', font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }
});
<\/script>
</body>
</html>`;

    if (win && !win.closed) {
        try {
            win.document.open();
            win.document.write(html);
            win.document.close();
            return;
        } catch (e) {
            console.warn('Writing to pre-opened window failed:', e);
        }
    }

    // Fallback if popup blocker intercepted win or if writing failed:
    try {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            if (a.parentNode) document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        }, 15000);
    } catch (err) {
        console.error('Failed to render report window/blob:', err);
    }
}

window.downloadAsPDF = downloadAsPDF;
window.downloadAsTXT = downloadAsTXT;
