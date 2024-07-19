# Dokumentasi Deployment untuk Backend CarbonChain

Dokumen ini memberikan panduan untuk melakukan deployment backend CarbonChain pada salah satu host (instance/komputer). CarbonChain merupakan sistem informasi transportasi supply chain dan pencatatan emisi karbon.

## Persyaratan

- Sistem operasi Ubuntu (22.04 LTS untuk kompatibilitas dengan Hyperledger Fabric)
- Docker
- Docker Compose
- Git

## Langkah-langkah Deployment

1. **Clone Repositori**

   Clone repositori backend CarbonChain ke salah satu host/komputer Anda (misalnya VM GCP) dengan menjalankan perintah berikut:

   Host 1:

   ```bash
   git clone https://github.com/TA-Blockchain/backend.git
   cd backend
   ```

2. **Instalasi**

   Jalankan perintah berikut untuk melakukan instalasi package yang dibutuhkan oleh backend service.

   Host 1:

   ```bash
   cd api
   npm install
   ```

3. **Menjalankan Backend CarbonChain**

   Host 1:

   ```bash
   npm run start
   ```


Sesuai dengan langkah-langkah di atas, komponen blockchain CarbonChain Anda seharusnya telah berhasil di-deploy dan siap untuk digunakan, serta dapat diakses pada tautan `http://localhost:3000` (lokal) ataupun `<IP-ADDRESS-HOST-ANDA>:3000` (production). Pastikan untuk memantau dan melakukan penyesuaian sesuai kebutuhan.

User manual komponen backend dan blockchain CarbonChain dapat diakses pada [tautan berikut](https://docs.google.com/document/d/1ILKaH_aOwE_MaMkDin_JLQ4_XWNPWOAv-tbkZLdbMeg/edit?usp=sharing).
