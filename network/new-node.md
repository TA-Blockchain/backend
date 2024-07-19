# Dokumentasi Penambahan Node Baru ke dalam Jaringan Blockchain CarbonChain

Terdapat 2 Organisasi di dalam jaringan blockchain CarbonChain, yaitu Kementerian dan SupplyChain. Pertama-tama, tentukan apakah peer node yang ingin ditambahkan merupakan bagian dari organisasi Kementerian atau SupplyChain.

# Mengubah Konfigurasi Channel

Konfigurasi channel dapat dilihat pada folder `/config`, yang terdiri dari 3 file utama:

1. `configtx.yaml`

Konfigurasi channel jaringan blockchain Hyperledger Fabric yang digunakan oleh jaringan untuk mengenali komponen-komponen yang tergabung di dalamnya. Pada file konfigurasi ini, pengembang jaringan dapat menentukan organisasi, alamat dan peran masing-masing node di dalam jaringan, orderer node, serta mekanisme konsensus yang akan digunakan jaringan blockchain (pada jaringan ini digunakan Raft Consensus Algorithm).

2. `core.yaml`

Merupakan Konfigurasi pengaturan default untuk node peer. File ini mencakup berbagai pengaturan yang berkaitan dengan operasi node peer, seperti komunikasi, penyimpanan ledger, kebijakan, chaincode, dan lain-lain.

3. `orderer.yaml`

Konfigurasi ini khusus digunakan oleh orderer nodes.

Untuk memastikan jaringan blockchain dapat mengenali node baru yang ditambahkan, maka konfigurasi channel perlu diubah, khususnya pada file `configtx.yaml`.

```bash
# Menambahkan alamat peer node yang ditambahkan (baris 69 atau 99 sesuai dengan organisasi)
- Host: 10.184.0.5
  Port: 7052
```

```bash
# Menambahkan alamat CA certificates dari peer node yang ditambahkan (baris 211 dan 305)
- Host: 10.184.0.7
  Port: 9050
  ClientTLSCert: ../organizations/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
  ServerTLSCert: ../organizations/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
```

# Menambahkan File Docker Compose

File docker compose yang digunakan di dalam jaringan blockchain CarbonChain dapat dilihat pada folder `/compose/multihost`. Terdapat konfigurasi file docker compose untuk masing-masing host dan juga jenis komponen yang akan di deploy (CA, Orderer, dan Peer). Untuk menambahkan peer node baru ke dalam jaringan blockchain, pengembang dapat membuat suatu file docker compose baru sesuai dengan contoh pada folder `/compose/example`.

# Menerbitkan Sertifikat untuk Node Baru

Setiap komponen di dalam jaringan Hyperledger Fabric memiliki sertifikat yang diterbitkan oleh masing-masing CA Organiasi. Sertifikat ini berperan sebagai identitas yang dimiliki masing-masing node, yang memberikan validasi ke pada anggota jaringan bahwa node tersebut memang bagian dari jaringan blockchain.

Pertama-tama, pengembang dapat menambahkan alamat node baru ke dalam file `fabric-ca-server-config.yaml` yang tersedia pada folder `/organizations/fabric-ca/[nama-organisasi]` seperti kode di bawah ini:

```bash
# baris 311 pada /organizations/fabric-ca/kementrian/fabric-ca-server-config.yaml
hosts:
  - localhost
  - kementrian.example.com
  - 10.184.0.5
```

Selain itu, pastikan juga tahapan penerbitan CA certificates untuk peer node baru tersebut ikut dieksekusi di dalam file `/organizations/fabric-ca/registerEnroll.sh`. Hal ini dapat dilakukan dengan menyalin setiap baris yang melibatkan pembuatan folder, penyalinan sertifikat, dan baris kode yang melakukan enroll atau register menggunakan `fabric-ca-client`.

Dengan mengikuti langkah-langkah di atas, peer node baru Anda seharusnya telah berhasil di-deploy dan siap untuk digunakan. Pastikan untuk memantau dan melakukan penyesuaian sesuai kebutuhan.
