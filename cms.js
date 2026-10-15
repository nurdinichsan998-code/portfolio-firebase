import { firebaseConfig, OWNER_UID, storageEnabled } from './firebase-config.js';
export { OWNER_UID, storageEnabled };
export const defaultContent = {
  "profile": {
    "name": "Muhammad Ichsan Nurdin",
    "shortName": "Ichsan Nurdin",
    "headline": "Senior Operations Analyst | AI Workflow Automation Specialist | Web Developer & Designer",
    "bio": "Lulusan S1 Teknik Elektro Universitas Muhammadiyah Surakarta dengan pengalaman memimpin tim operasional e-commerce, otomatisasi proses bisnis dengan AI/Google Apps Script, serta pengembangan antarmuka web yang intuitif.",
    "about": "Saya memadukan fondasi Teknik Elektro dengan pengalaman di operasional e-commerce berskala korporasi. Kebiasaan memahami sistem, mencari akar masalah, dan menjaga ketelitian menjadi dasar cara saya bekerja—baik saat memimpin tim maupun membangun solusi digital.\n\nDi lingkungan operasional, saya berfokus pada SLA, produktivitas, kualitas, dan pelaporan berbasis data. Di sisi teknologi, saya mengembangkan otomatisasi dengan Google Apps Script dan Gemini AI, sekaligus merancang antarmuka web yang responsif dan intuitif.\n\nBagi saya, teknologi bernilai ketika membantu manusia bekerja lebih efektif: mengurangi proses berulang, memperjelas informasi, dan membuat pengalaman digital terasa lebih sederhana.",
    "degree": "Sarjana Teknik Elektro",
    "university": "Universitas Muhammadiyah Surakarta",
    "currentRole": "Senior Analyst, Operations",
    "currentCompany": "Shopee Indonesia",
    "focusTitle": "Menghubungkan proses, manusia, dan teknologi.",
    "focusDescription": "Membawa ketelitian operasional ke dalam solusi digital yang praktis dan mudah digunakan.",
    "photoUrl": "",
    "photoAlt": "Foto profil Muhammad Ichsan Nurdin"
  },
  "contact": {
    "email": "email-anda@example.com",
    "linkedin": "",
    "portfolioUrl": "#proyek"
  },
  "experience": [
    {
      "role": "Senior Analyst, Operations",
      "company": "PT Shopee International Indonesia",
      "detail": "Seller KYC Team Lead",
      "start": "2025-04",
      "end": "",
      "bullets": [
        "Memimpin kinerja tim untuk konsisten mencapai SLA, KPI produktivitas, dan kualitas operasional.",
        "Menyusun dan menganalisis laporan harian, mingguan, serta bulanan untuk manajemen.",
        "Merancang skrip otomatisasi alur kerja dan ekstensi browser berbasis AI (Gemini AI & Google Apps Script) untuk meningkatkan efisiensi pelaporan harian."
      ]
    },
    {
      "role": "QC Content Agent",
      "company": "PT Vads Indonesia",
      "detail": "Shopee Video & Live",
      "start": "2023-03",
      "end": "2025-04",
      "bullets": [
        "Melakukan moderasi dan kurasi konten e-commerce berupa video dan livestreaming sesuai regulasi serta pedoman platform."
      ]
    },
    {
      "role": "2D Graphic Design Editor & Web Development",
      "company": "Freelance",
      "detail": "",
      "start": "2017-09",
      "end": "2023-01",
      "bullets": [
        "Merancang identitas visual, materi pemasaran, dan antarmuka web responsif untuk klien."
      ]
    },
    {
      "role": "Electrical Technician Intern",
      "company": "PT Dua Kelinci",
      "detail": "",
      "start": "2021-10",
      "end": "2021-11",
      "bullets": [
        "Melakukan inspeksi, perawatan, dan pemeliharaan sistem kelistrikan serta PLC mesin pabrik sesuai standar K3/HSE."
      ]
    }
  ],
  "projects": [
    {
      "title": "Sannur Corp Official & Catalog Website",
      "description": "Perancangan dan pengembangan website perusahaan resmi Sannur Corp yang dilengkapi dengan sistem katalog produk responsif dan antarmuka pengguna yang intuitif di berbagai perangkat.",
      "tags": [
        "Web Development",
        "Company Profile",
        "Product Catalog",
        "Responsive UI"
      ],
      "url": "https://sannur-corp.com/",
      "category": "Web Development",
      "id": "legacy-project-1",
      "images": []
    },
    {
      "title": "Testing Demo App Preview",
      "description": "Aplikasi web demonstrasi/pratinjau interaktif yang dirancang untuk pengujian antarmuka dan alur navigasi pengguna secara dinamis.",
      "tags": [
        "Web Application",
        "Preview Showcase",
        "Frontend"
      ],
      "url": "https://testingdemo-ebon.vercel.app/preview/index.html",
      "category": "Web Development",
      "id": "legacy-project-2",
      "images": []
    },
    {
      "title": "Sayur Topaz Storefront & E-Catalog",
      "description": "Antarmuka toko online/katalog produk digital Sayur Topaz yang berfokus pada kemudahan pencarian produk dan tampilan visual yang rapi.",
      "tags": [
        "E-Commerce Storefront",
        "Product Catalog",
        "Web Design"
      ],
      "url": "https://sayur-topaz.vercel.app/storefront#katalog",
      "category": "Web Development",
      "id": "legacy-project-3",
      "images": []
    },
    {
      "title": "AI-Assisted Operational Workflow Automation & Scripts",
      "description": "Pengembangan skrip otomatisasi pelaporan harian dan ekstensi penjelajah berbasis AI untuk memangkas waktu pemrosesan data dan meningkatkan efisiensi tim operasional.",
      "tags": [
        "Google Apps Script",
        "Gemini AI",
        "Browser Extension",
        "Process Automation"
      ],
      "url": "#kontak",
      "category": "AI & Automation",
      "id": "legacy-project-4",
      "images": []
    }
  ],
  "skills": [
    {
      "title": "Operations & Data",
      "description": "Menjaga kinerja, kualitas, dan keputusan berbasis data.",
      "tags": [
        "SLA Management",
        "Operations Management",
        "Quality Control (QC)",
        "Data Analysis",
        "Daily Reporting"
      ]
    },
    {
      "title": "Web & Automation",
      "description": "Membangun antarmuka dan alur kerja yang lebih efektif.",
      "tags": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Responsive Web Design",
        "Google Apps Script",
        "AI-Assisted Scripting (Gemini AI)",
        "PLC Programming"
      ]
    },
    {
      "title": "Design & Media",
      "description": "Menyampaikan informasi melalui visual yang terarah.",
      "tags": [
        "Visual/Graphic Design",
        "CorelDRAW",
        "Adobe Photoshop",
        "Photography"
      ]
    }
  ]
};
export const copy = value => JSON.parse(JSON.stringify(value));

// Backward-compatible migration. Old documents without id/images keep their content.
export const CATEGORY_PRESETS = ['Web Development', 'AI & Automation', 'Photography', '2D Design', 'Graphic Design'];
export function normalizeCategory(value) {
  const label = String(value ?? '').trim().replace(/\s+/g, ' ');
  const known = new Map([
    ['web', 'Web Development'], ['web development', 'Web Development'],
    ['automation', 'AI & Automation'], ['ai & automation', 'AI & Automation'],
    ['photography', 'Photography'], ['2d design', '2D Design'], ['graphic design', 'Graphic Design']
  ]);
  return known.get(label.toLowerCase()) || label;
}
export function isGalleryCategory(value) {
  return ['Photography', '2D Design', 'Graphic Design'].includes(normalizeCategory(value));
}
export function normalizeContent(value) {
  const c = copy(value);
  if (c && Array.isArray(c.projects)) {
    c.projects = c.projects.map((p, index) => {
      if (!p || typeof p !== 'object' || Array.isArray(p)) return p;
      return { ...p, id: p.id === undefined ? 'legacy-project-' + (index + 1) : p.id,
        category: typeof p.category === 'string' ? normalizeCategory(p.category) : p.category,
        images: p.images === undefined ? [] : p.images };
    });
  }
  return c;
}

export function configured() {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId && !!firebaseConfig.appId
    && ![firebaseConfig.apiKey,firebaseConfig.projectId,firebaseConfig.appId,OWNER_UID].some(v => !v || v.includes('GANTI_'));
}
export function safeUrl(value, allowAnchor = false) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (allowAnchor && ['#beranda','#tentang','#pengalaman','#proyek','#keahlian','#kontak'].includes(text)) return text;
  try { const url = new URL(text); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
}
export function isRealEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''))
    && !/@example\.(com|org|net)$/i.test(email);
}
function needString(value,label,max,required=false) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(label + ' tidak valid atau terlalu panjang.');
}
export function validateContent(c) {
  c = normalizeContent(c);
  if (!c || typeof c !== 'object' || !c.profile || !c.contact) throw new Error('Format konten tidak valid.');
  const p = c.profile;
  const limits={name:100,shortName:60,headline:300,bio:2500,about:10000,degree:150,university:200,currentRole:150,currentCompany:150,focusTitle:200,focusDescription:1000,photoUrl:2048,photoAlt:200};
  Object.entries(limits).forEach(([key,max])=>needString(p[key],key,max,['name','shortName','headline','bio'].includes(key)));
  if(p.photoUrl && !safeUrl(p.photoUrl)) throw new Error('Foto harus memakai URL HTTPS yang valid.');
  needString(c.contact.email,'Email',254);
  if(c.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.contact.email)) throw new Error('Format email tidak valid.');
  needString(c.contact.linkedin,'LinkedIn',2048);
  if(c.contact.linkedin){const url=safeUrl(c.contact.linkedin);if(!url || !/^https:\/\/(www\.)?linkedin\.com\/in\//i.test(url))throw new Error('Masukkan URL profil LinkedIn HTTPS yang valid.');}
  needString(c.contact.portfolioUrl,'URL portofolio',2048);
  if(c.contact.portfolioUrl && !safeUrl(c.contact.portfolioUrl,true))throw new Error('URL portofolio harus berupa HTTPS atau anchor halaman.');
  if(!Array.isArray(c.experience)||c.experience.length>30)throw new Error('Maksimal 30 pengalaman kerja.');
  c.experience.forEach((x,i)=>{
    ['role','company'].forEach(key=>needString(x[key],'Pengalaman '+(i+1)+' '+key,200,true));
    needString(x.detail,'Detail jabatan',200);needString(x.start,'Tanggal mulai',7,true);needString(x.end,'Tanggal selesai',7);
    if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(x.start)||(x.end&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(x.end)))throw new Error('Format periode harus YYYY-MM.');
    if(x.end && x.end < x.start)throw new Error('Tanggal selesai tidak boleh sebelum tanggal mulai.');
    if(!Array.isArray(x.bullets)||x.bullets.length>15)throw new Error('Maksimal 15 deskripsi per pengalaman.');
    x.bullets.forEach(b=>needString(b,'Deskripsi pengalaman',1200,true));
  });
  // No fixed project count. The total document-size budget still applies.
  if (!Array.isArray(c.projects)) throw new Error('Daftar proyek harus berupa array.');
  const projectIds = new Set();
  c.projects.forEach((x, index) => {
    const label = 'Proyek ' + (index + 1);
    if (!x || typeof x !== 'object' || Array.isArray(x)) throw new Error(label + ' tidak valid.');
    needString(x.id, label + ' ID', 80, true);
    if (!/^[a-zA-Z0-9_-]+$/.test(x.id) || projectIds.has(x.id)) throw new Error(label + ' memiliki ID tidak valid atau duplikat.');
    projectIds.add(x.id);
    needString(x.title, label + ' judul', 200, true);
    needString(x.description, label + ' deskripsi', 3000);
    needString(x.url, label + ' tautan', 2048);
    needString(x.category, label + ' kategori', 100, true);
    if (x.url && !safeUrl(x.url, true)) throw new Error(label + ': tautan harus HTTPS atau anchor halaman yang didukung.');
    if (!Array.isArray(x.tags) || x.tags.length > 15) throw new Error(label + ': maksimal 15 tag.');
    x.tags.forEach(t => needString(t, label + ' tag', 100, true));
    if (!Array.isArray(x.images)) throw new Error(label + ': images harus berupa array URL gambar.');
    x.images = x.images.map((url, imageIndex) => {
      needString(url, label + ' gambar ' + (imageIndex + 1), 2048, true);
      const valid = safeUrl(url);
      if (!valid || valid.length > 2048) throw new Error(label + ': URL gambar harus HTTPS, tanpa kredensial, maksimal 2048 karakter.');
      return valid;
    });
  });
  if(!Array.isArray(c.skills)||c.skills.length!==3)throw new Error('Terdapat tiga kelompok keahlian.');
  c.skills.forEach(x=>{needString(x.title,'Kategori keahlian',150,true);needString(x.description,'Deskripsi keahlian',1000);if(!Array.isArray(x.tags)||x.tags.length>30)throw new Error('Maksimal 30 keahlian per kategori.');x.tags.forEach(t=>needString(t,'Keahlian',100,true));});
  if(new TextEncoder().encode(JSON.stringify(c)).length > 150000)throw new Error('Konten melebihi batas 150 KB.');
  return c;
}
let pending;
export function connect() {
  if(!configured())return Promise.reject(new Error('Isi firebase-config.js dan UID admin terlebih dahulu.'));
  if(!pending)pending=(async()=>{
    const [appSDK,firestoreSDK,authSDK]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js')
    ]);
    const app=appSDK.initializeApp(firebaseConfig);
    const db=firestoreSDK.getFirestore(app);
    const auth=authSDK.getAuth(app);
    return {app,db,auth,fs:firestoreSDK,authSDK,reference:firestoreSDK.doc(db,'portfolio','main')};
  })().catch(error=>{pending=null;throw error;});
  return pending;
}
export async function storageClient(app) {
  if(!storageEnabled || !firebaseConfig.storageBucket)throw new Error('Unggah foto belum diaktifkan. Gunakan URL HTTPS atau atur Firebase Storage dengan paket Blaze.');
  const sdk=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js');
  return {sdk,storage:sdk.getStorage(app)};
}
