export interface AuthResponse {
    kind: string;
    localId: string; 
    email: string;
    displayName: string;
    idToken: string;  
    expiresIn: string;
    refreshToken: string;
    registered: boolean;
  }