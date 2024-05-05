import Footer from "@/components/Footer"
import Link from "next/link"

const Page = () => {
    return (
        <>
            <div className="terms-of-service m-auto w-[80%] mt-10">
                <h1 className="mb-7 text-3xl font-bold">Privacy Policy</h1>
                <div className="mb-10">
                    <p className="mb-5">
                        This Privacy Policy describes how ConvoDocs (&quote;we&quote;, &quote;us&quote;, or &quote;our&quote;) collects, uses, and shares information when you use our website ConvoDocs (&quote;convodocs.com&quote;).
                    </p>
                    <div className="mb-10">
                        <h2 className="font-bold mb-2">1. Information We Collect</h2>
                        <p className="mb-7">Personal Information: When you use the Website, we may collect certain personally identifiable information, such as your name, email address, and any other information you provide when interacting with the Website.
                            Uploaded Content: We may collect and store the PDF and text files you upload to the Website in order to provide you with the services offered.
                            Usage Data: We may also collect information about your interaction with the Website, such as your IP address, browser type, operating system, and other usage details.</p>

                        <h2 className="font-bold mb-2">2. Use of Information</h2>
                        We may use the information we collect for various purposes, including:
                        <ul>
                            <li>To provide and maintain the Website;</li>
                            <li>To personalize your experience on the Website;</li>
                            <li>To communicate with you about your account or our services;</li>
                            <li>To analyze how the Website is used and improve our services;</li>
                            <li>To detect, prevent, and address technical issues.</li>
                        </ul>

                        <h2 className="font-bold mb-2">3. Sharing of Informationy</h2>
                        <p className="mb-7">
                            We may share your information with third parties under the following circumstances: <br />
                            With service providers who assist us in operating the Website or providing services to you;<br />
                            When required by law or to protect our rights or the rights of others; <br />
                            In connection with a merger, acquisition, or sale of assets.
                        </p>

                        <h2 className="font-bold mb-2">4. Data Retention</h2>
                        <p className="mb-7">
                            We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law.
                        </p>

                        <h2 className="font-bold mb-2">5. Security</h2>
                        <p className="mb-7">
                            We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, please be aware that no method of transmission over the internet or electronic storage is completely secure.
                        </p>

                        <h2 className="font-bold mb-2">6. Third-Party Links</h2>
                        <p className="mb-7">
                            The Website may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                        </p>

                        <h2 className="font-bold mb-2">7. Children&apos;s Privacy</h2>
                        <p className="mb-7">
                            The Website is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete the information.
                        </p>

                        <h2 className="font-bold mb-2">8. Changes to This Privacy Policy</h2>
                        <p className="mb-7">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                        </p>

                        <h2 className="font-bold mb-2">9. Contact Us</h2>
                        <p className="mb-7">
                            If you have any questions about this Privacy Policy, please contact us at <Link href="/contact-us" className="text-blue-600 underline">ConvoDocs</Link>.
                        </p>
                    </div>
                    <p className="mb-5">
                        By using the Website, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
                    </p>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Page