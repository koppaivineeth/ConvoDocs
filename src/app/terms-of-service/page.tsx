import Footer from "@/components/Footer"
import Link from "next/link"

const Page = () => {
    return (
        <>
            <div className="terms-of-service m-auto w-[80%] mt-10">
                <h1 className="mb-7 text-3xl font-bold">Terms of Service</h1>
                <div className="mb-10">
                    <p className="mb-5">
                        These Terms of Service (&quot;Terms&quot;) govern your access to and use of ConvoDocs (&quot;the Website&quot;), including any content, functionality, and services offered on or through the Website.
                        By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Website.
                    </p>
                    <div>
                        <h2 className="font-bold mb-2">1. Description of Service</h2>
                        <p className="mb-7">The Website provides users with the ability to upload PDF and text files, and engage in conversation with the uploaded documents using OpenAI technology. Users can upload files with a size limit of up to 4 MB, with a free version allowing for a maximum of 10 PDF uploads per month, each with a maximum of 5 pages.</p>

                        <h2 className="font-bold mb-2">2. User Conduct</h2>
                        <p className="mb-7">
                            You agree to use the Website only for lawful purposes and in accordance with these Terms. You further agree not to:
                            <br />
                            Upload any content that is illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable.
                            Upload any content that infringes upon the intellectual property rights of others.
                            Attempt to gain unauthorized access to the Website or any part of it.
                            Use the Website in any manner that could disable, overburden, damage, or impair the Website or interfere with any other party&aps;s use of the Website.
                        </p>

                        <h2 className="font-bold mb-2">3. Intellectual Property</h2>
                        <p className="mb-7">
                            All content on the Website, including but not limited to text, graphics, logos, button icons, images, audio clips, and software, is the property of ConvoDocs or its licensor and is protected by copyright, trademark, and other laws.
                        </p>

                        <h2 className="font-bold mb-2">4. Limitation of Liability</h2>
                        <p className="mb-7">
                            In no event shall ConvoDocs or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of the Website.
                        </p>

                        <h2 className="font-bold mb-2">5. Modifications to Terms</h2>
                        <p className="mb-7">
                            ConvoDocs reserves the right to modify or replace these Terms at any time. Your continued use of the Website after any such changes constitutes your acceptance of the new Terms.
                        </p>

                        <h2 className="font-bold mb-2">6. Termination</h2>
                        <p className="mb-7">
                            ConvoDocs may terminate or suspend your access to the Website at any time, without prior notice or liability, for any reason whatsoever.
                        </p>

                        <h2 className="font-bold mb-2">7. Governing Law</h2>
                        <p className="mb-7">
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>

                        <h2 className="font-bold mb-2">8. Contact Information</h2>
                        <p className="mb-7">
                            If you have any questions about these Terms, please contact us at <Link href="/contact-us" className="text-blue-600 underline">ConvoDocs</Link>.
                            By using the Website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Website.
                        </p>

                        <h2 className="font-bold mb-2">9. User Registration</h2>
                        <p className="mb-7">
                            You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Page