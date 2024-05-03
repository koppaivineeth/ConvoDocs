import { NextResponse, NextRequest } from 'next/server'
import { AccountApi, AccountApiApiKeys, SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"
import { EmailTemplate } from '@/lib/Email-template';

export async function getBrevoDetails() {
    let apiInstance = new AccountApi()
    apiInstance.setApiKey(AccountApiApiKeys.apiKey, process.env.BREVO_KEY!)

    apiInstance.getAccount().then((data) => {
        console.log("Brevo API called successfully. Returned data: ", JSON.stringify(data))
    },
        (error) => {
            console.log("Brevo API faileed, returned error: ", error)
        })
}
export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        let apiInstance = new AccountApi()
        apiInstance.setApiKey(AccountApiApiKeys.apiKey, process.env.BREVO_KEY!)
        let sendSmtpEmail = new SendSmtpEmail()

        sendSmtpEmail.subject = "Message from ConvoDocs.com"
        sendSmtpEmail.htmlContent = EmailTemplate(body.firstName, body.lastName, body.email, body.message)
        console.log("emailTemplae = ", sendSmtpEmail.htmlContent)
        sendSmtpEmail.sender = { "name": "Convo Docs", "email": "convodocs7@gmail.com" }
        sendSmtpEmail.to = [{ "name": "Convo Docs", "email": "convodocs7@gmail.com" }]
        sendSmtpEmail.headers = { "Authentication": process.env.BREVO_KEY! }

        let transacEmailAPI = new TransactionalEmailsApi()
        transacEmailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_KEY!)
        console.log("HERE === ", transacEmailAPI.sendTransacEmail(sendSmtpEmail))
        return transacEmailAPI.sendTransacEmail(sendSmtpEmail).then((response) => {
            console.log("Email sent successfully, data: ", response)
            return Response.json(response)
        },
            (error) => {
                console.log("Sending email failed, error: ", error)
            })
    } catch (error) {
        console.log("Mail error = ", error)
        return NextResponse.error()
    }
}


/*
Documentation for Brevo - https://www.npmjs.com/package/@getbrevo/brevo
*/