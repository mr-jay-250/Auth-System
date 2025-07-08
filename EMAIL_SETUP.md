# Email Setup Guide

This guide will help you configure nodemailer to send actual OTP emails for password changes.

## Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
FRONTEND_URL=http://localhost:3001
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASSWORD`

## Other Email Services

You can use other email services by modifying the transporter in `utils/emailService.js`:

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Testing

1. Start your backend server
2. Start your frontend: `cd frontend && npm start`
3. Login to your account
4. Go to "Change Password" page
5. Click "Request OTP"
6. Check your email for the OTP

## Troubleshooting

- **Authentication failed**: Check your email and app password
- **Connection timeout**: Verify your email service settings
- **OTP not received**: Check spam folder and email configuration

## Security Notes

- Never commit your `.env` file to version control
- Use app passwords instead of your main password
- Consider using environment-specific email accounts for testing 