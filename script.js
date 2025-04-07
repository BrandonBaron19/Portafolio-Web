// Navegación móvil
const mobileToggle = document.querySelector('.mobile-toggle');
const navbarLinks = document.querySelector('.navbar-links');

mobileToggle.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});

// Filtro de proyectos
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase activa de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Añadir clase activa al botón clickeado
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filtrar proyectos
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            navbarLinks.classList.remove('active');
        }
    });
});

// Efecto de escritura para terminal
const terminalText = document.querySelector('.terminal-text');
if (terminalText) {
    const cursor = document.querySelector('.cursor');
    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);
}

// Animación al scroll
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .education-item, .hero-highlights li, .tech-item');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animatedElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Verificar si el elemento está en viewport
            if (
                elementBottomPosition >= windowTopPosition && 
                elementTopPosition <= windowBottomPosition
            ) {
                element.classList.add('animate');
            }
        });
    }
    
    // Agregar clase CSS para animación inicial
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    
    // Ejecutar verificación inicial
    checkIfInView();
});

// Validación de formulario de contacto
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenimos el envío normal para usar AJAX

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        let valid = true;

        // --- Validación (similar a la anterior) ---
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');

        // Limpiar errores previos
        clearErrors();
        formStatus.textContent = ''; // Limpiar mensaje de estado previo
        formStatus.style.color = 'inherit'; // Resetear color

        if (nameField.value.trim() === '') {
            markInvalid(nameField, 'Por favor ingresa tu nombre');
            valid = false;
        } else {
            markValid(nameField);
        }

        if (emailField.value.trim() === '') {
            markInvalid(emailField, 'Por favor ingresa tu email');
            valid = false;
        } else if (!isValidEmail(emailField.value)) {
            markInvalid(emailField, 'Por favor ingresa un email válido');
            valid = false;
        } else {
            markValid(emailField);
        }

        if (messageField.value.trim() === '') {
            markInvalid(messageField, 'Por favor ingresa tu mensaje');
            valid = false;
        } else {
            markValid(messageField);
        }
        // --- Fin Validación ---


        if (valid) {
            // Si el formulario es válido, enviar a Formspree
            submitButton.disabled = true; // Deshabilitar botón mientras envía
            submitButton.textContent = 'Enviando...'; // Feedback visual
            formStatus.textContent = ''; // Limpiar mensajes previos

            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json' // Para que Formspree responda con JSON
                }
            })
            .then(response => {
                if (response.ok) {
                    // Éxito
                    formStatus.textContent = "¡Gracias por tu mensaje! Te responderé pronto.";
                    formStatus.style.color = 'var(--accent)'; // Verde éxito
                    contactForm.reset(); // Limpiar el formulario
                    clearErrors(); // Limpiar posibles bordes rojos residuales
                } else {
                    // Error de Formspree o red
                    response.json().then(data => {
                        // Intentar mostrar error específico de Formspree si existe
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = "Oops! Hubo un problema al enviar el mensaje. Intenta de nuevo.";
                        }
                        formStatus.style.color = 'var(--danger)'; // Rojo error
                    }).catch(error => {
                         // Error genérico si falla el .json()
                        formStatus.textContent = "Oops! Hubo un problema al enviar el mensaje. Intenta de nuevo.";
                        formStatus.style.color = 'var(--danger)'; // Rojo error
                    });
                }
            })
            .catch(error => {
                // Error de red (fetch falló)
                formStatus.textContent = "Error de red. Por favor, revisa tu conexión e intenta de nuevo.";
                formStatus.style.color = 'var(--danger)'; // Rojo error
            })
            .finally(() => {
                // Volver a habilitar el botón y restaurar texto
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensaje';
            });
        } else {
            // Si el formulario no es válido (la validación JS falló)
             formStatus.textContent = "Por favor, corrige los campos marcados.";
             formStatus.style.color = 'var(--warning)'; // Amarillo advertencia
        }
    });
}

// --- Funciones de Ayuda para Validación (Modificadas ligeramente) ---
function markInvalid(field, message) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true'); // Para accesibilidad

    let errorMessage = field.parentNode.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        // Insertar después del input/textarea, no al final del form-group
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    errorMessage.textContent = message;
}

function markValid(field) {
    field.classList.remove('invalid');
     field.removeAttribute('aria-invalid'); // Para accesibilidad

    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearErrors() {
    // Quitar todos los mensajes de error y clases 'invalid'
    const invalidFields = document.querySelectorAll('.invalid');
    if (invalidFields) {
        invalidFields.forEach(field => markValid(field));
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// --- FIN: Código de Validación y Envío de Formulario ---

// Cargar fuentes personalizadas 
(function loadFonts() {
    const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap'
    ];
    
    fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    });
})();

// Agregar estilos de animación dinámicamente
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .skill-category, .project-card, .timeline-item, .education-item, .hero-highlights li, .tech-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .skill-category.animate, .project-card.animate, .timeline-item.animate, .education-item.animate, 
        .hero-highlights li.animate, .tech-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .form-input.invalid, .form-textarea.invalid {
            border: 2px solid var(--danger);
        }
        
        .error-message {
            color: var(--danger);
            font-size: 0.8rem;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
})();