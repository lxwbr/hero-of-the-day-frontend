import { PublicClientApplication, Configuration, AccountInfo, AuthenticationResult } from '@azure/msal-browser';

// Microsoft Azure AD configuration
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || 'common'}`,
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes for Microsoft Graph API
const loginRequest = {
  scopes: ['User.Read', 'email', 'profile'],
};

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Ensure MSAL is initialized before any API call
let msalInitialized: Promise<void> | null = null;
function ensureMsalInitialized(): Promise<void> {
  if (!msalInitialized) {
    msalInitialized = msalInstance.initialize();
  }
  return msalInitialized;
}

// Authentication service
export class AuthService {
  private static instance: AuthService;
  private currentAccount: AccountInfo | null = null;

  private constructor() {
    // Initialize the account on service creation
    this.initializeAccount();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initializeAccount(): Promise<void> {
    await ensureMsalInitialized();
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        this.currentAccount = accounts[0];
      }
    } catch (error) {
      console.error('Error initializing account:', error);
    }
  }

  public async login(): Promise<AuthenticationResult | null> {
    await ensureMsalInitialized();
    try {
      const result = await msalInstance.loginPopup(loginRequest);
      this.currentAccount = result.account;
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  public async logout(): Promise<void> {
    await ensureMsalInitialized();
    try {
      if (this.currentAccount) {
        await msalInstance.logoutPopup({
          account: this.currentAccount,
        });
      }
      this.currentAccount = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  public async getAccessToken(): Promise<string | null> {
    await ensureMsalInitialized();
    try {
      if (!this.currentAccount) {
        await this.initializeAccount();
        if (!this.currentAccount) {
          return null;
        }
      }

      const silentRequest = {
        scopes: loginRequest.scopes,
        account: this.currentAccount,
      };

      const result = await msalInstance.acquireTokenSilent(silentRequest);
      return result.accessToken;
    } catch (error) {
      console.error('Error acquiring token:', error);
      // If silent token acquisition fails, try interactive login
      try {
        const result = await this.login();
        return result?.accessToken || null;
      } catch (loginError) {
        console.error('Interactive login failed:', loginError);
        return null;
      }
    }
  }

  public getCurrentAccount(): AccountInfo | null {
    return this.currentAccount;
  }

  public getUserEmail(): string | null {
    return this.currentAccount?.username || null;
  }

  public isAuthenticated(): boolean {
    return this.currentAccount !== null;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance(); 