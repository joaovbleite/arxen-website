# Formspree Email Integration Setup Instructions

This document explains how Formspree is integrated into the ARXEN Construction website to handle form submissions.

## What is Formspree?

Formspree is a form backend service that allows you to handle form submissions without any server-side code. It receives the form data, validates it, protects against spam, and forwards the submissions to your email address.

## Current Implementation

The ARXEN website uses Formspree for the following forms:

1. **Contact Form** - Direct form submission to Formspree
2. **Free Estimate Form** - Multi-step form with hidden Formspree integration

## Formspree Setup Instructions

### Creating a New Formspree Form

1. Go to [Formspree.io](https://formspree.io/) and create an account or log in
2. Create a new form and choose the plan that fits your needs (Free plan allows 50 submissions per month)
3. Give your form a name (e.g., "ARXEN Contact Form")
4. Add the email address where you want to receive submissions
5. Copy the unique form endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`)

### Integrating Formspree into a Form

Add the Formspree endpoint as the form's action attribute:

```html
<form action="https://formspree.io/f/your-form-id" method="POST">
  <!-- Form fields -->
  <input type="text" name="name">
  <input type="email" name="email">
  <textarea name="message"></textarea>
  
  <!-- Special Formspree fields -->
  <input type="hidden" name="_next" value="https://yourdomain.com/thank-you">
  <input type="text" name="_gotcha" style="display: none">
  
  <button type="submit">Send</button>
</form>
```

### Important Formspree Features Used

1. **Custom Redirect** - The `_next` hidden field specifies where to redirect after submission
2. **Honeypot Spam Filter** - The `_gotcha` field helps detect spam bots
3. **Field Names** - Use descriptive field names as they appear in the email notification

## Current Formspree Endpoints

- Contact Form: `https://formspree.io/f/xjvqkrko`
- Free Estimate Form: `https://formspree.io/f/xrgwyejq`

## Customizing Email Templates

For more advanced customization of email templates, consider upgrading to a paid Formspree plan, which allows:

- Custom email templates
- Email notifications to multiple recipients
- Webhook integrations
- File uploads
- Unlimited forms and higher submission limits

## Troubleshooting

If form submissions aren't working:

1. Check browser console for errors
2. Verify the form action URL is correct
3. Make sure all required fields have the `required` attribute
4. Check Formspree dashboard for submission logs and potential issues

## Maintaining Form Security

- Keep your Formspree endpoints private (though they are designed to be placed in HTML)
- Implement proper client-side validation to improve user experience
- Use the built-in honeypot field to reduce spam

## Testing Form Submissions

When testing forms in development:
- The first submission from a new email address will require confirmation
- Use different test email addresses to avoid this in repeating tests
- Or use Formspree's "Test Submission" feature in the dashboard 