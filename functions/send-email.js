const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.co.uk',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'hello@cv-plug.com',
    pass: process.env.SMTP_PASS,
  },
});

function notificationHtml(data) {
  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#94a3b8;white-space:nowrap">${k}</td><td style="padding:6px 12px">${v}</td></tr>`)
    .join('');
  return `
    <div style="font-family:sans-serif;background:#0f172a;color:#e2e8f0;padding:32px">
      <h2 style="color:#C49A2A;margin:0 0 20px">New submission — CV Plug</h2>
      <table style="border-collapse:collapse;width:100%;background:#1e293b;border-radius:8px;overflow:hidden">
        ${rows}
      </table>
      <p style="margin-top:24px;font-size:12px;color:#475569">cv-plug.com · Netlify Function</p>
    </div>`;
}

function confirmationHtml(name, source) {
  const isOrder = source === 'website_order';
  return `
    <div style="font-family:sans-serif;background:#0f172a;color:#e2e8f0;padding:32px;max-width:560px;margin:0 auto">
      <h1 style="color:#C49A2A;font-size:22px;margin:0 0 16px">CV Plug</h1>
      <h2 style="margin:0 0 16px;font-size:18px">Thanks, ${name} — we've got your ${isOrder ? 'order' : 'message'}!</h2>
      ${isOrder
        ? `<p style="color:#94a3b8;line-height:1.6">We'll review your details and be in touch within <strong style="color:#e2e8f0">24 hours</strong> with next steps. Keep an eye on your inbox (and spam folder just in case).</p>`
        : `<p style="color:#94a3b8;line-height:1.6">We'll get back to you within <strong style="color:#e2e8f0">24 hours</strong>. In the meantime, feel free to check our <a href="https://www.cv-plug.com/#faq" style="color:#C49A2A">FAQ</a>.</p>`
      }
      <hr style="border:none;border-top:1px solid #1e293b;margin:28px 0">
      <p style="font-size:12px;color:#475569">CV Plug · Manchester, UK · <a href="https://www.cv-plug.com" style="color:#475569">cv-plug.com</a></p>
    </div>`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, full_name, email, email_address, message, service_type, source } = body;

  const senderName  = name || full_name || 'Unknown';
  const senderEmail = email || email_address || '';
  const isOrder     = source === 'website_order' || !!service_type;

  if (!senderEmail) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Email address is required.' }) };
  }

  const notifData = {
    Source:   isOrder ? 'CV Order' : 'Contact Form',
    Name:     senderName,
    Email:    senderEmail,
    ...(service_type && { 'Service':  service_type }),
    ...(message      && { 'Message':  message }),
    ...Object.fromEntries(
      Object.entries(body).filter(([k]) =>
        !['name','full_name','email','email_address','message','service_type','source'].includes(k) && body[k]
      )
    ),
  };

  console.log('[send-email] invoked', {
    host: process.env.SMTP_HOST || 'smtp.ionos.co.uk',
    port: process.env.SMTP_PORT || '587',
    user: process.env.SMTP_USER || 'hello@cv-plug.com',
    passLen: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
    isOrder,
    senderEmail,
  });

  try {
    await Promise.all([
      transporter.sendMail({
        from:    `"CV Plug Website" <hello@cv-plug.com>`,
        to:      'hello@cv-plug.com',
        subject: isOrder
          ? `New CV order — ${senderName} (${service_type || 'unknown package'})`
          : `New contact enquiry — ${senderName}`,
        html:    notificationHtml(notifData),
      }),
      transporter.sendMail({
        from:    `"CV Plug" <hello@cv-plug.com>`,
        to:      senderEmail,
        subject: isOrder
          ? `We've received your CV order, ${senderName.split(' ')[0]}!`
          : `Thanks for getting in touch, ${senderName.split(' ')[0]}!`,
        html:    confirmationHtml(senderName, isOrder ? 'website_order' : 'website_contact'),
      }),
    ]);

    console.log('[send-email] success — both emails sent');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Emails sent.' }),
    };
  } catch (err) {
    console.error('[send-email] SMTP error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to send email. Please try again or contact us directly.' }),
    };
  }
};
