/**
 * sarpras.js — Modul Sarana & Prasarana
 * Penyimpanan mandiri menggunakan localStorage.
 */
'use strict';

const SARPRAS_KEY = 'wmSaranaPrasarana';
const SARPRAS_CONFIG = {
  tanah: {
    title: 'Data Tanah & Bangunan', page: 'sarpras-tanah', body: 'sarprasTanahBody', count: 'sarprasTanahCount',
    fields: [
      { key: 'namaAset', label: 'Nama Aset', required: true },
      { key: 'jenisAset', label: 'Jenis Aset', type: 'select', options: ['Tanah', 'Bangunan', 'Tanah & Bangunan'] },
      { key: 'luasTanah', label: 'Luas Tanah', placeholder: 'Contoh: 500 m²' },
      { key: 'luasBangunan', label: 'Luas Bangunan', placeholder: 'Contoh: 300 m²' },
      { key: 'alamat', label: 'Alamat', type: 'textarea', full: true },
      { key: 'kepemilikan', label: 'Status Kepemilikan', type: 'select', options: ['Milik Yayasan', 'Wakaf', 'Sewa', 'Pinjam Pakai', 'Lainnya'] },
      { key: 'kondisi', label: 'Kondisi', type: 'select', options: ['Baik', 'Perlu Perawatan', 'Rusak Ringan', 'Rusak Berat'] },
      { key: 'tahunPerolehan', label: 'Tahun Perolehan', type: 'number' },
      { key: 'keterangan', label: 'Keterangan', type: 'textarea', full: true },
    ],
    columns: [['namaAset', 'Nama Aset'], ['jenisAset', 'Jenis'], ['luasTanah', 'Luas Tanah'], ['luasBangunan', 'Luas Bangunan'], ['alamat', 'Alamat'], ['kepemilikan', 'Kepemilikan'], ['kondisi', 'Kondisi']],
  },
  ruangan: {
    title: 'Data Ruangan', page: 'sarpras-ruangan', body: 'sarprasRuanganBody', count: 'sarprasRuanganCount',
    fields: [
      { key: 'nama', label: 'Nama Ruangan', required: true },
      { key: 'jenis', label: 'Jenis Ruangan', type: 'select', options: ['Kantor', 'Ruang Belajar', 'Asrama', 'Aula', 'Gudang', 'Dapur', 'Toilet', 'Lainnya'] },
      { key: 'luas', label: 'Luas Ruangan', placeholder: 'Contoh: 30 m²' },
      { key: 'kapasitas', label: 'Kapasitas', type: 'number', placeholder: 'Jumlah orang' },
      { key: 'lantai', label: 'Lantai / Lokasi' },
      { key: 'kondisi', label: 'Kondisi', type: 'select', options: ['Baik', 'Perlu Perawatan', 'Rusak Ringan', 'Rusak Berat'] },
      { key: 'status', label: 'Status Penggunaan', type: 'select', options: ['Digunakan', 'Tidak Digunakan', 'Dalam Perbaikan'] },
      { key: 'keterangan', label: 'Keterangan', type: 'textarea', full: true },
    ],
    columns: [['nama', 'Nama Ruangan'], ['jenis', 'Jenis'], ['luas', 'Luas'], ['kapasitas', 'Kapasitas'], ['lantai', 'Lantai'], ['kondisi', 'Kondisi'], ['status', 'Status']],
  },
  fasilitas: {
    title: 'Data Fasilitas', page: 'sarpras-fasilitas', body: 'sarprasFasilitasBody', count: 'sarprasFasilitasCount',
    fields: [
      { key: 'nama', label: 'Nama Fasilitas', required: true },
      { key: 'kategori', label: 'Kategori', type: 'select', options: ['Pembelajaran', 'Kesehatan', 'Olahraga', 'Ibadah', 'Keamanan', 'Umum', 'Lainnya'] },
      { key: 'jumlah', label: 'Jumlah', type: 'number', min: 0 },
      { key: 'kondisi', label: 'Kondisi', type: 'select', options: ['Baik', 'Perlu Perawatan', 'Rusak Ringan', 'Rusak Berat'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Tidak Aktif', 'Dalam Perbaikan'] },
      { key: 'lokasi', label: 'Lokasi' },
      { key: 'keterangan', label: 'Keterangan', type: 'textarea', full: true },
    ],
    columns: [['nama', 'Nama Fasilitas'], ['kategori', 'Kategori'], ['jumlah', 'Jumlah'], ['kondisi', 'Kondisi'], ['status', 'Status'], ['lokasi', 'Lokasi']],
  },
  inventaris: {
    title: 'Inventaris Barang', page: 'sarpras-inventaris', body: 'sarprasInventarisBody', count: 'sarprasInventarisCount',
    fields: [
      { key: 'nama', label: 'Nama Barang', required: true },
      { key: 'kode', label: 'Kode Inventaris' },
      { key: 'kategori', label: 'Kategori', type: 'select', options: ['Elektronik', 'Mebel', 'Peralatan Belajar', 'Kendaraan', 'Peralatan Dapur', 'Lainnya'] },
      { key: 'jumlah', label: 'Jumlah', type: 'number', min: 0 },
      { key: 'satuan', label: 'Satuan', placeholder: 'unit, buah, set, dll.' },
      { key: 'kondisi', label: 'Kondisi', type: 'select', options: ['Baik', 'Perlu Perawatan', 'Rusak Ringan', 'Rusak Berat'] },
      { key: 'lokasi', label: 'Lokasi' },
      { key: 'tglPerolehan', label: 'Tanggal Perolehan', type: 'date' },
      { key: 'sumber', label: 'Sumber Perolehan' },
      { key: 'keterangan', label: 'Keterangan', type: 'textarea', full: true },
    ],
    columns: [['nama', 'Nama Barang'], ['kode', 'Kode'], ['kategori', 'Kategori'], ['jumlah', 'Jumlah'], ['kondisi', 'Kondisi'], ['lokasi', 'Lokasi'], ['tglPerolehan', 'Tgl Perolehan']],
  },
};

function sarprasDefaultData() {
  return { tanah: [], ruangan: [], fasilitas: [], inventaris: [], galeri: [] };
}

function sarprasLoad() {
  try {
    const data = JSON.parse(localStorage.getItem(SARPRAS_KEY) || 'null') || sarprasDefaultData();
    for (const key of Object.keys(sarprasDefaultData())) if (!Array.isArray(data[key])) data[key] = [];
    return data;
  } catch (error) {
    return sarprasDefaultData();
  }
}

function sarprasSaveDb(data) {
  try {
    localStorage.setItem(SARPRAS_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    showToast('Penyimpanan browser penuh. Hapus foto atau data yang tidak digunakan.', 'error');
    return false;
  }
}

function sarprasEsc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function sarprasId() {
  return 'sp-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function sarprasOpenMenu() {
  const menu = document.getElementById('subSarpras');
  const button = document.getElementById('navSarpras');
  const chevron = document.getElementById('chevronSarpras');
  if (menu) menu.style.display = 'block';
  if (button) button.setAttribute('aria-expanded', 'true');
  if (chevron) chevron.style.transform = 'rotate(90deg)';
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('navSarpras');
  const menu = document.getElementById('subSarpras');
  const chevron = document.getElementById('chevronSarpras');
  if (!button || !menu) return;
  button.addEventListener('click', event => {
    event.stopPropagation();
    const open = menu.style.display !== 'none';
    menu.style.display = open ? 'none' : 'block';
    button.setAttribute('aria-expanded', String(!open));
    if (chevron) chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
    if (!open) showPage('sarpras-dashboard');
  });
});

window.renderSarprasDashboard = function () {
  const data = sarprasLoad();
  sarprasOpenMenu();
  const counts = {
    tanah: data.tanah.length,
    ruangan: data.ruangan.length,
    fasilitas: data.fasilitas.length,
    inventaris: data.inventaris.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0),
    galeri: data.galeri.length,
  };
  const cards = [
    ['green', '⌂', 'Tanah & Bangunan', counts.tanah + ' aset', 'Data aset properti', 'sarpras-tanah'],
    ['blue', '▤', 'Ruangan', counts.ruangan + ' ruangan', 'Data ruang yayasan', 'sarpras-ruangan'],
    ['amber', '◇', 'Fasilitas', data.fasilitas.length + ' jenis', 'Fasilitas terdata', 'sarpras-fasilitas'],
    ['teal', '▣', 'Inventaris Barang', counts.inventaris + ' unit', 'Total unit tercatat', 'sarpras-inventaris'],
  ];
  const grid = document.getElementById('sarprasDashGrid');
  if (grid) grid.innerHTML = cards.map(card => `
    <div class="stat-card sarpras-stat-card" role="button" tabindex="0" onclick="showPage('${card[5]}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showPage('${card[5]}')}">
      <div class="stat-icon ${card[0]}">${card[1]}</div><div class="stat-body"><div class="stat-label">${card[2]}</div><div class="stat-value" style="font-size:17px">${card[3]}</div><div class="stat-hint">${card[4]}</div></div>
    </div>`).join('');
  const summary = document.getElementById('sarprasOverview');
  if (summary) {
    const filled = [counts.tanah, counts.ruangan, data.fasilitas.length, data.inventaris.length, counts.galeri].filter(Boolean).length;
    summary.innerHTML = `
      <div class="info-row"><span>Aset Tanah &amp; Bangunan</span><b>${counts.tanah} aset</b></div>
      <div class="info-row"><span>Ruangan Terdata</span><b>${counts.ruangan} ruangan</b></div>
      <div class="info-row"><span>Jenis Fasilitas</span><b>${data.fasilitas.length} jenis</b></div>
      <div class="info-row"><span>Unit Inventaris</span><b>${counts.inventaris} unit</b></div>
      <div class="info-row"><span>Foto Galeri</span><b>${counts.galeri} foto</b></div>
      <div style="margin-top:16px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span>Kelengkapan modul</span><b style="color:var(--green)">${Math.round(filled / 5 * 100)}%</b></div><div style="height:8px;background:var(--line);border-radius:8px"><div style="height:8px;width:${filled / 5 * 100}%;background:var(--green);border-radius:8px"></div></div></div>`;
  }
};

window.renderSarprasPage = function (type) {
  const config = SARPRAS_CONFIG[type];
  if (!config) return;
  sarprasOpenMenu();
  const data = sarprasLoad()[type];
  const tbody = document.getElementById(config.body);
  const badge = document.getElementById(config.count);
  if (badge) badge.textContent = data.length;
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${config.columns.length + 2}">Belum ada data ${sarprasEsc(config.title.toLowerCase())}. Gunakan tombol tambah untuk mulai mencatat.</td></tr>`;
    return;
  }
  tbody.innerHTML = [...data].reverse().map((record, index) => `<tr>
    <td class="num-cell">${data.length - index}</td>
    ${config.columns.map(([key]) => `<td>${sarprasEsc(record[key] || '—')}</td>`).join('')}
    <td><div class="td-actions"><button class="btn-action btn-edit" onclick="sarprasEdit('${type}','${sarprasEsc(record.id)}')">Edit</button><button class="btn-action btn-del" onclick="sarprasDelete('${type}','${sarprasEsc(record.id)}')">Hapus</button></div></td>
  </tr>`).join('');
};

window.sarprasFilter = function (type, query) {
  const config = SARPRAS_CONFIG[type];
  const tbody = config && document.getElementById(config.body);
  if (!tbody) return;
  const term = String(query || '').toLocaleLowerCase('id');
  tbody.querySelectorAll('tr:not(.empty-row)').forEach(row => {
    row.style.display = row.textContent.toLocaleLowerCase('id').includes(term) ? '' : 'none';
  });
};

function sarprasFieldMarkup(field, value = '') {
  const label = `${sarprasEsc(field.label)}${field.required ? ' <span style="color:var(--red)">*</span>' : ''}`;
  const full = field.full ? ' full-width' : '';
  if (field.type === 'select') {
    const options = field.options.map(option => `<option value="${sarprasEsc(option)}" ${value === option ? 'selected' : ''}>${sarprasEsc(option)}</option>`).join('');
    return `<div class="form-group${full}"><label>${label}</label><select name="${field.key}" ${field.required ? 'required' : ''}>${options}</select></div>`;
  }
  if (field.type === 'textarea') return `<div class="form-group${full}"><label>${label}</label><textarea name="${field.key}" rows="3" ${field.required ? 'required' : ''}>${sarprasEsc(value)}</textarea></div>`;
  const type = field.type || 'text';
  return `<div class="form-group${full}"><label>${label}</label><input name="${field.key}" type="${type}" value="${sarprasEsc(value)}" placeholder="${sarprasEsc(field.placeholder || '')}" ${field.required ? 'required' : ''} ${field.min !== undefined ? `min="${field.min}"` : ''}></div>`;
}

window.sarprasOpenAdd = function (type) {
  if (!SARPRAS_CONFIG[type]) return;
  openModal('sarpras-record');
  document.getElementById('sarprasRecordId').value = '';
  document.getElementById('sarprasRecordType').value = type;
  document.getElementById('sarprasModalTitle').textContent = `Tambah ${SARPRAS_CONFIG[type].title}`;
  document.getElementById('sarprasFormFields').innerHTML = SARPRAS_CONFIG[type].fields.map(field => sarprasFieldMarkup(field)).join('');
};

window.sarprasEdit = function (type, id) {
  const config = SARPRAS_CONFIG[type];
  const record = config && sarprasLoad()[type].find(item => item.id === id);
  if (!record) return;
  openModal('sarpras-record');
  document.getElementById('sarprasRecordId').value = record.id;
  document.getElementById('sarprasRecordType').value = type;
  document.getElementById('sarprasModalTitle').textContent = `Edit ${config.title}`;
  document.getElementById('sarprasFormFields').innerHTML = config.fields.map(field => sarprasFieldMarkup(field, record[field.key] || '')).join('');
};

window.sarprasSave = function (event) {
  event.preventDefault();
  const type = document.getElementById('sarprasRecordType').value;
  const config = SARPRAS_CONFIG[type];
  if (!config) return;
  const form = document.getElementById('sarprasRecordForm');
  if (!form.reportValidity()) return;
  const db = sarprasLoad();
  const id = document.getElementById('sarprasRecordId').value;
  const record = { id: id || sarprasId(), updatedAt: new Date().toISOString() };
  config.fields.forEach(field => { record[field.key] = String(new FormData(form).get(field.key) || '').trim(); });
  const index = db[type].findIndex(item => item.id === id);
  if (index >= 0) db[type][index] = { ...db[type][index], ...record };
  else db[type].push(record);
  if (!sarprasSaveDb(db)) return;
  closeModal();
  window.renderSarprasPage(type);
  window.renderSarprasDashboard();
  showToast(index >= 0 ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan');
};

window.sarprasDelete = function (type, id) {
  const config = SARPRAS_CONFIG[type];
  if (!config) return;
  openConfirmModal(`Hapus data ini dari ${config.title}? Tindakan ini tidak dapat dibatalkan.`, () => {
    const data = sarprasLoad();
    data[type] = data[type].filter(item => item.id !== id);
    if (!sarprasSaveDb(data)) return;
    closeModal();
    window.renderSarprasPage(type);
    window.renderSarprasDashboard();
    showToast('Data berhasil dihapus');
  });
};

window.renderSarprasGallery = function () {
  sarprasOpenMenu();
  const gallery = sarprasLoad().galeri;
  const badge = document.getElementById('sarprasGaleriCount');
  const grid = document.getElementById('sarprasGalleryGrid');
  if (badge) badge.textContent = gallery.length;
  if (!grid) return;
  if (!gallery.length) {
    grid.innerHTML = '<div class="sarpras-gallery-empty">Belum ada foto. Unggah dokumentasi sarana dan prasarana untuk memulai galeri.</div>';
    return;
  }
  grid.innerHTML = [...gallery].reverse().map(item => `
    <article class="sarpras-gallery-card">
      <img src="${item.data}" alt="${sarprasEsc(item.caption || 'Foto sarana prasarana')}" loading="lazy">
      <div class="sarpras-gallery-caption"><strong>${sarprasEsc(item.caption || item.name)}</strong><span>${sarprasEsc(item.category || 'Umum')}</span></div>
      <div class="sarpras-gallery-actions"><button class="btn-action btn-edit" onclick="sarprasGalleryEdit('${sarprasEsc(item.id)}')">Edit</button><a class="btn-action btn-detail" href="${item.data}" download="${sarprasEsc(item.name)}">Unduh</a><button class="btn-action btn-del" onclick="sarprasGalleryDelete('${sarprasEsc(item.id)}')">Hapus</button></div>
    </article>`).join('');
};

window.sarprasGalleryUpload = async function (input) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  if (files.some(file => !file.type.startsWith('image/'))) {
    showToast('Galeri hanya menerima file gambar', 'error'); input.value = ''; return;
  }
  if (files.some(file => file.size > 2 * 1024 * 1024)) {
    showToast('Setiap foto harus berukuran maksimal 2MB', 'error'); input.value = ''; return;
  }
  try {
    const records = await Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: sarprasId(), name: file.name, caption: file.name.replace(/\.[^.]+$/, ''), category: 'Umum', type: file.type, data: reader.result, createdAt: new Date().toISOString() });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    const db = sarprasLoad();
    db.galeri.push(...records);
    if (sarprasSaveDb(db)) {
      window.renderSarprasGallery();
      window.renderSarprasDashboard();
      showToast(`${records.length} foto berhasil ditambahkan ke galeri`);
    }
  } catch (error) {
    showToast('Foto tidak dapat dibaca', 'error');
  }
  input.value = '';
};

window.sarprasGalleryEdit = function (id) {
  const item = sarprasLoad().galeri.find(record => record.id === id);
  if (!item) return;
  openModal('sarpras-record');
  document.getElementById('sarprasRecordId').value = id;
  document.getElementById('sarprasRecordType').value = 'galeri';
  document.getElementById('sarprasModalTitle').textContent = 'Edit Foto Galeri';
  document.getElementById('sarprasFormFields').innerHTML = `
    <div class="form-group full-width"><label>Pratinjau Foto</label><img src="${item.data}" alt="${sarprasEsc(item.caption)}" style="max-width:100%;max-height:220px;object-fit:contain;border-radius:var(--radius-sm);border:1px solid var(--line)"></div>
    <div class="form-group full-width"><label>Ganti Foto (opsional)</label><input type="file" id="sarprasGalleryReplacement" accept="image/*" onchange="sarprasPreviewReplacement(this)"><div class="file-hint">JPG/PNG maks. 2MB. Kosongkan jika tidak ingin mengganti foto.</div><div id="sarprasReplacementPreview" class="doc-preview" style="display:none"></div></div>
    <div class="form-group"><label>Judul Foto *</label><input name="caption" value="${sarprasEsc(item.caption || '')}" required></div>
    <div class="form-group"><label>Kategori</label><select name="category">${['Umum', 'Gedung', 'Ruangan', 'Fasilitas', 'Inventaris', 'Kegiatan'].map(category => `<option ${item.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></div>`;
};

window.sarprasPreviewReplacement = function (input) {
  const preview = document.getElementById('sarprasReplacementPreview');
  const file = input.files && input.files[0];
  if (!preview || !file) return;
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
    showToast('Pilih gambar dengan ukuran maksimal 2MB', 'error'); input.value = ''; preview.style.display = 'none'; return;
  }
  const reader = new FileReader();
  reader.onload = () => { preview.innerHTML = `<img src="${reader.result}" alt="Pratinjau foto pengganti" style="max-width:100%;max-height:140px;border-radius:6px">`; preview.style.display = 'block'; };
  reader.readAsDataURL(file);
};

window.sarprasGalleryDelete = function (id) {
  openConfirmModal('Hapus foto ini dari galeri sarana prasarana?', () => {
    const db = sarprasLoad();
    db.galeri = db.galeri.filter(item => item.id !== id);
    if (!sarprasSaveDb(db)) return;
    closeModal();
    window.renderSarprasGallery();
    window.renderSarprasDashboard();
    showToast('Foto berhasil dihapus dari galeri');
  });
};

const sarprasBaseSave = window.sarprasSave;
window.sarprasSave = async function (event) {
  if (document.getElementById('sarprasRecordType').value !== 'galeri') return sarprasBaseSave(event);
  event.preventDefault();
  const form = document.getElementById('sarprasRecordForm');
  if (!form.reportValidity()) return;
  const db = sarprasLoad();
  const id = document.getElementById('sarprasRecordId').value;
  const item = db.galeri.find(record => record.id === id);
  if (!item) return;
  const file = document.getElementById('sarprasGalleryReplacement').files[0];
  const commit = dataUrl => {
    item.caption = String(new FormData(form).get('caption') || '').trim();
    item.category = String(new FormData(form).get('category') || 'Umum');
    if (dataUrl) { item.data = dataUrl; item.name = file.name; item.type = file.type; }
    if (!sarprasSaveDb(db)) return;
    closeModal();
    window.renderSarprasGallery();
    window.renderSarprasDashboard();
    showToast('Foto galeri berhasil diperbarui');
  };
  if (!file) { commit(null); return; }
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) { showToast('Pilih gambar dengan ukuran maksimal 2MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = () => commit(reader.result);
  reader.onerror = () => showToast('Foto tidak dapat dibaca', 'error');
  reader.readAsDataURL(file);
};
