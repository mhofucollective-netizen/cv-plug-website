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

function checklistHtml() {
  return `
    <div style="font-family:sans-serif;background:#0f172a;color:#e2e8f0;padding:32px;max-width:600px;margin:0 auto">
      <h1 style="color:#C49A2A;font-size:22px;margin:0 0 8px">CV Plug</h1>
      <h2 style="margin:0 0 24px;font-size:20px">Your 10-Point ATS Checklist</h2>
      <p style="color:#94a3b8;line-height:1.6;margin:0 0 24px">Here's the exact checklist we run on every CV before delivery. Work through each point and your chances of passing automated screening will jump significantly.</p>

      <table style="border-collapse:collapse;width:100%;background:#1e293b;border-radius:8px;overflow:hidden;margin-bottom:32px">
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;width:32px;color:#C49A2A;font-weight:700">1</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>Save as .docx or plain PDF</strong><br><span style="color:#94a3b8;font-size:14px">Avoid graphics-heavy PDFs, tables, or text boxes — many ATS systems can't parse them.</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">2</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>Use a single-column layout</strong><br><span style="color:#94a3b8;font-size:14px">Two-column CVs look great to humans but confuse ATS parsers — content gets scrambled.</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">3</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>Match keywords from the job description</strong><br><span style="color:#94a3b8;font-size:14px">Copy exact phrases (not synonyms) from the job posting into your skills and experience sections.</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">4</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>Use standard section headings</strong><br><span style="color:#94a3b8;font-size:14px">"Work Experience", "Education", "Skills" — creative headings like "My Journey" won't be recognised.</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">5</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>No headers, footers, or text boxes</strong><br><span style="color:#94a3b8;font-size:14px">Content inside these elements is often skipped entirely by ATS software.</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">6</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>Include your job title verbatim</strong><br><span style="color:#94a3b8;font-size:14px">Put the exact job title you're applying for near the top of your CV — it's one of the first things scored.</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">7</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>Quantify your achievements</strong><br><span style="color:#94a3b8;font-size:14px">Numbers stand out to both ATS and recruiters: "Increased sales by 32%" beats "Improved sales".</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">8</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>No images, logos, or icons</strong><br><span style="color:#94a3b8;font-size:14px">Visual elements are invisible to ATS and waste space that should contain searchable text.</span></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #0f172a;vertical-align:top;color:#C49A2A;font-weight:700">9</td><td style="padding:14px 16px;border-bottom:1px solid #0f172a"><strong>The 6-second human scan: top third of page 1</strong><br><span style="color:#94a3b8;font-size:14px">If your name, target role, and top 2–3 achievements aren't visible without scrolling, you'll be skipped.</span></td></tr>
        <tr><td style="padding:14px 16px;vertical-align:top;color:#C49A2A;font-weight:700">10</td><td style="padding:14px 16px"><strong>Tailor for every application</strong><br><span style="color:#94a3b8;font-size:14px">A generic CV scores ~30% lower in ATS than a tailored one. Adjust your skills section per role.</span></td></tr>
      </table>

      <div style="background:#1e293b;border-left:3px solid #C49A2A;padding:20px 24px;border-radius:0 8px 8px 0;margin-bottom:32px">
        <p style="margin:0 0 12px;font-weight:600">Want us to do this for you?</p>
        <p style="color:#94a3b8;font-size:14px;margin:0 0 16px;line-height:1.6">Our professional CV writers apply every one of these points — plus tailor your CV to the specific role. From £29, 24-hour turnaround.</p>
        <a href="https://www.cv-plug.com/#pricing" style="display:inline-block;background:#C49A2A;color:#0f172a;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px">See packages →</a>
      </div>

      <hr style="border:none;border-top:1px solid #1e293b;margin:0 0 16px">
      <p style="font-size:12px;color:#475569;margin:0">CV Plug · Manchester, UK · <a href="https://www.cv-plug.com" style="color:#475569">cv-plug.com</a></p>
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

  const { name, full_name, email, email_address, message, service_type, source, cv_file_base64, cv_filename } = body;

  const senderName  = name || full_name || 'Unknown';
  const senderEmail = email || email_address || '';
  const isOrder     = source === 'website_order' || !!service_type;
  const isChecklist = source === 'ats_checklist';

  if (!senderEmail) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Email address is required.' }) };
  }

  // Checklist lead magnet — just send the checklist email, no notification needed
  if (isChecklist) {
    console.log('[send-email] checklist request', { senderEmail });
    try {
      await transporter.sendMail({
        from:    `"CV Plug" <hello@cv-plug.com>`,
        to:      senderEmail,
        subject: 'Your 10-Point ATS Checklist — CV Plug',
        html:    checklistHtml(),
      });
      console.log('[send-email] checklist sent to', senderEmail);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true }) };
    } catch (err) {
      console.error('[send-email] checklist email failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false }) };
    }
  }

  const notifData = {
    Source:   isOrder ? 'CV Order' : 'Contact Form',
    Name:     senderName,
    Email:    senderEmail,
    ...(service_type && { 'Service':  service_type }),
    ...(message      && { 'Message':  message }),
    ...(cv_filename && { 'CV File': cv_filename }),
    ...Object.fromEntries(
      Object.entries(body).filter(([k]) =>
        !['name','full_name','email','email_address','message','service_type','source','cv_file_base64','cv_filename'].includes(k) && body[k]
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

  const cvAttachment = cv_file_base64
    ? [{ filename: cv_filename || 'cv.pdf', content: Buffer.from(cv_file_base64, 'base64') }]
    : [];

  let notifSent = false;
  try {
    await transporter.sendMail({
      from:        `"CV Plug Website" <hello@cv-plug.com>`,
      to:          'hello@cv-plug.com',
      subject:     isOrder
        ? `New CV order — ${senderName} (${service_type || 'unknown package'})`
        : `New contact enquiry — ${senderName}`,
      html:        notificationHtml(notifData),
      attachments: cvAttachment,
    });
    notifSent = true;
  } catch (err) {
    console.error('[send-email] notification email failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }

  let confirmSent = false;
  try {
    await transporter.sendMail({
      from:        `"CV Plug" <hello@cv-plug.com>`,
      to:          senderEmail,
      subject:     isOrder
        ? `We've received your CV order, ${senderName.split(' ')[0]}!`
        : `Thanks for getting in touch, ${senderName.split(' ')[0]}!`,
      html:        confirmationHtml(senderName, isOrder ? 'website_order' : 'website_contact'),
      attachments: cvAttachment,
    });
    confirmSent = true;
  } catch (err) {
    console.error('[send-email] confirmation email failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }

  console.log(`[send-email] done — notif:${notifSent} confirm:${confirmSent}`);

  if (!notifSent) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to send email. Please try again or contact us directly.' }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, message: 'Emails sent.' }),
  };
};
