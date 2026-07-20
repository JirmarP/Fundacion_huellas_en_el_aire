/* ==========================================================================
   FUNDACIÓN HUELLAS EN EL AIRE - LÓGICA INTERACTIVA DEL CLIENTE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* 1. MODO CLARO / OSCURO (TEMA)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const getTheme = () => {
    return document.documentElement.getAttribute('data-theme');
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignorar error de seguridad en entornos locales file://
    }
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Escuchar cambios en la preferencia del sistema operativo en tiempo real
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let hasSavedTheme = false;
    try {
      hasSavedTheme = !!localStorage.getItem('theme');
    } catch (err) {}
    
    if (!hasSavedTheme) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });


  /* 2. MENÚ MÓVIL Y DRAWER
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', isExpanded);
    
    // Bloquear el scroll del cuerpo cuando el menú móvil está abierto
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  if (menuToggleBtn && mobileMenu) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Cerrar el menú al presionar un enlace
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });

    // Cerrar al hacer clic fuera del menú o presionar Esc
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== menuToggleBtn) {
        toggleMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  }


  /* 3. RESALTADO DE RUTA ACTIVA (MULTIPÁGINA)
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  const currentPath = window.location.pathname;
  let page = currentPath.split('/').pop() || 'index.html';
  
  // Si la ruta termina en / o está vacía, es index.html
  if (page === '' || currentPath.endsWith('/')) {
    page = 'index.html';
  }

  const highlightActiveLink = (links) => {
    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      // Coincidencia exacta con la página actual
      if (href === page) {
        link.classList.add('active');
      }
    });
  };

  highlightActiveLink(navLinks);
  highlightActiveLink(mobileLinks);


  /* 4. SIMULADOR DE DONACIONES (WIDGET DE IMPACTO)
     ========================================================================== */
  const donationBtns = document.querySelectorAll('.donation-btn');
  const impactText = document.getElementById('impact-text');
  const customAmountContainer = document.getElementById('custom-amount-container');
  const customAmountInput = document.getElementById('custom-amount');

  if (donationBtns.length > 0 && impactText) {
    donationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remover clase activa de todos
        donationBtns.forEach(b => b.classList.remove('active'));
        // Agregar a la seleccionada
        btn.classList.add('active');

        const amount = btn.getAttribute('data-amount');
        const impact = btn.getAttribute('data-impact');

        if (amount === 'custom') {
          customAmountContainer.style.display = 'block';
          if (customAmountInput) {
            customAmountInput.focus();
            updateCustomImpact(customAmountInput.value);
          }
        } else {
          customAmountContainer.style.display = 'none';
          impactText.textContent = impact;
        }
      });
    });

    const updateCustomImpact = (val) => {
      const parsed = parseFloat(val);
      if (!parsed || parsed <= 0) {
        impactText.textContent = "Cada aporte, sin importar el tamaño, siembra esperanza en nuestra comunidad.";
      } else {
        // Cálculo interactivo rápido para motivar al usuario
        let kidsFed = Math.floor(parsed / 2); // $2 por merienda
        let grandpasMed = Math.floor(parsed / 25); // $25 tratamiento
        
        if (parsed < 10) {
          impactText.textContent = `¡Gracias por tu aporte de $${parsed}! Tu granito de arena ayuda a financiar talleres de arte y recreación infantil en La Guaira.`;
        } else if (parsed >= 10 && parsed < 25) {
          impactText.textContent = `Con tu donación de $${parsed}, aseguras la alimentación complementaria de aproximadamente ${kidsFed} niños durante sus talleres.`;
        } else if (parsed >= 25 && parsed < 50) {
          let medText = grandpasMed > 0 ? ` y cubres el tratamiento de salud de ${grandpasMed} abuelito por un mes` : '';
          impactText.textContent = `Con $${parsed}, alimentas a ${kidsFed} niños${medText}.`;
        } else {
          impactText.textContent = `¡Increíble aporte de $${parsed}! Financias alimentación para ${kidsFed} niños y nos ayudas a extender las jornadas médicas en el Estado La Guaira.`;
        }
      }
    };

    if (customAmountInput) {
      customAmountInput.addEventListener('input', (e) => {
        updateCustomImpact(e.target.value);
      });
    }
  }


  /* 5. FUNCIONALIDAD DE COPIADO RÁPIDO (DATOS BANCARIOS)
     ========================================================================== */
  const copyBtns = document.querySelectorAll('.btn-copy');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const textToCopy = document.getElementById(targetId)?.textContent;

      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy.trim());
          
          // Efecto visual de copiado exitoso
          btn.classList.add('copied');
          
          setTimeout(() => {
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Error al intentar copiar: ', err);
        }
      }
    });
  });


  /* 6. FORMULARIO DE CONTACTO E INTERACTIVIDAD
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successState = document.getElementById('contact-success');
  const resetFormBtn = document.getElementById('btn-reset-form');

  if (contactForm && successState) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset de estados de error manual si hubiese
      let isFormValid = true;
      const inputs = contactForm.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        // Disparador de validación visual nativa del navegador
        if (!input.checkValidity()) {
          isFormValid = false;
          input.classList.add('invalid-shake');
          setTimeout(() => input.classList.remove('invalid-shake'), 500);
        }
      });

      if (isFormValid) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner');

        // Mostrar cargando
        submitBtn.disabled = true;
        btnText.style.opacity = '0.5';
        spinner.style.display = 'block';

        // Simular envío de datos local (API, etc.)
        setTimeout(() => {
          // Ocultar formulario, mostrar éxito
          contactForm.style.display = 'none';
          successState.style.display = 'block';
          
          // Reestablecer estados del botón
          submitBtn.disabled = false;
          btnText.style.opacity = '1';
          spinner.style.display = 'none';
          
          // Limpiar formulario
          contactForm.reset();
        }, 1500);
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        successState.style.display = 'none';
        contactForm.style.display = 'block';
      });
    }
  }


  /* 7. FALLBACK DE INTERSECTIONOBSERVER PARA ANIMACIONES SCROLL
     ========================================================================== */
  // Si el navegador NO soporta animaciones CSS nativas ligadas al scroll, activamos fallback por IntersectionObserver
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserverOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Activa ligeramente antes de que aparezca en pantalla
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Una vez revelado, dejamos de observarlo
          revealObserver.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);

    revealElements.forEach(el => {
      el.classList.add('scroll-reveal-fallback');
      revealObserver.observe(el);
    });
  }

});
