# API Routes

## Company Routes (`/api/v1/company`)

- `POST /register`: Registers a new company.
- `GET /signin/:cid`: Sign in a company using its ID (`cid`).

## Dashboard Routes (`/api/v1/dashboard`)

- `GET /getCompanyData`: Fetches the data related to the KYC verification of the company
- `POST /upload`: Handles file upload for the KYC verification
