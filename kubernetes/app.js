/* ==========================================================================
   KUBERNETES — Platform Pembelajaran Interaktif
   Bahasa Indonesia
   ========================================================================== */

const TOPIK_SLUG = "kubernetes";
const TOPIK_SUB  = "orkestrasi kontainer";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Apa yang Sebenarnya Dikerjakan Kubernetes",
    tingkat: "Dasar", durasi: "14 mnt",
    tag: ["konsep", "arsitektur", "control plane", "kubelet", "etcd"],
    ringkas: "Memahami Kubernetes sebagai loop rekonsiliasi keadaan, bukan sekadar alat menjalankan kontainer — dan kenapa perbedaan itu menentukan cara Anda memakainya.",
    isi: `
<h2>Gagasan Inti: Keadaan yang Diinginkan</h2>
<p>Banyak orang mengira Kubernetes adalah "Docker Compose versi besar". Itu keliru dan menyesatkan. Docker Compose menjalankan perintah: <em>nyalakan kontainer ini</em>. Kubernetes bekerja dengan cara yang berbeda secara mendasar.</p>

<div class="callout info">
    <div class="callout-judul">💡 Definisi kerja</div>
    <p>Anda mendeklarasikan <strong>keadaan yang diinginkan</strong> ("saya ingin 3 replika aplikasi ini berjalan"). Kubernetes terus-menerus membandingkannya dengan <strong>keadaan sebenarnya</strong>, lalu mengambil tindakan untuk menutup selisihnya. Selamanya. Ini disebut <strong>loop rekonsiliasi</strong>.</p>
</div>

<pre>┌──────────────────┐
│ Keadaan diinginkan│  ← Anda tulis di YAML
│  replika: 3       │
└────────┬─────────┘
         │  dibandingkan terus-menerus
         ▼
┌──────────────────┐        selisih?        ┌────────────┐
│ Keadaan sebenarnya│ ─────────────────────&gt;│ Ambil       │
│  replika: 2       │                       │ tindakan    │
└──────────────────┘  &lt;────────────────────  └────────────┘
                          buat 1 pod lagi</pre>

<p>Konsekuensi praktisnya besar: bila Anda menghapus pod secara manual, Kubernetes akan membuatnya lagi. Bukan karena "bandel", tetapi karena Anda pernah menyatakan ingin 3 replika dan Anda tidak pernah mencabut pernyataan itu.</p>

<h2>Komponen Control Plane</h2>
<table>
<thead><tr><th>Komponen</th><th>Tugas</th><th>Bila mati</th></tr></thead>
<tbody>
<tr><td><strong>kube-apiserver</strong></td><td>Satu-satunya pintu masuk. Semua komponen lain bicara lewat sini, tidak pernah langsung satu sama lain.</td><td>Tidak bisa mengubah apa pun; beban kerja yang sudah jalan tetap jalan</td></tr>
<tr><td><strong>etcd</strong></td><td>Basis data key-value yang menyimpan <em>seluruh</em> keadaan kluster.</td><td>Kluster kehilangan ingatannya — ini komponen paling kritis</td></tr>
<tr><td><strong>kube-scheduler</strong></td><td>Menentukan pod baru ditempatkan di node mana.</td><td>Pod baru menggantung di status Pending</td></tr>
<tr><td><strong>controller-manager</strong></td><td>Menjalankan loop rekonsiliasi untuk Deployment, ReplicaSet, Node, dan lainnya.</td><td>Tidak ada penyembuhan otomatis</td></tr>
</tbody>
</table>

<h2>Komponen di Setiap Node</h2>
<table>
<thead><tr><th>Komponen</th><th>Tugas</th></tr></thead>
<tbody>
<tr><td><strong>kubelet</strong></td><td>Agen yang memastikan kontainer yang seharusnya berjalan di node ini benar-benar berjalan. Ia menjalankan probe kesehatan dan melaporkan status.</td></tr>
<tr><td><strong>kube-proxy</strong></td><td>Mengatur aturan jaringan agar Service bisa menjangkau pod.</td></tr>
<tr><td><strong>container runtime</strong></td><td>Yang benar-benar menjalankan kontainer — containerd atau CRI-O.</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Docker sudah bukan runtime Kubernetes</div>
    <p>Sejak Kubernetes 1.24, <code>dockershim</code> dihapus. Kubernetes kini berbicara langsung ke runtime lewat antarmuka CRI, biasanya <strong>containerd</strong>. Ini <em>tidak</em> berarti image Docker tidak bisa dipakai — format image-nya standar OCI dan tetap berjalan normal. Yang berubah hanya komponen yang menjalankannya di balik layar. Konsekuensi nyata: perintah <code>docker ps</code> di node tidak lagi menampilkan kontainer Kubernetes; gunakan <code>crictl ps</code>.</p>
</div>

<h2>Pod: Satuan Terkecil</h2>
<p>Kubernetes tidak menjalankan kontainer secara langsung — ia menjalankan <strong>Pod</strong>. Pod adalah satu atau beberapa kontainer yang:</p>
<ul>
<li>Berbagi <strong>alamat IP</strong> yang sama — antar kontainer di dalamnya bisa saling menghubungi lewat <code>localhost</code>.</li>
<li>Berbagi <strong>volume</strong>.</li>
<li>Selalu dijadwalkan ke <strong>node yang sama</strong>, dan hidup-mati bersama.</li>
</ul>

<div class="callout tip">
    <div class="callout-judul">📌 Kapan satu Pod berisi lebih dari satu kontainer</div>
    <p>Jarang, dan harus ada alasan kuat. Polanya disebut <em>sidecar</em>: pengumpul log yang membaca berkas yang ditulis kontainer utama, proxy service mesh, atau penyegar sertifikat. Aturannya: kalau dua kontainer bisa diskalakan secara terpisah, mereka <strong>harus</strong> berada di Pod yang berbeda.</p>
</div>

<h2>Kapan Kubernetes Tidak Sepadan</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Jujurlah pada diri sendiri</div>
    <p>Kubernetes menyelesaikan masalah <em>skala dan keberagaman</em>. Bila Anda punya satu aplikasi dengan trafik sedang, sebuah VM dengan systemd atau layanan PaaS akan jauh lebih murah, lebih mudah, dan lebih andal. Kubernetes menuntut Anda memahami jaringan, penyimpanan, RBAC, manajemen sumber daya, dan siklus upgrade — semua itu adalah pekerjaan penuh waktu.</p>
    <p><strong>Mulai memikirkan Kubernetes bila:</strong> ada banyak layanan dengan siklus rilis berbeda, kebutuhan penskalaan otomatis yang nyata, banyak tim yang butuh isolasi, atau Anda memang sudah punya orang yang mengerti mengoperasikannya.</p>
</div>`,
    perintah: [
        "kubectl cluster-info",
        "kubectl get nodes -o wide",
        "kubectl get componentstatuses",
        "kubectl api-resources",
        "kubectl version"
    ],
    kuis: [
        {
            tanya: "Anda menghapus sebuah pod dengan kubectl delete pod, tetapi beberapa detik kemudian pod baru muncul. Kenapa?",
            opsi: [
                "Ada bug pada kubectl",
                "Deployment menyatakan keadaan yang diinginkan berisi sejumlah replika, sehingga loop rekonsiliasi membuat pod pengganti",
                "Pod tersebut tidak benar-benar terhapus, hanya di-restart",
                "Node secara otomatis menyalin pod yang hilang"
            ],
            benar: 1,
            penjelasan: "Kubernetes bekerja secara deklaratif. Objek Deployment menyatakan jumlah replika yang diinginkan, dan controller terus membandingkannya dengan kenyataan. Menghapus pod hanya mengubah keadaan sebenarnya; keadaan yang diinginkan tidak berubah, sehingga controller segera membuat pengganti. Untuk benar-benar menghentikannya, ubah atau hapus Deployment-nya."
        },
        {
            tanya: "Apa dampak dihapusnya dockershim sejak Kubernetes 1.24?",
            opsi: [
                "Image yang dibangun dengan Docker tidak bisa lagi dijalankan di Kubernetes",
                "Kubernetes berbicara langsung ke runtime lewat CRI (biasanya containerd); image tetap kompatibel karena berformat standar OCI",
                "Kubernetes tidak lagi mendukung kontainer Linux",
                "Semua Dockerfile harus ditulis ulang"
            ],
            benar: 1,
            penjelasan: "Yang dihapus adalah lapisan adaptor menuju daemon Docker, bukan dukungan terhadap image. Format image adalah standar OCI sehingga image hasil docker build tetap berjalan normal. Perubahan nyata hanya terasa saat mendebug di level node: gunakan crictl, bukan docker."
        }
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Pod, Deployment & ReplicaSet",
    tingkat: "Dasar", durasi: "16 mnt",
    tag: ["pod", "deployment", "replicaset", "label", "selector", "rollout"],
    ringkas: "Hubungan antara tiga objek yang paling sering Anda sentuh, dan kenapa Anda hampir tidak pernah membuat Pod secara langsung.",
    isi: `
<h2>Rantai Kepemilikan</h2>
<pre>Deployment  ──membuat──&gt;  ReplicaSet  ──membuat──&gt;  Pod
(kelola rilis)            (jaga jumlah)           (jalankan kontainer)</pre>

<p>Anda membuat <strong>Deployment</strong>. Deployment membuat <strong>ReplicaSet</strong>. ReplicaSet membuat <strong>Pod</strong>. Saat Anda memperbarui image, Deployment membuat ReplicaSet <em>baru</em> dan mengecilkan yang lama secara bertahap — itulah cara rolling update bekerja.</p>

<h2>Deployment yang Layak Produksi</h2>
<pre>apiVersion: apps/v1
kind: Deployment
metadata:
  name: layanan-pesanan
  labels:
    app: layanan-pesanan
spec:
  replicas: 3
  revisionHistoryLimit: 5
  selector:
    matchLabels:
      app: layanan-pesanan        # HARUS cocok dengan label template
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0           # kapasitas tidak pernah turun
  template:
    metadata:
      labels:
        app: layanan-pesanan
    spec:
      containers:
        - name: api
          image: registry.contoh.com/pesanan:2.4.0
          ports:
            - name: http
              containerPort: 8080
          env:
            - name: LINGKUNGAN
              value: produksi
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              memory: 512Mi
          livenessProbe:
            httpGet: { path: /healthz, port: http }
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:
            httpGet: { path: /readyz, port: http }
            periodSeconds: 5
          lifecycle:
            preStop:
              exec: { command: ["sleep", "5"] }
      terminationGracePeriodSeconds: 45</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ selector bersifat permanen</div>
    <p>Field <code>spec.selector</code> <strong>tidak bisa diubah</strong> setelah Deployment dibuat. Bila Anda perlu mengubahnya, Deployment harus dihapus dan dibuat ulang. Karena itu pilih label selector yang stabil sejak awal — jangan memasukkan nomor versi ke dalamnya.</p>
</div>

<h2>Label dan Selector</h2>
<p>Kubernetes tidak menghubungkan objek lewat referensi langsung, melainkan lewat <strong>label</strong>. Service menemukan Pod dengan mencocokkan label. ReplicaSet mengklaim Pod dengan mencocokkan label. Ini fleksibel, tetapi juga sumber kebingungan.</p>

<pre># Label yang dianjurkan (konvensi resmi)
metadata:
  labels:
    app.kubernetes.io/name: pesanan
    app.kubernetes.io/instance: pesanan-produksi
    app.kubernetes.io/version: "2.4.0"
    app.kubernetes.io/component: api
    app.kubernetes.io/part-of: platform-toko</pre>

<pre># Menyaring dengan selector
kubectl get pods -l app=layanan-pesanan
kubectl get pods -l 'lingkungan in (produksi,staging)'
kubectl get pods -l 'app=pesanan,versi!=2.3.0'
kubectl get pods --show-labels</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Label yang bertabrakan itu berbahaya</div>
    <p>Bila dua Deployment berbeda memakai label yang sama, Service akan mengirim trafik ke keduanya, dan ReplicaSet bisa saling "mencuri" pod. Gejalanya sangat membingungkan: sebagian permintaan mendapat respons dari aplikasi yang salah. Selalu sertakan nama aplikasi dan instansi di dalam label.</p>
</div>

<h2>Mengendalikan Rilis</h2>
<pre>kubectl set image deploy/layanan-pesanan api=registry.contoh.com/pesanan:2.5.0
kubectl rollout status deploy/layanan-pesanan --timeout=180s
kubectl rollout history deploy/layanan-pesanan
kubectl rollout undo deploy/layanan-pesanan
kubectl rollout undo deploy/layanan-pesanan --to-revision=3

# Menghentikan rilis di tengah jalan
kubectl rollout pause deploy/layanan-pesanan
kubectl rollout resume deploy/layanan-pesanan

# Memaksa pembuatan ulang seluruh pod (misal untuk memuat Secret baru)
kubectl rollout restart deploy/layanan-pesanan</pre>

<div class="callout tip">
    <div class="callout-judul">📌 maxUnavailable: 0 vs maxSurge</div>
    <p>Dengan <code>maxUnavailable: 0</code> dan <code>maxSurge: 1</code>, Kubernetes selalu menyalakan pod baru <em>dulu</em> dan menunggunya siap sebelum mematikan yang lama. Kapasitas layanan tidak pernah berkurang selama rilis. Harganya: sementara waktu Anda memakai sumber daya satu pod lebih banyak. Untuk layanan yang menghadap pengguna, ini hampir selalu pertukaran yang tepat.</p>
</div>

<h2>Jangan Pernah Memakai Tag :latest</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Kenapa :latest merusak segalanya</div>
    <p>Kubernetes memutuskan perlu-tidaknya rilis baru dengan membandingkan spesifikasi pod. Bila spesifikasinya tetap <code>app:latest</code>, tidak ada yang berubah — sehingga <code>kubectl apply</code> tidak melakukan apa pun meski image di registry sudah diperbarui. Lebih buruk lagi, pod yang di-restart di waktu berbeda bisa menarik image yang berbeda, sehingga <strong>replika Anda tidak lagi menjalankan kode yang sama</strong>. Selalu pakai tag versi atau digest.</p>
</div>`,
    perintah: [
        "kubectl get deploy,rs,pods -l app=layanan-pesanan",
        "kubectl describe deploy layanan-pesanan",
        "kubectl rollout status deploy/layanan-pesanan",
        "kubectl rollout undo deploy/layanan-pesanan",
        "kubectl get pods --show-labels"
    ],
    kuis: [
        {
            tanya: "Kenapa memakai tag :latest pada image Deployment adalah praktik yang buruk?",
            opsi: [
                "Karena tag :latest selalu menarik image berukuran lebih besar",
                "Karena spesifikasi pod tidak berubah sehingga apply tidak memicu rilis, dan pod yang restart di waktu berbeda bisa menjalankan versi kode yang berbeda",
                "Karena Kubernetes menolak tag :latest sejak versi 1.24",
                "Karena :latest hanya bekerja pada registry publik"
            ],
            benar: 1,
            penjelasan: "Rilis dipicu oleh perubahan pada spesifikasi pod. Dengan tag yang tidak pernah berubah, Kubernetes tidak melihat alasan untuk membuat ReplicaSet baru. Selain itu, karena tag bisa menunjuk image berbeda dari waktu ke waktu, replika yang di-restart pada saat berbeda bisa berakhir menjalankan kode yang tidak sama."
        },
        {
            tanya: "Apa akibat dua Deployment berbeda memakai label yang sama pada pod-nya?",
            opsi: [
                "Kubernetes akan menolak Deployment kedua",
                "Service akan mengirim trafik ke pod dari kedua Deployment, dan ReplicaSet bisa saling mengklaim pod milik yang lain",
                "Kedua Deployment akan otomatis digabung",
                "Tidak ada dampak apa pun"
            ],
            benar: 1,
            penjelasan: "Kubernetes menghubungkan objek lewat pencocokan label, bukan referensi langsung. Label yang bertabrakan membuat selector Service menjangkau pod yang tidak dimaksudkan, dan ReplicaSet dapat menghitung pod milik Deployment lain sebagai miliknya. Gejalanya membingungkan karena hanya sebagian permintaan yang berperilaku salah."
        }
    ]
},
{
    id: 3,
    kategori: "2 · Jaringan",
    judul: "Service, Endpoint & DNS Internal",
    tingkat: "Dasar", durasi: "15 mnt",
    tag: ["service", "clusterip", "nodeport", "loadbalancer", "dns", "headless"],
    ringkas: "Bagaimana pod yang alamat IP-nya selalu berubah bisa saling menemukan, dan empat jenis Service beserta kapan memakainya.",
    isi: `
<h2>Masalah yang Diselesaikan Service</h2>
<p>IP pod bersifat sementara. Setiap kali pod dibuat ulang — karena rilis, karena node dikuras, karena crash — IP-nya berubah. Menyimpan IP pod di konfigurasi aplikasi adalah jaminan kerusakan.</p>

<p><strong>Service</strong> memberi satu alamat tetap beserta nama DNS yang selalu menunjuk ke kumpulan pod yang sehat saat itu.</p>

<pre>apiVersion: v1
kind: Service
metadata:
  name: layanan-pesanan
spec:
  selector:
    app: layanan-pesanan     # pod mana yang dilayani
  ports:
    - name: http
      port: 80               # port Service
      targetPort: 8080       # port di dalam pod
  type: ClusterIP</pre>

<h2>Empat Jenis Service</h2>
<table>
<thead><tr><th>Jenis</th><th>Terjangkau dari</th><th>Dipakai untuk</th></tr></thead>
<tbody>
<tr><td><strong>ClusterIP</strong></td><td>Dalam kluster saja</td><td>Bawaan; komunikasi antar layanan internal</td></tr>
<tr><td><strong>NodePort</strong></td><td>IP node mana pun di port 30000–32767</td><td>Pengembangan; jarang tepat untuk produksi</td></tr>
<tr><td><strong>LoadBalancer</strong></td><td>Internet, lewat LB penyedia cloud</td><td>Mengekspos satu layanan ke luar</td></tr>
<tr><td><strong>ExternalName</strong></td><td>Alias DNS ke host di luar</td><td>Merujuk basis data terkelola di luar kluster</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan membuat satu LoadBalancer per layanan</div>
    <p>Setiap Service bertipe LoadBalancer membuat load balancer cloud tersendiri, dan tiap load balancer punya biaya bulanan. Sepuluh layanan berarti sepuluh tagihan dan sepuluh alamat IP publik. Pola yang benar: <strong>satu</strong> Ingress Controller di belakang satu LoadBalancer, lalu arahkan semua layanan melaluinya berdasarkan host dan path.</p>
</div>

<h2>DNS Internal</h2>
<pre>&lt;service&gt;.&lt;namespace&gt;.svc.cluster.local

# Dari pod di namespace yang sama:
http://layanan-pesanan

# Dari namespace berbeda:
http://layanan-pesanan.produksi

# Nama lengkap (paling eksplisit):
http://layanan-pesanan.produksi.svc.cluster.local</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Nama pendek memicu pencarian berlapis</div>
    <p>Nama pendek diselesaikan lewat daftar <code>search</code> di <code>/etc/resolv.conf</code>, yang berarti beberapa kali kueri DNS gagal sebelum yang benar ditemukan. Pada aplikasi dengan trafik tinggi ini menambah latensi yang terukur. Untuk panggilan antar layanan yang panas, <strong>gunakan nama lengkap berakhiran titik</strong>: <code>layanan-pesanan.produksi.svc.cluster.local.</code> — titik di akhir mencegah pencarian tambahan sepenuhnya.</p>
</div>

<h2>Endpoint: Yang Sebenarnya Terjadi</h2>
<p>Service tidak ajaib. Sebuah controller mengawasi pod yang cocok dengan selector, dan memasukkan yang <strong>Ready</strong> ke dalam objek EndpointSlice. Itulah daftar tujuan yang dipakai kube-proxy.</p>

<pre>kubectl get endpointslices -l kubernetes.io/service-name=layanan-pesanan
kubectl describe svc layanan-pesanan</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Diagnosis pertama saat Service tidak bekerja</div>
    <p>Bila <code>kubectl describe svc</code> menampilkan <code>Endpoints: &lt;none&gt;</code>, masalahnya hampir selalu salah satu dari tiga hal ini: (1) <strong>selector tidak cocok</strong> dengan label pod, (2) <strong>tidak ada pod yang Ready</strong> karena readiness probe gagal, atau (3) <code>targetPort</code> tidak sesuai dengan port yang benar-benar didengarkan aplikasi. Periksa ketiganya sebelum menyalahkan jaringan.</p>
</div>

<h2>Headless Service</h2>
<pre>spec:
  clusterIP: None            # ← headless
  selector:
    app: basisdata</pre>

<p>Dengan <code>clusterIP: None</code>, DNS tidak mengembalikan satu IP virtual, melainkan <strong>daftar IP semua pod</strong>. Ini yang dipakai StatefulSet agar tiap replika bisa dialamati satu per satu — penting untuk database dan sistem yang butuh mengetahui anggota kluster secara individual.</p>

<h2>Menelusuri Masalah Jaringan</h2>
<pre># Pod sementara untuk mendiagnosis dari dalam kluster
kubectl run debug --rm -it --image=nicolaka/netshoot -- bash

# Di dalamnya:
nslookup layanan-pesanan.produksi.svc.cluster.local
curl -v http://layanan-pesanan/healthz
dig +search layanan-pesanan

# Meneruskan port ke mesin lokal — melewati Service sepenuhnya
kubectl port-forward svc/layanan-pesanan 8080:80
kubectl port-forward pod/pesanan-abc123 8080:8080</pre>

<div class="callout info">
    <div class="callout-judul">💡 Teknik isolasi masalah</div>
    <p>Bila <code>port-forward</code> ke <strong>pod</strong> berhasil tetapi ke <strong>Service</strong> gagal, masalahnya ada pada Service — biasanya selector atau targetPort. Bila port-forward ke pod juga gagal, masalahnya ada di aplikasi itu sendiri. Langkah sederhana ini memisahkan dua kemungkinan besar dalam satu menit.</p>
</div>`,
    perintah: [
        "kubectl get svc -o wide",
        "kubectl describe svc layanan-pesanan",
        "kubectl get endpointslices",
        "kubectl port-forward svc/layanan-pesanan 8080:80",
        "kubectl run debug --rm -it --image=nicolaka/netshoot -- bash"
    ],
    kuis: [
        {
            tanya: "kubectl describe svc menampilkan 'Endpoints: <none>'. Apa penyebab yang paling mungkin?",
            opsi: [
                "Kluster kehabisan alamat IP",
                "Selector Service tidak cocok dengan label pod, tidak ada pod yang Ready, atau targetPort salah",
                "CoreDNS sedang tidak berjalan",
                "Service perlu dibuat ulang setiap kali pod berubah"
            ],
            benar: 1,
            penjelasan: "Daftar endpoint diisi oleh controller yang mencocokkan label pod dengan selector Service, dan hanya memasukkan pod berstatus Ready. Endpoint kosong berarti tidak ada pod yang lolos kedua syarat itu, atau port tujuannya tidak sesuai dengan yang didengarkan aplikasi."
        },
        {
            tanya: "Mengapa membuat Service bertipe LoadBalancer untuk setiap layanan adalah pilihan yang buruk?",
            opsi: [
                "Karena LoadBalancer hanya mendukung protokol TCP",
                "Karena tiap LoadBalancer membuat load balancer cloud tersendiri dengan biaya dan IP publik masing-masing; pakai satu Ingress Controller sebagai gerbang bersama",
                "Karena Kubernetes membatasi maksimal tiga LoadBalancer per kluster",
                "Karena LoadBalancer tidak mendukung TLS"
            ],
            benar: 1,
            penjelasan: "Setiap Service LoadBalancer memicu penyediaan load balancer terkelola di penyedia cloud, lengkap dengan tagihan bulanan dan alamat IP publiknya sendiri. Pola yang hemat dan lebih mudah dikelola adalah satu Ingress Controller di belakang satu load balancer, yang merutekan ke banyak layanan berdasarkan host dan path."
        }
    ]
},
{
    id: 4,
    kategori: "2 · Jaringan",
    judul: "Ingress, Gateway API & TLS",
    tingkat: "Menengah", durasi: "16 mnt",
    tag: ["ingress", "gateway api", "tls", "cert-manager", "routing"],
    ringkas: "Mengekspos banyak layanan lewat satu titik masuk, mengelola sertifikat otomatis, dan mengenal Gateway API sebagai penerus Ingress.",
    isi: `
<h2>Ingress: Router HTTP untuk Kluster</h2>
<pre>Internet
   │
   ▼
LoadBalancer (satu saja)
   │
   ▼
Ingress Controller (nginx / Traefik / Kong / Envoy)
   │
   ├── toko.contoh.com/api    →  Service layanan-api
   ├── toko.contoh.com/       →  Service frontend
   └── admin.contoh.com/      →  Service dasbor-admin</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Objek Ingress tanpa controller tidak melakukan apa-apa</div>
    <p>Membuat objek Ingress saja tidak cukup — ia hanya sebuah catatan konfigurasi. Anda harus memasang <strong>Ingress Controller</strong> yang membacanya dan benar-benar merutekan trafik. Ini kebingungan pemula yang sangat umum: objek dibuat, statusnya terlihat normal, tetapi tidak ada yang bisa diakses.</p>
</div>

<pre>apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gerbang-toko
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  ingressClassName: nginx
  tls:
    - hosts: [toko.contoh.com]
      secretName: tls-toko
  rules:
    - host: toko.contoh.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: layanan-api
                port: { number: 80 }
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port: { number: 80 }</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Kelemahan mendasar Ingress: anotasi</div>
    <p>Spesifikasi Ingress hanya mencakup routing HTTP yang paling sederhana. Segala hal lain — pembatasan laju, penulisan ulang path, timeout, sesi lengket, pemisahan trafik untuk canary — dilakukan lewat <strong>anotasi khusus vendor</strong>. Akibatnya konfigurasi Anda terkunci pada satu controller: berpindah dari nginx ke Traefik berarti menulis ulang semua anotasi. Inilah alasan utama lahirnya Gateway API.</p>
</div>

<h2>Gateway API: Penerus Ingress</h2>
<pre>apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gerbang-utama
spec:
  gatewayClassName: nginx
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      hostname: "*.contoh.com"
      tls:
        certificateRefs:
          - name: tls-wildcard
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rute-api
spec:
  parentRefs:
    - name: gerbang-utama
  hostnames: ["toko.contoh.com"]
  rules:
    - matches:
        - path: { type: PathPrefix, value: /api }
      backendRefs:
        - name: layanan-api
          port: 80
          weight: 90            # pemisahan trafik BAWAAN
        - name: layanan-api-baru
          port: 80
          weight: 10            # canary 10%</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kenapa Gateway API lebih baik</div>
    <ul>
        <li><strong>Pemisahan peran.</strong> Tim platform mengelola <code>Gateway</code> (sertifikat, listener); tim aplikasi mengelola <code>HTTPRoute</code> masing-masing. Dengan Ingress, semuanya bercampur dalam satu objek.</li>
        <li><strong>Fitur menjadi bagian spesifikasi.</strong> Pembobotan trafik, pencocokan header, penulisan ulang, dan mirroring adalah field resmi — bukan anotasi vendor.</li>
        <li><strong>Lintas namespace yang aman.</strong> Route dari namespace lain hanya bisa menempel bila Gateway mengizinkannya secara eksplisit.</li>
        <li><strong>Bukan hanya HTTP.</strong> Ada <code>TCPRoute</code>, <code>TLSRoute</code>, dan <code>GRPCRoute</code>.</li>
    </ul>
</div>

<h2>Sertifikat Otomatis dengan cert-manager</h2>
<pre>apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@contoh.com
    privateKeySecretRef:
      name: letsencrypt-prod-akun
    solvers:
      - http01:
          ingress:
            ingressClassName: nginx</pre>

<p>Dengan anotasi <code>cert-manager.io/cluster-issuer</code> pada Ingress, cert-manager akan meminta sertifikat, menyelesaikan tantangan ACME, menyimpannya sebagai Secret, dan <strong>memperbaruinya otomatis</strong> sebelum kedaluwarsa. Sertifikat kedaluwarsa adalah penyebab pemadaman yang sangat umum dan sepenuhnya bisa dihindari.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Selalu uji di lingkungan staging Let's Encrypt dulu</div>
    <p>Let's Encrypt punya batas laju yang ketat: kegagalan berulang saat mencoba konfigurasi bisa membuat domain Anda diblokir selama berjam-jam. Pakai issuer <code>acme-staging-v02</code> sampai semuanya bekerja, baru pindah ke produksi.</p>
</div>

<h2>Masalah yang Sering Muncul</h2>
<table>
<thead><tr><th>Gejala</th><th>Penyebab yang biasa</th></tr></thead>
<tbody>
<tr><td>404 dari Ingress</td><td>Host tidak cocok, atau <code>ingressClassName</code> salah</td></tr>
<tr><td>502 Bad Gateway</td><td>Service tidak punya endpoint, atau port tujuan keliru</td></tr>
<tr><td>Peringatan sertifikat</td><td>Secret TLS di namespace yang berbeda dari Ingress</td></tr>
<tr><td>Redirect berulang tanpa henti</td><td>Aplikasi juga memaksa HTTPS padahal TLS sudah diakhiri di Ingress</td></tr>
<tr><td>Unggahan besar ditolak</td><td>Batas ukuran body bawaan controller terlalu kecil</td></tr>
</tbody>
</table>

<pre>kubectl get ingress
kubectl describe ingress gerbang-toko
kubectl logs -n ingress-nginx deploy/ingress-nginx-controller --tail=100
kubectl get certificate,certificaterequest,order,challenge -A</pre>`,
    perintah: [
        "kubectl get ingress -A",
        "kubectl describe ingress gerbang-toko",
        "kubectl get certificate -A",
        "kubectl get gateway,httproute -A",
        "kubectl logs -n ingress-nginx deploy/ingress-nginx-controller"
    ],
    kuis: [
        {
            tanya: "Objek Ingress sudah dibuat dan statusnya terlihat normal, tetapi tidak ada yang bisa mengaksesnya. Apa kemungkinan terbesarnya?",
            opsi: [
                "Ingress perlu waktu 24 jam untuk aktif",
                "Belum ada Ingress Controller yang terpasang; objek Ingress hanyalah konfigurasi yang butuh controller untuk menjalankannya",
                "Ingress hanya bekerja pada kluster berbayar",
                "Service harus bertipe LoadBalancer agar Ingress berfungsi"
            ],
            benar: 1,
            penjelasan: "Ingress adalah objek deklaratif tanpa perilaku bawaan. Sebuah Ingress Controller seperti nginx, Traefik, atau Kong harus dipasang untuk membaca objek tersebut dan mengonfigurasi proxy yang sesungguhnya. Tanpa controller, objek itu hanya tersimpan di etcd tanpa efek apa pun."
        },
        {
            tanya: "Apa keunggulan utama Gateway API dibanding Ingress?",
            opsi: [
                "Gateway API berjalan lebih cepat karena ditulis dalam Rust",
                "Fitur seperti pembobotan trafik dan pencocokan header adalah bagian resmi spesifikasi, bukan anotasi khusus vendor yang mengunci Anda pada satu controller",
                "Gateway API tidak memerlukan controller sama sekali",
                "Gateway API otomatis membuat sertifikat TLS tanpa cert-manager"
            ],
            benar: 1,
            penjelasan: "Spesifikasi Ingress sangat minim sehingga semua kebutuhan nyata dipenuhi lewat anotasi yang berbeda-beda tiap controller, membuat konfigurasi tidak portabel. Gateway API menjadikan kemampuan tersebut field resmi, sekaligus memisahkan tanggung jawab antara tim platform yang mengelola Gateway dan tim aplikasi yang mengelola Route."
        }
    ]
},
{
    id: 5,
    kategori: "3 · Konfigurasi",
    judul: "ConfigMap, Secret & Manajemen Rahasia",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["configmap", "secret", "env", "volume", "external secrets", "sealed secrets"],
    ringkas: "Memisahkan konfigurasi dari image, memahami bahwa Secret hanya di-encode base64, dan cara menyimpan rahasia dengan aman di Git.",
    isi: `
<h2>ConfigMap</h2>
<pre>apiVersion: v1
kind: ConfigMap
metadata:
  name: konfigurasi-pesanan
data:
  LOG_LEVEL: "info"
  MAKS_KONEKSI: "50"
  aplikasi.yaml: |
    server:
      port: 8080
      timeout: 30s
    fitur:
      checkout_baru: true</pre>

<h3>Dua Cara Memakainya</h3>
<pre># 1. Sebagai variabel lingkungan
env:
  - name: LOG_LEVEL
    valueFrom:
      configMapKeyRef:
        name: konfigurasi-pesanan
        key: LOG_LEVEL

# Atau seluruhnya sekaligus
envFrom:
  - configMapRef:
      name: konfigurasi-pesanan

# 2. Sebagai berkas di dalam volume
volumeMounts:
  - name: konfigurasi
    mountPath: /etc/aplikasi
    readOnly: true
volumes:
  - name: konfigurasi
    configMap:
      name: konfigurasi-pesanan</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Perbedaan penting antara env dan volume</div>
    <p>ConfigMap yang di-mount sebagai <strong>volume akan diperbarui otomatis</strong> ketika ConfigMap-nya berubah (dengan jeda sekitar satu menit). ConfigMap yang dipakai sebagai <strong>variabel lingkungan tidak pernah berubah</strong> setelah pod menyala — variabel lingkungan ditetapkan sekali saat proses dibuat.</p>
    <p>Karena itu, mengubah ConfigMap yang dipakai lewat <code>env</code> tidak berdampak apa-apa sampai pod dibuat ulang: <code>kubectl rollout restart deploy/nama</code>.</p>
</div>

<h2>Secret</h2>
<pre>apiVersion: v1
kind: Secret
metadata:
  name: kredensial-basisdata
type: Opaque
stringData:                 # stringData lebih nyaman: tidak perlu base64 manual
  DB_PASSWORD: rahasia-yang-sangat-kuat
  DB_USER: aplikasi</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Secret TIDAK dienkripsi secara bawaan</div>
    <p>Secret hanya di-<strong>encode base64</strong>, dan base64 bukan enkripsi — siapa pun bisa membalikkannya dalam satu detik:</p>
    <pre>kubectl get secret kredensial-basisdata -o jsonpath='{.data.DB_PASSWORD}' | base64 -d</pre>
    <p>Secret disimpan apa adanya di etcd. Agar benar-benar aman, Anda harus: (1) mengaktifkan <strong>enkripsi at-rest</strong> pada etcd, (2) membatasi akses lewat <strong>RBAC</strong> — perhatikan bahwa siapa pun yang boleh membuat pod pada dasarnya bisa membaca Secret di namespace itu, dan (3) mengambil rahasia dari <strong>manajer rahasia eksternal</strong>.</p>
</div>

<h2>Jangan Menaruh Rahasia di Git</h2>
<p>Manifest Kubernetes seharusnya berada di Git, tetapi Secret mentah jelas tidak boleh. Ada tiga pendekatan yang lazim:</p>

<h3>1. External Secrets Operator</h3>
<pre>apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: kredensial-basisdata
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-belakang
    kind: ClusterSecretStore
  target:
    name: kredensial-basisdata
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: produksi/basisdata
        property: password</pre>
<p>Rahasia yang sebenarnya tinggal di Vault, AWS Secrets Manager, atau sejenisnya. Yang masuk Git hanyalah <em>petunjuk</em> ke mana mengambilnya. Ini pendekatan yang paling dianjurkan untuk produksi.</p>

<h3>2. Sealed Secrets</h3>
<pre>kubeseal --format yaml &lt; secret.yaml &gt; sealed-secret.yaml</pre>
<p>Secret dienkripsi dengan kunci publik controller. Hasilnya aman disimpan di Git, dan <strong>hanya controller di kluster itu</strong> yang bisa membukanya. Cocok bila Anda belum punya manajer rahasia terpusat.</p>

<h3>3. SOPS</h3>
<pre>sops --encrypt --age $KUNCI_AGE secret.yaml &gt; secret.enc.yaml</pre>
<p>Mengenkripsi hanya bagian <em>nilai</em>, sehingga struktur YAML tetap terbaca dan diff di Git tetap bermakna.</p>

<h2>Memuat Ulang Konfigurasi Saat Berubah</h2>
<div class="callout tip">
    <div class="callout-judul">📌 Trik checksum anotasi</div>
    <pre>metadata:
  annotations:
    checksum/konfigurasi: "{{ sha256sum .Values.konfigurasi }}"</pre>
    <p>Dengan menaruh hash isi ConfigMap sebagai anotasi pada template pod, setiap perubahan konfigurasi mengubah spesifikasi pod — sehingga Kubernetes otomatis melakukan rolling update. Tanpa trik ini, Anda harus ingat menjalankan restart manual setiap kali mengubah konfigurasi, dan orang pasti lupa.</p>
</div>

<h2>Praktik yang Baik</h2>
<ul>
<li><strong>Satu ConfigMap per aplikasi</strong>, bukan satu raksasa untuk seluruh kluster.</li>
<li><strong>Jangan pernah menaruh rahasia di ConfigMap.</strong> ConfigMap sering terbaca luas dan ikut tercetak di log debug.</li>
<li><strong>Tandai volume Secret sebagai <code>readOnly: true</code></strong> dan atur <code>defaultMode: 0400</code>.</li>
<li><strong>Batasi RBAC untuk Secret</strong> — jangan berikan <code>get secrets</code> secara luas.</li>
<li><strong>Rotasi rahasia secara berkala</strong>, dan pastikan aplikasi bisa memuat ulang tanpa restart bila memungkinkan.</li>
</ul>`,
    perintah: [
        "kubectl create configmap konf --from-file=aplikasi.yaml",
        "kubectl get secret kredensial-basisdata -o yaml",
        "kubectl rollout restart deploy/layanan-pesanan",
        "kubectl describe configmap konfigurasi-pesanan",
        "kubectl get externalsecrets -A"
    ],
    kuis: [
        {
            tanya: "Anda mengubah nilai di ConfigMap yang dipakai lewat 'env' pada Deployment. Kenapa aplikasi tidak melihat nilai baru?",
            opsi: [
                "ConfigMap perlu dihapus dan dibuat ulang",
                "Variabel lingkungan ditetapkan sekali saat proses dibuat dan tidak pernah berubah; pod harus dibuat ulang dengan rollout restart",
                "Perubahan ConfigMap butuh waktu 24 jam untuk tersebar",
                "ConfigMap tidak bisa dipakai sebagai variabel lingkungan"
            ],
            benar: 1,
            penjelasan: "Variabel lingkungan disuntikkan saat kontainer dibuat dan bersifat tetap sepanjang umur proses. Hanya ConfigMap yang di-mount sebagai volume yang isinya diperbarui otomatis. Untuk konfigurasi lewat env, pod harus dibuat ulang, misalnya dengan kubectl rollout restart."
        },
        {
            tanya: "Kenapa Secret bawaan Kubernetes tidak boleh dianggap aman dengan sendirinya?",
            opsi: [
                "Karena Secret berukuran maksimal 1 MB",
                "Karena Secret hanya di-encode base64, bukan dienkripsi, sehingga siapa pun yang bisa membacanya dapat langsung memulihkan nilai aslinya",
                "Karena Secret otomatis terhapus setelah 30 hari",
                "Karena Secret hanya bisa dipakai oleh satu pod"
            ],
            benar: 1,
            penjelasan: "base64 adalah pengkodean, bukan enkripsi, dan bisa dibalik dengan satu perintah. Secret juga tersimpan apa adanya di etcd kecuali enkripsi at-rest diaktifkan. Perlindungan nyata datang dari enkripsi etcd, RBAC yang ketat, dan pengambilan rahasia dari manajer rahasia eksternal."
        }
    ]
},
{
    id: 6,
    kategori: "3 · Konfigurasi",
    judul: "Resource Request, Limit & Quality of Service",
    tingkat: "Menengah", durasi: "16 mnt",
    tag: ["resources", "request", "limit", "qos", "oomkilled", "throttling"],
    ringkas: "Perbedaan request dan limit, kenapa CPU limit sering merugikan, dan bagaimana kelas QoS menentukan pod mana yang dikorbankan saat node kehabisan memori.",
    isi: `
<h2>Request vs Limit</h2>
<table>
<thead><tr><th></th><th>Request</th><th>Limit</th></tr></thead>
<tbody>
<tr><td>Arti</td><td>Jaminan minimum</td><td>Batas maksimum</td></tr>
<tr><td>Dipakai untuk</td><td>Keputusan penjadwalan</td><td>Penegakan saat runtime</td></tr>
<tr><td>Bila terlampaui (CPU)</td><td>Boleh memakai lebih bila node senggang</td><td><strong>Di-throttle</strong> — proses dipaksa berhenti sesaat</td></tr>
<tr><td>Bila terlampaui (memori)</td><td>Boleh memakai lebih</td><td><strong>OOMKilled</strong> — kontainer dibunuh</td></tr>
</tbody>
</table>

<pre>resources:
  requests:
    cpu: 100m           # 100 milicore = 0,1 inti
    memory: 128Mi
  limits:
    memory: 512Mi
    # CPU limit sengaja tidak disetel — alasannya di bawah</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 CPU limit menyebabkan throttling yang merusak latensi</div>
    <p>CPU adalah sumber daya yang <em>bisa dikompres</em>. Ketika kontainer menyentuh limit CPU, kernel Linux (CFS) menghentikannya sampai periode kuota berikutnya — <strong>meskipun node masih punya CPU yang menganggur</strong>. Efeknya terasa langsung pada latensi p99: permintaan yang seharusnya selesai dalam 50 ms tiba-tiba butuh 150 ms karena prosesnya dijeda paksa.</p>
    <p><strong>Praktik yang banyak dianut sekarang:</strong> selalu setel <em>memory limit</em> (memori tidak bisa dikompres — kehabisan berarti OOM), tetapi hanya setel <em>CPU request</em> tanpa limit. Request sudah cukup menjamin pembagian yang adil saat node sibuk, sekaligus membiarkan aplikasi memanfaatkan kapasitas menganggur.</p>
</div>

<h2>Tiga Kelas Quality of Service</h2>
<table>
<thead><tr><th>Kelas</th><th>Syarat</th><th>Urutan diusir saat node kehabisan memori</th></tr></thead>
<tbody>
<tr><td><strong>Guaranteed</strong></td><td>request = limit untuk semua sumber daya di semua kontainer</td><td>Terakhir — paling terlindungi</td></tr>
<tr><td><strong>Burstable</strong></td><td>Ada request, tetapi tidak sama dengan limit</td><td>Kedua</td></tr>
<tr><td><strong>BestEffort</strong></td><td>Tidak ada request maupun limit sama sekali</td><td><strong>Pertama</strong> — paling dulu dikorbankan</td></tr>
</tbody>
</table>

<pre>kubectl get pod nama-pod -o jsonpath='{.status.qosClass}'</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Pod tanpa resources adalah bom waktu</div>
    <p>Pod tanpa request sama sekali masuk kelas <strong>BestEffort</strong> dan akan menjadi yang <em>pertama dibunuh</em> ketika node kehabisan memori. Lebih buruk lagi, penjadwal tidak punya informasi untuk menempatkannya dengan bijak, sehingga bisa menumpuk beban di node yang sudah padat. Selalu setel setidaknya <code>requests</code>.</p>
</div>

<h2>OOMKilled: Mendiagnosis dan Memperbaiki</h2>
<pre>kubectl describe pod nama-pod

# Yang perlu dicari:
#   Last State:  Terminated
#     Reason:    OOMKilled
#     Exit Code: 137

kubectl get events --sort-by=.lastTimestamp | grep OOM
kubectl top pods --sort-by=memory</pre>

<div class="callout info">
    <div class="callout-judul">💡 Menaikkan limit belum tentu jawabannya</div>
    <p>OOMKilled berulang biasanya berarti salah satu dari dua hal: <strong>ada kebocoran memori</strong> di aplikasi, atau <strong>runtime tidak menyadari batas kontainer</strong>. Yang kedua sangat umum:</p>
    <ul>
        <li><strong>Java:</strong> JVM modern menghormati cgroup, tetapi pastikan memakai <code>-XX:MaxRAMPercentage=75</code> alih-alih <code>-Xmx</code> tetap.</li>
        <li><strong>Node.js:</strong> setel <code>--max-old-space-size</code> sekitar 75% dari memory limit.</li>
        <li><strong>Go:</strong> setel <code>GOMEMLIMIT</code> agar garbage collector tahu batasnya.</li>
    </ul>
    <p>Tanpa itu, runtime mengira ia punya seluruh memori node dan baru menjalankan pembersihan ketika sudah terlambat.</p>
</div>

<h2>Menetapkan Batas di Tingkat Namespace</h2>
<pre>apiVersion: v1
kind: ResourceQuota
metadata:
  name: kuota-tim-a
  namespace: tim-a
spec:
  hard:
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.memory: 80Gi
    persistentvolumeclaims: "10"
    count/deployments.apps: "30"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: batas-bawaan
  namespace: tim-a
spec:
  limits:
    - type: Container
      default:                 # limit bila tidak disebutkan
        memory: 512Mi
      defaultRequest:          # request bila tidak disebutkan
        cpu: 100m
        memory: 128Mi
      max:
        memory: 4Gi</pre>

<div class="callout tip">
    <div class="callout-judul">📌 ResourceQuota dan LimitRange saling melengkapi</div>
    <p><strong>ResourceQuota</strong> membatasi total pemakaian sebuah namespace. <strong>LimitRange</strong> menetapkan nilai bawaan per kontainer sehingga pod tanpa <code>resources</code> tetap mendapat nilai yang wajar. Perhatikan bahwa bila ResourceQuota mengatur <code>requests.cpu</code>, maka <strong>setiap pod wajib menyebutkan request CPU</strong> atau akan ditolak — LimitRange menyelamatkan Anda dari keharusan menulisnya di setiap manifest.</p>
</div>

<h2>Menemukan Angka yang Tepat</h2>
<pre># Pemakaian nyata saat ini
kubectl top pods -n produksi --sort-by=memory
kubectl top nodes

# Vertical Pod Autoscaler dalam mode rekomendasi saja
kubectl get vpa layanan-pesanan -o yaml</pre>

<p>Alur yang praktis: mulai dengan perkiraan kasar, jalankan di bawah beban nyata selama beberapa hari, lalu setel <code>requests</code> mendekati pemakaian rata-rata (persentil 50–70) dan <code>memory limit</code> di sekitar puncak ditambah margin 30–50%. Request yang terlalu besar membuang kapasitas kluster; yang terlalu kecil membuat pod dijadwalkan ke node yang sebenarnya sudah penuh.</p>`,
    perintah: [
        "kubectl top pods --sort-by=memory",
        "kubectl top nodes",
        "kubectl describe pod nama-pod",
        "kubectl get resourcequota -A",
        "kubectl get pod nama-pod -o jsonpath='{.status.qosClass}'"
    ],
    kuis: [
        {
            tanya: "Kenapa menyetel CPU limit sering merugikan latensi aplikasi?",
            opsi: [
                "Karena CPU limit membuat pod tidak bisa dijadwalkan",
                "Karena kernel menghentikan proses saat menyentuh kuota meski node masih punya CPU menganggur, sehingga latensi p99 melonjak",
                "Karena CPU limit menyebabkan kontainer di-OOMKilled",
                "Karena CPU limit hanya bekerja pada node dengan lebih dari 8 inti"
            ],
            benar: 1,
            penjelasan: "CPU adalah sumber daya yang bisa dikompres, dan penegakannya dilakukan lewat throttling CFS. Ketika kuota dalam satu periode habis, proses dijeda sampai periode berikutnya walaupun ada kapasitas menganggur di node. Menyetel request tanpa limit tetap menjamin pembagian yang adil tanpa jeda paksa ini."
        },
        {
            tanya: "Sebuah pod tidak mencantumkan resources sama sekali. Apa konsekuensinya?",
            opsi: [
                "Pod tersebut mendapat prioritas tertinggi",
                "Pod masuk kelas BestEffort dan menjadi yang pertama diusir ketika node kehabisan memori",
                "Pod akan ditolak oleh penjadwal",
                "Pod otomatis mendapat 1 CPU dan 1 GB memori"
            ],
            benar: 1,
            penjelasan: "Tanpa request maupun limit, pod diklasifikasikan sebagai BestEffort — kelas dengan prioritas terendah saat kubelet harus mengusir pod karena tekanan memori. Penjadwal juga kehilangan informasi untuk menempatkannya secara bijak, sehingga beban bisa menumpuk di node yang sudah padat."
        }
    ]
},
{
    id: 7,
    kategori: "4 · Penyimpanan & Stateful",
    judul: "Volume, PVC & StatefulSet",
    tingkat: "Menengah", durasi: "17 mnt",
    tag: ["volume", "pvc", "storageclass", "statefulset", "headless"],
    ringkas: "Menyimpan data yang bertahan melampaui umur pod, memahami mode akses yang sering disalahpahami, dan kapan StatefulSet benar-benar dibutuhkan.",
    isi: `
<h2>Tiga Lapis Abstraksi Penyimpanan</h2>
<pre>StorageClass  →  cara menyediakan penyimpanan (SSD? HDD? terenkripsi?)
     │
PersistentVolume (PV)  →  potongan penyimpanan yang sebenarnya
     │
PersistentVolumeClaim (PVC)  →  permintaan dari aplikasi
     │
Pod  →  me-mount PVC sebagai direktori</pre>

<p>Di kluster modern, Anda hampir tidak pernah membuat PV secara manual. Anda membuat PVC, dan StorageClass menyediakan PV secara dinamis.</p>

<pre>apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-basisdata
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: ssd-cepat
  resources:
    requests:
      storage: 50Gi</pre>

<h2>Mode Akses yang Sering Disalahpahami</h2>
<table>
<thead><tr><th>Mode</th><th>Arti sebenarnya</th></tr></thead>
<tbody>
<tr><td><strong>ReadWriteOnce (RWO)</strong></td><td>Dapat di-mount baca-tulis oleh <strong>satu node</strong> — bukan satu pod. Beberapa pod di node yang sama bisa memakainya bersamaan.</td></tr>
<tr><td><strong>ReadOnlyMany (ROX)</strong></td><td>Dapat di-mount baca-saja oleh banyak node.</td></tr>
<tr><td><strong>ReadWriteMany (RWX)</strong></td><td>Dapat di-mount baca-tulis oleh banyak node. Butuh penyimpanan berbasis jaringan seperti NFS atau CephFS.</td></tr>
<tr><td><strong>ReadWriteOncePod</strong></td><td>Benar-benar hanya <strong>satu pod</strong>. Ini yang sering sebenarnya Anda inginkan untuk database.</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 RWO adalah penyebab pod Pending yang sangat umum</div>
    <p>Disk blok dari penyedia cloud (EBS, Persistent Disk) hampir selalu RWO — hanya bisa menempel pada satu node dalam satu waktu. Bila Deployment Anda punya 3 replika yang semuanya me-mount PVC RWO yang sama, hanya pod di node pertama yang berjalan; sisanya <strong>menggantung di Pending selamanya</strong>. Untuk beban kerja yang butuh penyimpanan bersama antar node, Anda perlu penyimpanan RWX seperti NFS — atau, yang biasanya lebih tepat, rancang ulang agar aplikasi tidak butuh berkas bersama sama sekali.</p>
</div>

<h2>StatefulSet</h2>
<p>Deployment memberi pod nama acak (<code>pesanan-7d4f-x9k2</code>) dan memperlakukan semuanya setara. Beberapa sistem tidak bisa hidup seperti itu — database perlu tahu siapa yang primer, dan tiap replika perlu penyimpanannya sendiri yang tetap.</p>

<pre>apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres-headless    # WAJIB
  replicas: 3
  selector:
    matchLabels: { app: postgres }
  template:
    metadata:
      labels: { app: postgres }
    spec:
      terminationGracePeriodSeconds: 60
      containers:
        - name: postgres
          image: postgres:17-alpine
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:             # PVC terpisah untuk TIAP replika
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        storageClassName: ssd-cepat
        resources:
          requests: { storage: 100Gi }</pre>

<h3>Yang Diberikan StatefulSet</h3>
<table>
<thead><tr><th>Jaminan</th><th>Penjelasan</th></tr></thead>
<tbody>
<tr><td><strong>Nama yang stabil</strong></td><td><code>postgres-0</code>, <code>postgres-1</code>, <code>postgres-2</code> — tetap sama setelah restart</td></tr>
<tr><td><strong>DNS per pod</strong></td><td><code>postgres-0.postgres-headless.ns.svc.cluster.local</code></td></tr>
<tr><td><strong>Penyimpanan yang melekat</strong></td><td>PVC <code>data-postgres-0</code> selalu kembali ke pod <code>postgres-0</code></td></tr>
<tr><td><strong>Urutan yang terjamin</strong></td><td>Dibuat 0→1→2, dihapus 2→1→0</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ PVC tidak ikut terhapus</div>
    <p>Menghapus StatefulSet <strong>tidak menghapus PVC-nya</strong> — ini disengaja, agar data tidak hilang karena kesalahan. Konsekuensinya, PVC bisa menumpuk tanpa disadari dan terus menagih biaya penyimpanan. Bersihkan secara sadar:</p>
    <pre>kubectl delete pvc -l app=postgres</pre>
</div>

<h2>Haruskah Database Dijalankan di Kubernetes?</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Pertimbangkan baik-baik</div>
    <p>Menjalankan database stateful di Kubernetes menuntut Anda menangani sendiri: failover dan pemilihan primer, backup beserta <em>uji pemulihan</em>, upgrade versi mayor, penyetelan parameter, dan pemantauan replikasi. Kubernetes tidak menyelesaikan satu pun dari itu — StatefulSet hanya menjamin identitas dan penyimpanan yang stabil.</p>
    <p><strong>Untuk sebagian besar tim, basis data terkelola dari penyedia cloud adalah pilihan yang jauh lebih bijak.</strong> Bila memang harus di Kubernetes, gunakan <strong>operator</strong> yang matang (CloudNativePG untuk PostgreSQL, Strimzi untuk Kafka) — jangan menulis StatefulSet mentah untuk database produksi.</p>
</div>

<h2>Jenis Volume Lain</h2>
<pre># emptyDir — hidup selama pod hidup, hilang saat pod mati
volumes:
  - name: sementara
    emptyDir:
      sizeLimit: 1Gi

# emptyDir di memori — sangat cepat, memakai RAM
  - name: cache-cepat
    emptyDir:
      medium: Memory
      sizeLimit: 256Mi

# Menyuntikkan metadata pod sebagai berkas
  - name: info-pod
    downwardAPI:
      items:
        - path: "nama-pod"
          fieldRef: { fieldPath: metadata.name }

# Menggabungkan beberapa sumber dalam satu mount
  - name: gabungan
    projected:
      sources:
        - configMap: { name: konfigurasi }
        - secret: { name: kredensial }</pre>

<pre>kubectl get pvc,pv
kubectl get storageclass
kubectl describe pvc data-basisdata
kubectl get statefulset postgres -o wide</pre>`,
    perintah: [
        "kubectl get pvc,pv",
        "kubectl get storageclass",
        "kubectl describe pvc data-basisdata",
        "kubectl get statefulset -A",
        "kubectl delete pvc -l app=postgres"
    ],
    kuis: [
        {
            tanya: "Deployment dengan 3 replika me-mount satu PVC ber-mode ReadWriteOnce. Apa yang terjadi?",
            opsi: [
                "Ketiga pod berjalan normal dan berbagi penyimpanan",
                "Hanya pod di node yang berhasil menempelkan volume yang berjalan; sisanya menggantung di status Pending",
                "Kubernetes otomatis membuat salinan PVC untuk tiap replika",
                "Deployment akan ditolak saat dibuat"
            ],
            benar: 1,
            penjelasan: "ReadWriteOnce berarti volume hanya bisa ditempelkan ke satu node dalam satu waktu. Pod yang dijadwalkan ke node lain tidak bisa mendapatkan volume tersebut dan tetap Pending. Untuk penyimpanan bersama antar node dibutuhkan mode ReadWriteMany, atau aplikasi dirancang agar tidak memerlukan berkas bersama."
        },
        {
            tanya: "Apa yang terjadi pada PVC ketika sebuah StatefulSet dihapus?",
            opsi: [
                "PVC ikut terhapus bersama seluruh datanya",
                "PVC sengaja dipertahankan agar data tidak hilang, sehingga harus dibersihkan secara manual bila memang tidak diperlukan lagi",
                "PVC otomatis dipindahkan ke namespace default",
                "PVC menjadi read-only"
            ],
            benar: 1,
            penjelasan: "Kubernetes mempertahankan PVC yang dibuat lewat volumeClaimTemplates sebagai pengaman terhadap penghapusan yang tidak disengaja. Data tetap utuh sehingga StatefulSet bisa dibuat ulang dan langsung menemukan penyimpanannya. Konsekuensinya, PVC yang benar-benar tidak dipakai harus dihapus manual agar tidak terus menagih biaya."
        }
    ]
},
{
    id: 8,
    kategori: "5 · Keamanan",
    judul: "RBAC, ServiceAccount & Pod Security",
    tingkat: "Menengah", durasi: "16 mnt",
    tag: ["rbac", "role", "rolebinding", "serviceaccount", "securitycontext", "psa"],
    ringkas: "Menerapkan hak akses terkecil untuk manusia maupun aplikasi, dan mengeraskan pod dengan security context serta Pod Security Admission.",
    isi: `
<h2>Empat Objek RBAC</h2>
<table>
<thead><tr><th>Objek</th><th>Cakupan</th><th>Fungsi</th></tr></thead>
<tbody>
<tr><td><strong>Role</strong></td><td>Satu namespace</td><td>Kumpulan izin</td></tr>
<tr><td><strong>ClusterRole</strong></td><td>Seluruh kluster</td><td>Kumpulan izin lintas namespace</td></tr>
<tr><td><strong>RoleBinding</strong></td><td>Satu namespace</td><td>Memberikan Role/ClusterRole ke subjek</td></tr>
<tr><td><strong>ClusterRoleBinding</strong></td><td>Seluruh kluster</td><td>Memberikan ClusterRole secara global</td></tr>
</tbody>
</table>

<pre>apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: produksi
  name: pembaca-pod
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: produksi
  name: dev-boleh-baca
subjects:
  - kind: User
    name: budi@contoh.com
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pembaca-pod
  apiGroup: rbac.authorization.k8s.io</pre>

<div class="callout info">
    <div class="callout-judul">💡 ClusterRole bisa dipakai dengan RoleBinding</div>
    <p>Kombinasi yang sangat berguna: definisikan izin <strong>sekali</strong> sebagai ClusterRole, lalu berikan <strong>per namespace</strong> lewat RoleBinding. Anda tidak perlu menyalin Role yang sama ke dua puluh namespace, sementara cakupan izinnya tetap terbatas pada namespace masing-masing.</p>
</div>

<h2>ServiceAccount untuk Aplikasi</h2>
<pre>apiVersion: v1
kind: ServiceAccount
metadata:
  name: sa-pesanan
  namespace: produksi
automountServiceAccountToken: false   # matikan bila tidak butuh akses API
---
spec:
  serviceAccountName: sa-pesanan</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Setiap pod mendapat token API secara bawaan</div>
    <p>Tanpa konfigurasi apa pun, Kubernetes memasang token ServiceAccount <code>default</code> ke dalam setiap pod di <code>/var/run/secrets/kubernetes.io/serviceaccount/</code>. Bila aplikasi Anda diretas, penyerang langsung punya kredensial untuk berbicara dengan API server. <strong>Sebagian besar aplikasi tidak butuh akses API sama sekali</strong> — setel <code>automountServiceAccountToken: false</code> dan hilangkan seluruh jalur serangan itu.</p>
</div>

<h2>Menguji Izin</h2>
<pre># Apakah SAYA boleh melakukan ini?
kubectl auth can-i delete pods -n produksi
kubectl auth can-i '*' '*' --all-namespaces

# Apakah ORANG LAIN boleh? (butuh hak admin)
kubectl auth can-i get secrets -n produksi --as=budi@contoh.com

# Apakah SERVICEACCOUNT boleh?
kubectl auth can-i list pods -n produksi \\
  --as=system:serviceaccount:produksi:sa-pesanan

# Daftar lengkap izin
kubectl auth can-i --list -n produksi</pre>

<h2>Security Context</h2>
<pre>spec:
  securityContext:                   # tingkat pod
    runAsNonRoot: true
    runAsUser: 10001
    runAsGroup: 10001
    fsGroup: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: api
      securityContext:               # tingkat kontainer
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        privileged: false
        capabilities:
          drop: ["ALL"]
      volumeMounts:
        - name: tmp
          mountPath: /tmp            # perlu, karena root fs read-only
  volumes:
    - name: tmp
      emptyDir: {}</pre>

<div class="callout tip">
    <div class="callout-judul">📌 readOnlyRootFilesystem sangat efektif</div>
    <p>Dengan filesystem root yang tidak bisa ditulisi, penyerang tidak dapat menaruh skrip, binary, atau alat apa pun ke dalam kontainer. Ini memutus banyak rantai serangan sekaligus. Yang perlu diperhatikan: sediakan <code>emptyDir</code> untuk direktori yang memang harus bisa ditulisi seperti <code>/tmp</code> dan direktori cache aplikasi.</p>
</div>

<h2>Pod Security Admission</h2>
<p>PodSecurityPolicy sudah dihapus sejak Kubernetes 1.25. Penggantinya adalah <strong>Pod Security Admission</strong> yang jauh lebih sederhana: cukup label pada namespace.</p>

<pre>apiVersion: v1
kind: Namespace
metadata:
  name: produksi
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted</pre>

<table>
<thead><tr><th>Profil</th><th>Arti</th></tr></thead>
<tbody>
<tr><td><code>privileged</code></td><td>Tanpa pembatasan</td></tr>
<tr><td><code>baseline</code></td><td>Mencegah eskalasi hak yang paling jelas</td></tr>
<tr><td><code>restricted</code></td><td>Pengerasan penuh: wajib non-root, semua capability dibuang, seccomp aktif</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Terapkan bertahap</div>
    <p>Langsung menyetel <code>enforce: restricted</code> pada namespace yang sudah berisi beban kerja akan membuat pod baru ditolak dan rilis gagal. Mulailah dengan <code>warn</code> dan <code>audit</code> saja untuk melihat apa yang akan melanggar, perbaiki manifest yang bermasalah, baru aktifkan <code>enforce</code>.</p>
</div>

<h2>NetworkPolicy</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Secara bawaan, semua pod bisa menghubungi semua pod</div>
    <p>Kubernetes tidak punya isolasi jaringan bawaan. Pod di namespace mana pun bisa membuka koneksi ke pod mana pun, termasuk langsung ke database. NetworkPolicy mengubah itu — tetapi hanya bila plugin jaringan Anda mendukungnya (Calico, Cilium; beberapa CNI sederhana mengabaikannya diam-diam).</p>
</div>

<pre>apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tolak-semua-masuk
  namespace: produksi
spec:
  podSelector: {}          # berlaku untuk SEMUA pod
  policyTypes: [Ingress]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: izinkan-api-ke-basisdata
  namespace: produksi
spec:
  podSelector:
    matchLabels: { app: postgres }
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector:
            matchLabels: { app: layanan-pesanan }
      ports:
        - protocol: TCP
          port: 5432</pre>

<p>Pola yang dianjurkan: mulai dengan kebijakan tolak-semua di tiap namespace, lalu buka jalur yang memang dibutuhkan satu per satu. Jangan lupa mengizinkan DNS ke <code>kube-system</code>, karena tanpa itu semua resolusi nama akan gagal.</p>`,
    perintah: [
        "kubectl auth can-i --list -n produksi",
        "kubectl auth can-i get secrets --as=system:serviceaccount:produksi:sa-pesanan",
        "kubectl get role,rolebinding -n produksi",
        "kubectl get networkpolicy -A",
        "kubectl get ns --show-labels"
    ],
    kuis: [
        {
            tanya: "Kenapa automountServiceAccountToken sebaiknya dimatikan untuk sebagian besar aplikasi?",
            opsi: [
                "Karena token tersebut memakan banyak memori",
                "Karena token API terpasang di setiap pod secara bawaan, sehingga aplikasi yang diretas langsung memberi penyerang kredensial untuk berbicara dengan API server",
                "Karena token menyebabkan pod gagal menyala",
                "Karena token hanya berlaku selama 5 menit"
            ],
            benar: 1,
            penjelasan: "Kubernetes memasang token ServiceAccount ke dalam filesystem setiap pod tanpa diminta. Sebagian besar aplikasi tidak pernah memanggil API Kubernetes, sehingga token itu murni menjadi permukaan serangan tambahan. Mematikannya menghilangkan jalur eskalasi tanpa mengorbankan apa pun."
        },
        {
            tanya: "Apa yang terjadi pada lalu lintas antar pod bila tidak ada NetworkPolicy sama sekali?",
            opsi: [
                "Semua lalu lintas antar namespace diblokir secara bawaan",
                "Semua pod dapat menghubungi semua pod lain, termasuk lintas namespace, karena Kubernetes tidak punya isolasi jaringan bawaan",
                "Hanya pod dalam Deployment yang sama yang bisa saling terhubung",
                "Lalu lintas hanya diizinkan melalui Service"
            ],
            benar: 1,
            penjelasan: "Model jaringan Kubernetes bersifat datar dan permisif: setiap pod dapat menjangkau setiap pod lain secara langsung. NetworkPolicy adalah mekanisme untuk membatasinya, tetapi hanya berlaku bila plugin CNI yang dipakai mendukungnya — beberapa CNI sederhana mengabaikan objek tersebut tanpa peringatan."
        }
    ]
},
{
    id: 9,
    kategori: "6 · Penskalaan",
    judul: "HPA, VPA & Cluster Autoscaler",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["hpa", "vpa", "autoscaler", "keda", "metrics server"],
    ringkas: "Menskalakan jumlah pod berdasarkan metrik, menyesuaikan ukuran pod secara otomatis, dan menambah node saat kapasitas habis.",
    isi: `
<h2>Tiga Sumbu Penskalaan</h2>
<table>
<thead><tr><th>Alat</th><th>Menskalakan</th><th>Kapan dipakai</th></tr></thead>
<tbody>
<tr><td><strong>HPA</strong></td><td>Jumlah pod (horizontal)</td><td>Beban naik-turun; aplikasi stateless</td></tr>
<tr><td><strong>VPA</strong></td><td>Ukuran request/limit pod</td><td>Menemukan ukuran yang tepat; beban stabil</td></tr>
<tr><td><strong>Cluster Autoscaler</strong></td><td>Jumlah node</td><td>Pod Pending karena kluster kehabisan kapasitas</td></tr>
</tbody>
</table>

<h2>Horizontal Pod Autoscaler</h2>
<pre>apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: hpa-pesanan
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: layanan-pesanan
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Percent
          value: 100          # boleh menggandakan
          periodSeconds: 30
    scaleDown:
      stabilizationWindowSeconds: 300   # turun perlahan
      policies:
        - type: Percent
          value: 20
          periodSeconds: 60</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 HPA tidak bekerja tanpa resource request</div>
    <p><code>averageUtilization: 70</code> berarti "70% dari <strong>request</strong>", bukan 70% dari kapasitas node. Bila kontainer tidak punya <code>requests.cpu</code>, HPA tidak punya angka pembanding dan statusnya akan menampilkan <code>&lt;unknown&gt;</code> selamanya. Ini penyebab nomor satu HPA yang "tidak jalan". Anda juga perlu <strong>metrics-server</strong> terpasang.</p>
</div>

<div class="callout tip">
    <div class="callout-judul">📌 Kenapa scaleDown harus jauh lebih lambat</div>
    <p>Menaikkan kapasitas terlalu lambat berarti pengguna merasakan lambatnya sistem. Menurunkan kapasitas terlalu cepat menyebabkan <em>flapping</em>: pod dimatikan, beban per pod naik, HPA menambah lagi, berulang tanpa henti. Jendela stabilisasi turun yang panjang (5 menit atau lebih) membuat sistem tenang, dan biaya beberapa pod tambahan selama beberapa menit jauh lebih murah daripada ketidakstabilan.</p>
</div>

<h2>Menskalakan Berdasarkan Metrik Kustom</h2>
<pre>metrics:
  # Panjang antrean per pod
  - type: External
    external:
      metric:
        name: rabbitmq_queue_messages
        selector:
          matchLabels: { queue: pesanan }
      target:
        type: AverageValue
        averageValue: "30"

  # Permintaan per detik per pod
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"</pre>

<div class="callout info">
    <div class="callout-judul">💡 CPU sering bukan metrik yang tepat</div>
    <p>Untuk pekerja yang mengonsumsi antrean, <strong>panjang antrean</strong> jauh lebih bermakna daripada CPU — pekerja yang menunggu I/O punya CPU rendah padahal antrean menumpuk. Untuk API, <strong>permintaan per detik</strong> atau <strong>latensi p95</strong> lebih mencerminkan pengalaman pengguna. <strong>KEDA</strong> memperluas HPA dengan puluhan sumber metrik siap pakai: Kafka, RabbitMQ, Redis, Prometheus, antrean cloud, bahkan jadwal cron.</p>
</div>

<h2>Vertical Pod Autoscaler</h2>
<pre>apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: vpa-pesanan
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: layanan-pesanan
  updatePolicy:
    updateMode: "Off"        # hanya memberi rekomendasi
  resourcePolicy:
    containerPolicies:
      - containerName: api
        minAllowed: { cpu: 50m, memory: 64Mi }
        maxAllowed: { cpu: 2, memory: 2Gi }</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ VPA dan HPA berebut kendali</div>
    <p>Memakai VPA mode <code>Auto</code> bersama HPA berbasis CPU pada Deployment yang sama akan saling mengganggu: VPA menaikkan request, yang menurunkan persentase utilisasi, yang membuat HPA mengurangi replika — lalu berputar. Pakai <strong>VPA dalam mode <code>Off</code></strong> untuk mendapatkan rekomendasi ukuran, terapkan sendiri, dan biarkan HPA yang mengurus jumlah replika.</p>
</div>

<h2>Cluster Autoscaler</h2>
<p>Ketika pod tidak bisa dijadwalkan karena tidak ada node yang punya kapasitas cukup, Cluster Autoscaler menambah node baru. Ketika node kosong cukup lama, ia menghapusnya.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Yang menghambat penghapusan node</div>
    <p>Cluster Autoscaler tidak akan menghapus node yang menjalankan: pod tanpa controller (dibuat langsung, bukan lewat Deployment), pod dengan <code>PodDisruptionBudget</code> yang tidak terpenuhi, pod dengan penyimpanan lokal, atau pod dengan anotasi <code>cluster-autoscaler.kubernetes.io/safe-to-evict: "false"</code>. Bila tagihan cloud Anda tidak turun saat trafik sepi, periksa hal-hal ini lebih dulu.</p>
</div>

<h2>Menskalakan ke Nol</h2>
<p>HPA bawaan punya <code>minReplicas</code> minimal 1 — selalu ada pod yang berjalan dan menagih biaya. Untuk beban kerja yang benar-benar sepi di luar jam kerja, <strong>KEDA</strong> bisa menskalakan sampai nol dan menyalakan kembali begitu ada pesan masuk atau permintaan pertama datang.</p>

<pre>kubectl get hpa
kubectl describe hpa hpa-pesanan
kubectl get --raw /apis/metrics.k8s.io/v1beta1/nodes | jq
kubectl top pods
kubectl get events --field-selector reason=FailedScheduling</pre>`,
    perintah: [
        "kubectl get hpa",
        "kubectl describe hpa hpa-pesanan",
        "kubectl top pods",
        "kubectl get events --field-selector reason=FailedScheduling",
        "kubectl get vpa"
    ],
    kuis: [
        {
            tanya: "HPA menampilkan target '<unknown>/70%' dan tidak pernah menskalakan. Apa penyebab yang paling umum?",
            opsi: [
                "Deployment memakai terlalu banyak replika",
                "Kontainer tidak menyetel resources.requests.cpu, sehingga HPA tidak punya nilai dasar untuk menghitung persentase utilisasi",
                "HPA hanya bekerja pada StatefulSet",
                "Versi Kubernetes terlalu baru"
            ],
            benar: 1,
            penjelasan: "Target utilisasi HPA dihitung sebagai persentase dari resource request, bukan dari kapasitas node. Tanpa request, tidak ada penyebut untuk perhitungan itu sehingga metriknya tetap unknown. Penyebab kedua yang sering terjadi adalah metrics-server yang belum terpasang di kluster."
        },
        {
            tanya: "Kenapa jendela stabilisasi untuk scaleDown sebaiknya jauh lebih panjang daripada scaleUp?",
            opsi: [
                "Karena menghapus pod memerlukan waktu lebih lama secara teknis",
                "Untuk mencegah flapping: penurunan yang terlalu cepat menaikkan beban per pod, yang memicu penambahan lagi, berulang tanpa henti",
                "Karena Kubernetes membatasi kecepatan penghapusan pod",
                "Karena scaleDown memerlukan persetujuan Cluster Autoscaler"
            ],
            benar: 1,
            penjelasan: "Beban yang turun sesaat bisa saja hanya jeda sementara. Menurunkan replika terlalu agresif membuat beban terkonsentrasi di pod yang tersisa, memicu penambahan kembali, dan siklus ini berulang. Menaikkan kapasitas boleh cepat karena risikonya hanya biaya sementara, sedangkan menurunkan sebaiknya perlahan demi kestabilan."
        }
    ]
},
{
    id: 10,
    kategori: "7 · Operasi",
    judul: "Penjadwalan: Affinity, Taint & Topology Spread",
    tingkat: "Lanjutan", durasi: "15 mnt",
    tag: ["scheduler", "affinity", "taint", "toleration", "topology spread", "pdb"],
    ringkas: "Mengendalikan di mana pod ditempatkan: menyebar replika antar zona, memisahkan beban kerja, dan menjaga ketersediaan saat pemeliharaan node.",
    isi: `
<h2>Kenapa Penempatan Itu Penting</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Tiga replika di satu node bukan ketersediaan tinggi</div>
    <p>Penjadwal berusaha menyebarkan pod, tetapi tanpa aturan eksplisit ia bisa saja menempatkan ketiga replika Anda di node yang sama. Satu node mati, layanan Anda mati — padahal Anda mengira sudah punya tiga replika. Ini penemuan yang menyakitkan saat insiden pertama.</p>
</div>

<h2>Topology Spread Constraints</h2>
<pre>spec:
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: topology.kubernetes.io/zone
      whenUnsatisfiable: DoNotSchedule
      labelSelector:
        matchLabels: { app: layanan-pesanan }

    - maxSkew: 1
      topologyKey: kubernetes.io/hostname
      whenUnsatisfiable: ScheduleAnyway   # lebih longgar
      labelSelector:
        matchLabels: { app: layanan-pesanan }</pre>

<table>
<thead><tr><th>Field</th><th>Arti</th></tr></thead>
<tbody>
<tr><td><code>maxSkew</code></td><td>Selisih maksimum jumlah pod antar domain topologi</td></tr>
<tr><td><code>topologyKey</code></td><td>Label node yang menjadi pembeda domain (zona, hostname, rak)</td></tr>
<tr><td><code>DoNotSchedule</code></td><td>Aturan keras — pod tetap Pending bila tak terpenuhi</td></tr>
<tr><td><code>ScheduleAnyway</code></td><td>Aturan lunak — diusahakan, tapi tetap dijadwalkan</td></tr>
</tbody>
</table>

<div class="callout tip">
    <div class="callout-judul">📌 Pola yang seimbang</div>
    <p>Gunakan <code>DoNotSchedule</code> untuk penyebaran antar <strong>zona</strong> (ini yang benar-benar melindungi dari kegagalan besar) dan <code>ScheduleAnyway</code> untuk penyebaran antar <strong>node</strong>. Dua aturan keras sekaligus sering membuat pod tidak bisa dijadwalkan sama sekali di kluster kecil.</p>
</div>

<h2>Node Affinity</h2>
<pre>affinity:
  nodeAffinity:
    # Syarat KERAS
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: node.kubernetes.io/instance-type
              operator: In
              values: [m6i.xlarge, m6i.2xlarge]

    # PREFERENSI lunak
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80
        preference:
          matchExpressions:
            - key: topology.kubernetes.io/zone
              operator: In
              values: [ap-southeast-1a]</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Arti "IgnoredDuringExecution"</div>
    <p>Nama panjang itu bermakna: aturan hanya diperiksa <strong>saat penjadwalan</strong>. Bila label node berubah setelah pod berjalan, pod <em>tidak</em> akan dipindahkan. Kubernetes tidak melakukan penjadwalan ulang secara otomatis untuk pod yang sudah berjalan.</p>
</div>

<h2>Pod Anti-Affinity</h2>
<pre>affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          topologyKey: kubernetes.io/hostname
          labelSelector:
            matchLabels: { app: layanan-pesanan }</pre>

<p>Artinya: "usahakan jangan menempatkan pod ini di node yang sudah punya pod dengan label yang sama". Untuk penyebaran sederhana, <strong>topology spread constraints lebih dianjurkan</strong> karena lebih murah secara komputasi — anti-affinity harus membandingkan setiap pod dengan setiap node dan menjadi lambat di kluster besar.</p>

<h2>Taint dan Toleration</h2>
<p>Affinity adalah pod yang memilih node. Taint adalah kebalikannya: <strong>node yang menolak pod</strong>.</p>

<pre># Menandai node khusus GPU
kubectl taint nodes node-gpu-1 khusus=gpu:NoSchedule

# Hanya pod dengan toleration ini yang boleh masuk
tolerations:
  - key: khusus
    operator: Equal
    value: gpu
    effect: NoSchedule</pre>

<table>
<thead><tr><th>Effect</th><th>Perilaku</th></tr></thead>
<tbody>
<tr><td><code>NoSchedule</code></td><td>Pod baru tanpa toleration ditolak</td></tr>
<tr><td><code>PreferNoSchedule</code></td><td>Diusahakan dihindari, tapi tidak dipaksakan</td></tr>
<tr><td><code>NoExecute</code></td><td>Pod yang sudah berjalan pun <strong>diusir</strong></td></tr>
</tbody>
</table>

<div class="callout info">
    <div class="callout-judul">💡 Kombinasi untuk node khusus yang benar</div>
    <p>Taint saja hanya mencegah pod lain masuk — ia tidak menarik pod GPU Anda ke sana. Untuk node khusus, gunakan <strong>keduanya</strong>: <em>taint</em> agar beban kerja umum menjauh, dan <em>node affinity</em> agar beban kerja GPU memang mengarah ke sana.</p>
</div>

<h2>PodDisruptionBudget</h2>
<pre>apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: pdb-pesanan
spec:
  minAvailable: 2            # atau maxUnavailable: 1
  selector:
    matchLabels: { app: layanan-pesanan }</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Tanpa PDB, satu perintah drain bisa mematikan layanan</div>
    <p>Saat memutakhirkan node, <code>kubectl drain</code> mengusir semua pod dari node tersebut. Bila ketiga replika Anda kebetulan berada di node itu, semuanya diusir sekaligus dan layanan mati sampai pod terjadwal ulang di tempat lain. PDB memberi tahu Kubernetes berapa banyak yang <strong>wajib tetap hidup</strong>, sehingga proses drain menunggu alih-alih mengusir semuanya.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ PDB hanya berlaku untuk gangguan TERENCANA</div>
    <p>PDB melindungi dari <code>drain</code>, penskalaan node, dan operasi pemeliharaan lainnya. Ia <strong>tidak</strong> melindungi dari node yang mati mendadak, kehabisan memori, atau kegagalan perangkat keras. Untuk itu, andalkan jumlah replika yang memadai dan penyebaran antar zona.</p>
    <p>Perhatikan juga: PDB dengan <code>minAvailable</code> sama dengan jumlah replika akan <strong>memblokir drain selamanya</strong> — pastikan selalu ada ruang gerak.</p>
</div>

<pre>kubectl get pods -o wide --sort-by=.spec.nodeName
kubectl get pdb -A
kubectl describe node node-1 | grep -A5 Taints
kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data
kubectl uncordon node-1</pre>`,
    perintah: [
        "kubectl get pods -o wide --sort-by=.spec.nodeName",
        "kubectl get pdb -A",
        "kubectl describe node node-1",
        "kubectl drain node-1 --ignore-daemonsets",
        "kubectl uncordon node-1"
    ],
    kuis: [
        {
            tanya: "Kenapa PodDisruptionBudget penting sebelum melakukan pemutakhiran node?",
            opsi: [
                "Karena PDB mempercepat proses drain",
                "Karena tanpa PDB, drain bisa mengusir seluruh replika yang kebetulan berada di node yang sama sekaligus, sehingga layanan mati",
                "Karena PDB otomatis membuat replika cadangan",
                "Karena PDB diperlukan agar node bisa di-cordon"
            ],
            benar: 1,
            penjelasan: "Perintah drain mengusir semua pod dari sebuah node. Bila penyebaran pod tidak diatur, beberapa atau seluruh replika bisa berada di node yang sama dan hilang bersamaan. PDB menyatakan jumlah minimum yang wajib tetap tersedia, sehingga drain akan menunggu pod pengganti siap sebelum melanjutkan."
        },
        {
            tanya: "Apa arti akhiran 'IgnoredDuringExecution' pada aturan node affinity?",
            opsi: [
                "Aturan tersebut diabaikan sepenuhnya oleh penjadwal",
                "Aturan hanya diperiksa saat penjadwalan; bila label node berubah setelah pod berjalan, pod tidak akan dipindahkan",
                "Aturan hanya berlaku pada pod yang sedang dieksekusi",
                "Aturan diabaikan bila kluster sedang sibuk"
            ],
            benar: 1,
            penjelasan: "Penjadwal mengevaluasi aturan affinity sekali, yaitu ketika menempatkan pod. Setelah pod berjalan, perubahan pada label node tidak memicu evaluasi ulang maupun pemindahan. Kubernetes tidak melakukan penjadwalan ulang otomatis untuk pod yang sudah berjalan."
        }
    ]
},
{
    id: 11,
    kategori: "7 · Operasi",
    judul: "Diagnosis Masalah: Dari CrashLoopBackOff sampai Pending",
    tingkat: "Menengah", durasi: "17 mnt",
    tag: ["debug", "crashloopbackoff", "pending", "imagepullbackoff", "events", "logs"],
    ringkas: "Alur kerja sistematis untuk mendiagnosis pod yang bermasalah, beserta arti sebenarnya dari status-status yang paling sering muncul.",
    isi: `
<h2>Urutan Diagnosis yang Selalu Berhasil</h2>
<pre>1. kubectl get pods                  → apa statusnya?
2. kubectl describe pod NAMA         → bagian Events di bawah
3. kubectl logs NAMA                 → log aplikasi
4. kubectl logs NAMA --previous      → log dari kontainer yang MATI
5. kubectl get events --sort-by=.lastTimestamp
6. kubectl exec -it NAMA -- sh       → periksa dari dalam</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Bagian Events adalah yang paling sering menjawab</div>
    <p>Orang cenderung langsung membaca log aplikasi, padahal bagian <strong>Events</strong> di bawah keluaran <code>describe</code> biasanya sudah menyebutkan penyebabnya dengan jelas: gagal menarik image, tidak ada node yang cocok, volume gagal ditempelkan, probe gagal. Baca itu dulu.</p>
</div>

<h2>CrashLoopBackOff</h2>
<p>Artinya kontainer menyala lalu mati berulang kali, dan Kubernetes menunggu semakin lama sebelum mencoba lagi (10 detik, 20, 40, sampai 5 menit).</p>

<pre>kubectl logs NAMA --previous     # ← kunci utamanya
kubectl describe pod NAMA | grep -A10 "Last State"</pre>

<table>
<thead><tr><th>Exit code</th><th>Arti</th></tr></thead>
<tbody>
<tr><td><strong>0</strong></td><td>Keluar normal — tetapi kontainer <em>tidak boleh</em> keluar. Biasanya perintahnya salah, misalnya proses berjalan di latar lalu shell selesai.</td></tr>
<tr><td><strong>1</strong></td><td>Error aplikasi — periksa log</td></tr>
<tr><td><strong>137</strong></td><td>SIGKILL — hampir selalu <strong>OOMKilled</strong></td></tr>
<tr><td><strong>139</strong></td><td>Segmentation fault</td></tr>
<tr><td><strong>143</strong></td><td>SIGTERM — dimatikan dengan anggun</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Penyebab yang sering terlewat</div>
    <ul>
        <li><strong>Konfigurasi hilang.</strong> Aplikasi gagal menyala karena variabel lingkungan wajib tidak ada — periksa apakah ConfigMap atau Secret yang dirujuk benar-benar ada.</li>
        <li><strong>Liveness probe terlalu agresif.</strong> Aplikasi butuh 40 detik untuk menyala, tetapi probe mulai memeriksa pada detik ke-10 dan membunuhnya sebelum sempat siap. Gunakan <code>startupProbe</code> untuk aplikasi yang lambat menyala.</li>
        <li><strong>Izin berkas.</strong> Berjalan sebagai non-root tetapi mencoba menulis ke direktori milik root.</li>
        <li><strong>Dependensi belum siap.</strong> Aplikasi mati karena tidak bisa terhubung ke database saat menyala — sebaiknya aplikasi mencoba lagi alih-alih langsung menyerah.</li>
    </ul>
</div>

<h2>Pending</h2>
<pre>kubectl describe pod NAMA | grep -A20 Events</pre>

<table>
<thead><tr><th>Pesan</th><th>Penyebab</th></tr></thead>
<tbody>
<tr><td><code>Insufficient cpu/memory</code></td><td>Tidak ada node dengan kapasitas cukup untuk request-nya</td></tr>
<tr><td><code>node(s) had untolerated taint</code></td><td>Node punya taint, pod tidak punya toleration</td></tr>
<tr><td><code>didn't match Pod's node affinity</code></td><td>Aturan affinity terlalu ketat</td></tr>
<tr><td><code>pod has unbound PersistentVolumeClaims</code></td><td>PVC belum ter-bind — periksa StorageClass</td></tr>
<tr><td><code>didn't match pod topology spread constraints</code></td><td>Aturan penyebaran tidak bisa dipenuhi</td></tr>
</tbody>
</table>

<h2>ImagePullBackOff</h2>
<pre>kubectl describe pod NAMA | grep -i "failed to pull"</pre>
<ul>
<li><strong>Nama atau tag salah ketik.</strong> Penyebab paling umum, dan paling memalukan.</li>
<li><strong>Registry privat tanpa kredensial.</strong> Butuh <code>imagePullSecrets</code>.</li>
<li><strong>Arsitektur tidak cocok.</strong> Image arm64 di node amd64 — sering terjadi bila image dibangun di laptop Apple Silicon.</li>
<li><strong>Batas laju registry.</strong> Docker Hub membatasi tarikan anonim.</li>
</ul>

<pre>kubectl create secret docker-registry regcred \\
  --docker-server=registry.contoh.com \\
  --docker-username=USER --docker-password=PASS

# lalu di spec pod:
imagePullSecrets:
  - name: regcred</pre>

<h2>Pod Running tapi Tidak Ready</h2>
<pre>kubectl get pod NAMA -o jsonpath='{.status.conditions}' | jq
kubectl describe pod NAMA | grep -A5 Readiness</pre>
<p>Readiness probe gagal. Periksa: apakah path dan port-nya benar? Apakah aplikasi butuh waktu lebih lama dari <code>initialDelaySeconds</code>? Apakah endpoint kesehatan itu sendiri memeriksa dependensi yang sedang bermasalah?</p>

<h2>Perkakas Diagnosis Lanjutan</h2>
<pre># Kontainer sementara di dalam pod yang sedang berjalan —
# sangat berguna untuk image distroless yang tidak punya shell
kubectl debug -it pod/NAMA --image=nicolaka/netshoot --target=api

# Salinan pod dengan perintah diganti — berguna bila pod terus crash
kubectl debug pod/NAMA -it --copy-to=debug-pod --container=api -- sh

# Shell di node itu sendiri
kubectl debug node/node-1 -it --image=busybox

# Semua log dari sebuah Deployment sekaligus
kubectl logs -l app=layanan-pesanan --all-containers --tail=200 -f

# Melihat manifest lengkap termasuk field yang diisi Kubernetes
kubectl get pod NAMA -o yaml

# Menguji perubahan tanpa menerapkannya
kubectl apply -f manifest.yaml --dry-run=server
kubectl diff -f manifest.yaml</pre>

<div class="callout info">
    <div class="callout-judul">💡 <code>kubectl diff</code> sebelum <code>apply</code></div>
    <p>Perintah ini menampilkan persis apa yang akan berubah bila manifest diterapkan. Menjadikannya kebiasaan mencegah kejutan seperti pengurangan replika yang tidak disengaja atau perubahan yang ternyata membuat seluruh pod dibuat ulang di jam sibuk.</p>
</div>

<h2>Ketika Node yang Bermasalah</h2>
<pre>kubectl get nodes
kubectl describe node node-1

# Perhatikan bagian Conditions:
#   MemoryPressure   True   ← node kehabisan memori
#   DiskPressure     True   ← disk hampir penuh
#   PIDPressure      True   ← terlalu banyak proses
#   Ready            False  ← kubelet tidak melapor

kubectl top nodes
kubectl get pods -A --field-selector spec.nodeName=node-1</pre>`,
    perintah: [
        "kubectl describe pod NAMA",
        "kubectl logs NAMA --previous",
        "kubectl get events --sort-by=.lastTimestamp",
        "kubectl debug -it pod/NAMA --image=nicolaka/netshoot",
        "kubectl diff -f manifest.yaml"
    ],
    kuis: [
        {
            tanya: "Sebuah pod berstatus CrashLoopBackOff. Perintah mana yang paling penting dijalankan untuk mengetahui penyebabnya?",
            opsi: [
                "kubectl logs NAMA — untuk melihat log kontainer yang sekarang",
                "kubectl logs NAMA --previous — karena kontainer yang gagal sudah mati dan log-nya hanya bisa dibaca dengan flag ini",
                "kubectl delete pod NAMA — agar dibuat ulang",
                "kubectl top pod NAMA"
            ],
            benar: 1,
            penjelasan: "Dalam keadaan CrashLoopBackOff, kontainer yang berisi pesan kesalahan sudah berhenti dan Kubernetes sedang menunggu sebelum mencoba lagi. Log kontainer saat ini biasanya kosong atau baru dimulai. Flag --previous menampilkan keluaran dari instansi kontainer sebelumnya, tempat penyebab kegagalan sebenarnya tercatat."
        },
        {
            tanya: "Sebuah kontainer keluar dengan exit code 137. Apa artinya?",
            opsi: [
                "Aplikasi keluar secara normal",
                "Kontainer menerima SIGKILL, yang hampir selalu berarti OOMKilled karena melewati batas memori",
                "Terjadi kesalahan konfigurasi jaringan",
                "Image gagal ditarik dari registry"
            ],
            benar: 1,
            penjelasan: "Exit code 137 berasal dari 128 ditambah sinyal 9 (SIGKILL). Di Kubernetes, penyebab yang paling umum adalah kontainer melampaui memory limit sehingga dibunuh paksa oleh kernel. Periksa bagian Last State pada describe, dan pertimbangkan apakah masalahnya batas yang terlalu kecil atau runtime yang tidak menyadari batas cgroup."
        }
    ]
},
{
    id: 12,
    kategori: "8 · Pengelolaan",
    judul: "Helm, Kustomize & GitOps",
    tingkat: "Lanjutan", durasi: "16 mnt",
    tag: ["helm", "kustomize", "argocd", "gitops", "template"],
    ringkas: "Mengelola manifest untuk banyak lingkungan tanpa menyalin YAML, dan menjadikan Git sebagai satu-satunya sumber kebenaran keadaan kluster.",
    isi: `
<h2>Masalahnya: YAML yang Berlipat Ganda</h2>
<p>Anda punya tiga lingkungan — dev, staging, produksi — dengan manifest yang 90% sama. Menyalin dan menempel berarti setiap perubahan harus dilakukan tiga kali, dan cepat atau lambat salah satunya terlewat.</p>

<h2>Helm: Template dengan Nilai</h2>
<pre>bagan-saya/
├── Chart.yaml
├── values.yaml              # nilai bawaan
├── values-produksi.yaml     # penimpa untuk produksi
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── _helpers.tpl</pre>

<pre># templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "bagan-saya.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}</pre>

<pre>helm install toko ./bagan-saya -f values-produksi.yaml
helm upgrade toko ./bagan-saya --set image.tag=2.5.0
helm rollback toko 3
helm list
helm history toko

# SELALU periksa hasilnya sebelum menerapkan
helm template toko ./bagan-saya -f values-produksi.yaml
helm diff upgrade toko ./bagan-saya    # butuh plugin helm-diff</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Kelemahan Helm: template Go pada YAML</div>
    <p>Helm melakukan substitusi teks pada YAML, dan YAML sangat sensitif terhadap indentasi. Kesalahan <code>nindent</code> menghasilkan pesan kesalahan yang membingungkan tentang baris yang bahkan tidak Anda tulis. Bagan yang rumit dengan banyak kondisi bersarang menjadi sangat sulit dibaca. <strong>Selalu jalankan <code>helm template</code></strong> untuk melihat YAML akhir yang sebenarnya.</p>
</div>

<h2>Kustomize: Menambal, Bukan Menempel</h2>
<pre>base/
├── kustomization.yaml
├── deployment.yaml
└── service.yaml
overlays/
├── staging/
│   ├── kustomization.yaml
│   └── tambal-replika.yaml
└── produksi/
    ├── kustomization.yaml
    └── tambal-sumberdaya.yaml</pre>

<pre># overlays/produksi/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: produksi
resources:
  - ../../base
replicas:
  - name: layanan-pesanan
    count: 5
images:
  - name: registry.contoh.com/pesanan
    newTag: 2.4.0
patches:
  - path: tambal-sumberdaya.yaml
configMapGenerator:
  - name: konfigurasi-aplikasi
    literals:
      - LOG_LEVEL=warn</pre>

<pre>kubectl kustomize overlays/produksi        # lihat hasilnya
kubectl apply -k overlays/produksi</pre>

<div class="callout info">
    <div class="callout-judul">💡 Helm atau Kustomize?</div>
    <p><strong>Helm</strong> unggul untuk mendistribusikan perangkat lunak ke orang lain — semua chart pihak ketiga (Prometheus, cert-manager, ingress-nginx) memakai Helm. Ia punya konsep rilis, riwayat, dan rollback.</p>
    <p><strong>Kustomize</strong> unggul untuk manifest aplikasi Anda sendiri — tidak ada bahasa template yang harus dipelajari, YAML-nya tetap YAML yang valid dan bisa dibaca. Ia sudah terpasang di dalam kubectl.</p>
    <p>Banyak tim memakai <strong>keduanya</strong>: Helm untuk komponen pihak ketiga, Kustomize untuk aplikasi sendiri. Itu kombinasi yang sangat wajar.</p>
</div>

<h2>GitOps</h2>
<pre>Cara lama (push):
  Pipeline CI  ──kubectl apply──&gt;  Kluster
  ⚠️ CI butuh kredensial kluster
  ⚠️ Tidak ada yang tahu bila seseorang mengubah kluster secara manual

GitOps (pull):
  Git  &lt;──terus-menerus dibandingkan──  Agen di dalam kluster
  ✅ Kluster menarik sendiri; tidak ada kredensial di CI
  ✅ Perubahan manual otomatis dikembalikan
  ✅ Git menjadi catatan audit yang lengkap</pre>

<pre>apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: layanan-pesanan
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/manifest.git
    targetRevision: main
    path: overlays/produksi
  destination:
    server: https://kubernetes.default.svc
    namespace: produksi
  syncPolicy:
    automated:
      prune: true          # hapus objek yang sudah dibuang dari Git
      selfHeal: true       # kembalikan perubahan manual
    syncOptions:
      - CreateNamespace=true</pre>

<div class="callout tip">
    <div class="callout-judul">📌 selfHeal mengubah budaya kerja</div>
    <p>Dengan <code>selfHeal: true</code>, perubahan yang dilakukan langsung ke kluster akan otomatis dikembalikan ke keadaan yang tertulis di Git. Awalnya terasa mengganggu — perbaikan darurat Anda hilang dalam hitungan detik. Tetapi justru itu intinya: <strong>kluster tidak lagi bisa menyimpang diam-diam</strong>, dan setiap perubahan harus melewati Git sehingga selalu ada catatan siapa mengubah apa dan kenapa.</p>
</div>

<h2>Memisahkan Repositori</h2>
<pre>repo-aplikasi/          repo-manifest/
├── src/                ├── base/
├── Dockerfile          └── overlays/
└── .github/workflows/      ├── staging/
                            └── produksi/

CI di repo aplikasi:
  1. build & uji
  2. bangun image, dorong ke registry
  3. perbarui tag image di repo-manifest
  4. Argo CD melihat perubahan, menerapkannya</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Kenapa dipisah</div>
    <p>Bila manifest berada di repo aplikasi yang sama, langkah "perbarui tag image" akan membuat commit baru yang memicu pipeline CI lagi — dan bisa berputar tanpa henti. Pemisahan juga memungkinkan tim platform mengelola manifest tanpa akses ke kode sumber, dan riwayat Git repo manifest menjadi catatan deploy yang bersih.</p>
</div>

<h2>Praktik yang Baik</h2>
<ul>
<li><strong>Jangan pernah menaruh rahasia mentah</strong> di repo manifest — pakai External Secrets atau Sealed Secrets.</li>
<li><strong>Sematkan versi chart pihak ketiga.</strong> <code>version: 15.2.1</code>, bukan rentang terbuka.</li>
<li><strong>Validasi di CI</strong> dengan <code>kubeconform</code> atau <code>kubectl apply --dry-run=server</code>.</li>
<li><strong>Terapkan kebijakan</strong> dengan Kyverno atau OPA Gatekeeper: tolak image <code>:latest</code>, wajibkan resource request, larang pod istimewa.</li>
<li><strong>Pantau drift.</strong> Aplikasi Argo CD yang terus berstatus OutOfSync adalah gejala ada yang mengubah kluster secara manual.</li>
</ul>`,
    perintah: [
        "helm template toko ./bagan-saya",
        "helm list -A",
        "kubectl kustomize overlays/produksi",
        "kubectl apply -k overlays/produksi",
        "kubectl get applications -n argocd"
    ],
    kuis: [
        {
            tanya: "Apa keunggulan utama pendekatan GitOps model pull dibanding CI yang menjalankan kubectl apply?",
            opsi: [
                "Prosesnya jauh lebih cepat",
                "Kredensial kluster tidak perlu disimpan di CI, dan agen di dalam kluster terus mengembalikan perubahan manual sehingga kluster tidak menyimpang dari Git",
                "GitOps tidak memerlukan pipeline CI sama sekali",
                "GitOps menghapus kebutuhan akan registry image"
            ],
            benar: 1,
            penjelasan: "Pada model push, sistem CI harus memegang kredensial dengan hak tinggi ke kluster produksi. Pada model pull, agen di dalam kluster yang menarik dari Git, sehingga tidak ada kredensial keluar. Rekonsiliasi terus-menerus juga membuat perubahan manual otomatis dikembalikan, dan Git menjadi catatan audit yang lengkap."
        },
        {
            tanya: "Kenapa manifest sebaiknya berada di repositori terpisah dari kode aplikasi pada alur GitOps?",
            opsi: [
                "Karena Argo CD tidak bisa membaca repositori yang berisi kode sumber",
                "Karena commit pembaruan tag image akan memicu pipeline CI lagi bila berada di repo yang sama, berpotensi berputar tanpa henti",
                "Karena manifest harus selalu bersifat publik",
                "Karena Kubernetes menolak manifest dari repo yang berisi Dockerfile"
            ],
            benar: 1,
            penjelasan: "Langkah terakhir pipeline biasanya menulis tag image baru ke manifest. Bila manifest berada di repo yang sama, commit itu memicu pipeline lagi. Pemisahan juga memberi riwayat deploy yang bersih dan memungkinkan tim platform mengelola manifest tanpa perlu akses ke kode sumber."
        }
    ]
},
{
    id: 13,
    kategori: "8 · Pengelolaan",
    judul: "Job, CronJob & DaemonSet",
    tingkat: "Menengah", durasi: "13 mnt",
    tag: ["job", "cronjob", "daemonset", "batch", "init container"],
    ringkas: "Beban kerja yang bukan layanan: tugas sekali jalan, tugas terjadwal, dan agen yang harus ada di setiap node.",
    isi: `
<h2>Job: Sekali Jalan Sampai Selesai</h2>
<pre>apiVersion: batch/v1
kind: Job
metadata:
  name: migrasi-basisdata
spec:
  backoffLimit: 3            # coba ulang maksimal 3 kali
  activeDeadlineSeconds: 600 # batas waktu keseluruhan
  ttlSecondsAfterFinished: 3600   # hapus otomatis setelah 1 jam
  template:
    spec:
      restartPolicy: Never   # atau OnFailure — TIDAK BOLEH Always
      containers:
        - name: migrasi
          image: registry.contoh.com/pesanan:2.4.0
          command: ["./migrate", "up"]</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan lupa ttlSecondsAfterFinished</div>
    <p>Tanpa ini, setiap Job yang selesai beserta pod-nya <strong>tetap tersimpan selamanya</strong> di kluster. Sebuah CronJob yang berjalan tiap lima menit akan menumpuk ribuan objek dalam sebulan, membebani etcd dan membuat <code>kubectl get pods</code> tidak terbaca.</p>
</div>

<h3>Job Paralel</h3>
<pre>spec:
  completions: 100      # total pekerjaan yang harus selesai
  parallelism: 10       # berapa yang berjalan bersamaan

# Atau mode indeks — tiap pod tahu nomor dirinya
  completionMode: Indexed
  # Tersedia sebagai variabel JOB_COMPLETION_INDEX</pre>

<h2>CronJob</h2>
<pre>apiVersion: batch/v1
kind: CronJob
metadata:
  name: laporan-harian
spec:
  schedule: "0 7 * * 1-5"          # 07:00 Senin–Jumat
  timeZone: "Asia/Jakarta"
  concurrencyPolicy: Forbid        # jangan tumpang tindih
  startingDeadlineSeconds: 300
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      backoffLimit: 2
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: laporan
              image: registry.contoh.com/laporan:1.2.0</pre>

<table>
<thead><tr><th>concurrencyPolicy</th><th>Perilaku bila jadwal tiba saat yang sebelumnya masih jalan</th></tr></thead>
<tbody>
<tr><td><code>Allow</code></td><td>Jalankan bersamaan (bawaan) — sering menyebabkan masalah</td></tr>
<tr><td><code>Forbid</code></td><td>Lewati jadwal ini</td></tr>
<tr><td><code>Replace</code></td><td>Hentikan yang lama, mulai yang baru</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 concurrencyPolicy bawaan adalah Allow</div>
    <p>Bila sebuah laporan biasanya selesai dalam 3 menit tetapi suatu hari melambat menjadi 20 menit, dengan jadwal tiap 5 menit Anda akan punya empat proses berjalan bersamaan — saling berebut database dan mungkin menghasilkan data ganda. Untuk hampir semua tugas terjadwal, <code>Forbid</code> adalah pilihan yang benar.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ CronJob memberi jaminan at-least-once, bukan exactly-once</div>
    <p>Dalam keadaan tertentu — control plane sibuk, node bermasalah — sebuah jadwal bisa terlewat atau terjadi dua kali. Tugas terjadwal Anda <strong>harus idempoten</strong>. Jangan menulis tugas yang mengasumsikan ia berjalan tepat satu kali, terutama untuk hal seperti penagihan.</p>
</div>

<h2>DaemonSet</h2>
<p>Menjalankan tepat satu pod di <strong>setiap node</strong> — dipakai untuk agen infrastruktur.</p>

<pre>apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: pengumpul-log
spec:
  selector:
    matchLabels: { app: pengumpul-log }
  template:
    metadata:
      labels: { app: pengumpul-log }
    spec:
      tolerations:
        - operator: Exists       # jalan di SEMUA node, termasuk yang ber-taint
      containers:
        - name: agen
          image: grafana/alloy:latest
          volumeMounts:
            - name: log-kontainer
              mountPath: /var/log/containers
              readOnly: true
      volumes:
        - name: log-kontainer
          hostPath:
            path: /var/log/containers</pre>

<p>Kegunaan umum: pengumpul log (Alloy, Fluent Bit), eksportir metrik (node-exporter), plugin jaringan (Calico, Cilium), driver penyimpanan CSI, dan agen keamanan.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Toleration untuk node control plane</div>
    <p>Node control plane biasanya diberi taint agar beban kerja biasa tidak ditempatkan di sana. Bila agen pemantauan Anda perlu ikut memantau node tersebut, DaemonSet-nya harus punya toleration yang sesuai — kalau tidak, ada bagian kluster yang tidak terpantau tanpa Anda sadari.</p>
</div>

<h2>Init Container</h2>
<pre>spec:
  initContainers:
    - name: tunggu-basisdata
      image: busybox:1.36
      command:
        - sh
        - -c
        - |
          until nc -z postgres 5432; do
            echo "menunggu basis data…"
            sleep 2
          done

    - name: jalankan-migrasi
      image: registry.contoh.com/pesanan:2.4.0
      command: ["./migrate", "up"]

  containers:
    - name: api
      image: registry.contoh.com/pesanan:2.4.0</pre>

<p>Init container berjalan <strong>berurutan sampai selesai</strong> sebelum kontainer utama dimulai. Bila salah satu gagal, pod di-restart dan seluruh rangkaian diulang.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Migrasi database di init container itu berbahaya</div>
    <p>Deployment dengan 3 replika berarti <strong>3 pod menjalankan migrasi secara bersamaan</strong>. Sebagian alat migrasi punya penguncian dan akan aman; sebagian lagi akan merusak skema. Cara yang benar: jalankan migrasi sebagai <strong>Job terpisah</strong> sebelum rilis — atau, dalam Helm, sebagai <em>pre-upgrade hook</em>. Init container hanya tepat untuk menunggu kesiapan dependensi.</p>
</div>

<pre>kubectl get jobs,cronjobs
kubectl get pods -l job-name=migrasi-basisdata
kubectl logs job/migrasi-basisdata
kubectl create job --from=cronjob/laporan-harian uji-manual
kubectl patch cronjob laporan-harian -p '{"spec":{"suspend":true}}'</pre>`,
    perintah: [
        "kubectl get jobs,cronjobs -A",
        "kubectl logs job/migrasi-basisdata",
        "kubectl create job --from=cronjob/laporan-harian uji-manual",
        "kubectl get daemonset -A",
        "kubectl patch cronjob laporan-harian -p '{\"spec\":{\"suspend\":true}}'"
    ],
    kuis: [
        {
            tanya: "Kenapa menjalankan migrasi database di dalam init container Deployment berbahaya?",
            opsi: [
                "Karena init container tidak bisa mengakses jaringan",
                "Karena setiap replika menjalankan init container-nya sendiri, sehingga migrasi dijalankan bersamaan oleh beberapa pod",
                "Karena init container tidak bisa memakai image yang sama dengan kontainer utama",
                "Karena migrasi selalu gagal di dalam kontainer"
            ],
            benar: 1,
            penjelasan: "Init container berjalan pada setiap pod. Deployment dengan tiga replika akan menjalankan tiga proses migrasi secara paralel terhadap database yang sama. Cara yang benar adalah menjalankan migrasi sebagai Job tersendiri sebelum rilis; init container sebaiknya hanya dipakai untuk menunggu kesiapan dependensi."
        },
        {
            tanya: "CronJob berjadwal tiap 5 menit, tetapi suatu hari tugasnya melambat menjadi 20 menit. Dengan pengaturan bawaan, apa yang terjadi?",
            opsi: [
                "Jadwal berikutnya otomatis dilewati",
                "Beberapa Job berjalan bersamaan karena concurrencyPolicy bawaan adalah Allow, sehingga bisa saling berebut sumber daya atau menghasilkan data ganda",
                "CronJob otomatis dinonaktifkan",
                "Kubernetes memperpanjang interval jadwal secara otomatis"
            ],
            benar: 1,
            penjelasan: "Nilai bawaan concurrencyPolicy adalah Allow, yang mengizinkan eksekusi bertumpuk. Untuk tugas yang menyentuh database atau menghasilkan laporan, ini bisa menimbulkan kerusakan data. Setel Forbid agar jadwal yang tiba saat eksekusi sebelumnya masih berjalan cukup dilewati."
        }
    ]
},
{
    id: 14,
    kategori: "8 · Pengelolaan",
    judul: "Observability & Kesiapan Produksi",
    tingkat: "Lanjutan", durasi: "15 mnt",
    ringkas: "Menggabungkan metrik, log, dan trace di kluster, lalu memeriksa daftar kesiapan sebelum beban kerja benar-benar melayani pengguna.",
    tag: ["prometheus", "loki", "tempo", "alloy", "checklist", "produksi"],
    isi: `
<h2>Tumpukan Observability yang Lazim</h2>
<pre>Aplikasi (instrumentasi OpenTelemetry)
   │
   ▼
Grafana Alloy (DaemonSet)  ← mengumpulkan metrik, log, trace
   │        │        │
   ▼        ▼        ▼
Prometheus  Loki   Tempo
   └────────┴────────┘
            ▼
         Grafana</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Grafana Agent dan Promtail sudah tidak dikembangkan</div>
    <p>Banyak tutorial masih memakai <strong>Grafana Agent</strong> atau <strong>Promtail</strong>. Keduanya sudah berakhir masa dukungannya. Penggantinya adalah <strong>Grafana Alloy</strong>, distribusi OpenTelemetry Collector yang juga memahami konfigurasi Prometheus dan komponen <code>loki.source.*</code> untuk pengumpulan log.</p>
</div>

<h2>Memasang dengan kube-prometheus-stack</h2>
<pre>helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install pemantauan prometheus-community/kube-prometheus-stack \\
  -n pemantauan --create-namespace \\
  --version 66.2.1 \\
  -f nilai-pemantauan.yaml</pre>

<p>Chart ini sekaligus memasang Prometheus, Alertmanager, Grafana, node-exporter, kube-state-metrics, beserta puluhan dasbor dan aturan alert yang sudah matang. Untuk sebagian besar kluster, ini titik awal yang jauh lebih baik daripada merakit sendiri.</p>

<h2>ServiceMonitor: Scrape secara Deklaratif</h2>
<pre>apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: layanan-pesanan
  labels:
    release: pemantauan      # HARUS cocok dengan selector Prometheus
spec:
  selector:
    matchLabels:
      app: layanan-pesanan
  endpoints:
    - port: metrics
      path: /metrics
      interval: 30s</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Bila metrik tidak muncul, periksa label ini dulu</div>
    <p>Prometheus Operator hanya mengambil ServiceMonitor yang cocok dengan <code>serviceMonitorSelector</code> miliknya — biasanya berdasarkan label <code>release</code>. ServiceMonitor tanpa label yang tepat akan diabaikan sepenuhnya tanpa pesan kesalahan apa pun. Periksa dengan <code>kubectl get prometheus -o yaml | grep -A5 serviceMonitorSelector</code>.</p>
</div>

<h2>Metrik Kubernetes yang Wajib Dipantau</h2>
<pre># Pod yang restart berulang
increase(kube_pod_container_status_restarts_total[15m]) &gt; 3

# Pod tidak Ready lebih dari 10 menit
kube_pod_status_ready{condition="false"} == 1

# Pod mendekati memory limit
container_memory_working_set_bytes
  / kube_pod_container_resource_limits{resource="memory"} &gt; 0.9

# CPU di-throttle
rate(container_cpu_cfs_throttled_seconds_total[5m]) &gt; 0.5

# Node hampir kehabisan sumber daya
kube_node_status_condition{condition="MemoryPressure",status="true"} == 1

# PVC hampir penuh
kubelet_volume_stats_available_bytes
  / kubelet_volume_stats_capacity_bytes &lt; 0.1

# Sertifikat akan kedaluwarsa
certmanager_certificate_expiration_timestamp_seconds - time() &lt; 7*24*3600</pre>

<div class="callout info">
    <div class="callout-judul">💡 Beri alert pada gejala, bukan penyebab</div>
    <p>Alert "CPU node 85%" jarang berguna — bisa jadi itu memang pemakaian normal. Yang benar-benar perlu membangunkan orang di tengah malam adalah hal yang <strong>dirasakan pengguna</strong>: tingkat error naik, latensi p99 melewati ambang, antrean menumpuk. Metrik sumber daya berguna sebagai konteks saat menyelidiki, bukan sebagai pemicu alert.</p>
</div>

<h2>Daftar Periksa Kesiapan Produksi</h2>

<h3>Beban Kerja</h3>
<table>
<thead><tr><th>Periksa</th><th>Kenapa</th></tr></thead>
<tbody>
<tr><td>Resource request &amp; memory limit disetel</td><td>Penjadwalan yang benar; menghindari kelas BestEffort</td></tr>
<tr><td>Liveness, readiness, dan startup probe ada</td><td>Penyembuhan otomatis dan rilis tanpa error</td></tr>
<tr><td>Liveness <strong>tidak</strong> memeriksa dependensi eksternal</td><td>Mencegah seluruh pod dibunuh saat dependensi lambat</td></tr>
<tr><td>Tag image spesifik, bukan <code>:latest</code></td><td>Rilis dapat direproduksi</td></tr>
<tr><td>Minimal 2 replika untuk layanan penting</td><td>Satu replika berarti pasti ada downtime saat rilis</td></tr>
<tr><td>PodDisruptionBudget terpasang</td><td>Melindungi saat pemeliharaan node</td></tr>
<tr><td>Topology spread antar zona</td><td>Bertahan dari kegagalan satu zona</td></tr>
<tr><td><code>preStop</code> dan grace period diatur</td><td>Menghindari 502 saat rilis</td></tr>
<tr><td>Aplikasi menangani SIGTERM</td><td>Menyelesaikan permintaan yang sedang berjalan</td></tr>
</tbody>
</table>

<h3>Keamanan</h3>
<table>
<tbody>
<tr><td><code>runAsNonRoot: true</code>, UID numerik</td><td>Membatasi dampak bila kontainer diretas</td></tr>
<tr><td><code>readOnlyRootFilesystem: true</code></td><td>Penyerang tidak bisa menaruh berkas</td></tr>
<tr><td><code>capabilities.drop: ["ALL"]</code></td><td>Mencabut hak istimewa kernel</td></tr>
<tr><td><code>automountServiceAccountToken: false</code></td><td>Menghapus kredensial API yang tak dibutuhkan</td></tr>
<tr><td>Pod Security Admission <code>restricted</code></td><td>Penegakan di tingkat namespace</td></tr>
<tr><td>NetworkPolicy tolak-semua sebagai dasar</td><td>Membatasi pergerakan lateral</td></tr>
<tr><td>Rahasia dari manajer rahasia eksternal</td><td>Tidak ada rahasia di Git</td></tr>
<tr><td>Image dipindai di pipeline CI</td><td>Menangkap CVE sebelum produksi</td></tr>
</tbody>
</table>

<h3>Operasi</h3>
<table>
<tbody>
<tr><td>Metrik, log, dan trace terhubung lewat trace_id</td><td>Investigasi insiden dari menit, bukan jam</td></tr>
<tr><td>Alert mengarah pada gejala yang dirasakan pengguna</td><td>Mengurangi kelelahan akibat alert palsu</td></tr>
<tr><td>Backup etcd terjadwal <strong>dan pemulihannya diuji</strong></td><td>Backup yang belum pernah diuji bukan backup</td></tr>
<tr><td>Prosedur rollback tertulis dan pernah dilatih</td><td>Insiden bukan waktu yang tepat untuk belajar</td></tr>
<tr><td>Manifest di Git, diterapkan lewat GitOps</td><td>Dapat diaudit dan direproduksi</td></tr>
<tr><td>Rencana upgrade kluster berkala</td><td>Versi Kubernetes hanya didukung sekitar satu tahun</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Dua hal yang paling sering diabaikan</div>
    <p><strong>1. Backup etcd yang tidak pernah diuji pemulihannya.</strong> Banyak tim rajin membuat backup tetapi tidak pernah mencoba memulihkannya. Saat benar-benar dibutuhkan, barulah ketahuan bahwa backup-nya tidak lengkap atau prosedurnya tidak berjalan.</p>
    <p><strong>2. Upgrade kluster yang terus ditunda.</strong> Setiap versi Kubernetes hanya didukung sekitar satu tahun. Menunda upgrade membuat Anda harus melompati beberapa versi sekaligus, yang jauh lebih berisiko daripada upgrade rutin. Jadwalkan sebagai pekerjaan berkala, bukan proyek besar sesekali.</p>
</div>`,
    perintah: [
        "kubectl get servicemonitor -A",
        "kubectl top nodes",
        "kubectl get pods -A --field-selector status.phase!=Running",
        "kubectl get events -A --sort-by=.lastTimestamp | tail -30",
        "kubectl get pdb,hpa -A"
    ],
    kuis: [
        {
            tanya: "ServiceMonitor sudah dibuat tetapi metrik tidak muncul di Prometheus. Apa yang perlu diperiksa lebih dulu?",
            opsi: [
                "Apakah aplikasi memakai HTTPS",
                "Apakah label pada ServiceMonitor cocok dengan serviceMonitorSelector milik objek Prometheus — bila tidak cocok, ia diabaikan tanpa pesan kesalahan",
                "Apakah namespace-nya bernama monitoring",
                "Apakah Prometheus sudah di-restart setelah ServiceMonitor dibuat"
            ],
            benar: 1,
            penjelasan: "Prometheus Operator hanya mengambil ServiceMonitor yang cocok dengan selector-nya, biasanya berdasarkan label release. ServiceMonitor dengan label yang keliru akan tersimpan di kluster tanpa pernah diproses, dan tidak ada pesan kesalahan yang menunjukkannya — sehingga ini penyebab yang sering memakan waktu lama untuk ditemukan."
        },
        {
            tanya: "Kenapa alert sebaiknya diarahkan pada gejala yang dirasakan pengguna, bukan pada metrik sumber daya seperti CPU node?",
            opsi: [
                "Karena metrik sumber daya tidak akurat di Kubernetes",
                "Karena pemakaian CPU tinggi belum tentu berarti ada masalah, sehingga alert semacam itu menghasilkan derau yang membuat tim mengabaikan notifikasi",
                "Karena Prometheus tidak bisa memberi alert pada metrik node",
                "Karena metrik sumber daya hanya tersedia di kluster berbayar"
            ],
            benar: 1,
            penjelasan: "Node dengan CPU 85% bisa saja berjalan persis sebagaimana mestinya. Alert yang sering berbunyi tanpa memerlukan tindakan melatih tim untuk mengabaikannya, sehingga alert yang benar-benar penting ikut terlewat. Metrik sumber daya lebih tepat dipakai sebagai konteks saat menyelidiki gejala yang sudah terdeteksi."
        }
    ]
}
];

/* ==========================================================================
   ENGINE PEMBELAJARAN — dipakai bersama oleh Kubernetes, PostgreSQL, Kafka
   ========================================================================== */

const KUNCI_SIMPAN = TOPIK_SLUG + "_progres";

let indeksAktif = 0;
let kategoriAktif = "SEMUA";
let kataCari = "";
let selesai = muatProgres();

function muatProgres() {
    try {
        return new Set(JSON.parse(localStorage.getItem(KUNCI_SIMPAN) || "[]"));
    } catch {
        return new Set();
    }
}

function simpanProgres() {
    try {
        localStorage.setItem(KUNCI_SIMPAN, JSON.stringify([...selesai]));
    } catch { /* penyimpanan tidak tersedia — abaikan */ }
}

function aturUlangProgres() {
    selesai = new Set();
    simpanProgres();
    render();
}

function daftarKategori() {
    return ["SEMUA", ...new Set(MODUL.map(m => m.kategori))];
}

function modulTersaring() {
    const q = kataCari.trim().toLowerCase();
    return MODUL.filter(m => {
        const cocokKategori = kategoriAktif === "SEMUA" || m.kategori === kategoriAktif;
        if (!cocokKategori) return false;
        if (!q) return true;
        return (m.judul + " " + m.ringkas + " " + (m.tag || []).join(" "))
            .toLowerCase().includes(q);
    });
}

function renderPil() {
    const wadah = document.getElementById("pilKategori");
    wadah.innerHTML = daftarKategori().map(k => `
        <button class="pil ${k === kategoriAktif ? "aktif" : ""}"
                onclick="pilihKategori(${JSON.stringify(k).replace(/"/g, "&quot;")})">
            ${k === "SEMUA" ? "Semua" : k}
        </button>`).join("");
}

function pilihKategori(k) {
    kategoriAktif = k;
    render();
}

function renderDaftar() {
    const wadah = document.getElementById("daftarModul");
    const hasil = modulTersaring();

    if (hasil.length === 0) {
        wadah.innerHTML = `<div class="kosong">Tidak ada modul yang cocok.</div>`;
        return;
    }

    let html = "";
    let kategoriTerakhir = null;
    for (const m of hasil) {
        if (m.kategori !== kategoriTerakhir) {
            kategoriTerakhir = m.kategori;
            html += `<div class="grup-kategori">${m.kategori}</div>`;
        }
        const i = MODUL.indexOf(m);
        html += `
            <div class="item-modul ${i === indeksAktif ? "aktif" : ""} ${selesai.has(m.id) ? "selesai" : ""}"
                 onclick="bukaModul(${i})">
                <div class="item-nomor">${selesai.has(m.id) ? "✓" : String(m.id).padStart(2, "0")}</div>
                <div class="item-teks">
                    <div class="item-judul">${m.judul}</div>
                    <div class="item-meta">${m.tingkat} · ${m.durasi}</div>
                </div>
            </div>`;
    }
    wadah.innerHTML = html;
}

function renderProgres() {
    const total = MODUL.length;
    const jumlah = selesai.size;
    document.getElementById("isiProgres").style.width = (jumlah / total * 100) + "%";
    document.getElementById("teksProgres").textContent = `${jumlah} dari ${total} selesai`;
}

function renderKonten() {
    const m = MODUL[indeksAktif];
    const konten = document.getElementById("konten");

    const perintah = (m.perintah || []).length === 0 ? "" : `
        <div class="perintah-contoh">
            <div class="perintah-kepala">Perintah yang sering dipakai</div>
            <div class="perintah-isi">
                ${m.perintah.map(p => `<div class="perintah-baris">${lolos(p)}</div>`).join("")}
            </div>
        </div>`;

    const kuis = (m.kuis || []).length === 0 ? "" : `
        <section class="kuis">
            <h3>Uji Pemahaman</h3>
            <div class="kuis-sub">Pilih jawaban untuk melihat penjelasannya.</div>
            ${m.kuis.map((q, qi) => `
                <div class="pertanyaan" id="q-${qi}">
                    <div class="pertanyaan-teks">${qi + 1}. ${lolos(q.tanya)}</div>
                    ${q.opsi.map((o, oi) => `
                        <button class="opsi" data-q="${qi}" data-o="${oi}"
                                onclick="jawab(${qi}, ${oi})">${lolos(o)}</button>`).join("")}
                    <div class="penjelasan" id="pj-${qi}" style="display:none"></div>
                </div>`).join("")}
        </section>`;

    konten.innerHTML = `
        <header class="kepala-modul">
            <span class="label-kategori">${m.kategori}</span>
            <h1>${lolos(m.judul)}</h1>
            <p class="ringkas">${lolos(m.ringkas)}</p>
        </header>
        <article class="artikel">${m.isi}</article>
        ${perintah}
        ${kuis}
        <nav class="nav-modul">
            <button class="tombol-nav" onclick="pindah(-1)" ${indeksAktif === 0 ? "disabled" : ""}>← Sebelumnya</button>
            <button class="tombol-nav utama" onclick="tandaiSelesai()">
                ${selesai.has(m.id) ? "✓ Sudah ditandai selesai" : "Tandai selesai"}
            </button>
            <button class="tombol-nav" onclick="pindah(1)" ${indeksAktif === MODUL.length - 1 ? "disabled" : ""}>Berikutnya →</button>
        </nav>`;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function lolos(s) {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function jawab(qi, oi) {
    const m = MODUL[indeksAktif];
    const q = m.kuis[qi];
    const tombol = document.querySelectorAll(`.opsi[data-q="${qi}"]`);
    tombol.forEach((t, i) => {
        t.disabled = true;
        if (i === q.benar) t.classList.add("benar");
        else if (i === oi) t.classList.add("salah");
    });
    const pj = document.getElementById(`pj-${qi}`);
    pj.style.display = "block";
    pj.innerHTML = (oi === q.benar ? "<strong>Tepat.</strong> " : "<strong>Belum tepat.</strong> ") + lolos(q.penjelasan);
}

function bukaModul(i) {
    indeksAktif = i;
    render();
}

function pindah(delta) {
    const baru = indeksAktif + delta;
    if (baru >= 0 && baru < MODUL.length) bukaModul(baru);
}

function tandaiSelesai() {
    const id = MODUL[indeksAktif].id;
    if (selesai.has(id)) selesai.delete(id); else selesai.add(id);
    simpanProgres();
    render();
}

function render() {
    renderPil();
    renderDaftar();
    renderProgres();
    renderKonten();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inputCari").addEventListener("input", e => {
        kataCari = e.target.value;
        renderDaftar();
    });
    document.addEventListener("keydown", e => {
        if (e.target.tagName === "INPUT") return;
        if (e.key === "ArrowLeft") pindah(-1);
        if (e.key === "ArrowRight") pindah(1);
    });
    const sub = document.getElementById("merekSub");
    if (sub) sub.textContent = `${MODUL.length} modul · ${TOPIK_SUB}`;
    render();
});
