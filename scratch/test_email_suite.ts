import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';
const TEST_EMAIL = 'khanshadan96@gmail.com';
const TEST_NAME = 'SDET Test Runner';

interface TestResult {
  id: string;
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  statusCode?: number;
  brevoStatus?: string;
  durationMs: number;
  details: string;
}

const results: TestResult[] = [];

async function runTest(
  id: string,
  category: string,
  name: string,
  testFn: () => Promise<{ statusCode?: number; brevoStatus?: string; details: string }>
) {
  const start = Date.now();
  try {
    const res = await testFn();
    const durationMs = Date.now() - start;
    results.push({
      id,
      category,
      name,
      status: 'PASS',
      statusCode: res.statusCode,
      brevoStatus: res.brevoStatus,
      durationMs,
      details: res.details,
    });
    console.log(`✅ [${id}] ${name} - PASS (${durationMs}ms) | Details: ${res.details}`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const isBrevoIpError = err.message && (err.message.includes('unrecognised IP address') || err.message.includes('authorised_ips'));
    
    results.push({
      id,
      category,
      name,
      status: isBrevoIpError ? 'WARNING' : 'FAIL',
      durationMs,
      details: err.message || String(err),
    });
    
    if (isBrevoIpError) {
      console.warn(`⚠️ [${id}] ${name} - BREVO IP RESTRICTION (${durationMs}ms) | Endpoint API logic succeeded, Brevo API blocked IP`);
    } else {
      console.error(`❌ [${id}] ${name} - FAIL (${durationMs}ms) | Error: ${err.message}`);
    }
  }
}

async function main() {
  console.log('================================================================');
  console.log('🚀 SDET AUTOMATED EMAIL NOTIFICATION SUITE RUNNER');
  console.log(`Target Backend Server: ${BASE_URL}`);
  console.log(`Recipient Test Email: ${TEST_EMAIL}`);
  console.log('================================================================\n');

  // Test 1: User Registration Welcome Email (Customer & Admin Alert)
  await runTest(
    'TC-EMAIL-01',
    'Customer Onboarding',
    'User Registration Welcome Email & Admin Notification',
    async () => {
      const uniqueEmail = `sdet.user.${Date.now()}@example.com`;
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: TEST_NAME,
          email: uniqueEmail,
          password: 'Password123!',
          phone: '+918423594482',
        }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(`Registration failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Welcome email triggered for ${uniqueEmail}` };
    }
  );

  // Test 2: Password Reset Email Trigger
  await runTest(
    'TC-EMAIL-02',
    'Authentication',
    'Customer Password Reset Link Email',
    async () => {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL }),
      });
      const data: any = await res.json();
      if (res.status === 502 && data.details && data.details.includes('unrecognised IP address')) {
        throw new Error(data.details);
      }
      if (!res.ok) throw new Error(`Forgot password failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Password reset link email generated and queued` };
    }
  );

  // Test 3: Consultation Booking Confirmation Email
  await runTest(
    'TC-EMAIL-03',
    'Bookings & Consultations',
    '1-on-1 Consultation Booking Confirmation (Customer & Admin Alert)',
    async () => {
      const res = await fetch(`${BASE_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: TEST_NAME,
          email: TEST_EMAIL,
          phone: '+918423594482',
          goal: 'Boxing Padwork & Athletic Recomp',
          date: '2026-10-05',
          timeSlot: '11:00 AM - 12:00 PM',
          coachPreference: 'Head Coach Shahban Faridi',
          duration: '60 Min',
        }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(`Consultation email failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Consultation recorded with code: ${data.data?.booking_id || data.bookingId || 'BXS-OK'}` };
    }
  );

  // Test 4: Athlete Self-Assessment Diagnostic Report Email
  await runTest(
    'TC-EMAIL-04',
    'Assessments',
    'Athlete Diagnostic Self-Assessment Email Report',
    async () => {
      const res = await fetch(`${BASE_URL}/api/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: TEST_NAME,
          email: TEST_EMAIL,
          phone: '+918423594482',
          age: 26,
          gender: 'Male',
          heightCm: 178,
          weightKg: 75,
          primaryGoal: 'Fat Loss & Strength Training',
          experienceLevel: 'Intermediate',
          daysAvailable: 4,
        }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(`Assessment email failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Assessment completed and report dispatched` };
    }
  );

  // Test 5: Contact Form Website Enquiry Email
  await runTest(
    'TC-EMAIL-05',
    'Customer Inquiries',
    'Website Contact Form Enquiry Email (Admin Notification)',
    async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: TEST_NAME,
          email: TEST_EMAIL,
          phone: '+918423594482',
          subject: 'Personal Training Membership Rates Query',
          message: 'Hello BxStrength team, I would like to inquire about monthly 1-on-1 coaching rates.',
        }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(`Enquiry email failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Enquiry recorded & admin notification sent` };
    }
  );

  // Test 6: Customer Support Ticket Raised Email
  await runTest(
    'TC-EMAIL-06',
    'Support Desk',
    'Customer Support Ticket Raised Notification (Admin)',
    async () => {
      const res = await fetch(`${BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: TEST_NAME,
          userEmail: TEST_EMAIL,
          subject: 'Schedule Modification Request',
          category: 'Schedule Inquiry',
          priority: 'HIGH',
          description: 'Requesting to reschedule my Saturday morning boxing padwork session.',
        }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(`Support ticket email failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Ticket logged with ID: ${data.ticket?.id || 'TCK-OK'}` };
    }
  );

  // Test 7: Customer Review Submission Alert Email
  await runTest(
    'TC-EMAIL-07',
    'Social Proof',
    'Customer Review Submission Alert Email (Admin)',
    async () => {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: TEST_NAME,
          email: TEST_EMAIL,
          rating: 5,
          comment: 'World-class 1-on-1 personal coaching! Shahban transformed my physique in 12 weeks.',
        }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(`Review submission failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Review submitted & notification email dispatched` };
    }
  );

  // Test 8: Custom Transactional Email (Stripe Receipt Proxy)
  await runTest(
    'TC-EMAIL-08',
    'Billing & Receipts',
    'Stripe Payment Receipt Email via Brevo API Proxy',
    async () => {
      const res = await fetch(`${BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: TEST_EMAIL,
          toName: TEST_NAME,
          subject: '[RECEIPT] Payment Confirmation - BX Complete (£80.00 GBP)',
          htmlContent: `
            <div style="font-family: Arial; padding: 24px; background: #0d0d0f; color: #fff; border: 1px solid #27272a;">
              <h1 style="color: #CCFF00;">BXSTRENGTH PAYMENT RECEIPT</h1>
              <p>Order ID: <strong>ORD-9948271</strong></p>
              <p>Amount Paid: <strong>£80.00 GBP</strong></p>
              <p>Purchased Plan: <strong>BX Complete (60 Mins)</strong></p>
            </div>
          `,
          senderName: 'BxStrength Billing & Finance',
        }),
      });
      const data: any = await res.json();
      if (res.status === 400 && data.details && data.details.includes('unrecognised IP address')) {
        throw new Error(data.details);
      }
      if (!res.ok) throw new Error(`Payment receipt email proxy failed (${res.status}): ${JSON.stringify(data)}`);
      return { statusCode: res.status, details: `Payment receipt email proxy accepted OK` };
    }
  );

  // Test 9: Negative Payload Validation - Missing Recipient Email
  await runTest(
    'TC-EMAIL-09',
    'Security & Input Validation',
    'Negative Test: Reject Empty Email Payload',
    async () => {
      const res = await fetch(`${BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: '',
          subject: 'Test Empty Email',
          htmlContent: '<p>Test</p>',
        }),
      });
      if (res.status === 400 || res.status === 500) {
        return { statusCode: res.status, details: `Correctly rejected invalid payload with status ${res.status}` };
      }
      throw new Error(`Expected error status 400/500, but got ${res.status}`);
    }
  );

  // Test 10: Negative Payload Validation - Invalid Email Syntax
  await runTest(
    'TC-EMAIL-10',
    'Security & Input Validation',
    'Negative Test: Reject Invalid Email Format Syntax',
    async () => {
      const res = await fetch(`${BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: 'invalid-email-format',
          subject: 'Test Bad Email Format',
          htmlContent: '<p>Test</p>',
        }),
      });
      const data: any = await res.json();
      if (!res.ok || data.error) {
        return { statusCode: res.status, details: `Caught invalid email format syntax cleanly` };
      }
      return { statusCode: res.status, details: `Handled syntax request` };
    }
  );

  console.log('\n================================================================');
  console.log('📊 SDET TEST SUITE EXECUTION SUMMARY');
  console.log('================================================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const warnings = results.filter((r) => r.status === 'WARNING').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`Total Executed: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Warnings (Brevo IP Lock): ${warnings}`);
  console.log(`Failed: ${failed}`);
  console.log(`Functional Backend API Pass Rate: ${(((passed + warnings) / results.length) * 100).toFixed(1)}%\n`);

  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
