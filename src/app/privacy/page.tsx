export const metadata = {
  title: "Privacy Policy — The Reporters",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-10 max-w-3xl mx-auto text-gray-300">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: August 31, 2026</p>

      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-2">1. Information We Collect</h2>
          <p>
            When you create an account on The Reporters, we collect your name and email address.
            If you choose to sign in with Google, we receive the basic profile information
            (name, email, profile picture) provided by that service. Any content you submit —
            articles, comments, images, or video — is stored and associated with your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">2. Cookies &amp; Authentication</h2>
          <p>
            We use cookies solely to keep you securely signed in. Our authentication system
            (NextAuth) sets a session cookie once you log in, which is used to verify your
            identity on future requests. We do not use cookies for advertising or third-party
            tracking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">3. How We Use Your Information</h2>
          <p>
            Your information is used to operate your account, attribute your published
            articles and comments, and maintain the security of the platform. We do not use
            your personal data for any purpose beyond running the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">4. Data Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal data to third parties. Your
            information is never shared for marketing or advertising purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">5. Data Retention</h2>
          <p>
            We retain your account information for as long as your account remains active.
            You may request deletion of your account and associated data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or how your data is handled,
            please contact us through the support channels listed on our platform.
          </p>
        </section>
      </div>
    </div>
  );
}
