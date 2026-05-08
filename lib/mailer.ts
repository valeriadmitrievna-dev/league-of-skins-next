import { getT, initServerI18next } from 'next-i18next/server';
import nodemailer from "nodemailer";

import i18nConfig from '@/i18n.config';

const transporter = nodemailer.createTransport({
  host: "smtp.timeweb.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

initServerI18next(i18nConfig);

export const sendVerificationEmail = async (to: string, token: string, from?: string) => {
  const { t } = await getT('email-verification')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const link = `${baseUrl}/auth/verify-email?token=${token}${from ? `&from=${encodeURIComponent(from)}` : ''}`;

  await transporter.sendMail({
    from: `"League of Skins" <${process.env.SMTP_USER}>`,
    to,
    subject: t('title'),
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          h2 { margin-bottom: 8px; }
        </style>
        <h2>${t('title')}</h2>
        <p style="margin-bottom: 8px">${t('email-body')}</p>
        <p style="margin-bottom: 8px">${t('email-action')}</p>
        <a href="${link}" style="
          display: inline-block;
          margin-top: 16px;
          padding: 12px 20px;
          background: oklch(0.72 0.13 75);
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          line-height: 1;
        ">${t('email-button')}</a>
        <p style="margin-top: 24px; color: #888; font-size: 13px;">
          ${t('email-ignore')}
        </p>
      </div>
    `,
  });
};