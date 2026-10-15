import { configured, connect, validateContent, safeUrl, copy } from './cms.js';
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const make=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
function replaceTags(container,tags){container.replaceChildren(...tags.map(tag=>make('span','tag',tag)));}
function applyPhoto(profile){
  const avatar=$('.profile-avatar');
  avatar.removeAttribute('aria-hidden');avatar.replaceChildren();
  const initials=profile.name.split(/\s+/).filter(Boolean).slice(0,3).map(n=>n[0]).join('').toUpperCase();
  const fallback=()=>{avatar.replaceChildren(make('span','',initials));avatar.setAttribute('aria-label',profile.name);};
  const url=safeUrl(profile.photoUrl);
  if(!url){fallback();return;}
  const image=make('img');image.alt=profile.photoAlt||'Foto profil '+profile.name;image.width=58;image.height=58;image.decoding='async';image.referrerPolicy='no-referrer';image.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:inherit';image.addEventListener('error',fallback,{once:true});image.src=url;avatar.append(image);
}
function renderExperience(rows){
  const list=$('.timeline');
  const format=value=>value?value.slice(5)+'/'+value.slice(0,4):'Sekarang';
  list.replaceChildren(...rows.map(row=>{
    const li=make('li','timeline-item');const date=make('div','timeline-date');
    const from=make('time','',format(row.start));from.dateTime=row.start;date.append(from,document.createTextNode(' – '));
    if(row.end){const end=make('time','',format(row.end));end.dateTime=row.end;date.append(end);}else date.append(document.createTextNode('Sekarang'));
    const content=make('div','timeline-content');const heading=make('div','timeline-title');heading.append(make('h3','',row.role));if(!row.end)heading.append(make('span','current','Saat ini'));
    const company=make('p','company',row.company+(row.detail?' · '+row.detail:''));
    const bullets=make('ul');row.bullets.forEach(text=>bullets.append(make('li','',text)));content.append(heading,company,bullets);li.append(date,content);return li;
  }));
  if(!rows.length)list.append(make('li','muted','Pengalaman kerja belum ditambahkan.'));
}
export function renderContent(raw){
  const c=validateContent(copy(raw)), p=c.profile;
  $('#intro-title').textContent=p.name;
  const dot=make('span','accent','.');$('#intro-title').append(dot);
  $('.brand strong').textContent=p.shortName;
  $('.brand').setAttribute('aria-label',p.name+', beranda');
  $('.breadcrumb span:last-child').textContent=p.name;
  $('.role').textContent=p.headline;$('.intro-copy').textContent=p.bio;
  const about=$('.prose');about.replaceChildren(...p.about.split(/\n\s*\n/).filter(Boolean).map(text=>make('p','',text)));
  $('.education-card h3').textContent=p.degree;
  const education=$$('.education-card p');education[education.length-1].textContent=p.university;
  $('.profile-card h3').textContent=p.focusTitle;
  $('.profile-card h3 + p').textContent=p.focusDescription;
  const details=$$('.profile-line strong');details[0].textContent=p.currentRole;details[1].textContent=p.currentCompany;details[2].textContent=p.degree;
  applyPhoto(p);renderExperience(c.experience);
  $$('.project-card').forEach((card,index)=>{
    const project=c.projects[index];card.dataset.category=project.category;
    card.querySelector('h3').textContent=project.title;card.querySelector('.project-body > p').textContent=project.description;replaceTags(card.querySelector('.tag-list'),project.tags);
    const link=card.querySelector('.project-link');const url=safeUrl(project.url,true)||'#kontak';link.href=url;
    const external=url.startsWith('https:');link.removeAttribute('aria-label');
    if(external){link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Lihat '+project.title+', buka tab baru');}else{link.removeAttribute('target');link.removeAttribute('rel');}
    const label=external?'Lihat website':(url==='#kontak'?'Diskusikan proyek':'Lihat detail');
    link.childNodes.forEach(child=>{if(child.nodeType===Node.TEXT_NODE)child.remove();});link.prepend(document.createTextNode(label));
    card.querySelector('.project-bottom > span').textContent=external?new URL(url).hostname:'Tanpa demo publik';
    card.querySelector('.project-meta .accent').textContent=external?'Website publik':'Tanpa demo publik';
  });
  $$('.skill-card').forEach((card,index)=>{const skill=c.skills[index];card.querySelector('h3').textContent=skill.title;card.querySelector('p').textContent=skill.description;replaceTags(card.querySelector('.tag-list'),skill.tags);});
  $('.footer > span').textContent='Copyright © 2026 '+p.name+'.';
  document.title=p.name+' — Operations, AI & Web';
  const description=$('meta[name="description"]');if(description)description.content=p.bio.slice(0,180);
  window.PORTFOLIO_CONTACT=copy(c.contact);window.dispatchEvent(new Event('portfolio:updated'));
  const active=$('[data-filter][aria-pressed="true"]');if(active)active.click();
  window.dispatchEvent(new Event('resize'));
}
const status=$('#cms-status');
function showStatus(message){status.hidden=false;status.textContent=message;}
if(configured()){
  try{
    const {fs,reference}=await connect();
    fs.onSnapshot(reference,{includeMetadataChanges:true},snapshot=>{
      // Never display stale cached data as a confirmed new publication.
      if(!snapshot.exists()){showStatus('Konten awal ditampilkan. Pemilik belum menerbitkan konten Firebase.');return;}
      try{renderContent(snapshot.data().content);if(snapshot.metadata.fromCache)showStatus('Menampilkan salinan konten terakhir; menunggu koneksi server.');else status.hidden=true;}
      catch{showStatus('Konten online belum dapat ditampilkan. Versi awal tetap tersedia.');}
    },()=>showStatus('Konten online tidak dapat dimuat. Menampilkan versi awal/terakhir yang tersedia.'));
  }catch{showStatus('Koneksi konten online gagal. Versi awal tetap dapat dibaca.');}
}
