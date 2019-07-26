import * as nodemailer from 'nodemailer';

class Mailer {
	private transporter = nodemailer.createTransport({
		host: 'smtp.zoho.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.ZOHO_APPLICATION_MAIL,
			pass: process.env.ZOHO_APPLICATION_PASSWORD
		}
	});

	public async send(to: string, subject: string, html: string) {
		await this.transporter.sendMail({
			from: process.env.ZOHO_APPLICATION_MAIL,
			to,
			subject,
			html
		});
	}
}

const mailer = new Mailer();

export default mailer;
