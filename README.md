# CuacaKita AI

Platform prediksi cuaca dan analisis pertanian yang mengintegrasikan data real-time dari Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) dengan sistem deteksi hama cerdas dan konsultasi berbasis kecerdasan buatan untuk mendukung pengambilan keputusan petani Indonesia.

---

## Deployment di Vercel

### Prasyarat
- Akun GitHub untuk repository
- Akun Vercel (https://vercel.com)

### Step-by-Step Deployment

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CuacaKita AI"
   git remote add origin https://github.com/username/cuacakita-ai.git
   git branch -M main
   git push -u origin main
   ```

2. **Setup di Vercel Dashboard:**
   - Buka https://vercel.com dan login dengan akun Anda
   - Klik "Add New..." → "Project"
   - Import repository GitHub yang sudah dibuat
   - Vercel otomatis mendeteksi Next.js project

3. **Konfigurasi Environment Variables:**
   Dalam proses import, di tab "Environment Variables", tambahkan:
   ```
   NEXT_PUBLIC_APP_NAME = CuacaKita AI
   NEXT_PUBLIC_DEFAULT_ADM4 = 34.04.13.2001
   BMKG_API_BASE_URL = https://api.bmkg.go.id/publik/prakiraan-cuaca
   BMKG_TIMEOUT_MS = 8000
   ```

4. **Deploy:**
   - Klik "Deploy"
   - Tunggu build process selesai (biasanya 2-3 menit)
   - Vercel memberikan URL deployment otomatis (contoh: https://cuacakita-ai.vercel.app)

### Troubleshooting Deployment

| Error | Solusi |
|-------|--------|
| `404: NOT_FOUND` saat akses URL | Pastikan environment variables sudah ter-set; redeploy dengan `vercel --prod` |
| Build failed | Cek build log di Vercel Dashboard; pastikan semua dependencies terinstall |
| API BMKG tidak merespons | Normal jika API timeout; aplikasi fallback ke mock data otomatis |
| Styling berantakan di production | Clear cache: `npm run build && npm run start` locally, verifikasi output |

### Update Deployment

Setiap push ke branch `main` otomatis trigger deployment ulang di Vercel.

```bash
# Edit local, commit, push
git add .
git commit -m "Update: [deskripsi perubahan]"
git push origin main

# Vercel otomatis deploy dalam hitungan detik
```

---

## 1. Pendahuluan

### Latar Belakang

Pertanian merupakan sektor strategis dalam perekonomian Indonesia yang masih mengandalkan kearifan lokal dan pengalaman turun-temurun. Namun, perubahan iklim global menyebabkan variabilitas cuaca yang semakin sulit diprediksi dengan metode tradisional. Fenomena seperti kekeringan mendadak, hujan lebat yang tak terduga, dan perubahan suhu ekstrem berdampak langsung pada produktivitas pertanian.

Petani memerlukan akses informasi cuaca yang akurat dan tepat waktu untuk merencanakan waktu tanam, pengairan, dan pengendalian hama. Saat ini, akses terhadap data meteorologi masih terbatas dan kurang terintegrasi dengan kebutuhan spesifik sektor pertanian. Oleh karena itu, diperlukan platform yang menggabungkan data cuaca resmi dari BMKG dengan analisis cerdas tentang potensi serangan hama dan rekomendasi agronomis berbasis AI.

### Tujuan

Proyek ini bertujuan untuk:

1. Menyediakan informasi prakiraan cuaca per jam dengan akurasi tinggi yang bersumber dari BMKG
2. Mengidentifikasi potensi risiko serangan hama berdasarkan kondisi cuaca real-time
3. Memberikan konsultasi pertanian otomatis melalui sistem tanya jawab berbasis kecerdasan buatan
4. Memfasilitasi pertukaran informasi cuaca antarwarga melalui fitur laporan dan verifikasi komunitas
5. Menghadirkan antarmuka yang intuitif dan responsif agar mudah diakses dari perangkat seluler di area perdesaan

### Manfaat

**Bagi Petani:**
- Akses informasi cuaca akurat setiap saat tanpa biaya tambahan
- Deteksi dini potensi hama melalui analisis kondisi cuaca
- Konsultasi langsung dengan sistem AI untuk menjawab pertanyaan pertanian
- Pengetahuan berbagi melalui laporan cuaca komunitas

**Bagi Pengambil Kebijakan:**
- Data agregat tentang kondisi cuaca lokal di berbagai wilayah
- Insight tentang pola serangan hama untuk perencanaan pertanian strategis
- Basis data pertanyaan dan jawaban untuk identifikasi kebutuhan edukasi pertanian

**Bagi Ekosistem Pertanian:**
- Integrasi harmonis antara data pemerintah (BMKG) dengan kebutuhan grassroots
- Pemberdayaan petani melalui teknologi terbuka dan mudah diakses

### Batasan

1. **Cakupan Geografis:** Aplikasi awalnya mencakup 18 kota/kabupaten besar di Indonesia dengan prioritas pada pulau Jawa dan Sumatera
2. **Akurasi Data:** Prakiraan cuaca bergantung pada kualitas dan update data dari BMKG; keterlambatan publikasi akan mempengaruhi keaktualan informasi
3. **Konektivitas:** Fitur real-time memerlukan koneksi internet yang stabil; aplikasi tetap dapat berjalan dalam mode offline dengan data cache
4. **Basis Pengetahuan AI:** Database pertanyaan-jawaban pertanian terbatas pada topik-topik umum; kasus-kasus spesifik mungkin memerlukan konsultasi langsung
5. **Model Deteksi Hama:** Deteksi risiko hama berbasis parameter cuaca umum (suhu, kelembaban) tanpa integrasi dengan monitoring lapangan real-time

---

## 2. Batasan Software Development

### Persyaratan Sistem

- **Node.js:** Versi 18.0 atau lebih tinggi
- **RAM Minimum:** 512 MB
- **Penyimpanan:** 500 MB untuk instalasi dan dependencies
- **Browser:** Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ (semua browser modern dengan dukungan ES2017)
- **Koneksi Internet:** Diperlukan untuk mengunduh data cuaca real-time dari BMKG

### Keterbatasan Teknis

1. **Rate Limiting API BMKG:** Endpoint publik BMKG dapat memiliki pembatasan akses; aplikasi menggunakan fallback data mock jika API tidak responsif
2. **Timeout:** Fetch data dari BMKG dibatasi 8 detik; jika melampaui, aplikasi menggunakan data prediksi lokal
3. **Wilayah Terdukung:** Hanya wilayah dengan kode ADM4 yang terdaftar di basis data aplikasi
4. **Browser Storage:** Data cache disimpan di local storage browser (maximum ~5 MB tergantung browser)
5. **Kompatibilitas:** Tidak didukung di browser IE11 atau versi lama lainnya

---

## 3. Metodologi Pengembangan Software

### Pendekatan Pengembangan

Pengembangan aplikasi ini menggunakan pendekatan **iteratif dan modular**:

1. **Analysis Phase:** Analisis mendalam terhadap tiga sistem terpisah (UI/UX, Machine Learning, Next.js template) yang kemudian dikonsolidasikan
2. **Integration Phase:** Penggabungan komponen-komponen terbaik dari masing-masing sistem ke dalam satu ekosistem Next.js yang kohesif
3. **Validation Phase:** Pengujian build production dan verifikasi tidak ada breaking changes sebelum deployment
4. **Cleanup Phase:** Penghapusan komponen legacy dan optimasi final

### Arsitektur Sistem

```
┌─────────────────────────────────────────────┐
│         Next.js Frontend Layer              │
│  (React Components, Tailwind CSS, Lucide)   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│    API Route Layer (/api/weather)           │
│  (Request normalization, CORS handling)     │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  External Data Sources (BMKG Public API)    │
│  + Local Mock Data Fallback                 │
└─────────────────────────────────────────────┘
```

### Stack Teknologi

- **Framework:** Next.js 16.2.6 dengan React 19.2.4
- **Styling:** Tailwind CSS 4 untuk responsive design dan custom animations
- **Type Safety:** TypeScript 5 dengan strict mode configuration
- **Icons:** Lucide React untuk konsistensi visual component
- **Build Tool:** Next.js built-in Webpack dengan incremental compilation
- **Development:** ESLint untuk code quality enforcement

---

## 4. Analisis Kebutuhan dan Desain Solusi

### Analisis Stakeholder

**Primary Users (Petani):**
- Kebutuhan: Akses mudah ke informasi cuaca dari perangkat dengan koneksi terbatas
- Solusi: Interface mobile-first yang responsif, mode offline dengan cache

**Secondary Users (Konsultan Pertanian):**
- Kebutuhan: Analisis trend cuaca dan pola hama di wilayah tertentu
- Solusi: Dashboard agregasi data, historical trend charts

**Data Providers (BMKG):**
- Kebutuhan: Integrasi clean dengan minimal request redundancy
- Solusi: API route proxy yang efficient dengan caching strategy

### Desain Solusi Teknis

**Komponen UI Utama:**

1. **Navbar:** Header navigasi dengan scroll detection, menu mobile collapse, quick access ke fitur utama
2. **HeroSection:** Landing page dengan statistik real-time, weather overview, call-to-action
3. **WeatherSection:** City selector dropdown, hourly forecast cards (12 jam), min/max temperature, weather condition emoji
4. **PestSection:** Risk assessment widget berdasarkan suhu dan kelembaban, rekomendasi penanganan
5. **AISection:** Chat-like interface dengan knowledge base pertanyaan-jawaban predefined
6. **ReportSection:** Form pengajuan laporan cuaca komunitas, voting system untuk verifikasi
7. **Footer:** Attribution dan link ke data source (BMKG, Kementan, BPTP)

**Data Flow:**

```
User Input (Select City)
    ↓
useBMKG Hook (React useCallback)
    ↓
Fetch /api/weather?adm4=CODE
    ↓
API Route (fetch BMKG endpoint)
    ↓
Response ← BMKG JSON / Fallback Mock Data
    ↓
Component Render (Weather Cards, Charts)
    ↓
Local Storage Cache (30 mins)
```

### Desain Database

**Cities Table:**
```json
{
  "id": "banten-serang",
  "name": "Serang",
  "province": "Banten",
  "adm4": "36.01.01.2002",
  "lat": -6.12,
  "lon": 106.15
}
```

**Pest Detection Rules:**
```json
{
  "name": "Wereng Coklat",
  "conditions": {
    "temp_min": 20, "temp_max": 28,
    "humidity_min": 70
  },
  "risk_level": "tinggi"
}
```

---

## 5. Implementasi Software Development

### Setup Awal

1. **Clone atau extract project:**
   ```bash
   cd d:\Sans\app
   ```

2. **Buat file environment:**
   ```bash
   cp .env.example .env.local
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka browser ke `http://localhost:3000`

### Struktur Project

```
app/
├── app/
│   ├── page.tsx                 # Main landing page
│   ├── layout.tsx               # Root layout dengan font & metadata
│   ├── globals.css              # Global styles dengan Tailwind config
│   ├── api/
│   │   └── weather/
│   │       └── route.ts         # API endpoint BMKG proxy
│   └── components/
│       ├── Navbar.tsx           # Navigation header
│       ├── HeroSection.tsx       # Hero dengan stats
│       ├── WeatherSection.tsx    # Forecast display
│       ├── PestSection.tsx       # Pest risk analyzer
│       ├── AISection.tsx         # Chat interface
│       ├── ReportSection.tsx     # Community reports
│       └── Footer.tsx            # Footer attribution
├── data/
│   └── cities.ts                # City database & weather codes
├── hooks/
│   └── useBMKG.ts               # Weather fetch hook
├── lib/
│   └── weather.ts               # Utility functions
├── public/
│   └── images/                  # Static assets
├── .env.example                 # Environment template
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
└── package.json
```

### Komponen Utama & Fungsi

**useBMKG.ts - Weather Fetching Hook:**
```typescript
const fetchWeather = useCallback(async (adm4: string) => {
  try {
    const res = await fetch(`/api/weather?adm4=${adm4}`);
    const json = await res.json();
    setData(json);  // BMKG response
  } catch (e) {
    setData(generateMockData(adm4));  // Fallback
  }
}, []);
```

**API Route (/api/weather):**
- Menerima query parameter `adm4` (area code)
- Fetch dari BMKG endpoint dengan timeout 8 detik
- Normalisasi response dan return data terstruktur
- Error handling dengan fallback mock data

### Environment Variables

```
NEXT_PUBLIC_APP_NAME=CuacaKita AI
NEXT_PUBLIC_DEFAULT_ADM4=34.04.13.2001    # Default location (Jakarta)

BMKG_API_BASE_URL=https://api.bmkg.go.id/publik/prakiraan-cuaca
BMKG_TIMEOUT_MS=8000

# Optional future integration
GROQ_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### Build & Deployment

**Development build:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run start
```

**Build validation:**
```bash
npm run build
# Cek output: ✓ Compiled successfully
# Routes: ○ / (Static), ƒ /api/weather (Dynamic)
```

---

## 6. Screenshot & Mockup Interface

### Hero Section
- Background gradient dengan animated particles
- Display waktu real-time dan greeting sesuai jam
- Statistik 4 widget: Kota Terdukung, Data Jam-jaman, Hama Terdeteksi, Laporan Warga
- CTA buttons untuk quick access ke fitur utama

### Weather Section
- Dropdown selector kota dari 18 pilihan
- Carousel display cuaca current (suhu besar, kondisi, humidity, wind)
- Hourly forecast cards (12 jam ke depan)
  - Setiap card: jam, ikon cuaca, suhu, deskripsi
  - Scrollable horizontal pada mobile
- Min/Max temperature display

### Pest Detection Section
- Interactive sliders untuk temperature dan humidity
- Real-time risk calculation untuk 6 tipe hama utama
- Risk level badge: Rendah (green), Sedang (yellow), Tinggi (red)
- Recommended action text untuk setiap hama

### AI Consultation
- Chat-like interface dengan message bubbles
- Input field dengan send button
- Pre-defined quick-answer topics
- Response dari knowledge base pertanyaan-jawaban

### Community Reports
- List laporan cuaca terbaru dari komunitas
- Display: nama pelapor, waktu, lokasi, kondisi, suhu
- Vote system dengan upvote/downvote buttons
- Form untuk submit laporan baru

### Design System
- **Color Palette:** Gradient dari biru (cuaca) ke hijau (pertanian)
- **Typography:** Plus Jakarta Sans font, font weight 500-700
- **Spacing:** 8px grid system
- **Responsive:** Mobile-first, breakpoint di 640px, 1024px

---

## 7. Dokumentasi Cara Penggunaan

### Panduan User - Petani

#### Mulai Menggunakan Aplikasi

1. **Akses aplikasi** di browser (desktop atau mobile)
2. **Pilih lokasi** dari dropdown kota - aplikasi akan menampilkan cuaca lokal Anda
3. **Lihat prakiraan cuaca** per jam untuk 12 jam ke depan
4. **Scroll ke bawah** untuk melihat analisis risiko hama di wilayah Anda

#### Mengecek Prakiraan Cuaca

- Setiap forecast card menampilkan: waktu, ikon cuaca, suhu, dan deskripsi
- Suhu ditampilkan dalam Celsius
- Scroll horizontal untuk melihat forecast lebih lanjut (pada mobile)
- Keterangan emoji cuaca: ☀️ cerah, ⛅ berawan, 🌧️ hujan, dll

#### Deteksi Risiko Hama

1. Lihat section "Analisis Hama" di halaman
2. Adjust slider suhu dan kelembaban sesuai kondisi lapangan Anda (atau biarkan default dari cuaca real-time)
3. Baca risk level untuk setiap hama:
   - **Rendah:** Monitor berkala, terapkan pencegahan standar
   - **Sedang:** Perhatian khusus, pertahankan sanitasi lahan
   - **Tinggi:** Perlu tindakan segera, pertimbangkan aplikasi pestisida/agensia hayati
4. Lihat "Aksi Rekomendasi" untuk saran penanganan

#### Bertanya tentang Pertanian

1. Scroll ke section "Konsultasi AI"
2. Ketik pertanyaan Anda di kolom input (contoh: "Bagaimana cara mengatasi padi yang terserang blast?")
3. Tekan tombol Send atau Enter
4. Sistem akan memberikan jawaban berdasarkan knowledge base pertanyaan pertanian

#### Melaporkan Kondisi Cuaca

1. Scroll ke section "Laporan Komunitas"
2. Klik tombol "Buat Laporan Baru"
3. Isi form:
   - Nama Anda
   - Lokasi (nama kota/desa)
   - Kondisi cuaca yang Anda alami
   - Suhu estimasi
4. Klik "Submit" untuk mengirimkan laporan
5. Laporan Anda akan muncul di list untuk diverifikasi komunitas

#### Memverifikasi Laporan Komunitas

1. Lihat daftar laporan terbaru di section "Laporan Komunitas"
2. Jika laporan tersebut sesuai dengan kondisi Anda, klik ⬆️ **Upvote**
3. Jika laporan terasa tidak sesuai, klik ⬇️ **Downvote**
4. Laporan dengan upvote tinggi dianggap lebih terpercaya

### Panduan Teknis - Developer

#### Menjalankan Aplikasi Lokal

```bash
# 1. Setup environment
npm install

# 2. Konfigurasi environment variables
cp .env.example .env.local
# Edit .env.local dan set NEXT_PUBLIC_DEFAULT_ADM4 ke lokasi default Anda

# 3. Jalankan dev server
npm run dev

# 4. Buka browser
# http://localhost:3000
```

#### Menambah Kota/Wilayah Baru

1. Buka `app/data/cities.ts`
2. Tambahkan entry baru di array `CITIES`:
```typescript
{
  id: "provinsi-kota",
  name: "Nama Kota",
  province: "Nama Provinsi",
  adm4: "36.01.01.2001",  // Cari kode ADM4 di API BMKG
  lat: -6.1234,
  lon: 106.1234,
}
```
3. Save dan aplikasi akan reload otomatis

#### Menambah Pertanyaan Baru ke AI

1. Buka `app/components/AISection.tsx`
2. Cari object `KNOWLEDGE_BASE`
3. Tambahkan pertanyaan baru:
```typescript
"kata_kunci_baru": {
  pertanyaan: "Apa itu xxx?",
  jawaban: "Jawaban yang informatif dan praktis untuk petani lokal."
}
```
4. Sistem akan otomatis match kata kunci dari pertanyaan user

#### Mengintegrasikan API Key Pihak Ketiga

1. Edit `.env.local`:
```
GROQ_API_KEY=your_actual_key
OPENAI_API_KEY=your_actual_key
```
2. Update `app/components/AISection.tsx` untuk menggunakan API tersebut
3. Pastikan error handling tetap ada (fallback ke knowledge base lokal)

#### Build Production

```bash
# Full production build
npm run build

# Check build output
# ✓ Compiled successfully in 16.3s
# Routes:
# ├ ○ / (Static)
# └ ƒ /api/weather (Dynamic)

# Test production build locally
npm run start
```

#### Troubleshooting

| Masalah | Solusi |
|---------|--------|
| API BMKG tidak merespons | Aplikasi otomatis fallback ke mock data; cek internet connection |
| Kota tidak muncul di dropdown | Pastikan ADM4 di `cities.ts` valid; test di BMKG API browser |
| Chat AI tidak respond | Lihat console browser; cek KNOWLEDGE_BASE di AISection.tsx ada keyword match |
| Styling berantakan | Run `npm install` ulang; clear `.next` folder |
| Laporan hilang saat refresh | Laporan disimpan di state; tambahkan localStorage untuk persistence |

---

## 8. Informasi Tambahan

### Akses Data Sources

- **BMKG Weather API:** https://api.bmkg.go.id (publik, tidak perlu API key)
- **ADM4 Code Lookup:** https://www.bmkg.go.id/iklim/prakiraan-cuaca-maritim.html

### Lisensi & Atribusi

- Data cuaca: © BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) - Public Domain
- Ikon: © Lucide React - MIT License
- Framework & Library: Next.js, React, Tailwind CSS - lihat LICENSE di masing-masing repo

### Kontak & Support

Untuk pertanyaan teknis atau laporan bug, silakan buat issue di repository atau hubungi tim pengembang.

---

**Last Updated:** May 2026  
**Version:** 1.0
