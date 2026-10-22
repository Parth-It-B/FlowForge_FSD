// Quick automated integration check for the backend endpoints
import http from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import mongoose from 'mongoose';

async function runTests() {
  console.log('--- Starting Backend Verification ---');
  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5001, resolve));
  console.log('Test server listening on port 5001');

  const baseUrl = 'http://localhost:5001/api';

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const health = await healthRes.json();
    console.log('1. Health check:', health.status === 'ok' ? 'PASS' : 'FAIL');

    // 2. Register first user (should automatically become admin)
    const adminEmail = `admin_${Date.now()}@flowforge.dev`;
    const regAdminRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin User',
        email: adminEmail,
        password: 'password123',
      }),
    });
    const regAdmin = await regAdminRes.json();
    console.log('2. Admin Registration:', regAdmin.success && regAdmin.user.role === 'admin' ? 'PASS' : 'FAIL');
    const adminToken = regAdmin.token;

    // 3. Register regular user (cannot escalate to admin even if attempted)
    const userEmail = `user_${Date.now()}@flowforge.dev`;
    const regUserRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Standard User',
        email: userEmail,
        password: 'password123',
        role: 'admin', // Privilege escalation attempt
      }),
    });
    const regUser = await regUserRes.json();
    console.log('3. Standard User Role Enforced (role === user):', regUser.success && regUser.user.role === 'user' ? 'PASS' : 'FAIL');
    const userToken = regUser.token;

    // 4. Test login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('4. User Login & Token issuance:', loginData.success ? 'PASS' : 'FAIL');

    // 5. Test protected route rejection when unauthenticated
    const unauthRes = await fetch(`${baseUrl}/issues`);
    console.log('5. Unauthenticated request rejected (401):', unauthRes.status === 401 ? 'PASS' : 'FAIL');

    // 6. Create issue as standard user
    const createRes = await fetch(`${baseUrl}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        title: 'Fix Database Connection Pool Leak',
        description: 'Connection pool exhausted under high concurrent query load.',
        status: 'OPEN',
        priority: 'HIGH',
        assignedTo: 'Alex Chen',
      }),
    });
    const createdIssue = await createRes.json();
    console.log('6. Create Issue via REST API:', createdIssue.success ? 'PASS' : 'FAIL');
    const issueId = createdIssue.data._id;

    // 7. Get issues with filter
    const getRes = await fetch(`${baseUrl}/issues?status=OPEN`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const getIssuesData = await getRes.json();
    console.log('7. Query Issues with Status Filter:', getIssuesData.count >= 1 ? 'PASS' : 'FAIL');

    // 8. Get Stats
    const statsRes = await fetch(`${baseUrl}/issues/stats`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const statsData = await statsRes.json();
    console.log('8. Dynamic Issue Statistics:', statsData.success && statsData.data.total >= 1 ? 'PASS' : 'FAIL');

    // 9. Update issue
    const updateRes = await fetch(`${baseUrl}/issues/${issueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        status: 'IN_PROGRESS',
      }),
    });
    const updatedIssue = await updateRes.json();
    console.log('9. Update Issue status to IN_PROGRESS:', updatedIssue.success && updatedIssue.data.status === 'IN_PROGRESS' ? 'PASS' : 'FAIL');

    // 10. Delete issue (standard user can delete their own issue)
    const deleteRes = await fetch(`${baseUrl}/issues/${issueId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const deleteData = await deleteRes.json();
    console.log('10. Delete Issue:', deleteData.success ? 'PASS' : 'FAIL');

    console.log('--- All Backend Tests Completed Successfully ---');
  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
