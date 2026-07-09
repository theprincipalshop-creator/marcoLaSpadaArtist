/**
 * Marco Artist Website - Core JavaScript Logic
 * Implements interactive navigation, portfolio filtering, custom video controls,
 * image lightbox, Leaflet map configuration, and multi-step quote popup with email routing.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 0. SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-element');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // Skeleton loader: rimuove pulse quando l'immagine è pronta
    document.querySelectorAll('.portfolio-img').forEach(img => {
        const container = img.closest('.portfolio-img-container');
        const markLoaded = () => {
            if (container) container.style.animation = 'none';
            img.classList.add('loaded');
        };
        if (img.complete && img.naturalWidth > 0) {
            markLoaded();
        } else {
            img.addEventListener('load', markLoaded, { once: true });
        }
    });


    
    // ==========================================================================
    // 1. SCROLL SPY & SCROLLED HEADER
    // ==========================================================================
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                // Header class on scroll
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Active link spy
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= (sectionTop - 150)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').slice(1) === current) {
                        link.classList.add('active');
                    }
                });
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // ==========================================================================
    // 2. HAMBURGER MENU (MOBILE NAVIGATION)
    // ==========================================================================
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outer space
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });


    // ==========================================================================
    // 3. CATEGORY MODAL & ARTWORK GALLERY
    // ==========================================================================
    
    const categoryData = {
        'persone': {
            title: 'Quadri b/n ritratti persone',
            artworks: [
                { title: 'Ritratto 1', desc: 'Ritratto iperrealistico a carboncino su tela.', images: ['fotoOpere/persone/copertinaPersone.webp'] },
                { title: 'Ritratto 2', desc: 'Studio dei tratti somatici e dell\'espressione.', images: ['fotoOpere/persone/5922770123666165243.webp'] },
                { title: 'Ritratto 3', desc: 'Ritratto su commissione.', images: ['fotoOpere/persone/5922770123666165244.webp'] },
                { title: 'Ritratto 4', desc: 'Dettagli in chiaroscuro.', images: ['fotoOpere/persone/5922770123666165245.webp'] },
                { title: 'Ritratto 5', desc: 'Rappresentazione realistica.', images: ['fotoOpere/persone/5922770123666165246.webp'] }
            ]
        },
        'animali': {
            title: 'Quadri b/n ritratti animali',
            artworks: [
                { title: 'Animale 1', desc: 'Ritratto realistico a carboncino e olio su tela.', images: ['fotoOpere/animali/copertinaAnimali.webp'] },
                { title: 'Animale 2', desc: 'Espressione e dettagli del manto rifiniti a mano.', images: ['fotoOpere/animali/5922770123666165248.webp'] },
                { title: 'Animale 3', desc: 'Studio accurato sulle ombre e sulle luci.', images: ['fotoOpere/animali/5922770123666165249.webp'] },
                { title: 'Animale 4', desc: 'Dettagli anatomici.', images: ['fotoOpere/animali/5922770123666165250.webp'] },
                { title: 'Animale 5', desc: 'Ritratto su tela.', images: ['fotoOpere/animali/5922770123666165251.webp'] }
            ]
        },
        'quadriColori': {
            title: 'Quadri a colori',
            artworks: [
                { title: 'Opera a colori 1', desc: 'Quadro acrilico su tela, spatolato a spessore.', images: ['fotoOpere/quadriColori/copertinaColori.webp'] },
                { title: 'Opera a colori 2', desc: 'Studio dinamico sul contrasto dei colori.', images: ['fotoOpere/quadriColori/5922770123666165290.webp'] },
                { title: 'Opera a colori 3', desc: 'Un gioco di sovrapposizioni e trasparenze.', images: ['fotoOpere/quadriColori/5922770123666165291.webp'] },
                { title: 'Opera a colori 4', desc: 'Composizione cromatica vibrante.', images: ['fotoOpere/quadriColori/5922770123666165292.webp'] }
            ]
        },
        'pareti': {
            title: 'Pareti interno/esterno',
            artworks: [
                { title: 'Parete decorata 1', desc: 'Murales realizzato con vernici spray e finiture acriliche.', images: ['fotoOpere/pareti/copertinaPareti.webp'] },
                { title: 'Parete decorata 2', desc: 'Parete interna decorativa per locale commerciale.', images: ['fotoOpere/pareti/5922770123666165295.webp'] },
                { title: 'Parete decorata 3', desc: 'Studio delle proporzioni in grande formato.', images: ['fotoOpere/pareti/5922770123666165296.webp'] },
                { title: 'Parete decorata 4', desc: 'Decorazione artistica per interni.', images: ['fotoOpere/pareti/5922770123666165297.webp'] },
                { title: 'Parete decorata 5', desc: 'Murales su commissione.', images: ['fotoOpere/pareti/5922770123666165298.webp'] },
                { title: 'Parete decorata 6', desc: 'Dettagli della decorazione parietale.', images: ['fotoOpere/pareti/5922770123666165299.webp'] }
            ]
        },
        'tecnicaMista': {
            title: 'Tecnica mista',
            artworks: [
                { title: 'Tecnica Mista 1', desc: 'Composizione materica su tela.', images: ['fotoOpere/tecnicaMista/copertinaTecMista.webp'] },
                { title: 'Tecnica Mista 2', desc: 'Utilizzo di materiali diversi e resine.', images: ['fotoOpere/tecnicaMista/5922770123666165304.webp'] },
                { title: 'Tecnica Mista 3', desc: 'Sperimentazione con acrilico e texture.', images: ['fotoOpere/tecnicaMista/5922770123666165305.webp'] },
                { title: 'Tecnica Mista 4', desc: 'Combinazione di pittura e inserti scultorei.', images: ['fotoOpere/tecnicaMista/5922770123666165306.webp'] },
                { title: 'Tecnica Mista 5', desc: 'Ricerca artistica su nuove forme visive.', images: ['fotoOpere/tecnicaMista/5922770123666165307.webp'] }
            ]
        },
        'manufattiLegno': {
            title: 'Piccoli manufatti in legno',
            artworks: [
                { title: 'Manufatto in legno 1', desc: 'Piccolo manufatto in legno intagliato a mano.', images: ['fotoOpere/manufattiLegno/copertinaManufatti.webp'] },
                { title: 'Manufatto in legno 2', desc: 'Lavorazione artigianale con essenze protettive.', images: ['fotoOpere/manufattiLegno/5922770123666165399.webp'] },
                { title: 'Manufatto in legno 3', desc: 'Dettagli di incisione e modellazione del legno.', images: ['fotoOpere/manufattiLegno/5922770123666165401.webp'] },
                { title: 'Manufatto in legno 4', desc: 'Creazione in legno personalizzata.', images: ['fotoOpere/manufattiLegno/5922770123666165402.webp'] },
                { title: 'Manufatto in legno 5', desc: 'Oggetto scultoreo in legno.', images: ['fotoOpere/manufattiLegno/5922770123666165415.webp'] }
            ]
        },
        'gadget': {
            title: 'Gadget e portachiavi',
            artworks: [
                { title: 'Gadget 1', desc: 'Gadget e portachiavi realizzati a mano.', images: ['fotoOpere/gadget/copertinaGadget.webp'] },
                { title: 'Gadget 2', desc: 'Pezzi unici con inclusioni e resina.', images: ['fotoOpere/gadget/5922770123666165407.webp'] },
                { title: 'Gadget 3', desc: 'Accessori in legno inciso.', images: ['fotoOpere/gadget/5922770123666165409.webp'] },
                { title: 'Gadget 4', desc: 'Portachiavi con dettagli dipinti.', images: ['fotoOpere/gadget/5922770123666165410.webp'] }
            ]
        },
        'arredo': {
            title: 'Arredo e design',
            artworks: [
                { title: 'Arredo 1', desc: 'Complemento d\'arredo dal design unico.', images: ['fotoOpere/arredo/copertinaArredo.webp'] },
                { title: 'Arredo 2', desc: 'Elemento decorativo artigianale.', images: ['fotoOpere/arredo/5922770123666165400.webp'] },
                { title: 'Arredo 3', desc: 'Lavorazione curata nei dettagli per l\'arredamento.', images: ['fotoOpere/arredo/5922770123666165411.webp'] },
                { title: 'Arredo 4', desc: 'Oggetto di design per interni.', images: ['fotoOpere/arredo/5922770123666165412.webp'] },
                { title: 'Arredo 5', desc: 'Design esclusivo su commissione.', images: ['fotoOpere/arredo/5922770123666165413.webp'] }
            ]
        }
    };

    const categoryBoxes = document.querySelectorAll('.category-box');
    const categoryModal = document.getElementById('category-modal');
    const closeCategoryModalBtn = document.getElementById('close-category-modal');
    const modalCategoryTitle = document.getElementById('modal-category-title');
    const artworkTitle = document.getElementById('artwork-title');
    const artworkDesc = document.getElementById('artwork-desc');
    const artworkCounter = document.getElementById('artwork-counter');
    const prevArtworkBtn = document.getElementById('prev-artwork');
    const nextArtworkBtn = document.getElementById('next-artwork');
    const carouselImages = document.getElementById('carousel-images');
    const carouselProgressFill = document.getElementById('carousel-progress-fill');
    const categoryQuoteBtn = document.getElementById('category-quote-btn');

    let currentCategoryData = null;
    let currentArtworkIndex = 0;
    
    // Slider state
    let currentPhotoIndex = 0;
    let photoProgressTimeout = null;
    let isCarouselPaused = false;
    const carouselPlayPauseBtn = document.getElementById('carousel-play-pause');
    const PHOTO_DURATION = 3000; // 3 seconds per photo

    if(categoryBoxes.length > 0) {
        categoryBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const catId = box.getAttribute('data-cat');
                if(categoryData[catId]) {
                    currentCategoryData = categoryData[catId];
                    currentArtworkIndex = 0;
                    openCategoryModal();
                }
            });
        });
    }

    function openCategoryModal() {
        modalCategoryTitle.textContent = currentCategoryData.title;
        renderArtwork();
        categoryModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCategoryModal() {
        if(categoryModal) categoryModal.classList.remove('open');
        document.body.style.overflow = '';
        clearTimeout(photoProgressTimeout);
    }

    if(closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
    if(categoryModal) categoryModal.addEventListener('click', (e) => {
        if (e.target === categoryModal) {
            closeCategoryModal();
        }
    });

    function renderArtwork() {
        if(!currentCategoryData || !currentCategoryData.artworks || currentCategoryData.artworks.length === 0) return;
        
        const artwork = currentCategoryData.artworks[currentArtworkIndex];
        
        artworkTitle.textContent = artwork.title;
        artworkDesc.textContent = artwork.desc;
        artworkCounter.textContent = `Opera ${currentArtworkIndex + 1} di ${currentCategoryData.artworks.length}`;

        // Reset pause state when changing artwork
        isCarouselPaused = false;
        if(carouselPlayPauseBtn) {
            const icon = carouselPlayPauseBtn.querySelector('i');
            if(icon) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            }
            // Nascondi il pulsante pausa se c'è solo un'immagine
            carouselPlayPauseBtn.style.display = currentCategoryData.artworks[currentArtworkIndex].images.length > 1 ? 'flex' : 'none';
        }

        // Restart photo slider for this artwork
        startPhotoSlider(artwork.images);
    }

    if(prevArtworkBtn) {
        prevArtworkBtn.addEventListener('click', () => {
            currentArtworkIndex = (currentArtworkIndex - 1 + currentCategoryData.artworks.length) % currentCategoryData.artworks.length;
            renderArtwork();
        });
    }

    if(nextArtworkBtn) {
        nextArtworkBtn.addEventListener('click', () => {
            currentArtworkIndex = (currentArtworkIndex + 1) % currentCategoryData.artworks.length;
            renderArtwork();
        });
    }

    // Helper: converte path WebP in fallback JPG
    function toJpgFallback(webpSrc) {
        return webpSrc.replace(/\.webp$/i, '.jpg');
    }

    function startPhotoSlider(imagesArr) {
        clearTimeout(photoProgressTimeout);
        currentPhotoIndex = 0;
        
        // Crea elementi <picture> con sorgente WebP e fallback JPG
        carouselImages.innerHTML = '';
        imagesArr.forEach((src, idx) => {
            const picture = document.createElement('picture');
            picture.style.position = 'absolute';
            picture.style.top = '0';
            picture.style.left = '0';
            picture.style.width = '100%';
            picture.style.height = '100%';
            picture.style.opacity = idx === currentPhotoIndex ? '1' : '0';
            picture.style.transition = 'opacity 0.5s ease';
            if (idx === currentPhotoIndex) picture.classList.add('active');

            const source = document.createElement('source');
            source.srcset = src;
            source.type = 'image/webp';

            const img = document.createElement('img');
            img.src = toJpgFallback(src);
            img.alt = '';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.loading = idx === 0 ? 'eager' : 'lazy';

            picture.appendChild(source);
            picture.appendChild(img);
            carouselImages.appendChild(picture);
        });

        if(imagesArr.length > 1) {
            runProgressBar(imagesArr);
        } else {
            carouselProgressFill.style.transition = 'none';
            carouselProgressFill.style.width = '100%';
        }
    }

    function runProgressBar(imagesArr) {
        if(isCarouselPaused) return;

        carouselProgressFill.style.transition = 'none';
        carouselProgressFill.style.width = '0%';
        
        // Force reflow
        void carouselProgressFill.offsetWidth;
        
        carouselProgressFill.style.transition = `width ${PHOTO_DURATION}ms linear`;
        carouselProgressFill.style.width = '100%';
        
        photoProgressTimeout = setTimeout(() => {
            currentPhotoIndex = (currentPhotoIndex + 1) % imagesArr.length;
            
            // Update active picture element (opacity-based transition)
            const pictures = carouselImages.querySelectorAll('picture');
            pictures.forEach((pic, idx) => {
                pic.style.opacity = idx === currentPhotoIndex ? '1' : '0';
                if (idx === currentPhotoIndex) {
                    pic.classList.add('active');
                } else {
                    pic.classList.remove('active');
                }
            });
            
            runProgressBar(imagesArr);
        }, PHOTO_DURATION);
    }

    if(carouselPlayPauseBtn) {
        carouselPlayPauseBtn.addEventListener('click', () => {
            if(!currentCategoryData) return;
            const artwork = currentCategoryData.artworks[currentArtworkIndex];
            if(artwork.images.length <= 1) return;

            isCarouselPaused = !isCarouselPaused;
            const icon = carouselPlayPauseBtn.querySelector('i');
            
            if (isCarouselPaused) {
                // Pause the slider
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                clearTimeout(photoProgressTimeout);
                
                // Freeze progress bar width
                const currentWidth = window.getComputedStyle(carouselProgressFill).width;
                carouselProgressFill.style.transition = 'none';
                carouselProgressFill.style.width = currentWidth;
            } else {
                // Resume the slider
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                runProgressBar(artwork.images);
            }
        });
    }

    // Modal quote button
    if(categoryQuoteBtn) {
        categoryQuoteBtn.addEventListener('click', () => {
            closeCategoryModal();
            const artwork = currentCategoryData.artworks[currentArtworkIndex];
            openQuotePopup(artwork.title);
        });
    }


    // ==========================================================================
    // 4b. IMAGE LIGHTBOX FULLSCREEN
    // ==========================================================================
    const imgLightbox        = document.getElementById('img-lightbox');
    const imgLightboxImg     = document.getElementById('img-lightbox-img');
    const imgLightboxClose   = document.getElementById('img-lightbox-close');
    const imgLightboxPrev    = document.getElementById('img-lightbox-prev');
    const imgLightboxNext    = document.getElementById('img-lightbox-next');
    let lightboxImages = [];
    let lightboxIndex  = 0;

    function openImgLightbox(images, startIndex) {
        lightboxImages = images;
        lightboxIndex  = startIndex;
        updateLightboxImage();
        imgLightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeImgLightbox() {
        imgLightbox.classList.remove('open');
        // Restore scroll only if category modal is also closed
        if (!categoryModal || !categoryModal.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    }

    function updateLightboxImage() {
        if (!lightboxImages.length) return;
        const src = lightboxImages[lightboxIndex];
        imgLightboxImg.style.opacity = '0';
        imgLightboxImg.style.transform = 'scale(0.96)';
        // Use WebP src directly (browser falls back automatically)
        imgLightboxImg.src = src;
        imgLightboxImg.onload = () => {
            imgLightboxImg.style.opacity = '1';
            imgLightboxImg.style.transform = 'scale(1)';
        };
        // Show/hide nav arrows
        imgLightboxPrev.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
        imgLightboxNext.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
    }

    // Click on the carousel area → open lightbox at current photo
    if (carouselImages) {
        carouselImages.addEventListener('click', () => {
            if (!currentCategoryData) return;
            const artwork = currentCategoryData.artworks[currentArtworkIndex];
            openImgLightbox(artwork.images, currentPhotoIndex);
        });
    }

    // Nav buttons inside lightbox
    if (imgLightboxPrev) {
        imgLightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
            updateLightboxImage();
        });
    }
    if (imgLightboxNext) {
        imgLightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
            updateLightboxImage();
        });
    }

    // Close on backdrop click (outside image)
    if (imgLightbox) {
        imgLightbox.addEventListener('click', (e) => {
            if (e.target === imgLightbox || e.target.classList.contains('img-lightbox-img-wrap')) {
                closeImgLightbox();
            }
        });
    }
    if (imgLightboxClose) imgLightboxClose.addEventListener('click', closeImgLightbox);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imgLightbox && imgLightbox.classList.contains('open')) {
            closeImgLightbox();
        }
    });



    // ==========================================================================
    // 5. CUSTOM VIDEO CAROUSEL (WORK IN PROGRESS)
    // ==========================================================================
    const slides = document.querySelectorAll('.carousel-slide');

    const prevBtn = document.getElementById('wip-prev');
    const nextBtn = document.getElementById('wip-next');
    const dotsContainer = document.getElementById('wip-dots');
    const muteToggleBtn = document.getElementById('wip-mute-toggle');
    const wipCurrentTag = document.getElementById('wip-current-tag');
    const wipCurrentTitle = document.getElementById('wip-current-title');
    const wipCurrentDesc = document.getElementById('wip-current-desc');
    const wipProgressBar = document.getElementById('wip-progress-bar');
    const wipProgressContainer = document.getElementById('wip-progress-container');

    if (slides.length > 0) {
        let currentIndex = 0;
        let isMuted = true;

        // Creazione dots
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            if(dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        const wipStatTecnica = document.getElementById('wip-stat-tecnica');
        const wipStatSupporto = document.getElementById('wip-stat-supporto');

        const updateDetails = (slide) => {
            if(wipCurrentTag) wipCurrentTag.textContent = slide.getAttribute('data-tag');
            if(wipCurrentTitle) wipCurrentTitle.textContent = slide.getAttribute('data-title');
            if(wipCurrentDesc) wipCurrentDesc.textContent = slide.getAttribute('data-desc');
            if(wipStatTecnica) wipStatTecnica.textContent = slide.getAttribute('data-tecnica') || 'Mista';
            if(wipStatSupporto) wipStatSupporto.textContent = slide.getAttribute('data-supporto') || 'Varie';
        };

        const playVideo = (video) => {
            video.muted = isMuted; // Mantieni lo stato di muto coerente
            video.currentTime = 0;
            video.play().catch(e => console.log('Autoplay prevented by browser', e));
        };

        const goToSlide = (index) => {
            // Ferma e nascondi la slide corrente
            const currentSlide = slides[currentIndex];
            currentSlide.classList.remove('active');
            const currentVideo = currentSlide.querySelector('video');
            if (currentVideo) currentVideo.pause();
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

            // Aggiorna l'indice
            currentIndex = index;

            // Mostra e avvia la nuova slide
            const newSlide = slides[currentIndex];
            newSlide.classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
            updateDetails(newSlide);
            
            const newVideo = newSlide.querySelector('video');
            if (newVideo) {
                playVideo(newVideo);
            }
        };

        const nextSlide = () => {
            goToSlide((currentIndex + 1) % slides.length);
        };

        const prevSlide = () => {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Eventi per ogni video (transizione a fine video)
        slides.forEach((slide) => {
            const video = slide.querySelector('video');
            if (video) {
                video.addEventListener('ended', nextSlide);
            }
        });

        // Aggiornamento fluido della progress bar tramite requestAnimationFrame
        const updateProgressBar = () => {
            const currentSlide = slides[currentIndex];
            if (currentSlide) {
                const video = currentSlide.querySelector('video');
                if (video && wipProgressBar && video.duration) {
                    const percentage = (video.currentTime / video.duration) * 100;
                    wipProgressBar.style.width = `${percentage}%`;
                }
            }
            requestAnimationFrame(updateProgressBar);
        };
        requestAnimationFrame(updateProgressBar);

        // Seek sulla barra di progresso (permette di cliccare la barra per avanzare nel video)
        if (wipProgressContainer) {
            wipProgressContainer.addEventListener('click', (e) => {
                const currentSlide = slides[currentIndex];
                const video = currentSlide.querySelector('video');
                if(video) {
                    const rect = wipProgressContainer.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    video.currentTime = pos * video.duration;
                }
            });
        }

        // Toggle globale del muto
        if (muteToggleBtn) {
            muteToggleBtn.addEventListener('click', () => {
                isMuted = !isMuted;
                muteToggleBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
                slides.forEach(slide => {
                    const v = slide.querySelector('video');
                    if (v) v.muted = isMuted;
                });
            });
        }

        // Inizializza la prima slide
        updateDetails(slides[0]);
        const firstVideo = slides[0].querySelector('video');
        if (firstVideo) playVideo(firstVideo);
    }


    // ==========================================================================
    // 6. MULTI-STEP QUOTE POPUP (MODAL FORM)
    // ==========================================================================
    const quoteModal = document.getElementById('quote-modal');
    const closeQuoteBtn = document.getElementById('close-quote-modal');
    const quoteForm = document.getElementById('quote-form');
    const steps = document.querySelectorAll('.form-step');
    const stepDots = document.querySelectorAll('.step-dot');
    const stepLines = document.querySelectorAll('.step-line');
    const nextButtons = document.querySelectorAll('.btn-next-step');
    const prevButtons = document.querySelectorAll('.btn-prev-step');
    const successScreen = document.getElementById('success-screen');
    const closeSuccessBtn = document.getElementById('btn-success-close');
    const summaryBox = document.getElementById('form-summary');

    let currentStep = 1;

    // Apre il popup del preventivo
    const openQuotePopup = (preselectedItem = '') => {
        quoteModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Reset form e step al primo avvio
        resetQuoteForm();

        if (preselectedItem) {
            document.getElementById('source_item').value = preselectedItem;
            // Pre-seleziona la categoria corrispondente
            const categorySelect = document.getElementById('category');
            
            const lowerItem = preselectedItem.toLowerCase();
            if (lowerItem.includes('animale')) {
                categorySelect.value = 'ritratto-bn-animali';
            } else if (lowerItem.includes('ritratto') || lowerItem.includes('persona')) {
                categorySelect.value = 'ritratto-bn-persone';
            } else if (lowerItem.includes('color')) {
                categorySelect.value = 'quadro-colori';
            } else if (lowerItem.includes('murales') || lowerItem.includes('parete')) {
                categorySelect.value = 'murales-pareti';
            } else if (lowerItem.includes('tecnica mista') || lowerItem.includes('digital')) {
                categorySelect.value = 'tecnica-mista';
            } else if (lowerItem.includes('legno') || lowerItem.includes('manufatto')) {
                categorySelect.value = 'legno';
            } else if (lowerItem.includes('gadget') || lowerItem.includes('portachiavi')) {
                categorySelect.value = 'gadget';
            } else if (lowerItem.includes('arredo') || lowerItem.includes('design')) {
                categorySelect.value = 'arredo-design';
            }
        }
    };

    // Associa trigger preventivo a tutti i pulsanti dedicati
    document.querySelectorAll('.btn-quote-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            openQuotePopup();
        });
    });

    // Floating CTA mobile → apre il preventivo
    const floatingCtaBtn = document.getElementById('floating-cta-btn');
    if (floatingCtaBtn) {
        floatingCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuotePopup();
        });
    }

    // Pulsanti "Ordina Simile" dalle card del portfolio
    document.querySelectorAll('.btn-request-similar').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.getAttribute('data-item');
            openQuotePopup(itemName);
        });
    });

    const closeQuotePopup = () => {
        quoteModal.classList.remove('open');
        document.body.style.overflow = '';
    };

    closeQuoteBtn.addEventListener('click', closeQuotePopup);
    quoteModal.addEventListener('click', (e) => {
        if (e.target === quoteModal) {
            closeQuotePopup();
        }
    });

    // Navigazione Step - Successivo
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateStepUI();
                if (currentStep === 3) {
                    generateSummary();
                }
            }
        });
    });

    // Navigazione Step - Precedente
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateStepUI();
        });
    });

    // Valida i campi del form per lo step corrente prima di avanzare
    const validateStep = (step) => {
        const stepContainer = document.getElementById(`step-${step}`);
        const inputs = stepContainer.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    };

    // Validazione live e singola
    const validateInput = (input) => {
        let isInputValid = true;
        if (!input.value.trim()) {
            isInputValid = false;
            input.style.borderColor = '#ff4d4d'; // Segnala errore in rosso
        } else if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                isInputValid = false;
                input.style.borderColor = '#ff4d4d';
            } else {
                input.style.borderColor = '#4dff4d'; // Verde se OK
            }
        } else {
            input.style.borderColor = '#4dff4d'; // Verde se OK
        }
        
        if(!isInputValid) {
            input.addEventListener('input', function liveValidate() {
                validateInput(input);
            }, { once: true });
        }
        
        return isInputValid;
    };
    
    // Assegna validazione live a tutti gli input richiesti
    document.querySelectorAll('#quote-form input[required], #quote-form select[required], #quote-form textarea[required]').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim().length > 0) {
                validateInput(input);
            }
        });
        input.addEventListener('input', () => {
            if (input.style.borderColor === 'rgb(255, 77, 77)' || input.style.borderColor === '#ff4d4d') {
                validateInput(input); // Ri-valida se era in errore
            }
        });
    });

    // Aggiorna l'interfaccia degli step (form e pallini indicatori)
    const updateStepUI = () => {
        steps.forEach((step, idx) => {
            if (idx + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        stepDots.forEach((dot, idx) => {
            const stepNum = idx + 1;
            dot.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                dot.classList.add('active');
            } else if (stepNum < currentStep) {
                dot.classList.add('completed');
                dot.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else {
                dot.textContent = stepNum;
            }
        });

        stepLines.forEach((line, idx) => {
            const lineNum = idx + 1;
            if (lineNum < currentStep) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });
    };

    // Genera il riepilogo finale nello Step 3
    const generateSummary = () => {
        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('email').value;
        const phoneVal = document.getElementById('phone').value || 'Non fornito';
        const categorySelect = document.getElementById('category');
        const categoryVal = categorySelect.options[categorySelect.selectedIndex].text;
        const dimsVal = document.getElementById('dimensions').value;
        const sourceItem = document.getElementById('source_item').value;
        
        let sourceItemHTML = '';
        if (sourceItem) {
            sourceItemHTML = `
                <div class="summary-item">
                    <span class="summary-label">Ispirato a:</span>
                    <span class="summary-val">${sourceItem}</span>
                </div>
            `;
        }

        summaryBox.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Nome:</span>
                <span class="summary-val">${nameVal}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Email:</span>
                <span class="summary-val">${emailVal}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Telefono:</span>
                <span class="summary-val">${phoneVal}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Opera:</span>
                <span class="summary-val">${categoryVal}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Dimensioni:</span>
                <span class="summary-val">${dimsVal}</span>
            </div>
            ${sourceItemHTML}
        `;
    };

    // Gestione invio form tramite AJAX (FormSubmit)
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso...';

        const formData = new FormData(quoteForm);

        // Invio reale tramite Fetch API
        fetch(quoteForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showSuccessScreen();
            } else {
                return response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert("Errore nell'invio: " + data.errors.map(error => error.message).join(", "));
                    } else {
                        alert("Oops! Si è verificato un problema durante l'invio del modulo. Riprova più tardi.");
                    }
                });
            }
        })
        .catch(error => {
            alert("Errore di connessione. Verifica la tua rete e riprova.");
            console.error("Errore submit form:", error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        });
    });

    const showSuccessScreen = () => {
        quoteForm.style.display = 'none';
        successScreen.style.display = 'flex';
        // Nascondi indicatore step e header modal
        document.querySelector('.modal-header-info').style.display = 'none';
    };

    const resetQuoteForm = () => {
        quoteForm.reset();
        quoteForm.style.display = 'block';
        successScreen.style.display = 'none';
        document.querySelector('.modal-header-info').style.display = 'block';
        currentStep = 1;
        document.getElementById('source_item').value = '';
        updateStepUI();
    };

    closeSuccessBtn.addEventListener('click', closeQuotePopup);

    // Gestione invio fast-track-form tramite AJAX (FormSubmit)
    const fastTrackForm = document.getElementById('fast-track-form');
    if (fastTrackForm) {
        fastTrackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = fastTrackForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso...';

            const formData = new FormData(fastTrackForm);

            fetch(fastTrackForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("Richiesta inviata con successo! Ti risponderò al più presto.");
                    fastTrackForm.reset();
                } else {
                    return response.json().then(data => {
                        alert("Oops! Si è verificato un problema durante l'invio del modulo. Riprova più tardi.");
                    });
                }
            })
            .catch(error => {
                alert("Errore di connessione. Verifica la tua rete e riprova.");
                console.error("Errore submit form:", error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            });
        });
    }

    // ==========================================================================
    // 7. REMOVED LEAFLET MAP
    // ==========================================================================
    // Map was removed per user request as the artist works in Biella without a fixed studio to display on the map.

    // ==========================================================================
    // 8. LEGAL MODAL LOGIC
    // ==========================================================================
    const legalLinks = document.querySelectorAll('.legal-link');
    const legalModal = document.getElementById('legal-modal');
    const closeLegalBtn = document.getElementById('close-legal-modal');
    const legalModalTitle = document.getElementById('legal-modal-title');
    const legalTabs = document.querySelectorAll('.legal-tab');

    if (legalLinks.length > 0 && legalModal) {
        legalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                
                // Hide all tabs
                legalTabs.forEach(tab => tab.style.display = 'none');
                
                // Show requested tab and set title
                const activeTab = document.getElementById(`legal-${target}`);
                if (activeTab) {
                    activeTab.style.display = 'block';
                    if (target === 'privacy') legalModalTitle.textContent = 'Privacy Policy';
                    if (target === 'cookie') legalModalTitle.textContent = 'Cookie Policy';
                    if (target === 'termini') legalModalTitle.textContent = "Termini e Condizioni d'Uso";
                }
                
                legalModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLegalPopup = () => {
            legalModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        if(closeLegalBtn) closeLegalBtn.addEventListener('click', closeLegalPopup);
        legalModal.addEventListener('click', (e) => {
            if (e.target === legalModal) {
                closeLegalPopup();
            }
        });
    }
});
