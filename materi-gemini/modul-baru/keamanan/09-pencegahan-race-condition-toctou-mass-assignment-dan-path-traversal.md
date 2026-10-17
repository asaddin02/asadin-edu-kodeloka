# Kerentanan Logika Bisnis: *Race Condition* (*TOCTOU*), *Mass Assignment*, dan *Path Traversal*

- **Letak:** sesudah modul 8
- **Tingkat:** Lanjut
- **Ringkasan:** Mencegah eksploitasi pencairan saldo ganda akibat *Time-of-Check to Time-of-Use* (TOCTOU) dengan penguncian baris atomik, memblokir eskalasi hak akses lewat *Mass Assignment* (OWASP API3:2023), serta menangkis serangan *Path Traversal*.

## Mengapa Kerentanan Logika Bisnis Tidak Tertangkap oleh WAF?

*Web Application Firewall* (WAF) dirancang untuk mengenali tanda tangan serangan sintaksis seperti `<script>` (XSS) atau `' OR 1=1 --` (SQL Injection). Namun, serangan terhadap logika bisnis mengirimkan permintaan JSON dan parameter yang 100% sah secara sintaksis, tetapi mengeksploitasi celah urutan waktu eksekusi (**TOCTOU**), pengikatan atribut model yang terlalu longgar (**Mass Assignment**), atau manipulasi jalur berkas (**Path Traversal**).

## 1. *Race Condition* (*Time-of-Check to Time-of-Use* / TOCTOU)

Kerentanan TOCTOU terjadi ketika aplikasi **memeriksa** suatu syarat (misalnya `SELECT saldo FROM dompet WHERE id = 1` menghasilkan `Rp100.000`) lalu beberapa milidetik kemudian **menggunakan** hasil pemeriksaan tersebut (`UPDATE dompet SET saldo = saldo - 100000`). Jika penyerang mengirimkan 20 permintaan HTTP paralel secara serentak menggunakan HTTP/2 *single-packet attack*, ke-20 permintaan dapat lolos pemeriksaan `saldo >= 100000` sebelum salah satu sempat mengurangi saldo!

**Dua Solusi Atomik di Basis Data:**

```sql
-- Cara 1: Pembaruan Atomik Bersyarat dalam Satu Pernyataan SQL (Paling Cepat)
-- Database mengunci baris secara internal saat mengevaluasi WHERE saldo >= $1
UPDATE dompet
SET saldo = saldo - 100000, updated_at = NOW()
WHERE id = $1 AND saldo >= 100000
RETURNING saldo;
-- Jika tidak ada baris yang dikembalikan (0 rows), berarti saldo tidak cukup!

-- Cara 2: Penguncian Pesimistis Eksplisit (SELECT ... FOR UPDATE) dalam Transaksi
BEGIN;
SELECT saldo FROM dompet WHERE id = $1 FOR UPDATE;
-- Permintaan paralel lain untuk id yang sama akan mengantre di baris ini
-- sampai transaksi ini melakukan COMMIT atau ROLLBACK.
UPDATE dompet SET saldo = saldo - 100000 WHERE id = $1;
COMMIT;
```

## 2. *Mass Assignment* / *Broken Object Property Level Authorization* (OWASP API3:2023)

*Mass Assignment* terjadi ketika endpoint pembaruan profil langsung meneruskan seluruh *body* JSON dari pengguna ke metode ORM seperti `User.update(req.body)`. Penyerang dapat menyisipkan atribut internal `{"nama": "Budi", "role": "admin", "saldo_kredit": 999999}` untuk menaikkan hak aksesnya sendiri.

- **Pertahanan Wajib:** Jangan pernah mengikat *request body* langsung ke model tabel basis data. Buat skema *Data Transfer Object* (DTO) khusus per operasi yang hanya mendaftarkan field yang diizinkan diubah oleh pengguna tersebut (misalnya `UpdateProfilDTO` yang hanya berisi `nama` dan `bio`), dan tolak field asing (`extra="forbid"`).

## 3. *Path Traversal* (`../`) dan Kanonikalisasi Jalur Berkas

Ketika aplikasi menerima nama berkas dari parameter pengguna (misalnya `?file=laporan-q1.pdf`) dan menggabungkannya langsung dengan direktori penyimpanan, penyerang dapat mengirimkan `?file=../../../../etc/passwd`. Menghapus string `"../"` dengan `replace("../", "")` tidak aman karena dapat ditembus oleh `....//`.

```go
package main

import (
	"errors"
	"fmt"
	"path/filepath"
	"strings"
)

func JalurUnduhAman(direktoriDasar string, inputPengguna string) (string, error) {
	dasarAbs, err := filepath.Abs(direktoriDasar)
	if err != nil {
		return "", err
	}
	// Gabungkan dan bersihkan jalur, lalu periksa apakah masih berada di dalam dasarAbs
	targetAbs, err := filepath.Abs(filepath.Join(dasarAbs, inputPengguna))
	if err != nil {
		return "", err
	}
	awalanWajib := dasarAbs + string(filepath.Separator)
	if !strings.HasPrefix(targetAbs, awalanWajib) {
		return "", errors.New("akses ditolak: terdeteksi percobaan path traversal")
	}
	return targetAbs, nil
}

func main() {
	if _, err := JalurUnduhAman("/var/app/uploads", "../../etc/passwd"); err != nil {
		fmt.Println("Serangan berhasil diblokir:", err)
	}
}
```

## Kuis Pemahaman

### Soal 1
Mengapa kode aplikasi yang membaca saldo dengan `SELECT saldo FROM akun WHERE id = 1`, memeriksa `if saldo >= 50000` di memori aplikasi, lalu menjalankan `UPDATE akun SET saldo = ${saldoBaru}` rentan terhadap serangan *Race Condition* (TOCTOU)?
- A. Karena pernyataan `SELECT` selalu mengembalikan angka negatif.
- B. Karena beberapa permintaan paralel dapat membaca nilai `saldo` lama yang sama secara bersamaan sebelum permintaan pertama sempat menyelesaikan `UPDATE`, sehingga penarikan saldo berhasil berkali-kali melebihi saldo asli.
- C. Karena kueri `UPDATE` tidak mendukung tipe data angka bulat.
- D. Karena koneksi HTTPS tidak mengenkripsi metode `POST`.

**Jawaban Benar:** B
**Penjelasan:** Terdapat celah waktu antara saat pemeriksaan (*Time-of-Check*) dan saat perubahan (*Time-of-Use*). Solusinya adalah menyatukan syarat di dalam pernyataan atomik `UPDATE akun SET saldo = saldo - $1 WHERE id = $2 AND saldo >= $1` atau mengunci baris dengan `SELECT ... FOR UPDATE`.

### Soal 2
Bagaimana cara paling efektif mencegah kerentanan *Mass Assignment* (OWASP API3:2023) pada endpoint `PATCH /api/profile`?
- A. Mengganti metode HTTP dari `PATCH` menjadi `PUT`.
- B. Memvalidasi input menggunakan skema DTO khusus yang hanya mencantumkan properti yang boleh diubah pengguna (*allowlist*) dan tidak pernah meneruskan objek JSON mentah langsung ke model ORM database.
- C. Menyembunyikan dokumentasi API dari publik.
- D. Mengenkripsi nama field JSON dengan Base64.

**Jawaban Benar:** B
**Penjelasan:** Memisahkan DTO input (yang hanya mengizinkan field aman seperti `nama` dan `avatar`) dari model entitas basis data (yang memuat `role`, `is_verified`, atau `balance`) menutup celah *Mass Assignment* di tingkat arsitektur.

### Soal 3
Mengapa memfilter input nama berkas menggunakan `strings.Replace(input, "../", "", -1)` satu kali tidak cukup untuk mencegah serangan *Path Traversal*?
- A. Karena penyerang dapat mengirimkan payload seperti `....//` yang setelah bagian `../` di tengahnya dihapus justru menyatu kembali menjadi `../`.
- B. Karena sistem operasi Linux tidak mengenal karakter titik (`.`).
- C. Karena fungsi `Replace` mengubah izin berkas di disk.
- D. Karena `../` hanya bekerja pada sistem operasi Windows.

**Jawaban Benar:** A
**Penjelasan:** Penyaringan substring sederhana mudah diakali dengan penyarangan pola (`....//`) atau pengodean URL. Cara yang benar adalah menggunakan nama berkas acak/ID basis data atau mengkanonikalisasi jalur absolut (`filepath.Abs` / `realpath`) lalu memverifikasi bahwa jalur hasil akhirnya tetap diawali oleh direktori dasar yang diizinkan.

## Sumber
- [OWASP API Security Top 10 2023 — API3:2023 Broken Object Property Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)
- [OWASP Web Security Testing Guide — Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
