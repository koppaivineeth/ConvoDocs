import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    lastName: string;
    userEmail: string;
    message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    lastName,
    userEmail,
    message
}) => (
    <div>
        <span>First Name: {firstName}</span>
        <span>Last Name: {lastName}</span>
        <span>Email: {userEmail}</span>
        <span>Message: {message}</span>
    </div>
);
