document.addEventListener("DOMContentLoaded", () => {

    // Sticky Header
    const headerElement = document.getElementById('header');
    const spacer = document.createElement('div');
    function stickyHeader(){
        if(window.pageYOffset > 50){
            if(!document.body.contains(spacer)){
                spacer.style.height = `${headerElement.offsetHeight}px`;
                document.body.insertBefore(spacer, headerElement);
            }
            headerElement.classList.add('sticky');
        }
        else{
            if(document.body.contains(spacer)){
                document.body.removeChild(spacer);
            }
            headerElement.classList.remove('sticky');
        }
    };

    let lastScrollTop = 0;
    function headerOnScroll(){
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if(currentScroll > lastScrollTop && currentScroll > 50){
            headerElement.classList.add('hide-header');
        }
        else{
            headerElement.classList.remove('hide-header');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }

    window.addEventListener('scroll', () => {
        stickyHeader();
        headerOnScroll();
    });

    // Theme Switch
    function themeSwitch(){
        const toggle = document.getElementById('toggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        toggle.checked = savedTheme === 'dark';

        toggle.addEventListener('change', () => {
            if(toggle.checked){
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            else{
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Hero Image
    function heroImageAnimation(){
        const heroContainer = document.querySelector('.hero');
        const heroImage = document.querySelector('.hero-image');

        function disableOnMobile(){
         if(window.innerWidth < 768){
            heroImage.style.opacity = '0';
            heroImage.style.left = '';
            heroImage.style.top = '';
            return true;
         }
         return false;
        }
        if (disableOnMobile()){
            return;
        }

        heroContainer.addEventListener('mouseenter', () => {
            heroImage.style.opacity = '1';
        });

        heroContainer.addEventListener('mouseleave', () => {
            heroImage.style.opacity = '0';
        });

        heroContainer.addEventListener('mousemove', (e) => {
            heroImage.style.left = `${e.clientX}px`;
            heroImage.style.top = `${e.clientY}px`;
        });
    };
    
    // Typed.JS
    const typed = new Typed('#typed-element', {
        stringsElement: '#typed-strings',
        typeSpeed: 100,
        backSpeed: 50,
        startDelay: 500,
        backDelay: 1000,
        loop: true,
        loopCount: Infinity,
        smartBackspace: true,
        showCursor: true,
        cursorChar: '|',
    });

    // Custom Menu
    function customMenu(){
        const toggler = document.querySelector('.navbar-toggler-icon');
        const offcanvas = document.querySelector('.offcanvas');
        // console.log(toggler, offcanvas);

        offcanvas.addEventListener('shown.bs.offcanvas', () => {
            toggler.classList.add('show');
        });
        offcanvas.addEventListener('hidden.bs.offcanvas', () => {
            toggler.classList.remove('show');
        });
    }

    // Offcanvas Close
    function closeOffcanvasOnSelectingNavLink(){
        const navLinks = document.querySelectorAll('.navbar-nav li');
        const offCanvas = document.getElementById('offcanvasNavbarExample-expand-sm');
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offCanvas);
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 991) {
                    bsOffcanvas.hide(); // Closes the offcanvas
                }
            });
        });
    }

    // GSAP
    class Button {
        constructor(buttonElement){
            this.block = buttonElement;
            this.init();
            this.initEvents();
        }
        init(){
            const el = gsap.utils.selector(this.block);
            this.DOM = {
            button: this.block,
            flair: el(".button-effect")
            };
            this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
            this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");
        }
        getXY(e){
            const {
            left,
            top,
            width,
            height
            } = this.DOM.button.getBoundingClientRect();
            const xTransformer = gsap.utils.pipe(
            gsap.utils.mapRange(0, width, 0, 100),
            gsap.utils.clamp(0, 100)
            );
            const yTransformer = gsap.utils.pipe(
            gsap.utils.mapRange(0, height, 0, 100),
            gsap.utils.clamp(0, 100)
            );
            return {
            x: xTransformer(e.clientX - left),
            y: yTransformer(e.clientY - top)
            };
        }
        initEvents(){
            this.DOM.button.addEventListener("mouseenter", (e) => {
            const { x, y } = this.getXY(e);

            this.xSet(x);
            this.ySet(y);

            gsap.to(this.DOM.flair, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
            });

            this.DOM.button.addEventListener("mouseleave", (e) => {
            const { x, y } = this.getXY(e);

            gsap.killTweensOf(this.DOM.flair);

            gsap.to(this.DOM.flair, {
                xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
                yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
                scale: 0,
                duration: 0.3,
                ease: "power2.out"
            });
            });

            this.DOM.button.addEventListener("mousemove", (e) => {
            const { x, y } = this.getXY(e);

            gsap.to(this.DOM.flair, {
                xPercent: x,
                yPercent: y,
                duration: 0.4,
                ease: "power2"
            });
            });
        }
    }
    const buttonElement = document.querySelector('.button');
    if(buttonElement){
        new Button(buttonElement);
    }

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    function workImageAnimation(){
        
        let revealContainers = document.querySelectorAll(".reveal");
        
        revealContainers.forEach((container) => {
            let image = container.querySelector('.reveal-img');
            let tl = gsap.timeline({
                scrollTrigger: {
                trigger: container,
                toggleActions: "play none none none"
                }
            });

            tl.set(container, {
                autoAlpha: 1,
            });
            tl.from(container, 1.5, {
                xPercent: -100,
                ease: "power2.out",
            });
            tl.from(image, 1.5, {
                xPercent: 100,
                scale: 1.3,
                delay: -1.5,
                ease: "power2.out",
            });

            container.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
            container.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1.0,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
        });
    }

    function heroTextAnimation(){
        // Variable declarations
        let eyebrowHeadingContainer = document.querySelector(".eyebrow-heading");
        let eyebrowHeading = eyebrowHeadingContainer.querySelector("h2");
        let mainHeadingContainer = document.querySelector(".main-heading");
        let mainHeading = mainHeadingContainer.querySelector("h1");

        let tl = gsap.timeline({
            scrollTrigger:{
                trigger: mainHeadingContainer,
                toggleActions: "play none none none"
            }
        });
        tl.set([eyebrowHeading, mainHeading],{
            yPercent: 180,
            skewY: 24
        });
        tl.to(eyebrowHeading, {
            yPercent: 0,
            skewY: 0,
            ease: "power2.out",
            duration: 0.8,
        });
        tl.to(mainHeading, {
            yPercent: 0,
            skewY: 0,
            ease: "power2.out",
            duration: 1.2,
        }, "-=0.6");
    }

    function lineAnimation(){
        let lines = document.querySelectorAll(".header-block .line");
        lines.forEach(line => {
            let tl = gsap.timeline({
                scrollTrigger:{
                    trigger: line.closest('.header-block'),
                    toggleActions: "play none none none",
                }
            });
            tl.from(line, {
                width: 0,
                duration: 1.6,
                ease: "power2.out",
            });
        });
    }

    AOS.init({
        once: true,
        duration: 800,
    });
    themeSwitch();
    customMenu();
    closeOffcanvasOnSelectingNavLink();
    heroTextAnimation();
    heroImageAnimation();
    lineAnimation();
    workImageAnimation();
});