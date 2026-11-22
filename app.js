/**
 * app.js — Core Application Logic
 * Yayasan Wihdatul Muslimat Dashboard v2.1
 */

/* =============================================
   DATABASE (localStorage)
   ============================================= */
const DB_KEY = 'wmDashboardV2';

function loadDb() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || { anak: [], lansia: [], kegiatan: [], keuangan: [] };
  } catch { return { anak: [], lansia: [], kegiatan: [], keuangan: [] }; }
}

function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window._appDb = db;
    return true;
  } catch (error) {
    showToast('Penyimpanan browser penuh. Hapus beberapa foto/dokumen atau ekspor cadangan terlebih dahulu.', 'error');
    return false;
  }
}

/* =============================================
   ROUTING / PAGE NAVIGATION
   ============================================= */
const PAGE_META = {
  overview:                 { title: 'Overview',                      sub: 'Ringkasan pengelolaan program dan kegiatan yayasan' },
  anak:                     { title: 'Data Anak Asuh',                sub: 'Kelola data anak asuh yayasan' },
  lansia:                   { title: 'Data Lansia',                   sub: 'Kelola data penerima manfaat lansia' },
  kegiatan:                 { title: 'Kegiatan Sosial',               sub: 'Program dan kegiatan sosial yayasan' },
  keuangan:                 { title: 'Donasi & Keuangan',             sub: 'Pencatatan pemasukan, pengeluaran, dan saldo' },
  laporan:                  { title: 'Laporan',                       sub: 'Rekap data dan ekspor laporan' },
  kalender:                 { title: 'Kalender Kegiatan',             sub: 'Jadwal kegiatan yayasan' },
  'struktur-npsaa':         { title: 'Struktur Organisasi NPSAA',     sub: 'Bagan dan dokumen struktur organisasi Anak Asuh NPSAA' },
  'struktur-pusaka':        { title: 'Struktur Organisasi PUSAKA 10', sub: 'Bagan dan dokumen struktur organisasi Lansia PUSAKA 10' },
  'kelembagaan-dashboard':  { title: 'Dashboard Kelembagaan',         sub: 'Ringkasan data kelembagaan Yayasan Wihdatul Muslimat' },
  'kelembagaan-profil':     { title: 'Profil Lembaga',                sub: 'Identitas, lokasi, galeri, dan dokumen perizinan lembaga' },
  'kelembagaan-identitas':  { title: 'Identitas Lembaga',             sub: 'Data identitas resmi lembaga' },
  'kelembagaan-lokasi':     { title: 'Lokasi Lembaga',                sub: 'Alamat dan data kepemilikan aset lembaga' },
  'kelembagaan-galeri':     { title: 'Galeri Foto',                   sub: 'Koleksi foto gedung, ruang belajar, kegiatan, dan fasilitas' },
  'kelembagaan-dokumen':    { title: 'Dokumen Perizinan',             sub: 'Akta, SK, NPWP, izin operasional, dan dokumen legal lainnya' },
  'sarpras-dashboard':      { title: 'Dashboard Sarana & Prasarana',  sub: 'Ringkasan aset, ruangan, fasilitas, dan inventaris yayasan' },
  'sarpras-tanah':           { title: 'Data Tanah & Bangunan',         sub: 'Kelola data aset tanah dan bangunan yayasan' },
  'sarpras-ruangan':         { title: 'Data Ruangan',                  sub: 'Kelola data dan kondisi ruangan' },
  'sarpras-fasilitas':       { title: 'Data Fasilitas',                sub: 'Kelola fasilitas dan perlengkapan yayasan' },
  'sarpras-inventaris':      { title: 'Inventaris Barang',             sub: 'Kelola daftar barang dan inventaris yayasan' },
  'sarpras-galeri':          { title: 'Galeri Sarana Prasarana',       sub: 'Dokumentasi foto aset, gedung, ruangan, dan fasilitas' },
  pengaturan:               { title: 'Pengaturan',                    sub: 'Konfigurasi aplikasi dan petunjuk penggunaan' },
};

let currentPage = 'overview';

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  const meta = PAGE_META[page] || { title: page, sub: '' };
  document.getElementById('pageTitle').textContent = meta.title;
  document.getElementById('pageSub').textContent = meta.sub;

  closeSidebar();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  hideSearchResults();

  currentPage = page;

  const db = window._appDb;
  switch (page) {
    case 'overview':          renderOverview(db);           break;
    case 'anak':              renderAnakTable(db);          break;
    case 'lansia':            renderLansiaTable(db);        break;
    case 'kegiatan':          renderKegiatanTable(db);      break;
    case 'keuangan':          renderKeuanganPage(db);       break;
    case 'laporan':           renderLaporan(db);            break;
    case 'kalender':          renderFullCal(db.kegiatan);   break;
    case 'struktur-npsaa':           renderStruktur('npsaa');              break;
    case 'struktur-pusaka':          renderStruktur('pusaka');             break;
    case 'kelembagaan-dashboard':    if(window.renderKlbDashboard)    window.renderKlbDashboard();    break;
    case 'kelembagaan-profil':       if(window.renderKlbProfil)       window.renderKlbProfil();       break;
    case 'kelembagaan-identitas':    if(window.renderKlbIdentitas)    window.renderKlbIdentitas();    break;
    case 'kelembagaan-lokasi':       if(window.renderKlbLokasi)       window.renderKlbLokasi();       break;
    case 'kelembagaan-galeri':       if(window.renderKlbGaleri)       window.renderKlbGaleri();       break;
    case 'kelembagaan-dokumen':      if(window.renderKlbDokumen)      window.renderKlbDokumen();      break;
    case 'sarpras-dashboard':        if(window.renderSarprasDashboard) window.renderSarprasDashboard(); break;
    case 'sarpras-tanah':            if(window.renderSarprasPage)      window.renderSarprasPage('tanah'); break;
    case 'sarpras-ruangan':          if(window.renderSarprasPage)      window.renderSarprasPage('ruangan'); break;
    case 'sarpras-fasilitas':        if(window.renderSarprasPage)      window.renderSarprasPage('fasilitas'); break;
    case 'sarpras-inventaris':       if(window.renderSarprasPage)      window.renderSarprasPage('inventaris'); break;
    case 'sarpras-galeri':           if(window.renderSarprasGallery)   window.renderSarprasGallery(); break;
    case 'pengaturan':               renderPengaturan();                   break;
  }
}

/* =============================================
   SIDEBAR TOGGLE
   ============================================= */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

/* =============================================
   OVERVIEW PAGE
   ============================================= */
function renderOverview(db) {
  renderStatsGrid(db);
  renderRecentActivity(db);
  renderMiniCal(db.kegiatan);
  setTimeout(() => renderOverviewChart(db), 50);
}

function renderStatsGrid(db) {
  const totIn  = db.keuangan.filter(f => f.jenis === 'Pemasukan').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const totOut = db.keuangan.filter(f => f.jenis === 'Pengeluaran').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const saldo  = totIn - totOut;

  const cards = [
    {
      icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
      iconClass: 'green',
      label: 'Anak Asuh',
      value: db.anak.length,
      hint: 'Data anak asuh terdaftar'
    },
    {
      icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="4"/><path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"/></svg>`,
      iconClass: 'blue',
      label: 'Lansia',
      value: db.lansia.length,
      hint: 'Penerima manfaat lansia'
    },
    {
      icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      iconClass: 'amber',
      label: 'Kegiatan Sosial',
      value: db.kegiatan.length,
      hint: 'Program tercatat tahun ini'
    },
    {
      icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M2 10h20"/></svg>`,
      iconClass: 'teal',
      label: 'Saldo Keuangan',
      value: 'Rp ' + saldo.toLocaleString('id-ID'),
      hint: `${db.keuangan.length} transaksi tercatat`
    }
  ];

  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  grid.innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="stat-icon ${c.iconClass}">${c.icon}</div>
      <div class="stat-body">
        <div class="stat-label">${c.label}</div>
        <div class="stat-value">${c.value}</div>
        <div class="stat-hint">${c.hint}</div>
      </div>
    </div>
  `).join('');
}

function renderRecentActivity(db) {
  const el = document.getElementById('recentActivity');
  if (!el) return;
  const recent = [...db.kegiatan].reverse().slice(0, 6);
  if (!recent.length) {
    el.innerHTML = '<div style="padding:20px 0;text-align:center;color:#6b7c73;font-size:13px">Belum ada kegiatan tercatat.</div>';
    return;
  }
  el.innerHTML = recent.map(k => `
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div>
        <div class="activity-title">${esc(k.nama)}</div>
        <div class="activity-meta">
          ${k.tgl ? formatTgl(k.tgl) : '—'} &bull;
          ${k.lokasi ? esc(k.lokasi) : '—'}
          ${k.penerima ? ` &bull; ${k.penerima} penerima` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

/* =============================================
   ANAK ASUH
   ============================================= */

/** Preview foto for anak asuh form */
function previewAnakFoto(input) {
  const el = document.getElementById('anakFotoPreview');
  if (!el || !input.files || !input.files[0]) { if (el) el.style.display = 'none'; return; }
  const file = input.files[0];
  if (!file.type.startsWith('image/')) {
    showToast('File harus berupa gambar', 'error');
    input.value = '';
    el.style.display = 'none';
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('Ukuran file melebihi 2MB', 'error');
    input.value = '';
    el.style.display = 'none';
    return;
  }
  window._anakFotoToDelete = false;
  const reader = new FileReader();
  reader.onload = e => {
    el.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%;max-height:120px;border-radius:4px;border:1px solid var(--line)">`;
    el.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

/** Clear foto anak asuh when editing */
function hapusFotoAnak() {
  window._anakFotoToDelete = true;
  const wrap = document.getElementById('anakFotoCurrentWrap');
  if (wrap) wrap.style.display = 'none';
  showToast('Foto akan dihapus saat data disimpan');
}

function renderAnakTable(db) {
  const tbody = document.getElementById('anakTableBody');
  const badge = document.getElementById('anakCountBadge');
  if (badge) badge.textContent = db.anak.length;
  if (!tbody) return;

  if (!db.anak.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="11">Belum ada data anak asuh.</td></tr>';
    return;
  }
  tbody.innerHTML = db.anak.map((a, i) => {
    const age = calcAge(a.tglLahir);
    const katClass = { 'Yatim': 'yatim', 'Piatu': 'piatu', 'Yatim Piatu': 'yatim-piatu', 'Dhuafa': 'dhuafa' }[a.kategori] || '';
    const fotoCell = a.foto
      ? `<img src="${a.foto}" alt="${esc(a.nama)}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid var(--line)">`
      : `<div style="width:38px;height:38px;border-radius:50%;background:var(--mint);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--green)">${esc(a.nama.charAt(0).toUpperCase())}</div>`;
    return `<tr>
      <td class="num-cell">${i + 1}</td>
      <td style="padding:8px 14px">${fotoCell}</td>
      <td>${esc(a.nama)}</td>
      <td>${esc(a.nik || '—')}</td>
      <td>${a.tglLahir ? formatTgl(a.tglLahir) : '—'}</td>
      <td>${age} thn</td>
      <td>${esc(a.jk || '—')}</td>
      <td><span class="tag ${katClass}">${esc(a.kategori || '—')}</span></td>
      <td>${esc(a.pendidikan || '—')}</td>
      <td>${esc(a.wali || '—')}</td>
      <td>
        <div class="td-actions">
          <button class="btn-action btn-detail" onclick="detailAnak('${a.id}')">Detail</button>
          <button class="btn-action btn-edit" onclick="editAnak('${a.id}')">Edit</button>
          <button class="btn-action btn-del" onclick="deleteRecord('anak','${a.id}','${esc(a.nama)}')">Hapus</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function saveAnak(e) {
  e.preventDefault();
  const db = { ...window._appDb, anak: [...window._appDb.anak] };
  const id = document.getElementById('anakId').value;

  // Handle foto
  const fotoInput = document.getElementById('anakFoto');
  let fotoData = null;

  const doSave = (foto) => {
    const record = {
      id: id || generateId(),
      nama: document.getElementById('anakNama').value.trim(),
      nik: document.getElementById('anakNik').value.trim(),
      tglLahir: document.getElementById('anakTglLahir').value,
      jk: document.getElementById('anakJK').value,
      kategori: document.getElementById('anakKategori').value,
      pendidikan: document.getElementById('anakPendidikan').value,
      wali: document.getElementById('anakWali').value.trim(),
      foto: foto,
    };
    if (id) {
      const idx = db.anak.findIndex(a => a.id === id);
      if (idx !== -1) {
        // If hapus foto was requested
        if (window._anakFotoToDelete && !(fotoInput.files && fotoInput.files[0])) record.foto = null;
        db.anak[idx] = record;
      }
    } else {
      db.anak.push(record);
    }
    window._anakFotoToDelete = false;
    if (!saveDb(db)) return;
    showToast(id ? 'Data anak asuh berhasil diperbarui' : 'Data anak asuh berhasil ditambahkan');
    renderAnakTable(db);
    renderStatsGrid(db);
    closeModal();
  };

  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = ev => doSave(ev.target.result);
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    // Keep existing foto if editing and not deleted
    const existing = id ? (db.anak.find(a => a.id === id) || {}).foto : null;
    doSave(window._anakFotoToDelete ? null : existing);
  }
}

function editAnak(id) {
  const db = window._appDb;
  const a = db.anak.find(x => x.id === id);
  if (!a) return;
  window._anakFotoToDelete = false;
  document.getElementById('anakId').value = a.id;
  document.getElementById('anakNama').value = a.nama;
  document.getElementById('anakNik').value = a.nik || '';
  document.getElementById('anakTglLahir').value = a.tglLahir || '';
  document.getElementById('anakJK').value = a.jk || 'Perempuan';
  document.getElementById('anakKategori').value = a.kategori || 'Yatim';
  document.getElementById('anakPendidikan').value = a.pendidikan || 'SD/MI';
  document.getElementById('anakWali').value = a.wali || '';
  // Reset file input
  const fi = document.getElementById('anakFoto'); if (fi) fi.value = '';
  const prev = document.getElementById('anakFotoPreview'); if (prev) { prev.style.display='none'; prev.innerHTML=''; }
  // Show current foto if exists
  const wrap = document.getElementById('anakFotoCurrentWrap');
  const img  = document.getElementById('anakFotoCurrent');
  if (a.foto && wrap && img) {
    img.src = a.foto;
    wrap.style.display = 'block';
  } else if (wrap) {
    wrap.style.display = 'none';
  }
  document.getElementById('modalAnakTitle').textContent = 'Edit Data Anak Asuh';
  openModal('anak');
}

function detailAnak(id) {
  const db = window._appDb;
  const a = db.anak.find(x => x.id === id);
  if (!a) return;
  const age = calcAge(a.tglLahir);
  const katClass = { 'Yatim': 'yatim', 'Piatu': 'piatu', 'Yatim Piatu': 'yatim-piatu', 'Dhuafa': 'dhuafa' }[a.kategori] || '';

  const row = (label, value) => value ? `
    <div class="detail-row">
      <span class="detail-label">${label}</span>
      <span class="detail-value">${esc(String(value))}</span>
    </div>` : '';

  const fotoSection = a.foto
    ? `<div style="text-align:center;margin-bottom:16px">
        <img src="${a.foto}" alt="${esc(a.nama)}" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--mint)">
       </div>`
    : `<div style="text-align:center;margin-bottom:16px">
        <div style="width:96px;height:96px;border-radius:50%;background:var(--mint);display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:800;color:var(--green);margin:0 auto">${esc(a.nama.charAt(0).toUpperCase())}</div>
       </div>`;

  document.getElementById('modalAnakDetailTitle').textContent = 'Detail: ' + a.nama;
  document.getElementById('anakDetailContent').innerHTML = `
    ${fotoSection}
    <div class="form-section" style="margin-bottom:0">
      <div class="form-section-title">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        Data Anak Asuh
      </div>
      <div style="padding:10px 14px">
        ${row('Nama Lengkap', a.nama)}
        ${row('NIK', a.nik)}
        ${row('Tanggal Lahir', a.tglLahir ? formatTgl(a.tglLahir) : '—')}
        ${row('Usia', age + ' tahun')}
        ${row('Jenis Kelamin', a.jk)}
        <div class="detail-row">
          <span class="detail-label">Kategori</span>
          <span class="detail-value"><span class="tag ${katClass}">${esc(a.kategori || '—')}</span></span>
        </div>
        ${row('Pendidikan', a.pendidikan)}
        ${row('Nama Wali', a.wali)}
      </div>
    </div>
  `;
  document.getElementById('anakDetailEditBtn').onclick = () => { closeModal(); editAnak(a.id); };
  openModal('anak-detail');
}

/* =============================================
   LANSIA — Helpers
   ============================================= */

function kelompokUsia(usia) {
  const u = Number(usia) || 0;
  if (u >= 80) return { label: '≥80 thn', cls: 'kelompok-80' };
  if (u >= 70) return { label: '70–79 thn', cls: 'kelompok-70' };
  if (u >= 60) return { label: '60–69 thn', cls: 'kelompok-60' };
  return { label: `${u} thn`, cls: 'kelompok-60' };
}

function kondisiClass(k) {
  return { 'Sehat':'kondisi-sehat','Sakit Ringan':'kondisi-ringan','Sakit Sedang':'kondisi-sedang','Sakit Berat':'kondisi-berat','Butuh Perawatan Khusus':'kondisi-khusus' }[k] || '';
}

function updateLansiaUsia() {
  const tgl = document.getElementById('lansiaTglLahir').value;
  const display = document.getElementById('lansiaUsiaDisplay');
  if (display) display.value = tgl ? (calcAge(tgl) + ' tahun') : '—';
}

function previewDocLansia(input, previewId) {
  const el = document.getElementById(previewId);
  if (!el || !input.files || !input.files[0]) { if (el) el.style.display = 'none'; return; }
  const file = input.files[0];
  if (file.size > 2 * 1024 * 1024) {
    showToast('Ukuran file melebihi 2MB', 'error');
    input.value = '';
    el.style.display = 'none';
    return;
  }
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      el.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%;max-height:120px;border-radius:4px;border:1px solid var(--line)">`;
      el.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    el.innerHTML = `<div style="padding:8px;background:var(--bg);border:1px solid var(--line);border-radius:4px;font-size:12px;color:var(--muted)">📄 ${esc(file.name)}</div>`;
    el.style.display = 'block';
  }
}

function previewLansiaFoto(input) {
  if (input.files && input.files[0]) {
    window._lansiaFotoToDelete = false;
    if (!input.files[0].type.startsWith('image/')) {
      showToast('File harus berupa gambar', 'error');
      input.value = '';
      const preview = document.getElementById('lansiaFotoPreview');
      if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
      return;
    }
  }
  previewDocLansia(input, 'lansiaFotoPreview');
}

function hapusFotoLansia() {
  window._lansiaFotoToDelete = true;
  const wrap = document.getElementById('lansiaFotoCurrentWrap');
  if (wrap) wrap.style.display = 'none';
  showToast('Foto akan dihapus saat data disimpan');
}

/* =============================================
   LANSIA — Rekapitulasi Stats
   ============================================= */
function renderLansiaStats(db) {
  const grid = document.getElementById('lansiaStatsGrid');
  if (!grid) return;
  const list = db.lansia;
  const total = list.length;
  const lk = list.filter(l => l.jk === 'Laki-laki').length;
  const pr = list.filter(l => l.jk === 'Perempuan').length;
  const klp60 = list.filter(l => { const a = l.tglLahir ? calcAge(l.tglLahir) : (l.usia||0); return a >= 60 && a < 70; }).length;
  const klp70 = list.filter(l => { const a = l.tglLahir ? calcAge(l.tglLahir) : (l.usia||0); return a >= 70 && a < 80; }).length;
  const klp80 = list.filter(l => { const a = l.tglLahir ? calcAge(l.tglLahir) : (l.usia||0); return a >= 80; }).length;
  const butuhBantuan = list.filter(l => l.kemandirian && l.kemandirian !== 'Mandiri').length;

  grid.innerHTML = [
    { iconClass:'green',  icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="4"/><path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"/></svg>', label:'Total Lansia', value: total, hint:'Semua data terdaftar' },
    { iconClass:'blue',   icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="4"/><path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"/></svg>', label:'Laki-laki', value: lk, hint:`${pr} Perempuan` },
    { iconClass:'amber',  icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', label:'Klp. Usia', value: `${klp60}/${klp70}/${klp80}`, hint:'60–69 / 70–79 / 80+' },
    { iconClass:'red',    icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', label:'Butuh Bantuan', value: butuhBantuan, hint:'Tidak mandiri penuh' },
  ].map(c => `
    <div class="stat-card" onclick="showPage('lansia')">
      <div class="stat-icon ${c.iconClass}">${c.icon}</div>
      <div class="stat-body">
        <div class="stat-label">${c.label}</div>
        <div class="stat-value">${c.value}</div>
        <div class="stat-hint">${c.hint}</div>
      </div>
    </div>
  `).join('');
}

/* =============================================
   LANSIA — Sort state
   ============================================= */
let _lansiaSortCol  = '';
let _lansiaSortDir  = 1;

function sortLansiaTable(col) {
  if (_lansiaSortCol === col) {
    _lansiaSortDir *= -1;
  } else {
    _lansiaSortCol = col;
    _lansiaSortDir = 1;
  }
  ['nama','tglLahir','usia'].forEach(c => {
    const el = document.getElementById('sort-' + c);
    if (el) el.textContent = c === col ? (_lansiaSortDir === 1 ? '↑' : '↓') : '↕';
  });
  renderLansiaTable(window._appDb);
}

/* =============================================
   LANSIA — Render Table
   ============================================= */
function renderLansiaTable(db) {
  renderLansiaStats(db);
  const tbody = document.getElementById('lansiaTableBody');
  const badge = document.getElementById('lansiaCountBadge');
  if (!tbody) return;

  let list = [...db.lansia];

  if (_lansiaSortCol) {
    list.sort((a, b) => {
      let va = a[_lansiaSortCol] || '';
      let vb = b[_lansiaSortCol] || '';
      if (_lansiaSortCol === 'usia') {
        va = a.tglLahir ? calcAge(a.tglLahir) : (Number(a.usia) || 0);
        vb = b.tglLahir ? calcAge(b.tglLahir) : (Number(b.usia) || 0);
        return _lansiaSortDir * (va - vb);
      }
      return _lansiaSortDir * String(va).localeCompare(String(vb), 'id');
    });
  }

  if (badge) badge.textContent = list.length;

  if (!list.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="15">Belum ada data lansia.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((l, i) => {
    const age  = l.tglLahir ? calcAge(l.tglLahir) : (l.usia || '—');
    const kg   = kelompokUsia(age);
    const kCls = kondisiClass(l.kondisiKesehatan);
    const sCls = l.status === 'Tidak Aktif' ? 'status-tidak' : 'status-aktif';
    const fotoCell = l.foto
      ? `<img src="${l.foto}" alt="${esc(l.nama)}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid var(--line)">`
      : `<div style="width:38px;height:38px;border-radius:50%;background:var(--blue-light);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--blue)">${esc(l.nama.charAt(0).toUpperCase())}</div>`;
    return `<tr>
      <td class="num-cell">${i + 1}</td>
      <td style="padding:8px 14px">${fotoCell}</td>
      <td>
        <div class="cell-name">${esc(l.nama)}</div>
        <span class="tag ${sCls}" style="font-size:10px;padding:1px 6px;margin-top:2px;display:inline-block">${esc(l.status || 'Aktif')}</span>
      </td>
      <td class="cell-nik">${esc(l.nik || '—')}</td>
      <td>${l.tglLahir ? formatTgl(l.tglLahir) : '—'}</td>
      <td>${age} thn</td>
      <td>${esc(l.jk || '—')}</td>
      <td><span class="tag ${kg.cls}">${kg.label}</span></td>
      <td>${esc(l.pendidikan || '—')}</td>
      <td>${l.kondisiKesehatan ? `<span class="tag ${kCls}">${esc(l.kondisiKesehatan)}</span>` : '—'}</td>
      <td style="font-size:12px">${esc(l.kebutuhanBantuan || '—')}</td>
      <td>${esc(l.wali || '—')}</td>
      <td>${esc(l.telp || '—')}</td>
      <td style="font-size:12px">${esc(l.kecamatan || '—')}</td>
      <td>
        <div class="td-actions">
          <button class="btn-action btn-detail" onclick="detailLansia('${l.id}')" title="Lihat Detail">Detail</button>
          <button class="btn-action btn-edit"   onclick="editLansia('${l.id}')">Edit</button>
          <button class="btn-action btn-del"    onclick="deleteRecord('lansia','${l.id}','${esc(l.nama)}')">Hapus</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  _applyLansiaFilters();
}

function _applyLansiaFilters() {
  const search    = (document.getElementById('lansiaSearchInput')    || {}).value || '';
  const jkFilter  = (document.getElementById('lansiaFilterJK')       || {}).value || '';
  const umurFilter= (document.getElementById('lansiaFilterUmur')     || {}).value || '';
  const kdFilter  = (document.getElementById('lansiaFilterKondisi')  || {}).value || '';
  if (!search && !jkFilter && !umurFilter && !kdFilter) return;
  filterLansiaTable();
}

function filterLansiaTable() {
  const search    = ((document.getElementById('lansiaSearchInput')   || {}).value || '').toLowerCase();
  const jkFilter  = (document.getElementById('lansiaFilterJK')       || {}).value || '';
  const umurFilter= (document.getElementById('lansiaFilterUmur')     || {}).value || '';
  const kdFilter  = (document.getElementById('lansiaFilterKondisi')  || {}).value || '';

  const rows = document.querySelectorAll('#lansiaTableBody tr');
  let visible = 0;
  rows.forEach(tr => {
    if (tr.classList.contains('empty-row')) { tr.style.display = ''; return; }
    const tds = tr.querySelectorAll('td');
    // Columns shifted by 1 (foto column added at index 1)
    const namaCell = tds[2] ? tds[2].textContent.toLowerCase() : '';
    const nikCell  = tds[3] ? tds[3].textContent.toLowerCase() : '';
    const jkCell   = tds[6] ? tds[6].textContent.trim() : '';
    const usiaNum  = Number((tds[5] ? tds[5].textContent : '0').replace(/\D/g,''));
    const kdCell   = tds[9] ? tds[9].textContent.trim() : '';

    let umurMatch = true;
    if (umurFilter === '60-69') umurMatch = usiaNum >= 60 && usiaNum < 70;
    else if (umurFilter === '70-79') umurMatch = usiaNum >= 70 && usiaNum < 80;
    else if (umurFilter === '80+') umurMatch = usiaNum >= 80;

    const show = (!search || namaCell.includes(search) || nikCell.includes(search))
              && (!jkFilter  || jkCell.includes(jkFilter))
              && umurMatch
              && (!kdFilter  || kdCell.includes(kdFilter));

    tr.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const badge = document.getElementById('lansiaCountBadge');
  if (badge) badge.textContent = visible;
}

/* =============================================
   LANSIA — Save / Edit / Detail
   ============================================= */
function saveLansia(e) {
  e.preventDefault();
  const db = { ...window._appDb, lansia: [...window._appDb.lansia] };
  const id = document.getElementById('lansiaId').value;

  const nama = document.getElementById('lansiaNama').value.trim();
  const nik  = document.getElementById('lansiaNik').value.trim();
  const noKK = document.getElementById('lansiaNoKK').value.trim();
  const tglLahir = document.getElementById('lansiaTglLahir').value;
  const alamat   = document.getElementById('lansiaAlamat').value.trim();

  if (!nama)  { showToast('Nama lengkap harus diisi', 'error'); return; }
  if (!nik)   { showToast('NIK harus diisi', 'error'); return; }
  if (!/^\d{16}$/.test(nik))  { showToast('NIK harus tepat 16 digit angka', 'error'); return; }
  if (!noKK)  { showToast('Nomor KK harus diisi', 'error'); return; }
  if (!/^\d{16}$/.test(noKK)) { showToast('Nomor KK harus tepat 16 digit angka', 'error'); return; }
  if (!tglLahir) { showToast('Tanggal lahir harus diisi', 'error'); return; }
  if (!alamat) { showToast('Alamat lengkap harus diisi', 'error'); return; }

  const usia = tglLahir ? calcAge(tglLahir) : 0;

  const buildRecord = (foto) => ({
    id: id || generateId(),
    nama, nik, tglLahir, usia,
    tempatLahir:         document.getElementById('lansiaTempatLahir').value.trim(),
    jk:                  document.getElementById('lansiaJK').value,
    statusKawin:         document.getElementById('lansiaStatusKawin').value,
    agama:               document.getElementById('lansiaAgama').value,
    pendidikan:          document.getElementById('lansiaPendidikan').value,
    pekerjaan:           document.getElementById('lansiaPekerjaan').value.trim(),
    telp:                document.getElementById('lansiaTelp').value.trim(),
    noKK,
    rtRw:                document.getElementById('lansiaRTRW').value.trim(),
    alamat,
    kelurahan:           document.getElementById('lansiaKelurahan').value.trim(),
    kecamatan:           document.getElementById('lansiaKecamatan').value.trim(),
    kota:                document.getElementById('lansiaKota').value.trim(),
    statusTinggal:       document.getElementById('lansiaStatusTinggal').value,
    wali:                document.getElementById('lansiaWali').value.trim(),
    hubWali:             document.getElementById('lansiaHubWali').value,
    telpWali:            document.getElementById('lansiaTelpWali').value.trim(),
    kondisiKesehatan:    document.getElementById('lansiaKondisiKesehatan').value,
    kondisiFisik:        document.getElementById('lansiaKondisiFisik').value,
    penyakit:            document.getElementById('lansiaPenyakit').value.trim(),
    kemandirian:         document.getElementById('lansiaKemandirian').value,
    kebutuhanBantuan:    document.getElementById('lansiaKebutuhanBantuan').value,
    penghasilan:         document.getElementById('lansiaPenghasilan').value,
    bansos:              document.getElementById('lansiaBansos').value,
    bpjs:                document.getElementById('lansiaBpjs').value,
    catatan:             document.getElementById('lansiaCatatan').value.trim(),
    tglDaftar:           document.getElementById('lansiaTglDaftar').value,
    status:              document.getElementById('lansiaStatus').value,
    foto:                foto,
  });

  const fotoInput = document.getElementById('lansiaFoto');

  const doSave = (foto) => {
    const record = buildRecord(foto);
    if (id) {
      const idx = db.lansia.findIndex(l => l.id === id);
      if (idx !== -1) {
        if (window._lansiaFotoToDelete && !(fotoInput.files && fotoInput.files[0])) record.foto = null;
        db.lansia[idx] = record;
      }
    } else {
      db.lansia.push(record);
    }
    window._lansiaFotoToDelete = false;
    if (!saveDb(db)) return;
    showToast(id ? 'Data lansia berhasil diperbarui ✓' : 'Data lansia berhasil disimpan ✓');
    renderLansiaTable(db);
    renderStatsGrid(db);
    closeModal();
  };

  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = ev => doSave(ev.target.result);
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    const existing = id ? (db.lansia.find(l => l.id === id) || {}).foto : null;
    doSave(window._lansiaFotoToDelete ? null : existing);
  }
}

function editLansia(id) {
  const db = window._appDb;
  const l  = db.lansia.find(x => x.id === id);
  if (!l) return;
  window._lansiaFotoToDelete = false;

  const sv = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
  const ss = (elId, val, def) => { const el = document.getElementById(elId); if (el) el.value = val || def || ''; };

  sv('lansiaId',           l.id);
  sv('lansiaNama',         l.nama);
  sv('lansiaNik',          l.nik);
  sv('lansiaTglLahir',     l.tglLahir);
  const usiaVal = l.tglLahir ? calcAge(l.tglLahir) : (l.usia || '');
  const disp = document.getElementById('lansiaUsiaDisplay');
  if (disp) disp.value = usiaVal ? (usiaVal + ' tahun') : '—';
  sv('lansiaTempatLahir',  l.tempatLahir);
  ss('lansiaJK',           l.jk,           'Perempuan');
  ss('lansiaStatusKawin',  l.statusKawin,  'Menikah');
  ss('lansiaAgama',        l.agama,        'Islam');
  ss('lansiaPendidikan',   l.pendidikan,   'Tidak Sekolah');
  sv('lansiaPekerjaan',    l.pekerjaan);
  sv('lansiaTelp',         l.telp);
  sv('lansiaNoKK',         l.noKK);
  sv('lansiaRTRW',         l.rtRw);
  sv('lansiaAlamat',       l.alamat);
  sv('lansiaKelurahan',    l.kelurahan);
  sv('lansiaKecamatan',    l.kecamatan);
  sv('lansiaKota',         l.kota);
  ss('lansiaStatusTinggal',l.statusTinggal,'Milik Sendiri');
  sv('lansiaWali',         l.wali);
  ss('lansiaHubWali',      l.hubWali,      'Anak Kandung');
  sv('lansiaTelpWali',     l.telpWali);
  ss('lansiaKondisiKesehatan', l.kondisiKesehatan, 'Sehat');
  ss('lansiaKondisiFisik', l.kondisiFisik, 'Baik');
  sv('lansiaPenyakit',     l.penyakit);
  ss('lansiaKemandirian',  l.kemandirian,  'Mandiri');
  ss('lansiaKebutuhanBantuan', l.kebutuhanBantuan, 'Tidak Ada');
  ss('lansiaPenghasilan',  l.penghasilan,  'Dari Keluarga');
  ss('lansiaBansos',       l.bansos,       'Tidak');
  ss('lansiaBpjs',         l.bpjs,         'Tidak Punya');
  sv('lansiaCatatan',      l.catatan);
  sv('lansiaTglDaftar',    l.tglDaftar);
  ss('lansiaStatus',       l.status,       'Aktif');

  ['lansiaFoto','lansiaDocKTP','lansiaDocKK','lansiaDocSKTM','lansiaDocLain'].forEach(fid => {
    const fi = document.getElementById(fid); if (fi) fi.value = '';
  });
  ['lansiaFotoPreview','prevKTP','prevKK','prevSKTM','prevLain'].forEach(pid => {
    const pd = document.getElementById(pid); if (pd) { pd.style.display='none'; pd.innerHTML=''; }
  });
  // Show existing foto
  const wrap = document.getElementById('lansiaFotoCurrentWrap');
  const img  = document.getElementById('lansiaFotoCurrent');
  if (l.foto && wrap && img) {
    img.src = l.foto;
    wrap.style.display = 'block';
  } else if (wrap) {
    wrap.style.display = 'none';
  }

  document.getElementById('modalLansiaTitle').textContent = 'Edit Data Lansia';
  openModal('lansia');
}

function detailLansia(id) {
  const db = window._appDb;
  const l  = db.lansia.find(x => x.id === id);
  if (!l) return;
  const age = l.tglLahir ? calcAge(l.tglLahir) : (l.usia || '—');
  const kg  = kelompokUsia(age);
  const kCls = kondisiClass(l.kondisiKesehatan);

  const row = (label, value) => value ? `
    <div class="detail-row">
      <span class="detail-label">${label}</span>
      <span class="detail-value">${esc(String(value))}</span>
    </div>` : '';

  const section = (title, icon, rows) => `
    <div class="form-section" style="margin-bottom:14px">
      <div class="form-section-title">${icon} ${title}</div>
      <div style="padding:10px 14px">${rows}</div>
    </div>`;

  const fotoSection = l.foto
    ? `<div style="text-align:center;margin-bottom:16px">
        <img src="${l.foto}" alt="${esc(l.nama)}" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--mint)">
       </div>`
    : `<div style="text-align:center;margin-bottom:16px">
        <div style="width:96px;height:96px;border-radius:50%;background:var(--blue-light);display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:800;color:var(--blue);margin:0 auto">${esc(l.nama.charAt(0).toUpperCase())}</div>
       </div>`;

  document.getElementById('modalLansiaDetailTitle').textContent = 'Detail: ' + l.nama;
  document.getElementById('lansiaDetailContent').innerHTML = `
    ${fotoSection}
    ${section('1. Identitas Lansia',
      '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
      row('Nama Lengkap', l.nama) +
      row('NIK', l.nik ? l.nik.replace(/(\d{6})(\d{6})(\d{4})/,'$1-$2-$3') : '—') +
      row('Tanggal Lahir', l.tglLahir ? formatTgl(l.tglLahir) : '—') +
      row('Usia', age + ' tahun — ' + kg.label) +
      row('Tempat Lahir', l.tempatLahir) +
      row('Jenis Kelamin', l.jk) +
      row('Status Perkawinan', l.statusKawin) +
      row('Agama', l.agama) +
      row('Pendidikan', l.pendidikan) +
      row('Pekerjaan', l.pekerjaan) +
      row('No. Telepon', l.telp) +
      row('Status', l.status || 'Aktif') +
      row('Tgl Terdaftar', l.tglDaftar ? formatTgl(l.tglDaftar) : '—')
    )}
    ${section('2. Alamat dan Keluarga',
      '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
      row('No. KK', l.noKK ? l.noKK.replace(/(\d{6})(\d{6})(\d{4})/,'$1-$2-$3') : '—') +
      row('Alamat', l.alamat) +
      row('RT / RW', l.rtRw) +
      row('Kelurahan', l.kelurahan) +
      row('Kecamatan', l.kecamatan) +
      row('Kota/Kab.', l.kota) +
      row('Status Tinggal', l.statusTinggal) +
      row('Nama Wali', l.wali) +
      row('Hubungan Wali', l.hubWali) +
      row('No. HP Keluarga', l.telpWali)
    )}
    ${section('3. Kondisi dan Kebutuhan',
      '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      row('Kondisi Kesehatan', l.kondisiKesehatan) +
      row('Kondisi Fisik', l.kondisiFisik) +
      row('Riwayat Penyakit', l.penyakit) +
      row('Kemandirian', l.kemandirian) +
      row('Kebutuhan Bantuan', l.kebutuhanBantuan) +
      row('Penghasilan', l.penghasilan) +
      row('Penerima Bansos', l.bansos) +
      row('BPJS', l.bpjs) +
      row('Catatan', l.catatan)
    )}
  `;
  document.getElementById('detailEditBtn').onclick = () => { closeModal(); editLansia(l.id); };
  openModal('lansia-detail');
}

/* =============================================
   KEGIATAN SOSIAL
   ============================================= */
function renderKegiatanTable(db) {
  const tbody = document.getElementById('kegiatanTableBody');
  const badge = document.getElementById('kegiatanCountBadge');
  if (badge) badge.textContent = db.kegiatan.length;
  if (!tbody) return;

  if (!db.kegiatan.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Belum ada data kegiatan.</td></tr>';
    return;
  }
  tbody.innerHTML = [...db.kegiatan].reverse().map((k, i) => `<tr>
    <td class="num-cell">${db.kegiatan.length - i}</td>
    <td>${esc(k.nama)}</td>
    <td>${k.tgl ? formatTgl(k.tgl) : '—'}</td>
    <td>${esc(k.lokasi || '—')}</td>
    <td>${k.penerima ? k.penerima + ' orang' : '—'}</td>
    <td>${k.dokumentasi
      ? `<a href="${esc(k.dokumentasi)}" target="_blank" rel="noopener" style="color:#087443;font-size:12px">Lihat ↗</a>`
      : '—'
    }</td>
    <td>
      <div class="td-actions">
        <button class="btn-action btn-edit" onclick="editKegiatan('${k.id}')">Edit</button>
        <button class="btn-action btn-del" onclick="deleteRecord('kegiatan','${k.id}','${esc(k.nama)}')">Hapus</button>
      </div>
    </td>
  </tr>`).join('');
}

function saveKegiatan(e) {
  e.preventDefault();
  const db = window._appDb;
  const id = document.getElementById('kegiatanId').value;
  const record = {
    id: id || generateId(),
    nama: document.getElementById('kegiatanNama').value.trim(),
    tgl: document.getElementById('kegiatanTgl').value,
    lokasi: document.getElementById('kegiatanLokasi').value.trim(),
    penerima: document.getElementById('kegiatanPenerima').value,
    dokumentasi: document.getElementById('kegiatanDokumentasi').value.trim(),
  };
  if (id) {
    const idx = db.kegiatan.findIndex(k => k.id === id);
    if (idx !== -1) db.kegiatan[idx] = record;
    showToast('Kegiatan berhasil diperbarui');
  } else {
    db.kegiatan.push(record);
    showToast('Kegiatan berhasil ditambahkan');
  }
  saveDb(db);
  renderKegiatanTable(db);
  renderStatsGrid(db);
  closeModal();
}

function editKegiatan(id) {
  const db = window._appDb;
  const k = db.kegiatan.find(x => x.id === id);
  if (!k) return;
  document.getElementById('kegiatanId').value = k.id;
  document.getElementById('kegiatanNama').value = k.nama;
  document.getElementById('kegiatanTgl').value = k.tgl || '';
  document.getElementById('kegiatanLokasi').value = k.lokasi || '';
  document.getElementById('kegiatanPenerima').value = k.penerima || '';
  document.getElementById('kegiatanDokumentasi').value = k.dokumentasi || '';
  document.getElementById('modalKegiatanTitle').textContent = 'Edit Kegiatan Sosial';
  openModal('kegiatan');
}

/* =============================================
   KEUANGAN
   ============================================= */
function renderKeuanganPage(db) {
  renderKeuanganStats(db);
  renderKeuanganTable(db);
}

function renderKeuanganStats(db) {
  const totIn  = db.keuangan.filter(f => f.jenis === 'Pemasukan').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const totOut = db.keuangan.filter(f => f.jenis === 'Pengeluaran').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const saldo  = totIn - totOut;

  const el = document.getElementById('keuanganStats');
  if (!el) return;
  el.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon green">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      </div>
      <div class="stat-body">
        <div class="stat-label">Total Pemasukan</div>
        <div class="stat-value" style="font-size:19px">Rp ${totIn.toLocaleString('id-ID')}</div>
        <div class="stat-hint">Donasi &amp; pemasukan masuk</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon red">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
      </div>
      <div class="stat-body">
        <div class="stat-label">Total Pengeluaran</div>
        <div class="stat-value" style="font-size:19px;color:#dc3545">Rp ${totOut.toLocaleString('id-ID')}</div>
        <div class="stat-hint">Program &amp; operasional</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon teal">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
      </div>
      <div class="stat-body">
        <div class="stat-label">Saldo Tersisa</div>
        <div class="stat-value" style="font-size:19px;color:${saldo >= 0 ? '#087443' : '#dc3545'}">Rp ${Math.abs(saldo).toLocaleString('id-ID')}</div>
        <div class="stat-hint">${saldo >= 0 ? 'Saldo positif' : '⚠ Defisit'}</div>
      </div>
    </div>
  `;
}

function renderKeuanganTable(db) {
  const tbody = document.getElementById('keuanganTableBody');
  const badge = document.getElementById('keuanganCountBadge');
  if (badge) badge.textContent = db.keuangan.length;
  if (!tbody) return;

  if (!db.keuangan.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Belum ada transaksi tercatat.</td></tr>';
    return;
  }
  tbody.innerHTML = [...db.keuangan].reverse().map((f, i) => {
    const cls = f.jenis === 'Pemasukan' ? 'income' : 'expense';
    const nominalClass = f.jenis === 'Pemasukan' ? 'rp-positive' : 'rp-negative';
    const sign = f.jenis === 'Pemasukan' ? '+' : '-';
    return `<tr>
      <td class="num-cell">${db.keuangan.length - i}</td>
      <td>${f.tgl ? formatTgl(f.tgl) : '—'}</td>
      <td>${esc(f.ket)}</td>
      <td><span class="tag ${cls}">${esc(f.jenis)}</span></td>
      <td class="${nominalClass}">${sign}Rp ${Number(f.nominal || 0).toLocaleString('id-ID')}</td>
      <td>
        <div class="td-actions">
          <button class="btn-action btn-edit" onclick="editKeuangan('${f.id}')">Edit</button>
          <button class="btn-action btn-del" onclick="deleteRecord('keuangan','${f.id}','${esc(f.ket)}')">Hapus</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function saveKeuangan(e) {
  e.preventDefault();
  const db = window._appDb;
  const id = document.getElementById('keuanganId').value;
  const record = {
    id: id || generateId(),
    tgl: document.getElementById('keuanganTgl').value,
    ket: document.getElementById('keuanganKet').value.trim(),
    jenis: document.getElementById('keuanganJenis').value,
    nominal: document.getElementById('keuanganNominal').value,
  };
  if (id) {
    const idx = db.keuangan.findIndex(f => f.id === id);
    if (idx !== -1) db.keuangan[idx] = record;
    showToast('Transaksi berhasil diperbarui');
  } else {
    db.keuangan.push(record);
    showToast('Transaksi berhasil dicatat');
  }
  saveDb(db);
  renderKeuanganPage(db);
  renderStatsGrid(db);
  closeModal();
}

function editKeuangan(id) {
  const db = window._appDb;
  const f = db.keuangan.find(x => x.id === id);
  if (!f) return;
  document.getElementById('keuanganId').value = f.id;
  document.getElementById('keuanganTgl').value = f.tgl || '';
  document.getElementById('keuanganKet').value = f.ket;
  document.getElementById('keuanganJenis').value = f.jenis;
  document.getElementById('keuanganNominal').value = f.nominal;
  document.getElementById('modalKeuanganTitle').textContent = 'Edit Transaksi';
  openModal('keuangan');
}

/* =============================================
   LAPORAN
   ============================================= */
function renderLaporan(db) {
  const totIn  = db.keuangan.filter(f => f.jenis === 'Pemasukan').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const totOut = db.keuangan.filter(f => f.jenis === 'Pengeluaran').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const totPenerima = db.kegiatan.reduce((s, k) => s + Number(k.penerima || 0), 0);

  const el = document.getElementById('laporanContent');
  if (el) {
    el.innerHTML = `
      <div class="laporan-summary">
        <div class="laporan-row"><span>Total Anak Asuh Terdaftar</span><b>${db.anak.length} orang</b></div>
        <div class="laporan-row"><span>Total Lansia Terdaftar</span><b>${db.lansia.length} orang (Aktif: ${db.lansia.filter(l=>!l.status||l.status==='Aktif').length})</b></div>
        <div class="laporan-row"><span>Total Kegiatan Sosial</span><b>${db.kegiatan.length} kegiatan</b></div>
        <div class="laporan-row"><span>Total Penerima Manfaat Kegiatan</span><b>${totPenerima} orang</b></div>
        <div class="laporan-row"><span>Total Pemasukan / Donasi</span><b class="text-green">Rp ${totIn.toLocaleString('id-ID')}</b></div>
        <div class="laporan-row"><span>Total Pengeluaran</span><b class="text-red">Rp ${totOut.toLocaleString('id-ID')}</b></div>
        <div class="laporan-row"><span>Saldo Akhir</span><b>Rp ${(totIn - totOut).toLocaleString('id-ID')}</b></div>
        <div class="laporan-row"><span>Total Transaksi Dicatat</span><b>${db.keuangan.length} transaksi</b></div>
      </div>
    `;
  }
  setTimeout(() => renderLaporanCharts(db), 50);
}

/* =============================================
   STRUKTUR ORGANISASI
   ============================================= */
const STRUKTUR_KEY = 'wmStrukturOrg';

function loadStruktur() {
  try {
    return JSON.parse(localStorage.getItem(STRUKTUR_KEY)) || { npsaa: [], pusaka: [] };
  } catch { return { npsaa: [], pusaka: [] }; }
}

function saveStruktur(data) {
  try {
    localStorage.setItem(STRUKTUR_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    showToast('Penyimpanan browser penuh. Hapus beberapa dokumen atau ekspor cadangan terlebih dahulu.', 'error');
    return false;
  }
}

function handleStrukturUpload(type, input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name);
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!isImage && !isPdf) {
    showToast('Dokumen harus berupa gambar atau PDF', 'error');
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('Ukuran file melebihi 5MB', 'error');
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const data = loadStruktur();
    const doc = {
      id: generateId(),
      nama: file.name,
      type: isPdf ? 'application/pdf' : file.type,
      data: e.target.result,
      uploadedAt: new Date().toLocaleString('id-ID'),
    };
    if (!data[type]) data[type] = [];
    data[type].push(doc);
    if (!saveStruktur(data)) { input.value = ''; return; }
    renderStruktur(type);
    showToast('Dokumen berhasil diunggah');
    input.value = '';
  };
  reader.readAsDataURL(file);
}

function renderStruktur(type) {
  const data = loadStruktur();
  const docs = data[type] || [];
  const prefix = type === 'npsaa' ? 'Npsaa' : 'Pusaka';
  const emptyEl = document.getElementById('struktur' + prefix + 'Empty');
  const listEl  = document.getElementById('struktur' + prefix + 'List');
  if (!listEl) return;

  if (!docs.length) {
    if (emptyEl) emptyEl.style.display = 'block';
    listEl.style.display = 'none';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  listEl.style.display = 'block';

  listEl.innerHTML = docs.map(doc => {
    const isImg = doc.type && doc.type.startsWith('image/');
    const isPdf = doc.type === 'application/pdf' || /\.pdf$/i.test(doc.nama);
    const previewHtml = isImg
      ? `<div style="text-align:center;padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--line);cursor:pointer" onclick="pratinjauStruktur('${doc.id}','${type}')">
           <img src="${doc.data}" alt="${esc(doc.nama)}" style="max-width:100%;max-height:320px;border-radius:6px;border:1px solid var(--line)">
         </div>`
      : isPdf
      ? `<iframe title="Pratinjau ${esc(doc.nama)}" src="${doc.data}#toolbar=1&navpanes=0" style="width:100%;height:420px;border:1px solid var(--line);border-radius:var(--radius-sm);background:#fff"></iframe>`
      : `<div style="padding:20px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--line);text-align:center">
           <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color:var(--muted);margin:0 auto 8px;display:block"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
           <div style="font-size:13px;color:var(--ink-mid)">${esc(doc.nama)}</div>
           <div style="font-size:11px;color:var(--muted)">PDF Document</div>
         </div>`;
    return `
      <div style="border:1px solid var(--line);border-radius:var(--radius);padding:16px;margin-bottom:14px;background:var(--white)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--ink)">${esc(doc.nama)}</div>
            <div style="font-size:11px;color:var(--muted)">Diunggah: ${esc(doc.uploadedAt)}</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn-action btn-detail" onclick="pratinjauStruktur('${doc.id}','${type}')">Pratinjau</button>
            <a href="${doc.data}" download="${esc(doc.nama)}" class="btn-action btn-edit" style="text-decoration:none;display:inline-flex;align-items:center">Unduh</a>
            <label class="btn-action btn-edit" style="cursor:pointer;display:inline-flex;align-items:center">
              Ganti
              <input type="file" accept="image/*,.pdf" style="display:none" onchange="gantiStrukturDoc('${doc.id}','${type}',this)">
            </label>
            <button class="btn-action btn-del" onclick="hapusStrukturDoc('${doc.id}','${type}')">Hapus</button>
          </div>
        </div>
        ${previewHtml}
      </div>`;
  }).join('');
}

function pratinjauStruktur(docId, type) {
  const data = loadStruktur();
  const doc = (data[type] || []).find(d => d.id === docId);
  if (!doc) return;
  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) {
    const isPdf = doc.type === 'application/pdf' || /\.pdf$/i.test(doc.nama);
    win.document.title = doc.nama;
    win.document.body.style.cssText = 'margin:0;background:#222;min-height:100vh';
    if (isPdf) {
      const frame = win.document.createElement('iframe');
      frame.src = doc.data;
      frame.title = doc.nama;
      frame.style.cssText = 'width:100%;height:100vh;border:0;background:#fff';
      win.document.body.appendChild(frame);
    } else {
      win.document.body.style.cssText += ';display:flex;justify-content:center;align-items:flex-start;padding:20px;box-sizing:border-box';
      const image = win.document.createElement('img');
      image.src = doc.data;
      image.alt = doc.nama;
      image.style.cssText = 'max-width:100%;max-height:calc(100vh - 40px);object-fit:contain;border-radius:8px';
      win.document.body.appendChild(image);
    }
  } else {
    showToast('Pop-up diblokir. Izinkan pop-up untuk pratinjau.', 'error');
  }
}

function gantiStrukturDoc(docId, type, input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name);
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!isImage && !isPdf) { showToast('Dokumen harus berupa gambar atau PDF', 'error'); input.value=''; return; }
  if (file.size > 5 * 1024 * 1024) { showToast('Ukuran file melebihi 5MB', 'error'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const data = loadStruktur();
    const idx = (data[type] || []).findIndex(d => d.id === docId);
    if (idx !== -1) {
      data[type][idx].nama = file.name;
      data[type][idx].type = isPdf ? 'application/pdf' : file.type;
      data[type][idx].data = e.target.result;
      data[type][idx].uploadedAt = new Date().toLocaleString('id-ID');
      if (!saveStruktur(data)) { input.value = ''; return; }
      renderStruktur(type);
      showToast('Dokumen berhasil diganti');
    }
    input.value = '';
  };
  reader.readAsDataURL(file);
}

function hapusStrukturDoc(docId, type) {
  openConfirmModal('Hapus dokumen ini? Tindakan ini tidak dapat dibatalkan.', () => {
    const data = loadStruktur();
    data[type] = (data[type] || []).filter(d => d.id !== docId);
    if (!saveStruktur(data)) return;
    closeModal();
    renderStruktur(type);
    showToast('Dokumen berhasil dihapus');
  });
}

/* =============================================
   PENGATURAN
   ============================================= */
function renderPengaturan() {
  const el = document.getElementById('guideContent');
  if (!el) return;
  el.innerHTML = `
    <h4>🚀 Cara Menjalankan Aplikasi</h4>
    <ol>
      <li>Pastikan seluruh file tersedia dalam satu folder: <code>index.html</code>, <code>css/style.css</code>, <code>js/app.js</code>, <code>js/data.js</code>, <code>js/charts.js</code>, <code>js/calendar.js</code>, <code>js/export.js</code>, serta file logo.</li>
      <li>Buka file <code>index.html</code> langsung di browser (klik dua kali) atau gunakan ekstensi <b>Live Server</b> di VS Code untuk pengalaman terbaik.</li>
      <li>Data tersimpan otomatis di <code>localStorage</code> browser. Data tidak akan hilang saat halaman dimuat ulang selama menggunakan browser yang sama.</li>
    </ol>

    <h4>📸 Fitur Foto & Dokumen</h4>
    <ol>
      <li>Foto anak asuh dan lansia dapat diunggah dari form tambah/edit data. Ukuran maks. 2MB.</li>
      <li>Foto ditampilkan di tabel dan halaman detail. Bisa diganti (upload baru) atau dihapus (klik "Hapus Foto" saat edit).</li>
      <li>Struktur Organisasi (NPSAA & PUSAKA 10): upload gambar bagan atau PDF, pratinjau, unduh, ganti, dan hapus dokumen.</li>
    </ol>

    <h4>📤 Deploy ke GitHub Pages</h4>
    <ol>
      <li>Buat akun di <a href="https://github.com" target="_blank" rel="noopener">github.com</a> jika belum ada.</li>
      <li>Buat repository baru (misalnya: <code>dashboard-ywm</code>), centang <b>Public</b>.</li>
      <li>Upload seluruh isi folder proyek (termasuk subfolder <code>css/</code> dan <code>js/</code>) ke repository tersebut.</li>
      <li>Di halaman repository, klik <b>Settings → Pages</b>.</li>
      <li>Pada bagian <b>Source</b>, pilih branch <code>main</code> dan folder <code>/ (root)</code>, lalu klik <b>Save</b>.</li>
      <li>Tunggu beberapa menit. Aplikasi akan tersedia di <code>https://[username].github.io/dashboard-ywm/</code>.</li>
    </ol>

    <h4>⚠️ Catatan Penting</h4>
    <ol>
      <li>Data hanya tersimpan di browser lokal. Berbeda perangkat atau browser = data berbeda.</li>
      <li>Gunakan fitur <b>Ekspor CSV/Excel</b> secara rutin sebagai cadangan data.</li>
      <li>Data berlabel <b>[DEMO]</b> adalah contoh dan dapat dihapus kapan saja.</li>
      <li>Foto dan dokumen disimpan sebagai data URL — kapasitas localStorage terbatas ±5-10MB per domain.</li>
    </ol>
  `;
}

function confirmReset() {
  openConfirmModal(
    'Reset akan menghapus SELURUH data dari browser ini termasuk data nyata. Pastikan sudah ekspor data terlebih dahulu. Lanjutkan?',
    () => {
      localStorage.removeItem(DB_KEY);
      closeModal();
      showToast('Seluruh data berhasil direset. Halaman akan dimuat ulang...');
      setTimeout(() => location.reload(), 1500);
    }
  );
}

/* =============================================
   DELETE RECORD
   ============================================= */
function deleteRecord(type, id, name) {
  openConfirmModal(
    `Hapus data "${name}"? Tindakan ini tidak dapat dibatalkan.`,
    () => {
      const db = window._appDb;
      db[type] = db[type].filter(x => String(x.id) !== String(id));
      saveDb(db);
      closeModal();
      showToast('Data berhasil dihapus');
      switch (type) {
        case 'anak':     renderAnakTable(db);     break;
        case 'lansia':   renderLansiaTable(db);   break;
        case 'kegiatan': renderKegiatanTable(db); break;
        case 'keuangan': renderKeuanganPage(db);  break;
      }
      renderStatsGrid(db);
      if (currentPage === 'overview') renderRecentActivity(db);
    }
  );
}

/* =============================================
   MODAL MANAGEMENT
   ============================================= */
let _activeModal = null;

function openModal(type) {
  document.querySelectorAll('.modal.active').forEach(m => {
    if (m.id !== 'modal-' + type) m.classList.remove('active');
  });

  const modal = document.getElementById('modal-' + type);
  if (!modal) return;
  document.getElementById('modalBackdrop').classList.add('active');
  modal.classList.add('active');
  _activeModal = type;

  if (type !== 'confirm') {
    const idField = modal.querySelector('input[type="hidden"]');
    if (idField && !idField.value) {
      modal.querySelector('form')?.reset();
      if (type === 'keuangan') {
        const tglEl = document.getElementById('keuanganTgl');
        if (tglEl) tglEl.value = new Date().toISOString().split('T')[0];
      }
      if (type === 'lansia') {
        const disp = document.getElementById('lansiaUsiaDisplay');
        if (disp) disp.value = '';
        ['lansiaFotoPreview','prevKTP','prevKK','prevSKTM','prevLain'].forEach(pid => {
          const pd = document.getElementById(pid);
          if (pd) { pd.style.display = 'none'; pd.innerHTML = ''; }
        });
        const lfw = document.getElementById('lansiaFotoCurrentWrap');
        if (lfw) lfw.style.display = 'none';
      }
      if (type === 'anak') {
        const ap = document.getElementById('anakFotoPreview');
        if (ap) { ap.style.display='none'; ap.innerHTML=''; }
        const aw = document.getElementById('anakFotoCurrentWrap');
        if (aw) aw.style.display = 'none';
        window._anakFotoToDelete = false;
      }
      const titleMap = {
        anak: 'Tambah Data Anak Asuh',
        lansia: 'Tambah Data Lansia',
        kegiatan: 'Tambah Kegiatan Sosial',
        keuangan: 'Catat Transaksi'
      };
      const titleEl = document.getElementById('modal' + capitalize(type) + 'Title');
      if (titleEl) titleEl.textContent = titleMap[type] || '';
    }
  }
  if (type === 'lansia' || type === 'lansia-detail') {
    const scrollBody = modal.querySelector('.modal-body-scroll');
    if (scrollBody) scrollBody.scrollTop = 0;
  }
  if (type === 'anak-detail') {
    const sb = modal.querySelector('.modal-body-scroll') || document.getElementById('anakDetailContent');
    if (sb) sb.scrollTop = 0;
  }
}

function closeModal() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  document.getElementById('modalBackdrop').classList.remove('active');
  ['anakId','lansiaId','kegiatanId','keuanganId'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  _activeModal = null;
}

function openConfirmModal(msg, onConfirm) {
  document.getElementById('confirmMsg').textContent = msg;
  const btn = document.getElementById('confirmBtn');
  btn.onclick = onConfirm;
  openModal('confirm');
}

/* =============================================
   GLOBAL SEARCH
   ============================================= */
function globalSearch(q) {
  const box = document.getElementById('searchResultsBox');
  if (!box) return;
  if (!q.trim()) { box.style.display = 'none'; return; }

  const db = window._appDb;
  const lq = q.toLowerCase();
  const results = [];

  db.anak.forEach(a => { if (a.nama.toLowerCase().includes(lq) || (a.nik||'').includes(lq)) results.push({ cat: 'Anak Asuh', name: a.nama, page: 'anak' }); });
  db.lansia.forEach(l => { if (l.nama.toLowerCase().includes(lq) || (l.nik||'').includes(lq) || (l.wali||'').toLowerCase().includes(lq)) results.push({ cat: 'Lansia', name: l.nama, page: 'lansia' }); });
  db.kegiatan.forEach(k => { if (k.nama.toLowerCase().includes(lq) || (k.lokasi||'').toLowerCase().includes(lq)) results.push({ cat: 'Kegiatan', name: k.nama, page: 'kegiatan' }); });
  db.keuangan.forEach(f => { if (f.ket.toLowerCase().includes(lq)) results.push({ cat: 'Keuangan', name: f.ket, page: 'keuangan' }); });

  if (!results.length) {
    box.style.display = 'block';
    box.innerHTML = `<h4>Hasil Pencarian untuk "${esc(q)}"</h4><div style="color:#6b7c73;font-size:13px;padding:10px 0">Tidak ada data yang cocok.</div>`;
    return;
  }

  box.style.display = 'block';
  box.innerHTML = `<h4>Hasil Pencarian untuk "${esc(q)}" (${results.length} ditemukan)</h4>`
    + results.slice(0, 12).map(r => `
      <div class="search-result-item" onclick="showPage('${r.page}')">
        <span class="search-result-cat">${r.cat}</span>
        <span class="search-result-name">${esc(r.name)}</span>
      </div>
    `).join('');
}

function hideSearchResults() {
  const box = document.getElementById('searchResultsBox');
  if (box) box.style.display = 'none';
}

/* =============================================
   LOCAL TABLE FILTER
   ============================================= */
function filterLocalTable(tbodyId, q) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const lq = q.toLowerCase();
  tbody.querySelectorAll('tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(lq) ? '' : 'none';
  });
}

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatTgl(tglStr) {
  if (!tglStr) return '—';
  const d = new Date(tglStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

let _toastTimer = null;
function showToast(msg, type) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2800);
}

/* =============================================
   KEYBOARD SHORTCUTS
   ============================================= */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const db = loadDb();
  window._appDb = db;

  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });

  const today = new Date().toISOString().split('T')[0];
  ['keuanganTgl'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today;
  });

  showPage('overview');
});
