/**
 * Email Service
 * Handles sending email notifications for club approval/rejection
 * 
 * Note: This is a placeholder implementation. In production, you would integrate
 * with a real email service like:
 * - Resend (https://resend.com)
 * - SendGrid (https://sendgrid.com)
 * - AWS SES
 * - Supabase Edge Functions with postmark/mailgun
 */

export class EmailService {
  /**
   * Send an email notification when a club is approved
   */
  async sendClubApprovalEmail(studentEmail: string, clubName: string): Promise<void> {
    // In production, integrate with your email provider here
    console.log(`[EMAIL] Sending approval email to ${this.maskEmail(studentEmail)}`);
    console.log(`Subject: Your club "${clubName}" has been approved!`);
    console.log(`Body: Congratulations! Your club "${clubName}" has been approved and is now visible to all students.`);
    
    // TODO: Replace with actual email sending logic using a secure templating library
    // Example with Resend and a templating library (e.g., react-email, handlebars) to prevent XSS:
    // 
    // const html = renderEmailTemplate('club-approval', { 
    //   clubName: clubName // Ensure this is properly escaped by the template engine
    // });
    //
    // await resend.emails.send({
    //   from: 'EagleConnect <noreply@eagleconnect.edu>',
    //   to: studentEmail,
    //   subject: `Your club "${clubName}" has been approved!`, // Subject lines are plain text
    //   html: html
    // });
    //
    // WARNING: Do NOT interpolate user-controlled strings directly into HTML without escaping.
    // e.g. `...${clubName}...` directly in HTML is vulnerable to XSS.
  }

  /**
   * Send an email notification when a club is rejected
   */
  async sendClubRejectionEmail(studentEmail: string, clubName: string, reason: string): Promise<void> {
    // In production, integrate with your email provider here
    console.log(`[EMAIL] Sending rejection email to ${this.maskEmail(studentEmail)}`);
    console.log(`Subject: Update on your club "${clubName}" application`);
    console.log(`Body: Unfortunately, your club "${clubName}" was not approved. Reason: ${reason}`);
    
    // TODO: Replace with actual email sending logic using a secure templating library
    // Example with Resend and a templating library (e.g., react-email, handlebars) to prevent XSS:
    //
    // const html = renderEmailTemplate('club-rejection', { 
    //   clubName: clubName,
    //   reason: reason // Ensure user input is escaped
    // });
    //
    // await resend.emails.send({
    //   from: 'EagleConnect <noreply@eagleconnect.edu>',
    //   to: studentEmail,
    //   subject: `Update on your club "${clubName}" application`,
    //   html: html
    // });
    //
    // WARNING: Use a sanitizer (like DOMPurify) if you must insert raw strings.
  }

  /**
   * Send an email notification when a club is deactivated
   */
  async sendClubDeactivationEmail(studentEmail: string, clubName: string): Promise<void> {
    // In production, integrate with your email provider here
    console.log(`[EMAIL] Sending deactivation email to ${this.maskEmail(studentEmail)}`);
    console.log(`Subject: Your club "${clubName}" has been deactivated`);
    console.log(`Body: Your club "${clubName}" has been deactivated by a university administrator.`);
    
    // TODO: Replace with actual email sending logic using secured templates
    // Follow the same security practices as above (escaping/templating).
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***@***.***';
    const maskedLocal = local.length > 2 ? `${local.slice(0, 2)}***` : '***';
    return `${maskedLocal}@${domain}`;
  }
}
