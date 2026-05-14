# Arah Project yang Direkomendasikan

## Rekomendasi utama
Bangun **aplikasi pencatat keuangan harian berbasis PWA** dengan fokus pada:

- pencatatan pemasukan dan pengeluaran yang sangat cepat,
- tampilan clean, modern, minimalist dengan pendekatan **Apple Human Interface Guidelines**,
- ringkasan keuangan harian, mingguan, dan bulanan,
- pengalaman mobile-first seperti aplikasi native,
- sinkronisasi data dengan **Supabase**.

## Kenapa ide ini bagus untuk portofolio
Project ini cukup sederhana untuk diselesaikan, tetapi tetap terlihat kuat di portofolio karena memperlihatkan:

- kemampuan membangun produk end-to-end,
- implementasi autentikasi dan database,
- desain UI yang rapi dan user-friendly,
- pemahaman PWA,
- arsitektur modern dengan Next.js, TypeScript, Tailwind, dan shadcn/ui.

## Arah diferensiasi
Agar tidak terlihat seperti aplikasi catatan biasa, fokuskan project pada 3 hal:

1. **Quick input**
   Pengguna bisa menambah transaksi dalam 1 langkah utama.

2. **Insight yang jelas**
   Bukan hanya daftar transaksi, tetapi juga ringkasan dan pola pengeluaran.

3. **Experience yang premium**
   Tampilan minimalis, spacing lega, typography kuat, dan komponen yang terasa seperti aplikasi native.

---

# Konsep Project

## Nama project
**FlowLedger**

## Deskripsi singkat
FlowLedger adalah aplikasi PWA pencatat keuangan harian untuk membantu pengguna memantau pemasukan, pengeluaran, kategori transaksi, serta ringkasan kondisi finansial mereka secara cepat dan sederhana.

## Target pengguna
- mahasiswa,
- pekerja muda,
- freelancer,
- pengguna yang ingin mencatat keuangan pribadi secara ringan dan praktis.

## Masalah yang diselesaikan
- pengguna sulit melacak pengeluaran harian,
- pengguna sering lupa mencatat transaksi kecil,
- pengguna membutuhkan ringkasan keuangan yang cepat dibaca,
- pengguna ingin aplikasi yang ringan, mudah dipakai, dan bisa diakses seperti aplikasi mobile.

---

# V0 Scope

## V0 goal
Membuat versi awal yang sudah layak dipresentasikan sebagai portofolio dan bisa dipakai untuk kebutuhan pencatatan dasar.

## Fitur inti V0
- login dan registrasi,
- dashboard ringkasan saldo,
- tambah pemasukan/pengeluaran,
- daftar transaksi terbaru,
- filter berdasarkan tanggal dan kategori,
- kategori transaksi dasar,
- halaman laporan sederhana,
- mode PWA installable,
- penyimpanan data ke Supabase.

## Fitur yang ditunda ke versi berikutnya
- budget planner kompleks,
- split bill,
- export PDF/Excel,
- recurring transaction otomatis,
- multi-wallet,
- AI financial insight,
- goal tracking,
- dark mode jika belum sempat.

---

# PRD

## 1. Product overview
FlowLedger adalah aplikasi web PWA untuk mencatat transaksi keuangan harian secara cepat, sederhana, dan visual. Aplikasi ini dirancang agar nyaman dipakai di mobile, namun tetap rapi saat dibuka di desktop.

## 2. Product goals
- Mempermudah pengguna mencatat transaksi dalam waktu singkat.
- Memberikan gambaran kondisi keuangan secara jelas.
- Menciptakan pengalaman pengguna yang premium, modern, dan minimalis.
- Menjadi portofolio yang menunjukkan kemampuan full-stack modern.

## 3. Success metrics
- pengguna bisa menambahkan transaksi dalam kurang dari 15 detik,
- dashboard menampilkan saldo dan ringkasan dengan jelas,
- penggunaan di mobile terasa natural seperti aplikasi native,
- aplikasi dapat di-install sebagai PWA,
- struktur codebase mudah dikembangkan ke versi lanjut.

## 4. User personas

### Persona 1: Mahasiswa
Butuh mencatat uang saku, pengeluaran harian, dan uang masuk dari orang tua.

### Persona 2: Pekerja muda
Ingin melacak pengeluaran rutin, jajan, transportasi, dan tabungan bulanan.

### Persona 3: Freelancer
Perlu mencatat pemasukan proyek dan pengeluaran operasional secara cepat.

## 5. User stories
- Sebagai pengguna, saya ingin login agar data saya tersimpan aman.
- Sebagai pengguna, saya ingin menambah transaksi pemasukan atau pengeluaran dengan cepat.
- Sebagai pengguna, saya ingin melihat total saldo saat ini.
- Sebagai pengguna, saya ingin melihat transaksi terbaru.
- Sebagai pengguna, saya ingin memfilter transaksi berdasarkan tanggal atau kategori.
- Sebagai pengguna, saya ingin melihat ringkasan pengeluaran per kategori.
- Sebagai pengguna, saya ingin menggunakan aplikasi seperti native app di smartphone.

## 6. Functional requirements

### Authentication
- Registrasi akun.
- Login dan logout.
- Proteksi data per user.

### Dashboard
- Tampilkan total saldo.
- Tampilkan total pemasukan bulan ini.
- Tampilkan total pengeluaran bulan ini.
- Tampilkan sisa saldo atau net balance.

### Transaction management
- Tambah transaksi pemasukan/pengeluaran.
- Edit transaksi.
- Hapus transaksi.
- Pilih kategori transaksi.
- Tambah catatan singkat.
- Pilih tanggal transaksi.

### Filtering and sorting
- Filter berdasarkan rentang tanggal.
- Filter berdasarkan kategori.
- Urutkan berdasarkan terbaru atau nominal.

### Reports
- Ringkasan pengeluaran per kategori.
- Grafik sederhana pemasukan vs pengeluaran.
- Ringkasan bulanan.

### PWA
- Bisa di-install ke home screen.
- Mendukung manifest dan service worker.
- Loading terasa cepat.

## 7. Non-functional requirements
- Responsive pada mobile, tablet, dan desktop.
- UI harus clean, modern, minimalist.
- Konsisten dengan prinsip Apple Human Interface Guidelines.
- Performa cepat dan ringan.
- Struktur komponen reusable.
- Data aman dengan row-level access di Supabase.

## 8. Information architecture

### Halaman utama
- Landing page
- Login
- Register
- Dashboard
- Transactions
- Reports
- Settings

### Struktur dashboard
- Header ringkas
- Kartu saldo
- Ringkasan bulanan
- Tombol tambah transaksi
- Daftar transaksi terbaru
- Insight singkat

## 9. Core user flow
1. Pengguna membuka aplikasi.
2. Pengguna login atau registrasi.
3. Pengguna masuk ke dashboard.
4. Pengguna melihat saldo dan ringkasan.
5. Pengguna menambah transaksi baru.
6. Data masuk ke Supabase.
7. Dashboard dan laporan diperbarui otomatis.

## 10. Data model awal

### users
- id
- name
- email
- created_at

### transactions
- id
- user_id
- type: income | expense
- amount
- category
- note
- transaction_date
- created_at
- updated_at

### categories
- id
- user_id
- name
- type
- color
- icon

## 11. UI principles
Terapkan gaya berikut:
- latar putih atau abu sangat lembut,
- kartu dengan sudut membulat halus,
- spacing lega,
- tipografi tegas dan mudah dibaca,
- warna aksen terbatas,
- hierarki visual yang jelas,
- tombol utama menonjol tetapi tidak berlebihan,
- gunakan komponen shadcn/ui untuk konsistensi.

## 12. Suggested stack implementation
- **Frontend**: Next.js + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend as a Service**: Supabase
- **Server logic**: Node.js route handlers / server actions
- **Deployment**: Vercel
- **PWA**: manifest + service worker

## 13. Milestone pengembangan

### Milestone 1: Foundation
- setup Next.js,
- setup shadcn/ui,
- setup Supabase,
- auth flow,
- layout dasar.

### Milestone 2: Core feature
- tambah, edit, hapus transaksi,
- dashboard summary,
- filter sederhana.

### Milestone 3: Insight
- chart pengeluaran,
- ringkasan bulanan,
- kategori transaksi.

### Milestone 4: PWA
- installable,
- offline basic caching,
- polish UX.

### Milestone 5: Portfolio finishing
- empty states,
- skeleton loading,
- micro-interactions,
- README dan screenshot.

---

# V0 Prompt untuk UI Generator

Gunakan prompt berikut untuk v0 atau generator UI sejenis:

**Prompt:**

Buat aplikasi web PWA bernama **FlowLedger**, yaitu aplikasi pencatat keuangan harian yang clean, modern, minimalist, dan mengikuti pendekatan Apple Human Interface Guidelines. Gunakan gaya visual premium dengan white space yang lega, card lembut, rounded corners halus, hierarchy visual yang jelas, dan tipografi yang elegan. Gunakan Tailwind dan komponen bergaya shadcn/ui.

Bangun desain untuk halaman berikut:
1. Landing page
2. Login / Register
3. Dashboard utama
4. Halaman daftar transaksi
5. Halaman laporan / analytics
6. Halaman settings

Spesifikasi UI:
- Mobile-first, tetapi tetap responsif di desktop.
- Dashboard menampilkan kartu saldo, pemasukan bulan ini, pengeluaran bulan ini, dan net balance.
- Ada tombol utama untuk menambah transaksi.
- Daftar transaksi terbaru tampil dalam card atau list yang rapi.
- Setiap transaksi memiliki label type, kategori, nominal, dan tanggal.
- Halaman laporan menampilkan grafik sederhana pemasukan vs pengeluaran dan ringkasan kategori.
- Gunakan warna netral dengan satu warna aksen utama.
- Hindari tampilan ramai.
- Gunakan empty state yang elegan.
- Gunakan spacing yang konsisten dan komponen yang terasa seperti aplikasi native.

Tambahkan elemen PWA-friendly seperti:
- app-like navigation,
- bottom navigation pada mobile,
- quick action button,
- loading state yang halus.

Output yang diharapkan:
- layout final yang siap diimplementasikan di Next.js,
- komponen reusable,
- tampilan premium dan minimalis.

---

# Rekomendasi pengembangan lanjutan
Setelah V0 selesai, versi berikutnya bisa ditambah:
- budget per kategori,
- recurring transactions,
- export data,
- insight kebiasaan belanja,
- AI assistant untuk analisis keuangan ringan.

# Kesimpulan
Untuk portofolio, project ini paling kuat bila diposisikan sebagai **aplikasi pencatat keuangan harian yang sederhana, elegan, dan cepat dipakai**, bukan aplikasi finansial yang terlalu kompleks. Fokus utama ada pada kualitas UX, kerapian UI, dan implementasi full-stack yang solid.

