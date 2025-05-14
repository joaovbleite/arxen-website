import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">1. Agreement to Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing our website at Arxen Construction, you are agreeing to be bound by these Terms of Service, 
            all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          <p className="text-gray-700 mb-4">
            If you do not agree with any of these terms, you are prohibited from using or accessing this site. 
            The materials contained in this website are protected by applicable copyright and trademark law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">2. Use License</h2>
          <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              Permission is granted to temporarily download one copy of the materials on Arxen Construction's website 
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
              <ul className="list-disc pl-6 mt-2 mb-2">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display;</li>
                <li>Attempt to decompile or reverse engineer any software contained on Arxen Construction's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </li>
            <li>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by Arxen Construction at any time. 
              Upon terminating your viewing of these materials or upon the termination of this license, 
              you must destroy any downloaded materials in your possession whether in electronic or printed format.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">3. Disclaimer</h2>
          <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              The materials on Arxen Construction's website are provided on an 'as is' basis. 
              Arxen Construction makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
              including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
              or non-infringement of intellectual property or other violation of rights.
            </li>
            <li>
              Further, Arxen Construction does not warrant or make any representations concerning the accuracy, likely results, 
              or reliability of the use of the materials on its website or otherwise relating to such materials 
              or on any sites linked to this site.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">4. Limitations</h2>
          <p className="text-gray-700 mb-4">
            In no event shall Arxen Construction or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
            the materials on Arxen Construction's website, even if Arxen Construction or an authorized representative has been 
            notified orally or in writing of the possibility of such damage.
          </p>
          <p className="text-gray-700 mb-4">
            Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential 
            or incidental damages, these limitations may not apply to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">5. Revisions and Errata</h2>
          <p className="text-gray-700 mb-4">
            The materials appearing on Arxen Construction's website could include technical, typographical, or photographic errors. 
            Arxen Construction does not warrant that any of the materials on its website are accurate, complete or current. 
            Arxen Construction may make changes to the materials contained on its website at any time without notice. 
            Arxen Construction does not, however, make any commitment to update the materials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">6. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">Email: teamarxen@gmail.com</p>
            <p className="text-gray-700">Phone: 404-934-9458</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 