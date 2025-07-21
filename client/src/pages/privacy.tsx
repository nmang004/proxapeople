import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { PublicHeader } from "@/shared/ui/components/public-header";
import { PublicFooter } from "@/shared/ui/components/public-footer";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-white pt-16 pb-20 md:pt-24 md:pb-28">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, 
            use, and protect your personal information.
          </p>
          <p className="text-sm text-neutral-500">
            Last updated: January 21, 2025
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const PrivacyContent = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto prose prose-lg"
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-neutral-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• <strong>Account Information:</strong> Name, email address, job title, company information</li>
              <li>• <strong>Profile Data:</strong> Performance goals, review data, feedback, and professional information</li>
              <li>• <strong>Usage Data:</strong> How you interact with our platform, features used, and session information</li>
              <li>• <strong>Communication Data:</strong> Messages sent through our platform and support interactions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-neutral-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• Provide and operate the Proxa People platform</li>
              <li>• Process performance reviews, goals, and feedback</li>
              <li>• Send notifications and platform updates</li>
              <li>• Provide customer support and respond to inquiries</li>
              <li>• Analyze usage patterns to improve our services</li>
              <li>• Ensure platform security and prevent fraud</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="text-neutral-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              information in the following circumstances:
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• <strong>Within Your Organization:</strong> Performance data is shared with authorized users (managers, HR) as configured</li>
              <li>• <strong>Service Providers:</strong> Trusted third parties who assist in operating our platform (hosting, analytics, support)</li>
              <li>• <strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
              <li>• <strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-neutral-600 mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• AES-256 encryption for data at rest</li>
              <li>• TLS 1.3 encryption for data in transit</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• SOC 2 Type II compliance</li>
              <li>• Multi-factor authentication and access controls</li>
              <li>• Regular employee security training</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-neutral-600 mb-4">
              You have certain rights regarding your personal information:
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• <strong>Access:</strong> Request a copy of your personal information</li>
              <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
              <li>• <strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li>• <strong>Restriction:</strong> Limit how we use your information</li>
              <li>• <strong>Objection:</strong> Object to certain uses of your information</li>
            </ul>
            <p className="text-neutral-600 mt-4">
              To exercise these rights, contact us at privacy@proxapeople.com.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
            <p className="text-neutral-600 mb-4">
              We retain your information for as long as necessary to provide our services and fulfill 
              the purposes outlined in this policy:
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• Account data is retained while your account is active</li>
              <li>• Performance data is retained according to your organization's data retention policies</li>
              <li>• Usage logs are retained for up to 24 months for security and analytics purposes</li>
              <li>• Deleted data is permanently removed within 30 days unless legal retention is required</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">7. International Transfers</h2>
            <p className="text-neutral-600">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place, including Standard Contractual Clauses 
              approved by the European Commission for transfers outside the EEA.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking</h2>
            <p className="text-neutral-600 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• <strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
              <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-neutral-600 mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            <p className="text-neutral-600">
              Our services are not directed to individuals under 16 years of age. We do not 
              knowingly collect personal information from children under 16.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">10. Updates to This Policy</h2>
            <p className="text-neutral-600">
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last updated" 
              date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-neutral-600 mb-4">
              If you have questions about this privacy policy or our data practices, contact us:
            </p>
            <div className="bg-neutral-50 p-6 rounded-lg">
              <p className="text-neutral-600 mb-2"><strong>Email:</strong> privacy@proxapeople.com</p>
              <p className="text-neutral-600 mb-2"><strong>Address:</strong> 123 Tech Street, San Francisco, CA 94102</p>
              <p className="text-neutral-600"><strong>Data Protection Officer:</strong> dpo@proxapeople.com</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Proxa People - Data Protection & Privacy</title>
        <meta name="description" content="Proxa People's privacy policy explaining how we collect, use, and protect your personal information in compliance with GDPR and CCPA." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <PrivacyContent />
      </main>
      
      <PublicFooter />
    </>
  );
}