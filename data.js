/**
 * data.js — Demo Data Yayasan Wihdatul Muslimat
 * Label [DEMO] menandakan data contoh, bukan data nyata yayasan.
 */

const DEMO_ANAK = [
  { id: 'D001', nama: '[DEMO] Aisyah Rahma', nik: '3171234501120001', tglLahir: '2012-11-05', jk: 'Perempuan', kategori: 'Yatim', pendidikan: 'SD/MI', wali: 'Ibu Rahma' },
  { id: 'D002', nama: '[DEMO] Muhammad Faiz', nik: '3171234503150002', tglLahir: '2015-03-15', jk: 'Laki-laki', kategori: 'Dhuafa', pendidikan: 'SD/MI', wali: 'Bapak Faruq' },
  { id: 'D003', nama: '[DEMO] Siti Nurhaliza', nik: '3171234510080003', tglLahir: '2010-08-22', jk: 'Perempuan', kategori: 'Yatim Piatu', pendidikan: 'SMP/MTs', wali: 'Ibu Halimah' },
  { id: 'D004', nama: '[DEMO] Ahmad Zaki', nik: '3171234507180004', tglLahir: '2018-07-10', jk: 'Laki-laki', kategori: 'Piatu', pendidikan: 'Belum Sekolah', wali: 'Bapak Zainal' },
  { id: 'D005', nama: '[DEMO] Fatimah Az-zahra', nik: '3171234513060005', tglLahir: '2013-06-01', jk: 'Perempuan', kategori: 'Yatim', pendidikan: 'SD/MI', wali: 'Ibu Zainab' },
  { id: 'D006', nama: '[DEMO] Rizky Maulana', nik: '3171234509110006', tglLahir: '2009-11-28', jk: 'Laki-laki', kategori: 'Dhuafa', pendidikan: 'SMP/MTs', wali: 'Bapak Maulana' },
  { id: 'D007', nama: '[DEMO] Nabila Putri', nik: '3171234516040007', tglLahir: '2016-04-14', jk: 'Perempuan', kategori: 'Yatim', pendidikan: 'SD/MI', wali: 'Ibu Putri' },
  { id: 'D008', nama: '[DEMO] Hasan Basri', nik: '3171234511090008', tglLahir: '2011-09-30', jk: 'Laki-laki', kategori: 'Yatim Piatu', pendidikan: 'SMP/MTs', wali: 'Paman Basri' },
];

const DEMO_LANSIA = [
  {
    id: 'L001', nama: '[DEMO] Hj. Mariyam', nik: '3171014652031400',
    tglLahir: '1952-03-14', usia: 72, jk: 'Perempuan',
    tempatLahir: 'Jakarta', agama: 'Islam', statusKawin: 'Janda',
    pendidikan: 'SD/MI', pekerjaan: 'Ibu Rumah Tangga',
    telp: '0812-1111-2222',
    noKK: '3171011452031401', rtRw: '003/005',
    alamat: 'Jl. Mangga No. 12', kelurahan: 'Senen', kecamatan: 'Senen', kota: 'Jakarta Pusat', statusTinggal: 'Bersama Keluarga',
    wali: 'Ibu Nurlaela', hubWali: 'Anak Kandung', telpWali: '0812-2222-3333',
    kondisiKesehatan: 'Sakit Ringan', kondisiFisik: 'Lemah', penyakit: 'Hipertensi',
    kemandirian: 'Butuh Bantuan Sebagian', kebutuhanBantuan: 'Layanan Kesehatan',
    penghasilan: 'Dari Keluarga', bansos: 'PKH', bpjs: 'BPJS PBI',
    catatan: 'Rutin kontrol ke puskesmas setiap bulan.',
    tglDaftar: '2024-01-15', status: 'Aktif',
  },
  {
    id: 'L002', nama: '[DEMO] Pak Slamet', nik: '3171052056200002',
    tglLahir: '1956-05-20', usia: 68, jk: 'Laki-laki',
    tempatLahir: 'Yogyakarta', agama: 'Islam', statusKawin: 'Menikah',
    pendidikan: 'SMP/MTs', pekerjaan: 'Pensiunan PNS',
    telp: '0813-3333-4444',
    noKK: '3171052056031402', rtRw: '001/002',
    alamat: 'Jl. Melati Gang 3 No. 5', kelurahan: 'Cempaka Putih Barat', kecamatan: 'Cempaka Putih', kota: 'Jakarta Pusat', statusTinggal: 'Milik Sendiri',
    wali: 'Ibu Sumiati', hubWali: 'Menantu', telpWali: '0813-4444-5555',
    kondisiKesehatan: 'Sehat', kondisiFisik: 'Baik', penyakit: '',
    kemandirian: 'Mandiri', kebutuhanBantuan: 'Tidak Ada',
    penghasilan: 'Pensiunan', bansos: 'Tidak', bpjs: 'BPJS Mandiri',
    catatan: '',
    tglDaftar: '2024-02-01', status: 'Aktif',
  },
  {
    id: 'L003', nama: '[DEMO] Ibu Suminah', nik: '3171481049100803',
    tglLahir: '1949-08-10', usia: 75, jk: 'Perempuan',
    tempatLahir: 'Surakarta', agama: 'Islam', statusKawin: 'Janda',
    pendidikan: 'SD/MI', pekerjaan: 'Tidak Bekerja',
    telp: '0817-5555-6666',
    noKK: '3171108149031403', rtRw: '006/008',
    alamat: 'Jl. Kenanga No. 8', kelurahan: 'Tanah Abang', kecamatan: 'Tanah Abang', kota: 'Jakarta Pusat', statusTinggal: 'Bersama Keluarga',
    wali: 'Bapak Wahyu', hubWali: 'Anak Kandung', telpWali: '0817-6666-7777',
    kondisiKesehatan: 'Sakit Sedang', kondisiFisik: 'Lemah', penyakit: 'Diabetes, Asam Urat',
    kemandirian: 'Butuh Bantuan Sebagian', kebutuhanBantuan: 'Sembako / Pangan',
    penghasilan: 'Tidak Ada', bansos: 'BPNT', bpjs: 'BPJS PBI',
    catatan: 'Memerlukan diet khusus diabetes.',
    tglDaftar: '2024-01-20', status: 'Aktif',
  },
  {
    id: 'L004', nama: '[DEMO] H. Rustam', nik: '3171045204040004',
    tglLahir: '1954-04-04', usia: 70, jk: 'Laki-laki',
    tempatLahir: 'Bandung', agama: 'Islam', statusKawin: 'Menikah',
    pendidikan: 'SMA/SMK/MA', pekerjaan: 'Wirausaha',
    telp: '0821-7777-8888',
    noKK: '3171040452031404', rtRw: '002/004',
    alamat: 'Jl. Anggrek No. 4', kelurahan: 'Sawah Besar', kecamatan: 'Sawah Besar', kota: 'Jakarta Pusat', statusTinggal: 'Milik Sendiri',
    wali: 'Ibu Rohimah', hubWali: 'Anak Kandung', telpWali: '0821-8888-9999',
    kondisiKesehatan: 'Sehat', kondisiFisik: 'Baik', penyakit: 'Kolesterol',
    kemandirian: 'Mandiri', kebutuhanBantuan: 'Tidak Ada',
    penghasilan: 'Usaha Sendiri', bansos: 'Tidak', bpjs: 'BPJS Mandiri',
    catatan: '',
    tglDaftar: '2024-03-10', status: 'Aktif',
  },
  {
    id: 'L005', nama: '[DEMO] Ibu Kasmi', nik: '3171286161020005',
    tglLahir: '1961-02-28', usia: 63, jk: 'Perempuan',
    tempatLahir: 'Jakarta', agama: 'Islam', statusKawin: 'Janda',
    pendidikan: 'Tidak Sekolah', pekerjaan: 'Tidak Bekerja',
    telp: '0822-9999-0000',
    noKK: '3171022861031405', rtRw: '004/007',
    alamat: 'Jl. Flamboyan No. 2', kelurahan: 'Gambir', kecamatan: 'Gambir', kota: 'Jakarta Pusat', statusTinggal: 'Bersama Keluarga',
    wali: 'Bapak Andi', hubWali: 'Cucu', telpWali: '0822-0000-1111',
    kondisiKesehatan: 'Butuh Perawatan Khusus', kondisiFisik: 'Lumpuh / Tidur', penyakit: 'Stroke ringan, Hipertensi',
    kemandirian: 'Ketergantungan Penuh', kebutuhanBantuan: 'Pendampingan Harian',
    penghasilan: 'Bantuan Sosial', bansos: 'PKH', bpjs: 'BPJS PBI',
    catatan: 'Membutuhkan pendampingan harian dan terapi fisik.',
    tglDaftar: '2024-04-05', status: 'Aktif',
  },
];

const DEMO_KEGIATAN = [
  { id: 'K001', nama: '[DEMO] Pembagian Paket Sembako Ramadhan', tgl: '2025-03-15', lokasi: 'Aula Yayasan, Jakarta Pusat', penerima: 120, dokumentasi: '' },
  { id: 'K002', nama: '[DEMO] Pelatihan Keterampilan Menjahit Ibu-ibu', tgl: '2025-04-10', lokasi: 'Gedung Serbaguna RW 05 Senen', penerima: 30, dokumentasi: '' },
  { id: 'K003', nama: '[DEMO] Santunan Anak Yatim Hari Anak Nasional', tgl: '2025-07-23', lokasi: 'Aula Masjid Al-Ikhlas', penerima: 50, dokumentasi: '' },
  { id: 'K004', nama: '[DEMO] Pemeriksaan Kesehatan Lansia Gratis', tgl: '2025-08-05', lokasi: 'Puskesmas Kelurahan Bintaro', penerima: 45, dokumentasi: '' },
  { id: 'K005', nama: '[DEMO] Pembagian Alat Sekolah & Seragam', tgl: '2025-07-15', lokasi: 'Aula Yayasan, Jakarta Pusat', penerima: 60, dokumentasi: '' },
  { id: 'K006', nama: '[DEMO] Kajian Muslimah Bulanan', tgl: '2025-10-12', lokasi: 'Masjid An-Nuur Jakarta Pusat', penerima: 200, dokumentasi: '' },
];

const DEMO_KEUANGAN = [
  { id: 'F001', tgl: '2025-01-10', ket: '[DEMO] Donasi Rutin dari Donatur Tetap', jenis: 'Pemasukan', nominal: 5000000 },
  { id: 'F002', tgl: '2025-01-15', ket: '[DEMO] Pembelian Paket Sembako Bulanan', jenis: 'Pengeluaran', nominal: 2500000 },
  { id: 'F003', tgl: '2025-02-05', ket: '[DEMO] Donasi Infaq Jumat Masjid An-Nuur', jenis: 'Pemasukan', nominal: 1200000 },
  { id: 'F004', tgl: '2025-02-20', ket: '[DEMO] Biaya Operasional Kantor (Feb)', jenis: 'Pengeluaran', nominal: 800000 },
  { id: 'F005', tgl: '2025-03-01', ket: '[DEMO] Donasi Ramadhan dari Perusahaan', jenis: 'Pemasukan', nominal: 10000000 },
  { id: 'F006', tgl: '2025-03-15', ket: '[DEMO] Pembagian Paket Sembako Ramadhan', jenis: 'Pengeluaran', nominal: 7000000 },
  { id: 'F007', tgl: '2025-04-10', ket: '[DEMO] Donasi Zakat Fitrah dan Maal', jenis: 'Pemasukan', nominal: 8500000 },
  { id: 'F008', tgl: '2025-05-20', ket: '[DEMO] Dana Alat Sekolah Anak Asuh', jenis: 'Pengeluaran', nominal: 3000000 },
  { id: 'F009', tgl: '2025-07-23', ket: '[DEMO] Santunan Anak Yatim Hari Anak', jenis: 'Pengeluaran', nominal: 2500000 },
  { id: 'F010', tgl: '2025-09-01', ket: '[DEMO] Donasi dari Yayasan Mitra Sosial', jenis: 'Pemasukan', nominal: 6000000 },
];

/**
 * Seed demo data ke localStorage jika belum ada.
 * Hanya berjalan sekali (saat pertama kali membuka aplikasi).
 */
function seedDemoData() {
  const existing = localStorage.getItem('wmDashboardV2');
  if (!existing) {
    const initDb = {
      anak: DEMO_ANAK,
      lansia: DEMO_LANSIA,
      kegiatan: DEMO_KEGIATAN,
      keuangan: DEMO_KEUANGAN,
      _seeded: true
    };
    localStorage.setItem('wmDashboardV2', JSON.stringify(initDb));
  }
}

seedDemoData();
