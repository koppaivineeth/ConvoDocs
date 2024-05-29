import Link from 'next/link'
import { cn } from "@/lib/utils";
import moment from 'moment';
import { Copyright } from "lucide-react";

const Footer = ({ customClass }) => {
    return (
        <>
            <div className='bg-white'>
                <div className={cn('home-footer border-t border-slate-200 p-5 mx-auto flex justify-between select-none', customClass)}>
                    <div className='pl-16 max-w-3xl w-1/2'>
                        <h1 className='font-bold mb-2'>ConvoDocs</h1>
                        <p>
                            ConvoDocs is a tool that allows user to understand the document, PDF/text.
                            We will analyse your big file, you can ask for any doubts.
                        </p>
                    </div>
                    <div className=''>
                        <div className='flex justify-end pl-16'>
                            <ul>
                                <h1 className='font-bold mb-5'>Resources</h1>
                                <li><Link href="/contact-us">Contact Us</Link></li>
                                <li><Link href="/terms-of-service">Terms of Service</Link></li>
                                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div className='select-none'></div>
                    </div>
                </div>
                <div className='copy-right text-center pb-10 pt-10'>
                    <Copyright className='h-4 w-4 inline-block' /> <span className='text-sm'>{moment().year()} convodocs.com. All rights reserved.</span>
                </div>
            </div>
        </>
    )
}

export default Footer
