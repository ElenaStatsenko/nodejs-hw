import nodemailer from 'nodemailer';

const hasSmtpConfig =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;

const brevoTransporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

let etherealTransporter = null;

// Ethereal — фейковий SMTP: лист нікуди не йде, але дає посилання для перегляду
const sendViaEthereal = async (options) => {
  if (!etherealTransporter) {
    const testAccount = await nodemailer.createTestAccount();
    etherealTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  const info = await etherealTransporter.sendMail(options);
  console.log('📧 [Ethereal] Лист не відправлено реально. Перегляд у браузері:');
  console.log('   ' + nodemailer.getTestMessageUrl(info));
  return info;
};

export const sendEmail = async (options) => {
  // Немає налаштувань Brevo — одразу Ethereal
  if (!brevoTransporter) {
    return sendViaEthereal(options);
  }

  // Пробуємо Brevo, при помилці (напр. акаунт ще не активований) — фолбек на Ethereal
  try {
    return await brevoTransporter.sendMail(options);
  } catch (error) {
    console.warn(
      `⚠️  Brevo SMTP не спрацював (${error.message}). Використовую Ethereal.`,
    );
    return sendViaEthereal(options);
  }
};
