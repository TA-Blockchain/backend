# Dokumentasi Deployment untuk Blockchain CarbonChain

Dokumen ini memberikan panduan untuk melakukan deployment multihost (dengan 3 host/komputer) untuk komponen blockchain CarbonChain. CarbonChain merupakan sistem informasi transportasi supply chain dan pencatatan emisi karbon.

Untuk keperluan pengembangan secara lokal, silahkan kunjungi branch `dev`.

Untuk keperluan pengembangan backend CarbonChain, silahkan kunjungi folder `/api`.

## Persyaratan

- Sistem operasi Ubuntu (22.04 LTS untuk kompatibilitas dengan Hyperledger Fabric)
- Docker
- Docker Compose
- Git

## Langkah-langkah Deployment

1. **Clone Repositori**

   Clone repositori backend CarbonChain ke tiap host/komputer Anda (misalnya VM GCP) dengan menjalankan perintah berikut:

   ```bash
   git clone https://github.com/TA-Blockchain/backend.git
   cd backend
   ```

2. **Instalasi**

   Terdapat dua file instalasi yang perlu dieksekusi, yaitu `install-requirements.sh` dan `install-bianries.sh`. Tahap pertama yaitu melakukan instalasi beberapa persyaratan utama untuk menjalankan proyek secara keseluruhan, seperti Go, node, docker, dan lain-lain. Tahap kedua yaitu instalasi fabric binaries, yang merupakan kumpulan file executable yang diperlukan untuk menjalankan jaringan blockchain Hyperledger Fabric.

   ```bash
   ./install-requirements.sh
   ./install-fabric.sh
   ```

3. **Jalankan Semua Kontainer**

   Host 1:

   ```bash
   ./run.sh -host ca1 # menjalankan container Fabric CA host 1
   ./run.sh -host h1 # menjalankan container peer, couchdb, orderer host 1
   ./copy-material.sh h1
   ```

   Host 2:

   ```bash
   ./run.sh -host ca2 # menjalankan container Fabric CA host 2
   ./run.sh -host h2 # menjalankan container peer, couchdb host 2
   ./copy-material.sh h2
   ```

   Host 3:

   ```bash
   ./run.sh -host h3 # menjalankan container peer, couchdb host 3
   ```

4. **Bergabung ke dalam Channel**

   Host 1:

   ```bash
   ./run.sh -chstep joinh1 # host 1 inisiasi pembuatan channel dan bergabung ke channel
   ./copy-block.sh # copy genesis-block ke host 2 dan host 3
   ```

   Host 2:

   ```bash
   ./run.sh -chstep joinh2 # bergabung ke channel
   ```

   Host 3:

   ```bash
   ./run.sh -chstep joinh3 # bergabung ke channel
   ```

5. **Deployment Semua Chaincode**

   Host 1:

   ```bash
   ./run.sh -ccstep h11 # instalasi chaincode di container peer0.kementrian
   ```

   Host 2:

   ```bash
   ./run.sh -ccstep h21 # instalasi chaincode di container peer0.supplychain
   ```

   Host 3:

   ```bash
   ./run.sh -ccstep h31 # instalasi chaincode di container peer1.supplychain
   ```

   Host 1:

   ```bash
   ./run.sh -ccstep h12 # commit chaincode di container peer0.kementrian
   ```

   Host 2:

   ```bash
   ./run.sh -ccstep h22 # commit chaincode di container peer0.supplychain
   ```

   Host 3:

   ```bash
   ./run.sh -ccstep h32 # commit chaincode di container peer1.supplychain
   ```

6. **Memastikan Deployment Berhasil**

   Kita dapat melakukan verifikasi terhadap keberhasilan tahap deployment dengan mengeksekusi salah satu chaincode yang telah di deploy. Apabila tidak terdapat error, maka tahapan deployment telah berhasil dilakukan.

   ```bash
   ./invoke.sh
   ```

7. **Mematikan Jaringan Blockchain**

   Dengan menjalankan perintah di bawah ini, maka semua komponen jaringan blockchain CarbonChain akan dihapus dan membuat jaringan menjadi tidak aktif.

   ```bash
   ./down.sh
   ```

Dengan mengikuti langkah-langkah di atas, komponen blockchain CarbonChain Anda seharusnya telah berhasil di-deploy dan siap untuk digunakan. Pastikan untuk memantau dan melakukan penyesuaian sesuai kebutuhan.

User manual komponen backend dan blockchain CarbonChain dapat diakses pada [tautan berikut](https://docs.google.com/document/d/1ILKaH_aOwE_MaMkDin_JLQ4_XWNPWOAv-tbkZLdbMeg/edit?usp=sharing).

Cara menambahkan node baru ke dalam jaringan blockchain CarbonChain dapat dilihat pada [tautan berikut](https://github.com/TA-Blockchain/backend/blob/main/network/new-node.md)
