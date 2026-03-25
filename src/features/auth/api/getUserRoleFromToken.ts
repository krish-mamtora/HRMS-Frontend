import { jwtDecode } from 'jwt-decode';

export const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    
    const role = decodedToken[roleKey];
    
    return  role || null;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};
