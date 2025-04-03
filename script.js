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

const contactForm = document.getElementById('contact-form'); // Renombramos la variable para claridad

if (contactForm) {
    // Mantenemos las funciones de ayuda para validación visual
    function markInvalid(field, message) { // Puedes usar los nombres originales
        field.classList.add('invalid');
        // Añadir mensaje de error si no existe
        let errorMessage = field.parentNode.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message'; // Asegúrate que este estilo exista en CSS
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
        }
        errorMessage.textContent = message;
        errorMessage.style.display = 'block'; // Asegurarse que sea visible
    }

    function markValid(field) {
        field.classList.remove('invalid');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            //errorMessage.remove(); // O simplemente ocultarlo
             errorMessage.style.display = 'none';
        }
    }

    function clearErrors() {
        contactForm.querySelectorAll('.invalid').forEach(field => markValid(field));
        contactForm.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none'); // Ocultar todos
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    // --- Fin funciones de ayuda ---


    contactForm.addEventListener('submit', function(e) {
        // Realizamos la validación ANTES de permitir el envío a Formspree
        clearErrors(); // Limpiar errores previos
        let formIsValid = true;

        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const subjectField = document.getElementById('subject'); // Aunque Formspree lo maneja, podemos validarlo
        const messageField = document.getElementById('message');

        // Validación Nombre
        if (nameField.value.trim() === '') {
            markInvalid(nameField, 'Por favor, ingresa tu nombre.');
            formIsValid = false;
        } else {
            markValid(nameField);
        }

        // Validación Email
        if (emailField.value.trim() === '') {
            markInvalid(emailField, 'Por favor, ingresa tu email.');
            formIsValid = false;
        } else if (!isValidEmail(emailField.value.trim())) {
            markInvalid(emailField, 'Por favor, ingresa un email válido.');
            formIsValid = false;
        } else {
            markValid(emailField);
        }

        // Validación Asunto (Opcional, pero bueno tenerla)
        if (subjectField.value.trim() === '') {
            // Podrías decidir si es obligatorio o no
            // markInvalid(subjectField, 'Por favor, ingresa un asunto.');
            // formIsValid = false;
             markValid(subjectField); // O simplemente limpiarlo si no es obligatorio
        } else {
             markValid(subjectField);
        }


        // Validación Mensaje
        if (messageField.value.trim() === '') {
            markInvalid(messageField, 'Por favor, escribe tu mensaje.');
            formIsValid = false;
        } else {
            markValid(messageField);
        }


        // --- Decisión Final ---
        if (!formIsValid) {
            // Si el formulario NO es válido, detenemos el envío (a Formspree)
            e.preventDefault();
            console.warn("Formulario inválido. Envío a Formspree prevenido por validación JS.");
            // Opcional: Mostrar un mensaje general de error si quieres
             const formStatus = document.getElementById('form-status');
             if (formStatus) {
                 formStatus.textContent = 'Por favor, corrige los errores marcados.';
                 formStatus.style.color = 'var(--danger)'; // Usa tu variable CSS
             }
        } else {
            // Si el formulario ES válido, dejamos que el navegador continúe
            // con el envío POST a la URL de Formspree definida en el 'action' del form.
            // ¡No necesitamos hacer nada más aquí!
            console.log("Formulario válido. Permitiendo envío a Formspree...");
            // Opcional: Mostrar un estado de "Enviando..."
             const formStatus = document.getElementById('form-status');
             if (formStatus) {
                 formStatus.textContent = 'Enviando...';
                  formStatus.style.color = 'var(--secondary)'; // O un color neutral
             }
            // Formspree se encargará de mostrar la página de agradecimiento.
        }

        // MUY IMPORTANTE: TODO EL CÓDIGO RELACIONADO CON 'mailto:' SE ELIMINA:
        // const mailBody = ...;
        // const mailtoLink = ...;
        // window.location.href = mailtoLink;
        // ¡Todo eso ya no es necesario!
    });
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
