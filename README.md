# Dashboard Administrasi Yayasan Wihdatul Muslimat

Aplikasi web dashboard administrasi untuk **Yayasan Wihdatul Muslimat Jakarta Pusat**.

## 🚀 Cara Menjalankan

1. Buka folder `Dashboard_Yayasan_Wihdatul_Muslimat`
2. Klik dua kali file **`index.html`** untuk membuka di browser
3. Atau gunakan ekstensi **Live Server** di VS Code

> Data tersimpan otomatis di `localStorage` browser — tidak akan hilang saat halaman dimuat ulang.

## 📂 Struktur File

```
Dashboard_Yayasan_Wihdatul_Muslimat/
├── index.html          ← File utama (buka ini)
├── logo-yayasan.png    ← Logo yayasan
├── logo-wm.png         ← Logo Wihdatul Muslimat
├── css/
│   └── style.css       ← Stylesheet lengkap
└── js/
    ├── data.js         ← Data contoh [DEMO]
    ├── charts.js       ← Grafik statistik (Canvas)
    ├── calendar.js     ← Widget kalender
    ├── export.js       ← Ekspor CSV & Excel
    └── app.js          ← Logika utama aplikasi
```

## 🗂️ Fitur

| Menu              | Fitur                                                             |
|-------------------|-------------------------------------------------------------------|
| Overview          | Statistik, aktivitas terbaru, kalender mini, grafik, akses cepat |
| Data Anak Asuh    | CRUD: nama, NIK, tgl lahir, usia otomatis, kategori, pendidikan  |
| Data Lansia       | CRUD: nama, usia, JK, alamat, telepon                            |
| Kegiatan Sosial   | CRUD: nama, tanggal, lokasi, jumlah penerima, dokumentasi        |
| Donasi & Keuangan | CRUD transaksi, ringkasan saldo, pemasukan vs pengeluaran         |
| Laporan           | Rekap statistik, grafik, ekspor CSV & Excel                      |
| Kalender          | Kalender bulanan dengan penanda jadwal kegiatan                  |
| Pengaturan        | Info aplikasi, reset data, petunjuk deploy                       |

## 📤 Deploy ke GitHub Pages

1. Buat repository baru di [github.com](https://github.com) (Public)
2. Upload seluruh isi folder ini ke repository
3. Buka **Settings → Pages**, pilih branch `main`, folder `/ (root)`, klik **Save**
4. Aplikasi tersedia di `https://[username].github.io/[repo-name]/`

## ⚠️ Catatan

- Data berlabel **[DEMO]** adalah contoh dan bukan data nyata yayasan
- Ekspor data secara rutin (CSV/Excel) sebagai cadangan
- Data hanya tersimpan di browser lokal (localStorage)

---
*Dashboard Administrasi Yayasan Wihdatul Muslimat Jakarta Pusat — v2.0*
