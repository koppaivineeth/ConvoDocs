import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import {
    LoginLink,
    RegisterLink,
    getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from 'lucide-react'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'
import Image from "next/image"
import Logo from "../../public/logo.png"
import globals from "@/lib/utils"

const Navbar = async () => {
    const { getUser } = getKindeServerSession()

    const user = await getUser()

    return (
        <nav className='sticky h-auto inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all pt-5 pb-2'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between'>
                    <Link
                        href='/'
                        className='flex z-40 font-semibold'>
                        <span>
                            <Image src={Logo} alt="Site Logo" className='w-14 h-14 inline mr-2' />
                            ConvoDocs
                        </span>
                    </Link>
                    {
                        globals.productLaunched ? (
                            <>
                                <MobileNav isAuth={!!user} />

                                <div className='hidden items-center space-x-4 sm:flex'>
                                    {!user ? (
                                        <>
                                            <Link
                                                href='/pricing'
                                                className={buttonVariants({
                                                    variant: 'ghost',
                                                    size: 'sm',
                                                })}>
                                                Pricing
                                            </Link>
                                            <LoginLink
                                                className={buttonVariants({
                                                    variant: 'ghost',
                                                    size: 'sm',
                                                })}>
                                                Sign in
                                            </LoginLink>
                                            <RegisterLink
                                                className={buttonVariants({
                                                    size: 'sm',
                                                })}>
                                                Get started{' '}
                                                <ArrowRight className='ml-1.5 h-5 w-5' />
                                            </RegisterLink>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href='/dashboard'
                                                className={buttonVariants({
                                                    variant: 'ghost',
                                                    size: 'sm',
                                                })}>
                                                Dashboard
                                            </Link>
                                            <UserAccountNav
                                                name={
                                                    !user.given_name || !user.family_name
                                                        ? 'Your Account'
                                                        : `${user.given_name} ${user.family_name}`
                                                }
                                                email={user.email ?? ''}
                                                imageUrl=''
                                            />
                                        </>
                                    )}
                                </div>
                            </>
                        ) : null
                    }

                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar