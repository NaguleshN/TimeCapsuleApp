export const getAuthTokenFromCookie = () => {
    try {
      const cookieString = document.cookie;
      console.log(cookieString)

      const cookiePrefix = 'jwt';
    const startIndex = cookieString.indexOf(cookiePrefix);
    console.log(startIndex)

      const value = `; ${document.cookie}`;
      const parts = value.split(`; jwt=`);
      if (parts.length === 2) return parts.pop().split(';').shift(); // Extract the token from cookie
      return null; // If no token found, return null
    } catch (error) {
      console.error("Error retrieving token from cookie:", error);
      return null;
    }
  };