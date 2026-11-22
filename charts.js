/**
 * charts.js — Canvas Chart Rendering
 * Yayasan Wihdatul Muslimat Dashboard
 */

/** Draw a bar chart on a canvas element */
function drawBarChart(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const W = rect.width || 400;
  const H = parseInt(canvas.getAttribute('height')) || 180;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, W, H);

  const padL = 44, padR = 16, padT = 16, padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const max = Math.max(...data, 1);
  const barW = Math.min(44, (chartW / data.length) * 0.55);
  const gap = chartW / data.length;

  // Gridlines
  const gridLines = 4;
  ctx.strokeStyle = '#e4ece7';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i <= gridLines; i++) {
    const y = padT + chartH - (i / gridLines) * chartH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + chartW, y);
    ctx.stroke();
    // Y-axis label
    ctx.fillStyle = '#6b7c73';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    const val = Math.round((i / gridLines) * max);
    ctx.fillText(val, padL - 5, y + 3.5);
  }
  ctx.setLineDash([]);

  // Bars
  data.forEach((val, i) => {
    const x = padL + i * gap + gap / 2 - barW / 2;
    const barH = val === 0 ? 3 : Math.max(6, (val / max) * chartH);
    const y = padT + chartH - barH;
    const color = colors ? colors[i % colors.length] : '#087443';

    // Shadow bar (lighter)
    ctx.fillStyle = color + '30';
    ctx.beginPath();
    roundRect(ctx, x, padT + chartH - (val / max) * chartH * 1.0 - 4, barW, (val / max) * chartH * 1.0 + 4, [4, 4, 0, 0]);
    ctx.fill();

    // Main bar
    ctx.fillStyle = color;
    ctx.beginPath();
    roundRect(ctx, x, y, barW, barH, [5, 5, 0, 0]);
    ctx.fill();

    // Value label on top
    if (val > 0) {
      ctx.fillStyle = '#1e2d27';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val, x + barW / 2, y - 4);
    }

    // X-axis label
    ctx.fillStyle = '#6b7c73';
    ctx.font = '10.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    const shortLabel = labels[i] ? labels[i].substring(0, 10) : '';
    ctx.fillText(shortLabel, x + barW / 2, padT + chartH + 16);
  });

  // X axis line
  ctx.strokeStyle = '#e4ece7';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(padL, padT + chartH);
  ctx.lineTo(padL + chartW, padT + chartH);
  ctx.stroke();
}

/** Draw a line chart */
function drawLineChart(canvasId, labels, datasets) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const W = rect.width || 400;
  const H = parseInt(canvas.getAttribute('height')) || 200;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const padL = 44, padR = 20, padT = 20, padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const allVals = datasets.flatMap(d => d.data);
  const max = Math.max(...allVals, 1);
  const n = labels.length;

  // Gridlines & Y labels
  const gridLines = 4;
  ctx.strokeStyle = '#e4ece7';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i <= gridLines; i++) {
    const y = padT + chartH - (i / gridLines) * chartH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
    ctx.fillStyle = '#6b7c73';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / gridLines) * max), padL - 5, y + 3.5);
  }
  ctx.setLineDash([]);

  // X labels
  labels.forEach((lb, i) => {
    const x = padL + (i / (n - 1 || 1)) * chartW;
    ctx.fillStyle = '#6b7c73';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lb.substring(0, 4), x, padT + chartH + 16);
  });

  // Lines
  const lineColors = ['#087443', '#2563eb', '#d97706'];
  datasets.forEach((ds, di) => {
    const color = ds.color || lineColors[di % lineColors.length];
    const pts = ds.data.map((v, i) => ({
      x: padL + (i / (n - 1 || 1)) * chartW,
      y: padT + chartH - (v / max) * chartH
    }));

    // Fill area
    ctx.beginPath();
    ctx.moveTo(pts[0].x, padT + chartH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, padT + chartH);
    ctx.closePath();
    ctx.fillStyle = color + '18';
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });
}

/** Draw a pie/donut chart */
function drawPieChart(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const H = parseInt(canvas.getAttribute('height')) || 200;
  const W = H; // square
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) {
    ctx.fillStyle = '#e4ece7';
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, H / 2 - 10, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const cx = W / 2, cy = H / 2, r = H / 2 - 10, innerR = r * 0.55;
  let startAngle = -Math.PI / 2;

  data.forEach((val, i) => {
    if (val === 0) return;
    const slice = (val / total) * Math.PI * 2;
    const color = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += slice;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Center label
  ctx.fillStyle = '#1e2d27';
  ctx.font = `bold ${Math.round(H * 0.14)}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy - 6);
  ctx.font = `${Math.round(H * 0.085)}px Inter, sans-serif`;
  ctx.fillStyle = '#6b7c73';
  ctx.fillText('total', cx, cy + 12);
}

/** Render all charts for the Overview page */
function renderOverviewChart(db) {
  const labels = ['Anak Asuh', 'Lansia', 'Kegiatan', 'Transaksi'];
  const data   = [db.anak.length, db.lansia.length, db.kegiatan.length, db.keuangan.length];
  const colors = ['#087443', '#2563eb', '#d97706', '#dc3545'];
  drawBarChart('barChart', labels, data, colors);
}

/** Render charts for Laporan page */
function renderLaporanCharts(db) {
  // Line: kegiatan per month (last 6 months)
  const months = [];
  const counts = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleDateString('id-ID', { month: 'short' }));
    const mo = d.getMonth();
    const yr = d.getFullYear();
    counts.push(db.kegiatan.filter(k => {
      if (!k.tgl) return false;
      const kd = new Date(k.tgl);
      return kd.getMonth() === mo && kd.getFullYear() === yr;
    }).length);
  }
  drawLineChart('lineChart', months, [{ data: counts, color: '#087443' }]);

  // Pie: kategori anak asuh
  const cats = ['Yatim', 'Piatu', 'Yatim Piatu', 'Dhuafa'];
  const catColors = ['#087443', '#2563eb', '#7c3aed', '#d97706'];
  const catData = cats.map(c => db.anak.filter(a => a.kategori === c).length);
  drawPieChart('pieChart', cats, catData, catColors);

  // Legend
  const legend = document.getElementById('pieLegend');
  if (legend) {
    legend.innerHTML = cats.map((c, i) =>
      `<div class="legend-item"><div class="legend-dot" style="background:${catColors[i]}"></div>${c}: <b>${catData[i]}</b></div>`
    ).join('');
  }
}

/** Helper: draw rounded rect path */
function roundRect(ctx, x, y, w, h, radii) {
  const [tl, tr, br, bl] = Array.isArray(radii)
    ? [...radii, ...radii].slice(0, 4)
    : [radii, radii, radii, radii];
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
}

// Re-draw charts when window resizes
let _chartResizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(_chartResizeTimer);
  _chartResizeTimer = setTimeout(() => {
    if (window._appDb) {
      renderOverviewChart(window._appDb);
      renderLaporanCharts(window._appDb);
    }
  }, 180);
});
