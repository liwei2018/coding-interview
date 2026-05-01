## C1. How would you prove that our Xero API connection is working before checking invoices?

To verify the connection, you should call the GET https://api.xero.com/connections endpoint. This endpoint returns a list of all tenants (organizations) that the user has authorized your application to access. If the API returns a 200 OK status and a list containing the expected tenantId, it proves that the OAuth2 authentication is successful and the connection is active.

## C2. If /connections works but GET /Invoices fails, what would you check?

If the connection is established but the invoice request fails, you should investigate the following:

- **Scopes**: Ensure the Access Token includes the required permissions, such as accounting.transactions or accounting.transactions.read.
- **Tenant ID Header**: Verify that the xero-tenant-id header is correctly included in the request and matches one of the IDs returned by the /connections endpoint.
- **Token Validity**: Check if the Access Token has expired; if so, it must be refreshed using the Refresh Token.

## C3. What endpoint would you call to check invoices?

To retrieve a list of invoices, you would call the GET https://api.api.xero.com/api.xro/2.0/Invoices endpoint.

## C4. How would you check one specific invoice?

You can retrieve a specific invoice by appending its unique InvoiceID to the endpoint path:

- **Endpoint**: GET https://api.xero.com/api.xro/2.0/Invoices/{InvoiceID}.
- Alternatively, you can use a filter parameter if you only have the invoice number, such as ?where=InvoiceNumber=="INV-001".

## C5. If the invoice API returns 429, how should the backend handle it?

An HTTP 429 status code indicates that the application has hit a Rate Limit (too many requests). The backend should handle this by:

- **Reading the Retry-After Header**: The API response usually includes a header specifying how many seconds to wait before retrying.
- **Implementing Exponential Backoff**: Use a retry strategy where the wait time increases between each subsequent attempt.
- **Request Throttling**: Review the application logic to ensure it isn't making unnecessary concurrent calls that exceed Xero's limit thresholds.
