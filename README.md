# TA Feedback Interface - Development Setup

This document provides step-by-step instructions for setting up, testing, and debugging the **TA Feedback Interface** application.

## Table of Contents  
1. Project Overview  
2. Development Environment Setup  
3. Running the Application  
4. Testing API Requests  
5. CORS Debugging Notes for Django API  
6. Troubleshooting  


## Project Overview

The TA Feedback Interface is a React-based application that helps teaching assistants provide hints and feedback to students based on AI-generated prompts and notebook data.

Key Features:  
- Displays student notebooks with rendered markdown and code cells.  
- Allows teaching assistants to provide feedback and view AI-generated hints.  
- Fetches hint requests and submits responses via an API.


## Development Environment Setup

### Prerequisites  
Ensure you have the following installed:  
- Node.js (v14 or later)  
- npm or yarn  

### Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/educational-technology-collective/ta_hint_feedback
   cd ta_hint_feedback
   ```

2. Install dependencies:
   ```bash
    npm install
   ```

3. Create a config.js file in `src/utils/`
   ```js
    export const HOST_URL = 'https://<your-api-gateway-endpoint>';
   ```


---
## Running the Application

To start the development server:

```bash
npm start
```

The app will open in your default browser at http://localhost:8080.

## Testing API Requests  

The app interacts with an external API via API Gateway → Lambda → Django API.  

Key Request File:  
Requests are managed in `src/utils/requests.js`.  

Example:  
```javascript
export const getOneHF = async () => {  
    const response = await fetch(HOST_URL, {  
        method: 'POST',  
        mode: 'cors',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({  
            method: 'GET',  
            port: '9004',  
            path: 'feedback_generation/ta_interface/',  
            params: { action: 'fetch_one', TA_id: 'luang' }  
        }),  
    });  
    const data = await response.json();  
    return data;  
};  
```
   

## CORS Debugging Notes for Django API  

If the app throws a **CORS policy error** in the browser:  

1. Confirm the request successfully reaches the Django API.  
   - Use browser DevTools (Network tab) to inspect the API request and response.  

2. The Django API must include the following headers in its response:  
   ```http
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, GET, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

## Troubleshooting  

### Common Issues  

1. **CORS Policy Errors**:  
   - Verify the API response includes CORS headers (see above).  
   - Check the `HOST_URL` in `config.js`.  

2. **Dev Server Not Starting**:  
   - Ensure all dependencies are installed.  
   - Restart the server:  
     ```bash
     npm start
     ```

3. **API Requests Failing**:  
   - Test the API endpoint using **Postman** or `curl`.  
   - Confirm the API Gateway URL is correct and accessible.