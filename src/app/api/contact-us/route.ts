import { NextResponse, NextRequest } from 'next/server'

// export const POST = async (req: NextRequest) => {
//     // const body = await req.json()
//     console.log("BODY = ", req.body)
//     return new Response("Success", {
//         status: 200,
//     })
// }

import { EmailTemplate } from '@/components/Email-template';
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
const nodemailer = require('nodemailer');

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("API body", req.body)
        console.log("API body", res)
        let body = req.body
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "ConvoDocs",
                pass: "wthq ohoc todq yngj"
            }
        });
        // const { data, error } = await resend.emails.send({
        //     from: 'ConvoDocs<convodocs@gmail.com>',
        //     to: ['convodocs@gmail.com'],
        //     subject: 'Contact us',
        //     text: "",
        //     react: EmailTemplate({ firstName: body.firstName, lastName: body.lastName, userEmail: body.email, message: body.message }),
        // });
        const mail = await transporter.sendMail({
            from: "convodocs7@gmail.com",
            to: 'convodocs7@gmail.com',
            // replyTo: email,
            subject: `Contact form`,
            html: `
            <p>Name: ${body.firstName} ${body.lastName}</p>
            <p>Email: ${body.email} </p>
            <p>Message: ${body.message} </p>
            `,
        })

        return NextResponse.json({ message: "Success: email was sent" })
    } catch (error) {
        console.log("Mail error = ", error)
        return NextResponse.error()
    }
}
