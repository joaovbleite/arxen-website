import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Introduction</h2>
          <p className="text-gray-700 mb-4">
            Arxen Construction ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you visit our website or use our services.
          </p>
          <p className="text-gray-700 mb-4">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <p className="text-gray-700 mb-4">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Fill out forms on our website</li>
            <li>Request information or quotes</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us via email, phone, or through contact forms</li>
            <li>Use our services</li>
          </ul>
          <p className="text-gray-700 mb-4">
            This personal information may include your name, email address, phone number, address, and any other information you choose to provide.
          </p>

          <h3 className="text-xl font-medium mb-2">Automatically Collected Information</h3>
          <p className="text-gray-700 mb-4">
            When you visit our website, we may automatically collect certain information about your device, including:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Pages visited</li>
            <li>Time and date of your visit</li>
            <li>Time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We may use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Providing, maintaining, and improving our services</li>
            <li>Processing and fulfilling your requests</li>
            <li>Sending you administrative emails</li>
            <li>Sending marketing and promotional communications</li>
            <li>Responding to your comments, questions, and requests</li>
            <li>Analyzing usage patterns to improve our website and services</li>
            <li>Protecting our rights and interests, as well as the rights and interests of others</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
            Cookies are files with a small amount of data which may include an anonymous unique identifier. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            We may use third-party service providers to help us operate our business and administer activities on our behalf, 
            such as sending out newsletters or surveys. We may share your information with these third parties for limited purposes, 
            provided that you have given us your permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">Email: Arxenconstruction@gmail.com</p>
            <p className="text-gray-700">Phone: 404-934-9458</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 