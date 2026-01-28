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
})();