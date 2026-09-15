(function(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setYears(){
    ['year','year-portfolio','year-projects','year-youtube'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.textContent = new Date().getFullYear();
    });
  }
  setYears();

  document.addEventListener('DOMContentLoaded', ()=>{
    // Nav toggle for small screens
    const navToggle = document.querySelector('.nav-toggle');
    if(navToggle){
      navToggle.addEventListener('click', ()=>{
        document.querySelector('.nav')?.classList.toggle('open');
        navToggle.classList.toggle('open');
      });
    }

    // Assign floating animation to cards (subtle)
    if(!prefersReduced){
      document.querySelectorAll('.card, .choice-card, .project-card, .project-card.youtube-card').forEach((el,i)=>{
        el.classList.add('float-slow');
        el.style.setProperty('--float-delay', (i*120)+'ms');
        el.style.animationDelay = (i*120)+'ms';
      });
    }

    // Parallax & tilt (desktop only)
    if(!isTouch && !prefersReduced){
      window.addEventListener('mousemove', (e)=>{
        const cx = window.innerWidth/2, cy = window.innerHeight/2;
        const dx = (e.clientX - cx)/cx; const dy = (e.clientY - cy)/cy;

        document.querySelectorAll('.parallax').forEach(el=>{
          const moveX = dx * 6; const moveY = dy * 6;
          el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });

        document.querySelectorAll('.choice-card, .card, .project-card').forEach(el=>{
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          const rY = x * 6; const rX = -y * 4;
          el.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg)`;
          el.style.transition = 'transform .12s linear';
        });
      });

      window.addEventListener('mouseleave', ()=>{
        document.querySelectorAll('.choice-card, .card, .project-card').forEach(el=>{
          el.style.transform = '';
          el.style.transition = 'transform .5s ease';
        });
        document.querySelectorAll('.parallax').forEach(el=>el.style.transform='');
      });
    }

    // Ripple (water-surface) on pointerdown
    document.addEventListener('pointerdown', (e)=>{
      if(prefersReduced) return;
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.12;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.background = `radial-gradient(circle at 30% 30%, rgba(255,160,80,0.18), rgba(255,106,0,0.06) 40%, transparent 60%)`;
      ripple.style.boxShadow = '0 0 40px rgba(255,106,0,0.06)';
      ripple.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1), opacity 700ms';
      document.body.appendChild(ripple);
      // Force layout then animate
      requestAnimationFrame(()=>{
        ripple.style.transform = 'translate(-50%,-50%) scale(4)';
        ripple.style.opacity = '0';
      });
      setTimeout(()=>{ ripple.remove(); }, 800);
    });

    // Smooth scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (ev)=>{
        const href = a.getAttribute('href');
        if(href && href.length > 1){
          ev.preventDefault();
          const target = document.querySelector(href);
          if(target) target.scrollIntoView({behavior:'smooth', block:'center'});
        }
      });
    });

    // Accessibility: add keyboard focus class on body when tabbing
    function handleFirstTab(e){ if(e.key === 'Tab'){ document.body.classList.add('show-focus'); window.removeEventListener('keydown', handleFirstTab); } }
    window.addEventListener('keydown', handleFirstTab);
  }); // DOMContentLoaded

  // Expose a small API to swap YouTube data programmatically
  window.NOTXMG = window.NOTXMG || {};
  window.NOTXMG.replaceYouTubeData = function(arr){ if(!Array.isArray(arr)) return; const evt = new CustomEvent('notxmg:videos', {detail: arr}); document.dispatchEvent(evt); };
})();
