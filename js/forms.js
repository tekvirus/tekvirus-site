// ============================================
// FORMS HANDLER - Contact & Appointment Forms
// ============================================

class FormsHandler {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.appointmentForm = document.getElementById('appointmentForm');
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        // Set minimum date for appointment to today
        this.setMinDate();
        
        // Contact Form Submit
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
        
        // Appointment Form Submit
        if (this.appointmentForm) {
            this.appointmentForm.addEventListener('submit', (e) => this.handleAppointmentSubmit(e));
        }
    }
    
    setMinDate() {
        const dateInput = document.getElementById('appt-date');
        if (dateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate() + 1).padStart(2, '0'); // Tomorrow
            dateInput.min = `${yyyy}-${mm}-${dd}`;
        }
    }
    
    // Show form status message
    showStatus(formId, message, type) {
        const statusId = formId === 'contactForm' ? 'formStatus' : 'apptFormStatus';
        const statusElement = document.getElementById(statusId);
        
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = 'form-status ' + type;
            statusElement.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }
    
    // Handle Contact Form Submission
    async handleContactSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const form = e.target;
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('span');
        
        // Get form data
        const formData = {
            name: form.querySelector('#name').value.trim(),
            email: form.querySelector('#email').value.trim(),
            phone: form.querySelector('#phone').value.trim(),
            service: form.querySelector('#service').value,
            message: form.querySelector('#message').value.trim()
        };
        
        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            this.showStatus('contactForm', 'Please fill in all required fields.', 'error');
            return;
        }
        
        if (!this.validateEmail(formData.email)) {
            this.showStatus('contactForm', 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        this.isSubmitting = true;
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        this.showStatus('contactForm', 'Sending your message...', 'loading');
        
        try {
            // Send email using EmailJS
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                service: formData.service || 'Not specified',
                message: formData.message,
                to_email: window.EMAILJS_CONFIG.BUSINESS_EMAIL,
                reply_to: formData.email
            };
            
            await emailjs.send(
                window.EMAILJS_CONFIG.SERVICE_ID,
                window.EMAILJS_CONFIG.TEMPLATES.CONTACT_FORM,
                templateParams
            );
            
            // Success
            this.showStatus('contactForm', '✅ Message sent successfully! We will contact you soon.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            this.showStatus('contactForm', '❌ Failed to send message. Please try again or contact us directly at techvirusofficial@gmail.com', 'error');
        } finally {
            this.isSubmitting = false;
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
        }
    }
    
    // Handle Appointment Form Submission
    async handleAppointmentSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const form = e.target;
        const submitBtn = document.getElementById('apptSubmitBtn');
        const btnText = submitBtn.querySelector('span');
        
        // Get form data
        const formData = {
            name: form.querySelector('#appt-name').value.trim(),
            email: form.querySelector('#appt-email').value.trim(),
            phone: form.querySelector('#appt-phone').value.trim(),
            company: form.querySelector('#appt-company').value.trim(),
            service: form.querySelector('#appt-service').value,
            date: form.querySelector('#appt-date').value,
            time: form.querySelector('#appt-time').value,
            mode: form.querySelector('#appt-mode').value,
            message: form.querySelector('#appt-message').value.trim()
        };
        
        // Validate
        if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time || !formData.mode) {
            this.showStatus('appointmentForm', 'Please fill in all required fields.', 'error');
            return;
        }
        
        if (!this.validateEmail(formData.email)) {
            this.showStatus('appointmentForm', 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        this.isSubmitting = true;
        submitBtn.disabled = true;
        btnText.textContent = 'Booking...';
        this.showStatus('appointmentForm', 'Booking your appointment...', 'loading');
        
        try {
            // Send email using EmailJS
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                company: formData.company || 'Not provided',
                service: formData.service,
                appointment_date: formData.date,
                appointment_time: formData.time,
                consultation_mode: formData.mode,
                additional_info: formData.message || 'No additional information',
                to_email: window.EMAILJS_CONFIG.BUSINESS_EMAIL,
                reply_to: formData.email
            };
            
            await emailjs.send(
                window.EMAILJS_CONFIG.SERVICE_ID,
                window.EMAILJS_CONFIG.TEMPLATES.APPOINTMENT_FORM,
                templateParams
            );
            
            // Success
            this.showStatus('appointmentForm', '✅ Appointment booked successfully! We will confirm via email shortly.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            this.showStatus('appointmentForm', '❌ Booking failed. Please try again or call us at 7904321890.', 'error');
        } finally {
            this.isSubmitting = false;
            submitBtn.disabled = false;
            btnText.textContent = 'Book Appointment';
        }
    }
    
    // Email validation
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormsHandler();
});