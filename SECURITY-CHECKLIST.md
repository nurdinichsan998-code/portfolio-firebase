# Verifikasi izin sebelum produksi

Aturan belum diterapkan atau diuji terhadap proyek Firebase nyata dari sesi ini.
Jangan publikasikan database dengan Test mode atau aturan allow write: if true.

## Firestore Rules Playground / Emulator

Setelah mengganti GANTI_UID_ADMIN di aturan, uji operasi berikut:

| Pengguna | Operasi | Target | Harapan |
|---|---|---|---|
| Tanpa login | get | portfolio/main | Diizinkan |
| Tanpa login | create/update/delete | portfolio/main | Ditolak |
| Tanpa login | list | portfolio | Ditolak |
| Akun bukan admin | create/update/delete | portfolio/main | Ditolak |
| UID admin | create versi 1 dengan struktur benar | portfolio/main | Diizinkan |
| UID admin | update revisi sebelumnya + 1, server timestamp | portfolio/main | Diizinkan |
| UID admin | update revisi tidak berurutan | portfolio/main | Ditolak |
| UID admin | delete | portfolio/main | Ditolak |
| Siapa pun | read/write dokumen di lokasi lain | messages/private | Ditolak |

Saat menguji, isi struktur dokumen sesuai schemaVersion/content/revision/updatedAt/updatedBy yang dipakai admin.js. updatedAt harus serverTimestamp() / request.time, bukan string tanggal.

## Storage Rules (hanya bila Storage diaktifkan)

- Pengunjung boleh membaca foto yang memang merupakan aset publik.
- Pengunjung/bukan admin tidak boleh mengunggah atau menghapus foto.
- Admin hanya boleh menulis file profile/avatar-<id>.webp berukuran di bawah 1 MiB dan MIME image/webp.
- File SVG, tipe lain, ukuran berlebih, dan jalur di luar profile harus ditolak.
- Penghapusan file hanya untuk admin. UI hapus foto hanya menghapus tautan dari profil, bukan file fisik.
- URL download Firebase adalah bearer URL publik; jangan gunakan Storage ini untuk dokumen pribadi.

## Pemeriksaan antarmuka

- Login salah tidak membuka editor.
- Akun valid tetapi bukan UID admin tidak dapat menerbitkan, termasuk lewat SDK/REST langsung.
- Refresh dan tutup-tab mengikuti session persistence.
- Tambah/hapus/urutkan pengalaman tidak tampil publik sebelum Terbitkan perubahan.
- Dua tab admin: setelah tab A menerbitkan, tab B dengan revisi lama harus menerima konflik, bukan menimpa A.
- Hilangkan koneksi: publikasi harus gagal tanpa mengklaim berhasil.
- Foto URL rusak kembali ke inisial di website publik.
- Form kontak tidak menulis data pribadi ke Firestore; tetap mailto.
- Domain Firebase Auth diizinkan, HTTPS aktif, dan konfigurasi/rules mengacu proyek yang sama.
- Konfigurasi web Firebase memang publik. Jangan pernah memasukkan service-account JSON, private key, atau password admin ke source/repository.
- Pertimbangkan Firebase App Check untuk menekan penyalahgunaan pembacaan publik. App Check bukan pengganti Rules. Versi ini belum memasangnya.
- Tetapkan budget alerts, pantau kuota, dan gunakan kata sandi unik yang kuat.
