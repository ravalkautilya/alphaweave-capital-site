(() => {
 const header=document.querySelector('.aw-site-header');if(!header)return;
 const toggle=header.querySelector('[data-nav-toggle]'),links=header.querySelector('[data-nav-links]'),resources=header.querySelector('.resources');
 function close(){links.classList.remove('open');toggle.setAttribute('aria-expanded','false');resources.open=false;}
 toggle.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));if(!open)resources.open=false;});
 header.addEventListener('keydown',event=>{if(event.key==='Escape'){if(resources.open){resources.open=false;resources.querySelector('summary').focus();}else{close();toggle.focus();}}});
 document.addEventListener('click',event=>{if(!header.contains(event.target))resources.open=false;});
 matchMedia('(min-width:761px)').addEventListener('change',close);
})();
