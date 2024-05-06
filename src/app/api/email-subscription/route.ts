import { NextResponse, NextRequest } from 'next/server'
import { AccountApi, AccountApiApiKeys, SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"
import { EmailTemplate } from '@/lib/Email-template';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        let apiInstance = new AccountApi()
        apiInstance.setApiKey(AccountApiApiKeys.apiKey, process.env.BREVO_KEY!)
        let sendSmtpEmail = new SendSmtpEmail()

        sendSmtpEmail.subject = "Subscribe to email list"
        sendSmtpEmail.htmlContent = EmailTemplate(body.firstName, body.lastName, body.email, body.message)
        sendSmtpEmail.sender = { "name": "Convo Docs", "email": "convodocs7@gmail.com" }
        sendSmtpEmail.to = [{ "name": "Convo Docs", "email": "convodocs7@gmail.com" }]
        sendSmtpEmail.headers = { "Authentication": process.env.BREVO_KEY! }

        let transacEmailAPI = new TransactionalEmailsApi()
        transacEmailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_KEY!)
        return transacEmailAPI.sendTransacEmail(sendSmtpEmail).then((response) => {
            return Response.json(response)
        },
            (error) => {
                console.log("Sending email failed, error: ", error)
            })
    } catch (error) {
        return NextResponse.error()
    }
}


/*
Documentation for Brevo - https://www.npmjs.com/package/@getbrevo/brevo
*/