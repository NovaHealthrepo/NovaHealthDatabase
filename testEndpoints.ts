// Test script for the new calculation endpoints

async function testEndpoints() {
  const baseUrl = "http://localhost:2999/api";

  console.log("Testing calculation endpoints...\n");

  try {
    // Test 1: User price sum
    console.log("1. Testing user price sum for userID=1, year=2026, month=1:");
    const response1 = await fetch(`${baseUrl}/user-price-sum?userID=1&year=2026&month=1`);
    const data1 = await response1.json();
    console.log(JSON.stringify(data1, null, 2));
    console.log("\n");

    // Test 2: Staff salary sum
    console.log("2. Testing staff salary sum for staffID=1, year=2026, month=1:");
    const response2 = await fetch(`${baseUrl}/staff-salary-sum?staffID=1&year=2026&month=1`);
    const data2 = await response2.json();
    console.log(JSON.stringify(data2, null, 2));
    console.log("\n");

    // Test 3: Monthly summary for users
    console.log("3. Testing monthly summary for users, year=2026, month=1:");
    const response3 = await fetch(`${baseUrl}/monthly-summary?type=user&year=2026&month=1`);
    const data3 = await response3.json();
    console.log(JSON.stringify(data3, null, 2));
    console.log("\n");

    // Test 4: Monthly summary for staff
    console.log("4. Testing monthly summary for staff, year=2026, month=1:");
    const response4 = await fetch(`${baseUrl}/monthly-summary?type=staff&year=2026&month=1`);
    const data4 = await response4.json();
    console.log(JSON.stringify(data4, null, 2));

  } catch (error) {
    console.error("Error testing endpoints:", error);
  }
}

testEndpoints();
