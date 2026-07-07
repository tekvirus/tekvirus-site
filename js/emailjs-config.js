// ============================================
// EMAILJS CONFIGURATION
// ============================================

// Initialize EmailJS with your public key
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    // Get it from: https://dashboard.emailjs.com/admin/account
    emailjs.init('YOUR_PUBLIC_KEY'); // ← REPLACE THIS WITH YOUR ACTUAL PUBLIC KEY
})();

// EmailJS Configuration Object
const EMAILJS_CONFIG = {
    // Service ID - Create from: https://dashboard.emailjs.com/admin
    SERVICE_ID: 'service_lb9tr7p', // ← REPLACE WITH YOUR SERVICE ID
    
    // Template IDs - Create from: https://dashboard.emailjs.com/admin/templates
    TEMPLATES: {
        CONTACT_FORM: 'template_contact_form', // ← REPLACE WITH YOUR CONTACT FORM TEMPLATE ID
        APPOINTMENT_FORM: 'template_appointment_form' // ← REPLACE WITH YOUR APPOINTMENT TEMPLATE ID
    },
    
    // Your business email where notifications will be sent
    BUSINESS_EMAIL: 'techvirusofficial@gmail.com',
    
    // Auto-reply settings
    AUTO_REPLY: {
        ENABLED: true,
        SUBJECT: 'Thank you for contacting Tekvirus',
        FROM_NAME: 'Tekvirus Team'
    }
};

// Export for use in other files
window.EMAILJS_CONFIG = EMAILJS_CONFIG;