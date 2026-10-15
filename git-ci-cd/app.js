/* ==========================================================================
   GIT & CI/CD MASTERY PLATFORM - INTERACTIVE APPLICATION ENGINE
   Author: Antigravity Team
   Language: Bahasa Indonesia
   ========================================================================== */

const MODULES_DATA = [
    {
        id: 1,
        title: "01. Fondasi Git - Model Objek, Staging Area & Commit",
        category: "Git Fundamentals",
        videoId: "8JJ101D3knE",
        duration: "22:10",
        desc: "Memahami Git dari dalam: blob, tree, commit, dan bagaimana working directory, staging area, serta repository saling berhubungan.",
        summary: "Git bukan menyimpan diff, melainkan snapshot utuh yang dialamati berdasarkan isinya (content-addressable). Setiap commit menunjuk ke satu tree, dan tree menunjuk ke blob. Tiga wilayah yang wajib dipahami: working directory (berkas yang Anda edit), staging area/index (calon commit berikutnya), dan repository (.git, riwayat permanen). Memahami tiga wilayah ini membuat perintah seperti reset, restore, dan checkout langsung masuk akal.",
        theory: `
            <h3>1. Git Menyimpan Snapshot, Bukan Perbedaan</h3>
            <p>Sistem kontrol versi lama seperti SVN menyimpan <em>daftar perubahan</em> per berkas. Git bekerja berbeda: setiap commit adalah <strong>potret utuh</strong> seluruh proyek pada saat itu. Berkas yang tidak berubah tidak disalin ulang — Git cukup menunjuk ke objek yang sudah ada.</p>

            <div class="callout callout-info">
                <strong>💡 Empat jenis objek di dalam .git</strong>
                <ul>
                    <li><strong>Blob</strong> — isi sebuah berkas. Tidak menyimpan nama berkas.</li>
                    <li><strong>Tree</strong> — sebuah direktori. Berisi daftar nama berkas beserta blob/tree yang ditunjuknya.</li>
                    <li><strong>Commit</strong> — menunjuk ke satu tree akar, ditambah pengarang, pesan, waktu, dan <strong>commit induk</strong>.</li>
                    <li><strong>Tag</strong> — penunjuk bernama ke sebuah objek, biasanya commit, dengan pesan dan penanda tangan.</li>
                </ul>
            </div>

            <p>Nama tiap objek adalah <strong>hash SHA-1 dari isinya</strong>. Konsekuensinya penting: dua berkas dengan isi identik hanya disimpan sekali, dan mengubah satu byte saja pada commit lama akan mengubah hash-nya beserta seluruh commit sesudahnya. Inilah yang membuat riwayat Git tidak bisa dipalsukan diam-diam.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Membedah objek secara langsung</span></div>
                <pre># Lihat jenis sebuah objek
git cat-file -t HEAD          # =&gt; commit

# Lihat isinya
git cat-file -p HEAD
# tree 9f2b3c...
# parent 4a1de8...
# author Budi &lt;budi@contoh.com&gt; 1712345678 +0700
# committer Budi &lt;budi@contoh.com&gt; 1712345678 +0700
#
# menambahkan validasi form login

# Telusuri tree-nya
git cat-file -p HEAD^{tree}

# Hash sebuah isi tanpa menyimpannya
echo "halo" | git hash-object --stdin</pre>
            </div>

            <h3>2. Tiga Wilayah Git</h3>
            <div class="code-box">
                <pre>  Working Directory        Staging Area (Index)        Repository (.git)
  berkas yang Anda edit    calon commit berikutnya     riwayat permanen
         │                          │                          │
         │──── git add ────────────&gt;│                          │
         │                          │──── git commit ─────────&gt;│
         │&lt;─── git restore ─────────│                          │
         │&lt;─────────────── git restore --source=HEAD ──────────│</pre>
            </div>

            <p>Hampir semua kebingungan pemula soal Git berasal dari tidak memisahkan tiga wilayah ini. <code>git status</code> selalu memberi tahu Anda berkas berada di wilayah mana.</p>

            <div class="code-box">
                <pre>git status
git status -s            # ringkas: XY nama-berkas
# Kolom pertama  = keadaan di staging area
# Kolom kedua    = keadaan di working directory
#
# M_  = sudah di-stage, siap commit
# _M  = berubah tapi belum di-stage
# MM  = sudah di-stage, LALU diubah lagi setelahnya
# ??  = berkas baru yang belum dilacak Git</pre>
            </div>

            <h3>3. Menyusun Commit dengan Rapi</h3>
            <div class="code-box">
                <pre># Menambahkan berkas ke staging area
git add berkas.js
git add .                    # semua perubahan di direktori sekarang
git add -A                   # semua perubahan di seluruh repositori

# Memilih BAGIAN dari sebuah berkas -- sangat berguna
git add -p berkas.js
# y = ambil bagian ini, n = lewati, s = pecah lagi jadi lebih kecil,
# e = sunting manual, q = keluar

# Melihat apa yang akan masuk ke commit
git diff                     # working directory vs staging area
git diff --staged            # staging area vs commit terakhir
git diff HEAD                # working directory vs commit terakhir</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 <code>git add -p</code> mengubah cara Anda bekerja</strong>
                <p>Anda sering menyelesaikan dua hal berbeda dalam satu sesi ngoding. <code>git add -p</code> memungkinkan Anda memecahnya menjadi dua commit yang bersih dan terpisah, alih-alih satu commit campur aduk berjudul "perbaikan macam-macam". Riwayat yang bersih membuat <code>git bisect</code> dan <code>git revert</code> menjadi jauh lebih berguna nanti.</p>
            </div>

            <h3>4. Menulis Pesan Commit yang Berguna</h3>
            <div class="code-box">
                <pre>git commit -m "perbaiki kebocoran koneksi pada pool database"

# Pesan panjang dengan badan penjelasan
git commit
# Baris 1  : ringkasan maksimal ~50 karakter, kalimat perintah
# Baris 2  : kosong
# Baris 3+ : KENAPA perubahan ini dibuat, bukan APA yang diubah</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Conventional Commits</strong>
                <p>Format yang banyak dipakai karena bisa dibaca mesin untuk membuat changelog dan menentukan versi otomatis:</p>
                <div class="code-box">
                    <pre>feat(auth): tambahkan login dengan Google
fix(api): tangani timeout pada pemanggilan layanan pembayaran
docs(readme): perbarui langkah instalasi
refactor(db): pisahkan query builder dari repository
perf(cache): kurangi round-trip Redis pada endpoint katalog
test(order): tambahkan kasus uji pembatalan pesanan
chore(deps): naikkan versi driver postgres

# Perubahan yang merusak kompatibilitas
feat(api)!: ganti format respons error menjadi RFC 7807</pre>
                </div>
                <p>Awalan <code>feat</code> menaikkan versi minor, <code>fix</code> menaikkan patch, dan tanda <code>!</code> atau footer <code>BREAKING CHANGE:</code> menaikkan versi mayor.</p>
            </div>

            <h3>5. HEAD, Branch, dan Referensi</h3>
            <p><strong>Branch di Git hanyalah sebuah berkas teks berisi hash commit.</strong> Itu sebabnya membuat branch di Git nyaris tanpa biaya, berbeda dengan SVN yang menyalin seluruh direktori.</p>

            <div class="code-box">
                <pre>cat .git/HEAD
# ref: refs/heads/main

cat .git/refs/heads/main
# 4a1de8f9c2b3...

# Notasi penunjuk relatif
HEAD        # commit tempat Anda berada sekarang
HEAD~1      # satu commit ke belakang (induk)
HEAD~3      # tiga commit ke belakang
HEAD^       # induk pertama
HEAD^2      # induk KEDUA -- hanya ada pada merge commit</pre>
            </div>

            <h3>6. Membatalkan: reset, restore, revert</h3>
            <p>Tiga perintah ini sering tertukar. Bedanya terletak pada <em>wilayah mana</em> yang mereka sentuh.</p>

            <table class="tech-table">
                <thead><tr><th>Perintah</th><th>Yang berubah</th><th>Aman untuk riwayat publik?</th></tr></thead>
                <tbody>
                    <tr><td><code>git restore berkas</code></td><td>Working directory saja</td><td>Ya</td></tr>
                    <tr><td><code>git restore --staged berkas</code></td><td>Staging area saja</td><td>Ya</td></tr>
                    <tr><td><code>git reset --soft HEAD~1</code></td><td>Hanya penunjuk branch; perubahan tetap di staging</td><td><strong>Tidak</strong></td></tr>
                    <tr><td><code>git reset --mixed HEAD~1</code></td><td>Branch + staging area (default)</td><td><strong>Tidak</strong></td></tr>
                    <tr><td><code>git reset --hard HEAD~1</code></td><td>Semuanya — perubahan <strong>hilang</strong></td><td><strong>Tidak</strong></td></tr>
                    <tr><td><code>git revert &lt;commit&gt;</code></td><td>Membuat commit BARU yang membatalkan</td><td><strong>Ya</strong> — ini yang benar untuk branch bersama</td></tr>
                </tbody>
            </table>

            <div class="callout callout-danger">
                <strong>🚫 Aturan emas</strong>
                <p>Gunakan <code>git revert</code> untuk commit yang <strong>sudah dipush ke branch bersama</strong>. <code>git reset</code> menulis ulang riwayat; bila riwayat itu sudah dipakai orang lain, Anda memaksa semua rekan tim membereskan kekacauan di repositori lokal mereka masing-masing.</p>
            </div>

            <h3>7. Jaring Pengaman: reflog</h3>
            <div class="code-box">
                <pre># Riwayat SEMUA perpindahan HEAD, termasuk yang "hilang"
git reflog

# 4a1de8f HEAD@{0}: reset: moving to HEAD~1
# 9c2b3f1 HEAD@{1}: commit: menambahkan fitur ekspor
# 7e4a2d8 HEAD@{2}: checkout: moving from main to fitur-baru

# Memulihkan commit yang terlanjur di-reset --hard
git reset --hard 9c2b3f1
# atau selamatkan ke branch baru
git branch penyelamat 9c2b3f1</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Hampir tidak ada yang benar-benar hilang di Git</strong>
                <p>Selama commit pernah dibuat, ia tercatat di reflog selama kurang lebih 90 hari sebelum garbage collector membersihkannya. Sebelum panik karena <code>reset --hard</code>, jalankan <code>git reflog</code> — kemungkinan besar pekerjaan Anda masih ada di sana.</p>
            </div>
        `,
        sampleCommands: [
            "git status -s",
            "git add -p",
            "git diff --staged",
            "git cat-file -p HEAD",
            "git reflog",
            "git log --oneline --graph --decorate"
        ],
        quiz: [
            {
                question: "Bagaimana sebenarnya Git menyimpan riwayat proyek?",
                options: [
                    "Sebagai daftar perbedaan (diff) antar versi berkas",
                    "Sebagai snapshot utuh yang dialamati berdasarkan hash isinya, di mana berkas yang tak berubah hanya ditunjuk ulang",
                    "Sebagai berkas ZIP terkompresi per commit",
                    "Sebagai catatan di database SQL internal"
                ],
                answer: 1,
                explanation: "Git adalah sistem content-addressable: tiap objek dinamai dari hash isinya. Setiap commit menunjuk snapshot utuh, namun berkas yang tidak berubah tidak disalin ulang karena blob-nya cukup ditunjuk kembali."
            },
            {
                question: "Commit sudah terlanjur dipush ke branch main yang dipakai bersama tim, dan ternyata salah. Perintah apa yang benar untuk membatalkannya?",
                options: [
                    "git reset --hard HEAD~1 lalu push paksa",
                    "git revert <commit>, karena ia membuat commit baru yang membatalkan tanpa menulis ulang riwayat",
                    "Menghapus repositori lalu clone ulang",
                    "git checkout HEAD~1"
                ],
                answer: 1,
                explanation: "git revert membuat commit baru yang berisi kebalikan dari perubahan tersebut, sehingga riwayat tetap utuh dan rekan tim tidak perlu membereskan apa pun. reset diikuti push paksa akan menulis ulang riwayat yang sudah dimiliki orang lain."
            },
            {
                question: "Anda tidak sengaja menjalankan git reset --hard dan kehilangan commit terakhir. Apa langkah pertama yang harus dilakukan?",
                options: [
                    "Menulis ulang kodenya dari awal",
                    "Menjalankan git reflog untuk menemukan hash commit tersebut, lalu memulihkannya",
                    "Menjalankan git fsck --lost-found sebagai satu-satunya cara",
                    "Menghubungi administrator server Git"
                ],
                answer: 1,
                explanation: "git reflog mencatat semua perpindahan HEAD termasuk yang sudah tidak terjangkau branch mana pun. Commit tersebut biasanya masih ada selama kurang lebih 90 hari dan bisa dipulihkan dengan reset atau dengan membuat branch baru di hash tersebut."
            }
        ]
    },
    {
        id: 2,
        title: "02. Branching & Merging - Fast-Forward vs Three-Way",
        category: "Git Fundamentals",
        videoId: "8JJ101D3knE",
        duration: "20:45",
        desc: "Membuat dan memindahkan branch, memahami perbedaan fast-forward dan three-way merge, serta kapan memakai --no-ff.",
        summary: "Branch adalah penunjuk ringan ke sebuah commit. Merge menggabungkan dua garis pengembangan: bila branch tujuan tidak bergerak sejak percabangan, Git cukup memajukan penunjuk (fast-forward) tanpa commit baru. Bila keduanya bergerak, Git membuat merge commit dengan dua induk (three-way merge) memakai commit leluhur bersama sebagai basis. Opsi --no-ff memaksa merge commit agar jejak fitur tetap terlihat.",
        theory: `
            <h3>1. Branch Itu Murah</h3>
            <div class="code-box">
                <pre># Membuat dan langsung berpindah
git switch -c fitur/keranjang-belanja

# Bentuk lama yang masih sangat umum
git checkout -b fitur/keranjang-belanja

# Berpindah antar branch
git switch main
git switch -                 # kembali ke branch sebelumnya

# Melihat daftar branch
git branch                   # lokal
git branch -a                # termasuk remote
git branch -v                # dengan commit terakhir tiap branch
git branch --merged main     # yang sudah tergabung ke main
git branch --no-merged main  # yang BELUM tergabung

# Menghapus branch
git branch -d fitur/lama     # aman: menolak bila belum di-merge
git branch -D fitur/lama     # paksa, meski belum di-merge</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Konvensi penamaan branch</strong>
                <div class="code-box">
                    <pre>fitur/nama-fitur          atau  feature/…
perbaikan/nama-bug        atau  fix/…
hotfix/masalah-produksi
rilis/2.4.0
eksperimen/coba-grpc</pre>
                </div>
                <p>Menyertakan nomor tiket sangat membantu penelusuran: <code>fitur/PROJ-142-checkout-cepat</code>.</p>
            </div>

            <h3>2. Fast-Forward Merge</h3>
            <p>Terjadi bila branch tujuan <strong>tidak bergerak sama sekali</strong> sejak percabangan dibuat. Git tinggal memajukan penunjuk — tidak ada commit baru yang dibuat.</p>

            <div class="code-box">
                <pre>Sebelum:
main     A───B
                \\
fitur            C───D

Setelah git switch main && git merge fitur:
main     A───B───C───D
                     ↑
                   fitur juga di sini</pre>
            </div>

            <h3>3. Three-Way Merge</h3>
            <p>Terjadi bila <strong>kedua branch sama-sama bergerak</strong>. Git mencari commit leluhur bersama, lalu menggabungkan kedua sisi dengan leluhur itu sebagai titik acuan.</p>

            <div class="code-box">
                <pre>Sebelum:
main     A───B───E───F
                \\
fitur            C───D

Setelah merge:
main     A───B───E───F───M      &lt;-- M punya DUA induk: F dan D
                \\           /
fitur            C───D────/</pre>
            </div>

            <div class="code-box">
                <pre># Mencari leluhur bersama secara manual
git merge-base main fitur

# Melakukan merge
git switch main
git merge fitur

# Memaksa merge commit meski sebenarnya bisa fast-forward
git merge --no-ff fitur

# Menggabungkan seluruh fitur menjadi SATU commit tanpa merge commit
git merge --squash fitur
git commit -m "feat: tambahkan keranjang belanja"</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Kapan memakai <code>--no-ff</code></strong>
                <p>Dengan fast-forward, commit-commit fitur bercampur ke main dan Anda kehilangan informasi "commit-commit ini datang dari satu fitur yang sama". Dengan <code>--no-ff</code>, selalu ada merge commit yang menandai batas fitur, sehingga membatalkan seluruh fitur cukup dengan <code>git revert -m 1 &lt;merge-commit&gt;</code>. Banyak tim menjadikan ini kebijakan wajib untuk main.</p>
            </div>

            <h3>4. Tiga Cara Menggabungkan, Tiga Bentuk Riwayat</h3>
            <table class="tech-table">
                <thead><tr><th>Cara</th><th>Bentuk riwayat</th><th>Cocok untuk</th></tr></thead>
                <tbody>
                    <tr><td><strong>Merge commit</strong> (<code>--no-ff</code>)</td><td>Bercabang, jejak fitur terlihat jelas</td><td>Tim besar, audit, fitur berumur panjang</td></tr>
                    <tr><td><strong>Squash</strong></td><td>Lurus, satu commit per pull request</td><td>Riwayat main yang sangat bersih; commit WIP dibuang</td></tr>
                    <tr><td><strong>Rebase lalu fast-forward</strong></td><td>Lurus, semua commit asli terjaga</td><td>Tim yang disiplin menulis commit atomik</td></tr>
                </tbody>
            </table>

            <h3>5. Melihat Bentuk Riwayat</h3>
            <div class="code-box">
                <pre>git log --oneline --graph --decorate --all

# Commit yang ada di fitur tapi belum ada di main
git log main..fitur

# Perbedaan dua arah sekaligus
git log --left-right --oneline main...fitur

# Siapa yang mengubah baris tertentu
git blame -L 40,60 src/pembayaran.js

# Melacak sebuah fungsi lintas perubahan nama berkas
git log --follow -p -- src/pembayaran.js</pre>
            </div>

            <h3>6. Branch Lokal dan Remote</h3>
            <div class="code-box">
                <pre># Mendorong branch lokal sekaligus menyetel pelacakannya
git push -u origin fitur/keranjang-belanja

# Melihat hubungan lokal-remote
git branch -vv

# Mengambil perubahan remote TANPA menggabungkan
git fetch origin

# Membersihkan referensi remote yang sudah dihapus di server
git fetch --prune

# Menghapus branch di server
git push origin --delete fitur/lama</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ <code>git pull</code> itu dua perintah sekaligus</strong>
                <p><code>git pull</code> setara dengan <code>git fetch</code> lalu <code>git merge</code>, dan sering menghasilkan merge commit "Merge branch main of…" yang mengotori riwayat. Banyak tim menyetel <code>git config --global pull.rebase true</code> agar pull melakukan rebase. Kalau ragu, biasakan <code>git fetch</code> dulu, lihat apa yang datang, baru putuskan sendiri.</p>
            </div>
        `,
        sampleCommands: [
            "git switch -c fitur/keranjang",
            "git branch -vv",
            "git merge --no-ff fitur/keranjang",
            "git merge-base main fitur/keranjang",
            "git log --oneline --graph --all",
            "git fetch --prune"
        ],
        quiz: [
            {
                question: "Kapan Git melakukan fast-forward merge?",
                options: [
                    "Setiap kali perintah git merge dijalankan",
                    "Ketika branch tujuan tidak memiliki commit baru sejak percabangan dibuat, sehingga penunjuknya cukup dimajukan",
                    "Ketika terjadi konflik",
                    "Hanya ketika memakai opsi --squash"
                ],
                answer: 1,
                explanation: "Fast-forward hanya mungkin bila riwayat branch tujuan sepenuhnya terkandung di dalam branch sumber. Git cukup memindahkan penunjuk maju tanpa perlu membuat merge commit karena tidak ada dua garis pengembangan yang perlu disatukan."
            },
            {
                question: "Apa keuntungan utama memakai git merge --no-ff untuk menggabungkan fitur ke main?",
                options: [
                    "Prosesnya lebih cepat",
                    "Selalu terbentuk merge commit yang menandai batas fitur, sehingga jejak fitur terlihat dan seluruh fitur bisa dibatalkan sekaligus",
                    "Konflik tidak akan pernah terjadi",
                    "Ukuran repositori menjadi lebih kecil"
                ],
                answer: 1,
                explanation: "Tanpa --no-ff, commit fitur bercampur ke main dan informasi pengelompokannya hilang. Merge commit menjadi satu titik yang mewakili keseluruhan fitur, sehingga git revert -m 1 pada commit itu membatalkan seluruh fitur sekaligus."
            },
            {
                question: "Mengapa banyak tim menghindari 'git pull' polos dan memilih 'git fetch' lebih dulu?",
                options: [
                    "Karena git pull tidak berfungsi pada repositori besar",
                    "Karena git pull otomatis menjalankan merge sehingga sering menghasilkan merge commit yang mengotori riwayat, tanpa Anda sempat melihat apa yang datang",
                    "Karena git pull menghapus branch lokal",
                    "Karena git fetch lebih cepat"
                ],
                answer: 1,
                explanation: "git pull adalah gabungan fetch dan merge yang berjalan otomatis. Dengan memisahkannya, Anda bisa memeriksa dulu commit apa yang masuk dan memutuskan apakah ingin merge atau rebase, alih-alih menerima merge commit yang tidak diinginkan."
            }
        ]
    },
    {
        id: 3,
        title: "03. Menyelesaikan Konflik Merge dengan Percaya Diri",
        category: "Git Fundamentals",
        videoId: "8JJ101D3knE",
        duration: "18:30",
        desc: "Membaca penanda konflik, memakai gaya diff3, memanfaatkan rerere, dan strategi mencegah konflik sejak awal.",
        summary: "Konflik terjadi ketika dua branch mengubah baris yang sama pada berkas yang sama. Git menandai bagian bermasalah dengan <<<<<<<, =======, dan >>>>>>>. Mengaktifkan merge.conflictstyle diff3 menampilkan versi leluhur bersama, yang membuat keputusan jauh lebih mudah. Fitur rerere membuat Git mengingat penyelesaian konflik agar tidak perlu diulang. Pencegahan terbaik adalah branch berumur pendek dan sinkronisasi sering.",
        theory: `
            <h3>1. Membaca Penanda Konflik</h3>
            <div class="code-box">
                <div class="code-box-header"><span>src/harga.js</span></div>
                <pre>function hitungTotal(item) {
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  return item.harga * item.jumlah * 1.11;   // versi di branch Anda
=======
  return item.harga * item.jumlah * 1.12;   // versi dari branch yang di-merge
&gt;&gt;&gt;&gt;&gt;&gt;&gt; fitur/pajak-baru
}</pre>
            </div>

            <ul>
                <li>Antara <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> dan <code>=======</code> adalah versi <strong>branch tempat Anda berada sekarang</strong> (HEAD).</li>
                <li>Antara <code>=======</code> dan <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> adalah versi <strong>branch yang sedang digabungkan</strong>.</li>
            </ul>

            <h3>2. Aktifkan diff3 — Ini Mengubah Segalanya</h3>
            <div class="code-box">
                <pre>git config --global merge.conflictstyle zdiff3</pre>
            </div>

            <p>Dengan pengaturan ini, Git juga menampilkan <strong>versi asli sebelum kedua pihak mengubahnya</strong>:</p>

            <div class="code-box">
                <pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  return item.harga * item.jumlah * 1.11;
||||||| leluhur bersama
  return item.harga * item.jumlah;          &lt;-- ASLINYA begini
=======
  return item.harga * item.jumlah * 1.12;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; fitur/pajak-baru</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Kenapa ini sangat membantu</strong>
                <p>Tanpa versi leluhur, Anda hanya melihat dua jawaban berbeda tanpa tahu <em>apa yang masing-masing pihak sebenarnya ubah</em>. Dengan diff3 terlihat jelas: satu pihak menambahkan pajak 11%, pihak lain menambahkan 12%. Keputusannya jadi soal bisnis, bukan tebak-tebakan kode.</p>
            </div>

            <h3>3. Alur Penyelesaian</h3>
            <div class="code-box">
                <pre># Lihat berkas mana saja yang konflik
git status
git diff --name-only --diff-filter=U

# Setelah menyunting dan menghapus SEMUA penanda konflik:
git add src/harga.js
git status                  # pastikan tidak ada yang tersisa
git commit                  # Git sudah menyiapkan pesan merge

# Membatalkan seluruh proses merge dan kembali seperti semula
git merge --abort</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Kesalahan paling sering</strong>
                <p>Lupa menghapus salah satu penanda <code>=======</code> atau <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, lalu commit. Kode menjadi rusak dan pipeline CI gagal dengan pesan yang membingungkan. Sebelum commit, cari sisa penanda:</p>
                <div class="code-box">
                    <pre>git diff --check
grep -rn "&lt;&lt;&lt;&lt;&lt;&lt;&lt;\\|&gt;&gt;&gt;&gt;&gt;&gt;&gt;\\|=======" .</pre>
                </div>
            </div>

            <h3>4. Mengambil Salah Satu Sisi Secara Utuh</h3>
            <div class="code-box">
                <pre># Ambil versi branch Anda untuk berkas ini
git checkout --ours berkas-lock.json

# Ambil versi branch yang di-merge
git checkout --theirs paket-baru.json

git add berkas-lock.json paket-baru.json</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Arti "ours" terbalik saat rebase</strong>
                <p>Saat <code>merge</code>, <em>ours</em> adalah branch Anda. Saat <code>rebase</code>, Git memutar ulang commit Anda di atas branch tujuan, sehingga <em>ours</em> justru merujuk pada <strong>branch tujuan</strong> dan <em>theirs</em> adalah commit Anda sendiri. Ini membalik intuisi banyak orang — periksa dua kali sebelum memakainya saat rebase.</p>
            </div>

            <h3>5. rerere — Git Mengingat Penyelesaian Anda</h3>
            <div class="code-box">
                <pre>git config --global rerere.enabled true</pre>
            </div>

            <p><em>Reuse Recorded Resolution</em>: Git menyimpan cara Anda menyelesaikan sebuah konflik. Bila konflik yang persis sama muncul lagi — dan ini sangat sering terjadi saat rebase berulang atau memelihara branch berumur panjang — Git menerapkannya otomatis.</p>

            <div class="code-box">
                <pre>git rerere status      # konflik apa yang sedang direkam
git rerere diff        # penyelesaian apa yang sedang berlaku
git rerere forget berkas.js   # lupakan rekaman untuk berkas ini</pre>
            </div>

            <h3>6. Konflik pada Berkas yang Dihasilkan Mesin</h3>
            <p>Berkas seperti <code>package-lock.json</code>, <code>yarn.lock</code>, atau <code>go.sum</code> hampir selalu konflik dan tidak layak diselesaikan baris per baris.</p>

            <div class="code-box">
                <pre># Jangan sunting manual -- bangun ulang saja
git checkout --theirs package-lock.json
npm install
git add package-lock.json</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>.gitattributes — menandai berkas biner</span></div>
                <pre># Cegah Git mencoba menggabungkan berkas yang tidak bisa di-merge
*.png binary
*.pdf binary
*.xlsx binary

# Selalu ambil versi kita untuk berkas tertentu
CHANGELOG.md merge=ours</pre>
            </div>

            <h3>7. Mencegah Lebih Baik daripada Menyelesaikan</h3>
            <ul>
                <li><strong>Branch berumur pendek.</strong> Branch yang hidup dua hari jarang konflik; yang hidup dua bulan hampir pasti konflik berat. Ini penyebab konflik nomor satu.</li>
                <li><strong>Sering menarik dari main.</strong> Jalankan <code>git fetch origin && git rebase origin/main</code> setiap pagi, sehingga Anda menghadapi konflik kecil setiap hari alih-alih satu konflik raksasa di akhir.</li>
                <li><strong>Pisahkan tanggung jawab berkas.</strong> Konflik struktural sering merupakan gejala arsitektur: kalau dua tim selalu mengubah berkas yang sama, berkas itu mungkin mengerjakan terlalu banyak hal.</li>
                <li><strong>Sepakati format kode.</strong> Formatter otomatis seperti Prettier atau gofmt menghilangkan seluruh kelas konflik yang cuma soal spasi dan tanda kurung.</li>
                <li><strong>Pull request kecil.</strong> Perubahan 200 baris di-review dengan teliti dan jarang konflik; perubahan 3.000 baris hanya diberi stempel setuju dan penuh konflik.</li>
            </ul>
        `,
        sampleCommands: [
            "git config --global merge.conflictstyle zdiff3",
            "git config --global rerere.enabled true",
            "git diff --name-only --diff-filter=U",
            "git diff --check",
            "git merge --abort",
            "git checkout --ours package-lock.json"
        ],
        quiz: [
            {
                question: "Apa manfaat mengaktifkan merge.conflictstyle zdiff3?",
                options: [
                    "Konflik akan diselesaikan otomatis oleh Git",
                    "Git menampilkan juga versi leluhur bersama, sehingga terlihat apa yang sebenarnya diubah masing-masing pihak",
                    "Penanda konflik menjadi berwarna",
                    "Konflik pada berkas biner menjadi bisa digabungkan"
                ],
                answer: 1,
                explanation: "Gaya konflik bawaan hanya menampilkan dua hasil akhir tanpa konteks. Dengan zdiff3, blok tambahan menampilkan isi asli sebelum kedua pihak mengubahnya, sehingga Anda bisa menyimpulkan maksud tiap perubahan alih-alih menebak."
            },
            {
                question: "Saat menjalankan git rebase, apa arti 'ours'?",
                options: [
                    "Tetap merujuk branch tempat Anda bekerja, sama seperti saat merge",
                    "Merujuk branch tujuan tempat commit Anda diputar ulang, sehingga terbalik dari intuisi saat merge",
                    "Merujuk commit paling awal di repositori",
                    "Tidak berlaku saat rebase"
                ],
                answer: 1,
                explanation: "Rebase memutar ulang commit Anda di atas branch tujuan, sehingga dari sudut pandang Git branch tujuanlah yang sedang 'di-checkout'. Akibatnya --ours menunjuk branch tujuan dan --theirs menunjuk commit Anda sendiri."
            },
            {
                question: "Apa cara paling efektif MENCEGAH konflik merge yang berat?",
                options: [
                    "Melarang anggota tim membuat branch",
                    "Menjaga branch tetap berumur pendek dan sering melakukan sinkronisasi dengan main",
                    "Selalu memakai git merge --squash",
                    "Menyimpan semua kode dalam satu berkas besar"
                ],
                answer: 1,
                explanation: "Beratnya konflik tumbuh seiring lamanya sebuah branch menyimpang dari main. Branch berumur pendek dengan sinkronisasi harian menghasilkan konflik kecil yang mudah diselesaikan, sementara branch berumur bulanan menumpuk perubahan yang saling bertabrakan."
            }
        ]
    },
    {
        id: 4,
        title: "04. Rebase, Interactive Rebase & Menulis Ulang Riwayat",
        category: "Git Fundamentals",
        videoId: "8JJ101D3knE",
        duration: "24:00",
        desc: "Merapikan commit sebelum di-review dengan rebase interaktif, memahami aturan emas rebase, dan memakai force-with-lease dengan aman.",
        summary: "Rebase memindahkan commit Anda agar seolah dibuat di atas kondisi terbaru branch tujuan, menghasilkan riwayat lurus. Rebase interaktif memungkinkan penggabungan, penyuntingan, penyusunan ulang, dan penghapusan commit sebelum kode di-review. Aturan emasnya: jangan rebase commit yang sudah dibagikan ke branch bersama. Saat harus mendorong hasil rebase, gunakan --force-with-lease, bukan --force.",
        theory: `
            <h3>1. Rebase vs Merge</h3>
            <div class="code-box">
                <pre>Kondisi awal:
main     A───B───E───F
                \\
fitur            C───D

Hasil MERGE:                    Hasil REBASE:
main  A─B─E─F───M               main  A─B─E─F
           \\   /                            \\
fitur       C─D                 fitur         C'──D'

Merge mempertahankan bentuk     Rebase MEMBUAT ULANG C dan D
sejarah apa adanya.             di atas F. Hash-nya berubah
                                menjadi C' dan D'.</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Rebase membuat commit BARU</strong>
                <p>C' bukan C yang dipindahkan — ia adalah commit baru dengan isi serupa tetapi hash berbeda, karena induknya berubah. Inilah akar dari seluruh aturan keselamatan rebase.</p>
            </div>

            <h3>2. Rebase Dasar</h3>
            <div class="code-box">
                <pre>git switch fitur/keranjang
git fetch origin
git rebase origin/main

# Bila ada konflik di tengah jalan:
#   selesaikan konflik di berkas
git add berkas-yang-konflik.js
git rebase --continue

git rebase --skip        # lewati commit ini
git rebase --abort       # batalkan semuanya, kembali seperti semula</pre>
            </div>

            <h3>3. Rebase Interaktif — Alat Perapi Utama</h3>
            <div class="code-box">
                <pre># Rapikan 5 commit terakhir
git rebase -i HEAD~5

# Rapikan semua commit sejak bercabang dari main
git rebase -i main</pre>
            </div>

            <p>Sebuah editor akan terbuka:</p>
            <div class="code-box">
                <pre>pick 4a1de8f feat: tambahkan endpoint keranjang
pick 9c2b3f1 wip
pick 7e4a2d8 perbaiki typo
pick 2f8b1a4 feat: tambahkan validasi stok
pick 5d3c7e9 lupa hapus console.log</pre>
            </div>

            <table class="tech-table">
                <thead><tr><th>Perintah</th><th>Kegunaan</th></tr></thead>
                <tbody>
                    <tr><td><code>pick</code></td><td>Pakai commit apa adanya</td></tr>
                    <tr><td><code>reword</code></td><td>Pakai commit, tapi ubah pesannya</td></tr>
                    <tr><td><code>edit</code></td><td>Berhenti di sini agar isinya bisa diubah</td></tr>
                    <tr><td><code>squash</code></td><td>Gabungkan ke commit di atasnya, pesan digabung</td></tr>
                    <tr><td><code>fixup</code></td><td>Gabungkan ke commit di atasnya, pesan <strong>dibuang</strong></td></tr>
                    <tr><td><code>drop</code></td><td>Hapus commit ini sepenuhnya</td></tr>
                    <tr><td><code>reorder</code></td><td>Cukup pindahkan urutan barisnya</td></tr>
                </tbody>
            </table>

            <div class="code-box">
                <div class="code-box-header"><span>Hasil setelah disunting</span></div>
                <pre>pick   4a1de8f feat: tambahkan endpoint keranjang
fixup  9c2b3f1 wip
fixup  7e4a2d8 perbaiki typo
pick   2f8b1a4 feat: tambahkan validasi stok
fixup  5d3c7e9 lupa hapus console.log

# Hasil akhir: 2 commit bersih, bukan 5 commit berantakan</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Alur kerja <code>--fixup</code> yang sangat praktis</strong>
                <div class="code-box">
                    <pre># Saat menemukan perbaikan untuk commit lama:
git commit --fixup 4a1de8f

# Nanti, gabungkan semuanya secara otomatis
git rebase -i --autosquash main
# Git sudah menyusun urutan fixup-nya sendiri.</pre>
                </div>
                <p>Aktifkan permanen dengan <code>git config --global rebase.autosquash true</code>.</p>
            </div>

            <h3>4. Aturan Emas Rebase</h3>
            <div class="callout callout-danger">
                <strong>🚫 Jangan pernah rebase commit yang sudah dibagikan</strong>
                <p>Kalau Anda merebase <code>main</code> yang sudah dipakai sepuluh orang, hash seluruh commit berubah. Repositori lokal setiap orang akan menganggap ada puluhan commit "baru" yang sebenarnya duplikat, dan menyatukannya kembali sangat menyakitkan.</p>
                <p><strong>Aman untuk direbase:</strong> branch fitur pribadi yang hanya Anda yang pakai, bahkan bila sudah dipush.<br>
                <strong>Tidak boleh direbase:</strong> <code>main</code>, <code>develop</code>, branch rilis, atau branch fitur yang dikerjakan bersama orang lain.</p>
            </div>

            <h3>5. Push Setelah Rebase: <code>--force-with-lease</code></h3>
            <div class="code-box">
                <pre># BERBAHAYA -- menimpa apa pun yang ada di server
git push --force

# AMAN -- menolak bila ada commit baru dari orang lain
# yang belum pernah Anda lihat
git push --force-with-lease

# Lebih ketat lagi (Git modern)
git push --force-with-lease --force-if-includes</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Kenapa <code>--force-with-lease</code> lebih aman</strong>
                <p>Perintah ini memeriksa dulu apakah branch di server masih berada di posisi yang terakhir Anda ketahui. Bila rekan tim mendorong sesuatu sementara Anda melakukan rebase, push akan <strong>ditolak</strong> alih-alih diam-diam menghapus pekerjaan mereka. Jadikan ini kebiasaan permanen — <code>--force</code> polos hampir tidak pernah merupakan pilihan yang tepat.</p>
            </div>

            <h3>6. Menyunting Commit Terakhir: <code>--amend</code></h3>
            <div class="code-box">
                <pre># Perbaiki pesan commit terakhir
git commit --amend -m "pesan yang benar"

# Tambahkan berkas yang lupa ke commit terakhir, tanpa mengubah pesan
git add berkas-yang-lupa.js
git commit --amend --no-edit</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ <code>--amend</code> juga menulis ulang riwayat</strong>
                <p>Perintah ini mengganti commit terakhir dengan commit baru berhash berbeda. Aman selama commit itu belum dipush; setelah dipush, Anda tetap butuh <code>--force-with-lease</code>.</p>
            </div>

            <h3>7. Menyelamatkan Commit dari Branch Lain: <code>cherry-pick</code></h3>
            <div class="code-box">
                <pre># Ambil satu commit spesifik ke branch sekarang
git cherry-pick 4a1de8f

# Ambil beberapa sekaligus
git cherry-pick 4a1de8f 9c2b3f1

# Ambil rentang commit
git cherry-pick main~5..main~2

# Ambil perubahannya saja, tanpa langsung commit
git cherry-pick -n 4a1de8f</pre>
            </div>

            <p>Kasus paling umum: sebuah perbaikan mendesak sudah selesai di branch fitur, dan perbaikan itu perlu segera masuk ke produksi tanpa membawa serta seluruh fitur yang belum siap.</p>

            <h3>8. Menemukan Commit Penyebab Bug: <code>bisect</code></h3>
            <div class="code-box">
                <pre>git bisect start
git bisect bad                 # kondisi sekarang rusak
git bisect good v2.3.0         # versi ini masih baik

# Git memeriksakan commit di tengah. Uji, lalu beri tahu hasilnya:
git bisect good     # atau: git bisect bad
# Ulangi sampai Git menemukan commit penyebabnya.

git bisect reset               # kembali ke kondisi semula

# Otomatis penuh dengan skrip pengujian
git bisect run npm test</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Di sinilah commit atomik terbayar</strong>
                <p><code>bisect</code> memakai pencarian biner: 1.000 commit selesai dalam sekitar 10 langkah. Tetapi ia hanya berguna bila tiap commit dapat dibangun dan diuji sendiri. Riwayat penuh commit "wip" yang rusak membuat bisect praktis tidak bisa dipakai — inilah alasan praktis kenapa merapikan commit dengan rebase interaktif itu penting.</p>
            </div>
        `,
        sampleCommands: [
            "git rebase -i HEAD~5",
            "git commit --fixup 4a1de8f",
            "git rebase -i --autosquash main",
            "git push --force-with-lease",
            "git cherry-pick 4a1de8f",
            "git bisect start"
        ],
        quiz: [
            {
                question: "Mengapa rebase tidak boleh dilakukan pada branch yang sudah dipakai bersama tim?",
                options: [
                    "Karena rebase memakan banyak memori",
                    "Karena rebase membuat commit baru dengan hash berbeda, sehingga repositori lokal rekan tim akan melihat commit duplikat dan riwayatnya bercabang",
                    "Karena rebase menghapus branch di server",
                    "Karena rebase hanya bekerja pada repositori kosong"
                ],
                answer: 1,
                explanation: "Rebase tidak memindahkan commit, melainkan membuat ulang commit dengan induk yang berbeda sehingga hash-nya berubah. Riwayat lama masih ada di repositori lokal orang lain, dan menyatukan kembali dua versi riwayat yang berbeda sangat merepotkan."
            },
            {
                question: "Apa keunggulan git push --force-with-lease dibanding git push --force?",
                options: [
                    "Prosesnya lebih cepat",
                    "Push ditolak bila ada commit baru di server yang belum pernah Anda lihat, sehingga pekerjaan rekan tim tidak terhapus diam-diam",
                    "Ia otomatis melakukan merge",
                    "Ia bekerja tanpa koneksi internet"
                ],
                answer: 1,
                explanation: "--force menimpa branch di server tanpa syarat. --force-with-lease memeriksa dulu apakah posisi branch di server masih sama dengan yang terakhir Anda ambil; bila ada yang mendorong sesuatu di antaranya, push dibatalkan sebagai pengaman."
            },
            {
                question: "Apa perbedaan 'squash' dan 'fixup' pada rebase interaktif?",
                options: [
                    "Tidak ada perbedaan sama sekali",
                    "squash menggabungkan commit sekaligus menggabungkan pesannya, fixup menggabungkan commit tetapi membuang pesan commit tersebut",
                    "squash menghapus commit, fixup menyimpannya",
                    "fixup hanya bekerja pada commit pertama"
                ],
                answer: 1,
                explanation: "Keduanya melebur commit ke commit di atasnya. Bedanya pada pesan: squash membuka editor untuk menggabungkan kedua pesan, sedangkan fixup langsung membuang pesan commit yang dilebur — tepat untuk commit perbaikan kecil seperti 'typo' atau 'lupa hapus log'."
            }
        ]
    },
    {
        id: 5,
        title: "05. Strategi Branching - Git Flow, GitHub Flow & Trunk-Based",
        category: "Git Workflow",
        videoId: "8JJ101D3knE",
        duration: "21:15",
        desc: "Membandingkan tiga model percabangan utama, kapan masing-masing tepat dipakai, dan hubungannya dengan frekuensi rilis serta feature flag.",
        summary: "Git Flow memakai banyak branch berumur panjang (main, develop, release, hotfix) dan cocok untuk perangkat lunak berversi dengan rilis terjadwal. GitHub Flow hanya punya main plus branch fitur pendek, cocok untuk aplikasi web yang terus-menerus dirilis. Trunk-Based Development mendorong semua orang mengintegrasikan ke main setidaknya sekali sehari dengan bantuan feature flag, dan merupakan prasyarat praktis continuous delivery berfrekuensi tinggi.",
        theory: `
            <h3>1. Git Flow</h3>
            <div class="code-box">
                <pre>main      ──●───────────●───────────●──   (hanya rilis, diberi tag)
             \\         /         /
release       \\    ●─●       ●─●
               \\  /         /
develop    ●────●─────●────●──────────    (integrasi harian)
            \\        /
fitur        ●──────●
hotfix    ──────●──────────────────●      (langsung dari & ke main)</pre>
            </div>

            <table class="tech-table">
                <thead><tr><th>Branch</th><th>Umur</th><th>Peran</th></tr></thead>
                <tbody>
                    <tr><td><code>main</code></td><td>Permanen</td><td>Hanya berisi kode yang sudah dirilis, tiap commit diberi tag versi</td></tr>
                    <tr><td><code>develop</code></td><td>Permanen</td><td>Tempat integrasi seluruh fitur yang sedang dikembangkan</td></tr>
                    <tr><td><code>feature/*</code></td><td>Hari–minggu</td><td>Bercabang dari develop, kembali ke develop</td></tr>
                    <tr><td><code>release/*</code></td><td>Hari</td><td>Pembekuan fitur; hanya perbaikan bug dan penyiapan rilis</td></tr>
                    <tr><td><code>hotfix/*</code></td><td>Jam</td><td>Dari main langsung, digabungkan ke main <em>dan</em> develop</td></tr>
                </tbody>
            </table>

            <div class="callout callout-warning">
                <strong>⚠️ Git Flow sering dipakai di tempat yang salah</strong>
                <p>Penulis aslinya sendiri kemudian menambahkan catatan bahwa model ini dirancang untuk perangkat lunak <strong>berversi eksplisit</strong> yang harus mendukung beberapa versi sekaligus — misalnya aplikasi desktop, pustaka, atau perangkat yang dipasang di tempat pelanggan. Untuk aplikasi web yang dirilis beberapa kali sehari, Git Flow menambahkan banyak upacara tanpa manfaat sepadan.</p>
                <p><strong>Pakai bila:</strong> ada rilis terjadwal, beberapa versi harus dipelihara bersamaan, ada tahap QA formal.<br>
                <strong>Hindari bila:</strong> Anda men-deploy aplikasi web setiap hari.</p>
            </div>

            <h3>2. GitHub Flow</h3>
            <div class="code-box">
                <pre>main   ●───●───●───●───●───●──   (selalu bisa di-deploy)
        \\     /     \\   /
fitur    ●───●       ●─●

Alurnya:
1. Bercabang dari main
2. Commit, push, buka pull request
3. CI berjalan, rekan tim me-review
4. Deploy dari branch untuk diuji (opsional)
5. Merge ke main -&gt; otomatis ter-deploy</pre>
            </div>

            <ul>
                <li>Hanya <strong>satu</strong> branch permanen: <code>main</code>.</li>
                <li>Aturan tunggal yang mutlak: <strong>main harus selalu bisa di-deploy</strong>.</li>
                <li>Branch fitur berumur pendek — idealnya kurang dari beberapa hari.</li>
            </ul>

            <p>Ini model yang paling banyak dipakai tim produk web saat ini: sederhana, cocok dengan pull request, dan langsung terhubung ke continuous deployment.</p>

            <h3>3. Trunk-Based Development</h3>
            <div class="code-box">
                <pre>main  ●─●─●─●─●─●─●─●─●─●─●─●──  (semua orang, setiap hari)
       \\/ \\/ \\/ \\/ \\/ \\/
      branch berumur beberapa JAM saja</pre>
            </div>

            <p>Setiap pengembang mengintegrasikan ke <code>main</code> <strong>setidaknya sekali sehari</strong>. Branch hidup dalam hitungan jam, bukan hari.</p>

            <div class="callout callout-info">
                <strong>💡 Bagaimana fitur besar dikerjakan tanpa branch panjang?</strong>
                <p>Jawabannya: <strong>feature flag</strong>. Kode yang belum selesai tetap digabungkan ke main, tetapi jalurnya dimatikan saat dijalankan.</p>
                <div class="code-box">
                    <pre>if (flag.aktif("checkout-versi-baru", pengguna)) {
    return checkoutBaru(pesanan);
}
return checkoutLama(pesanan);</pre>
                </div>
                <p>Ini <strong>memisahkan proses deploy dari proses rilis</strong>: kode bisa berada di produksi berhari-hari sebelum benar-benar dinyalakan, dan bisa dimatikan seketika tanpa perlu deploy ulang bila bermasalah.</p>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Feature flag adalah utang teknis yang wajib dilunasi</strong>
                <p>Flag yang tidak pernah dibersihkan menumpuk menjadi percabangan kode yang tak terkelola. Tetapkan tanggal kedaluwarsa saat membuat flag, dan hapus jalur kode lama segera setelah fitur baru terbukti stabil.</p>
            </div>

            <h3>4. Memilih Model yang Tepat</h3>
            <table class="tech-table">
                <thead><tr><th>Situasi</th><th>Model yang tepat</th></tr></thead>
                <tbody>
                    <tr><td>Aplikasi web SaaS, deploy harian, tim 3–15 orang</td><td><strong>GitHub Flow</strong></td></tr>
                    <tr><td>Deploy beberapa kali sehari, CI/CD sangat matang, tes otomatis kuat</td><td><strong>Trunk-Based</strong></td></tr>
                    <tr><td>Aplikasi mobile atau desktop dengan siklus rilis toko aplikasi</td><td><strong>Git Flow</strong> atau varian dengan branch rilis</td></tr>
                    <tr><td>Pustaka open source dengan banyak versi yang dipelihara</td><td><strong>Git Flow</strong> + branch pemeliharaan per versi mayor</td></tr>
                    <tr><td>Proyek satu orang</td><td>main saja, plus branch bila mengerjakan hal berisiko</td></tr>
                </tbody>
            </table>

            <h3>5. Melindungi Branch Utama</h3>
            <div class="code-box">
                <div class="code-box-header"><span>Aturan yang sebaiknya diaktifkan pada main</span></div>
                <pre>✓ Wajib melalui pull request sebelum merge
✓ Wajib mendapat minimal 1 persetujuan review
✓ Persetujuan lama dibatalkan bila ada commit baru
✓ Wajib lulus semua pemeriksaan CI (build, tes, lint, pemindaian keamanan)
✓ Wajib branch mutakhir terhadap main sebelum merge
✓ Wajib percakapan review terselesaikan
✓ Larang force push
✓ Larang penghapusan branch
✓ Wajib commit bertanda tangan (untuk lingkungan yang diatur ketat)</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>CODEOWNERS — review otomatis oleh pemilik area</span></div>
                <pre># .github/CODEOWNERS
*                     @tim-inti
/src/pembayaran/**    @tim-pembayaran
/infra/**             @tim-platform
*.sql                 @tim-basis-data</pre>
            </div>

            <h3>6. Tag dan Versi Semantik</h3>
            <div class="code-box">
                <pre># Tag beranotasi -- selalu pakai ini untuk rilis,
# karena menyimpan pengarang, tanggal, dan pesan
git tag -a v2.4.0 -m "Rilis 2.4.0 - checkout cepat"

git tag                    # daftar semua tag
git show v2.4.0
git push origin v2.4.0
git push origin --tags

# Deskripsi versi dari tag terdekat -- berguna untuk menandai build
git describe --tags
# =&gt; v2.4.0-12-g4a1de8f  (12 commit setelah v2.4.0)</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Semantic Versioning: MAYOR.MINOR.PATCH</strong>
                <ul>
                    <li><strong>MAYOR</strong> — ada perubahan yang merusak kompatibilitas.</li>
                    <li><strong>MINOR</strong> — fitur baru, tetap kompatibel ke belakang.</li>
                    <li><strong>PATCH</strong> — perbaikan bug, tetap kompatibel.</li>
                </ul>
                <p>Bila Anda memakai Conventional Commits, alat seperti <code>semantic-release</code> dapat menentukan nomor versi, membuat changelog, dan memasang tag secara otomatis di dalam pipeline CI — tanpa keputusan manual.</p>
            </div>
        `,
        sampleCommands: [
            "git tag -a v2.4.0 -m 'Rilis 2.4.0'",
            "git describe --tags",
            "git push origin --tags",
            "git branch -r",
            "git log --oneline --graph --all"
        ],
        quiz: [
            {
                question: "Dalam situasi apa Git Flow merupakan pilihan yang TEPAT?",
                options: [
                    "Aplikasi web SaaS yang di-deploy beberapa kali sehari",
                    "Perangkat lunak berversi eksplisit dengan rilis terjadwal dan beberapa versi yang harus dipelihara bersamaan, misalnya aplikasi desktop atau pustaka",
                    "Proyek pribadi satu orang",
                    "Semua jenis proyek tanpa kecuali"
                ],
                answer: 1,
                explanation: "Git Flow dirancang untuk produk dengan siklus rilis eksplisit dan kebutuhan memelihara beberapa versi sekaligus. Untuk aplikasi web yang terus-menerus di-deploy, branch develop dan release justru menambah upacara tanpa memberi manfaat sepadan."
            },
            {
                question: "Bagaimana Trunk-Based Development memungkinkan fitur besar dikerjakan tanpa branch berumur panjang?",
                options: [
                    "Dengan melarang pengembangan fitur besar",
                    "Dengan feature flag: kode yang belum selesai tetap digabung ke main namun jalurnya dimatikan saat dijalankan",
                    "Dengan menunda semua commit sampai fitur selesai",
                    "Dengan menyimpan kode di repositori terpisah"
                ],
                answer: 1,
                explanation: "Feature flag memisahkan deploy dari rilis. Kode yang belum siap tetap terintegrasi setiap hari sehingga tidak menyimpang jauh dari main, tetapi tidak aktif sampai flag-nya dinyalakan — dan bisa dimatikan seketika tanpa deploy ulang."
            },
            {
                question: "Mengapa tag beranotasi (git tag -a) lebih dianjurkan daripada tag ringan untuk menandai rilis?",
                options: [
                    "Karena tag beranotasi lebih cepat dibuat",
                    "Karena tag beranotasi adalah objek Git penuh yang menyimpan pengarang, tanggal, dan pesan, serta bisa ditandatangani",
                    "Karena tag ringan tidak bisa dipush ke server",
                    "Karena tag beranotasi otomatis menaikkan nomor versi"
                ],
                answer: 1,
                explanation: "Tag ringan hanyalah penunjuk ke sebuah commit tanpa metadata. Tag beranotasi disimpan sebagai objek tersendiri lengkap dengan pengarang, waktu, pesan rilis, dan dapat ditandatangani secara kriptografis — informasi yang penting untuk audit rilis."
            }
        ]
    },
    {
        id: 6,
        title: "06. Git Tingkat Lanjut - Stash, Worktree, Submodule & Hooks",
        category: "Git Workflow",
        videoId: "8JJ101D3knE",
        duration: "19:40",
        desc: "Perkakas Git yang jarang diajarkan tapi sangat menolong: menyimpan pekerjaan sementara, membuka beberapa branch sekaligus, mengelola repositori bersarang, dan otomatisasi lewat hooks.",
        summary: "Stash menyimpan perubahan yang belum selesai agar working directory bersih. Worktree memungkinkan beberapa branch dibuka bersamaan di direktori berbeda tanpa clone ulang. Submodule menyematkan repositori lain pada commit tertentu, sedangkan subtree menyalin isinya. Hooks menjalankan skrip otomatis pada peristiwa Git, dan pre-commit adalah tempat ideal untuk linting serta pencegahan kebocoran rahasia.",
        theory: `
            <h3>1. Stash — Menyimpan Pekerjaan Sementara</h3>
            <div class="code-box">
                <pre># Simpan perubahan dan bersihkan working directory
git stash push -m "eksperimen tata letak keranjang"

# Sertakan berkas yang belum dilacak Git
git stash push -u -m "termasuk berkas baru"

# Simpan hanya berkas tertentu
git stash push -m "hanya css" src/gaya.css

git stash list
# stash@{0}: On fitur: eksperimen tata letak keranjang
# stash@{1}: On main: perbaikan cepat

git stash show -p stash@{0}    # lihat isinya

git stash pop                  # terapkan dan HAPUS dari daftar
git stash apply stash@{1}      # terapkan tapi TETAP simpan
git stash drop stash@{0}
git stash clear                # hapus semua -- hati-hati

# Membuat branch langsung dari stash
git stash branch fitur/eksperimen stash@{0}</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Stash mudah terlupakan</strong>
                <p>Stash tidak muncul di <code>git status</code> maupun <code>git log</code>. Pekerjaan yang di-stash berbulan-bulan lalu sering terlupakan sepenuhnya. Selalu beri pesan yang jelas dengan <code>-m</code>, dan untuk pekerjaan yang serius <strong>lebih baik buat branch</strong> daripada mengandalkan stash.</p>
            </div>

            <h3>2. Worktree — Beberapa Branch Sekaligus</h3>
            <p>Masalah klasik: Anda sedang di tengah pekerjaan, lalu ada bug produksi yang harus segera diperbaiki. Alih-alih stash lalu berpindah branch, buka saja direktori kerja kedua.</p>

            <div class="code-box">
                <pre># Buat direktori kerja baru untuk branch hotfix
git worktree add ../proyek-hotfix -b hotfix/pembayaran-gagal

# Sekarang ada dua direktori dari SATU repositori:
#   ~/proyek          -&gt; branch fitur/keranjang
#   ~/proyek-hotfix   -&gt; branch hotfix/pembayaran-gagal

git worktree list
git worktree remove ../proyek-hotfix
git worktree prune            # bersihkan catatan yang sudah usang</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Kenapa worktree lebih baik daripada clone kedua</strong>
                <p>Semua worktree berbagi satu direktori <code>.git</code> yang sama, sehingga tidak ada objek yang digandakan dan tidak perlu <code>fetch</code> dua kali. Ini juga sangat berguna saat perlu membandingkan dua versi berdampingan, atau menjalankan uji panjang di satu branch sambil terus bekerja di branch lain.</p>
            </div>

            <h3>3. Submodule — Repositori di Dalam Repositori</h3>
            <div class="code-box">
                <pre>git submodule add https://github.com/org/pustaka-bersama.git vendor/pustaka

# Meng-clone proyek yang punya submodule
git clone --recurse-submodules https://github.com/org/proyek.git

# Bila terlanjur clone biasa
git submodule update --init --recursive

# Memperbarui submodule ke commit terbaru upstream
git submodule update --remote vendor/pustaka
git add vendor/pustaka
git commit -m "chore: naikkan versi pustaka-bersama"

git submodule status</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Submodule adalah sumber frustrasi yang terkenal</strong>
                <p>Repositori induk hanya mencatat <strong>satu hash commit</strong> dari submodule, bukan branch. Akibatnya: orang lupa <code>--recurse-submodules</code> saat clone dan mendapat direktori kosong; submodule sering berada dalam keadaan <em>detached HEAD</em>; dan perubahan di submodule harus di-commit dan dipush secara terpisah <em>sebelum</em> commit di repositori induk, kalau tidak rekan tim akan mendapat referensi ke commit yang tidak ada.</p>
                <p><strong>Alternatif yang biasanya lebih baik:</strong> publikasikan pustaka bersama sebagai paket berversi (npm, Go module, PyPI) dan pakai manajer dependensi biasa. Pertimbangkan submodule hanya bila Anda benar-benar butuh menyematkan repositori pada commit tertentu.</p>
            </div>

            <h3>4. Subtree — Alternatif yang Lebih Ramah</h3>
            <div class="code-box">
                <pre># Menyalin isi repositori lain ke sebuah direktori
git subtree add --prefix=vendor/pustaka \\
  https://github.com/org/pustaka-bersama.git main --squash

# Menarik pembaruan
git subtree pull --prefix=vendor/pustaka \\
  https://github.com/org/pustaka-bersama.git main --squash</pre>
            </div>
            <p>Berbeda dari submodule, isi subtree benar-benar berada di dalam repositori Anda. Orang yang meng-clone tidak perlu tahu apa pun tentang subtree — semuanya langsung ada.</p>

            <h3>5. Hooks — Otomatisasi pada Peristiwa Git</h3>
            <table class="tech-table">
                <thead><tr><th>Hook</th><th>Kapan berjalan</th><th>Kegunaan umum</th></tr></thead>
                <tbody>
                    <tr><td><code>pre-commit</code></td><td>Sebelum commit dibuat</td><td>Lint, format, pindai rahasia</td></tr>
                    <tr><td><code>commit-msg</code></td><td>Setelah pesan ditulis</td><td>Validasi format Conventional Commits</td></tr>
                    <tr><td><code>pre-push</code></td><td>Sebelum push</td><td>Jalankan unit test</td></tr>
                    <tr><td><code>post-merge</code></td><td>Setelah merge</td><td>Jalankan <code>npm install</code> bila lockfile berubah</td></tr>
                    <tr><td><code>pre-receive</code></td><td>Di server, sebelum menerima</td><td>Tolak push yang melanggar kebijakan</td></tr>
                </tbody>
            </table>

            <div class="code-box">
                <div class="code-box-header"><span>.git/hooks/pre-commit</span></div>
                <pre>#!/bin/sh
set -e

# Tolak commit yang mengandung penanda konflik
if git diff --cached | grep -q "^+&lt;&lt;&lt;&lt;&lt;&lt;&lt;"; then
  echo "❌ Ada penanda konflik yang belum dibereskan."
  exit 1
fi

# Tolak commit yang mengandung debugger
if git diff --cached --name-only | grep -E '\\.(js|ts)$' | xargs -r grep -l "debugger"; then
  echo "❌ Hapus dulu pernyataan debugger."
  exit 1
fi

npm run lint
echo "✅ Pemeriksaan pre-commit lolos."</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Hook di <code>.git/hooks</code> tidak ikut ter-clone</strong>
                <p>Direktori <code>.git</code> bersifat lokal, sehingga hook yang Anda buat di sana tidak akan dimiliki rekan tim. Agar hook berlaku untuk semua orang, simpan skripnya di dalam repositori dan arahkan Git ke sana:</p>
                <div class="code-box">
                    <pre>git config core.hooksPath .githooks</pre>
                </div>
                <p>Atau pakai alat pengelola seperti <strong>pre-commit</strong> (Python), <strong>husky</strong> + <strong>lint-staged</strong> (Node.js), atau <strong>lefthook</strong> yang memasang hook otomatis saat instalasi dependensi.</p>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Hook lokal bukan mekanisme keamanan</strong>
                <p>Siapa pun bisa melewati hook dengan <code>git commit --no-verify</code>. Hook adalah alat bantu kenyamanan, bukan penegakan aturan. Aturan yang benar-benar wajib harus ditegakkan di <strong>pipeline CI</strong> dan <strong>branch protection</strong> di sisi server, yang tidak bisa dilewati siapa pun.</p>
            </div>

            <h3>6. Menjaga Rahasia Tidak Masuk Repositori</h3>
            <div class="code-box">
                <div class="code-box-header"><span>.gitignore</span></div>
                <pre>.env
.env.*
!.env.example
*.pem
*.key
node_modules/
dist/
__pycache__/
.DS_Store</pre>
            </div>

            <div class="code-box">
                <pre># Berkas terlanjur dilacak padahal sudah masuk .gitignore?
git rm --cached .env
git commit -m "chore: berhenti melacak berkas .env"

# Memeriksa mengapa sebuah berkas diabaikan
git check-ignore -v config/rahasia.json</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Rahasia yang terlanjur dipush harus dianggap bocor</strong>
                <p>Menghapusnya di commit berikutnya <strong>tidak cukup</strong> — nilainya tetap ada di riwayat dan bisa dibaca siapa pun. Langkah yang benar, berurutan: <strong>(1) segera cabut dan ganti kredensial tersebut</strong> — ini yang paling penting dan tidak boleh ditunda; (2) baru bersihkan riwayat dengan <code>git filter-repo</code> atau BFG Repo-Cleaner; (3) koordinasikan dengan tim karena riwayat akan ditulis ulang.</p>
            </div>
        `,
        sampleCommands: [
            "git stash push -m 'eksperimen'",
            "git stash list",
            "git worktree add ../proyek-hotfix -b hotfix/bug",
            "git worktree list",
            "git config core.hooksPath .githooks",
            "git check-ignore -v .env"
        ],
        quiz: [
            {
                question: "Apa keunggulan git worktree dibanding melakukan clone kedua dari repositori yang sama?",
                options: [
                    "Worktree bekerja tanpa koneksi internet",
                    "Semua worktree berbagi satu direktori .git, sehingga tidak ada objek yang digandakan dan tidak perlu fetch berulang",
                    "Worktree otomatis melakukan merge antar branch",
                    "Worktree tidak memerlukan commit"
                ],
                answer: 1,
                explanation: "Worktree membuat direktori kerja tambahan yang menumpang pada satu basis data objek yang sama. Ini hemat ruang, menghindari sinkronisasi ganda, dan memudahkan membuka beberapa branch berdampingan tanpa perlu stash."
            },
            {
                question: "Mengapa hook di .git/hooks tidak bisa diandalkan untuk menegakkan aturan tim?",
                options: [
                    "Karena hook hanya berjalan di sistem operasi Linux",
                    "Karena direktori .git tidak ikut ter-clone sehingga hook tidak sampai ke rekan tim, dan siapa pun bisa melewatinya dengan --no-verify",
                    "Karena hook memerlukan lisensi berbayar",
                    "Karena hook hanya berjalan sekali seumur repositori"
                ],
                answer: 1,
                explanation: "Isi .git bersifat lokal dan tidak ikut didistribusikan, serta commit --no-verify melewati hook sepenuhnya. Karena itu hook berguna sebagai alat bantu kenyamanan, sementara penegakan aturan yang sesungguhnya harus berada di pipeline CI dan branch protection sisi server."
            },
            {
                question: "Sebuah berkas .env berisi kredensial produksi terlanjur ter-commit dan ter-push. Apa langkah PERTAMA yang harus dilakukan?",
                options: [
                    "Menghapus berkas tersebut pada commit berikutnya",
                    "Segera mencabut dan mengganti kredensial tersebut, karena nilainya sudah harus dianggap bocor",
                    "Menambahkan .env ke .gitignore lalu melanjutkan pekerjaan",
                    "Menjadikan repositori bersifat privat"
                ],
                answer: 1,
                explanation: "Begitu rahasia masuk ke riwayat yang sudah dipush, ia bisa saja sudah tersalin ke clone, cache, atau pemindai otomatis. Membersihkan riwayat tetap perlu, tetapi tindakan pertama yang menentukan adalah mencabut kredensial agar nilai yang bocor tidak lagi berguna."
            }
        ]
    },
    {
        id: 7,
        title: "07. CI/CD Explained: Continuous Integration, Delivery & Deployment",
        category: "Konsep CI/CD",
        videoId: "AknbizcLq4w",
        duration: "14:15",
        desc: "Perbedaan Continuous Integration, Continuous Delivery, dan Continuous Deployment, strategi release (Blue-Green, Canary, Rolling Update).",
        summary: "Memahami spektrum CI vs CD (Delivery) vs CD (Deployment) serta strategi rilis zero-downtime seperti Blue-Green dan Canary Deployment.",
        theory: `
            <h3>1. Spektrum Perbedaan CI, CD (Delivery), dan CD (Deployment)</h3>
            <ul>
                <li><strong>Continuous Integration (CI):</strong> Otomatisasi Build & Test setiap kali ada perubahan kode. Output: Artefak yang tervalidasi.</li>
                <li><strong>Continuous Delivery (CD):</strong> Otomatisasi pengujian dan rilis artefak hingga lingkungan Staging/Pre-production. Deployment ke Production membutuhkan <strong>Persetujuan Manual (Manual Approval Gate)</strong>.</li>
                <li><strong>Continuous Deployment (CD):</strong> Otomatisasi Penuh tanpa sentuhan manusia. Setiap commit yang lolos seluruh test di CI akan <strong>langsung ter-deploy otomatis ke server Production</strong>.</li>
            </ul>

            <h3>2. Strategi Deployment Zero-Downtime</h3>
            <ul>
                <li><strong>Rolling Update:</strong> Mengganti Pod/Instance lama dengan versi baru satu per satu secara bertahap.</li>
                <li><strong>Blue-Green Deployment:</strong> Menyediakan 2 lingkungan identik (Blue=Production Lama, Green=Production Baru). Trafik router diubah secara instant dari Blue ke Green.</li>
                <li><strong>Canary Deployment:</strong> Mengarahkan sebagian kecil trafik user (misal 5%) ke versi baru terlebih dahulu untuk memantau error log sebelum me-release 100%.</li>
            </ul>
        `,
        sampleCommands: [
            "kubectl rollout status deployment/myapp",
            "kubectl set image deployment/myapp myapp=myapp:v2.0",
            "kubectl rollout undo deployment/myapp"
        ],
        quiz: [
            {
                question: "Apakah perbedaan mendasar antara Continuous Delivery dan Continuous Deployment?",
                options: [
                    "Continuous Delivery memerlukan persetujuan manual (Manual Approval) sebelum deploy ke Production, sedangkan Continuous Deployment berjalan otomatis penuh",
                    "Continuous Delivery menggunakan Docker, Continuous Deployment tidak",
                    "Continuous Deployment hanya untuk database",
                    "Keduanya persis sama tanpa beda"
                ],
                answer: 0,
                explanation: "Continuous Delivery menyiap rilis namun butuh approval manual untuk prod, sedangkan Deployment rilis otomatis penuh."
            },
            {
                question: "Strategi rilis manakah yang mengarahkan sebagian kecil trafik user (misal 5%) ke versi aplikasi baru untuk pengujian aman?",
                options: ["Canary Deployment", "Blue-Green Deployment", "Recreate Strategy", "Hard Reset"],
                answer: 0,
                explanation: "Canary Deployment me-release ke sebagian kecil pengguna terlebih dahulu untuk mitigasi risiko."
            }
        ]
    },
    {
        id: 8,
        title: "08. The ONLY Continuous Integration (CI) Tutorial You Need",
        category: "CI Fundamentals",
        videoId: "MIWH2CpVyXs",
        duration: "21:07",
        desc: "Prinsip inti Continuous Integration, Automated Testing, Static Code Analysis (Qodana/SonarQube), dan Best Practices CI.",
        summary: "Continuous Integration (CI) memprioritaskan integrasi kode berulang ke repositori utama yang divalidasi oleh build & pengujian otomatis.",
        theory: `
            <h3>1. Pilar Inti Continuous Integration (CI)</h3>
            <p><strong>Continuous Integration (CI)</strong> adalah praktik pengembang software untuk sering menggabungkan perubahan kode ke dalam repositori utama (main branch), yang mana setiap integrasi divalidasi secara otomatis oleh:</p>

            <ol>
                <li><strong>Automated Compilation / Build:</strong> Memastikan kode dapat dikompilasi tanpa syntax error.</li>
                <li><strong>Automated Testing:</strong> Mengeksekusi Unit Test, Integration Test, dan Regression Test. Jika 1 test gagal, build ditandai <em>RED (Failed)</em>.</li>
                <li><strong>Static Code Analysis:</strong> Memeriksa kualitas kode (Code Smells, Linter, Duplikasi) menggunakan tool seperti JetBrains Qodana atau SonarQube.</li>
            </ol>

            <div class="callout callout-tip">
                <strong>🔥 Golden Rule of CI:</strong><br>
                <em>"Never break the main build!"</em> Jika pipeline CI utama gagal (merah), prioritas utama seluruh tim adalah memperbaiki build tersebut sebelum membuat fitur baru.
            </div>
        `,
        sampleCommands: [
            "npm test -- --coverage",
            "qodana scan",
            "git rebase main"
        ],
        quiz: [
            {
                question: "Apakah aturan utama (Golden Rule) bagi tim pengembang dalam menerapkan Continuous Integration?",
                options: [
                    "Selalu menjaga agar build cabang utama (main) tidak rusak/gagal",
                    "Membuat pull request sebulan sekali",
                    "Menghindari penggunaan automated test",
                    "Mengabaikan linter warning"
                ],
                answer: 0,
                explanation: "Aturan utama CI adalah menjaga agar cabang utama selalu dalam kondisi hijau (passing)."
            },
            {
                question: "Jenis pengujian apakah yang divalidasi paling cepat dalam alur CI untuk menguji fungsi individual secara terisolasi?",
                options: ["Unit Testing", "User Acceptance Testing (UAT)", "Manual Penetration Testing", "Load Testing"],
                answer: 0,
                explanation: "Unit Testing mengeksekusi fungsi terisolasi dengan sangat cepat."
            }
        ]
    },
    {
        id: 9,
        title: "09. GitHub Actions Tutorial - Basic Concepts & CI/CD Pipeline",
        category: "GitHub Actions",
        videoId: "R8_veQiYBjI",
        duration: "25:37",
        desc: "Konsep dasar GitHub Actions, Workflows, Jobs, Steps, Actions, Event Triggers, dan pembuatan pipeline CI/CD pertama dengan Docker.",
        summary: "GitHub Actions adalah platform otomatisasi & CI/CD yang terintegrasi langsung di repositori GitHub. Menggunakan berkas YAML di folder .github/workflows untuk mengendalikan build, test, dan deployment.",
        theory: `
            <h3>1. Apa itu GitHub Actions?</h3>
            <p><strong>GitHub Actions</strong> adalah platform <em>Continuous Integration & Continuous Deployment (CI/CD)</em> native bawaan GitHub yang memungkinkan Anda mengotomatiskan alur kerja siklus hidup perangkat lunak (build, test, publish, deploy) secara otomatis saat terjadi event di repositori (seperti <code>push</code>, <code>pull_request</code>, atau pembuatan <code>release</code>).</p>

            <div class="callout callout-info">
                <strong>💡 Arsitektur Utama GitHub Actions:</strong>
                <ul>
                    <li><strong>Workflow:</strong> Proses otomatis terkonfigurasi yang didefinisikan dalam berkas <code>.github/workflows/*.yml</code>.</li>
                    <li><strong>Event:</strong> Pemicu yang memulai alur kerja workflow (misal: <code>on: [push, pull_request]</code>).</li>
                    <li><strong>Job:</strong> Sekumpulan langkah (steps) yang dieksekusi pada runner (mesin Virtual Machine/Container) yang sama.</li>
                    <li><strong>Step:</strong> Tugas individual berupa eksekusi skrip shell (<code>run: ...</code>) atau aksi terpaket (<code>uses: ...</code>).</li>
                    <li><strong>Runner:</strong> Mesin VM server (seperti <code>ubuntu-latest</code>, <code>windows-latest</code>, atau self-hosted) tempat job dijalankan.</li>
                </ul>
            </div>

            <h3>2. Contoh Konfigurasi Workflow YAML Pertama</h3>
            <p>Simpan konfigurasi berikut di dalam berkas <code>.github/workflows/ci-cd.yml</code> pada repositori Anda:</p>

            <div class="code-container">
                <div class="code-header"><span>.github/workflows/ci-cd.yml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>name: Node.js CI & Docker Build Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v5

      - name: Setup Node.js Environment
        uses: actions/setup-node@v5
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm test

      - name: Build Production Bundle
        run: npm run build

  build-docker-image:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v5

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: myuser/myapp:latest</code></pre>
            </div>

            <h3>3. Best Practices GitHub Actions</h3>
            <ul>
                <li>Gunakan <code>secrets.SECRET_NAME</code> untuk menyimpan API key, password, dan token secara aman (Settings -> Secrets and variables).</li>
                <li>Manfaatkan fitur <strong>Caching</strong> (misal <code>actions/setup-node</code> dengan <code>cache: 'npm'</code>) untuk mempercepat durasi build.</li>
                <li>Gunakan <code>needs: [job_name]</code> untuk mengatur ketergantungan urutan eksekusi antar job.</li>
            </ul>
        `,
        sampleCommands: [
            "gh workflow run ci-cd.yml",
            "gh run list",
            "gh run view --log",
            "git push origin main"
        ],
        quiz: [
            {
                question: "Di mana lokasi direktori wajib untuk menyimpan berkas YAML workflow GitHub Actions?",
                options: [
                    ".github/actions/",
                    ".github/workflows/",
                    "ci-cd/pipelines/",
                    "config/github/"
                ],
                answer: 1,
                explanation: "GitHub Actions secara khusus membaca berkas workflow YAML di folder .github/workflows/."
            },
            {
                question: "Keyword apakah yang digunakan untuk mengatur agar Job B baru berjalan setelah Job A selesai?",
                options: ["depends_on", "after", "needs", "require"],
                answer: 2,
                explanation: "Keyword 'needs:' digunakan untuk mendefinisikan ketergantungan antar job di GitHub Actions."
            }
        ]
    },
    {
        id: 10,
        title: "10. GitLab CI/CD Tutorial for Beginners [Crash Course]",
        category: "GitLab CI/CD",
        videoId: "qP8kir2GUgo",
        duration: "36:29",
        desc: "Konfigurasi .gitlab-ci.yml, GitLab Runners, Stages, Jobs, Artifacts, Caching, dan environment deployment.",
        summary: "GitLab CI/CD dikonfigurasi melalui file .gitlab-ci.yml di root repositori. Mendukung Runner multi-platform, pengelompokan Stages sekuensial, dan Job paralel.",
        theory: `
            <h3>1. Konsep Dasar GitLab CI/CD</h3>
            <p>GitLab CI/CD secara otomatis membaca berkas <code>.gitlab-ci.yml</code>. Komponen utamanya adalah:</p>
            <ul>
                <li><strong>Stages:</strong> Menentukan urutan fase eksekusi (misal: <code>build</code> -> <code>test</code> -> <code>deploy</code>). Job dalam stage yang sama berjalan secara paralel.</li>
                <li><strong>Jobs:</strong> Tugas spesifik yang dijalankan oleh GitLab Runner.</li>
                <li><strong>GitLab Runner:</strong> Proses agen yang dieksekusi di server lokal/cloud untuk menjalankan instruksi job.</li>
                <li><strong>Artifacts:</strong> File/biner yang dihasilkan job (misal: file <code>dist/</code>) yang diteruskan ke stage berikutnya.</li>
            </ul>

            <h3>2. Contoh Berkas .gitlab-ci.yml</h3>
            <div class="code-container">
                <div class="code-header"><span>.gitlab-ci.yml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>image: node:22-alpine

stages:
  - build
  - test
  - deploy

cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - .npm/

before_script:
  - npm ci --cache .npm --prefer-offline

build_job:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

unit_test_job:
  stage: test
  script:
    - npm test

deploy_staging:
  stage: deploy
  script:
    - echo "Deploying artifacts to Staging server..."
  environment:
    name: staging
    url: https://staging.myapp.com
  only:
    - main</code></pre>
            </div>
        `,
        sampleCommands: [
            "gitlab-runner status",
            "gitlab-runner exec docker unit_test_job",
            "git push gitlab main"
        ],
        quiz: [
            {
                question: "Apakah nama berkas konfigurasi resmi yang digunakan oleh GitLab CI/CD?",
                options: [
                    "gitlab-pipeline.yml",
                    ".gitlab-ci.yml",
                    ".github/workflows/ci.yml",
                    "Jenkinsfile"
                ],
                answer: 1,
                explanation: "GitLab CI/CD secara otomatis membaca berkas .gitlab-ci.yml di root repositori."
            },
            {
                question: "Fitur apakah di GitLab CI/CD yang digunakan untuk menyimpan biner hasil kompilasi agar dapat digunakan oleh stage berikutnya?",
                options: ["Cache", "Artifacts", "Variables", "Environment"],
                answer: 1,
                explanation: "Artifacts digunakan untuk meneruskan file antar stage dalam pipeline."
            }
        ]
    },
    {
        id: 11,
        title: "11. Complete Jenkins Pipeline Tutorial & Jenkinsfile Explained",
        category: "Jenkins",
        videoId: "7KCS70sCoK0",
        duration: "08:23",
        desc: "Pemahaman mendalam tentang Jenkins Pipeline, deklaratif vs skrip Jenkinsfile, Stages, Steps, dan Agent allocation.",
        summary: "Jenkins adalah salah satu server CI/CD open-source paling populer. Jenkinsfile menyediakan sintaksis Declarative dan Scripted berbasis Groovy untuk mendefinisikan seluruh tahap otomatisasi.",
        theory: `
            <h3>1. Declarative vs Scripted Pipeline</h3>
            <p>Dalam Jenkins, terdapat dua gaya penulisan <code>Jenkinsfile</code>:</p>
            <ul>
                <li><strong>Declarative Pipeline:</strong> Format yang disarankan untuk pemula hingga advanced. Memiliki struktur kaku yang rapi, mudah dibaca, dan dilengkapi pengecekan sintaksis ketat.</li>
                <li><strong>Scripted Pipeline:</strong> Menggunakan sintaksis Groovy penuh tanpa batasan struktur kaku. Sangat fleksibel untuk logika logika kompleks tetapi lebih berisiko error jika tidak dikelola dengan baik.</li>
            </ul>

            <h3>2. Anatomy Berkas Declarative Jenkinsfile</h3>
            <div class="code-container">
                <div class="code-header"><span>Jenkinsfile (Declarative)</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>pipeline {
    agent any

    environment {
        APP_NAME = 'my-payment-service'
        BUILD_VERSION = "1.0.\${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Fetching code for \${APP_NAME} version \${BUILD_VERSION}..."
                git branch: 'main', url: 'https://github.com/myorg/payment-service.git'
            }
        }

        stage('Compile & Test') {
            steps {
                echo 'Compiling Java Application...'
                sh './gradlew test'
            }
        }

        stage('Package') {
            steps {
                sh './gradlew bootJar'
            }
        }

        stage('Deploy Staging') {
            steps {
                echo 'Deploying to Staging Environment...'
                sh 'ansible-playbook -i staging-hosts deploy.yml'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}</code></pre>
            </div>
        `,
        sampleCommands: [
            "jenkins-cli build my-pipeline",
            "jenkins-cli console my-pipeline 1",
            "git commit -m 'Add Declarative Jenkinsfile'"
        ],
        quiz: [
            {
                question: "Bahasa dasar apakah yang menjadi fondasi penulisan Jenkinsfile di Jenkins?",
                options: ["Python", "Groovy", "Ruby", "Bash"],
                answer: 1,
                explanation: "Jenkinsfile dibangun di atas sintaksis Groovy."
            },
            {
                question: "Blok apakah dalam Declarative Jenkinsfile yang bertugas mengeksekusi langkah pembersihan atau notifikasi setelah seluruh stages selesai?",
                options: ["stages", "agent", "post", "environment"],
                answer: 2,
                explanation: "Blok 'post' mengeksekusi instruksi seperti always, success, atau failure setelah stages selesai."
            }
        ]
    },
    {
        id: 12,
        title: "12. Run Jenkins in Docker Container (Part 1/4)",
        category: "Jenkins",
        videoId: "pMO26j2OUME",
        duration: "13:44",
        desc: "Cara menginstal dan menjalankan Jenkins master & agent dalam kontainer Docker, persistensi data dengan volume, dan plugin setup.",
        summary: "Menjalankan Jenkins di dalam Docker mempermudah lingkungan isolasi. Menggunakan volume Docker untuk persistensi data /var/jenkins_home dan menghubungkan Docker socket untuk Docker-in-Docker.",
        theory: `
            <h3>1. Mengapa Menjalankan Jenkins di Docker?</h3>
            <p>Menginstal Jenkins secara langsung di host OS sering menyebabkan masalah versi Java, dependency conflict, dan kesulitan migrasi. Dengan Docker, seluruh runtime Jenkins diisolasi dalam container portabel.</p>

            <h3>2. Perintah Docker Run untuk Jenkins Server</h3>
            <div class="code-container">
                <div class="code-header"><span>Bash / Terminal</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># 1. Buat Docker Volume untuk persistensi data Jenkins
docker volume create jenkins_data

# 2. Jalankan Jenkins Container dengan port 8080 (Web UI) & 50000 (Agent)
docker run -d \\
  --name jenkins-server \\
  -p 8080:8080 \\
  -p 50000:50000 \\
  -v jenkins_data:/var/jenkins_home \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  jenkins/jenkins:lts-jdk21

# 3. Ambil Initial Admin Password untuk Unlock Jenkins
docker exec jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword</code></pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Catatan Docker-in-Docker (DinD):</strong><br>
                Dengan me-mount <code>/var/run/docker.sock</code> dari host ke dalam container Jenkins, pipeline Jenkins dapat mengeksekusi perintah <code>docker build</code> dan <code>docker run</code> langsung menggunakan Docker Engine milik Host OS.
            </div>
        `,
        sampleCommands: [
            "docker run -d -p 8080:8080 jenkins/jenkins:lts-jdk21",
            "docker exec jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword",
            "docker logs -f jenkins-server"
        ],
        quiz: [
            {
                question: "Direktori manakah di dalam container Jenkins yang harus di-mount ke Volume Docker agar data pipeline dan plugin tidak hilang saat container di-restart?",
                options: [
                    "/etc/jenkins",
                    "/var/jenkins_home",
                    "/usr/share/jenkins",
                    "/root/.jenkins"
                ],
                answer: 1,
                explanation: "Folder /var/jenkins_home adalah tempat penyimpanan seluruh data, job, plugin, dan user config Jenkins."
            },
            {
                question: "Port berapakah yang digunakan secara default untuk mengakses Web Dashboard UI Jenkins?",
                options: ["8080", "50000", "3000", "9000"],
                answer: 0,
                explanation: "Port 8080 adalah HTTP port default untuk Jenkins Web UI."
            }
        ]
    },
    {
        id: 13,
        title: "13. Create Multibranch Pipeline with Git & Jenkins (Part 2/4)",
        category: "Jenkins",
        videoId: "tuxO7ZXplRE",
        duration: "10:24",
        desc: "Konfigurasi Multibranch Pipeline di Jenkins, deteksi otomatis cabang Git, Pull Request validation, dan Credentials Management.",
        summary: "Multibranch Pipeline secara otomatis membuat job build terpisah untuk setiap cabang (branch) dan Pull Request yang memiliki Jenkinsfile di repositori Git Anda.",
        theory: `
            <h3>1. Konsep Multibranch Pipeline</h3>
            <p>Daripada membuat job manual untuk cabang <code>main</code>, <code>staging</code>, dan <code>feature/*</code>, <strong>Multibranch Pipeline</strong> secara otomatis memindai (scan) repositori Git dan membuat build pipeline independen secara otomatis setiap kali cabang baru dibuat.</p>

            <h3>2. Alur Integrasi Multibranch Pipeline</h3>
            <ol>
                <li>Developer membuat cabang baru: <code>feature/login-page</code> dan menambahkan kode.</li>
                <li>Developer melakukan push ke GitHub/GitLab.</li>
                <li>Jenkins memindai repositori -> menemukan cabang <code>feature/login-page</code> yang berisi <code>Jenkinsfile</code>.</li>
                <li>Jenkins secara otomatis mengeksekusi build & test khusus untuk cabang tersebut tanpa mengganggu cabang <code>main</code>.</li>
            </ol>

            <div class="callout callout-tip">
                <strong>🔐 Credentials Management:</strong><br>
                Simpan token SSH Key, Username & Password Docker Hub, atau AWS Credentials di Jenkins Credentials Manager. Panggil credential tersebut secara aman di Jenkinsfile menggunakan fungsi <code>withCredentials()</code> atau <code>credentials('ID')</code>.
            </div>
        `,
        sampleCommands: [
            "git checkout -b feature/payment",
            "git push origin feature/payment",
            "jenkins-cli scan-multibranch-pipeline my-project"
        ],
        quiz: [
            {
                question: "Apa keuntungan utama menggunakan Multibranch Pipeline di Jenkins?",
                options: [
                    "Menghapus kebutuhan berkas Jenkinsfile",
                    "Secara otomatis mendeteksi cabang Git baru dan membuat job build terisolasi",
                    "Mempercepat kecepatan internet server",
                    "Menginstal Docker secara otomatis"
                ],
                answer: 1,
                explanation: "Multibranch Pipeline memindai repo Git dan membuat job build otomatis untuk setiap cabang."
            },
            {
                question: "Di manakah tempat paling aman untuk menyimpan password dan token rahasia di Jenkins?",
                options: [
                    "Ditulis langsung di Jenkinsfile",
                    "Disimpan dalam file teks biasa di repo",
                    "Jenkins Credentials Store",
                    "Dalam komentar kode"
                ],
                answer: 2,
                explanation: "Jenkins Credentials Store mengenskripsi token dan kunci rahasia agar aman dipanggil di pipeline."
            }
        ]
    },
    {
        id: 14,
        title: "14. Jenkinsfile & Environment Variables in Jenkins (Part 3/4)",
        category: "Jenkins",
        videoId: "MY1w7sWW5ms",
        duration: "07:58",
        desc: "Penggunaan variabel lingkungan (env vars), parameters, credentials binding, dan post actions pada Jenkinsfile.",
        summary: "Mengelola variabel terkonfigurasi di Jenkinsfile menggunakan blok `environment`, parameter interaktif `parameters`, serta pengikatan rahasia `withCredentials`.",
        theory: `
            <h3>1. Variabel Lingkungan Bawaan (Built-in Env Vars)</h3>
            <p>Jenkins menyediakan variabel sistem bawaan yang dapat langsung diakses di dalam pipeline:</p>
            <ul>
                <li><code>\${env.BUILD_NUMBER}</code>: Nomor urut build saat ini (misal: 42).</li>
                <li><code>\${env.BRANCH_NAME}</code>: Nama cabang Git yang sedang diproses.</li>
                <li><code>\${env.JOB_NAME}</code>: Nama job Jenkins.</li>
                <li><code>\${env.GIT_COMMIT}</code>: Hash SHA commit Git yang memicu build.</li>
            </ul>

            <h3>2. Parameterized Pipeline & Credentials Binding</h3>
            <div class="code-container">
                <div class="code-header"><span>Jenkinsfile Advanced Example</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Pilih Lingkungan Target Deployment')
        booleanParam(name: 'RUN_INTEGRATION_TESTS', defaultValue: true, description: 'Jalankan Integration Test?')
    }

    environment {
        DOCKER_REGISTRY = 'registry.hub.docker.com/myuser'
        DB_SECRET = credentials('postgres-production-cred')
    }

    stages {
        stage('Build & Deploy') {
            steps {
                echo "Deploying branch \${BRANCH_NAME} build #\${BUILD_NUMBER} to \${params.DEPLOY_ENV}..."
                
                withCredentials([usernamePassword(credentialsId: 'docker-hub-auth', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u \${USER} -p \${PASS}"
                }
            }
        }
    }
}</code></pre>
            </div>
        `,
        sampleCommands: [
            "jenkins-cli build my-pipeline -p DEPLOY_ENV=production",
            "git status"
        ],
        quiz: [
            {
                question: "Variabel lingkungan bawaan Jenkins apakah yang berisi nomor urut eksekusi build saat ini?",
                options: ["BUILD_ID", "BUILD_NUMBER", "JOB_INDEX", "RUN_COUNT"],
                answer: 1,
                explanation: "env.BUILD_NUMBER menyimpan nomor urut build saat ini."
            },
            {
                question: "Bagaimanakah cara mengakses nilai dari parameter interaktif bertipe choice bernama 'DEPLOY_ENV' di Jenkinsfile?",
                options: ["\${params.DEPLOY_ENV}", "\${choice.DEPLOY_ENV}", "\${env.DEPLOY_ENV}", "\${get(DEPLOY_ENV)}"],
                answer: 0,
                explanation: "Parameter interaktif diakses melalui objek params, yaitu \${params.DEPLOY_ENV}."
            }
        ]
    },
    {
        id: 15,
        title: "15. Trigger Jenkins Build Automatically via Webhooks (Part 4/4)",
        category: "Jenkins",
        videoId: "CmwTPxdx24Y",
        duration: "47:53",
        desc: "Mengirimkan Webhooks dari GitHub/GitLab ke Jenkins untuk otomatisasi build saat push commit atau merge request.",
        summary: "Webhooks memungkinkan GitHub/GitLab mengirimkan sinyal HTTP POST ke Jenkins secara instan begitu ada commit baru dipush, mengeliminasi kebutuhan polling berulang.",
        theory: `
            <h3>1. Konsep Kerja Webhooks CI/CD</h3>
            <p>Tanpa Webhooks, Jenkins harus memantau repositori Git dengan teknik <em>Polling SCM</em> (misal setiap 5 menit), yang tidak efisien dan menyebabkan penundaan (delay). Dengan <strong>Webhooks</strong>, GitHub akan secara aktif mengirimkan HTTP POST payload ke URL Jenkins begitu ada peristiwa <code>git push</code>.</p>

            <h3>2. Langkah Konfigurasi Webhook GitHub ke Jenkins</h3>
            <ol>
                <li>Pastikan server Jenkins memiliki IP/Domain Publik (atau gunakan tunnel seperti <code>ngrok http 8080</code> untuk pengujian lokal).</li>
                <li>Di Jenkins: Install plugin <code>GitHub Integration Plugin</code>.</li>
                <li>Di GitHub Repository -> Settings -> Webhooks -> Add Webhook.</li>
                <li>Payload URL: <code>http://&lt;JENKINS_URL&gt;/github-webhook/</code></li>
                <li>Content type: <code>application/json</code>.</li>
                <li>Select events: <em>Just the push event</em> atau <em>Pull requests</em>.</li>
            </ol>

            <div class="code-container">
                <div class="code-header"><span>Contoh Test Webhook Payload (HTTP POST Body)</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>{
  "ref": "refs/heads/main",
  "before": "0000000000000000000000000000000000000000",
  "after": "92f7a5b3a4c180901b239d1b092309101b023023",
  "repository": {
    "name": "payment-api",
    "full_name": "myorg/payment-api",
    "clone_url": "https://github.com/myorg/payment-api.git"
  },
  "pusher": {
    "name": "developer-eko"
  }
}</code></pre>
            </div>
        `,
        sampleCommands: [
            "ngrok http 8080",
            "curl -X POST http://localhost:8080/github-webhook/",
            "git push origin main"
        ],
        quiz: [
            {
                question: "Metode HTTP apakah yang digunakan oleh GitHub Webhooks saat mengirimkan pemberitahuan event ke Jenkins?",
                options: ["GET", "POST", "PUT", "PATCH"],
                answer: 1,
                explanation: "Webhooks mengirimkan HTTP POST request berisi JSON payload peristiwa ke server target."
            },
            {
                question: "Apa keuntungan utama menggunakan Webhook dibandingkan Polling SCM?",
                options: [
                    "Webhook memicu build secara instant realtime begitu ada push tanpa penundaan delay",
                    "Webhook mengompres ukuran repositori",
                    "Webhook menghapus kebutuhan password",
                    "Webhook membuat kode bebas dari bug"
                ],
                answer: 0,
                explanation: "Webhook berjalan secara real-time dan menghemat sumber daya server daripada polling berkala."
            }
        ]
    },
    {
        id: 16,
        title: "16. CI/CD with TeamCity - DevOps Tooling",
        category: "TeamCity",
        videoId: "zqi4fDF-S60",
        duration: "35:06",
        desc: "Pengenalan JetBrains TeamCity, arsitektur Build Server, Build Agents, Build Configuration, dan integrasi VCS.",
        summary: "TeamCity adalah server CI/CD enterprise buatan JetBrains. Menawarkan manajemen Build Agent yang canggih, Kotlin DSL untuk pipeline-as-code, dan pengujian paralel bawaan.",
        theory: `
            <h3>1. Arsitektur JetBrains TeamCity</h3>
            <p><strong>TeamCity</strong> terdiri dari dua komponen utama:</p>
            <ul>
                <li><strong>TeamCity Server:</strong> Server pusat yang mengelola antarmuka web UI, mengontrol pemicu VCS, menyimpan riwayat build, dan mendistribusikan tugas ke Build Agents.</li>
                <li><strong>Build Agent:</strong> Mesin pekerja terpisah (Worker) yang mengeksekusi langkah-langkah kompilasi, testing, dan deployment secara aktual.</li>
            </ul>

            <div class="callout callout-tip">
                <strong>⚡ Keunggulan Utama TeamCity:</strong><br>
                Mendukung <strong>Kotlin DSL</strong> (Domain Specific Language) untuk mengonfigurasi seluruh pipeline sebagai kode (Pipeline-as-Code) dengan tipe data aman (type-safe) dan autocompletion penuh di IDE IntelliJ.
            </div>

            <h3>2. Konfigurasi TeamCity via Kotlin DSL</h3>
            <div class="code-container">
                <div class="code-header"><span>.teamcity/settings.kts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script

version = "2024.03"

project {
    buildType(BuildAndTest)
}

object BuildAndTest : BuildType({
    name = "Build & Test Application"

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Run Unit Tests"
            scriptContent = """
                mvn clean test
            """.trimIndent()
        }
        script {
            name = "Package Artifact"
            scriptContent = """
                mvn package -DskipTests
            """.trimIndent()
        }
    }
})</code></pre>
            </div>
        `,
        sampleCommands: [
            "teamcity-agent start",
            "teamcity-cli build trigger --id=BuildAndTest",
            "teamcity-cli status"
        ],
        quiz: [
            {
                question: "Bahasa pemograman apakah yang digunakan oleh TeamCity untuk menulis Pipeline-as-Code secara type-safe?",
                options: ["Groovy", "Kotlin DSL", "Python", "YAML"],
                answer: 1,
                explanation: "TeamCity memanfaatkan Kotlin DSL untuk konfigurasi Pipeline-as-Code."
            },
            {
                question: "Komponen TeamCity manakah yang bertugas mengeksekusi perintah build dan testing aktual?",
                options: ["TeamCity Server", "Build Agent", "VCS Trigger", "Artifact Vault"],
                answer: 1,
                explanation: "Build Agent adalah pekerja yang mengeksekusi langkah-langkah kompilasi dan testing."
            }
        ]
    },
    {
        id: 17,
        title: "17. Azure DevOps Tutorial for Beginners | CI/CD with Azure Pipelines",
        category: "Azure DevOps",
        videoId: "4BibQ69MD8c",
        duration: "1:20:00",
        desc: "Pengenalan Azure DevOps, Azure Repos, Azure Pipelines (YAML), Build Agents, Deployment Gates, dan Release Pipelines.",
        summary: "Azure DevOps menyediakan platform ALM lengkap (Boards, Repos, Pipelines, Artifacts). Azure Pipelines mendukung deklarasi YAML dengan Agent Pools dan Service Connections.",
        theory: `
            <h3>1. Komponen Ekosistem Azure DevOps</h3>
            <ul>
                <li><strong>Azure Boards:</strong> Pengelolaan proyek Agile, Kanban, dan backlog tiket.</li>
                <li><strong>Azure Repos:</strong> Repositori Git ter-hosting.</li>
                <li><strong>Azure Pipelines:</strong> Engine CI/CD berbasis YAML untuk membangun dan menyebarkan kode ke cloud mana pun (Azure, AWS, GCP, On-Premise).</li>
                <li><strong>Azure Artifacts:</strong> Package feed management (NuGet, npm, Maven).</li>
            </ul>

            <h3>2. Contoh Berkas azure-pipelines.yml</h3>
            <div class="code-container">
                <div class="code-header"><span>azure-pipelines.yml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

stages:
- stage: Build
  displayName: 'Build Stage'
  jobs:
  - job: BuildJob
    steps:
    - task: UseDotNet@2
      inputs:
        packageType: 'sdk'
        version: '8.x'

    - script: dotnet build --configuration $(buildConfiguration)
      displayName: 'dotnet build'

    - script: dotnet test
      displayName: 'dotnet test'

- stage: Deploy
  displayName: 'Deploy Stage'
  dependsOn: Build
  condition: succeeded()
  jobs:
  - deployment: DeployWeb
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Deploying to Azure App Service..."</code></pre>
            </div>
        `,
        sampleCommands: [
            "az pipelines run --name 'MyPipelines'",
            "az repo list",
            "git push azure main"
        ],
        quiz: [
            {
                question: "Keyword apakah di Azure Pipelines yang menentukan spesifikasi mesin Virtual Agent penyedia build (seperti 'ubuntu-latest')?",
                options: ["agent", "pool", "runner", "machine"],
                answer: 1,
                explanation: "Keyword 'pool:' mendefinisikan Agent Pool atau VM image yang digunakan di Azure Pipelines."
            },
            {
                question: "Layanan manakah di Azure DevOps yang menangani manajemen tugas backlog Kanban dan sprint planning?",
                options: ["Azure Repos", "Azure Pipelines", "Azure Boards", "Azure Artifacts"],
                answer: 2,
                explanation: "Azure Boards adalah modul project management & tracking di Azure DevOps."
            }
        ]
    },
    {
        id: 18,
        title: "18. DevSecOps Tutorial | CI Pipeline with GitHub Actions & Docker Scout",
        category: "DevSecOps",
        videoId: "gLJdrXPn0ns",
        duration: "28:25",
        desc: "Integrasi keamanan ke dalam CI pipeline, vulnerability scanning pada Docker image dengan Docker Scout, SAST scanning, dan policy enforcement.",
        summary: "DevSecOps mengintegrasikan praktis keamanan (Shift Left) sejak awal alur pengembangan. Menggunakan Docker Scout dan Trivy untuk memindai kerentanan CVE pada container image.",
        theory: `
            <h3>1. Konsep DevSecOps (Shift Left Security)</h3>
            <p>Pada alur DevOps tradisional, pengujian keamanan sering dilakukan di akhir sebelum release. Jika ditemukan kerentanan, perbaikan akan memakan waktu sangat mahal.</p>
            <p><strong>DevSecOps (Shift Left)</strong> memindahkan audit keamanan langsung ke dalam alur CI/CD pipeline setiap kali terjadi kode commit:</p>

            <ul>
                <li><strong>SAST (Static Application Security Testing):</strong> Memindai kelemahan keamanan di kode sumber (misal dengan CodeQL atau SonarQube).</li>
                <li><strong>SCA (Software Composition Analysis):</strong> Memindai kerentanan pada dependency/library open-source (misal <code>npm audit</code> atau Snyk).</li>
                <li><strong>Container Image Scanning:</strong> Memindai kerentanan (CVE) pada layer image Docker (misal dengan <strong>Docker Scout</strong> atau Trivy).</li>
            </ul>

            <h3>2. Integrasi Docker Scout di GitHub Actions</h3>
            <div class="code-container">
                <div class="code-header"><span>.github/workflows/devsecops.yml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>name: DevSecOps Vulnerability Scan

on: [push]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Build Docker Image locally
        run: docker build -t myapp:test .

      - name: Docker Scout Vulnerability Scan
        uses: docker/scout-action@v1
        with:
          command: cves
          image: myapp:test
          only-severities: critical,high
          exit-code: true # Fail pipeline jika ada vulnerability Critical/High!</code></pre>
            </div>
        `,
        sampleCommands: [
            "docker scout cves myapp:latest",
            "docker scout recommendations myapp:latest",
            "trivy image myapp:latest"
        ],
        quiz: [
            {
                question: "Apakah makna filosofi 'Shift Left' dalam konteks DevSecOps?",
                options: [
                    "Menggeser pengujian keamanan ke tahap paling awal dalam siklus pengembangan (CI Pipeline)",
                    "Menghapus peran tim keamanan",
                    "Memindahkan server ke sebelah kiri data center",
                    "Menulis kode dari kanan ke kiri"
                ],
                answer: 0,
                explanation: "Shift Left berarti mengintegrasikan keamanan sejak awal di alur CI."
            },
            {
                question: "Utility alat pakar apakah yang digunakan untuk memindai kerentanan (CVE) pada layer container image Docker?",
                options: ["Docker Scout", "Git Rebase", "Kubectl Get", "Npm Start"],
                answer: 0,
                explanation: "Docker Scout memindai dan memberikan saran perbaikan kerentanan pada Docker image."
            }
        ]
    },
    {
        id: 19,
        title: "19. What are Microservices? Microservices Architecture & CI/CD",
        category: "Arsitektur",
        videoId: null,
        duration: "1:09:00",
        desc: "Arsitektur Microservices vs Monolith, tantangan deployment, strategi CI/CD independen per service, dan komunikasi inter-service.",
        summary: "Microservices memecah aplikasi menjadi layanan-layanan kecil independen. Setiap microservice memiliki alur pipeline CI/CD dan siklus rilis independen.",
        theory: `
            <h3>1. Monolith vs Microservices</h3>
            <p>Pada arsitektur <strong>Monolith</strong>, seluruh modul (Auth, Payment, Inventory, Notification) digabung menjadi 1 basis kode tunggal dan rilis bersamaan. Ini menyebabkan pipeline build menjadi sangat lambat dan deployment berisiko tinggi.</p>
            <p>Pada arsitektur <strong>Microservices</strong>, setiap layanan dipisah menjadi repositori/folder independen dengan database terpisah, bahasa pemrograman bebas (polyglot), serta memiliki <strong>Pipeline CI/CD terpisah</strong>.</p>

            <h3>2. Tantangan CI/CD pada Microservices & Solusinya</h3>
            <ul>
                <li><strong>Independent Build & Deploy:</strong> Perubahan pada <code>payment-service</code> tidak boleh memicu re-build pada <code>user-service</code>.</li>
                <li><strong>Contract Testing (Pact):</strong> Memastikan perubahan API pada satu service tidak merusak interaksi dengan service konsumen.</li>
                <li><strong>Monorepo vs Polyrepo:</strong> Di Monorepo, gunakan <em>Path Filtering</em> di CI (misal: jalankan job hanya jika folder <code>services/payment/**</code> berubah).</li>
            </ul>
        `,
        sampleCommands: [
            "git diff --name-only HEAD~1",
            "docker compose up -d --build"
        ],
        quiz: [
            {
                question: "Mengapa setiap Microservice disarankan memiliki pipeline CI/CD tersendiri?",
                options: [
                    "Agar setiap service dapat di-build, di-test, dan di-deploy secara independen tanpa bergantung service lain",
                    "Karena Docker mengharuskan pipeline terpisah",
                    "Agar menggunakan lebih banyak memori RAM",
                    "Untuk menghindari penggunaan Git"
                ],
                answer: 0,
                explanation: "CI/CD independen memungkinkan rilis lebih cepat tanpa menunggu seluruh modul monolith."
            },
            {
                question: "Teknik testing apakah yang digunakan di microservices untuk memverifikasi kompatibilitas kontrak API antar service?",
                options: ["Unit Test", "Contract Testing (Pact)", "Manual UI Test", "Smoke Test"],
                answer: 1,
                explanation: "Contract Testing memastikan produsen dan konsumen API tetap kompatibel."
            }
        ]
    },
    {
        id: 20,
        title: "20. ArgoCD Tutorial for Beginners | GitOps CD for Kubernetes",
        category: "GitOps & ArgoCD",
        videoId: "MeU5_k9ssrs",
        duration: "06:30",
        desc: "Prinsip GitOps, arsitektur ArgoCD, sinkronisasi otomatis status kluster Kubernetes dengan repositori Git sebagai single source of truth.",
        summary: "GitOps mengadopsi Git sebagai Single Source of Truth untuk infrastruktur & deklarasi aplikasi. ArgoCD adalah pengontrol deklaratif GitOps CD native untuk Kubernetes.",
        theory: `
            <h3>1. Prinsip Utama Filosofi GitOps</h3>
            <p><strong>GitOps</strong> adalah cara melakukan Continuous Deployment di mana seluruh deskripsi infrastruktur dan manifesto status aplikasi (Kubernetes YAML, Helm Charts, Kustomize) disimpan secara deklaratif di dalam repositori Git.</p>
            <ul>
                <li><strong>Declarative System:</strong> Seluruh konfigurasi kluster didefinisikan dalam bentuk berkas manifes.</li>
                <li><strong>Git as Single Source of Truth:</strong> Repositori Git menjadi satu-satunya sumber kebenaran status aplikasi.</li>
                <li><strong>Automated Sync & Self-Healing:</strong> Agen (ArgoCD) secara terus-menerus membandingkan status di Git (Desired State) dengan status aktual di Kluster Kubernetes (Live State). Jika ada perbedaan (drift), ArgoCD akan melakukan <em>Self-Healing / Sync</em> otomatis.</li>
            </ul>

            <h3>2. Contoh Manifes ArgoCD Application</h3>
            <div class="code-container">
                <div class="code-header"><span>argocd-app-manifest.yaml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payment-microservice
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/myorg/k8s-manifests.git'
    targetRevision: HEAD
    path: environments/production
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true</code></pre>
            </div>
        `,
        sampleCommands: [
            "argocd app list",
            "argocd app get payment-microservice",
            "argocd app sync payment-microservice"
        ],
        quiz: [
            {
                question: "Apakah peran repositori Git dalam konsep filosofi GitOps?",
                options: [
                    "Hanya untuk menyimpan file dokumentasi",
                    "Sebagai Single Source of Truth (Sumber Kebenaran Tunggal) status infrastruktur & aplikasi",
                    "Sebagai server database utama",
                    "Sebagai pengganti Kubernetes Cluster"
                ],
                answer: 1,
                explanation: "GitOps menjadikan Git sebagai Single Source of Truth untuk seluruh deklarasi manifes."
            },
            {
                question: "Fitur ArgoCD apakah yang secara otomatis mengembalikan status kluster K8s jika ada seseorang yang mengubah K8s pod secara manual di luar Git?",
                options: ["Auto Prune", "Self-Healing", "Rollback Trigger", "Git Lock"],
                answer: 1,
                explanation: "Self-Healing mendeteksi manual drift di kluster dan mengembalikannya sesuai manifes di Git."
            }
        ]
    }
];

// --- STATE MANAGEMENT ---
let state = {
    activeModuleIndex: 0,
    completedModules: JSON.parse(localStorage.getItem('git_cicd_completed') || '[]'),
    bookmarks: JSON.parse(localStorage.getItem('git_cicd_bookmarks') || '[]'),
    notes: JSON.parse(localStorage.getItem('git_cicd_notes') || '{}'),
    activeCategory: 'ALL',
    activeTab: 'theory',
    searchQuery: ''
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    loadModule(state.activeModuleIndex);
    updateProgressUI();

    // Event Listener Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderSidebar();
    });

    // Terminal Enter Key Handler
    document.getElementById('terminalInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeTerminalCommand();
        }
    });
});

// --- RENDER SIDEBAR ---
function renderSidebar() {
    const container = document.getElementById('chapterListContainer');
    container.innerHTML = '';

    const filtered = MODULES_DATA.filter(mod => {
        const matchesCategory = state.activeCategory === 'ALL' || mod.category === state.activeCategory;
        const matchesSearch = mod.title.toLowerCase().includes(state.searchQuery) ||
                              mod.desc.toLowerCase().includes(state.searchQuery) ||
                              mod.summary.toLowerCase().includes(state.searchQuery);
        return matchesCategory && matchesSearch;
    });

    document.getElementById('chapterCountSidebar').innerText = `${filtered.length} Modul`;

    filtered.forEach((mod) => {
        const originalIndex = MODULES_DATA.findIndex(m => m.id === mod.id);
        const isCompleted = state.completedModules.includes(mod.id);
        const isBookmarked = state.bookmarks.includes(mod.id);
        const isActive = originalIndex === state.activeModuleIndex;

        const item = document.createElement('div');
        item.className = `chapter-item ${isActive ? 'active' : ''}`;
        item.onclick = () => selectModule(originalIndex);

        item.innerHTML = `
            <div class="chapter-item-header">
                <span class="chapter-item-title">${isCompleted ? '✅ ' : ''}${mod.title}</span>
                ${isBookmarked ? '⭐' : ''}
            </div>
            <div class="chapter-item-meta">
                <span class="badge badge-cyan">${mod.category}</span>
                <span>⏱️ ${mod.duration}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

// --- SELECT MODULE ---
function selectModule(index) {
    state.activeModuleIndex = index;
    renderSidebar();
    loadModule(index);
}

// --- LOAD MODULE INTO MAIN CONTENT ---
function loadModule(index) {
    const mod = MODULES_DATA[index];
    if (!mod) return;

    // Category Badge & Titles
    document.getElementById('chapterCategoryBadge').innerText = mod.category;
    document.getElementById('timestampText').innerText = mod.videoId;
    document.getElementById('chapterTitle').innerText = mod.title;
    document.getElementById('chapterDesc').innerText = mod.desc;

    // Update Bookmark & Complete Buttons
    updateBookmarkBtnUI(mod.id);
    updateCompletedBtnUI(mod.id);

    // Render Article Theory
    document.getElementById('articleBody').innerHTML = mod.theory;

    // Render Youtube Video
    kodelokaVideo(mod.videoId);

    // Render Snippet Buttons for Playground
    renderSnippetButtons(mod.sampleCommands);

    // Render Quiz
    renderQuiz(mod.quiz);

    // Render Notes
    document.getElementById('notesTextarea').value = state.notes[mod.id] || '';

    // Footer Nav Text
    document.getElementById('currentFooterProgress').innerText = `Modul ${index + 1} dari ${MODULES_DATA.length}`;

    // Scroll to top of main content
    document.querySelector('.main-content').scrollTop = 0;
}

// --- UI BUTTON HELPERS ---
function updateBookmarkBtnUI(modId) {
    const btn = document.getElementById('bookmarkBtn');
    const isBookmarked = state.bookmarks.includes(modId);
    btn.innerText = isBookmarked ? '⭐ Bookmarked' : '⭐ Bookmark';
    btn.style.borderColor = isBookmarked ? 'var(--accent-amber)' : 'var(--border-color)';
}

function updateCompletedBtnUI(modId) {
    const btn = document.getElementById('toggleCompletedBtn');
    const isCompleted = state.completedModules.includes(modId);
    btn.innerText = isCompleted ? '✅ Selesai' : '☑️ Tandai Selesai';
    btn.className = isCompleted ? 'btn btn-secondary' : 'btn btn-primary';
}

function toggleBookmark() {
    const modId = MODULES_DATA[state.activeModuleIndex].id;
    if (state.bookmarks.includes(modId)) {
        state.bookmarks = state.bookmarks.filter(id => id !== modId);
    } else {
        state.bookmarks.push(modId);
    }
    localStorage.setItem('git_cicd_bookmarks', JSON.stringify(state.bookmarks));
    updateBookmarkBtnUI(modId);
    renderSidebar();
}

function toggleCurrentCompleted() {
    const modId = MODULES_DATA[state.activeModuleIndex].id;
    if (state.completedModules.includes(modId)) {
        state.completedModules = state.completedModules.filter(id => id !== modId);
    } else {
        state.completedModules.push(modId);
    }
    localStorage.setItem('git_cicd_completed', JSON.stringify(state.completedModules));
    updateCompletedBtnUI(modId);
    updateProgressUI();
    renderSidebar();
}

function updateProgressUI() {
    const count = state.completedModules.length;
    const total = MODULES_DATA.length;
    const percent = Math.round((count / total) * 100);

    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressText').innerText = `${count} / ${total} Selesai (${percent}%)`;
}

function resetAllProgress() {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh progres belajar Git & CI/CD?")) {
        state.completedModules = [];
        state.bookmarks = [];
        localStorage.removeItem('git_cicd_completed');
        localStorage.removeItem('git_cicd_bookmarks');
        updateProgressUI();
        renderSidebar();
        updateCompletedBtnUI(MODULES_DATA[state.activeModuleIndex].id);
        updateBookmarkBtnUI(MODULES_DATA[state.activeModuleIndex].id);
    }
}

// --- TABS SWITCHING ---
function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });
}

// --- CATEGORY FILTERING ---
function filterCategory(category) {
    state.activeCategory = category;
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.innerText.trim() === category || (category === 'ALL' && pill.innerText.trim() === 'Semua'));
    });
    renderSidebar();
}

// --- NAVIGATION PREV / NEXT ---
function navigatePrev() {
    if (state.activeModuleIndex > 0) {
        selectModule(state.activeModuleIndex - 1);
    }
}

function navigateNext() {
    if (state.activeModuleIndex < MODULES_DATA.length - 1) {
        selectModule(state.activeModuleIndex + 1);
    }
}

// --- PLAYGROUND / TERMINAL SIMULATOR ---
function renderSnippetButtons(commands) {
    const grid = document.getElementById('snippetButtonsGrid');
    grid.innerHTML = '';
    commands.forEach(cmd => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.style.fontSize = '0.75rem';
        btn.style.padding = '4px 10px';
        btn.innerText = cmd;
        btn.onclick = () => {
            document.getElementById('terminalInput').value = cmd;
            executeTerminalCommand();
        };
        grid.appendChild(btn);
    });
}

function loadSampleCommands() {
    const mod = MODULES_DATA[state.activeModuleIndex];
    renderSnippetButtons(mod.sampleCommands);
}

function executeTerminalCommand() {
    const input = document.getElementById('terminalInput');
    const cmd = input.value.trim();
    if (!cmd) return;

    const output = document.getElementById('terminalOutput');

    // Add command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line term-cmd';
    cmdLine.innerText = `devops@ci-cd-runner:~$ ${cmd}`;
    output.appendChild(cmdLine);

    // Simulate Command Output
    const resLine = document.createElement('div');
    resLine.className = 'term-line';

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
        resLine.className = 'term-line term-info';
        resLine.innerText = "Perintah yang didukung: git status, git log, gh workflow run, jenkins build, docker scout, argocd app sync, clear";
    } else if (lower.startsWith('git status')) {
        resLine.className = 'term-line term-success';
        resLine.innerText = "On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean";
    } else if (lower.startsWith('git log')) {
        resLine.className = 'term-line term-info';
        resLine.innerText = "commit 92f7a5b (HEAD -> main, origin/main)\nAuthor: Devops Engineer <devops@company.com>\nDate:   Mon Jul 27 23:00:00 2026\n\n    feat(ci): add GitHub Actions workflow and Docker Scout scan";
    } else if (lower.startsWith('gh workflow run')) {
        resLine.className = 'term-line term-success';
        resLine.innerText = "✓ Created workflow_dispatch event for ci-cd.yml at main\nRun URL: https://github.com/myorg/myapp/actions/runs/9842104";
    } else if (lower.startsWith('gh run list')) {
        resLine.className = 'term-line term-info';
        resLine.innerText = "STATUS  NAME                 WORKFLOW   BRANCH  EVENT  ID\n✓       Node.js CI & Docker  ci-cd.yml  main    push   9842104\n✓       DevSecOps Vulnerab   devsec.yml main    push   9842099";
    } else if (lower.startsWith('jenkins')) {
        resLine.className = 'term-line term-success';
        resLine.innerText = "[JENKINS BUILD] Triggering job 'my-payment-service'...\nStage: Checkout [SUCCESS]\nStage: Compile & Test [SUCCESS]\nStage: Package [SUCCESS]\nFinished: SUCCESS";
    } else if (lower.startsWith('docker scout')) {
        resLine.className = 'term-line term-warning';
        resLine.innerText = "✓ Target image: myapp:latest\n✓ Analysis complete\n\nTarget vulnerabilities: 0 Critical | 0 High | 2 Medium | 5 Low\nRecommendation: Upgrade base image node:22-alpine to 22.14-alpine";
    } else if (lower.startsWith('argocd')) {
        resLine.className = 'term-line term-success';
        resLine.innerText = "Name:               payment-microservice\nStatus:             Synced\nHealth:             Healthy\nRevision:           92f7a5b3a4c180901b239d1b092309101b023023";
    } else if (lower === 'clear') {
        output.innerHTML = '';
        input.value = '';
        return;
    } else {
        resLine.className = 'term-line term-info';
        resLine.innerText = `[Executed] ${cmd} (OK - 0 errors)`;
    }

    output.appendChild(resLine);
    output.scrollTop = output.scrollHeight;
    input.value = '';
}

function clearTerminalOutput() {
    document.getElementById('terminalOutput').innerHTML = '<div class="term-line term-info">Terminal cleared.</div>';
}

// --- QUIZ SYSTEM ---
function renderQuiz(quizList) {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '<h3 style="margin-bottom: 20px; color: var(--accent-cyan);">🧪 Evaluation Quiz Modul Ini</h3>';

    quizList.forEach((q, qIndex) => {
        const card = document.createElement('div');
        card.className = 'quiz-card';

        let optionsHTML = '';
        q.options.forEach((opt, optIndex) => {
            optionsHTML += `
                <button class="quiz-option-btn" onclick="checkAnswer(this, ${qIndex}, ${optIndex}, ${q.answer})">
                    ${String.fromCharCode(65 + optIndex)}. ${opt}
                </button>
            `;
        });

        card.innerHTML = `
            <div class="quiz-question">${qIndex + 1}. ${q.question}</div>
            <div class="quiz-options">${optionsHTML}</div>
            <div class="quiz-explanation" id="quiz-exp-${qIndex}" style="display: none;">
                <strong>💡 Penjelasan:</strong> ${q.explanation}
            </div>
        `;
        container.appendChild(card);
    });
}

function checkAnswer(btn, qIndex, selectedIndex, correctIndex) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll('.quiz-option-btn');

    buttons.forEach((b, idx) => {
        b.disabled = true;
        if (idx === correctIndex) {
            b.classList.add('selected-correct');
        } else if (idx === selectedIndex) {
            b.classList.add('selected-wrong');
        }
    });

    const exp = document.getElementById(`quiz-exp-${qIndex}`);
    if (exp) exp.style.display = 'block';
}

// --- NOTES SAVING ---
function saveUserNote() {
    const modId = MODULES_DATA[state.activeModuleIndex].id;
    const text = document.getElementById('notesTextarea').value;
    state.notes[modId] = text;
    localStorage.setItem('git_cicd_notes', JSON.stringify(state.notes));

    const status = document.getElementById('saveNotesStatus');
    status.style.display = 'inline';
    setTimeout(() => {
        status.style.display = 'none';
    }, 2000);
}

// --- COPY CODE HELPER ---
function copyCode(btn) {
    const container = btn.closest('.code-container');
    const code = container.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = 'Copy', 2000);
    });
}

// --- FINAL EXAM MODAL ---
function openFinalExam() {
    const modal = document.getElementById('examModal');
    const body = document.getElementById('examModalBody');

    // Aggregate all 28 quiz questions
    let allQuestions = [];
    MODULES_DATA.forEach(m => {
        m.quiz.forEach(q => allQuestions.push({ ...q, moduleTitle: m.title }));
    });

    body.innerHTML = `
        <h2 style="color: var(--accent-purple); margin-bottom: 8px;">🏆 Ujian Sertifikasi Git &amp; CI/CD Mastery</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9rem;">
            Ujian ini terdiri dari ${allQuestions.length} pertanyaan pilihan ganda yang mencakup seluruh 20 modul video tutorial.
        </p>
        <div id="examQuestionsList"></div>
        <button class="btn btn-primary" onclick="submitExam()" style="margin-top: 20px; width: 100%; padding: 12px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink)); color: #fff; font-weight: 700;">
            📝 Selesaikan &amp; Hitung Nilai Sertifikat
        </button>
        <div id="examResult" style="margin-top: 20px;"></div>
    `;

    const qListContainer = document.getElementById('examQuestionsList');
    allQuestions.forEach((q, i) => {
        const item = document.createElement('div');
        item.style.marginBottom = '20px';
        item.style.padding = '14px';
        item.style.background = 'var(--bg-input)';
        item.style.borderRadius = '8px';

        let opts = '';
        q.options.forEach((opt, oIdx) => {
            opts += `
                <label style="display: block; margin-top: 6px; cursor: pointer; color: var(--text-primary); font-size: 0.85rem;">
                    <input type="radio" name="exam_q_${i}" value="${oIdx}"> ${String.fromCharCode(65 + oIdx)}. ${opt}
                </label>
            `;
        });

        item.innerHTML = `
            <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${i + 1}. [${q.moduleTitle.split('.')[0]}] ${q.question}</div>
            <div>${opts}</div>
        `;
        qListContainer.appendChild(item);
    });

    modal.classList.add('active');
}

function closeFinalExam() {
    document.getElementById('examModal').classList.remove('active');
}

function submitExam() {
    let score = 0;
    let total = 0;
    MODULES_DATA.forEach(m => total += m.quiz.length);

    let qIndex = 0;
    MODULES_DATA.forEach(m => {
        m.quiz.forEach(q => {
            const selected = document.querySelector(`input[name="exam_q_${qIndex}"]:checked`);
            if (selected && parseInt(selected.value) === q.answer) {
                score++;
            }
            qIndex++;
        });
    });

    const percent = Math.round((score / total) * 100);
    const resultDiv = document.getElementById('examResult');

    const passed = percent >= 75;

    resultDiv.innerHTML = `
        <div style="padding: 20px; border-radius: 12px; background: ${passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border: 1px solid ${passed ? 'var(--accent-green)' : 'var(--accent-red)'}; text-align: center;">
            <h3 style="color: ${passed ? 'var(--accent-green)' : 'var(--accent-red)'}; font-size: 1.4rem;">${passed ? '🎉 Selamat! Anda LULUS Sertifikasi!' : '❌ Belum Lulus'}</h3>
            <p style="font-size: 1.1rem; font-weight: 700; margin: 10px 0;">Skor Anda: ${score} / ${total} (${percent}%)</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${passed ? 'Anda telah menguasai konsep Git, GitHub Actions, Jenkins, GitLab CI, Azure DevOps, GitOps, dan DevSecOps!' : 'Batas kelulusan adalah 75%. Silakan pelajari kembali modul-modul yang belum Anda kuasai.'}</p>
        </div>
    `;
}
