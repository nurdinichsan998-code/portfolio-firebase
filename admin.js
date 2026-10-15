import { OWNER_UID, storageEnabled, defaultContent, copy, configured, connect, storageClient, validateContent, safeUrl, normalizeCategory } from './cms.js';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
let backend=null, ready=false, dirty=false, busy=false, revision=0, session=0, uploadTask=null, deniedAccount=false;
const publish=$('#publish-content'), fields=$('#editor-fields'), form=$('#editor-form');
function status(text,type=''){const el=$('#app-status');el.hidden=!text;el.textContent=text;el.className='notice status '+type;}
function markDirty(){if(!ready)return;dirty=true;$('#save-state').textContent='Perubahan belum diterbitkan.';}
function setBusy(value){busy=value;fields.disabled=!ready||value;publish.disabled=!ready||value;$('#reload-content').disabled=value||!backend?.auth.currentUser||backend.auth.currentUser.uid!==OWNER_UID;$('#logout').disabled=value;publish.textContent=value?'Memproses…':'Terbitkan perubahan';}
function input(name){return form.elements.namedItem(name);}
function text(name){return String(input(name)?.value||'').trim();}
function lines(value){return value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);}
function field(name,label,value='',options={}){
  const wrap=create('div','field'), id='field-'+name.replace(/[^a-zA-Z0-9-]/g,'-');
  const labelEl=create('label','',label);labelEl.htmlFor=id;
  const el=create(options.rows?'textarea':'input');el.id=id;el.name=name;el.value=value;el.maxLength=options.max||2000;
  if(options.rows)el.rows=options.rows;else el.type=options.type||'text';
  if(options.required)el.required=true;
  wrap.append(labelEl,el);return wrap;
}
const shortFields={name:['Nama lengkap',100,true],shortName:['Nama singkat di navigasi',60,true],headline:['Headline / keahlian utama',300,true],degree:['Gelar / jurusan',150],university:['Universitas',200],currentRole:['Peran saat ini',150],currentCompany:['Perusahaan saat ini',150],focusTitle:['Judul ringkasan profil',200]};
function populate(c){
  $('#profile-fields').replaceChildren(...Object.entries(shortFields).map(([key,[label,max,required]])=>field('profile.'+key,label,c.profile[key],{max,required})));
  $('#profile-long-fields').replaceChildren(field('profile.bio','Sub-headline / perkenalan',c.profile.bio,{rows:4,max:2500,required:true}),field('profile.about','Tentang saya (pisahkan paragraf dengan baris kosong)',c.profile.about,{rows:7,max:10000}),field('profile.focusDescription','Deskripsi ringkasan profil',c.profile.focusDescription,{rows:3,max:1000}));
  input('profile.photoUrl').value=c.profile.photoUrl;input('profile.photoAlt').value=c.profile.photoAlt;$('#photo-file').value='';
  renderExperience(c.experience);renderProjects(c.projects);renderSkills(c.skills);
  $('#contact-fields').replaceChildren(field('contact.email','Email publik / penerima pesan',c.contact.email,{type:'email',max:254}),field('contact.linkedin','URL profil LinkedIn',c.contact.linkedin,{type:'url',max:2048}),field('contact.portfolioUrl','Tautan Portofolio Web (HTTPS atau #proyek)',c.contact.portfolioUrl,{max:2048}));
  previewPhoto();
}
function collectExperience(){return $$('.experience-item').map((row,index)=>({role:text('experience.'+index+'.role'),company:text('experience.'+index+'.company'),detail:text('experience.'+index+'.detail'),start:text('experience.'+index+'.start'),end:text('experience.'+index+'.end'),bullets:lines(text('experience.'+index+'.bullets'))}));}
function renderExperience(rows,focusIndex=null){
  $('#experience-list').replaceChildren(...rows.map((row,index)=>{
    const article=create('article','item experience-item');const head=create('div','item-head');head.append(create('h3','','Pengalaman '+(index+1)));
    const actions=create('div','actions');
    [['Naik',-1],['Turun',1],['Hapus',0]].forEach(([label,delta])=>{
      const btn=create('button','btn'+(!delta?' danger':''),label);btn.type='button';btn.setAttribute('aria-label',label+' pengalaman '+(index+1));
      btn.disabled=(delta===-1&&index===0)||(delta===1&&index===rows.length-1);
      btn.addEventListener('click',()=>{
        const current=collectExperience();
        if(!delta){if(!window.confirm('Hapus pengalaman ini dari draft? Penghapusan baru tampil publik setelah diterbitkan.'))return;current.splice(index,1);}
        else [current[index],current[index+delta]]=[current[index+delta],current[index]];
        renderExperience(current,Math.min(current.length-1,Math.max(0,index+delta)));markDirty();
      });actions.append(btn);
    });head.append(actions);article.append(head);
    const prefix='experience.'+index+'.',grid=create('div','two');
    grid.append(field(prefix+'role','Jabatan',row.role,{max:200,required:true}),field(prefix+'company','Perusahaan',row.company,{max:200,required:true}),field(prefix+'detail','Tim / detail tambahan',row.detail,{max:200}),field(prefix+'start','Mulai',row.start,{type:'month',max:7,required:true}),field(prefix+'end','Selesai (kosongkan jika masih bekerja)',row.end,{type:'month',max:7}));
    article.append(grid,field(prefix+'bullets','Deskripsi pekerjaan (satu poin per baris)',row.bullets.join('\n'),{rows:4,max:18000}));return article;
  }));
  $('#add-experience').disabled=rows.length>=30;
  if(focusIndex!==null&&focusIndex>=0)input('experience.'+focusIndex+'.role')?.focus();
}
// Project form fields use stable IDs, so deleting a project never shifts another draft.
function mayEdit(){return ready && !busy && backend?.auth.currentUser?.uid===OWNER_UID;}
function projectPrefix(id){return 'projects.'+id+'.';}
function newProject(){return {id:'project-'+crypto.randomUUID(),title:'',description:'',url:'',category:'Web Development',tags:[],images:[]};}
function collectProjects(){
  return $$('.project-item').map(row=>{
    const id=row.dataset.projectId,prefix=projectPrefix(id);
    return {id,title:text(prefix+'title'),description:text(prefix+'description'),url:text(prefix+'url'),
      category:normalizeCategory(text(prefix+'category')),tags:lines(text(prefix+'tags')),images:lines(text(prefix+'images'))};
  });
}
function updateProjectLabels(){
  const rows=$$('.project-item');
  rows.forEach((row,i)=>{$('h3',row).textContent='Proyek '+(i+1);});
  $('#project-count').textContent=rows.length ? rows.length+' proyek dalam draft.' : 'Belum ada proyek. Klik Tambah Proyek Baru.';
}
function renderImagePreviews(row){
  const prefix=projectPrefix(row.dataset.projectId), urls=lines(text(prefix+'images'));
  const grid=$('.project-images-grid',row);grid.replaceChildren();
  urls.slice(0,8).forEach((url,i)=>{
    const figure=create('figure','project-image-item');
    const label=create('figcaption','',i===0?'1 · Thumbnail utama':String(i+1));
    const valid=safeUrl(url);
    if(valid){
      const img=create('img');img.src=valid;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.alt='Pratinjau gambar '+(i+1);
      img.addEventListener('error',()=>{img.hidden=true;label.textContent=(i+1)+' · Gambar tidak dapat dimuat';},{once:true});figure.append(img);
    }else{label.textContent=(i+1)+' · URL HTTPS tidak valid';}
    const remove=create('button','btn danger','Hapus Foto');remove.type='button';
    remove.addEventListener('click',()=>{
      if(!mayEdit())return;
      const current=lines(text(prefix+'images'));current.splice(i,1);input(prefix+'images').value=current.join('\n');
      renderImagePreviews(row);markDirty();input(prefix+'images').focus();
    });
    figure.append(label,remove);grid.append(figure);
  });
  $('.project-image-count',row).textContent=urls.length+' URL gambar. Urutan mengikuti baris; maksimal 8 pratinjau ditampilkan di editor.';
}
function createProjectRow(project){
  const row=create('article','item project-item');row.dataset.projectId=project.id;
  const prefix=projectPrefix(project.id),head=create('div','item-head'),remove=create('button','btn danger','Hapus Proyek');remove.type='button';
  head.append(create('h3','','Proyek'),remove);row.append(head);
  remove.addEventListener('click',()=>{
    if(!mayEdit()||!confirm('Hapus proyek ini dari draft? Perubahan baru tampil publik setelah diterbitkan. File Storage tidak dihapus.'))return;
    const neighbor=row.nextElementSibling||row.previousElementSibling;
    row.remove();updateProjectLabels();markDirty();
    (neighbor?.querySelector('input')||$('#add-project')).focus();
  });
  row.append(field(prefix+'title','Judul proyek',project.title,{max:200,required:true}),
    field(prefix+'description','Deskripsi',project.description,{rows:4,max:3000}),
    field(prefix+'url','Tautan HTTPS / anchor halaman (opsional)',project.url,{max:2048}));
  const category=field(prefix+'category','Kategori — pilih preset atau ketik sendiri',normalizeCategory(project.category),{max:100,required:true});
  category.querySelector('input').setAttribute('list','project-category-options');row.append(category);
  row.append(field(prefix+'tags','Tag (satu per baris, maksimal 15)',project.tags.join('\n'),{rows:3,max:1600}),
    field(prefix+'images','URL gambar HTTPS (satu per baris; foto pertama menjadi thumbnail)',project.images.join('\n'),{rows:5,max:150000}));
  const count=create('p','file-note project-image-count'),grid=create('div','project-images-grid');row.append(count,grid);
  const uploadWrap=create('div','field'),label=create('label','','Atau pilih beberapa foto sekaligus'),file=create('input');
  file.id='project-files-'+project.id;label.htmlFor=file.id;file.type='file';file.multiple=true;file.accept='image/jpeg,image/png,image/webp';file.disabled=!storageEnabled;
  uploadWrap.append(label,file);row.append(uploadWrap);
  const upload=create('button','btn','Unggah Foto Terpilih');upload.type='button';upload.disabled=!storageEnabled;
  const progress=create('progress');progress.max=100;progress.value=0;progress.hidden=true;progress.setAttribute('aria-label','Progres unggahan foto proyek');
  const uploadStatus=create('p','project-upload-status');uploadStatus.setAttribute('role','status');uploadStatus.setAttribute('aria-live','polite');
  row.append(upload,progress,uploadStatus,create('p','file-note',storageEnabled?
    'JPG, PNG, WebP: maksimal 8 MB dan 24 megapiksel per file. Foto diperkecil hingga sisi panjang 2400 px tanpa dipotong; hasil WebP di bawah 1 MB. Unggahan tersimpan publik, lalu URL ditambahkan ke draft. Terbitkan untuk menampilkan perubahan.':
    'Unggah belum diaktifkan. Gunakan URL HTTPS atau aktifkan Firebase Storage dan izin tulis untuk folder projects/ sesuai panduan konfigurasi Anda.'));
  upload.addEventListener('click',()=>uploadProjectFiles(row,file,progress,uploadStatus));
  row.querySelector('[name="'+prefix+'images"]').addEventListener('change',()=>renderImagePreviews(row));
  return row;
}
function renderProjects(projects){
  $('#project-list').replaceChildren(...projects.map(createProjectRow));
  $$('.project-item').forEach(renderImagePreviews);updateProjectLabels();
}
$('#add-project').addEventListener('click',()=>{
  if(!mayEdit())return;
  const project=newProject(),row=createProjectRow(project);$('#project-list').append(row);
  renderImagePreviews(row);updateProjectLabels();markDirty();input(projectPrefix(project.id)+'title').focus();
});
// Gallery uploads preserve the original aspect ratio; profile uploads still crop square.
async function prepareProjectImage(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)throw new Error('Pilih JPG, PNG, atau WebP maksimal 8 MB per file.');
  const bitmap=await createImageBitmap(file);
  try{
    if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>24000000)throw new Error('Gunakan gambar beresolusi maksimal 24 megapiksel.');
    const scale=Math.min(1,2400/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const context=canvas.getContext('2d');if(!context)throw new Error('Browser tidak mendukung pemrosesan gambar; gunakan URL HTTPS.');
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);
    for(const quality of [.88,.8,.7,.6]){
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
      if(blob?.type==='image/webp'&&blob.size<1048576)return blob;
    }
    throw new Error('Gambar belum dapat diperkecil ke WebP di bawah 1 MB. Pilih gambar lebih kecil atau gunakan URL.');
  }finally{bitmap.close();}
}
async function uploadProjectFiles(row,fileInput,progress,message){
  if(!mayEdit())return;
  const selected=Array.from(fileInput.files||[]);if(!selected.length){message.textContent='Pilih satu atau beberapa foto terlebih dahulu.';return;}
  if(selected.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){
    message.textContent='Seluruh file harus JPG, PNG, atau WebP maksimal 8 MB per file.';return;
  }
  const token=session,prefix=projectPrefix(row.dataset.projectId);let completed=0,task=null;
  setBusy(true);progress.hidden=false;progress.value=0;message.textContent='Menyiapkan unggahan…';
  try{
    const {sdk,storage}=await storageClient(backend.app);
    if(token!==session)return;
    for(const [index,file] of selected.entries()){
      if(token!==session)return;
      message.textContent='Mengunggah '+(index+1)+' dari '+selected.length+': '+file.name;
      const blob=await prepareProjectImage(file);if(token!==session)return;
      const ref=sdk.ref(storage,'projects/'+row.dataset.projectId+'/'+crypto.randomUUID()+'.webp');
      task=sdk.uploadBytesResumable(ref,blob,{contentType:'image/webp',cacheControl:'public,max-age=31536000,immutable'});uploadTask=task;
      await new Promise((resolve,reject)=>task.on('state_changed',snapshot=>{
        if(token===session)progress.value=((index+snapshot.bytesTransferred/snapshot.totalBytes)/selected.length)*100;
      },reject,resolve));
      if(token!==session)return;
      const url=await sdk.getDownloadURL(ref);if(token!==session)return;
      const urls=lines(text(prefix+'images'));urls.push(url);input(prefix+'images').value=urls.join('\n');
      completed++;renderImagePreviews(row);markDirty();
    }
    fileInput.value='';message.textContent=completed+' foto berhasil diunggah dan ditambahkan ke draft. Klik Terbitkan perubahan.';
    status('Foto proyek tersimpan. Terbitkan perubahan untuk menampilkannya di website.','success');
  }catch(error){
    if(token===session){
      if(completed)fileInput.value='';
      message.textContent='Unggahan terhenti. '+completed+' foto yang sudah berhasil tetap ada di draft. Pilih ulang hanya file yang belum berhasil. '+(error.message||'Periksa koneksi dan Storage Rules untuk folder projects/.');
      status(message.textContent,'error');
    }
  }finally{
    if(uploadTask===task)uploadTask=null;
    if(token===session){progress.hidden=true;setBusy(false);}
  }
}
function renderSkills(skills){$('#skill-list').replaceChildren(...skills.map((skill,index)=>{const article=create('article','item'),prefix='skills.'+index+'.';article.append(create('h3','','Kategori '+(index+1)),field(prefix+'title','Nama kategori',skill.title,{max:150,required:true}),field(prefix+'description','Deskripsi singkat',skill.description,{rows:2,max:1000}),field(prefix+'tags','Daftar keahlian (satu per baris)',skill.tags.join('\n'),{rows:5,max:3200}));return article;}));}
function collect(){const profile={};[...Object.keys(shortFields),'bio','about','focusDescription','photoUrl','photoAlt'].forEach(key=>profile[key]=text('profile.'+key));return {profile,contact:{email:text('contact.email'),linkedin:text('contact.linkedin'),portfolioUrl:text('contact.portfolioUrl')},experience:collectExperience(),projects:collectProjects(),skills:[0,1,2].map(index=>({title:text('skills.'+index+'.title'),description:text('skills.'+index+'.description'),tags:lines(text('skills.'+index+'.tags'))}))};}
function previewPhoto(){const img=$('#photo-preview'),url=safeUrl(input('profile.photoUrl')?.value);if(!url){img.hidden=true;img.removeAttribute('src');return;}img.hidden=false;img.referrerPolicy='no-referrer';img.alt=input('profile.photoAlt')?.value||'Pratinjau foto profil';img.src=url;}
$('#photo-preview').addEventListener('error',()=>{$('#photo-preview').hidden=true;status('Foto belum dapat dimuat. Periksa URL atau izin aksesnya.','error');});
input('profile.photoUrl').addEventListener('change',previewPhoto);input('profile.photoAlt').addEventListener('change',previewPhoto);
$('#remove-photo').addEventListener('click',()=>{input('profile.photoUrl').value='';$('#photo-file').value='';previewPhoto();markDirty();});
$('#add-experience').addEventListener('click',()=>{const rows=collectExperience();if(rows.length>=30)return;const date=new Date();rows.unshift({role:'',company:'',detail:'',start:date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0'),end:'',bullets:[]});renderExperience(rows,0);markDirty();});
form.addEventListener('input',markDirty);form.addEventListener('change',markDirty);
window.addEventListener('beforeunload',event=>{if(!dirty&&!busy)return;event.preventDefault();event.returnValue='';});
async function loadFromServer(){
  if(!backend?.auth.currentUser || backend.auth.currentUser.uid!==OWNER_UID)return;
  const token=session;setBusy(true);status('Memuat konten dari server…');
  try{
    const snapshot=await backend.fs.getDocFromServer(backend.reference);
    if(token!==session)return;
    const c=snapshot.exists()?validateContent(copy(snapshot.data().content)):copy(defaultContent);
    revision=snapshot.exists()?snapshot.data().revision:0;
    populate(c);ready=true;dirty=false;$('#save-state').textContent=revision?'Versi terbit '+revision+'. Belum ada perubahan.':'Konten awal dimuat. Belum diterbitkan ke Firebase.';
    status(revision?'Konten terbaru dimuat dari server.':'Database masih kosong. Periksa data awal, lalu terbitkan untuk mengaktifkan konten online.');
  }catch(error){if(token!==session)return;status('Gagal memuat konten. Periksa koneksi, database, UID admin, dan Firestore Rules. '+(error.message||''),'error');}
  finally{if(token===session)setBusy(false);}
}
$('#reload-content').addEventListener('click',()=>{if(dirty&&!confirm('Buang perubahan yang belum diterbitkan dan muat ulang dari server?'))return;loadFromServer();});
form.addEventListener('submit',async event=>{
  event.preventDefault();if(!ready||busy||!backend?.auth.currentUser || backend.auth.currentUser.uid!==OWNER_UID)return;
  if(!form.reportValidity())return;
  let content;try{content=validateContent(collect());}catch(error){status(error.message,'error');return;}
  if(!confirm('Terbitkan perubahan ini? Konten akan tampil untuk semua pengunjung.'))return;
  const token=session,expected=revision;setBusy(true);status('Menerbitkan perubahan…');
  try{
    const next=await backend.fs.runTransaction(backend.db,async transaction=>{
      const snapshot=await transaction.get(backend.reference);
      const current=snapshot.exists()?snapshot.data().revision:0;
      if(current!==expected)throw new Error('Konten telah berubah di sesi lain. Salin perubahan Anda bila perlu, lalu muat ulang dari server agar tidak menimpa versi terbaru.');
      const nextRevision=current+1;
      transaction.set(backend.reference,{schemaVersion:1,content,revision:nextRevision,updatedAt:backend.fs.serverTimestamp(),updatedBy:backend.auth.currentUser.uid});return nextRevision;
    });
    if(token!==session)return;revision=next;dirty=false;$('#save-state').textContent='Versi '+next+' berhasil diterbitkan.';status('Perubahan berhasil diterbitkan ke server. Website publik akan menerima pembaruan saat terhubung.','success');
  }catch(error){if(token===session)status('Belum diterbitkan. '+(error.message||'Periksa koneksi dan izin akses.'),'error');}
  finally{if(token===session)setBusy(false);}
});
// Image conversion before upload: reject SVG, limit file size and dimensions,
// re-encode pixels to WebP rather than trusting the original MIME alone.
async function preparePhoto(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)throw new Error('Pilih JPG, PNG, atau WebP maksimal 8 MB.');
  const bitmap=await createImageBitmap(file);
  try{
    if(bitmap.width*bitmap.height>24000000)throw new Error('Resolusi foto terlalu besar. Gunakan gambar di bawah 24 megapiksel.');
    const canvas=document.createElement('canvas');canvas.width=640;canvas.height=640;const context=canvas.getContext('2d');
    if(!context)throw new Error('Browser tidak mendukung pemrosesan foto. Gunakan URL HTTPS.');
    const side=Math.min(bitmap.width,bitmap.height);context.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,640,640);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.86));
    if(!blob||blob.type!=='image/webp'||blob.size>=1048576)throw new Error('Foto tidak dapat diperkecil ke WebP. Coba file lain atau gunakan URL.');return blob;
  }finally{bitmap.close();}
}
$('#upload-photo').addEventListener('click',async()=>{
  if(!ready||busy||!backend?.auth.currentUser||backend.auth.currentUser.uid!==OWNER_UID)return;
  const token=session;setBusy(true);status('Menyiapkan foto…');
  try{
    const blob=await preparePhoto($('#photo-file').files[0]);if(token!==session)return;
    const {sdk,storage}=await storageClient(backend.app);if(token!==session)return;
    const path='profile/avatar-'+crypto.randomUUID()+'.webp';
    const reference=sdk.ref(storage,path);uploadTask=sdk.uploadBytesResumable(reference,blob,{contentType:'image/webp',cacheControl:'public,max-age=31536000,immutable'});
    const progress=$('#upload-progress');progress.hidden=false;
    await new Promise((resolve,reject)=>uploadTask.on('state_changed',snapshot=>{progress.value=snapshot.bytesTransferred/snapshot.totalBytes*100;},reject,resolve));
    const url=await sdk.getDownloadURL(reference);if(token!==session)return;
    input('profile.photoUrl').value=url;previewPhoto();markDirty();status('Foto diunggah. Klik Terbitkan perubahan agar foto dipakai oleh website publik.','success');
  }catch(error){if(token===session)status('Foto belum diterapkan. '+(error.message||'Periksa Firebase Storage, paket Blaze, dan Storage Rules.'),'error');}
  finally{uploadTask=null;$('#upload-progress').hidden=true;if(token===session)setBusy(false);}
});
// Login uses session persistence. Never embed an admin password in source code.
$('#toggle-password').addEventListener('click',()=>{const field=$('#login-password'),show=field.type==='password';field.type=show?'text':'password';$('#toggle-password').setAttribute('aria-pressed',String(show));$('#toggle-password').textContent=show?'Sembunyikan sandi':'Tampilkan sandi';});
$('#login-form').addEventListener('submit',async event=>{
  event.preventDefault();if(!backend)return;
  $('#login-submit').disabled=true;status('Memeriksa akun…');
  try{await backend.authSDK.signInWithEmailAndPassword(backend.auth,$('#login-email').value.trim(),$('#login-password').value);$('#login-password').value='';}
  catch{status('Login gagal. Periksa email, kata sandi, koneksi, dan pengaturan Authentication.','error');}
  finally{$('#login-submit').disabled=false;}
});
$('#reset-password').addEventListener('click',async()=>{
  if(!backend)return;const email=$('#login-email');if(!email.reportValidity())return;
  $('#reset-password').disabled=true;
  try{await backend.authSDK.sendPasswordResetEmail(backend.auth,email.value.trim());status('Jika email terdaftar dan permintaan diterima, petunjuk pemulihan akan tersedia di inbox/spam Anda.');}
  catch{status('Jika akun tersedia, coba pemulihan kembali setelah memeriksa email dan koneksi.','error');}
  finally{$('#reset-password').disabled=false;}
});
$('#logout').addEventListener('click',async()=>{if(dirty&&!confirm('Keluar dan buang perubahan yang belum diterbitkan?'))return;try{await backend.authSDK.signOut(backend.auth);}catch{status('Belum dapat keluar. Coba lagi.','error');}});
if(!storageEnabled){$('#upload-photo').disabled=true;$('#photo-file').disabled=true;$('#storage-note').textContent='Unggah belum diaktifkan. Gunakan URL HTTPS, atau aktifkan Firebase Storage (paket Blaze) sesuai panduan.';}
if(!configured())status('Setup belum selesai. Isi firebase-config.js, buat akun admin, dan terapkan aturan keamanan sesuai panduan.','error');
else{
  try{
    backend=await connect();await backend.authSDK.setPersistence(backend.auth,backend.authSDK.browserSessionPersistence);
    backend.authSDK.onAuthStateChanged(backend.auth,async user=>{
      session++;if(uploadTask)uploadTask.cancel();ready=false;dirty=false;setBusy(false);
      const allowed=!!user&&user.uid===OWNER_UID;
      $('#editor-view').hidden=!allowed;$('#login-view').hidden=allowed;$('#logout').hidden=!user;$('#identity').hidden=!allowed;
      if(allowed){$('#identity').textContent=user.email||'Admin';await loadFromServer();}
      else if(user){deniedAccount=true;status('Akun ini tidak memiliki akses admin.','error');try{await backend.authSDK.signOut(backend.auth);}catch{}}
      else{status(deniedAccount?'Akun tersebut tidak memiliki akses admin. Gunakan akun dengan UID yang sudah diizinkan.':'Masuk menggunakan akun admin yang sudah dibuat di Firebase Console.',deniedAccount?'error':'');deniedAccount=false;}
    });
  }catch{status('Firebase belum dapat terhubung. Periksa konfigurasi, jaringan, domain hosting, dan pengaturan Authentication.','error');}
}
