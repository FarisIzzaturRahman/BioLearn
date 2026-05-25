-- Biological Databases & File Formats Course Seeding Migration
-- Course 2

INSERT INTO public.courses (id, title, slug, description, cover_image, level, estimated_hours, published)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Biological Databases & File Formats',
  'biological-databases-file-formats',
  'Panduan lengkap database biologis dan format file yang wajib dikuasai setiap bioinformatician. Dari NCBI hingga UniProt, dari FASTA hingga VCF — semua dijelaskan dengan contoh kode Python yang langsung bisa dijalankan.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
  'Beginner',
  10,
  true
);

INSERT INTO public.modules (id, course_id, title, slug, order_index, duration_minutes, content_markdown)
VALUES
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'Introduction to Biological Databases',
  'introduction-to-biological-databases',
  1,
  30,
  '# Introduction to Biological Databases

## Overview
Dalam dunia rekayasa perangkat lunak, kita terbiasa dengan database relasional (SQL) atau NoSQL yang terstruktur rapi. Namun, data biologi sangatlah berbeda. Informasi biologis itu dinamis, tidak terstruktur, dan memiliki kompleksitas tinggi. Modul ini akan mengenalkan konsep penyimpanan data biologis dengan analogi database terdistribusi untuk membantu developer CS bertransisi ke bioinformatika.

## Prerequisites
- Memahami konsep dasar sel (DNA, RNA, Protein)
- Memahami konsep dasar database (Schema, Query, API)

## Learning Objectives
By the end of this module, you will be able to:
- Menjelaskan perbedaan mendasar antara database biologis dengan database relasional standar.
- Mengidentifikasi tiga kategori utama database biologi (Primer, Sekunder, dan Tersier).
- Memahami tantangan standarisasi data biologi menggunakan kacamata desainer sistem terdistribusi.

---

## Mengapa Biologi Tidak Memakai Database SQL Tunggal?
Di dunia IT, jika kita ingin menyimpan data transaksi, kita cukup membuat satu database PostgreSQL terpusat dengan skema tabel yang ketat. Di dunia biologi, hal ini hampir mustahil. Data biologi didefinisikan sebagai hasil observasi fisik alam yang selalu berubah:
1. **Schema-less Nature**: Pengetahuan baru tentang gen dapat mendefinisikan ulang properti gen tersebut secara instan.
2. **Noise and Redundancy**: Alat sekuensing modern seperti mesin PacBio menghasilkan ribuan data mentah dengan tingkat error rate tertentu.
3. **Data Volume**: Data genom manusia berukuran gigabyte untuk satu individu saja.

### Analogi Sistem CS
Memikirkan database biologi adalah seperti memikirkan **Decentralized Object Storage** (seperti AWS S3 atau IPFS) yang digabung dengan sistem **Indexing / Search Engine** rapi (seperti Elasticsearch). Data biologis mentah disimpan sebagai flat files raksasa, sementara metadata pendukung diindeks secara dinamis agar dapat dicari.

---

## Kategori Database Biologi
Database biologis secara umum dibagi berdasarkan tingkat pengolahannya:

| Jenis Database | Karakteristik | Analogi CS | Contoh Terkenal |
|---|---|---|---|
| **Database Primer** | Berisi data mentah langsung dari laboratorium sekuensing. Tidak ada kurasi manusia yang ketat. | Raw Log Storage / Object Store | NCBI GenBank, ENA, DDBJ |
| **Database Sekunder** | Berisi data hasil analisis, penyaringan, dan anotasi otomatis atau manual. | Curated Cache / Read-Optimized Views | UniProt, RefSeq |
| **Database Spesialis** | Database kecil yang berfokus pada organisme atau penyakit spesifik. | Microservices / Domain-specific DBs | FlyBase (Lalat Buah), WormBase |

---

## Hands-on Exercise
**Objective:** Mengambil data sekuens biologis mentah menggunakan HTTP Request API.

**Setup:**
```bash
pip install requests pandas
```

**Task:**
Tulis script Python sederhana untuk melakukan query ke database NCBI secara langsung menggunakan REST API (Entrez Utilities).

```python
import requests

def fetch_ncbi_status():
    # Menguji kesehatan API NCBI E-utilities
    url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?db=nuccore&retmode=json"
    response = requests.get(url)
    
    if response.status_code == 255 or response.status_code == 200:
        data = response.json()
        print("NCBI API Connection: Successful")
        print(f"Total entries in Nuccore DB: {data[''einforesult''][''dbinfo''][''count'']}")
    else:
        print("Failed to reach NCBI server")

if __name__ == "__main__":
    fetch_ncbi_status()
```

**Expected Output:**
```text
NCBI API Connection: Successful
Total entries in Nuccore DB: [Angka integer besar]
```

---

## Key Takeaways
- Database biologis sangat bergantung pada flat files karena volume data mentah yang sangat masif.
- Database terbagi menjadi tiga tingkatan kurasi: Primer (mentah), Sekunder (teranalisis), dan Spesialis (domain-spesifik).
- Akses data biologis sangat mengandalkan Web API karena lokasinya yang terdesentralisasi di seluruh dunia.

## Further Reading
- International Nucleotide Sequence Database Collaboration (INSDC) — http://www.insdc.org/
- NCBI E-utilities REST Documentation

## Quiz
Q1: Mengapa biologi tidak menggunakan database PostgreSQL tunggal dengan skema tabel terstruktur ketat untuk semua data DNA?
A) Karena biologi tidak mengenal komputer.
B) Karena skema tabel SQL terlalu lambat melakukan kalkulasi tambah.
C) Karena data biologi terus berubah secara struktural dan memiliki tingkat redundansi yang tinggi sehingga skema ketat akan sering pecah. ✓
D) Karena semua bioinformatician hanya menyukai text file.
Explanation: Data biologis sangat fleksibel dan berkembang, sehingga skema tabel kaku (relational SQL) tidak kompatibel dengan penemuan-penemuan biologis baru yang dinamis.

Q2: Apa analogi yang paling tepat untuk Database Primer dalam arsitektur komputer?
A) Curated Redis Cache.
B) Raw Log Storage / Object Store (seperti AWS S3). ✓
C) Compiled Production Executable.
D) Automated Unit Test.
Explanation: Database primer menyimpan data mentah hasil pembacaan sekuensing tanpa kurasi manusia yang tebal, mirip dengan log storage mentah.

Q3: Apa kelemahan utama dari database primer?
A) Tidak bisa diakses lewat internet.
B) Memiliki tingkat redundansi dan error rate data mentah yang cukup tinggi. ✓
C) Biaya langganan bulanan yang mahal.
D) Tidak mendukung format data teks.
Explanation: Karena database primer menerima unggahan data mentah dari lab di seluruh dunia, data di dalamnya sering kali duplikat (redundan) dan belum dikurasi dengan ketat.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'NCBI: The GitHub of Biology',
  'ncbi-the-github-of-biology',
  2,
  60,
  '# NCBI: The GitHub of Biology

## Overview
National Center for Biotechnology Information (NCBI) adalah pusat data biologi terbesar di dunia. Bagi seorang software engineer, NCBI mirip sekali dengan GitHub. NCBI menyimpan repository kode DNA/Protein dari ribuan kontributor di seluruh dunia, menyediakan mesin pencari komprehensif, dan mengekspos REST API yang kuat bernama E-utilities.

## Prerequisites
- Memahami konsep REST API (HTTP GET requests)
- Memahami format data JSON/XML

## Learning Objectives
By the end of this module, you will be able to:
- Menjelaskan peran NCBI sebagai repositori kode biologis global.
- Memahami sistem pengalamatan Accession Number sebagai commit hash/identifier unik.
- Melakukan query data genetik secara terprogram menggunakan REST API E-utilities.

---

## NCBI sebagai GitHub Biologi
Bayangkan jika setiap lab biologi di dunia bekerja sendirian tanpa berkolaborasi. Kita tidak akan pernah bisa memetakan virus Corona atau mendeteksi kanker genetik dengan cepat. NCBI berfungsi sebagai server Git hosting pusat:
- **GenBank**: Merupakan database utama di NCBI yang menampung semua sekuens DNA publik. Ini adalah database primer, mirip dengan **GitHub Public Repositories**.
- **Accession Number**: Setiap sekuens yang diunggah ke NCBI akan mendapatkan pengenal unik permanen, contohnya `NC_045512.2` (SARS-CoV-2 genome). Ini mirip seperti **Commit SHA** atau **Unique Package Version** di npm/pip.

---

## Arsitektur E-utilities (REST API NCBI)
NCBI menyediakan suite REST API bernama **E-utilities** untuk mengakses miliaran data mereka secara terprogram. Ada beberapa endpoint utama:
1. **ESearch**: Mencari ID unik database berdasarkan query pencarian teks. (Analog dengan pencarian di Elasticsearch).
2. **EFetch**: Mengambil data sekuens penuh (FASTA/GenBank format) berdasarkan ID unik tersebut. (Analog dengan men-download file mentah via Git).
3. **ESummary**: Mengambil ringkasan metadata sekuens (seperti pembuat, tanggal unggah, dll).

---

## Worked Example: Mengakses REST API NCBI via Python

Di bawah ini adalah kode Python untuk melakukan pencarian genetik menggunakan E-utilities. Kita akan mencari genom virus SARS-CoV-2.

```python
import requests
import xml.etree.ElementTree as ET

def search_and_fetch_ncbi():
    # Step 1: ESearch - Cari ID dari genom virus corona
    search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=SARS-CoV-2[Organism]+AND+refseq[filter]&retmode=json"
    search_res = requests.get(search_url).json()
    id_list = search_res["esearchresult"]["idlist"]
    print(f"Genom IDs found: {id_list}")
    
    if id_list:
        target_id = id_list[0]
        # Step 2: EFetch - Ambil metadata singkat genom tersebut
        summary_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nuccore&id={target_id}&retmode=json"
        summary_res = requests.get(summary_url).json()
        title = summary_res["result"][target_id]["title"]
        acc = summary_res["result"][target_id]["caption"]
        print(f"Caption/Accession: {acc}")
        print(f"Title: {title}")

if __name__ == "__main__":
    search_and_fetch_ncbi()
```

---

## Hands-on Exercise
**Objective:** Mengambil file format FASTA penuh dari NCBI secara terprogram menggunakan `EFetch`.

**Setup:**
Pastikan module `requests` sudah terinstall.

**Task:**
Tulis kode Python untuk mendownload genom penuh SARS-CoV-2 menggunakan Accession Number `NC_045512.2`.

```python
import requests

def download_fasta(accession_id):
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id={accession_id}&rettype=fasta&retmode=text"
    response = requests.get(url)
    
    if response.status_code == 200:
        lines = response.text.splitlines()
        print("FASTA Header:")
        print(lines[0]) # Header metadata sekuens
        print("\nFirst 3 lines of DNA Sequence:")
        for line in lines[1:4]:
            print(line)
    else:
        print("Failed to download sequence from NCBI")

if __name__ == "__main__":
    download_fasta("NC_045512.2")
```

**Expected Output:**
```text
FASTA Header:
>NC_045512.2 Severe acute respiratory syndrome coronavirus 2 isolate Wuhan-Hu-1, complete genome

First 3 lines of DNA Sequence:
ATTAAAGGTTTATACCTTCCCAGGTAACAAACCAACCAACTTTCGATCTCTTGTAGATCT
GTTCTCTAAACGAACTTTAAAATCTGTGTGGCTGTCACTCGGCTGCATGCTTAGTGCACT
CACGCAGTATAATTAATAACTAATTACTGTCGTTGACAGGACACGAGTAACTCGTCTATC
```

---

## Key Takeaways
- NCBI adalah repositori pusat terbesar untuk data genetik global.
- E-utilities merupakan kumpulan REST API NCBI untuk mencari (ESearch), meringkas (ESummary), dan mengambil data (EFetch).
- Accession Number bertindak sebagai index key unik yang menjamin ketepatan rujukan data genom.

## Further Reading
- NCBI E-utilities Help Manual — https://www.ncbi.nlm.nih.gov/books/NBK25501/
- Entrez Programming Utilities (E-utilities) API Documentation

## Quiz
Q1: Apa kegunaan utama dari ESearch pada suite E-utilities NCBI?
A) Mendownload file sekuens penuh secara langsung.
B) Melakukan pencarian teks bebas untuk mengembalikan daftar ID unik database. ✓
C) Mengedit isi data nukleotida di GenBank.
D) Melakukan kompilasi bahasa pemrograman Python.
Explanation: ESearch menerima kata kunci pencarian teks bebas (misalnya nama organisme atau gen) lalu mengembalikan ID unik (GI atau Accession ID) dari database NCBI yang cocok.

Q2: Apa kegunaan dari Accession Number pada database GenBank?
A) Menghitung biaya sewa bandwidth server.
B) Berfungsi sebagai pengenal unik permanen untuk sekuens DNA tertentu, mirip dengan Commit SHA di Git atau Package Version. ✓
C) Menampilkan alamat fisik kantor NCBI di Amerika Serikat.
D) Mendefinisikan enkripsi password user.
Explanation: Accession Number adalah kunci utama unik (primary key) yang diberikan ke sekuens tertentu sehingga para ilmuwan dapat merujuk data sekuens yang persis sama.

Q3: Manakah API endpoint E-utilities yang harus dipanggil jika Anda ingin mendownload file FASTA lengkap berdasarkan NCBI ID?
A) ECreate
B) ESummary
C) EFetch ✓
D) ESearch
Explanation: EFetch digunakan untuk mengambil data terformat lengkap (seperti FASTA atau data GenBank) secara terprogram dari ID database NCBI.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'UniProt: The Protein Encyclopedia',
  'uniprot-the-protein-encyclopedia',
  3,
  55,
  '# UniProt: The Protein Encyclopedia

## Overview
Jika DNA adalah source code dasar (`index.html`), maka protein adalah elemen-elemen UI interaktif yang dieksekusi di browser sel. UniProt (Universal Protein Resource) adalah ensiklopedia protein terlengkap di dunia. Bagi CS developer, UniProt adalah repositori API terdokumentasi rapi yang memetakan relasi fungsional protein ke kode genetik asalnya.

## Prerequisites
- Memahami dogma sentral (transkripsi DNA menjadi RNA, translasi RNA menjadi Protein)
- Memahami konsep REST API dan format data tab-separated values (TSV)

## Learning Objectives
By the end of this module, you will be able to:
- Membedakan antara database terkurasi manual (Swiss-Prot) dan terotomatisasi (TrEMBL).
- Menavigasi data fungsional, taksonomi, dan struktur protein di UniProt.
- Melakukan query UniProt secara terprogram dengan filter spesifik.

---

## Arsitektur Data UniProt: Swiss-Prot vs TrEMBL
UniProt dibagi menjadi dua pilar utama berdasarkan tingkat validasi kualitas dokumentasinya:
1. **UniProtKB/Swiss-Prot**: Repositori protein yang dikurasi secara manual oleh para ahli biologi (human-in-the-loop). Ini adalah data emas. Semua fungsi, struktur, dan patologi yang tercatat di sini telah diverifikasi oleh literatur riset ilmiah nyata. (Analog dengan **Official Curated API Documentation**).
2. **UniProtKB/TrEMBL**: Repositori protein yang dianalisis secara otomatis oleh algoritma komputer (machine-annotated). Data di sini sangat masif namun belum divalidasi oleh mata manusia. (Analog dengan **Auto-generated JSDoc/pydoc**).

---

## Struktur Anotasi Protein
Satu entri protein di UniProt (misalnya Insulin Manusia: Accession `P01308`) menyimpan skema informasi yang sangat terstruktur:
- **Function**: Apa tugas protein ini di dalam sel?
- **Subcellular Location**: Di bagian mana dari struktur sel protein ini beroperasi? (e.g., Cytoplasm, Nucleus).
- **Pathology & Variants**: Penyakit apa yang timbul jika protein ini mengalami mutasi?
- **Cross-references**: Link ke PDB (struktur 3D) dan Ensembl/NCBI (source code DNA asal).

---

## Worked Example: Mengambil Anotasi Protein via REST API UniProt

UniProt menyediakan REST API yang sangat bersih dan terstandarisasi. Kita bisa meminta data dalam format JSON, XML, TSV, atau FASTA secara langsung. Di bawah ini adalah kode Python untuk mengambil metadata protein Insulin Manusia.

```python
import requests

def fetch_protein_info(uni_id):
    url = f"https://rest.uniprot.org/uniprotkb/{uni_id}.json"
    res = requests.get(url)
    
    if res.status_code == 200:
        data = res.json()
        # Ambil nama protein
        full_name = data["proteinDescription"]["recommendedName"]["fullName"]["value"]
        # Ambil organisme asal
        organism = data["organism"]["scientificName"]
        # Ambil fungsi protein (jika ada)
        comments = data.get("comments", [])
        function_text = "No function available"
        for comment in comments:
            if comment["commentType"] == "FUNCTION":
                function_text = comment["note"]["texts"][0]["value"]
                break
                
        print(f"Protein: {full_name}")
        print(f"Organism: {organism}")
        print(f"Biological Function:\n{function_text}")
    else:
        print("Failed to contact UniProt API")

if __name__ == "__main__":
    fetch_protein_info("P01308")
```

---

## Hands-on Exercise
**Objective:** Mengunduh ringkasan data banyak protein dalam format TSV terprogram.

**Setup:**
Tidak diperlukan library tambahan selain `requests`.

**Task:**
Tulis kode Python untuk melakukan pencarian di UniProt database bagi protein manusia yang memiliki hubungan dengan penyakit diabetes, mengambil nama protein, nama gen, dan ID UniProt dalam format teks terstruktur.

```python
import requests

def search_diabetic_proteins():
    # Filter pencarian: human protein terkait diabetes
    url = "https://rest.uniprot.org/uniprotkb/search?query=organism_id:9606+AND+diabetes&fields=accession,gene_names,protein_name&format=tsv&size=5"
    response = requests.get(url)
    
    if response.status_code == 200:
        print("UniProt Search Results (TSV format):")
        print(response.text)
    else:
        print("Failed to query UniProt")

if __name__ == "__main__":
    search_diabetic_proteins()
```

**Expected Output:**
```text
UniProt Search Results (TSV format):
Entry	Gene Names	Protein names
P01308	INS	Insulin
P06213	INSR	Insulin receptor
... [dan seterusnya berisi 5 baris data]
```

---

## Key Takeaways
- UniProt adalah ensiklopedia protein utama, memetakan rantai asam amino ke fungsionalitas biologisnya di dalam sel.
- Swiss-Prot berisi data terkurasi manual tingkat akurasi tinggi, sedangkan TrEMBL diisi oleh anotasi otomatis komputer.
- UniProt menyediakan Web API tangguh yang mengembalikan format TSV/JSON secara instan untuk diolah di Pandas/R.

## Further Reading
- UniProt Help Centre — https://www.uniprot.org/help/
- Programmatic access REST API UniProt Documentation

## Quiz
Q1: Apa perbedaan mendasar antara UniProtKB/Swiss-Prot dengan UniProtKB/TrEMBL?
A) Swiss-Prot berbayar sedangkan TrEMBL gratis.
B) Swiss-Prot dikurasi secara manual oleh manusia, sedangkan TrEMBL diisi otomatis oleh algoritma komputer tanpa kurasi manual langsung. ✓
C) Swiss-Prot hanya berisi protein tanaman, sedangkan TrEMBL hanya berisi protein virus.
D) Swiss-Prot disimpan di database Oracle, sedangkan TrEMBL disimpan di MongoDB.
Explanation: Swiss-Prot mewakili standar emas data protein karena setiap entri diulas dan diverifikasi secara manual berdasarkan literatur ilmiah.

Q2: Mengapa bioinformatician sering memilih format output TSV daripada JSON saat mengunduh ribuan entri dari UniProt?
A) TSV berukuran jauh lebih kecil, hemat memori bandwidth, dan mudah diparsing langsung menggunakan library data science seperti Pandas. ✓
B) TSV mendukung enkripsi kriptografi bawaan.
C) TSV merupakan format bahasa pemrograman berorientasi objek.
D) JSON tidak didukung oleh UniProt REST API.
Explanation: Format TSV (tab-separated) sangat ringkas tanpa overhead syntax markup, sangat ideal untuk streaming data tabel bervolume tinggi langsung ke memori.

Q3: Apa yang direpresentasikan oleh UniProt Accession Number (misalnya P01308)?
A) Nomor telepon kantor support UniProt.
B) ID Unik entri protein tertentu yang dijamin konsisten dan permanen. ✓
C) Koordinat atom 3D protein di dunia nyata.
D) Versi compiler Python yang digunakan untuk mendownload data.
Explanation: Accession Number bertindak sebagai Unique ID / primary key untuk mereferensikan protein tertentu di seluruh dunia akademis dan industri.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'Ensembl: The Genome Browser',
  'ensembl-the-genome-browser',
  4,
  55,
  '# Ensembl: The Genome Browser

## Overview
Membaca kode DNA tanpa peta koordinat seperti membaca file binary hasil kompilasi tanpa source map. Ensembl bertindak sebagai visualizer koordinat genetik terbesar di dunia. Bagi CS developer, Ensembl adalah browser sistem koordinat spasial (Coordinate Mapping System) yang menautkan posisi sekuens mentah DNA ke fitur visual interaktif di browser.

## Prerequisites
- Memahami struktur kromosom manusia
- Memahami konsep dasar translasi koordinat 1D (offset, length)

## Learning Objectives
By the end of this module, you will be able to:
- Menjelaskan bagaimana genom dipetakan menggunakan sistem koordinat kromosom.
- Membaca dan menafsirkan visualisasi genom browser Ensembl.
- Melakukan translasi koordinat genetik secara terprogram via API Ensembl.

---

## Memahami Konsep Koordinat Genom
Setiap kromosom dapat dibayangkan sebagai sebuah berkas pita magnetik 1 dimensi yang sangat panjang. Genom manusia terdiri dari 23 pasang pita magnetik tersebut.
Untuk menunjuk di mana letak gen spesifik (contohnya BRCA2), kita menggunakan sistem alamat koordinat mirip **Array Slicing**:
- **Chromosome**: Chromosome 13
- **Start position (Offset)**: 32,315,086
- **End position**: 32,400,268
- **Strand**: Forward (+1) atau Reverse (-1)

### Analogi CS
Koordinat genom sangat mirip dengan **File Offset / Pointer** pada file biner. Jika kita tahu offset awal dan panjang byte-nya, kita bisa langsung melompat (seek) ke bagian biner yang menyimpan kode instruksi fungsi tersebut.

---

## Cara Kerja Genome Browser
Genome Browser (seperti Ensembl atau UCSC Genome Browser) adalah aplikasi visual yang memetakan file-file anotasi ke atas representasi koordinat kromosom.
Aplikasi ini menggunakan konsep **Tracks** (Jalur Visual):
- **Gene Track**: Menunjukkan kotak koordinat tempat gen berada.
- **Variant Track**: Menunjukkan titik mutasi genetik individu yang ditemukan di alam liar.
- **Regulation Track**: Menunjukkan daerah kontrol "on/off" saklar ekspresi gen.

---

## Worked Example: Query Koordinat Genom via API Ensembl

Ensembl menyediakan REST API yang sangat bersih. Kita bisa meminta data koordinat genetik langsung dalam format JSON. Di bawah ini adalah kode Python untuk memetakan koordinat gen BRCA2 manusia.

```python
import requests

def fetch_ensembl_coords(gene_name):
    # Dapatkan ID Ensembl dan koordinat berdasarkan nama gen simbolis
    url = f"https://rest.ensembl.org/lookup/symbol/homo_sapiens/{gene_name}?content-type=application/json"
    res = requests.get(url)
    
    if res.status_code == 200:
        data = res.json()
        print(f"Gene Name: {gene_name}")
        print(f"Ensembl ID: {data[''id'']}")
        print(f"Chromosome Location: Chromosome {data[''seq_region_name'']}")
        print(f"Start Offset: {data[''start'']} bp")
        print(f"End Offset: {data[''end'']} bp")
        print(f"Strand Direction: {''Forward (+1)'' if data[''strand''] == 1 else ''Reverse (-1)''}")
    else:
        print("Ensembl API unavailable")

if __name__ == "__main__":
    fetch_ensembl_coords("BRCA2")
```

---

## Hands-on Exercise
**Objective:** Mengambil seluruh daftar gen yang bertetangga (overlap) pada suatu koordinat spesifik.

**Setup:**
Tidak diperlukan pustaka eksternal selain `requests`.

**Task:**
Tulis kode Python untuk melacak gen-gen apa saja yang menempati koordinat Chromosome 7 dari posisi 140,400,000 hingga 140,600,000.

```python
import requests

def get_overlapping_genes():
    url = "https://rest.ensembl.org/overlap/region/human/7:140400000-140600000?feature=gene;content-type=application/json"
    res = requests.get(url)
    
    if res.status_code == 200:
        genes = res.json()
        print(f"Found {len(genes)} overlapping genes in this region:\n")
        for g in genes:
            print(f"- Gene Symbol: {g.get(''external_name'', ''Unknown'')}")
            print(f"  Ensembl ID: {g[''id'']}")
            print(f"  Biotype: {g[''biotype'']}")
            print(f"  Coordinates: {g[''start'']} to {g[''end'']}\n")
    else:
        print("Failed to search coordinates in Ensembl")

if __name__ == "__main__":
    get_overlapping_genes()
```

**Expected Output:**
```text
Found [X] overlapping genes in this region:

- Gene Symbol: BRAF
  Ensembl ID: ENSG00000157764
  Biotype: protein_coding
  Coordinates: 140719327 to 140924928
...
```

---

## Key Takeaways
- Koordinat genom mendefinisikan lokasi fisik presisi suatu gen di dalam rantai kromosom terpanjang.
- Genome Browser mengintegrasikan banyak track visual (gen, variasi, regulator) untuk memudahkan eksplorasi data.
- API Ensembl sangat memudahkan developer melakukan pencarian koordinat dan translasi posisi genetik secara real-time.

## Further Reading
- Ensembl REST API Documentation — https://rest.ensembl.org/
- UCSC Genome Browser Gateway

## Quiz
Q1: Manakah representasi yang paling mirip dengan konsep Koordinat Genom dalam pemrograman sistem komputer?
A) Memory Offset Pointer di biner file. ✓
B) REST API JSON response header.
C) CSS Padding & Margin layout.
D) Git Commit Hash.
Explanation: Seperti seek pointer pada array byte biner, koordinat genom menunjuk ke index offset awal dan akhir dari substring nukleotida di kromosom.

Q2: Apa fungsi utama dari "Tracks" pada Genome Browser?
A) Melacak lokasi GPS pengguna.
B) Menumpuk visualisasi dari berbagai tipe data (misalnya gen, variasi genetik, epigenom) di atas garis koordinat genom yang sama secara sejajar. ✓
C) Mengatur volume suara dari mesin sekuensing.
D) Membuat struktur database SQL baru otomatis.
Explanation: Tracks menumpuk data spasial terpisah secara berlapis di atas sistem koordinat genom linier sehingga korelasi biologis antar-sumber data mudah terlihat.

Q3: Mengapa arah "Strand" (+1 atau -1) penting dalam koordinat genetik?
A) Menunjukkan jenis kelamin organisme.
B) Menentukan arah untai DNA mana (untai maju atau untai mundur) yang dibaca oleh mesin seluler saat melakukan transkripsi ekspresi genetik. ✓
C) Mengunci database agar tidak mengalami deadlock.
D) Menentukan lisensi open-source software.
Explanation: DNA terdiri dari untai ganda antiparalel. Gen bisa ditulis di untai atas (forward/+1) atau untai bawah (reverse/-1), yang menentukan orientasi pembacaan kodon DNA.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'PDB: The Protein Data Bank',
  'pdb-the-protein-data-bank',
  5,
  50,
  '# PDB: The Protein Data Bank

## Overview
Dalam dogma sentral biologi, sekuens protein 1 dimensi akan melipat (folding) menjadi struktur 3 dimensi yang rumit agar bisa bekerja secara fisik di dalam tubuh kita. PDB (Protein Data Bank) adalah repositori global yang menyimpan koordinat 3D spasial dari atom-atom penyusun makromolekul. Bagi CS developer, file PDB adalah file grafik 3D (Spatial Vertex Data) mirip dengan format CAD atau OBJ dalam game development.

## Prerequisites
- Memahami struktur asam amino dasar
- Memahami konsep koordinat kartesian 3D (X, Y, Z)

## Learning Objectives
By the end of this module, you will be able to:
- Menjelaskan bagaimana struktur protein 3D direpresentasikan sebagai koordinat atom kartesian.
- Mengurai file berformat `.pdb` mentah dan mengekstrak koordinat spasial atom.
- Menggunakan visualizer grafik 3D untuk memutar dan memetakan struktur protein terlipat.

---

## Representasi Struktur 3D Protein
Mengapa kita perlu mengetahui koordinat 3D protein? Karena fungsi protein ditentukan oleh bentuk fisiknya!
Jika protein pembawa oksigen (Hemoglobin) berubah bentuk sedikit saja, ia akan kehilangan kemampuannya mengikat molekul oksigen.
Di dalam database PDB, setiap atom dari setiap asam amino dicatat posisi spasialnya menggunakan koordinat 3D Kartesian $(X, Y, Z)$ relatif terhadap pusat massa struktur tersebut.

### Analogi CS
Struktur data PDB sangat analog dengan file **OBJ** atau **STL** dalam pemodelan 3D dan game development. File tersebut terdiri dari baris-baris panjang yang mencantumkan tipe elemen (vertex) diikuti oleh koordinat $(X, Y, Z)$ 3 dimensi dan koefisien kepadatannya (occupancy/B-factor).

---

## Anatomi File `.pdb` Mentah
File format PDB adalah file teks datar (flat ASCII file) dengan lebar kolom tetap (fixed-width columns). Baris terpenting di dalam file PDB dimulai dengan kata kunci `ATOM` atau `HETATM`:

```text
COLUMNS        DATA  TYPE    FIELD        DEFINITION
-------------------------------------------------------------------------------------
 1 -  6        Record name   "ATOM  "
 7 - 11        Integer       serial       Atom serial number.
13 - 16        Atom          name         Atom name.
17             Character     altLoc       Alternate location indicator.
18 - 20        Residue name  resName      Residue name (Asam Amino, e.g. GLY, ALA).
23 - 26        Integer       resSeq       Residue sequence number.
31 - 38        Real(8.3)     x            Orthogonal coordinates for X in Angstroms.
39 - 46        Real(8.3)     y            Orthogonal coordinates for Y in Angstroms.
47 - 54        Real(8.3)     z            Orthogonal coordinates for Z in Angstroms.
```

---

## Worked Example: Parsing File PDB Mentah Menggunakan Python

Di bawah ini adalah kode Python murni tanpa pustaka tambahan untuk membaca file PDB dan menghitung total atom karbon yang terdaftar.

```python
import io

# Mock data representasi baris-baris file PDB asli
pdb_mock_data = """
HEADER    OXYGEN TRANSPORT                         24-MAY-2006   1A3N
ATOM      1  N   VAL A   1      12.932  18.423   4.101  1.00 45.31           N
ATOM      2  CA  VAL A   1      13.541  19.112   5.234  1.00 44.12           C
ATOM      3  C   VAL A   1      14.221  18.109   6.155  1.00 39.88           C
ATOM      4  O   VAL A   1      14.992  17.221   5.811  1.00 41.22           O
"""

def parse_pdb_coords():
    file_stream = io.StringIO(pdb_mock_data.strip())
    
    print(f"{''Atom Serial'':<12} | {''Residue'':<8} | {''Coordinate (X, Y, Z)''}")
    print("-" * 50)
    
    for line in file_stream:
        if line.startswith("ATOM  "):
            # Ekstraksi berbasis fixed-width substring
            serial = line[6:11].strip()
            atom_name = line[12:16].strip()
            res_name = line[17:20].strip()
            x = float(line[30:38].strip())
            y = float(line[38:46].strip())
            z = float(line[46:54].strip())
            
            print(f"{serial:<12} | {res_name} ({atom_name}) | ({x}, {y}, {z})")

if __name__ == "__main__":
    parse_pdb_coords()
```

---

## Hands-on Exercise
**Objective:** Mengunduh file PDB struktur protein nyata dan mencari total jumlah asam amino (residue) unik yang menyusunnya.

**Setup:**
Gunakan `requests` untuk mendownload struktur 3D dari server RCSB PDB secara langsung.

**Task:**
Tulis program Python untuk mengunduh PDB file `1A3N` (Hemoglobin manusia) dan menghitung jumlah total atom `CA` (Alpha Carbon) yang bertindak sebagai representasi tulang punggung (backbone) utama protein tersebut.

```python
import requests

def analyze_hemoglobin():
    # Download file PDB mentah dari RCSB
    url = "https://files.rcsb.org/download/1A3N.pdb"
    response = requests.get(url)
    
    if response.status_code == 200:
        lines = response.text.splitlines()
        ca_count = 0
        
        for line in lines:
            if line.startswith("ATOM  "):
                # Karbon Alfa (CA) digunakan sebagai proxy tulang punggung protein
                atom_type = line[12:16].strip()
                if atom_type == "CA":
                    ca_count += 1
                    
        print(f"Structure 1A3N (Hemoglobin) successfully downloaded.")
        print(f"Total Alpha Carbon (CA) atoms (representing residues): {ca_count}")
    else:
        print("Failed to download structure from PDB")

if __name__ == "__main__":
    analyze_hemoglobin()
```

**Expected Output:**
```text
Structure 1A3N (Hemoglobin) successfully downloaded.
Total Alpha Carbon (CA) atoms (representing residues): 574
```

---

## Key Takeaways
- PDB menyimpan informasi spasial 3D makromolekul hayati yang berguna untuk drug-discovery dan simulasi komputasi protein folding.
- File `.pdb` menggunakan format layout teks dengan kolom tetap (fixed-width layout), bukan layout delimited, demi menjamin kompatibilitas parser warisan komputer jadul.
- Karbon Alfa (`CA`) pada baris `ATOM` umum digunakan oleh algoritma kalkulasi biologi untuk merender bentuk tulang punggung (backbone) 3D protein dengan cepat.

## Further Reading
- RCSB Protein Data Bank — https://www.rcsb.org/
- PDB File Format Standard Documentation

## Quiz
Q1: Struktur data file `.pdb` yang menyimpan koordinat spasial atom paling mirip dengan jenis berkas apa dalam bidang rekayasa komputer grafis?
A) ZIP compression archive.
B) OBJ/STL mesh CAD 3D file. ✓
C) MP4 video stream codec.
D) HTML layout CSS box.
Explanation: File PDB mencatat daftar titik koordinat 3D relatif untuk membentuk objek 3D fisik, persis seperti vertex dan koordinat spasial di file pemodelan CAD 3D (OBJ/STL).

Q2: Mengapa file PDB tradisional menggunakan format kolom tetap (fixed-width layout) daripada format JSON atau CSV?
A) Format kolom tetap sangat menghemat bit space memori disk di era komputer kuno dan mempercepat proses scanning pointer I/O file di FORTRAN. ✓
B) Komputer jaman dulu tidak mendukung karakter huruf abjad.
C) Format JSON dilarang oleh WHO.
D) CSV tidak mendukung penyimpanan angka pecahan desimal.
Explanation: Format layout teks lebar kolom tetap dirancang pada era kartu berlubang (punched cards) dan komputer awal sehingga compiler FORTRAN dapat melompati byte string dengan sangat presisi dan cepat tanpa parsing regex pemisah karakter.

Q3: Apa kegunaan utama dari atom Alpha Carbon (CA) dalam visualisasi grafik protein?
A) Menghitung massa jenis air.
B) Digunakan sebagai representasi disederhanakan dari lintasan tulang punggung utama (backbone) rantai protein 3D. ✓
C) Berfungsi sebagai password enkripsi data.
D) Menentukan lokasi GPS laboratorium pengunggah.
Explanation: Menghubungkan titik-titik koordinat spasial atom CA dari setiap asam amino menyusun garis tulang punggung (backbone) terlipat 3D yang sangat rapi untuk dirender dengan beban GPU ringan.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'FASTA & FASTQ: Sequence File Formats',
  'fasta-and-fastq-sequence-file-formats',
  6,
  60,
  '# FASTA & FASTQ: Sequence File Formats

## Overview
Dua format file fundamental yang mendominasi seluruh analisis genomika adalah FASTA dan FASTQ. FASTA adalah standar industri untuk menyimpan urutan referensi DNA yang bersih. Sedangkan FASTQ adalah format data mentah berukuran raksasa hasil langsung dari mesin sekuensing. Bagi CS developer, FASTA adalah file kode sumber bersih (source code), sedangkan FASTQ adalah log dump yang menyertakan kode status compiler berupa nilai akurasi presisi (quality score).

## Prerequisites
- Memahami dogma sentral (sekuens huruf DNA: A, T, C, G)
- Memahami konsep representasi string dalam pemrograman

## Learning Objectives
By the end of this module, you will be able to:
- Menjelaskan perbedaan fungsionalitas antara format file FASTA dan FASTQ.
- Memahami arti skor kualitas Phred (Phred Quality Score) di dalam file FASTQ.
- Menulis skrip Python mandiri untuk mengonversi dan menyaring file FASTQ berdasarkan batas kelayakan kualitas baca.

---

## FASTA: Format Urutan Referensi Bersih
FASTA adalah format file berbasis teks yang sangat sederhana. Ia terdiri dari dua baris utama berulang:
1. **Header Line**: Dimulai dengan simbol lebih besar dari (`>`), berisi metadata identifikasi sekuens unik.
2. **Sequence Line**: Baris-baris panjang teks biasa yang merepresentasikan untai nukleotida (A, T, C, G, N) atau asam amino protein.

```text
>seq1 | Homo sapiens gene insulin
AGCTTTTCATTCTGACTGCAACGGGCAATATGTCTCTGTGT
GGATTAAAAAAAGAGTGTCTGATAGCAGC
```

---

## FASTQ: Repositori Baca Mentah + Skor Kualitas
Tidak seperti FASTA yang menyimpan urutan DNA referensi yang bersih, **FASTQ** menampung jutaan potongan bacaan mentah (reads) dari sampel manusia yang di-sekuens. Setiap bacaan diwakili oleh blok **4 baris wajib**:

```text
Line 1: @Header unik mesin sekuens (seperti ID hardware)
Line 2: Sekuens DNA mentah pembacaan (A, T, C, G, N)
Line 3: + (tanda tambah, opsional diikuti salinan header)
Line 4: Teks ASCII aneh mewakili Skor Kualitas Phred (Quality Score)
```

Contoh blok FASTQ:
```text
@SRR001.1 HWI-EAS91:1:1:1:1 length=36
GATTACAAGTCGATCGATCGATCGATCGATCGATCG
+
!''*((((***+))%%%++)(%%%%).1***-+*''
```

---

## Memecahkan Sandi ASCII: Skor Kualitas Phred
Mengapa ada karakter aneh seperti `!` atau `*` di baris ke-4 file FASTQ?
Karakter-karakter tersebut adalah representasi **Phred Quality Score ($Q$)** yang di-enkripsi ke dalam satu karakter ASCII untuk menghemat kapasitas disk space.
Tingkat probabilitas kesalahan pembacaan mesin ($P$) dirumuskan sebagai:
$$Q = -10 \log_{10}(P)$$

Nilai $Q$ dikonversi menjadi karakter ASCII tunggal menggunakan standar offset **Phred33** (ASCII value = $Q + 33$):
- Skor $Q = 30$ ($P = 0.001$, akurasi 99.9%): Ditulis sebagai ASCII $30 + 33 = 63$ (yaitu karakter `?`).
- Skor $Q = 10$ ($P = 0.1$, akurasi 90%): Ditulis sebagai ASCII $10 + 33 = 43$ (yaitu karakter `+`).

---

## Worked Example: Mengurai File FASTQ Mentah via Python

Di bawah ini adalah kode Python mandiri untuk menghitung rata-rata skor Phred dari satu bacaan FASTQ mentah.

```python
def decode_phred33(quality_string):
    # Konversi string ASCII menjadi list angka integer Phred score
    return [ord(char) - 33 for char in quality_string]

def analyze_fastq_record():
    fastq_record = [
        "@SRR1234567.1 length=10",
        "GATTACAAGC",
        "+",
        "IIIIIHHHFF" # Kualitas bacaan tinggi (ASCII I = 73 -> Q=40)
    ]
    
    seq = fastq_record[1]
    qual = fastq_record[3]
    
    scores = decode_phred33(qual)
    avg_score = sum(scores) / len(scores)
    
    print(f"DNA Read: {seq}")
    print(f"Phred Scores: {scores}")
    print(f"Average Quality Score: {avg_score:.2f}")

if __name__ == "__main__":
    analyze_fastq_record()
```

---

## Hands-on Exercise
**Objective:** Melakukan penyaringan (filter) data FASTQ mentah berdasarkan ambang batas kualitas rata-rata.

**Setup:**
Tidak diperlukan dependensi eksternal.

**Task:**
Tulis skrip Python untuk memproses file simulasi FASTQ berisi 3 bacaan, lalu saring (filter) dan cetak hanya sekuens yang memiliki rata-rata kualitas skor Phred $\ge 20$.

```python
import io

fastq_simulated_file = """@read1
ACTGCAACGG
+
IIIIIIIIII
@read2
GATTACATGA
+
!!!!!!!!!?
@read3
CGATCGATCG
+
*++(((***)"""

def filter_fastq(min_quality):
    stream = io.StringIO(fastq_simulated_file.strip())
    lines = stream.read().splitlines()
    
    # Proses file FASTQ setiap kelipatan 4 baris
    read_count = 0
    passed_count = 0
    
    for i in range(0, len(lines), 4):
        header = lines[i]
        seq = lines[i+1]
        plus = lines[i+2]
        qual = lines[i+3]
        
        scores = [ord(c) - 33 for c in qual]
        avg_q = sum(scores) / len(scores)
        read_count += 1
        
        if avg_q >= min_quality:
            passed_count += 1
            print(f"PASS: {header} | Avg Q: {avg_q:.1f} | Seq: {seq}")
            
    print(f"\nSummary: {passed_count}/{read_count} reads passed the quality filter.")

if __name__ == "__main__":
    filter_fastq(20)
```

**Expected Output:**
```text
PASS: @read1 | Avg Q: 40.0 | Seq: ACTGCAACGG
PASS: @read3 | Avg Q: 22.3 | Seq: CGATCGATCG

Summary: 2/3 reads passed the quality filter.
```

---

## Key Takeaways
- FASTA merepresentasikan sekuens referensi bersih, sedangkan FASTQ menampung sekuens baca mentah lengkap dengan metrik kesalahan.
- Phred Score mengodekan probabilitas kesalahan baca instrumen sekuensing ke dalam format ringkas 1-karakter ASCII (Phred33).
- Proses penapisan (quality control) pada file FASTQ adalah langkah wajib awal sebelum melakukan pemetaan (alignment) ke genom referensi.

## Further Reading
- Wikipedia: FASTQ format — https://en.wikipedia.org/wiki/FASTQ_format
- SRA (Sequence Read Archive) Database

## Quiz
Q1: Apa fungsi baris ke-4 pada format file FASTQ?
A) Menampung tautan URL ke database luar.
B) Menyimpan representasi visual struktur protein 3D.
C) Menyimpan skor kualitas Phred yang dikompresi menjadi karakter ASCII tunggal. ✓
D) Menyimpan lisensi hak cipta software.
Explanation: Baris keempat dari blok FASTQ menyelaraskan nilai presisi tingkat kesalahan pembacaan nukleotida di baris kedua menggunakan representasi sandi karakter ASCII.

Q2: Jika sebuah basa nukleotida dalam file FASTQ memiliki karakter kualitas Phred33 berupa `I` (nilai desimal ASCII = 73), berapakah Phred Score Basa tersebut?
A) 10
B) 20
C) 40 ✓
D) 73
Explanation: Berdasarkan standar Phred33 offset, Phred Score dihitung dengan rumus: $Q = \text{ASCII dec} - 33$. Sehingga $73 - 33 = 40$ (Akurasi pembacaan mencapai 99.99%).

Q3: Mengapa file FASTQ berukuran jauh lebih besar daripada file FASTA?
A) Karena FASTQ dienkripsi menggunakan algoritma blockchain.
B) Karena FASTQ menyimpan jutaan potongan data pembacaan genom mentah dari sampel, ditambah metadata mesin dan string skor kualitas. ✓
C) Karena FASTQ ditulis dalam format XML tebal.
D) Karena FASTQ hanya berisi gambar genom beresolusi tinggi.
Explanation: FASTQ bertindak sebagai raw dump berukuran ratusan gigabyte yang menangkap semua pembacaan kasar mesin sekuensing, lengkap dengan metrik keandalan per huruf nukleotida.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'SAM & BAM: Alignment File Formats',
  'sam-and-bam-alignment-file-formats',
  7,
  65,
  '# SAM & BAM: Alignment File Formats

## Overview
Setelah kita menyaring file FASTQ biologis mentah, kita harus memetakannya ke atas genom referensi bersih (FASTA) untuk mencari lokasi asalnya. File hasil pemetaan ini disimpan dalam format SAM (Sequence Alignment Map) yang human-readable, atau versi biner terkompresinya yang super cepat bernama BAM. Bagi CS developer, SAM adalah file representasi data terstruktur terbuka (`.json`/`.csv`), sedangkan BAM adalah file representasi biner terkompresi terindeks yang sangat efisien (`.bin`/`.protobuf`).

## Prerequisites
- Memahami konsep alignment (pencocokan sekuens)
- Memahami konsep manipulasi file biner dan operasi kompresi gzip

## Learning Objectives
By the end of this module, you will be able to:
- Menjelaskan struktur internal file SAM berbasis kolom tab-delimited.
- Memahami arti Bitwise FLAG di dalam tabel SAM untuk melacak status pemetaan bacaan.
- Menggunakan perintah perkakas CLI `samtools` untuk mengompresi dan mengindeks file BAM.

---

## Alur Kerja Alignment Genom
Proses pemetaan sekuens dapat dibayangkan sebagai merakit kembali dokumen kertas yang dihancurkan oleh mesin penghancur (shredder):
1. **Input**: File FASTQ (berisi jutaan potongan kertas bertulisan kalimat pendek).
2. **Reference**: File FASTA (buku referensi utuh sebagai contekan perakitan).
3. **Aligner tool**: Software pencari pola (seperti BWA atau Bowtie2) memetakan di mana letak persisnya setiap potongan kertas di dalam buku referensi.
4. **Output**: File SAM/BAM yang mencantumkan offset koordinat pemetaan setiap bacaan.

---

## Membedah Header dan Baris Kolom SAM
File SAM diawali oleh baris-baris header khusus yang dimulai dengan karakter `@` (menyimpan daftar nama kromosom dan tools yang dipakai), kemudian diikuti oleh baris-baris rekaman alignment berkolom tetap (11 kolom wajib):

```text
1. QNAME   : Query template NAME (ID bacaan FASTQ asalnya)
2. FLAG    : Bitwise FLAG (Informasi pemetaan biner terkompresi)
3. RNAME   : Reference sequence NAME (Kromosom tempat pemetaan terjadi)
4. POS     : Posisi koordinat 1-based start offset di kromosom referensi
5. MAPQ    : MAPping Quality (Akurasi kalkulasi pencocokan alinea)
6. CIGAR   : CIGAR string (Sandi ringkas operasi edit sekuens: Match, Insert, Delete)
7. RNEXT   : Nama kromosom dari pasangan bacaan (mate read)
8. PNEXT   : Posisi koordinat pasangan bacaan
9. TLEN    : Ukuran total potongan fragment DNA yang dipetakan
10. SEQ    : Urutan huruf nukleotida dari sekuens bacaan
11. QUAL   : Skor kualitas Phred dari sekuens bacaan
```

---

## Worked Example: Mendekode Bitwise FLAG dan CIGAR String
Sebagai software engineer, Anda pasti sangat menyukai efisiensi. Format SAM menggunakan trik cerdas untuk mereduksi teks:
- **Bitwise FLAG (Kolom 2)**: Menggabungkan beberapa status Boolean ke dalam satu bilangan integer biner. Contoh:
  - `4`: `00000100` $\rightarrow$ Bacaan tidak terpetakan (unmapped).
  - `16`: `00010000` $\rightarrow$ Bacaan terpetakan pada strand komplemen terbalik (reverse strand).
- **CIGAR String (Kolom 5)**: Merepresentasikan bagaimana sekuens cocok dengan referensi. Contoh: `36M2I10M` berarti:
  - `36M`: 36 huruf Match (atau Mismatch) dengan referensi.
  - `2I`: 2 huruf Insertion (huruf ekstra baru yang tidak ada di referensi).
  - `10M`: 10 huruf Match berikutnya.

---

## Hands-on Exercise
**Objective:** Menggunakan Python untuk mengurai file SAM simulasi dan menyaring data berdasarkan Bitwise FLAG.

**Setup:**
Tidak diperlukan library tambahan.

**Task:**
Tulis skrip Python untuk mencari bacaan-bacaan yang berhasil terpetakan (mapped) saja, dengan cara memeriksa Bitwise FLAG pada kolom kedua file SAM (bacaan terpetakan tidak boleh memiliki bit `4` aktif).

```python
import io

# Simulasi file SAM mentah sederhana
sam_mock_data = """@HD	VN:1.6	SO:coordinate
@SQ	SN:chr1	LN:248956422
read_A	99	chr1	10023	60	8M2I30M	*	0	0	ACTGACTGACTGACTGACTGACTGACTGACTGACTGACTG	IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
read_B	4	*	0	0	*	*	0	0	GATTACAGATTACAGATTACA	!!!!!!!!!!!!!!!!!!!!!
read_C	16	chr1	20050	50	36M	*	0	0	AAAAAAAATTTTTTTTGGGGGGGGCCCCCCCCCCCC	HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"""

def filter_mapped_reads():
    stream = io.StringIO(sam_mock_data.strip())
    
    print(f"{''Read ID'':<10} | {''Chr'':<6} | {''Position'':<8} | {''CIGAR''}")
    print("-" * 50)
    
    for line in stream:
        if line.startswith("@"):
            continue # Lewati header
            
        columns = line.split("\t")
        read_id = columns[0]
        flag = int(columns[1])
        chrom = columns[2]
        pos = columns[3]
        cigar = columns[5]
        
        # Periksa apakah bit ke-3 (nilai 4) tidak aktif (artinya read berhasil terpetakan)
        is_unmapped = flag & 4
        
        if not is_unmapped:
            print(f"{read_id:<10} | {chrom:<6} | {pos:<8} | {cigar}")

if __name__ == "__main__":
    filter_mapped_reads()
```

**Expected Output:**
```text
Read ID    | Chr    | Position | CIGAR
--------------------------------------------------
read_A     | chr1   | 10023    | 8M2I30M
read_C     | chr1   | 20050    | 36M
```

---

## Key Takeaways
- SAM merekam metadata hasil pemosisian sekuens baca mentah (FASTQ) ke koordinat kromosom referensi (FASTA).
- Bitwise FLAG menampung banyak status properti logis ke satu representasi bilangan biner kompak.
- CIGAR string mendeskripsikan secara presisi peta modifikasi (Match, Insert, Delete) sekuens terhadap referensinya.

## Further Reading
- SAM/BAM Format Specification Guide — https://samtools.github.io/hts-specs/SAMv1.pdf
- Samtools CLI Command Documentation

## Quiz
Q1: Mengapa file SAM dikonversi menjadi file biner BAM dalam operasi pemrosesan bioinformatika nyata?
A) Karena file BAM dapat dienkripsi agar tidak dicuri kompetitor.
B) Karena format biner BAM jauh lebih ringkas, hemat memori disk, dan mendukung indexing cepat untuk visualisasi real-time. ✓
C) Karena file biner BAM aman dari serangan virus komputer.
D) Karena format teks SAM dilarang oleh lisensi Google.
Explanation: BAM adalah representasi biner BGZF-compressed dari SAM, menghemat ruang penyimpanan $\approx 80\%$ dan mendukung indexing untuk melompat langsung ke lokasi tertentu dengan cepat.

Q2: Di dalam baris alignment SAM, apa yang dilaporkan oleh CIGAR string `20M2D10M`?
A) Terjadi 20 Mismatch, 2 Insertion, dan 10 Mismatch.
B) Terjadi 20 Match, 2 Deletion pada referensi, dan 10 Match berikutnya. ✓
C) Terjadi 20 menit delay download.
D) Terjadi 20 kali replikasi gen.
Explanation: Simbol `M` merepresentasikan Match/Mismatch dengan referensi, dan `D` merepresentasikan Deletion (penghapusan) nukleotida pada koordinat referensi sekuens.

Q3: Manakah bitwise FLAG yang digunakan untuk menandai secara tepat bahwa sekuens baca mentah gagal terpetakan (unmapped) ke referensi mana pun?
A) Bit bernilai desimal 16.
B) Bit bernilai desimal 0.
C) Bit bernilai desimal 4. ✓
D) Bit bernilai desimal 1024.
Explanation: FLAG desimal `4` (biner `00000100`) menandai status unmapped, memudahkan filter data mentah yang tidak berguna.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'VCF: Variant Call Format',
  'vcf-variant-call-format',
  8,
  60,
  '# VCF: Variant Call Format

## Overview
Tujuan akhir dari memetakan dan menyelaraskan jutaan bacaan genetik ke genom referensi adalah untuk mengidentifikasi letak perbedaan genetik individu. Perbedaan genetik ini disebut sebagai varian atau mutasi. VCF (Variant Call Format) adalah format data standar industri yang menyimpan daftar variasi genetik tersebut. Bagi CS developer, file VCF bertindak persis seperti file **Git Diff Output** (`git diff`) yang merinci lokasi baris baris kode mana yang dimodifikasi dibanding source code asli.

## Prerequisites
- Memahami konsep dasar mutasi DNA (Single Nucleotide Polymorphism - SNP)
- Memahami konsep dasar translasi koordinat genom (Chromosome, Position)

## Learning Objectives
By the end of this module, you will be able to:
- Menjelaskan struktur kolom file VCF dan cara penyimpanan data mutasi.
- Menginterpretasikan perbedaan representasi antara REF (Reference) dan ALT (Alternative) nukleotida.
- Mengurai berkas VCF secara mandiri menggunakan skrip pemrograman Python.

---

## VCF sebagai Git Diff Genom Manusia
Genom dari setiap dua manusia di bumi ini $99.9\%$ identik. Kita hanya berbeda pada $0.1\%$ bagian genom.
Menyimpan genom lengkap berukuran 3 GB untuk setiap individu pasien adalah pemborosan media penyimpanan yang luar biasa.
Oleh karena itu, para ahli biologi menggunakan file VCF:
- **Reference (REF)**: Genom acuan dasar manusia sehat (misalnya kode huruf di posisi tersebut adalah `A`). Ini adalah **Original Source Code**.
- **Alternative (ALT)**: Genom pasien yang mutasi (misalnya kode huruf di posisi tersebut berubah menjadi `G`). Ini adalah **Modified Line Code**.

---

## Membedah Struktur Kolom VCF
Setiap file VCF terdiri dari ratusan baris komentar metadata yang diawali dengan karakter ganda `##`, diikuti oleh satu baris header kolom bertanda tunggal `#`, dan baris-baris daftar mutasi dengan 8 kolom wajib:

```text
1. #CHROM  : Nama kromosom tempat mutasi terjadi (e.g., chr7)
2. POS     : Posisi koordinat 1-based awal terjadinya mutasi
3. ID      : Identifier varian jika tercatat di database global (e.g., rs ID)
4. REF     : Sekuens huruf nukleotida asli genom referensi
5. ALT     : Sekuens huruf nukleotida pengganti pada sampel pasien
6. QUAL    : Kualitas komputasi pemanggilan varian (Phred-scaled score)
7. FILTER  : Status penyaringan kualitas (PASS jika lolos uji keandalan)
8. INFO    : Kolom metadata pasangan key-value opsional penjelas varian
```

---

## Worked Example: Parsing File VCF via Python

Di bawah ini adalah kode Python mandiri tanpa dependensi tambahan untuk membaca file simulasi VCF dan menampilkan rincian mutasi.

```python
import io

# Mock data representasi baris VCF
vcf_mock_data = """##fileformat=VCFv4.2
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO
chr1	10144	rs123	A	G	50.0	PASS	DP=30
chr1	20199	.	TC	T	45.0	PASS	DP=12
chr2	55823	rs456	G	A	12.0	LowQual	DP=5
"""

def parse_vcf_variants():
    stream = io.StringIO(vcf_mock_data.strip())
    
    print(f"{''Chr'':<6} | {''Position'':<8} | {''Ref'':<4} -> {''Alt'':<4} | {''Type'':<12} | {''Filter''}")
    print("-" * 65)
    
    for line in stream:
        if line.startswith("#"):
            continue # Lewati header dan metadata
            
        columns = line.split("\t")
        chrom = columns[0]
        pos = columns[1]
        ref = columns[3]
        alt = columns[4]
        qual = float(columns[5])
        filt = columns[6]
        
        # Deteksi jenis mutasi sederhana
        if len(ref) == 1 and len(alt) == 1:
            var_type = "Substitution"
        elif len(ref) > len(alt):
            var_type = "Deletion"
        else:
            var_type = "Insertion"
            
        print(f"{chrom:<6} | {pos:<8} | {ref:<4} -> {alt:<4} | {var_type:<12} | {filt}")

if __name__ == "__main__":
    parse_vcf_variants()
```

---

## Hands-on Exercise
**Objective:** Menyaring varian genetik berdasarkan ambang batas skor kualitas panggilan (QUAL) dan status FILTER.

**Setup:**
Tidak diperlukan pustaka eksternal.

**Task:**
Tulis program Python untuk membaca simulasi VCF, memproses baris demi baris, dan mencetak hanya mutasi yang lolos filter (FILTER = "PASS") dengan nilai akurasi panggilan varian (QUAL) di atas 20.

```python
import io

vcf_dataset = """#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO
chr7	140453136	rs113488022	T	A	99.0	PASS	DP=100
chr13	32906729	rs80359550	CAAA	C	15.0	LowQual	DP=10
chr17	43044295	.	G	A	80.0	PASS	DP=45"""

def filter_vcf(min_qual):
    stream = io.StringIO(vcf_dataset.strip())
    lines = stream.read().splitlines()
    
    passed_variants = 0
    
    print("FILTERED VCF MUTATIONS:")
    for line in lines:
        if line.startswith("#"):
            continue
            
        cols = line.split("\t")
        chrom = cols[0]
        pos = cols[1]
        ref = cols[3]
        alt = cols[4]
        qual = float(cols[5])
        filt = cols[6]
        
        if filt == "PASS" and qual >= min_qual:
            passed_variants += 1
            print(f"[{passed_variants}] Chromosome {chrom} at {pos} | {ref} mutated to {alt} (QUAL: {qual})")

if __name__ == "__main__":
    filter_vcf(30)
```

**Expected Output:**
```text
FILTERED VCF MUTATIONS:
[1] Chromosome chr7 at 140453136 | T mutated to A (QUAL: 99.0)
[2] Chromosome chr17 at 43044295 | G mutated to A (QUAL: 80.0)
```

---

## Key Takeaways
- VCF bertindak sebagai pencatat perbedaan (diff file) genomik individu terhadap model genom acuan global manusia sehat.
- VCF merekam mutasi sederhana pergantian huruf tunggal (Substitution) maupun penambahan/penghapusan huruf (Indels).
- Pengolahan berkas VCF mempermudah analisis asosiasi genetik untuk memetakan asal-usul penyakit bawaan lahir pada pasien.

## Further Reading
- Wikipedia: Variant Call Format — https://en.wikipedia.org/wiki/Variant_Call_Format
- 1000 Genomes Project VCF Specification

## Quiz
Q1: Manakah konsep rekayasa perangkat lunak yang paling merepresentasikan fungsi file VCF dalam alur genomika?
A) Git Diff patch file (`git diff`). ✓
B) REST API Routing parameters.
C) CSS Grid layout framework.
D) Unit Testing mocks data.
Explanation: Seperti berkas Git Diff patch yang merinci perbedaan baris modifikasi terhadap source code asli, VCF merekam koordinat perbedaan (mutasi) biologis pasien terhadap genom referensi.

Q2: Di dalam file VCF, apa yang dimaksud dengan kolom `REF` dan `ALT`?
A) REF adalah koordinat satelit GPS, ALT adalah tinggi terbang pesawat.
B) REF adalah sekuens huruf nukleotida asli genom referensi, sedangkan ALT adalah sekuens huruf modifikasi/mutasi yang ditemukan pada sampel pasien. ✓
C) REF adalah referensi jurnal ilmiah, ALT adalah alternatif nama penulis.
D) REF adalah tabel relational SQL, ALT adalah alternatif skema database.
Explanation: Kolom REF mencantumkan sekuens nukleotida standar genom acuan sehat pada koordinat tersebut, sedangkan ALT merekam nukleotida varian/mutasi baru milik pasien.

Q3: Apa jenis mutasi yang direpresentasikan jika baris VCF mencantumkan kolom REF bernilai `TC` dan ALT bernilai `T`?
A) Substitusi satu huruf.
B) Insersi (Insertion) huruf baru.
C) Penghapusan (Deletion) huruf C. ✓
D) Replikasi kromosom ganda.
Explanation: Karena sekuens berubah dari TC menjadi T, berarti huruf `C` pada koordinat tersebut terhapus (mengalami peristiwa mutasi delesi).'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'BED & GFF/GTF: Annotation Formats',
  'bed-and-gff-gtf-annotation-formats',
  9,
  55,
  '# BED & GFF/GTF: Annotation Formats

## Overview
Memiliki genom referensi (FASTA) dan varian mutasi (VCF) belum cukup jika kita tidak tahu di mana lokasi gen-gen fungsional berada di sepanjang kromosom. Kita membutuhkan file anotasi untuk memberi label pada koordinat koordinat penting tersebut. Format BED (Browser Extensible Data) dan GFF/GTF (General Feature Format) adalah standar industri untuk menyimpan koordinat anotasi genomik ini. Bagi CS developer, BED dan GFF/GTF bertindak persis seperti berkas **Source Maps** yang mendefinisikan label koordinat elemen UI di web atau penanda metadata aset game.

## Prerequisites
- Memahami konsep koordinat 0-based (BED) vs 1-based (GFF)
- Memahami konsep transkripsi gen (Exon, Intron)

## Learning Objectives
By the end of this module, you will be able to:
- Memahami perbedaan fundamental sistem koordinat antara format file BED dan GFF/GTF.
- Mengidentifikasi struktur fitur genetik (exon, intron, CDS) di dalam file anotasi.
- Menulis script Python untuk menyaring koordinat exon spesifik dari file GFF.

---

## Perbedaan Krusial Koordinat: 0-Based vs 1-Based
Salah satu jebakan terbesar bagi pemrogram yang bertransisi ke bioinformatika adalah perbedaan sistem indeks koordinat:
1. **BED format (0-based, half-open)**:
   - Indeks awal dihitung dari `0`.
   - Posisi akhir tidak inklusif (half-open).
   - *Analogi CS*: Sama seperti **Python Array Slicing** `array[0:3]` (mengambil elemen indeks 0, 1, dan 2).
2. **GFF/GTF format (1-based, fully closed)**:
   - Indeks awal dihitung dari `1`.
   - Posisi akhir bersifat inklusif.
   - *Analogi CS*: Sama seperti pengindeksan koordinat string pada bahasa pemrograman R atau SQL substring.

---

## Membedah Struktur Kolom GFF/GTF
Format GFF3 terdiri dari 9 kolom wajib yang dipisahkan oleh karakter tab (`\t`):

```text
1. seqid      : Nama kromosom atau scaffold (e.g., chrX)
2. source     : Program atau basis data pembuat anotasi (e.g., Havana)
3. type       : Tipe fitur biologi (gene, transcript, exon, CDS)
4. start      : Koordinat awal fitur (1-based, inclusive)
5. end        : Koordinat akhir fitur (1-based, inclusive)
6. score      : Nilai numerik penanda kualitas anotasi ('.' jika kosong)
7. strand     : Arah pembacaan untai (+ atau -)
8. phase      : Fase pembacaan kodon untuk fitur protein-coding (0, 1, 2)
9. attributes : Daftar metadata tambahan berpasangan key-value dipisah titik koma
```

---

## Worked Example: Parsing File BED (0-based) via Python

Di bawah ini adalah kode Python mandiri untuk menghitung panjang total wilayah koordinat yang dicakup oleh baris-baris file BED.

```python
import io

bed_mock_data = """chr1	11873	14409	DDX11L2
chr1	14361	29370	WASH7P
chr1	29773	35409	MIR6859-1"""

def analyze_bed_ranges():
    stream = io.StringIO(bed_mock_data.strip())
    
    total_length = 0
    print(f"{''Gene'':<12} | {''Coordinate'':<20} | {''Length (bp)''}")
    print("-" * 50)
    
    for line in stream:
        cols = line.split("\t")
        chrom = cols[0]
        start = int(cols[1])
        end = int(cols[2])
        name = cols[3]
        
        # Panjang dihitung langsung: end - start (karena 0-based half-open)
        length = end - start
        total_length += length
        print(f"{name:<12} | {chrom}:{start}-{end:<14} | {length} bp")
        
    print(f"\nTotal Covered Annotation Length: {total_length} bp")

if __name__ == "__main__":
    analyze_bed_ranges()
```

---

## Hands-on Exercise
**Objective:** Mengurai berkas GFF3 simulasi dan mengekstrak semua fitur bertipe `exon` milik suatu ID gen tertentu.

**Setup:**
Gunakan Python standar tanpa instalasi modul tambahan.

**Task:**
Tulis kode Python untuk membaca data anotasi GFF, memisahkan kolom tipe fitur, dan mencetak hanya koordinat awal dan akhir dari baris bertipe `exon` yang memiliki atribut pemilik gen `parent=gene_A`.

```python
import io

gff_simulated_file = """chrX	Havana	gene	10000	25000	.	+	.	ID=gene_A;Name=HEMA
chrX	Havana	mRNA	10000	25000	.	+	.	ID=mRNA_A;Parent=gene_A
chrX	Havana	exon	10000	12000	.	+	.	ID=exon_1;Parent=gene_A
chrX	Havana	exon	15000	17000	.	+	.	ID=exon_2;Parent=gene_A
chrX	Havana	exon	22000	25000	.	+	.	ID=exon_3;Parent=gene_A"""

def parse_gff_exons(target_parent):
    stream = io.StringIO(gff_simulated_file.strip())
    
    exon_num = 0
    print(f"Exons Coordinates for {target_parent}:")
    for line in stream:
        cols = line.split("\t")
        feature_type = cols[2]
        start = int(cols[3])
        end = int(cols[4])
        attributes = cols[8]
        
        if feature_type == "exon" and f"Parent={target_parent}" in attributes:
            exon_num += 1
            length = (end - start) + 1 # GFF adalah 1-based, inclusive!
            print(f"Exon {exon_num} -> Start: {start} | End: {end} | Length: {length} bp")

if __name__ == "__main__":
    parse_gff_exons("gene_A")
```

**Expected Output:**
```text
Exons Coordinates for gene_A:
Exon 1 -> Start: 10000 | End: 12000 | Length: 2001 bp
Exon 2 -> Start: 15000 | End: 17000 | Length: 2001 bp
Exon 3 -> Start: 22000 | End: 25000 | Length: 3001 bp
```

---

## Key Takeaways
- Format BED (0-based) dan GFF/GTF (1-based) bertindak sebagai source maps pelabel koordinat biologis fungsional di kromosom.
- Kesalahan translasi koordinat antara indeks 0-based dan 1-based adalah sumber bug (off-by-one errors) paling populer dalam software bioinformatika.
- Kolom ke-9 atribut GFF3 menyediakan skema metadata key-value fleksibel untuk pelabelan detail relasi anak-induk fitur biologi.

## Further Reading
- UCSC Browser: BED Format Specification — https://genome.ucsc.edu/FAQ/FAQformat.html#format1
- Ensembl: GFF/GTF Format Description

## Quiz
Q1: Manakah sistem koordinat yang diimplementasikan oleh format file BED?
A) 1-based, inklusif dua arah.
B) 0-based, half-open (awal inklusif, akhir eksklusif) mirip indexing array di Python. ✓
C) Sistem koordinat polar kartesian.
D) Enkripsi heksadesimal base64.
Explanation: Format file BED menggunakan standar koordinat 0-based dan half-open, persis seperti penanganan substring atau slicing indeks list array di Python/C++.

Q2: Mengapa bioinformatician pemula sering menemui bug "off-by-one" saat mencocokkan data file BED dengan data file GFF?
A) Karena file BED hanya bisa dibaca menggunakan komputer MacOS.
B) Karena koordinat file BED dimulai dari indeks 0 (0-based), sedangkan koordinat file GFF dimulai dari indeks 1 (1-based, inklusif). ✓
C) Karena file GFF dienkripsi dengan algoritma SHA256.
D) Karena file BED tidak menyimpan nama kromosom.
Explanation: Perbedaan basis indeks awal (0 vs 1) menyebabkan selisih perhitungan 1 basa nukleotida (off-by-one error) jika konversi koordinat tidak ditangani secara eksplisit dalam kode program.

Q3: Apa yang direpresentasikan oleh baris bertipe `exon` di dalam berkas anotasi genom?
A) Bagian genom yang menyandi pembentukan struktur lemak sel.
B) Wilayah sekuens DNA fungsional yang akan tetap dipertahankan saat transkripsi RNA matang untuk menyandi rantai protein. ✓
C) Daerah sampah genetik yang dibuang mesin sel.
D) Nama pembuat program sekuensing.
Explanation: Exon adalah bagian potongan dari rantai gen yang menyandi kode asam amino biologis protein, yang dilindungi oleh sel saat proses modifikasi RNA splicing.'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'Biopython: Programmatic Database Access',
  'biopython-programmatic-database-access',
  10,
  70,
  '# Biopython: Programmatic Database Access

## Overview
Hingga tahap ini, Anda telah mempelajari berbagai database biologi dan format file secara konseptual serta menulis parser teks murni. Di industri bioinformatika nyata, kita tidak menulis parser manual dari nol karena rentan bug. Kita menggunakan pustaka terstandarisasi industri. Modul ini berfokus pada **Biopython** — toolkit bioinformatika Python paling terpopuler. Bagi CS developer, Biopython bertindak sebagai **Unified SDK & Database ORM** untuk berinteraksi dengan API biologis global dan mengolah aneka format file rumit secara terpadu.

## Prerequisites
- Memiliki pemahaman Python menengah (OOP, Iterators, Exceptions)
- Memahami seluruh format file (FASTA, FASTQ, GenBank) yang dibahas pada modul sebelumnya

## Learning Objectives
By the end of this module, you will be able to:
- Membaca, memanipulasi, dan menulis file sekuens FASTA/FASTQ menggunakan ORM `Bio.SeqIO`.
- Menggunakan `Bio.Entrez` untuk melakukan interaksi API biologi terintegrasi langsung ke NCBI.
- Memahami struktur objek data utama Biopython (`Seq`, `SeqRecord`).

---

## Biopython sebagai ORM Biologi
Sama seperti ORM modern (seperti Hibernate, Prisma, atau SQLAlchemy) memetakan baris database relasional ke objek class di bahasa pemrograman, Biopython memetakan entitas biologi ke objek representasi Python:
- **`Bio.Seq`**: Kelas pembungkus (wrapper) string nukleotida dasar yang menyertakan fungsi biologi seperti transkripsi, translasi, dan komplemen terbalik.
- **`Bio.SeqRecord`**: Kelas penyimpan metadata lengkap (analog dengan tabel database record) yang menampung objek sekuens beserta Accession ID, nama organisme, anotasi fitur, dan skor kualitas.
- **`Bio.SeqIO`**: Antarmuka terpadu (Unified I/O Interface) untuk membaca dan menulis lebih dari 10 format file biologi berbeda secara transparan.

---

## Penggunaan ORM `Bio.SeqIO`
Dengan `SeqIO`, membaca sekuens DNA sangatlah bersih dan aman dari error parse manual:

```python
from Bio import SeqIO

# Membaca file FASTA sekuens referensi
for record in SeqIO.parse("sequence.fasta", "fasta"):
    print(f"ID: {record.id}")
    print(f"Sequence Length: {len(record.seq)} bp")
    print(f"Sequence: {record.seq[:20]}...")
```

---

## Worked Example: Interaksi API NCBI via `Bio.Entrez`

Biopython menyertakan pembungkus REST API Entrez NCBI yang sangat kuat. Ia menangani pembatasan rate-limiting, otentikasi kunci API, dan parsing keluaran XML secara otomatis.

```python
from Bio import Entrez

# WAJIB mengidentifikasi email Anda ke NCBI agar tidak di-block
Entrez.email = "turing@computer.org"

def fetch_ncbi_record_biopython(accession_id):
    try:
        # Melakukan pemanggilan EFetch langsung ke NCBI Nuccore database
        handle = Entrez.efetch(db="nuccore", id=accession_id, rettype="fasta", retmode="text")
        
        # Parsing output stream teks langsung menggunakan SeqIO ORM
        record = SeqIO.read(handle, "fasta")
        handle.close()
        
        print("NCBI EFetch via Biopython Successful:")
        print(f"Record ID: {record.id}")
        print(f"Description: {record.description}")
        print(f"DNA Sequence Length: {len(record.seq)} base pairs")
    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == "__main__":
    # Unduh sekuens gen hemoglobin subunit beta manusia
    fetch_ncbi_record_biopython("NM_000518.5")
```

---

## Hands-on Exercise
**Objective:** Melakukan transkripsi dan translasi sekuens DNA referensi yang dibaca dari file secara terprogram, kemudian menyimpannya ke format file protein FASTA baru.

**Setup:**
```bash
pip install biopython
```

**Task:**
Tulis kode Python untuk membaca sekuens nukleotida DNA dari string simulasi menggunakan kelas pembungkus `SeqRecord` Biopython, lakukan translasi untai DNA tersebut menjadi untai asam amino protein, dan simpan hasilnya sebagai file FASTA baru bernama `output_protein.fasta`.

```python
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio import SeqIO

# 1. Mendefinisikan sekuens DNA awal pembawa sandi biologis
dna_sequence = Seq("ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTG")

# 2. Membungkus ke dalam objek SeqRecord lengkap dengan metadata anotasi
dna_record = SeqRecord(
    dna_sequence,
    id="HBB_GENE_MOCK",
    description="Simulated Hemoglobin Beta DNA coding sequence"
)

def run_translation_pipeline():
    print(f"Original DNA Sequence: {dna_record.seq} ({len(dna_record.seq)} bp)")
    
    # 3. Lakukan proses translasi biologis menjadi rantai asam amino protein
    # 3 DNA huruf menyusun 1 Asam Amino (Kodon)
    protein_seq = dna_record.seq.translate()
    
    # 4. Bungkus protein baru ke SeqRecord terpisah
    protein_record = SeqRecord(
        protein_seq,
        id=f"{dna_record.id}_PROT",
        description="Translated Hemoglobin Beta Protein sequence"
    )
    
    print(f"Translated Protein Sequence: {protein_record.seq} ({len(protein_record.seq)} residues)")
    
    # 5. Ekspor ke dalam format file FASTA baru
    output_filename = "output_protein.fasta"
    SeqIO.write(protein_record, output_filename, "fasta")
    print(f"\nSuccess: Exported protein record to file ''{output_filename}''.")

if __name__ == "__main__":
    run_translation_pipeline()
```

**Expected Output:**
```text
Original DNA Sequence: ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTG (57 bp)
Translated Protein Sequence: MVHLTPEEKSAVTALWGKV (19 residues)

Success: Exported protein record to file 'output_protein.fasta'.
```

---

## Key Takeaways
- Biopython menyediakan SDK pemrograman terpadu yang memetakan format file mentah dan API biologi ke paradigma object-oriented di Python.
- Pustaka `Bio.SeqIO` menangani pembacaan, penyaringan, dan penulisan multi-format file secara seragam, menghilangkan kebutuhan menulis parser teks manual.
- Interaksi API NCBI menggunakan modul `Bio.Entrez` menangani penataan query dan parsing dokumen XML hasil kembalian server secara aman.

## Further Reading
- The Biopython Tutorial and Cookbook — http://biopython.org/DIST/docs/tutorial/Tutorial.html
- Biopython GitHub Repository

## Quiz
Q1: Manakah modul di Biopython yang bertindak sebagai Unified interface I/O untuk membaca dan menulis berkas FASTA/FASTQ secara transparan?
A) Bio.Entrez
B) Bio.SeqIO ✓
C) Bio.Blast
D) Bio.Graphics
Explanation: `Bio.SeqIO` adalah antarmuka I/O terintegrasi utama di Biopython yang digunakan untuk membaca (parse/read) dan mengekspor (write) berbagai format sekuens secara seragam.

Q2: Mengapa Anda wajib menetapkan nilai variabel `Entrez.email` saat memanggil REST API NCBI menggunakan Biopython?
A) Agar NCBI bisa mengirimkan tagihan pembayaran bulanan.
B) Sebagai kebijakan kepatuhan NCBI untuk melacak penggunaan API, menghubungi pengguna jika terdeteksi lonjakan beban trafik abnormal, dan menghindari pemblokiran IP otomatis. ✓
C) Untuk mendaftarkan akun newsletter riset biologi.
D) Agar program Python berjalan lebih cepat.
Explanation: NCBI membatasi frekuensi request. Menyertakan email yang valid mempermudah NCBI memberi peringatan jika skrip program Anda memicu overload request sebelum IP Anda di-ban otomatis.

Q3: Di dalam kelas representasi Biopython, apa perbedaan utama antara kelas `Seq` dengan kelas `SeqRecord`?
A) `Seq` hanya menyimpan string nukleotida biasa dengan metode biologis, sedangkan `SeqRecord` membungkus `Seq` bersama informasi metadata lengkap seperti ID, anotasi, deskripsi, dan fitur. ✓
B) `Seq` ditulis dalam bahasa C, sedangkan `SeqRecord` ditulis dalam bahasa Python murni.
C) `Seq` digunakan untuk protein, sedangkan `SeqRecord` digunakan untuk virus.
D) `SeqRecord` tidak mendukung proses translasi DNA.
Explanation: `Seq` bertindak sebagai representasi data string nukleotida biologis murni, sedangkan `SeqRecord` meniru baris rekaman database yang menampung file metadata pendukung sekuens tersebut.'
)
;

-- Verifikasi
SELECT
  c.title AS course,
  c.level,
  c.estimated_hours,
  c.published,
  COUNT(m.id) AS total_modules
FROM public.courses c
LEFT JOIN public.modules m ON m.course_id = c.id
WHERE c.slug = 'biological-databases-file-formats'
GROUP BY c.id, c.title, c.level, c.estimated_hours, c.published;
