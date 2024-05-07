export function EmailTemplate(
    firstName: string,
    lastName: string,
    email: string,
    message: string
) {
    return `
        <html>
            <body>
                <div style="margin-bottom:10px; font-weight:bold">This is a message from a website visitor</div>
                <div>
                    <div style="margin-bottom:5px;"><label style="font-weight:500; font-size:0.875rem">First Name:</label> ${firstName}</div>
                    <div style="margin-bottom:5px;"><label style="font-weight:500; font-size:0.875rem">Last Name:</label> ${lastName}</div>
                    <div style="margin-bottom:5px;"><label style="font-weight:500; font-size:0.875rem">Email:</label> ${email}</div>
                    <div style="margin-bottom:5px;"><label style="font-weight:500; font-size:0.875rem">Message:</label><p>${message}</p></div>
                </div>
            </body>
        </html>
        `
};

export function EmailSubscriptionTemplate(
    email: string,
    message: string
) {
    return `
        <html>
            <body>
                <div style="margin-bottom:10px; font-weight:bold">Subscribing to email list</div>
                <div>
                    <div style="margin-bottom:5px;"><label style="font-weight:500; font-size:0.875rem">Email:</label> ${email}</div>
                    <div style="margin-bottom:5px;"><label style="font-weight:500; font-size:0.875rem">Message:</label><p>${message}</p></div>
                </div>
            </body>
        </html>
        `
};
