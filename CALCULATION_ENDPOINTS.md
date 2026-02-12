# Calculation Endpoints Documentation

I've added three new calculation endpoints to the API for calculating sums of price/salary for users and staff.

## 1. User Price Sum
Calculate the total price for a specific user in a specific month.

**Endpoint:** `GET /api/user-price-sum`

**Query Parameters:**
- `userID` (required): The ID of the user
- `year` (required): The year (e.g., 2026)
- `month` (required): The month (1-12)

**Example:**
```
GET http://localhost:2999/api/user-price-sum?userID=1&year=2026&month=1
```

**Response:**
```json
{
  "userID": 1,
  "year": 2026,
  "month": 1,
  "totalPrice": 3510,
  "recordCount": 15,
  "records": [
    {
      "serviceID": 10,
      "date": "2026-01-02T00:00:00.000Z",
      "price": 234
    },
    ...
  ]
}
```

## 2. Staff Salary Sum
Calculate the total salary and hours for a specific staff member in a specific month.

**Endpoint:** `GET /api/staff-salary-sum`

**Query Parameters:**
- `staffID` (required): The ID of the staff member
- `year` (required): The year (e.g., 2026)
- `month` (required): The month (1-12)

**Example:**
```
GET http://localhost:2999/api/staff-salary-sum?staffID=1&year=2026&month=1
```

**Response:**
```json
{
  "staffID": 1,
  "year": 2026,
  "month": 1,
  "totalSalary": 0,
  "totalHours": 6,
  "recordCount": 3,
  "records": [
    {
      "serviceID": 24,
      "date": "2026-01-19T00:00:00.000Z",
      "salary": 0,
      "duration": 2
    },
    ...
  ]
}
```

## 3. Monthly Summary
Get a summary of all users or all staff for a specific month.

**Endpoint:** `GET /api/monthly-summary`

**Query Parameters:**
- `type` (required): Either "user" or "staff"
- `year` (required): The year (e.g., 2026)
- `month` (required): The month (1-12)

**Example (Users):**
```
GET http://localhost:2999/api/monthly-summary?type=user&year=2026&month=1
```

**Response (Users):**
```json
{
  "year": 2026,
  "month": 1,
  "type": "user",
  "summary": [
    {
      "userID": 1,
      "userName": "劉坡發",
      "totalPrice": 3510,
      "recordCount": 15
    },
    {
      "userID": 2,
      "userName": "張瑞珍",
      "totalPrice": 1302,
      "recordCount": 7
    }
  ]
}
```

**Example (Staff):**
```
GET http://localhost:2999/api/monthly-summary?type=staff&year=2026&month=1
```

**Response (Staff):**
```json
{
  "year": 2026,
  "month": 1,
  "type": "staff",
  "summary": [
    {
      "staffID": 1,
      "staffName": "王樂欽",
      "position": "PT",
      "totalSalary": 0,
      "totalHours": 6,
      "recordCount": 3
    },
    {
      "staffID": 3,
      "staffName": "Pending",
      "position": "Pending",
      "totalSalary": 2700,
      "totalHours": 46.5,
      "recordCount": 15
    },
    ...
  ]
}
```

## Testing

To test these endpoints, start the server with:
```bash
npm run dev
```

Then you can use curl, Postman, or any HTTP client to make requests. For example with PowerShell:

```powershell
# Test user price sum
Invoke-RestMethod -Uri "http://localhost:2999/api/user-price-sum?userID=1&year=2026&month=1" | ConvertTo-Json -Depth 5

# Test staff salary sum
Invoke-RestMethod -Uri "http://localhost:2999/api/staff-salary-sum?staffID=3&year=2026&month=1" | ConvertTo-Json -Depth 5

# Test monthly summary for users
Invoke-RestMethod -Uri "http://localhost:2999/api/monthly-summary?type=user&year=2026&month=1" | ConvertTo-Json -Depth 5

# Test monthly summary for staff
Invoke-RestMethod -Uri "http://localhost:2999/api/monthly-summary?type=staff&year=2026&month=1" | ConvertTo-Json -Depth 5
```
