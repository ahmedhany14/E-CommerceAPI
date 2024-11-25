import nodemailer from 'nodemailer';

class Emails {
    constructor(
        private to: string,
        private from: string,
    ) { }

    private createTransporter() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    private async sendEmail(subject: string, text: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: this.to,
            subject: subject,
            text: text
        };
        const transporter = this.createTransporter();
        await transporter.sendMail(mailOptions);
    }

    public async resetTokenEmail(subject: string, text: string): Promise<void> {
        try {
            await this.sendEmail(subject, text);
            console.log('Email sent');
        }
        catch (error) {
            console.log(error);

            throw new Error('Email not sent');
        }
    }
}

export default Emails;