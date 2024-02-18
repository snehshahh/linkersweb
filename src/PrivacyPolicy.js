// PrivacyPolicy.js
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="container text-center">
      <h2 className="mt-4">Privacy Policy</h2>
      <hr style={{ width: '800px', margin: '20px auto 20px auto' }} />
      <p style={{ fontSize: '18px' }}>
        This Privacy Policy describes how your personal information is handled when you use our web application and browser extension to save links and notes and share them with others.
      </p>
      <h3>Information We Collect</h3>
      <p style={{ fontSize: '18px' }}>
        When you use our web application and browser extension, we collect information such as your email address and password when you register for an account. We also collect information about the links and notes you save using our services.
      </p>
      <h3>How We Use Your Information</h3>
      <p style={{ fontSize: '18px' }}>
        We use the information we collect to provide, maintain, and improve our web application and browser extension, as well as to communicate with you about your account and our services. </p>
      <h3>Sharing Your Information</h3>
      <p style={{ fontSize: '18px' }}>
        We do not share your personal information with others. When you share a link with someone using our services, we only share the linkId and collectionId associated with that link. This allows the recipient to access the shared link and associated notes without revealing your personal information.
      </p>
      <h3>Data Retention</h3>
      <p style={{ fontSize: '18px' }}>
        We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
      </p>
      <h3>Your Choices</h3>
      <p style={{ fontSize: '18px' }}>
        You can access and update your account information at any time by logging into your account on our web application.
      </p>
      <p style={{ fontSize: '18px' }}>
        By using our web application and browser extension, you consent to the collection, use, and sharing of your personal information as described in this Privacy Policy.
      </p>
      <p style={{ fontSize: '18px' }}>
        If you have any questions or concerns about our Privacy Policy, please contact us at snehshah7634@gmail.com.
      </p>
      <Link to="/" style={{ fontSize: '18px',color:'black' }}>Back to Home</Link>
    </div>
  );
};

export default PrivacyPolicy;
