import {jwtDecode} from "jwt-decode"; // Fixed import

export function isTokenValid() {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        // Token not found in sessionStorage
        return false;
    }

    // Split the token into its parts: header, payload, and signature
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
        // Invalid JWT format
        return false;
    }

    // Decode the payload (the middle part)
    const payload = JSON.parse(atob(tokenParts[1]));

    // Check if the token is expired
    const tokenExp = payload.exp;
    const currentTimestamp = Math.floor(Date.now() / 1000); // in seconds

    if (!tokenExp || currentTimestamp > tokenExp) {
        // Token is expired
        return false;
    }

    // Token is valid
    return true;
}

export function getUserIdFromToken() {
    // Retrieve the token from session storage
    const token = sessionStorage.getItem('jwtToken');
    
    if (!token) {
      // Handle the case where the token is not found
      console.error('JWT token not found in session storage');
      return null;
    }
  
     // Decode the token to extract user ID
     const decodedToken = jwtDecode(token);
     const userId = decodedToken.sub;
     return userId;
  }
  
