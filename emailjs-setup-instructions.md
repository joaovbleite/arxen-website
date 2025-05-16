# Setting Up EmailJS for ARXEN Construction Website

This guide will walk you through setting up EmailJS to make your website forms start sending emails to your email address.

## Step 1: Create an EmailJS account

1. Go to [EmailJS website](https://www.emailjs.com/) and sign up for a free account
2. Verify your email address

## Step 2: Connect an Email Service

1. In the EmailJS dashboard, go to "Email Services" in the left menu
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps to connect your account
5. Name your service (e.g., "ARXEN Contact")
6. Note down the **Service ID** for later

## Step 3: Create Email Templates

You need to create two email templates:

### Contact Form Template:
1. In the EmailJS dashboard, go to "Email Templates" in the left menu
2. Click "Create New Template"
3. Enter a name (e.g., "ARXEN Contact Form")
4. Design your email template using these dynamic variables:
   ```
   To Name: {{to_name}}
   From Name: {{from_name}}
   From Email: {{from_email}}
   Phone: {{phone}}
   Address: {{address}}
   Inquiry Type: {{inquiry_type}}
   Service Type: {{service_type}}
   Project Type: {{project_type}}
   Message: {{message}}
   How Heard: {{how_heard}}
   Form Source: {{form_source}}
   ```
5. Save the template and note down the **Template ID**

### Estimate Form Template:
1. Click "Create New Template" again
2. Enter a name (e.g., "ARXEN Estimate Form")
3. Design your email template using these dynamic variables:
   ```
   To Name: {{to_name}}
   From Name: {{from_name}}
   From Email: {{from_email}}
   Phone: {{phone}}
   Company: {{company}}
   Reference Number: {{reference_number}}
   Service List: {{service_list}}
   Project Type: {{project_type}}
   Project Description: {{project_description}}
   Urgency: {{urgency}}
   Scope: {{scope}}
   Timeline: {{timeline}}
   Promo Code: {{promo_code}}
   Preferred Contact: {{preferred_contact}}
   Form Source: {{form_source}}
   ```
4. Save the template and note down the **Template ID**

## Step 4: Get your API Keys

1. In the EmailJS dashboard, go to "Account" in the left menu
2. Find your **Public Key** in the API Keys section

## Step 5: Update the Website Code

Update the values in the `src/utils/emailService.ts` file:

```typescript
// Email service configuration
export const EMAIL_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  CONTACT_TEMPLATE_ID: 'YOUR_CONTACT_TEMPLATE_ID', // Replace with your contact form template ID
  ESTIMATE_TEMPLATE_ID: 'YOUR_ESTIMATE_TEMPLATE_ID', // Replace with your estimate form template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY' // Replace with your actual EmailJS public key
};
```

Replace:
- `YOUR_SERVICE_ID` with the Service ID you noted in Step 2
- `YOUR_CONTACT_TEMPLATE_ID` with the Contact Form Template ID from Step 3
- `YOUR_ESTIMATE_TEMPLATE_ID` with the Estimate Form Template ID from Step 3
- `YOUR_PUBLIC_KEY` with the Public Key from Step 4

Also update the `initEmailJS` function with your public key:

```typescript
export const initEmailJS = () => {
  emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual EmailJS public key
};
```

## Step 6: Test the Forms

After updating the code and deploying the changes:

1. Test the contact form by submitting a test message
2. Test the free estimate form by submitting a test estimate request
3. Check your email to ensure you received the test submissions

## Troubleshooting

- **Emails not sending**: Check your email service connection in EmailJS dashboard
- **Template variables not populating**: Verify that the variable names in your templates match the ones being sent
- **Rate limit exceeded**: The free tier has a limit of 200 emails per month. Consider upgrading if you need more

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS API Reference](https://www.emailjs.com/docs/api-reference/emailjs/)
- [EmailJS React Examples](https://www.emailjs.com/docs/examples/reactjs/)

---

For any questions or assistance, contact your web developer. 