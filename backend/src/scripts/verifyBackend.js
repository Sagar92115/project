const http = require('http');
const jwt = require('jsonwebtoken');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5055';
process.env.JWT_SECRET = 'test_secret_key_for_backend_verification_12345';
process.env.JWT_EXPIRES_IN = '1h';

// Require app without starting listener automatically
const app = require('../../server');

function makeRequest(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers
    };
    if (payload) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5055,
        path,
        method,
        headers: reqHeaders
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', (err) => reject(err));

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Backend API Automated Verification Suite...\n');

  const server = app.listen(5055, '127.0.0.1');

  await new Promise((resolve) => server.on('listening', resolve));
  console.log('✅ Test server listening on 127.0.0.1:5055');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await makeRequest('GET', '/api/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'ok', 'GET /api/health returns 200 and status ok');

    // 2. Protected routes without token return 401
    const unauthGet = await makeRequest('GET', '/api/inquiries');
    assert(unauthGet.status === 401, 'GET /api/inquiries without token returns 401 Unauthorized');

    const unauthPatch = await makeRequest('PATCH', '/api/inquiries/123e4567-e89b-12d3-a456-426614174000/status', {}, { status: 'In Progress' });
    assert(unauthPatch.status === 401, 'PATCH /api/inquiries/:id/status without token returns 401 Unauthorized');

    // 3. Protected route with invalid token returns 401
    const invalidTokenRes = await makeRequest('GET', '/api/inquiries', { Authorization: 'Bearer invalid.token.payload' });
    assert(invalidTokenRes.status === 401, 'GET /api/inquiries with invalid token returns 401 Unauthorized');

    // 4. Public Inquiry validation errors
    const invalidInquiry = await makeRequest('POST', '/api/inquiries', {}, {
      user_type: 'InvalidType',
      category: 'FakeCategory',
      name: '',
      email: 'not-an-email',
      phone: '123',
      message: 'short'
    });
    assert(invalidInquiry.status === 400 && invalidInquiry.body.errors?.length >= 5, 'POST /api/inquiries catches validation errors (user_type, category, name, email, phone, message)');

    // 5. Public Inquiry phone validation (must be 10 digits)
    const badPhoneInquiry = await makeRequest('POST', '/api/inquiries', {}, {
      user_type: 'Parent',
      category: 'Admission',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '12345',
      message: 'I am interested in admission details.'
    });
    assert(badPhoneInquiry.status === 400 && JSON.stringify(badPhoneInquiry.body).includes('Phone number must be exactly 10 digits'), 'POST /api/inquiries validates 10-digit phone requirement');

    // 6. Admin Login validation
    const badLogin = await makeRequest('POST', '/api/auth/login', {}, { email: 'notanemail', password: '' });
    assert(badLogin.status === 400, 'POST /api/auth/login validates required fields');

    // 7. Verify valid JWT token authentication middleware with custom token
    const mockToken = jwt.sign(
      { id: '11111111-2222-3333-4444-555555555555', email: 'admin@k12hunar.com' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const meRes = await makeRequest('GET', '/api/auth/me', { Authorization: `Bearer ${mockToken}` });
    assert(meRes.status === 200 && meRes.body.admin.email === 'admin@k12hunar.com', 'GET /api/auth/me decodes and authenticates valid custom JWT successfully');

    // 8. 404 Route handling
    const notFoundRes = await makeRequest('GET', '/api/nonexistent-endpoint');
    assert(notFoundRes.status === 404, 'Unknown endpoint returns 404 Not Found');

    console.log(`\nVerification Summary: ${passed} passed, ${failed} failed`);
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All backend tests passed successfully!\n');
    process.exit(0);
  }
}

runTests();
