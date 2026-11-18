'use strict';
const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const $ = (selector, root = document) => root.querySelector(selector);
const privacySignal = navigator.globalPrivacyControl || navigator.doNotTrack === '1';
function measure(action, item = '') {
  if (privacySignal || !window.gtag) return;
  window.gtag('event', action, { content_group:'side_hustle_field_guide', item_id:item });
}
// Preserve public page measurement without sending a buyer's notes or form fields.
if (location.hostname === 'aisidehustle.cc' && !privacySignal) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config','G-4N11DK5HTR');
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-4N11DK5HTR';
  document.head.append(tag);
}
all('[data-action]').forEach(link=>link.addEventListener('click',()=>measure(link.dataset.action,new URL(link.href).pathname.split('/').pop())));
all('[data-copy]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const box = button.closest('.prompt, .book-fold');
    const text = $('[data-prompt]',box);
    const status = $('.copy-status',box);
    try {
      await navigator.clipboard.writeText(text.textContent);
      status.textContent = 'Copied.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(text);
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Text selected. Use your device’s Copy command.';
    }
  });
});

function initBrief(form){
  const key = 'aisidehustle:opportunity-brief:v1';
  const fields = all('input,textarea',form);
  const status = $('#brief-status');
  try {
    const saved=JSON.parse(localStorage.getItem(key) || '{}');
    for(const field of fields) if(typeof saved?.[field.name]==='string') field.value=saved[field.name].slice(0,field.maxLength);
  } catch { status.textContent='Download to keep a copy on this device.'; }
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',()=>{
    try {
      localStorage.setItem(key,JSON.stringify(Object.fromEntries(new FormData(form))));
      status.textContent='Saved in this browser.';
    } catch {status.textContent='Browser saving is unavailable. Download to keep your work.';}
  });
  $('#export-brief').addEventListener('click',()=>{
    if (!fields.some(field=>field.value.trim())) {
      status.textContent='Add a buyer or sample idea to download your brief.';
      fields[0].focus();
      return;
    }
    const lines=fields.map(field=>field.closest('label').firstChild.textContent+'\n'+(field.value.trim()||'To explore'));
    const url=URL.createObjectURL(new Blob(['My product opportunity\n\n'+lines.join('\n\n')+'\n'],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');
    a.href=url; a.download='my-product-brief.txt';document.body.append(a);a.click();a.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),1500);
    status.textContent='Your download is ready.';measure('brief_download');
  });
}
if ($('#brief-form')) initBrief($('#brief-form'));

const sampleLinks=all('[data-sample]');
function chooseSample(id){
  const selected=sampleLinks.find(a=>a.dataset.sample===id) || sampleLinks[0];
  if(!selected)return;
  sampleLinks.forEach(a=>a.setAttribute('aria-current',String(a===selected)));
  all('[data-sample-panel]').forEach(panel=>{panel.hidden=panel.dataset.samplePanel!==selected.dataset.sample;});
}
function readSample(){chooseSample(new URL(location.href).searchParams.get('example'));}
sampleLinks.forEach(link=>link.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();history.pushState(null,'',link.href);chooseSample(link.dataset.sample);
}));
readSample();window.addEventListener('popstate',readSample);

function initPlayer(player){
  const links=all('[data-flow]',player);
  const panels=all('[data-flow-panel]',player);
  let current, stage=0, timer;
  function stop(){window.clearInterval(timer);timer=undefined;if(current)$('[data-play]',current).textContent='▶ Play handoffs';}
  function showFrame(index,animate=false){
    const frames=all('[data-frame]',current);
    stage=Math.min(Math.max(index,0),frames.length-1);
    all('[data-stage]',current).forEach((el,i)=>{if(i===stage)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    frames.forEach((frame,i)=>{frame.hidden=i!==stage;frame.classList.toggle('reveal',animate&&i===stage);});
    $('[data-position]',current).textContent='Handoff '+(stage+1)+' of '+frames.length;
  }
  function showPanel(id,index=0){
    stop();
    current=panels.find(panel=>panel.dataset.flowPanel===id)||panels[0];
    panels.forEach(panel=>{panel.hidden=panel!==current;});
    links.forEach(link=>{link.setAttribute('aria-current',String(link.dataset.flow===current.dataset.flowPanel));});
    showFrame(index);
  }
  for(const panel of panels){
    $('.flow-controls',panel).hidden=false;
    $('[data-play]',panel).addEventListener('click',()=>{
      if(timer){stop();return;}
      if(stage===all('[data-frame]',current).length-1)showFrame(0,true);
      $('[data-play]',panel).textContent='Ⅱ Pause';
      measure('workflow_play',panel.dataset.flowPanel);
      timer=window.setInterval(()=>{
        showFrame(stage+1,true);
        if(stage===all('[data-frame]',current).length-1)stop();
      },4800);
    });
    all('[data-stage]',panel).forEach(a=>a.addEventListener('click',event=>{
      event.preventDefault();stop();showFrame(Number(a.dataset.stage),true);
    }));
  }
  function readFlow(){
    const hash=location.hash.slice(1);
    const frame=all('[data-frame]',player).find(item=>item.id===hash);
    if(frame)showPanel(frame.closest('[data-flow-panel]').dataset.flowPanel,Number(frame.dataset.frame));
    else showPanel(links.find(link=>link.hash==='#'+hash)?.dataset.flow || panels[0].dataset.flowPanel);
  }
  links.forEach(a=>a.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();history.replaceState(null,'',a.hash);showPanel(a.dataset.flow);
  }));
  readFlow();window.addEventListener('hashchange',readFlow);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  player.addEventListener('focusin',event=>{if(!event.target.matches('[data-play]'))stop();});
}
if($('.player'))initPlayer($('.player'));
