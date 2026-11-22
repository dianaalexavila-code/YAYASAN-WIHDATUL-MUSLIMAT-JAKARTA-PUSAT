/**
 * export.js — CSV & Excel Export
 * Yayasan Wihdatul Muslimat Dashboard
 */

/** Export all data as CSV */
function exportCSV() {
  if (!window._appDb) { showToast('Data belum dimuat', 'error'); return; }
  const db = window._appDb;
  const rows = [];

  // Header
  rows.push(['=== LAPORAN YAYASAN WIHDATUL MUSLIMAT ===']);
  rows.push(['Diekspor pada:', new Date().toLocaleString('id-ID')]);
  rows.push([]);

  // Anak Asuh
  rows.push(['--- DATA ANAK ASUH ---']);
  rows.push(['No', 'Nama', 'NIK', 'Tgl Lahir', 'Usia', 'JK', 'Kategori', 'Pendidikan', 'Nama Wali']);
  db.anak.forEach((a, i) => {
    rows.push([i + 1, a.nama, a.nik || '-', a.tglLahir || '-', calcAge(a.tglLahir), a.jk || '-', a.kategori || '-', a.pendidikan || '-', a.wali || '-']);
  });
  rows.push([]);

  // Lansia
  rows.push(['--- DATA LANSIA ---']);
  rows.push(['No', 'Nama', 'NIK', 'Tgl Lahir', 'Usia', 'JK',
             'Tempat Lahir', 'Status Kawin', 'Pendidikan', 'Pekerjaan', 'No. Telepon',
             'No KK', 'RT/RW', 'Alamat', 'Kelurahan', 'Kecamatan', 'Kota', 'Status Tinggal',
             'Wali/Keluarga', 'Hub. Wali', 'No. HP Keluarga',
             'Kondisi Kesehatan', 'Kondisi Fisik', 'Riwayat Penyakit',
             'Kemandirian', 'Kebutuhan Bantuan', 'Penghasilan', 'Bansos', 'BPJS',
             'Catatan', 'Tgl Daftar', 'Status']);
  db.lansia.forEach((l, i) => {
    const age = l.tglLahir ? calcAge(l.tglLahir) : (l.usia || '-');
    rows.push([i + 1, l.nama, l.nik || '-', l.tglLahir || '-', age, l.jk || '-',
               l.tempatLahir || '-', l.statusKawin || '-', l.pendidikan || '-', l.pekerjaan || '-', l.telp || '-',
               l.noKK || '-', l.rtRw || '-', l.alamat || '-', l.kelurahan || '-', l.kecamatan || '-', l.kota || '-', l.statusTinggal || '-',
               l.wali || '-', l.hubWali || '-', l.telpWali || '-',
               l.kondisiKesehatan || '-', l.kondisiFisik || '-', l.penyakit || '-',
               l.kemandirian || '-', l.kebutuhanBantuan || '-', l.penghasilan || '-', l.bansos || '-', l.bpjs || '-',
               l.catatan || '-', l.tglDaftar || '-', l.status || '-']);
  });
  rows.push([]);

  // Kegiatan
  rows.push(['--- KEGIATAN SOSIAL ---']);
  rows.push(['No', 'Nama Kegiatan', 'Tanggal', 'Lokasi', 'Penerima Manfaat', 'Dokumentasi']);
  db.kegiatan.forEach((k, i) => {
    rows.push([i + 1, k.nama, k.tgl || '-', k.lokasi || '-', k.penerima || 0, k.dokumentasi || '-']);
  });
  rows.push([]);

  // Keuangan
  rows.push(['--- DONASI & KEUANGAN ---']);
  rows.push(['No', 'Tanggal', 'Keterangan', 'Jenis', 'Nominal (Rp)']);
  db.keuangan.forEach((f, i) => {
    rows.push([i + 1, f.tgl || '-', f.ket, f.jenis, f.nominal]);
  });
  rows.push([]);

  // Summary
  const totIn  = db.keuangan.filter(f => f.jenis === 'Pemasukan').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const totOut = db.keuangan.filter(f => f.jenis === 'Pengeluaran').reduce((s, f) => s + Number(f.nominal || 0), 0);
  rows.push(['--- RINGKASAN ---']);
  rows.push(['Total Anak Asuh', db.anak.length]);
  rows.push(['Total Lansia', db.lansia.length]);
  rows.push(['Total Kegiatan', db.kegiatan.length]);
  rows.push(['Total Transaksi', db.keuangan.length]);
  rows.push(['Total Pemasukan', totIn]);
  rows.push(['Total Pengeluaran', totOut]);
  rows.push(['Saldo Akhir', totIn - totOut]);

  const csv = rows.map(r => r.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n');
  downloadFile(csv, 'laporan-ywm.csv', 'text/csv;charset=utf-8;');
  showToast('CSV berhasil diunduh');
}

/** Export as Excel-compatible TSV (opens in Excel) */
function exportExcel() {
  if (!window._appDb) { showToast('Data belum dimuat', 'error'); return; }
  const db = window._appDb;

  // Build HTML table for Excel
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
<x:ExcelWorksheet><x:Name>Laporan YWM</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;

  html += '<table border="1">';
  html += `<tr><th colspan="9" style="background:#087443;color:white;font-size:16px">LAPORAN YAYASAN WIHDATUL MUSLIMAT JAKARTA PUSAT</th></tr>`;
  html += `<tr><td colspan="9">Diekspor: ${new Date().toLocaleString('id-ID')}</td></tr>`;
  html += '<tr><td colspan="9"></td></tr>';

  // Anak Asuh
  html += `<tr><th colspan="9" style="background:#e9f6ef;color:#065c35">DATA ANAK ASUH</th></tr>`;
  html += '<tr><th>No</th><th>Nama</th><th>NIK</th><th>Tgl Lahir</th><th>Usia</th><th>JK</th><th>Kategori</th><th>Pendidikan</th><th>Nama Wali</th></tr>';
  db.anak.forEach((a, i) => {
    html += `<tr><td>${i+1}</td><td>${xe(a.nama)}</td><td>${xe(a.nik)}</td><td>${xe(a.tglLahir)}</td><td>${calcAge(a.tglLahir)}</td><td>${xe(a.jk)}</td><td>${xe(a.kategori)}</td><td>${xe(a.pendidikan)}</td><td>${xe(a.wali)}</td></tr>`;
  });
  html += '<tr><td colspan="9"></td></tr>';

  // Lansia
  html += `<tr><th colspan="9" style="background:#e9f6ef;color:#065c35">DATA LANSIA</th></tr>`;
  html += '<tr><th>No</th><th>Nama</th><th>NIK</th><th>Tgl Lahir</th><th>Usia</th><th>JK</th><th>Kondisi Kesehatan</th><th>Wali/Keluarga</th><th>Alamat</th></tr>';
  db.lansia.forEach((l, i) => {
    const age = l.tglLahir ? calcAge(l.tglLahir) : (l.usia || '-');
    html += `<tr><td>${i+1}</td><td>${xe(l.nama)}</td><td>${xe(l.nik)}</td><td>${xe(l.tglLahir)}</td><td>${age}</td><td>${xe(l.jk)}</td><td>${xe(l.kondisiKesehatan)}</td><td>${xe(l.wali)}</td><td>${xe(l.alamat)}</td></tr>`;
  });
  html += '<tr><td colspan="9"></td></tr>';

  // Kegiatan
  html += `<tr><th colspan="9" style="background:#e9f6ef;color:#065c35">KEGIATAN SOSIAL</th></tr>`;
  html += '<tr><th>No</th><th>Nama Kegiatan</th><th>Tanggal</th><th>Lokasi</th><th>Penerima</th><th>Dokumentasi</th><th></th><th></th><th></th></tr>';
  db.kegiatan.forEach((k, i) => {
    html += `<tr><td>${i+1}</td><td>${xe(k.nama)}</td><td>${xe(k.tgl)}</td><td>${xe(k.lokasi)}</td><td>${xe(k.penerima)}</td><td>${xe(k.dokumentasi)}</td><td></td><td></td><td></td></tr>`;
  });
  html += '<tr><td colspan="9"></td></tr>';

  // Keuangan
  html += `<tr><th colspan="9" style="background:#e9f6ef;color:#065c35">DONASI & KEUANGAN</th></tr>`;
  html += '<tr><th>No</th><th>Tanggal</th><th>Keterangan</th><th>Jenis</th><th>Nominal (Rp)</th><th></th><th></th><th></th><th></th></tr>';
  db.keuangan.forEach((f, i) => {
    const color = f.jenis === 'Pemasukan' ? '#f0fdf4' : '#fdf2f2';
    html += `<tr style="background:${color}"><td>${i+1}</td><td>${xe(f.tgl)}</td><td>${xe(f.ket)}</td><td>${xe(f.jenis)}</td><td style="text-align:right">${Number(f.nominal||0).toLocaleString('id-ID')}</td><td></td><td></td><td></td><td></td></tr>`;
  });

  const totIn  = db.keuangan.filter(f => f.jenis === 'Pemasukan').reduce((s, f) => s + Number(f.nominal || 0), 0);
  const totOut = db.keuangan.filter(f => f.jenis === 'Pengeluaran').reduce((s, f) => s + Number(f.nominal || 0), 0);
  html += `<tr><th colspan="4" style="text-align:right">Total Pemasukan</th><td style="text-align:right;color:green;font-weight:bold">${totIn.toLocaleString('id-ID')}</td><td></td><td></td><td></td><td></td></tr>`;
  html += `<tr><th colspan="4" style="text-align:right">Total Pengeluaran</th><td style="text-align:right;color:red;font-weight:bold">${totOut.toLocaleString('id-ID')}</td><td></td><td></td><td></td><td></td></tr>`;
  html += `<tr><th colspan="4" style="text-align:right">Saldo Akhir</th><td style="text-align:right;font-weight:bold">${(totIn-totOut).toLocaleString('id-ID')}</td><td></td><td></td><td></td><td></td></tr>`;

  html += '</table></body></html>';

  downloadFile(html, 'laporan-ywm.xls', 'application/vnd.ms-excel;charset=utf-8;');
  showToast('Excel berhasil diunduh');
}

/** Download helper */
function downloadFile(content, filename, mimeType) {
  const BOM = mimeType.includes('csv') ? '\uFEFF' : '';
  const blob = new Blob([BOM + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}

/** Get currently visible (filtered) lansia rows from table */
function _getVisibleLansia() {
  if (!window._appDb) return [];
  const rows = document.querySelectorAll('#lansiaTableBody tr');
  const visibleIds = [];
  rows.forEach(tr => {
    if (tr.style.display === 'none' || tr.classList.contains('empty-row')) return;
    const btn = tr.querySelector('.btn-edit');
    if (btn) {
      const match = btn.getAttribute('onclick').match(/editLansia\('([^']+)'\)/);
      if (match) visibleIds.push(match[1]);
    }
  });
  if (!visibleIds.length) return window._appDb.lansia; // no filter active
  return window._appDb.lansia.filter(l => visibleIds.includes(l.id));
}

/** Export Lansia data (filtered) to Excel */
function exportLansiaExcel() {
  if (!window._appDb) { showToast('Data belum dimuat', 'error'); return; }
  const list = _getVisibleLansia();

  if (window.XLSX) {
    exportXlsxSheet('data-lansia-ywm.xlsx', 'Data Lansia',
      ['No', 'Nama Lengkap', 'NIK', 'Tgl Lahir', 'Usia', 'JK', 'Tempat Lahir', 'Status Kawin', 'Pendidikan', 'Pekerjaan', 'No. Telepon', 'No KK', 'RT/RW', 'Alamat', 'Kelurahan', 'Kecamatan', 'Kota', 'Status Tinggal', 'Wali/Keluarga', 'Hubungan Wali', 'No. HP Keluarga', 'Kondisi Kesehatan', 'Kondisi Fisik', 'Riwayat Penyakit', 'Kemandirian', 'Kebutuhan Bantuan', 'Penghasilan', 'Bansos', 'BPJS', 'Catatan', 'Tgl Daftar', 'Status', 'Foto'],
      list.map((l, i) => [i + 1, l.nama || '', l.nik || '', l.tglLahir || '', l.tglLahir ? calcAge(l.tglLahir) : (l.usia || ''), l.jk || '', l.tempatLahir || '', l.statusKawin || '', l.pendidikan || '', l.pekerjaan || '', l.telp || '', l.noKK || '', l.rtRw || '', l.alamat || '', l.kelurahan || '', l.kecamatan || '', l.kota || '', l.statusTinggal || '', l.wali || '', l.hubWali || '', l.telpWali || '', l.kondisiKesehatan || '', l.kondisiFisik || '', l.penyakit || '', l.kemandirian || '', l.kebutuhanBantuan || '', l.penghasilan || '', l.bansos || '', l.bpjs || '', l.catatan || '', l.tglDaftar || '', l.status || 'Aktif', l.foto ? 'Ada' : 'Tidak ada']));
    showToast(`Excel Data Lansia (${list.length} data) berhasil diunduh`);
    return;
  }

  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
<x:ExcelWorksheet><x:Name>Data Lansia YWM</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;

  html += '<table border="1">';
  html += `<tr><th colspan="22" style="background:#087443;color:white;font-size:15px">DATA LANSIA — YAYASAN WIHDATUL MUSLIMAT JAKARTA PUSAT</th></tr>`;
  html += `<tr><td colspan="22">Diekspor: ${new Date().toLocaleString('id-ID')} | Jumlah: ${list.length} orang</td></tr>`;
  html += '<tr><td colspan="22"></td></tr>';

  html += `<tr style="background:#e9f6ef">
    <th>No</th><th>Nama Lengkap</th><th>NIK</th><th>Tgl Lahir</th><th>Usia</th><th>JK</th>
    <th>Tempat Lahir</th><th>Status Kawin</th><th>Pendidikan</th><th>Pekerjaan</th>
    <th>No. Telepon</th><th>RT/RW</th><th>Alamat</th><th>Kelurahan</th><th>Kecamatan</th><th>Kota</th>
    <th>Wali/Keluarga</th><th>Hub. Wali</th><th>No. HP Keluarga</th>
    <th>Kondisi Kesehatan</th><th>Kebutuhan Bantuan</th><th>Status</th>
  </tr>`;

  list.forEach((l, i) => {
    const age = l.tglLahir ? calcAge(l.tglLahir) : (l.usia || '-');
    html += `<tr>
      <td>${i+1}</td><td>${xe(l.nama)}</td><td>${xe(l.nik)}</td><td>${xe(l.tglLahir)}</td><td>${age}</td><td>${xe(l.jk)}</td>
      <td>${xe(l.tempatLahir)}</td><td>${xe(l.statusKawin)}</td><td>${xe(l.pendidikan)}</td><td>${xe(l.pekerjaan)}</td>
      <td>${xe(l.telp)}</td><td>${xe(l.rtRw)}</td><td>${xe(l.alamat)}</td><td>${xe(l.kelurahan)}</td><td>${xe(l.kecamatan)}</td><td>${xe(l.kota)}</td>
      <td>${xe(l.wali)}</td><td>${xe(l.hubWali)}</td><td>${xe(l.telpWali)}</td>
      <td>${xe(l.kondisiKesehatan)}</td><td>${xe(l.kebutuhanBantuan)}</td><td>${xe(l.status||'Aktif')}</td>
    </tr>`;
  });

  html += '</table></body></html>';
  downloadFile(html, 'data-lansia-ywm.xls', 'application/vnd.ms-excel;charset=utf-8;');
  showToast(`Excel Data Lansia (${list.length} data) berhasil diunduh`);
}

/** Export Lansia data (filtered) to PDF via browser print */
function exportLansiaPDF() {
  if (!window._appDb) { showToast('Data belum dimuat', 'error'); return; }
  const list = _getVisibleLansia();

  const rows = list.map((l, i) => {
    const age = l.tglLahir ? calcAge(l.tglLahir) : (l.usia || '-');
    const kls = l.kondisiKesehatan || '—';
    return `<tr>
      <td>${i+1}</td>
      <td><b>${xe(l.nama)}</b><br><small>${xe(l.nik || '—')}</small></td>
      <td>${xe(l.tglLahir ? l.tglLahir.split('-').reverse().join('/') : '—')}<br><small>${age} thn</small></td>
      <td>${xe(l.jk || '—')}</td>
      <td>${xe(l.pendidikan || '—')}</td>
      <td>${xe(kls)}</td>
      <td>${xe(l.kebutuhanBantuan || '—')}</td>
      <td>${xe(l.wali || '—')}<br><small>${xe(l.telpWali || l.telp || '—')}</small></td>
      <td style="font-size:10px">${xe(l.kecamatan || '—')}</td>
      <td>${xe(l.status || 'Aktif')}</td>
    </tr>`;
  }).join('');

  /* Rekapitulasi */
  const lk  = list.filter(l => l.jk === 'Laki-laki').length;
  const pr  = list.filter(l => l.jk === 'Perempuan').length;
  const klp60 = list.filter(l => { const a = l.tglLahir ? calcAge(l.tglLahir) : (l.usia||0); return a >= 60 && a < 70; }).length;
  const klp70 = list.filter(l => { const a = l.tglLahir ? calcAge(l.tglLahir) : (l.usia||0); return a >= 70 && a < 80; }).length;
  const klp80 = list.filter(l => { const a = l.tglLahir ? calcAge(l.tglLahir) : (l.usia||0); return a >= 80; }).length;

  const pdfHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Data Lansia — Yayasan Wihdatul Muslimat</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 12mm; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
    h2 { color: #075b35; margin:0 0 2px; font-size: 15px; }
    .sub { color: #555; font-size: 10px; }
    .rekap { display:flex; gap:16px; background:#f5faf7; border:1px solid #c5e0d0; border-radius:4px; padding:8px 12px; margin-bottom:12px; font-size:10px; }
    .rekap b { color:#075b35; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #075b35; color: white; padding: 5px 7px; text-align: left; font-size: 10px; }
    td { padding: 4px 7px; border-bottom: 1px solid #e0e0e0; vertical-align: top; font-size: 10px; }
    tr:nth-child(even) td { background: #f5faf7; }
    .footer { margin-top: 14px; font-size: 9px; color: #999; border-top: 1px solid #ddd; padding-top: 6px; }
    @media print { @page { size: A4 landscape; margin: 10mm; } }
  </style></head><body>
  <div class="header">
    <div>
      <h2>DATA LANSIA — YAYASAN WIHDATUL MUSLIMAT JAKARTA PUSAT</h2>
      <div class="sub">Dicetak: ${new Date().toLocaleString('id-ID')} &nbsp;|&nbsp; Total data: ${list.length} orang</div>
    </div>
  </div>
  <div class="rekap">
    <span>Laki-laki: <b>${lk}</b></span>
    <span>Perempuan: <b>${pr}</b></span>
    <span>Usia 60–69: <b>${klp60}</b></span>
    <span>Usia 70–79: <b>${klp70}</b></span>
    <span>Usia ≥80: <b>${klp80}</b></span>
  </div>
  <table>
    <thead><tr>
      <th>#</th><th>Nama / NIK</th><th>Tgl Lahir</th><th>JK</th>
      <th>Pendidikan</th><th>Kondisi Kesehatan</th><th>Kebutuhan Bantuan</th>
      <th>Wali / Kontak</th><th>Kecamatan</th><th>Status</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    Dokumen ini digenerate otomatis oleh Dashboard Yayasan Wihdatul Muslimat.
    Data bersifat konfidensial — tidak untuk disebarluaskan tanpa izin.
  </div>
  <script>window.onload = function(){ window.print(); }<\/script>
  </body></html>`;

  const win = window.open('', '_blank', 'width=1100,height=750');
  if (win) {
    win.document.write(pdfHtml);
    win.document.close();
  } else {
    showToast('Pop-up diblokir. Izinkan pop-up untuk ekspor PDF.', 'error');
  }
}

/** XML/HTML escape for export */
function xe(v) {
  return String(v ?? '-').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/** Calculate age from date string */
function calcAge(tglLahir) {
  if (!tglLahir) return '-';
  const birth = new Date(tglLahir);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age < 0 ? 0 : age;
}

/** Export Anak Asuh to Excel */
function exportAnakExcel() {
  if (!window._appDb) { showToast('Data belum dimuat', 'error'); return; }
  const list = window._appDb.anak;

  if (window.XLSX) {
    exportXlsxSheet('data-anak-asuh-ywm.xlsx', 'Data Anak Asuh',
      ['No', 'Nama Lengkap', 'NIK', 'Tgl Lahir', 'Usia', 'JK', 'Kategori', 'Pendidikan', 'Nama Wali', 'Foto'],
      list.map((a, i) => [i + 1, a.nama || '', a.nik || '', a.tglLahir || '', calcAge(a.tglLahir), a.jk || '', a.kategori || '', a.pendidikan || '', a.wali || '', a.foto ? 'Ada' : 'Tidak ada']));
    showToast(`Excel Data Anak Asuh (${list.length} data) berhasil diunduh`);
    return;
  }

  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
<x:ExcelWorksheet><x:Name>Data Anak Asuh YWM</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;

  html += '<table border="1">';
  html += `<tr><th colspan="9" style="background:#087443;color:white;font-size:15px">DATA ANAK ASUH — YAYASAN WIHDATUL MUSLIMAT JAKARTA PUSAT</th></tr>`;
  html += `<tr><td colspan="9">Diekspor: ${new Date().toLocaleString('id-ID')} | Jumlah: ${list.length} anak</td></tr>`;
  html += '<tr><td colspan="9"></td></tr>';
  html += `<tr style="background:#e9f6ef"><th>No</th><th>Nama Lengkap</th><th>NIK</th><th>Tgl Lahir</th><th>Usia</th><th>JK</th><th>Kategori</th><th>Pendidikan</th><th>Nama Wali</th></tr>`;

  list.forEach((a, i) => {
    html += `<tr><td>${i+1}</td><td>${xe(a.nama)}</td><td>${xe(a.nik)}</td><td>${xe(a.tglLahir)}</td><td>${calcAge(a.tglLahir)}</td><td>${xe(a.jk)}</td><td>${xe(a.kategori)}</td><td>${xe(a.pendidikan)}</td><td>${xe(a.wali)}</td></tr>`;
  });

  html += '</table></body></html>';
  downloadFile(html, 'data-anak-asuh-ywm.xls', 'application/vnd.ms-excel;charset=utf-8;');
  showToast(`Excel Data Anak Asuh (${list.length} data) berhasil diunduh`);
}

/** Create a real .xlsx workbook using SheetJS. */
function exportXlsxSheet(filename, sheetName, headers, rows) {
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`YAYASAN WIHDATUL MUSLIMAT — ${sheetName.toUpperCase()}`],
    [`Diekspor: ${new Date().toLocaleString('id-ID')}`, `Jumlah data: ${rows.length}`],
    [],
    headers,
    ...rows
  ]);
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
  worksheet['!cols'] = headers.map(header => ({ wch: Math.min(Math.max(String(header).length + 3, 12), 30) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, filename);
}

/** Export Anak Asuh to PDF via browser print */
function exportAnakPDF() {
  if (!window._appDb) { showToast('Data belum dimuat', 'error'); return; }
  const list = window._appDb.anak;

  const rows = list.map((a, i) => {
    const age = calcAge(a.tglLahir);
    const katColors = { 'Yatim': '#eff6ff', 'Piatu': '#f0fdf4', 'Yatim Piatu': '#fdf4ff', 'Dhuafa': '#fffbeb' };
    const katBg = katColors[a.kategori] || '#f5f5f5';
    return `<tr>
      <td>${i+1}</td>
      <td><b>${xe(a.nama)}</b><br><small>${xe(a.nik || '—')}</small></td>
      <td>${xe(a.tglLahir ? a.tglLahir.split('-').reverse().join('/') : '—')}<br><small>${age} thn</small></td>
      <td>${xe(a.jk || '—')}</td>
      <td style="background:${katBg}">${xe(a.kategori || '—')}</td>
      <td>${xe(a.pendidikan || '—')}</td>
      <td>${xe(a.wali || '—')}</td>
    </tr>`;
  }).join('');

  const lk = list.filter(a => a.jk === 'Laki-laki').length;
  const pr = list.filter(a => a.jk === 'Perempuan').length;
  const yatim = list.filter(a => a.kategori === 'Yatim').length;
  const piatu = list.filter(a => a.kategori === 'Piatu').length;
  const yatimPiatu = list.filter(a => a.kategori === 'Yatim Piatu').length;
  const dhuafa = list.filter(a => a.kategori === 'Dhuafa').length;

  const pdfHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Data Anak Asuh — Yayasan Wihdatul Muslimat</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 12mm; }
    h2 { color: #075b35; margin:0 0 2px; font-size: 15px; }
    .sub { color: #555; font-size: 10px; }
    .rekap { display:flex; gap:16px; background:#f5faf7; border:1px solid #c5e0d0; border-radius:4px; padding:8px 12px; margin-bottom:12px; font-size:10px; flex-wrap:wrap; }
    .rekap b { color:#075b35; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #075b35; color: white; padding: 5px 7px; text-align: left; font-size: 10px; }
    td { padding: 4px 7px; border-bottom: 1px solid #e0e0e0; vertical-align: top; font-size: 10px; }
    tr:nth-child(even) td { background: #f5faf7; }
    .footer { margin-top: 14px; font-size: 9px; color: #999; border-top: 1px solid #ddd; padding-top: 6px; }
    @media print { @page { size: A4; margin: 10mm; } }
  </style></head><body>
  <div style="margin-bottom:12px">
    <h2>DATA ANAK ASUH — YAYASAN WIHDATUL MUSLIMAT JAKARTA PUSAT</h2>
    <div class="sub">Dicetak: ${new Date().toLocaleString('id-ID')} &nbsp;|&nbsp; Total data: ${list.length} anak</div>
  </div>
  <div class="rekap">
    <span>Laki-laki: <b>${lk}</b></span>
    <span>Perempuan: <b>${pr}</b></span>
    <span>Yatim: <b>${yatim}</b></span>
    <span>Piatu: <b>${piatu}</b></span>
    <span>Yatim Piatu: <b>${yatimPiatu}</b></span>
    <span>Dhuafa: <b>${dhuafa}</b></span>
  </div>
  <table>
    <thead><tr>
      <th>#</th><th>Nama / NIK</th><th>Tgl Lahir</th><th>JK</th>
      <th>Kategori</th><th>Pendidikan</th><th>Nama Wali</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    Dokumen ini digenerate otomatis oleh Dashboard Yayasan Wihdatul Muslimat.
    Data bersifat konfidensial — tidak untuk disebarluaskan tanpa izin.
  </div>
  <script>window.onload = function(){ window.print(); }<\/script>
  </body></html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) {
    win.document.write(pdfHtml);
    win.document.close();
  } else {
    showToast('Pop-up diblokir. Izinkan pop-up untuk ekspor PDF.', 'error');
  }
}
