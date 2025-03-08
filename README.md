# Aplikasi-CBT-Versi-1a
# Aplikasi CBT (Computer Based Test) Online dengan Google Apps Script

Aplikasi ujian online sederhana berbasis Google Apps Script dan Google Sheet yang dapat digunakan untuk melaksanakan ujian dengan format pilihan ganda (multiple choice).

![CBT Online Preview](https://via.placeholder.com/800x400?text=CBT+Online+Preview)

## Fitur

- **Form Biodata Peserta**:
  - Nama lengkap (otomatis kapital)
  - Asal sekolah (otomatis kapital)
  - Nomor HP
  - Validasi field wajib diisi

- **Sistem Ujian**:
  - Tampilan 1 soal per halaman
  - Navigasi nomor soal dengan indikator warna (hijau: sudah dijawab, merah: belum dijawab)
  - Navigasi maju dan mundur antar soal
  - Timer ujian
  - Konfirmasi saat ingin menyelesaikan ujian

- **Tampilan dan Konten Soal**:
  - Dukungan untuk soal teks biasa
  - Dukungan untuk gambar
  - Dukungan untuk tabel (HTML)
  - Dukungan untuk paragraf (HTML)
  - Dukungan untuk rumus matematika (LaTeX)

- **Hasil Ujian**:
  - Tampilan skor otomatis
  - Detail jawaban benar dan salah
  - Opsi cetak hasil ujian (1 soal per halaman)
  - Penyimpanan hasil di Google Sheet

## Struktur Google Sheet

Aplikasi menggunakan Google Sheet dengan struktur sebagai berikut:

- **Sheet "Soal"**:
  - Kolom A: Pertanyaan
  - Kolom B: URL Gambar (opsional)
  - Kolom C: Tabel HTML (opsional) 
  - Kolom D: Paragraf (opsional)
  - Kolom E: Pilihan A
  - Kolom F: Pilihan B
  - Kolom G: Pilihan C
  - Kolom H: Pilihan D
  - Kolom I: Pilihan E
  - Kolom J: Jawaban Benar (1=A, 2=B, 3=C, 4=D, 5=E)

- **Sheet "Data Peserta"** (dibuat otomatis):
  - Timestamp
  - Nama Lengkap
  - Asal Sekolah
  - Nomor HP

- **Sheet "Hasil Ujian"** (dibuat otomatis):
  - Timestamp
  - Nama Lengkap
  - Asal Sekolah
  - Nomor HP
  - Skor
  - Benar
  - Total Soal
  - Detail Jawaban (JSON)

## Cara Penggunaan

### Persiapan

1. Buat Google Sheet baru
2. Buat sheet pertama dengan nama "Soal"
3. Isi header dan data soal sesuai struktur yang dijelaskan di atas
4. Buka menu Extensions > Apps Script
5. Buat file-file berikut dengan menyalin kode dari repositori ini:
   - Code.gs
   - Index.html
   - JavaScript.html
   - Stylesheet.html

### Deploy Aplikasi

1. Klik tombol "Deploy" > "New deployment"
2. Pilih type "Web app"
3. Masukkan deskripsi (misalnya "CBT Online v1")
4. "Execute as": Pilih akun Google Anda
5. "Who has access": Pilih sesuai kebutuhan ("Anyone" untuk akses publik)
6. Klik "Deploy"
7. Salin URL web app yang diberikan

### Format LaTeX

Aplikasi mendukung format LaTeX untuk rumus matematika:

- Untuk rumus inline: `\(rumus\)` 
- Untuk rumus display (centered): `\[rumus\]`

Contoh:
```
Fungsi kuadrat \(f(x) = x^2 - 3x + 2\) memiliki akar-akar persamaan:
\[x = \frac{3 \pm \sqrt{9-4(1)(2)}}{2(1)} = \frac{3 \pm \sqrt{1}}{2} = \frac{3 \pm 1}{2}\]
```

### Format HTML untuk Tabel dan Paragraf

- **Tabel**: Masukkan kode HTML tabel lengkap
```html
<table border="1">
  <tr><th>Kelas</th><th>Nilai Rata-rata</th></tr>
  <tr><td>X-1</td><td>85.5</td></tr>
  <tr><td>X-2</td><td>82.3</td></tr>
</table>
```

- **Paragraf**: Gunakan tag HTML sesuai kebutuhan
```html
<p>Paragraf pertama.</p>
<p>Paragraf kedua dengan <b>teks tebal</b> dan <i>teks miring</i>.</p>
```

## Algoritma Penilaian

Skor dihitung dengan rumus: `(jumlah jawaban benar × 100) ÷ jumlah total soal`

## Kebutuhan Sistem

- Google Account
- Google Sheet
- Browser modern (Chrome, Firefox, Safari, Edge)

## Kustomisasi Aplikasi

### Mengubah Tampilan

Tampilan aplikasi dapat dikustomisasi dengan mengubah CSS di file Stylesheet.html.

### Menambah Fitur

Aplikasi ini dapat dikembangkan dengan menambah fitur seperti:
- Batas waktu ujian
- Shuffle soal
- Gambar untuk pilihan jawaban
- Dan lain-lain

## Troubleshooting

- **Rumus LaTeX tidak muncul**: Pastikan sintaks LaTeX sudah benar dan menggunakan delimiter yang didukung (`\(...\)` atau `\[...\]`)
- **Gambar tidak muncul**: Pastikan URL gambar dapat diakses secara publik
- **Skor selalu 0**: Periksa format jawaban benar di sheet "Soal"

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontributor

- [Nama Anda]
- [Nama Kontributor Lain (jika ada)]

## Kontak

Jika ada pertanyaan atau masukan, silakan hubungi: wahyuhandika28@gmail.com
