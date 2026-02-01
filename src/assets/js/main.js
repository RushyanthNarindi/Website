(function(){
	// Mobile nav toggle
	const navToggle = document.getElementById('nav-toggle');
	const nav = document.getElementById('site-nav');
	navToggle && navToggle.addEventListener('click', ()=> nav.classList.toggle('open'));

	// Scroll reveal using IntersectionObserver
	const reveals = document.querySelectorAll('.reveal');
	const io = new IntersectionObserver((entries)=>{
		entries.forEach(e=>{
			if(e.isIntersecting){
				e.target.classList.add('in-view');
				io.unobserve(e.target);
			}
		});
	}, {threshold:0.12});
	reveals.forEach(r=>io.observe(r));

	// Gentle parallax for hero background (mousemove)
	const heroBg = document.getElementById('hero-bg');
	if(heroBg){
		let last = {x:0,y:0};
		window.addEventListener('mousemove', (ev)=>{
			const w = window.innerWidth, h = window.innerHeight;
			const x = (ev.clientX / w - 0.5) * 18;
			const y = (ev.clientY / h - 0.5) * 12;
			if(Math.abs(x-last.x) > 0.1 || Math.abs(y-last.y) > 0.1){
				heroBg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
				last = {x,y};
			}
		}, {passive:true});
	}


	// Theme toggle for static pages: share logic centrally so every static page works
	(function(){
		function setIcon(btn, theme){
			if(!btn) return
			btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
			btn.title = theme === 'dark' ? 'Light mode' : 'Dark mode'
			btn.innerHTML = theme === 'dark'
				? '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.79 1.8-1.78zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.03 1.04l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17 11v2h3v-2h-3zM12 6a6 6 0 100 12 6 6 0 000-12zm-1 13.99h2v-3h-2v3zM4.24 19.16l1.8 1.79 1.79-1.79-1.79-1.79-1.8 1.79zM19.07 19.16l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79z"/></svg>'
				: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M21.64 13a9 9 0 11-9.63-9.63 7 7 0 009.63 9.63z"/></svg>'
		}

		function applyTheme(t){
			try{ document.documentElement.setAttribute('data-theme', t) }catch(e){}
			setIcon(document.getElementById('theme-toggle'), t)
		}

		function broadcastThemeChange(t){
			// Dispatch storage event for React app to listen on (cross-tab communication)
			try{
				window.dispatchEvent(new StorageEvent('storage', {
					key: 'theme',
					newValue: t,
					oldValue: null,
					storageArea: localStorage
				}))
			}catch(e){}
		}

		var saved = null
		try{ saved = localStorage.getItem('theme') }catch(e){}
		var theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
		applyTheme(theme)

		// if header lacks a toggle button, inject one (static pages)
		var existing = document.getElementById('theme-toggle')
		if(!existing){
			var headerRow = document.querySelector('.container.header-row') || document.querySelector('.header-row')
			if(headerRow){
				var btn = document.createElement('button')
				btn.id = 'theme-toggle'
				btn.className = 'theme-toggle'
				btn.setAttribute('aria-label','Toggle theme')
				btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M21.64 13a9 9 0 11-9.63-9.63 7 7 0 009.63 9.63z"></path></svg>'
				headerRow.appendChild(btn)
				existing = btn
			}
		}

		if(existing){
			existing.addEventListener('click', function(){
				theme = theme === 'dark' ? 'light' : 'dark'
				try{ localStorage.setItem('theme', theme) }catch(e){}
				applyTheme(theme)
				broadcastThemeChange(theme)
			})
		}
	})()
})();