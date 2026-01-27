/**
 * Email Service
 * Handles reading email configuration and simulating email sending.
 */

// Default configuration for fallbacks
const DEFAULT_EMAIL_CONFIG = {
    // Password Reset
    passwordReset: {
        enabled: true,
        subject: 'Reset your password - People Analyzer',
        body: 'Hi {{name}},\n\nYou requested a password reset. Click the following link to reset your password:\n{{link}}\n\nIf you did not request this, please ignore this email.'
    },
    // Performance Evaluation Invitation
    perfReviewInvite: {
        enabled: true,
        subject: 'You have been invited to a performance evaluation',
        body: 'Hi {{name}},\n\nYou have been invited to participate in a performance evaluation for {{cycleName}}.\n\nPlease log in to complete your evaluation.'
    },
    // Invitation Reminder
    inviteReminder: {
        enabled: true,
        subject: 'Reminder: Complete your People Analyzer registration',
        body: 'Hi {{name}},\n\nThis is a friendly reminder to complete your registration at People Analyzer.\n\nClick here to join: {{link}}'
    },
    // Notification: You have been evaluated
    evalNotification: {
        enabled: true,
        subject: 'New Feedback Available',
        body: 'Hi {{name}},\n\nYou have received new feedback in People Analyzer. Log in to view your results.'
    },
    // Notification: Team member evaluated (for managers)
    teamEvalNotification: {
        enabled: true,
        subject: 'Team Member Evaluation Completed',
        body: 'Hi {{name}},\n\nA performance evaluation has been completed for your team member: {{teamMemberName}}.'
    }
};

export const emailService = {
    /**
     * Retrieves the current email configuration from local storage or defaults.
     * @returns {Object} The complete email configuration object.
     */
    getConfig() {
        try {
            const saved = localStorage.getItem('admin_email_settings_advanced');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all keys exist if new ones were added
                return { ...DEFAULT_EMAIL_CONFIG, ...parsed };
            }
        } catch (e) {
            console.error('Error loading email config', e);
        }
        return DEFAULT_EMAIL_CONFIG;
    },

    /**
     * Saves the email configuration to local storage.
     * @param {Object} config The new configuration object.
     */
    saveConfig(config) {
        localStorage.setItem('admin_email_settings_advanced', JSON.stringify(config));
    },

    /**
     * Simulates sending an email based on the type and data.
     * @param {string} to Recipient email
     * @param {string} type key of the email configuration (e.g., 'passwordReset')
     * @param {Object} data Key-value pairs for placeholder replacement
     * @returns {Promise<boolean>} success
     */
    async sendEmail(to, type, data = {}) {
        const config = this.getConfig();
        const typeConfig = config[type];

        if (!typeConfig) {
            console.warn(`Email type '${type}' not found in configuration.`);
            return false;
        }

        if (!typeConfig.enabled) {
            console.log(`Email sending skipped for '${type}' (Disabled).`);
            return false;
        }

        let { subject, body } = typeConfig;

        // Replace placeholders
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            subject = subject.replace(regex, data[key]);
            body = body.replace(regex, data[key]);
        });

        // SIMULATE SENDING
        console.group('📧 MOCK EMAIL SENT');
        console.log('To:', to);
        console.log('Type:', type);
        console.log('Subject:', subject);
        console.log('Body:', body);
        console.groupEnd();

        return true;
    }
};
