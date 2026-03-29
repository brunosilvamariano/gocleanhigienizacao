// Inicializar AOS (Animações de Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// Navbar scroll effect
const navbar = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active nav link
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scroll para links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        }
    });
});

// Efeito Parallax no CTA
const ctaBackground = document.querySelector('.cta-background');
if (ctaBackground) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const ctaSection = document.querySelector('.cta-section');
        const ctaSectionTop = ctaSection.offsetTop;
        const ctaSectionHeight = ctaSection.offsetHeight;
        
        if (scrollPosition >= ctaSectionTop - window.innerHeight && scrollPosition <= ctaSectionTop + ctaSectionHeight) {
            const relativeScroll = scrollPosition - ctaSectionTop;
            ctaBackground.style.backgroundPosition = `center ${relativeScroll * 0.4}px`;
        }
    });
}

// Contador animado profissional (Universal)
function animateCounter(element, target, prefix = '', suffix = '', duration = 2000) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentCount = Math.floor(progress * target);
        
        // Formatação brasileira (ex: 2.000)
        element.textContent = prefix + currentCount.toLocaleString('pt-BR') + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
        }
    };
    window.requestAnimationFrame(step);
}

// Observer Universal para qualquer elemento com data-target
const universalStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Procura por elementos que tenham data-target dentro da seção visível
        const counters = entry.target.querySelectorAll('[data-target]');

        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;

            const target = parseInt(counter.getAttribute('data-target'), 10);
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';

            if (!isNaN(target)) {
                counter.classList.add('animated');
                counter.textContent = prefix + '0' + suffix;
                setTimeout(() => {
                    animateCounter(counter, target, prefix, suffix);
                }, 200);
            }
        });

        // Para de observar esta seção específica após iniciar as animações
        universalStatsObserver.unobserve(entry.target);
    });
}, { threshold: 0.1 }); // Threshold menor para garantir que inicie assim que aparecer

// Inicializar observadores quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Observar todas as seções que contêm contadores
    const sectionsWithStats = document.querySelectorAll('.about-stats, .achievements-section, .modern-stats-grid, .stat');
    sectionsWithStats.forEach(section => {
        universalStatsObserver.observe(section);
    });

    // Infallible Before/After Slider
    const containers = document.querySelectorAll('.ba-container');
    containers.forEach(container => {
        const slider = container.querySelector('.ba-slider');
        const afterImg = container.querySelector('.ba-after');
        let isDragging = false;

        function updatePosition(x) {
            const rect = container.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            if (position < 0) position = 0;
            if (position > 100) position = 100;
            slider.style.left = position + '%';
            afterImg.style.clipPath = `inset(0 0 0 ${position}%)`;
        }

        container.addEventListener('mousedown', (e) => { isDragging = true; updatePosition(e.clientX); });
        window.addEventListener('mousemove', (e) => { if (isDragging) updatePosition(e.clientX); });
        window.addEventListener('mouseup', () => { isDragging = false; });
        container.addEventListener('touchstart', (e) => { isDragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('touchmove', (e) => { if (isDragging) updatePosition(e.touches[0].clientX); }, { passive: false });
        window.addEventListener('touchend', () => { isDragging = false; });
        container.addEventListener('dragstart', (e) => e.preventDefault());
    });
});

// Tracking de cliques WhatsApp
document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
    button.addEventListener('click', function() {
        console.log('WhatsApp clicked:', this.textContent.trim());
    });
});

console.log('✨ Website carregado com sucesso!');