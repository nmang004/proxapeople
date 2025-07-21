// Global token manager for Auth0 integration
let globalAccessToken: string | null = null;

export const TokenManager = {
  setToken: (token: string | null) => {
    globalAccessToken = token;
  },
  
  getToken: (): string | null => {
    return globalAccessToken;
  },
  
  clearToken: () => {
    globalAccessToken = null;
  }
};