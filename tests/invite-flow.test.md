# Invite Flow Integration Tests

This document outlines the integration tests for the club creation and invite functionality.

## Test Setup

Before running tests, ensure:
- Database is seeded with test data
- Test users are created
- Authentication tokens are available

## Test Suite 1: Club Creation with Invite Generation

### Test 1.1: Create Club Successfully
**Given:** An authenticated student
**When:** They submit a valid club creation form
**Then:**
- Club is created in the database
- Student is set as admin
- Student is added as active member
- Invite token is generated
- Invite token is stored in database
- Response includes club details and invite token

**Test Steps:**
1. Authenticate as test user
2. POST /api/clubs with valid data:
   ```json
   {
     "name": "Test Club",
     "description": "A test club",
     "category": "Technology",
     "coverPhotoUrl": "https://example.com/image.jpg"
   }
   ```
3. Verify response status is 201
4. Verify response includes clubId and inviteToken
5. Query database to confirm club exists
6. Query database to confirm invite_tokens record exists
7. Query database to confirm membership exists with status 'active'

### Test 1.2: Create Club with Minimum Required Fields
**Given:** An authenticated student
**When:** They submit a club creation form with only required fields
**Then:**
- Club is created successfully
- Optional fields are null
- Invite token is still generated

**Test Steps:**
1. Authenticate as test user
2. POST /api/clubs with minimal data:
   ```json
   {
     "name": "Minimal Club",
     "category": "Academic"
   }
   ```
3. Verify response status is 201
4. Verify description and coverPhotoUrl are null
5. Verify invite token is present

### Test 1.3: Create Club with Invalid Data
**Given:** An authenticated student
**When:** They submit invalid club data
**Then:**
- Request is rejected with validation errors
- No club is created
- No invite token is generated

**Test Steps:**
1. Authenticate as test user
2. POST /api/clubs with invalid data:
   ```json
   {
     "name": "AB",
     "category": ""
   }
   ```
3. Verify response status is 400
4. Verify error messages indicate validation failures
5. Verify no club was created in database

## Test Suite 2: Invite Link Generation

### Test 2.1: Get Invite Link as Admin
**Given:** A club admin
**When:** They request the invite link for their club
**Then:**
- Existing invite token is returned
- Full invite URL is provided

**Test Steps:**
1. Create a club as test user
2. GET /api/clubs/{clubId}/invite
3. Verify response status is 200
4. Verify response includes inviteUrl and token
5. Verify inviteUrl format: `{baseUrl}/invites/{token}`
6. Verify token is 64 characters

### Test 2.2: Get Invite Link as Non-Admin
**Given:** A non-admin student
**When:** They try to access invite link for a club
**Then:**
- Request is rejected with 403 Forbidden

**Test Steps:**
1. Create a club as user A
2. Authenticate as user B
3. GET /api/clubs/{clubId}/invite
4. Verify response status is 403
5. Verify error message indicates insufficient permissions

### Test 2.3: Get Invite Link for Non-Existent Club
**Given:** An authenticated student
**When:** They request invite link for non-existent club
**Then:**
- Request is rejected with 404 Not Found

**Test Steps:**
1. Authenticate as test user
2. GET /api/clubs/00000000-0000-0000-0000-000000000000/invite
3. Verify response status is 404
4. Verify error message indicates club not found

## Test Suite 3: Join via Invite Token

### Test 3.1: Join Club with Valid Token
**Given:** An authenticated student with a valid invite token
**When:** They access the invite link
**Then:**
- Student is added to club with active status
- Success message is displayed
- Student is redirected to club page

**Test Steps:**
1. Create a club as user A and get invite token
2. Authenticate as user B
3. POST /api/invites/{token}/join
4. Verify response status is 200
5. Verify response includes clubId and membership details
6. Query database to confirm membership exists with status 'active'
7. Verify user B can access club details

### Test 3.2: Join Club with Invalid Token
**Given:** An authenticated student
**When:** They use an invalid invite token
**Then:**
- Request is rejected with 404 Not Found
- Error message indicates invalid token
- No membership is created

**Test Steps:**
1. Authenticate as test user
2. POST /api/invites/invalidtoken123/join
3. Verify response status is 404
4. Verify error message indicates invalid token
5. Verify no membership was created

### Test 3.3: Join Club Already a Member
**Given:** An authenticated student who is already a member
**When:** They try to join via invite link again
**Then:**
- Request is rejected with 409 Conflict
- Error message indicates already a member
- Existing membership is unchanged

**Test Steps:**
1. Create a club as user A and get invite token
2. Authenticate as user B
3. POST /api/invites/{token}/join (first time)
4. Verify successful join
5. POST /api/invites/{token}/join (second time)
6. Verify response status is 409
7. Verify error message indicates already a member
8. Query database to confirm only one membership exists

### Test 3.4: Join Club Without Authentication
**Given:** An unauthenticated user
**When:** They try to access an invite link
**Then:**
- Request is rejected with 401 Unauthorized
- User is redirected to login page
- Invite token is preserved in return URL

**Test Steps:**
1. Create a club and get invite token
2. Clear authentication
3. GET /invites/{token}
4. Verify redirect to /login
5. Verify returnUrl parameter includes invite token

### Test 3.5: Multiple Users Join Same Club
**Given:** Multiple authenticated students with same invite token
**When:** They all join via the invite link
**Then:**
- All students are added as active members
- Same invite token works for all users
- Club member count increases correctly

**Test Steps:**
1. Create a club as user A and get invite token
2. Authenticate as user B and join
3. Authenticate as user C and join
4. Authenticate as user D and join
5. Verify all three users have active memberships
6. Verify club member count is 4 (admin + 3 members)

## Test Suite 4: End-to-End Workflows

### Test 4.1: Complete Club Creation and Invite Workflow
**Scenario:** Admin creates club and invites members

**Test Steps:**
1. User A registers and logs in
2. User A creates a new club
3. Verify club creation success
4. User A navigates to club detail page
5. Verify invite section is visible (admin only)
6. User A copies invite link
7. User B accesses invite link
8. Verify redirect to login (if not authenticated)
9. User B logs in
10. Verify automatic join process
11. Verify redirect to club page
12. Verify User B appears in members list
13. Verify User B does not see invite section (not admin)

### Test 4.2: Invite Link Sharing Workflow
**Scenario:** Multiple users join via shared link

**Test Steps:**
1. Admin creates club and gets invite link
2. Share invite link with 5 users
3. All 5 users access link and join
4. Verify all 5 users are active members
5. Verify club member count is correct
6. Verify all users can access club content
7. Verify only admin sees invite section

### Test 4.3: Club Deletion Cascades to Invite Tokens
**Scenario:** Deleting club invalidates invite tokens

**Test Steps:**
1. Admin creates club and gets invite token
2. Verify invite token exists in database
3. Admin deletes club
4. Verify club is deleted
5. Verify invite token is deleted (cascade)
6. Attempt to join via old invite token
7. Verify request fails with invalid token error

## Test Suite 5: UI Component Tests

### Test 5.1: Create Club Form Validation
**Test Steps:**
1. Navigate to /clubs/create
2. Submit empty form
3. Verify validation errors appear
4. Enter name with 2 characters
5. Verify error: "Club name must be at least 3 characters"
6. Enter name with 101 characters
7. Verify error: "Club name must be less than 100 characters"
8. Select category but leave name empty
9. Verify name error persists
10. Fill all required fields correctly
11. Verify form submits successfully

### Test 5.2: Invite Section Visibility
**Test Steps:**
1. Create club as user A
2. Navigate to club detail page
3. Verify invite section is visible
4. Log out and log in as user B
5. Join club as member
6. Navigate to club detail page
7. Verify invite section is NOT visible
8. Verify join/leave button is visible

### Test 5.3: Clipboard Copy Functionality
**Test Steps:**
1. Create club as admin
2. Navigate to club detail page
3. Click copy button in invite section
4. Verify success toast appears
5. Verify clipboard contains invite URL
6. Verify copy icon changes to check icon
7. Wait 2 seconds
8. Verify icon changes back to copy icon

### Test 5.4: Invite Join Page States
**Test Steps:**
1. Access valid invite link while authenticated
2. Verify loading state appears
3. Verify success state appears
4. Verify redirect to club page
5. Access invalid invite link
6. Verify error state appears
7. Verify error message is user-friendly
8. Access invite link for already-joined club
9. Verify "already a member" message
10. Verify redirect option to club page

## Performance Tests

### Test P1: Invite Token Generation Performance
**Test:** Generate 100 invite tokens
**Expected:** All tokens generated in < 1 second
**Expected:** All tokens are unique

### Test P2: Concurrent Join Requests
**Test:** 50 users join same club simultaneously
**Expected:** All requests complete successfully
**Expected:** No duplicate memberships created
**Expected:** Club member count is accurate

## Security Tests

### Test S1: Token Uniqueness
**Test:** Generate 10,000 invite tokens
**Expected:** All tokens are unique
**Expected:** No collisions

### Test S2: Token Format Validation
**Test:** Attempt to join with malformed tokens
**Expected:** All malformed tokens are rejected
**Expected:** No SQL injection vulnerabilities

### Test S3: Authorization Checks
**Test:** Non-admin tries to access invite endpoint
**Expected:** Request is rejected
**Expected:** No token information is leaked

## Test Execution Checklist

- [ ] All Test Suite 1 tests pass
- [ ] All Test Suite 2 tests pass
- [ ] All Test Suite 3 tests pass
- [ ] All Test Suite 4 tests pass
- [ ] All Test Suite 5 tests pass
- [ ] All Performance tests pass
- [ ] All Security tests pass
- [ ] No console errors during test execution
- [ ] Database is properly cleaned up after tests
- [ ] All edge cases are covered

## Notes

- Tests should be run in isolation to avoid data conflicts
- Use test database separate from development database
- Clean up test data after each test suite
- Mock external dependencies where appropriate
- Use consistent test data for reproducibility
