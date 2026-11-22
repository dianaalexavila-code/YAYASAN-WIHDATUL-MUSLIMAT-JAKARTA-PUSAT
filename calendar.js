/**
 * calendar.js — Calendar Widget
 * Yayasan Wihdatul Muslimat Dashboard
 */

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const HARI_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

let miniCalDate = new Date();
let fullCalDate = new Date();

/** Build a set of event dates from db.kegiatan */
function buildEventDates(kegiatan) {
  const map = {}; // key: 'YYYY-MM-DD' → array of event names
  kegiatan.forEach(k => {
    if (!k.tgl) return;
    if (!map[k.tgl]) map[k.tgl] = [];
    map[k.tgl].push(k.nama);
  });
  return map;
}

/** Render mini calendar (Overview page) */
function renderMiniCal(kegiatan) {
  const y = miniCalDate.getFullYear();
  const m = miniCalDate.getMonth();
  const today = new Date();
  const events = buildEventDates(kegiatan);

  const titleEl = document.getElementById('miniCalTitle');
  if (titleEl) titleEl.textContent = BULAN[m] + ' ' + y;

  const headEl = document.getElementById('miniCalHead');
  if (headEl) headEl.innerHTML = HARI.map(h => `<span>${h}</span>`).join('');

  const gridEl = document.getElementById('miniCalGrid');
  if (!gridEl) return;

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  let html = '';

  for (let i = 0; i < firstDay; i++) html += '<button disabled style="visibility:hidden"></button>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    const hasEv = !!events[dateStr];
    const cls = [isToday ? 'today' : '', hasEv && !isToday ? 'has-event' : ''].filter(Boolean).join(' ');
    const title = hasEv ? ` title="${events[dateStr].join(', ')}"` : '';
    html += `<button class="${cls}"${title}>${d}</button>`;
  }
  gridEl.innerHTML = html;
}

/** Change mini calendar month */
function changeMonth(dir) {
  miniCalDate.setMonth(miniCalDate.getMonth() + dir);
  if (window._appDb) renderMiniCal(window._appDb.kegiatan);
}

/** Render full calendar (Kalender page) */
function renderFullCal(kegiatan) {
  const y = fullCalDate.getFullYear();
  const m = fullCalDate.getMonth();
  const today = new Date();
  const events = buildEventDates(kegiatan);

  const titleEl = document.getElementById('fullCalTitle');
  if (titleEl) titleEl.textContent = BULAN[m] + ' ' + y;

  const headEl = document.getElementById('fullCalHead');
  if (headEl) headEl.innerHTML = HARI.map(h => `<span>${h}</span>`).join('');

  const gridEl = document.getElementById('fullCalGrid');
  if (!gridEl) return;

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  // days from previous month
  const prevDays = new Date(y, m, 0).getDate();
  let html = '';

  // Previous month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month"><div class="day-num">${prevDays - i}</div></div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    const dayEvents = events[dateStr] || [];
    const cls = isToday ? 'cal-day today' : 'cal-day';
    const chips = dayEvents.map(ev =>
      `<div class="cal-event-chip" title="${esc(ev)}">${esc(ev.replace('[DEMO] ', ''))}</div>`
    ).join('');
    html += `<div class="${cls}" onclick="showCalEvent('${dateStr}', event)">`
          + `<div class="day-num">${d}</div>`
          + chips
          + `</div>`;
  }

  // Next month filler
  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="cal-day other-month"><div class="day-num">${i}</div></div>`;
  }

  gridEl.innerHTML = html;
}

/** Change full calendar month */
function changeFullCalMonth(dir) {
  fullCalDate.setMonth(fullCalDate.getMonth() + dir);
  if (window._appDb) renderFullCal(window._appDb.kegiatan);
}

/** Show event detail panel when clicking a calendar day */
function showCalEvent(dateStr, evt) {
  if (!window._appDb) return;
  const events = buildEventDates(window._appDb.kegiatan);
  const detailEl = document.getElementById('calEventDetail');
  if (!detailEl) return;

  const d = new Date(dateStr + 'T00:00:00');
  const displayDate = `${HARI_FULL[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;

  if (events[dateStr] && events[dateStr].length) {
    detailEl.style.display = 'block';
    detailEl.innerHTML = `<h4>📅 ${displayDate}</h4>`
      + events[dateStr].map(ev => `<div style="margin-top:6px;font-size:13px;color:#065c35">• ${esc(ev)}</div>`).join('');
  } else {
    detailEl.style.display = 'block';
    detailEl.innerHTML = `<h4>📅 ${displayDate}</h4><div style="font-size:13px;color:#6b7c73;margin-top:6px">Tidak ada kegiatan terjadwal.</div>`;
  }
}

// esc() is defined in app.js (loaded after calendar.js)
