const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = document.querySelector('[data-contact-status]');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        contactStatus.textContent = 'Sending...';

      const formData = new FormData(contactForm);
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Form submission failed.');
            }
            contactForm.reset();
            contactStatus.textContent = 'Message sent. Thank you for contacting Iron Quill Games.';
        } catch (error) {
            contactStatus.textContent = 'Something went wrong. Please email info@ironquillgamesco.com directly.';
        }
    });
}
