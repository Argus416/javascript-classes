require("dotenv").config();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const juice = require("juice");

class Mailer {
	transporter = {
		host: process.env.NODEMAILER_HOST,
		port: process.env.NODEMAILER_PORT,
		secure: true,
		logger: true,
		auth: {
			user: process.env.NODEMAILER_EMAIL,
			pass: process.env.NODEMAILER_EMAIL_PASSWORD,
		},
	};

	sendCopyTo = "info@mayak-conseil.com";
	sentFrom = process.env.NODEMAILER_EMAIL;

	constructor() {}

	getTemplate(template, variables = {}) {
		// * Get template
		const emailTemplate = fs.readFileSync(path.join(__dirname, `templates/${template}/index.hbs`), "utf8").toString();
		const cssOfEmail = fs.readFileSync(path.join(__dirname, `templates/${template}/style.css`), "utf8").toString();

		// * Compile html into hbs
		const htmlToHbs = handlebars.compile(emailTemplate);

		// * Parse variables, exp= variables.message = "Hello world"
		const htmlVaribales = htmlToHbs(variables);

		// * Inline css in html
		const htmlAndCss = juice.inlineContent(htmlVaribales, cssOfEmail);
		// console.log(htmlAndCss)
		return htmlAndCss;
	}

	sendEmail(reception = [], subject, template) {
		if (reception.length) {
			const Transport = nodemailer.createTransport(this.transporter);

			reception.forEach((user) => {
				const mailOptions = {
					cc: this.sendCopyTo,
					to: `${user}`,
					from: process.env.NODEMAILER_EMAIL,
					subject: subject,
					html: this.getTemplate(template),
				};

				Transport.sendMail(mailOptions, (error, response) => {
					if (error === null) {
						console.log(`Email sent`);
					} else {
						console.log(`Email wasn't sent, code error ${error}`);
					}
				});
			});
		} else {
			throw new Error(`sendTo params is empty, length : ${reception}`);
		}
	}
}

const mailer = new Mailer();
const mails = ["mohamad.alkhatib.cdawch@gmail.com", "mohamad.alkhatib.disii@gmail.com", "dev.chartres@gmail.com"];

mailer.sendEmail(mails, "sent from the class", "create-account");
// const emailTemplate = fs.readFileSync(path.join(__dirname, "templates/frigo/index.hbs"), "utf8").toString();
// const cssOfEmail = fs.readFileSync(path.join(__dirname, "templates/frigo/style.css"), "utf8").toString();

// const template = handlebars.compile(emailTemplate);
// const htmlVaribales = template({ message: "Hello world" });

// const htmlAndCss = juice.inlineContent(htmlVaribales, cssOfEmail);
// console.log(htmlAndCss);

// const Transport = nodemailer.createTransport({
// 	host: process.env.NODEMAILER_HOST,
// 	port: process.env.NODEMAILER_PORT,
// 	secure: true,
// 	auth: {
// 		user: process.env.NODEMAILER_EMAIL,
// 		pass: process.env.NODEMAILER_EMAIL_PASSWORD,
// 	},
// });

// const mailOptions = {
// 	cc: "info@mayak-conseil.com",
// 	to: `mohamad.alkhatib.cdawch@gmail.com`,
// 	from: process.env.NODEMAILER_EMAIL,
// 	subject: "email de test",
// 	html: htmlAndCss,
// };

// Transport.sendMail(mailOptions, (error, response) => {
// 	if (error === null) {
// 		console.log(response);
// 		console.log(`Email sent`);
// 	} else {
// 		console.log(`Email wasn't sent, code error ${error}`);
// 	}
// });
