// Global token manager for Auth0 integration
let globalAccessToken: string | null = null;

export const TokenManager = {
  setToken: (token: string | null) => {
    console.log('🔐 TokenManager: Setting token:', token ? `${token.substring(0, 20)}...` : 'null');
    globalAccessToken = token;
  },
  
  getToken: (): string | null => {
    console.log('🔍 TokenManager: Getting token:', globalAccessToken ? `${globalAccessToken.substring(0, 20)}...` : 'null');
    return globalAccessToken;
  },
  
  clearToken: () => {
    console.log('🧹 TokenManager: Clearing token');
    globalAccessToken = null;
  }
};