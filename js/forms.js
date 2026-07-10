// ============================================
// FORMS HANDLER - Contact & Appointment Forms
// ============================================

// Configuration - In production, these would be environment variables
const CONFIG = {
    EMAILJS: {
        SERVICE_ID: 'service_lb9tr7p', // Replace with your actual service ID
        TEMPLATES: {
            CONTACT_FORM: 'template_lcx2lx9', // Replace with your template ID
            APPOINTMENT_FORM: 'template_k56dskv' // Replace with your template ID
        },
        PUBLIC_KEY: 'f4-h8mBb1caW_Eg3n' // Replace with your public key
    },
    BUSINESS_EMAIL: 'techvirusofficial@gmail.com',
    BACKEND_URL: 'http://localhost:5000/api' // Update with your backend URL
};

class FormsHandler {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.appointmentForm = document.getElementById('appointmentForm');
        this.isSubmitting = false;
        
        // Initialize EmailJS
        this.initEmailJS();
        
        this.init();
    }
    
    initEmailJS() {
        // Initialize EmailJS with public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init({
                publicKey: CONFIG.EMAILJS.PUBLIC_KEY,
                // Uncomment for production with private key
                // privateKey: CONFIG.EMAILJS.PRIVATE_KEY
            });
            console.log('EmailJS initialized successfully');
        } else {
            console.warn('EmailJS library not loaded');
        }
    }
    
    init() {
        // Set minimum date for appointment to tomorrow
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
    
    // ==================== CONTACT FORM HANDLER ====================
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
            // STEP 1: Send email using EmailJS
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                service: formData.service || 'Not specified',
                message: formData.message,
                to_email: CONFIG.BUSINESS_EMAIL,
                reply_to: formData.email
            };
            
            await emailjs.send(
                CONFIG.EMAILJS.SERVICE_ID,
                CONFIG.EMAILJS.TEMPLATES.CONTACT_FORM,
                templateParams
            );
            
            // STEP 2: Send data to backend for MongoDB storage
            const backendResponse = await this.sendToBackend('/contact', formData);
            
            if (!backendResponse.success) {
                console.warn('Backend storage failed but email was sent:', backendResponse.message);
            }
            
            // Success
            this.showStatus('contactForm', '✅ Message sent successfully! We will contact you soon.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            
            // Check if it's an EmailJS error
            if (error.text) {
                this.showStatus('contactForm', `❌ Email failed: ${error.text}`, 'error');
            } else {
                this.showStatus('contactForm', '❌ Failed to send message. Please try again or contact us directly.', 'error');
            }
        } finally {
            this.isSubmitting = false;
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
        }
    }
    
    // ==================== APPOINTMENT FORM HANDLER ====================
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
            // STEP 1: Send email using EmailJS
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
                to_email: CONFIG.BUSINESS_EMAIL,
                reply_to: formData.email
            };
            
            await emailjs.send(
                CONFIG.EMAILJS.SERVICE_ID,
                CONFIG.EMAILJS.TEMPLATES.APPOINTMENT_FORM,
                templateParams
            );
            
            // STEP 2: Send data to backend for MongoDB storage
            const backendData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                service: formData.service,
                date: formData.date,
                time: formData.time,
                mode: formData.mode,
                message: formData.message
            };
            
            const backendResponse = await this.sendToBackend('/appointment', backendData);
            
            if (!backendResponse.success) {
                console.warn('Backend storage failed but email was sent:', backendResponse.message);
            }
            
            // Success
            this.showStatus('appointmentForm', '✅ Appointment booked successfully! We will confirm via email shortly.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            
            if (error.text) {
                this.showStatus('appointmentForm', `❌ Booking failed: ${error.text}`, 'error');
            } else {
                this.showStatus('appointmentForm', '❌ Booking failed. Please try again or call us for assistance.', 'error');
            }
        } finally {
            this.isSubmitting = false;
            submitBtn.disabled = false;
            btnText.textContent = 'Book Appointment';
        }
    }
    
    // ==================== BACKEND API CALL ====================
    async sendToBackend(endpoint, data) {
        try {
            const response = await fetch(`${CONFIG.BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Backend request failed');
            }
            
            return result;
        } catch (error) {
            console.error('Backend API error:', error);
            // Don't throw - we want to continue even if backend fails (email already sent)
            return {
                success: false,
                message: error.message || 'Backend storage failed'
            };
        }
    }
    
    // ==================== EMAIL VALIDATION ====================
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormsHandler();
});