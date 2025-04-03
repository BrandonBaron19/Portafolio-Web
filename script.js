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
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .education-item');
    
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

const contactFormMail = document.getElementById('contact-form');

if (contactFormMail) {
    contactFormMail.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenimos cualquier envío por defecto

        // Obtener los valores de los campos
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email'); // El email del remitente
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');

        // --- Validación básica (Opcional pero recomendada) ---
        let valid = true;
        clearMailErrors(); // Limpiar errores previos

        if (nameField.value.trim() === '') {
            markMailInvalid(nameField, 'Ingresa tu nombre');
            valid = false;
        } else {
            markMailValid(nameField);
        }
         if (emailField.value.trim() === '') {
            markMailInvalid(emailField, 'Ingresa tu email');
            valid = false;
        } else if (!isValidEmail(emailField.value)) { // Reutilizamos isValidEmail
            markMailInvalid(emailField, 'Ingresa un email válido');
            valid = false;
        } else {
            markMailValid(emailField);
        }
         if (subjectField.value.trim() === '') {
            markMailInvalid(subjectField, 'Ingresa un asunto');
            valid = false;
        } else {
            markMailValid(subjectField);
        }
        if (messageField.value.trim() === '') {
            markMailInvalid(messageField, 'Ingresa tu mensaje');
            valid = false;
        } else {
            markMailValid(messageField);
        }
        // --- Fin Validación ---

        if (valid) {
            // Construir el cuerpo del correo incluyendo nombre y email del remitente
            const mailBody = `Nombre: ${nameField.value.trim()}\nEmail: ${emailField.value.trim()}\n\nMensaje:\n${messageField.value.trim()}`;

            // Construir el enlace mailto:, codificando asunto y cuerpo
            const mailtoLink = `mailto:brandonbaron19@gmail.com` +
                               `?subject=${encodeURIComponent(subjectField.value.trim())}` +
                               `&body=${encodeURIComponent(mailBody)}`;

            // Abrir el cliente de correo
            window.location.href = mailtoLink;

            // Opcional: Limpiar formulario después de intentar abrir el correo
            // contactFormMail.reset();
            // clearMailErrors();

        } else {
            // Puedes añadir un mensaje si la validación falla, aunque las marcas rojas ya lo indican
             console.warn("Formulario no válido para mailto.");
        }
    });
}

// --- Funciones de Ayuda para Validación (Necesitamos renombrarlas o asegurarnos de que no choquen) ---
// (Puedes mantener las funciones markInvalid/markValid/clearErrors/isValidEmail que ya tenías,
// solo asegúrate de llamarlas correctamente como hice arriba: markMailInvalid, etc. o usa los nombres originales)

// Ejemplo renombrando (si quieres mantener las otras):
function markMailInvalid(field, message) {
    field.classList.add('invalid');
    let errorMessage = field.parentNode.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    errorMessage.textContent = message;
}

function markMailValid(field) {
    field.classList.remove('invalid');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearMailErrors() {
    contactFormMail.querySelectorAll('.invalid').forEach(field => markMailValid(field));
     contactFormMail.querySelectorAll('.error-message').forEach(msg => msg.remove());
}

// Reutilizamos la función isValidEmail que ya tenías:
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


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
        .skill-category, .project-card, .timeline-item, .education-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .skill-category.animate, .project-card.animate, .timeline-item.animate, .education-item.animate {
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
