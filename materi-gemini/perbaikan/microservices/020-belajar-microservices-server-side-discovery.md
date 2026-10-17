# Perbaikan: Belajar Microservices - Server Side Discovery

- **Kelas:** microservices
- **Modul:** 20
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 102 kata. Belum menjelaskan secara konkret bagaimana *Server-Side Discovery* diimplementasikan pada infrastruktur modern (Kubernetes `Service` + `CoreDNS` + `kube-proxy` berbasis IPVS/nftables) serta pentingnya membedakan *Readiness Probe* dari *Liveness Probe* agar hanya pod yang benar-benar siap yang masuk ke daftar *EndpointSlice*.

## Materi tambahan
Letakkan di akhir materi (setelah kotak "Keuntungan Server-Side Discovery").

### 3. Bagaimana Kubernetes Mengimplementasikan *Server-Side Discovery*?

Di lingkungan produksi modern berbasis Kubernetes, Anda hampir tidak pernah lagi mengelola *registry* eksternal seperti Eureka secara manual. Kubernetes menyediakan *Server-Side Discovery* bawaan melalui kerja sama tiga komponen:

1. **Objek `Service` & `EndpointSlice` Controller:** Mengawasi pod yang memiliki label cocok (mis. `app: payment-service`) **dan** telah lulus pemeriksaan **`readinessProbe`**. Hanya alamat IP pod yang berstatus *Ready* yang dimasukkan ke dalam objek `EndpointSlice`.
2. **CoreDNS Kluster:** Memetakan nama domain internal `payment-service.prod.svc.cluster.local` ke satu *ClusterIP* virtual yang stabil.
3. **`kube-proxy` (atau eBPF CNI seperti Cilium):** Menangkap paket jaringan yang menuju *ClusterIP* tersebut di tingkat kernel Linux dan meneruskannya (*load balance*) ke salah satu IP pod sehat di dalam `EndpointSlice`.

```yaml
# Manifes Deployment + Service dengan readinessProbe agar Server-Side Discovery
# hanya mengirim trafik ke instans yang sudah siap melayani koneksi
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payment-service
  template:
    metadata:
      labels:
        app: payment-service
    spec:
      containers:
        - name: app
          image: registry.example.com/payment-service:1.4.0
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: payment-service
spec:
  selector:
    app: payment-service
  ports:
    - port: 80
      targetPort: 8080
```

### 4. Perbandingan *Server-Side* vs *Client-Side Discovery*

| Aspek | *Server-Side Discovery* (K8s Service / ALB) | *Client-Side Discovery* (Consul / Eureka SDK) |
| :--- | :--- | :--- |
| Kompleksitas kode klien | Sangat sederhana (cukup panggil URL DNS standar, bebas bahasa pemrograman) | Tinggi (wajib memasang pustaka klien *registry* di setiap bahasa pemrograman) |
| Jumlah lompatan jaringan (*hop*) | Melalui IP virtual kernel (eBPF/IPVS tidak menambah lompatan fisik) atau melalui Load Balancer perantara | Langsung dari klien ke IP pod tujuan |

## Sumber
- [Microservices.io — Pattern: Server-side service discovery](https://microservices.io/patterns/server-side-discovery.html)
- [Kubernetes Documentation — Service, Load Balancing, and Networking](https://kubernetes.io/docs/concepts/services-networking/service/)
