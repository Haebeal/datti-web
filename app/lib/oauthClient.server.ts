type FirebaseUser = {
  federatedId?: string;
  providerId?: string;
  localId?: string;
  emailVerified?: boolean;
  email: string;
  oauthIdToken?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  displayName: string;
  idToken: string;
  photoUrl?: string;
  refreshToken: string;
  expiresIn: string;
  rawUserInfo?: string;
};

type RefreshResponse = {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};

export const signInFirebaseWithGoogle = async (
  clientUrl: string,
  tenantId: string,
  apiKey: string,
  googleIdToken: string
) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`,
    {
      method: "POST",
      body: JSON.stringify({
        requestUri: clientUrl,
        tenantId: tenantId,
        postBody: `id_token=${googleIdToken}&providerId=google.com`,
        returnSecureToken: true,
        returnIdpCredential: false,
      }),
    }
  );
  const data = await response.json<FirebaseUser>();
  return data;
};

export const signInFirebaseWithPassword = async (
  tenantId: string,
  apiKey: string,
  email: string,
  password: string
) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
        tenantId: tenantId,
      }),
    }
  );
  const data = await response.json<FirebaseUser>();
  return data;
};

export const refreshFirebaseIdToken = async (
  apiKey: string,
  refreshToken: string
): Promise<RefreshResponse> => {
  const body = new FormData();
  body.append("grant_type", "refresh_token");
  body.append("refresh_token", refreshToken);
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
    {
      method: "POST",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refreshToken: refreshToken,
      }),
    }
  );
  const data = await response.json<RefreshResponse>();
  return data;
};
