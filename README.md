# Portofolio + Admin Online Firebase

Versi 2.0 — Muhammad Ichsan Nurdin

## Apa yang sudah disiapkan

- Website portofolio HTML/CSS/Tailwind/JavaScript, tetap dengan desain dashboard gelap sebelumnya.
- Panel admin terpisah pada admin.html, login Email/Password memakai Firebase Authentication.
- Tambah, edit, hapus, dan urutkan pengalaman kerja, maksimal 30 entri.
- Edit nama, headline, biografi, tentang saya, pendidikan, peran, dan perusahaan.
- Ganti foto melalui URL HTTPS atau unggah JPG/PNG/WebP opsional.
- Edit email, LinkedIn, serta tujuan tautan Portofolio Web.
- Edit empat kartu proyek dan tiga kelompok keahlian yang sudah tersedia.
- Konten terbit disimpan pada Cloud Firestore dan diperbarui real-time untuk pengunjung yang sedang terhubung.
- Pembatasan tulis ke satu UID admin pada Security Rules, bukan sekadar menyembunyikan tombol.
- Cek konflik revisi agar dua tab admin tidak saling menimpa.

PENTING: kode sudah disiapkan, tetapi proyek Firebase, akun admin, database, dan aturan belum dibuat/dipasang dari sesi ini. Belum ada deployment atau pengujian browser/Firebase nyata. Anda perlu melakukan setup di bawah.

## A. Ekstrak paket

Anda menerima:

- paket-firebase.json — seluruh berkas website dan aturan.
- siapkan.mjs.txt — pengekstrak paket berbasis Node.js.
- PANDUAN-FIREBASE.md — dokumen ini.

1. Simpan paket-firebase.json dalam satu folder dengan siapkan.mjs.txt.
2. Ganti nama siapkan.mjs.txt menjadi siapkan.mjs.
3. Instal Node.js 20 atau lebih baru jika belum tersedia.
4. Buka terminal di folder tersebut dan jalankan:

    node siapkan.mjs

Folder baru portfolio-firebase akan dibuat. Pengekstrak menolak menimpa folder yang sudah ada dan hanya menulis nama berkas yang diizinkan.

Berkas di dalamnya:

    portfolio-firebase/
      index.html              halaman publik
      admin.html              halaman login dan editor
      firebase-config.js      konfigurasi web Firebase + UID admin
      cms.js                  koneksi, validasi, dan konten awal
      public.js               pembaca konten terbit
      admin.js                editor, login, foto, dan penerbitan
      firestore.rules         aturan database
      storage.rules           aturan foto opsional
      firebase.json           konfigurasi Firebase CLI/Hosting
      package.json            dependensi build
      build.mjs               kompilasi Tailwind dan output dist
      check-source.mjs        cek sintaks sumber dan anchor HTML
      SECURITY-CHECKLIST.md   matriks uji akses
      README.md               panduan ini
      .gitignore

Ini kode HTML/JavaScript mandiri, tidak mengubah halaman Framer Anda. Jangan mencampurnya dengan build.mjs versi unduhan lama; gunakan seluruh paket baru ini.

## B. Buat proyek Firebase

1. Buka https://console.firebase.google.com/ dan buat proyek baru.
2. Tambahkan aplikasi Web melalui Project settings > General > Your apps.
3. Pilih konfigurasi SDK Web dan salin nilai firebaseConfig ke firebase-config.js.
4. Isi apiKey, authDomain, projectId, messagingSenderId, dan appId sesuai Console. Jangan mengarang nilai.
5. storageBucket boleh kosong jika hanya menggunakan foto URL. Jika memakai Storage, salin nama bucket persis dari Console; jangan mengasumsikan akhiran bucket.

Konfigurasi Firebase Web memang bersifat publik dan boleh masuk frontend. JANGAN memasukkan file service account, private key, kata sandi admin, atau kredensial Firebase Admin SDK.

## C. Aktifkan login dan buat admin

1. Authentication > Sign-in method: aktifkan Email/Password.
2. Authentication > Users > Add user: buat satu akun admin dengan email milik Anda dan kata sandi kuat/unik.
3. Salin User UID akun tersebut.
4. Ganti GANTI_UID_ADMIN pada TIGA tempat:
   - firebase-config.js
   - firestore.rules
   - storage.rules (bila akan menggunakan Storage)
5. Authentication > Settings > Authorized domains: tambahkan domain hosting Anda. Untuk pengujian lokal, tambahkan localhost secara manual bila belum ada.

Tidak ada password default, password hardcoded, atau form pendaftaran publik. Akun Firebase lain tidak mendapat akses edit, meskipun berhasil mendaftar/login melalui mekanisme di luar antarmuka. Rules tetap memeriksa UID.

Untuk login berikutnya: buka https://domain-anda/admin.html dan masukkan email serta kata sandi admin. Jangan menuliskan alamat contoh tersebut sebagai URL akun Firebase; gunakan domain hosting sendiri.

## D. Buat Firestore dan pasang aturan

1. Firestore Database > Create database, pilih database (default), Native mode/Standard sesuai pilihan Console.
2. Pilih lokasi yang sesuai dan mulai dalam Production mode.
3. Tab Rules: ganti aturan dengan isi firestore.rules yang UID-nya sudah diubah, lalu Publish.
4. Jangan memakai Test mode atau aturan tulis publik.

Aplikasi memakai satu dokumen terbit: portfolio/main. Admin membuat dokumen tersebut saat pertama kali menerbitkan. Anda tidak perlu membuat collection/dokumen secara manual.

Isi dokumen ini publik untuk website, sehingga jangan menaruh catatan internal, pesan pengunjung, atau data rahasia di editor. Tulis hanya diizinkan untuk UID admin. Lokasi database lain ditolak oleh aturan contoh ini. Gunakan proyek khusus portofolio; jangan menimpa rules proyek lain tanpa menyesuaikan kebutuhan proyek tersebut.

## E. Foto profil: dua pilihan

### Tanpa Storage: tempel URL HTTPS

Gunakan URL foto publik dari hosting gambar tepercaya. URL harus dapat dibuka tanpa login/hotlink protection. Ini tidak memerlukan Firebase Storage. Editor menampilkan pratinjau; website kembali ke inisial jika foto gagal dimuat. Foto eksternal tetap bergantung pada layanan URL itu.

### Dengan Storage: unggah dari perangkat

Cloud Storage for Firebase memerlukan paket Blaze dan akun billing menurut ketentuan Firebase saat ini. Pemakaian dapat menimbulkan biaya. Aktifkan budget alerts dan cek harga terbaru sebelum mengaktifkannya.

1. Aktifkan Blaze jika Anda setuju dengan ketentuan penagihannya.
2. Storage > Get started, buat bucket dan pilih lokasi.
3. Isi storageBucket persis seperti di Console pada firebase-config.js.
4. Tab Storage Rules: terapkan storage.rules dengan UID admin yang sama.
5. Ubah storageEnabled menjadi true di firebase-config.js.
6. Build dan unggah ulang untuk mengaktifkan fitur unggah. Perubahan konfigurasi ini hanya dibutuhkan saat setup, bukan setiap mengedit konten.

Unggah menerima JPG/PNG/WebP maksimal 8 MB, lalu memotong tengah menjadi persegi 640 × 640 dan mengubahnya ke WebP. File akhir harus di bawah 1 MiB. SVG ditolak. Browser modern harus mendukung createImageBitmap/canvas WebP; jika tidak, gunakan URL.

Foto yang diunggah merupakan aset publik. File baru disimpan segera, tetapi foto di profil baru berubah setelah Terbitkan perubahan. Tombol hapus foto dari profil hanya mengosongkan URL; arsip foto lama harus dibersihkan di Storage Console jika tidak dibutuhkan. Jangan hapus file yang masih digunakan website.

## F. Jalankan dan build

Di folder portfolio-firebase:

    npm install
    npm run check
    npm run build

- check menjalankan pemeriksaan sintaks JavaScript dan anchor HTML menggunakan Node. Perintah ini tidak menguji Security Rules atau perilaku browser.
- build membuat folder dist, mengompilasi Tailwind, serta menyalin website, editor, dan modul Firebase.
- Simpan package-lock.json yang dihasilkan untuk mengunci dependensi.
- Koneksi Firebase memakai SDK modular resmi yang dipin ke versi 11.10.0 melalui gstatic. Google Fonts juga eksternal. Koneksi internet diperlukan untuk CMS/login.

Jangan membuka versi Firebase melalui file://. Gunakan hosting HTTPS atau server lokal. Untuk preview lokal, Anda dapat menggunakan:

    npx serve dist

Gunakan URL localhost yang ditampilkan dan tambahkan localhost ke Authorized domains. Jalankan build ulang setelah mengubah kode atau konfigurasi awal. Edit konten melalui panel admin tidak memerlukan build ulang.

## G. Deploy ke hosting pilihan

### Vercel

Import repository portfolio-firebase. Framework preset: Other. Build command: npm run build. Output directory: dist. File admin.html dapat diakses melalui /admin.html (atau routing statis ekuivalen yang disediakan hosting). Tambahkan domain final ke Firebase Auth Authorized domains.

### Netlify

Build command: npm run build. Publish directory: dist. Atau unggah folder dist menggunakan Netlify Drop. Tambahkan domain final ke Authorized domains.

### GitHub Pages

Jalankan build lokal, lalu publikasikan isi dist dari root branch publikasi/folder docs. Semua modul menggunakan path relatif sehingga mendukung repository subpath. Pastikan hosting menyajikan berkas .js dengan MIME JavaScript yang benar.

### Firebase Hosting (opsional)

Setelah Firebase CLI terpasang/login:

    npx firebase-tools login
    npx firebase-tools deploy --only firestore:rules --project PROJECT_ID_ANDA
    npm run build
    npx firebase-tools deploy --only hosting --project PROJECT_ID_ANDA

Hanya jika Storage telah dibuat dan diaktifkan:

    npx firebase-tools deploy --only storage --project PROJECT_ID_ANDA

Ganti PROJECT_ID_ANDA dengan ID proyek Firebase Anda. Perintah di atas mempublikasikan ke proyek Anda ketika Anda menjalankannya sendiri. Aturan juga dapat dipasang via Console tanpa CLI. Jangan menjalankan deploy Storage jika belum menyiapkan bucket/billing.

## H. Cara mengedit setelah setup

1. Buka halaman admin.html melalui domain hosting.
2. Login dengan akun admin.
3. Editor memuat data dari server. Pada pemakaian pertama, data portofolio awal akan tersedia sebagai draft.
4. Edit profil/kontak/foto, tambah pengalaman, atau atur urutannya.
5. Klik Terbitkan perubahan dan konfirmasi. Pesan berhasil hanya muncul setelah server menerima transaksi.
6. Buka website publik untuk melihat perubahan. Pengunjung yang sedang online menerima pembaruan real-time tanpa unggah ulang.

Catatan:

- Perubahan belum tersimpan online sebelum diterbitkan. Tidak ada autosave draft.
- Menutup/refresh tab dengan perubahan belum terbit akan memunculkan peringatan browser, jika didukung.
- Editor menyimpan sesi hanya sampai sesi tab/browser berakhir; selalu tekan Keluar pada perangkat bersama.
- Muat ulang dari server membuang draft lokal setelah konfirmasi.
- Jika dua sesi mengedit bersamaan, sesi dengan revisi lama akan ditolak saat menerbitkan. Salin teks penting sebelum memuat versi terbaru.
- Pengalaman ditampilkan sesuai urutan manual, bukan otomatis berdasarkan tanggal. Tanggal selesai kosong berarti masih bekerja.
- Admin menyunting empat kartu proyek dan tiga kategori keahlian. Penambahan kartu/kategori baru belum disediakan agar ilustrasi dan komposisi awal tetap terjaga.
- Tombol kontak pengunjung masih mailto: menyiapkan draf pada aplikasi email pengunjung, bukan pengiriman server-side. Firebase yang ditambahkan di sini untuk konten/admin, bukan layanan email.

## I. Verifikasi sebelum membuka untuk umum

Ikuti SECURITY-CHECKLIST.md. Uji setidaknya:

- Pengunjung dan akun bukan admin tidak dapat menulis database/Storage.
- Login, reset password, dan logout di domain final.
- Tambah/hapus/urutkan pengalaman; ganti kontak dan foto.
- Tab publik menerima perubahan setelah publikasi, bukan sebelum.
- Koneksi terputus tidak menghasilkan pesan publikasi sukses palsu.
- Konflik dua tab tidak menimpa perubahan.
- Desktop, tablet, ponsel, keyboard, dan reduced motion.

Pemeriksaan yang dilakukan saat pembuatan paket hanya pemeriksaan struktur berkas dan referensi anchor. Sintaks runtime/browser, Rules Playground/Emulator, koneksi Firebase, email reset, proses build, dan deployment belum dijalankan dari sesi ini.

## J. Batasan dan biaya

- Tidak ada backend yang diprovisikan otomatis dari percakapan ini.
- Firestore reads dipakai saat halaman diakses dan ketika dokumen berubah; pantau kuota dan biaya.
- Pertimbangkan App Check untuk mencegah penyalahgunaan pembacaan. Belum disertakan; tidak menggantikan Rules.
- Seluruh pembaruan konten dimuat client-side. HTML awal tetap menjadi fallback jika Firebase tidak terkonfigurasi atau gagal. Metadata/crawl non-JavaScript masih memakai versi HTML awal; sinkronisasi SEO statis memerlukan build/publikasi ulang.
- Data bukan HTML bebas; ditampilkan sebagai teks aman. Tautan dibatasi ke HTTPS atau anchor bagian yang tersedia.
- Pertahankan backup konten sebelum perubahan besar. Tidak ada fitur histori/rollback otomatis dalam versi ini.

Dokumentasi resmi:
- https://firebase.google.com/docs/auth/web/password-auth
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://firebase.google.com/docs/storage/web/start
