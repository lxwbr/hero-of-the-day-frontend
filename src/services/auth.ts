import { PublicClientApplication, Configuration, AccountInfo, AuthenticationResult, LogLevel } from '@azure/msal-browser';

// Microsoft Azure AD configuration
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: process.env.NEXT_PUBLIC_AZURE_TENANT_ID 
      ? `${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`
      : 'https://login.microsoftonline.com/common',
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};

// Validate configuration
if (!process.env.NEXT_PUBLIC_AZURE_CLIENT_ID) {
  console.error('NEXT_PUBLIC_AZURE_CLIENT_ID is not set. Please check your .env.local file.');
}

if (!process.env.NEXT_PUBLIC_AZURE_TENANT_ID) {
  console.warn('NEXT_PUBLIC_AZURE_TENANT_ID is not set. Using "common" tenant.');
}

// Scopes for Microsoft Graph API
const loginRequest = {
  scopes: ['user.read'],
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

      // Decode the token (client-side for inspection)
      const [header, payload, signature] = result.accessToken.split('.');
      const decodedPayload = JSON.parse(atob(payload)); // `atob` is a browser function for base64 decoding

      console.log("Decoded Token Payload:", decodedPayload);
      console.log("header:", header);
      console.log("signature:", signature);
      console.log("Audience (aud):", decodedPayload.aud);
      console.log("decodedPayload:", JSON.stringify(decodedPayload));

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