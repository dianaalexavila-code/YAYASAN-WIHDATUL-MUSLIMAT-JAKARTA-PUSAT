/**
 * kelembagaan.js — Modul Kelembagaan
 * Dashboard Yayasan Wihdatul Muslimat v2.1
 *
 * Fitur: Dashboard Kelembagaan, Identitas, Lokasi, Galeri Foto, Dokumen Perizinan
 * Storage: localStorage (kunci KLB_KEY), dengan placeholder integrasi Supabase
 */

'use strict';

/* =============================================
   STORAGE
   ============================================= */
const KLB_KEY = 'wmKelembagaan';

function klbLoad() {
  try {
    const raw = localStorage.getItem(KLB_KEY);
    return raw ? JSON.parse(raw) : klbDefaultData();
  } catch { return klbDefaultData(); }
}

function klbSave(data) {
  localStorage.setItem(KLB_KEY, JSON.stringify(data));
}

function klbDefaultData() {
  return {
    identitas: {},
    lokasi: {},
    galeri: {},   // { gedung:[], ruangBelajar:[], kegiatan:[], fasilitas:[] }
    dokumen: {},  // { aktaNotaris:null, skKemenkumham:null, npwp:null, ... }
  };
}

/* =============================================
   HELPERS
   ============================================= */
function klbEsc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
  );
}

function klbFieldRow(label, value, reqd) {
  const badge = reqd ? ' <span style="color:var(--red);font-weight:700">*</span>' : '';
  return `<div class="detail-row">
    <span class="detail-label">${label}${badge}</span>
    <span class="detail-value">${klbEsc(value || '—')}</span>
  </div>`;
}

/* =============================================
   SIDEBAR TOGGLE — sub-menu
   ============================================= */
(function initKlbSidebarToggle() {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('navKelembagaan');
    const sub = document.getElementById('subKelembagaan');
    const chv = document.getElementById('chevronKelembagaan');
    if (!btn || !sub) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = sub.style.display !== 'none' && sub.style.display !== '';
      sub.style.display = open ? 'none' : 'block';
      if (chv) chv.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
      // Also navigate to dashboard
      if (!open) showPage('kelembagaan-dashboard');
    });
  });
})();

/* =============================================
   DASHBOARD KELEMBAGAAN
   ============================================= */
window.renderKlbDashboard = function () {
  const data = klbLoad();
  const id   = data.identitas || {};
  const lok  = data.lokasi    || {};

  // Open sub-menu automatically
  const sub = document.getElementById('subKelembagaan');
  const chv = document.getElementById('chevronKelembagaan');
  if (sub) sub.style.display = 'block';
  if (chv) chv.style.transform = 'rotate(90deg)';

  // Stat cards
  const grid = document.getElementById('klbDashGrid');
  if (grid) {
    const galeriCount = Object.values(data.galeri || {}).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
    const dokCount = Object.values(data.dokumen || {}).filter(v => v && v.data).length;
    const hasIdentitas = !!(id.namaLembaga);
    const hasLokasi    = !!(lok.alamat);

    grid.innerHTML = [
      { iconClass:'green',  icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>', label:'Nama Lembaga',  value: id.namaLembaga || '—', hint: hasIdentitas ? 'Identitas terisi' : 'Belum diisi', onclick:'kelembagaan-identitas' },
      { iconClass:'blue',   icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', label:'Kota/Kabupaten', value: lok.kota || '—', hint: hasLokasi ? 'Lokasi terisi' : 'Belum diisi', onclick:'kelembagaan-lokasi' },
      { iconClass:'amber',  icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', label:'Galeri Foto',   value: galeriCount + ' foto', hint: 'Gedung, Ruang, Kegiatan, Fasilitas', onclick:'kelembagaan-galeri' },
      { iconClass:'teal',   icon:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>', label:'Dokumen Legal', value: dokCount + ' dokumen', hint: 'Akta, SK, NPWP, Izin, dll.', onclick:'kelembagaan-dokumen' },
    ].map(c => `
      <div class="stat-card" onclick="showPage('${c.onclick}')" style="cursor:pointer">
        <div class="stat-icon ${c.iconClass}">${c.icon}</div>
        <div class="stat-body">
          <div class="stat-label">${c.label}</div>
          <div class="stat-value" style="font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${klbEsc(c.value)}</div>
          <div class="stat-hint">${c.hint}</div>
        </div>
      </div>`).join('');
  }

  // Completeness
  const comp = document.getElementById('klbCompleteness');
  if (comp) {
    const checks = [
      { label: 'Nama Lembaga',     done: !!(id.namaLembaga),    page: 'kelembagaan-identitas' },
      { label: 'Jenis Lembaga',    done: !!(id.jenisLembaga),   page: 'kelembagaan-identitas' },
      { label: 'Email',            done: !!(id.email),          page: 'kelembagaan-identitas' },
      { label: 'Tahun Berdiri',    done: !!(id.tahunBerdiriM),  page: 'kelembagaan-identitas' },
      { label: 'Nama Pimpinan',    done: !!(id.namaPimpinan),   page: 'kelembagaan-identitas' },
      { label: 'Provinsi',         done: !!(lok.provinsi),      page: 'kelembagaan-lokasi' },
      { label: 'Alamat Lengkap',   done: !!(lok.alamat),        page: 'kelembagaan-lokasi' },
      { label: 'Kode Pos',         done: !!(lok.kodePos),       page: 'kelembagaan-lokasi' },
      { label: 'Galeri Foto',      done: Object.values(data.galeri||{}).some(a=>Array.isArray(a)&&a.length>0), page: 'kelembagaan-galeri' },
      { label: 'Akta Notaris',     done: !!(data.dokumen&&data.dokumen.aktaNotaris&&data.dokumen.aktaNotaris.data), page: 'kelembagaan-dokumen' },
    ];
    const doneCount = checks.filter(c => c.done).length;
    const pct = Math.round(doneCount / checks.length * 100);
    comp.innerHTML = `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:12px;font-weight:600;color:var(--ink-mid)">Kelengkapan Data</span>
          <span style="font-size:12px;font-weight:700;color:var(--green)">${pct}%</span>
        </div>
        <div style="background:var(--line);border-radius:10px;height:8px">
          <div style="background:var(--green);height:8px;border-radius:10px;width:${pct}%;transition:width .4s"></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${checks.map(c => `
          <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line);cursor:pointer" onclick="showPage('${c.page}')">
            <span style="font-size:14px">${c.done ? '✅' : '⬜'}</span>
            <span style="font-size:12px;color:${c.done ? 'var(--green)' : 'var(--muted)'}">${c.label}</span>
          </div>`).join('')}
      </div>`;
  }
};

/* =============================================
   PROFIL LEMBAGA — tabs
   ============================================= */
let _klbActiveTab = 'identitas';

window.renderKlbProfil = function () {
  switchKlbTab(_klbActiveTab);
  // Activate sub-menu
  const sub = document.getElementById('subKelembagaan');
  const chv = document.getElementById('chevronKelembagaan');
  if (sub) sub.style.display = 'block';
  if (chv) chv.style.transform = 'rotate(90deg)';
};

window.switchKlbTab = function (tab) {
  _klbActiveTab = tab;
  // Update tab buttons
  document.querySelectorAll('.klb-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  const content = document.getElementById('klbTabContent');
  if (!content) return;
  switch (tab) {
    case 'identitas': content.innerHTML = klbRenderIdentitasForm(true);  klbBindIdentitas(true); break;
    case 'lokasi':    content.innerHTML = klbRenderLokasiForm(true);     klbBindLokasi(true);    break;
    case 'galeri':    content.innerHTML = klbRenderGaleriHTML();         klbBindGaleri();        break;
    case 'dokumen':   content.innerHTML = klbRenderDokumenHTML();        klbBindDokumen();       break;
  }
};

/* =============================================
   IDENTITAS LEMBAGA
   ============================================= */
window.renderKlbIdentitas = function () {
  const el = document.getElementById('pageIdentitasContent');
  if (!el) return;
  el.innerHTML = klbRenderIdentitasForm(false);
  klbBindIdentitas(false);
  // Activate sub-menu
  const sub = document.getElementById('subKelembagaan');
  const chv = document.getElementById('chevronKelembagaan');
  if (sub) sub.style.display = 'block';
  if (chv) chv.style.transform = 'rotate(90deg)';
};

function klbRenderIdentitasForm(inTab) {
  const data = klbLoad();
  const id   = data.identitas || {};
  const viewMode = !!(id.namaLembaga); // start in view mode if data exists

  return `
    <div class="klb-section-card" id="klbIdentitasCard">
      <div class="klb-section-header">
        <div class="klb-section-title">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
          Identitas Lembaga
        </div>
        <div class="klb-section-actions" id="identitasActions">
          ${viewMode
            ? `<button class="btn-secondary btn-sm" onclick="klbEditIdentitas()">&#9998; Edit</button>`
            : `<button class="btn-primary btn-sm" onclick="klbSaveIdentitas()">&#10003; Simpan</button>
               <button class="btn-secondary btn-sm" onclick="${inTab ? "switchKlbTab('identitas')" : "renderKlbIdentitas()"}">Batal</button>`
          }
        </div>
      </div>

      ${viewMode
        ? `<div id="identitasView" style="padding:4px 0">${klbIdentitasViewHTML(id)}</div>`
        : `<div id="identitasForm">${klbIdentitasInputHTML(id)}</div>`
      }
    </div>`;
}

function klbIdentitasViewHTML(id) {
  return `
    <div class="klb-view-grid">
      ${klbFieldRow('Nama Lembaga', id.namaLembaga, true)}
      ${klbFieldRow('Jenis / Satuan Pendidikan', id.jenisLembaga)}
      ${klbFieldRow('Jenjang', id.jenjang)}
      ${klbFieldRow('NPWP', id.npwp)}
      ${klbFieldRow('No. Telepon', id.telepon)}
      ${klbFieldRow('Alamat Website', id.website)}
      ${klbFieldRow('Email', id.email, true)}
      ${klbFieldRow('Tahun Berdiri (Hijriah)', id.tahunBerdiriH)}
      ${klbFieldRow('Tahun Berdiri (Masehi)', id.tahunBerdiriM, true)}
      ${klbFieldRow('Nama Ketua / Pimpinan', id.namaPimpinan, true)}
      ${klbFieldRow('Status Lingkungan Pesantren', id.statusPesantren)}
    </div>
    <div style="font-size:11px;color:var(--muted);padding-top:8px;border-top:1px solid var(--line);margin-top:8px">
      Terakhir diperbarui: ${id._updatedAt || '—'}
    </div>`;
}

function klbIdentitasInputHTML(id) {
  return `
    <div class="klb-supabase-info">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Data disimpan di localStorage. Integrasi Supabase tersedia &mdash; aktifkan di Pengaturan untuk penyimpanan cloud.
    </div>
    <div class="klb-form-grid">
      <div class="klb-field full">
        <label>Nama Lembaga <span class="req">*</span></label>
        <input type="text" id="klbNamaLembaga" value="${klbEsc(id.namaLembaga||'')}" placeholder="Nama resmi lembaga/yayasan">
      </div>
      <div class="klb-field">
        <label>Jenis / Satuan Pendidikan</label>
        <select id="klbJenisLembaga">
          ${['— Pilih —','Yayasan Sosial','Yayasan Pendidikan','Yayasan Keagamaan','Panti Asuhan','Lembaga Sosial Masyarakat','Lainnya'].map(o =>
            `<option value="${o==='— Pilih —'?'':o}" ${(id.jenisLembaga||'')===(o==='— Pilih —'?'':o)?'selected':''}>${o}</option>`).join('')}
        </select>
      </div>
      <div class="klb-field">
        <label>Jenjang</label>
        <select id="klbJenjang">
          ${['— Pilih —','PAUD','SD/MI','SMP/MTs','SMA/SMK/MA','Perguruan Tinggi','Non-Formal','Multi-Jenjang'].map(o =>
            `<option value="${o==='— Pilih —'?'':o}" ${(id.jenjang||'')===(o==='— Pilih —'?'':o)?'selected':''}>${o}</option>`).join('')}
        </select>
      </div>
      <div class="klb-field">
        <label>NPWP</label>
        <input type="text" id="klbNpwp" value="${klbEsc(id.npwp||'')}" placeholder="XX.XXX.XXX.X-XXX.XXX">
      </div>
      <div class="klb-field">
        <label>No. Telepon</label>
        <input type="tel" id="klbTelepon" value="${klbEsc(id.telepon||'')}" placeholder="Contoh: 021-5551234">
      </div>
      <div class="klb-field">
        <label>Alamat Website</label>
        <input type="url" id="klbWebsite" value="${klbEsc(id.website||'')}" placeholder="https://...">
      </div>
      <div class="klb-field">
        <label>Email <span class="req">*</span></label>
        <input type="email" id="klbEmail" value="${klbEsc(id.email||'')}" placeholder="email@lembaga.org">
      </div>
      <div class="klb-field">
        <label>Tahun Berdiri (Hijriah)</label>
        <input type="text" id="klbTahunH" value="${klbEsc(id.tahunBerdiriH||'')}" placeholder="Contoh: 1425 H">
      </div>
      <div class="klb-field">
        <label>Tahun Berdiri (Masehi) <span class="req">*</span></label>
        <input type="number" id="klbTahunM" value="${klbEsc(id.tahunBerdiriM||'')}" placeholder="Contoh: 2004" min="1900" max="2100">
      </div>
      <div class="klb-field">
        <label>Nama Ketua / Pimpinan <span class="req">*</span></label>
        <input type="text" id="klbNamaPimpinan" value="${klbEsc(id.namaPimpinan||'')}" placeholder="Nama lengkap pimpinan">
      </div>
      <div class="klb-field">
        <label>Status Lingkungan Pesantren</label>
        <select id="klbStatusPesantren">
          ${['— Pilih —','Di dalam Pesantren','Di luar Pesantren','Terintegrasi dengan Pesantren','Tidak terkait Pesantren'].map(o =>
            `<option value="${o==='— Pilih —'?'':o}" ${(id.statusPesantren||'')===(o==='— Pilih —'?'':o)?'selected':''}>${o}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="klb-form-footer">
      <button class="btn-primary" onclick="klbSaveIdentitas()">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
        Simpan Identitas
      </button>
      <button class="btn-secondary" onclick="klbCancelIdentitas()">Batal</button>
    </div>`;
}

function klbBindIdentitas() { /* inputs self-bind via onclick */ }

window.klbEditIdentitas = function () {
  const card = document.getElementById('klbIdentitasCard');
  if (!card) return;
  const data = klbLoad();
  const id   = data.identitas || {};
  document.getElementById('identitasView').outerHTML = `<div id="identitasForm">${klbIdentitasInputHTML(id)}</div>`;
  document.getElementById('identitasActions').innerHTML =
    `<button class="btn-primary btn-sm" onclick="klbSaveIdentitas()">&#10003; Simpan</button>
     <button class="btn-secondary btn-sm" onclick="klbCancelIdentitas()">Batal</button>`;
};

window.klbCancelIdentitas = function () {
  if (currentPage === 'kelembagaan-profil') switchKlbTab('identitas');
  else window.renderKlbIdentitas();
};

window.klbSaveIdentitas = function () {
  const nama = (document.getElementById('klbNamaLembaga') || {}).value?.trim();
  const email = (document.getElementById('klbEmail') || {}).value?.trim();
  const tahunM = (document.getElementById('klbTahunM') || {}).value?.trim();
  const pimpinan = (document.getElementById('klbNamaPimpinan') || {}).value?.trim();

  if (!nama)     { showToast('Nama Lembaga wajib diisi', 'error'); return; }
  if (!email)    { showToast('Email wajib diisi', 'error'); return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Format email tidak valid', 'error'); return; }
  if (!tahunM)   { showToast('Tahun Berdiri (Masehi) wajib diisi', 'error'); return; }
  if (!pimpinan) { showToast('Nama Pimpinan wajib diisi', 'error'); return; }

  const data = klbLoad();
  data.identitas = {
    namaLembaga:     nama,
    jenisLembaga:    (document.getElementById('klbJenisLembaga') || {}).value || '',
    jenjang:         (document.getElementById('klbJenjang') || {}).value || '',
    npwp:            (document.getElementById('klbNpwp') || {}).value?.trim() || '',
    telepon:         (document.getElementById('klbTelepon') || {}).value?.trim() || '',
    website:         (document.getElementById('klbWebsite') || {}).value?.trim() || '',
    email,
    tahunBerdiriH:   (document.getElementById('klbTahunH') || {}).value?.trim() || '',
    tahunBerdiriM:   tahunM,
    namaPimpinan:    pimpinan,
    statusPesantren: (document.getElementById('klbStatusPesantren') || {}).value || '',
    _updatedAt: new Date().toLocaleString('id-ID'),
  };
  klbSave(data);
  showToast('Identitas Lembaga berhasil disimpan ✓');

  // Refresh current view
  if (currentPage === 'kelembagaan-profil') switchKlbTab('identitas');
  else window.renderKlbIdentitas();
};

/* =============================================
   LOKASI LEMBAGA
   ============================================= */
window.renderKlbLokasi = function () {
  const el = document.getElementById('pageLokasiContent');
  if (el) { el.innerHTML = klbRenderLokasiForm(false); klbBindLokasi(false); }
  const sub = document.getElementById('subKelembagaan');
  const chv = document.getElementById('chevronKelembagaan');
  if (sub) sub.style.display = 'block';
  if (chv) chv.style.transform = 'rotate(90deg)';
};

function klbRenderLokasiForm(inTab) {
  const data = klbLoad();
  const lok  = data.lokasi || {};
  const viewMode = !!(lok.alamat);

  return `
    <div class="klb-section-card" id="klbLokasiCard">
      <div class="klb-section-header">
        <div class="klb-section-title">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Lokasi Lembaga
        </div>
        <div class="klb-section-actions" id="lokasiActions">
          ${viewMode
            ? `<button class="btn-secondary btn-sm" onclick="klbEditLokasi()">&#9998; Edit</button>`
            : `<button class="btn-primary btn-sm" onclick="klbSaveLokasi()">&#10003; Simpan</button>
               <button class="btn-secondary btn-sm" onclick="klbCancelLokasi()">Batal</button>`
          }
        </div>
      </div>
      ${viewMode
        ? `<div id="lokasiView" style="padding:4px 0">${klbLokasiViewHTML(lok)}</div>`
        : `<div id="lokasiForm">${klbLokasiInputHTML(lok)}</div>`
      }
    </div>`;
}

function klbLokasiViewHTML(lok) {
  return `
    <div class="klb-view-grid" style="grid-template-columns:1fr 1fr">
      <div>
        <div class="form-section-title" style="margin-bottom:10px">Wilayah Administratif</div>
        ${klbFieldRow('Provinsi', lok.provinsi, true)}
        ${klbFieldRow('Kota / Kabupaten', lok.kota, true)}
        ${klbFieldRow('Kecamatan', lok.kecamatan)}
        ${klbFieldRow('Kelurahan / Desa', lok.kelurahan)}
        ${klbFieldRow('RT / RW', lok.rtRw)}
        ${klbFieldRow('Kode Pos', lok.kodePos)}
        ${klbFieldRow('Alamat Lengkap', lok.alamat, true)}
      </div>
      <div>
        <div class="form-section-title" style="margin-bottom:10px">Data Aset &amp; Kepemilikan</div>
        ${klbFieldRow('Luas Tanah', lok.luasTanah ? lok.luasTanah + ' m²' : '')}
        ${klbFieldRow('Luas Bangunan', lok.luasBangunan ? lok.luasBangunan + ' m²' : '')}
        ${klbFieldRow('Status Kepemilikan Tanah', lok.statusTanah)}
        ${klbFieldRow('Nomor Sertifikat', lok.nomorSertifikat)}
        ${klbFieldRow('Keterangan Sertifikat', lok.keteranganSertifikat)}
      </div>
    </div>
    <div style="font-size:11px;color:var(--muted);padding-top:8px;border-top:1px solid var(--line);margin-top:8px">
      Terakhir diperbarui: ${lok._updatedAt || '—'}
    </div>`;
}

function klbLokasiInputHTML(lok) {
  const statusTanahOpts = ['— Pilih —','Milik Sendiri (SHM)','Milik Sendiri (HGB)','Wakaf','Pinjam Pakai','Sewa','Lainnya'];
  const provOpts = ['— Pilih Provinsi —','DKI Jakarta','Jawa Barat','Jawa Tengah','Jawa Timur','Banten','DI Yogyakarta','Sumatera Utara','Sumatera Selatan','Sumatera Barat','Riau','Kepulauan Riau','Jambi','Bengkulu','Lampung','Bangka Belitung','Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara','Sulawesi Utara','Sulawesi Tengah','Sulawesi Selatan','Sulawesi Tenggara','Sulawesi Barat','Gorontalo','Maluku','Maluku Utara','Papua','Papua Barat','Nusa Tenggara Barat','Nusa Tenggara Timur','Bali','Aceh'];

  return `
    <div class="klb-supabase-info">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Isi data lokasi sesuai domisili resmi lembaga yang tercantum pada surat keterangan domisili.
    </div>
    <div class="form-section" style="margin-bottom:16px">
      <div class="form-section-title">Wilayah Administratif</div>
      <div class="klb-form-grid" style="padding:14px">
        <div class="klb-field">
          <label>Provinsi <span class="req">*</span></label>
          <select id="klbProvinsi">
            ${provOpts.map(o => `<option value="${o.includes('—')?'':o}" ${(lok.provinsi||'')===(o.includes('—')?'':o)?'selected':''}>${o}</option>`).join('')}
          </select>
        </div>
        <div class="klb-field">
          <label>Kota / Kabupaten <span class="req">*</span></label>
          <input type="text" id="klbKota" value="${klbEsc(lok.kota||'')}" placeholder="Nama kota / kabupaten">
        </div>
        <div class="klb-field">
          <label>Kecamatan</label>
          <input type="text" id="klbKecamatan" value="${klbEsc(lok.kecamatan||'')}" placeholder="Nama kecamatan">
        </div>
        <div class="klb-field">
          <label>Kelurahan / Desa</label>
          <input type="text" id="klbKelurahan" value="${klbEsc(lok.kelurahan||'')}" placeholder="Nama kelurahan / desa">
        </div>
        <div class="klb-field">
          <label>RT / RW</label>
          <input type="text" id="klbRtRw" value="${klbEsc(lok.rtRw||'')}" placeholder="Contoh: 003/005">
        </div>
        <div class="klb-field">
          <label>Kode Pos</label>
          <input type="text" id="klbKodePos" value="${klbEsc(lok.kodePos||'')}" placeholder="Contoh: 10310" maxlength="5">
        </div>
        <div class="klb-field full">
          <label>Alamat Lengkap <span class="req">*</span></label>
          <textarea id="klbAlamat" rows="2" placeholder="Jl. / Gang / No. Rumah / Gedung">${klbEsc(lok.alamat||'')}</textarea>
        </div>
      </div>
    </div>
    <div class="form-section" style="margin-bottom:16px">
      <div class="form-section-title">Data Aset &amp; Kepemilikan Tanah</div>
      <div class="klb-form-grid" style="padding:14px">
        <div class="klb-field">
          <label>Luas Tanah (m²)</label>
          <input type="number" id="klbLuasTanah" value="${klbEsc(lok.luasTanah||'')}" placeholder="Contoh: 500" min="0">
        </div>
        <div class="klb-field">
          <label>Luas Bangunan (m²)</label>
          <input type="number" id="klbLuasBangunan" value="${klbEsc(lok.luasBangunan||'')}" placeholder="Contoh: 300" min="0">
        </div>
        <div class="klb-field">
          <label>Status Kepemilikan Tanah</label>
          <select id="klbStatusTanah">
            ${statusTanahOpts.map(o => `<option value="${o.includes('—')?'':o}" ${(lok.statusTanah||'')===(o.includes('—')?'':o)?'selected':''}>${o}</option>`).join('')}
          </select>
        </div>
        <div class="klb-field">
          <label>Nomor Sertifikat / Bukti Kepemilikan</label>
          <input type="text" id="klbNomorSertifikat" value="${klbEsc(lok.nomorSertifikat||'')}" placeholder="No. sertifikat tanah">
        </div>
        <div class="klb-field full">
          <label>Keterangan Sertifikat / Kepemilikan</label>
          <textarea id="klbKeteranganSertifikat" rows="2" placeholder="Keterangan tambahan mengenai status kepemilikan tanah dan bangunan">${klbEsc(lok.keteranganSertifikat||'')}</textarea>
        </div>
      </div>
    </div>
    <div class="klb-form-footer">
      <button class="btn-primary" onclick="klbSaveLokasi()">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
        Simpan Lokasi
      </button>
      <button class="btn-secondary" onclick="klbCancelLokasi()">Batal</button>
    </div>`;
}

function klbBindLokasi() { /* inputs self-bind via onclick */ }

window.klbEditLokasi = function () {
  const data = klbLoad();
  document.getElementById('lokasiView').outerHTML = `<div id="lokasiForm">${klbLokasiInputHTML(data.lokasi||{})}</div>`;
  document.getElementById('lokasiActions').innerHTML =
    `<button class="btn-primary btn-sm" onclick="klbSaveLokasi()">&#10003; Simpan</button>
     <button class="btn-secondary btn-sm" onclick="klbCancelLokasi()">Batal</button>`;
};

window.klbCancelLokasi = function () {
  if (currentPage === 'kelembagaan-profil') switchKlbTab('lokasi');
  else window.renderKlbLokasi();
};

window.klbSaveLokasi = function () {
  const prov  = (document.getElementById('klbProvinsi') || {}).value?.trim();
  const kota  = (document.getElementById('klbKota') || {}).value?.trim();
  const alamat = (document.getElementById('klbAlamat') || {}).value?.trim();

  if (!prov)   { showToast('Provinsi wajib dipilih', 'error'); return; }
  if (!kota)   { showToast('Kota/Kabupaten wajib diisi', 'error'); return; }
  if (!alamat) { showToast('Alamat Lengkap wajib diisi', 'error'); return; }

  const kodePos = (document.getElementById('klbKodePos') || {}).value?.trim() || '';
  if (kodePos && !/^\d{5}$/.test(kodePos)) { showToast('Kode Pos harus 5 digit angka', 'error'); return; }

  const data = klbLoad();
  data.lokasi = {
    provinsi:            prov,
    kota,
    kecamatan:           (document.getElementById('klbKecamatan') || {}).value?.trim() || '',
    kelurahan:           (document.getElementById('klbKelurahan') || {}).value?.trim() || '',
    rtRw:                (document.getElementById('klbRtRw') || {}).value?.trim() || '',
    kodePos,
    alamat,
    luasTanah:           (document.getElementById('klbLuasTanah') || {}).value?.trim() || '',
    luasBangunan:        (document.getElementById('klbLuasBangunan') || {}).value?.trim() || '',
    statusTanah:         (document.getElementById('klbStatusTanah') || {}).value || '',
    nomorSertifikat:     (document.getElementById('klbNomorSertifikat') || {}).value?.trim() || '',
    keteranganSertifikat:(document.getElementById('klbKeteranganSertifikat') || {}).value?.trim() || '',
    _updatedAt: new Date().toLocaleString('id-ID'),
  };
  klbSave(data);
  showToast('Lokasi Lembaga berhasil disimpan ✓');
  if (currentPage === 'kelembagaan-profil') switchKlbTab('lokasi');
  else window.renderKlbLokasi();
};

/* =============================================
   GALERI FOTO
   ============================================= */
const KLB_GALERI_CATEGORIES = [
  { key: 'gedung',      label: 'Foto Gedung',         icon: '🏢' },
  { key: 'ruangBelajar',label: 'Foto Ruang Belajar',  icon: '📚' },
  { key: 'kegiatan',    label: 'Foto Kegiatan',       icon: '🤝' },
  { key: 'fasilitas',   label: 'Foto Fasilitas',      icon: '⚙️' },
];

window.renderKlbGaleri = function () {
  const el = document.getElementById('pageGaleriContent');
  if (el) { el.innerHTML = klbRenderGaleriHTML(); klbBindGaleri(); }
  const sub = document.getElementById('subKelembagaan');
  const chv = document.getElementById('chevronKelembagaan');
  if (sub) sub.style.display = 'block';
  if (chv) chv.style.transform = 'rotate(90deg)';
};

function klbRenderGaleriHTML() {
  const data = klbLoad();
  const galeri = data.galeri || {};

  return KLB_GALERI_CATEGORIES.map(cat => {
    const photos = galeri[cat.key] || [];
    return `
      <div class="klb-section-card" style="margin-bottom:16px">
        <div class="klb-section-header">
          <div class="klb-section-title">${cat.icon} ${cat.label}</div>
          <label class="btn-primary btn-sm" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Foto
            <input type="file" accept="image/*" multiple style="display:none" onchange="klbUploadGaleri('${cat.key}',this)">
          </label>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:12px">
          JPG/PNG maks. 3MB per foto. ${photos.length} foto tersimpan.
        </div>
        ${photos.length === 0
          ? `<div style="text-align:center;padding:32px;color:var(--muted);background:var(--bg);border-radius:var(--radius-sm);border:2px dashed var(--line)">
              <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin:0 auto 8px;display:block;opacity:.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span style="font-size:12px">Belum ada foto. Klik Upload Foto untuk menambahkan.</span>
             </div>`
          : `<div class="klb-photo-grid" id="galeriGrid-${cat.key}">
              ${photos.map((p, idx) => `
                <div class="klb-photo-item" id="photo-${cat.key}-${idx}">
                  <img src="${p.data}" alt="${klbEsc(p.nama)}" onclick="klbPratinjauFoto('${cat.key}',${idx})">
                  <div class="klb-photo-overlay">
                    <button onclick="klbPratinjauFoto('${cat.key}',${idx})" title="Pratinjau">
                      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                    <label title="Ganti" style="cursor:pointer">
                      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      <input type="file" accept="image/*" style="display:none" onchange="klbGantiGaleri('${cat.key}',${idx},this)">
                    </label>
                    <button onclick="klbHapusGaleri('${cat.key}',${idx})" title="Hapus">
                      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                  <div class="klb-photo-name">${klbEsc(p.nama)}</div>
                </div>`).join('')}
             </div>`
        }
      </div>`;
  }).join('');
}

function klbBindGaleri() { /* upload handlers inline */ }

window.klbUploadGaleri = function (catKey, input) {
  if (!input.files || !input.files.length) return;
  const files = Array.from(input.files);
  const data = klbLoad();
  if (!data.galeri) data.galeri = {};
  if (!data.galeri[catKey]) data.galeri[catKey] = [];

  let loaded = 0;
  files.forEach(file => {
    if (file.size > 3 * 1024 * 1024) { showToast(`File ${file.name} melebihi 3MB`, 'error'); loaded++; return; }
    const reader = new FileReader();
    reader.onload = e => {
      data.galeri[catKey].push({ nama: file.name, data: e.target.result, uploadedAt: new Date().toLocaleString('id-ID') });
      loaded++;
      if (loaded === files.length) {
        klbSave(data);
        showToast(`${files.length} foto berhasil diunggah`);
        if (currentPage === 'kelembagaan-profil') switchKlbTab('galeri');
        else window.renderKlbGaleri();
      }
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
};

window.klbGantiGaleri = function (catKey, idx, input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (file.size > 3 * 1024 * 1024) { showToast('File melebihi 3MB', 'error'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const data = klbLoad();
    if (data.galeri && data.galeri[catKey] && data.galeri[catKey][idx]) {
      data.galeri[catKey][idx] = { nama: file.name, data: e.target.result, uploadedAt: new Date().toLocaleString('id-ID') };
      klbSave(data);
      showToast('Foto berhasil diganti');
      if (currentPage === 'kelembagaan-profil') switchKlbTab('galeri');
      else window.renderKlbGaleri();
    }
    input.value = '';
  };
  reader.readAsDataURL(file);
};

window.klbHapusGaleri = function (catKey, idx) {
  openConfirmModal('Hapus foto ini?', () => {
    const data = klbLoad();
    if (data.galeri && data.galeri[catKey]) {
      data.galeri[catKey].splice(idx, 1);
      klbSave(data);
    }
    closeModal();
    showToast('Foto berhasil dihapus');
    if (currentPage === 'kelembagaan-profil') switchKlbTab('galeri');
    else window.renderKlbGaleri();
  });
};

window.klbPratinjauFoto = function (catKey, idx) {
  const data = klbLoad();
  const photo = (data.galeri && data.galeri[catKey]) ? data.galeri[catKey][idx] : null;
  if (!photo) return;
  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) {
    win.document.write(`<!DOCTYPE html><html><head><title>${photo.nama}</title>
    <style>body{margin:0;background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh}img{max-width:98vw;max-height:96vh;border-radius:4px}</style>
    </head><body><img src="${photo.data}" alt="${photo.nama}"></body></html>`);
    win.document.close();
  } else { showToast('Pop-up diblokir. Izinkan pop-up untuk pratinjau.', 'error'); }
};

/* =============================================
   DOKUMEN PERIZINAN
   ============================================= */
const KLB_DOKUMEN_TYPES = [
  { key: 'aktaNotaris',       label: 'Akta Notaris',               desc: 'Akta pendirian lembaga dari notaris' },
  { key: 'skKemenkumham',     label: 'SK Kemenkumham',             desc: 'Surat Keputusan pengesahan dari Kementerian Hukum dan HAM' },
  { key: 'npwpDok',           label: 'NPWP Lembaga',               desc: 'Scan kartu NPWP lembaga' },
  { key: 'tandaDaftar',       label: 'Tanda Daftar',               desc: 'Surat tanda daftar lembaga' },
  { key: 'suratDomisili',     label: 'Surat Domisili',             desc: 'Surat keterangan domisili dari kelurahan/kecamatan' },
  { key: 'izinOperasional',   label: 'Surat Izin Operasional',     desc: 'Izin operasional dari instansi berwenang' },
  { key: 'dokAkreditasi',     label: 'Dokumen Akreditasi',         desc: 'Sertifikat atau dokumen akreditasi lembaga' },
  { key: 'dokPendukungLain',  label: 'Dokumen Pendukung Lainnya',  desc: 'Dokumen resmi pendukung lainnya' },
];

window.renderKlbDokumen = function () {
  const el = document.getElementById('pageDokumenContent');
  if (el) { el.innerHTML = klbRenderDokumenHTML(); klbBindDokumen(); }
  const sub = document.getElementById('subKelembagaan');
  const chv = document.getElementById('chevronKelembagaan');
  if (sub) sub.style.display = 'block';
  if (chv) chv.style.transform = 'rotate(90deg)';
};

function klbRenderDokumenHTML() {
  const data = klbLoad();
  const docs = data.dokumen || {};

  const filled = KLB_DOKUMEN_TYPES.filter(t => docs[t.key] && docs[t.key].data).length;

  return `
    <div class="klb-section-card" style="margin-bottom:16px">
      <div class="klb-section-header">
        <div class="klb-section-title">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
          Dokumen Perizinan &amp; Legal
        </div>
        <span class="count-badge">${filled} / ${KLB_DOKUMEN_TYPES.length} terisi</span>
      </div>
      <div class="klb-supabase-info" style="margin-bottom:16px">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Upload PDF atau gambar (JPG/PNG), maks. 5MB per dokumen. Data tersimpan lokal. Siap integrasi Supabase Storage untuk keamanan cloud.
      </div>
      ${KLB_DOKUMEN_TYPES.map(dt => klbDokumenItemHTML(dt, docs[dt.key])).join('')}
    </div>`;
}

function klbDokumenItemHTML(dt, doc) {
  const hasDoc = !!(doc && doc.data);
  const isImg  = hasDoc && doc.mimeType && doc.mimeType.startsWith('image/');

  return `
    <div class="klb-dokumen-row" id="dokRow-${dt.key}">
      <div class="klb-dokumen-info">
        <div class="klb-dokumen-label">
          <span class="klb-dokumen-status ${hasDoc ? 'done' : 'empty'}">${hasDoc ? '✅' : '⬜'}</span>
          <span style="font-weight:600">${dt.label}</span>
        </div>
        <div class="klb-dokumen-desc">${dt.desc}</div>
        ${hasDoc ? `<div style="font-size:11px;color:var(--muted);margin-top:2px">📎 ${klbEsc(doc.nama)} &bull; Diunggah: ${klbEsc(doc.uploadedAt)}</div>` : ''}
      </div>
      <div class="klb-dokumen-actions">
        ${hasDoc ? `
          ${isImg ? `<button class="btn-action btn-detail" onclick="klbPratinjauDok('${dt.key}')">Pratinjau</button>` : ''}
          <a href="${doc.data}" download="${klbEsc(doc.nama)}" class="btn-action btn-edit" style="text-decoration:none;display:inline-flex;align-items:center">Unduh</a>
          <label class="btn-action btn-edit" style="cursor:pointer;display:inline-flex;align-items:center">
            Ganti
            <input type="file" accept="image/*,.pdf" style="display:none" onchange="klbUploadDok('${dt.key}',this,true)">
          </label>
          <button class="btn-action btn-del" onclick="klbHapusDok('${dt.key}')">Hapus</button>
        ` : `
          <label class="btn-primary btn-sm" style="cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload
            <input type="file" accept="image/*,.pdf" style="display:none" onchange="klbUploadDok('${dt.key}',this,false)">
          </label>
        `}
      </div>
    </div>`;
}

function klbBindDokumen() { /* handlers inline */ }

window.klbUploadDok = function (key, input, isReplace) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (file.size > 5 * 1024 * 1024) { showToast(`File melebihi 5MB`, 'error'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const data = klbLoad();
    if (!data.dokumen) data.dokumen = {};
    data.dokumen[key] = { nama: file.name, data: e.target.result, mimeType: file.type, uploadedAt: new Date().toLocaleString('id-ID') };
    klbSave(data);
    showToast(`${isReplace ? 'Dokumen berhasil diganti' : 'Dokumen berhasil diunggah'} ✓`);
    if (currentPage === 'kelembagaan-profil') switchKlbTab('dokumen');
    else window.renderKlbDokumen();
    input.value = '';
  };
  reader.readAsDataURL(file);
};

window.klbHapusDok = function (key) {
  openConfirmModal('Hapus dokumen ini? Tindakan tidak dapat dibatalkan.', () => {
    const data = klbLoad();
    if (data.dokumen) delete data.dokumen[key];
    klbSave(data);
    closeModal();
    showToast('Dokumen berhasil dihapus');
    if (currentPage === 'kelembagaan-profil') switchKlbTab('dokumen');
    else window.renderKlbDokumen();
  });
};

window.klbPratinjauDok = function (key) {
  const data = klbLoad();
  const doc = data.dokumen && data.dokumen[key];
  if (!doc) return;
  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) {
    win.document.write(`<!DOCTYPE html><html><head><title>${doc.nama}</title>
    <style>body{margin:0;background:#222;display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:20px}img{max-width:100%;border-radius:8px}</style>
    </head><body><img src="${doc.data}" alt="${doc.nama}"></body></html>`);
    win.document.close();
  } else { showToast('Pop-up diblokir. Izinkan pop-up untuk pratinjau.', 'error'); }
};

/* =============================================
   SUPABASE INTEGRATION PLACEHOLDER
   ============================================= */
/**
 * Supabase Integration Stub
 *
 * Untuk mengaktifkan Supabase:
 * 1. Pasang Supabase JS client: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * 2. Isi SUPABASE_URL dan SUPABASE_ANON_KEY di bawah.
 * 3. Ganti fungsi klbSave/klbLoad dengan versi async yang memanggil Supabase.
 * 4. Aktifkan Row Level Security (RLS) di dashboard Supabase untuk keamanan akses.
 */
const SUPABASE_URL  = '';   // 'https://your-project.supabase.co'
const SUPABASE_KEY  = '';   // 'your-anon-key'

async function klbSyncToSupabase(data) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return; // Not configured
  try {
    const { createClient } = window.supabase || {};
    if (!createClient) return;
    const client = createClient(SUPABASE_URL, SUPABASE_KEY);
    await client.from('kelembagaan').upsert([{ id: 1, ...data, updated_at: new Date().toISOString() }]);
  } catch (err) {
    console.warn('[Supabase] Sync gagal:', err.message);
  }
}
