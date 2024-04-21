import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { createDattiClient } from "~/lib/apiClient";
import { getAuthSessionStorage } from "~/lib/authSession.server";
import { refreshFirebaseIdToken } from "~/lib/oauthClient.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  console.log("start auth loader");
  const start = performance.now();

  const authSessionStorage = getAuthSessionStorage(context);
  const authSession = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (!authSession.has("idToken")) {
    throw redirect("/signin");
  }

  const idToken = authSession.get("idToken");
  const oldRefreshToken = authSession.get("refreshToken");
  const expiresDateTime = authSession.get("expiresDateTime");

  if (!idToken || !expiresDateTime || !oldRefreshToken) {
    throw redirect("/signin");
  }

  if (new Date() >= new Date(expiresDateTime)) {
    const dt = new Date();
    const { id_token, refresh_token, expires_in } =
      await refreshFirebaseIdToken(
        context.cloudflare.env.FIREBASE_API_KEY,
        oldRefreshToken
      );
    dt.setSeconds(dt.getSeconds() + Number(expires_in));
    authSession.set("idToken", id_token);
    authSession.set("refreshToken", refresh_token);
    authSession.set("expiresDateTime", dt.toISOString());

    const dattiClient = createDattiClient(
      id_token,
      context.cloudflare.env.BACKEND_ENDPOINT
    );
    const profile = await dattiClient.users.me.$get();

    const end = performance.now();
    console.log(`end auth loader at ${end - start}ms`);

    return json(
      {
        profile,
        idToken: id_token,
      },
      {
        headers: {
          "Set-Cookie": await authSessionStorage.commitSession(authSession),
        },
      }
    );
  }

  if (!idToken) {
    throw new Response(undefined, {
      status: 401,
    });
  }

  const dattiClient = createDattiClient(
    idToken,
    context.cloudflare.env.BACKEND_ENDPOINT
  );
  const profile = await dattiClient.users.me.$get();

  return json({
    profile,
    idToken,
  });
};

export default function Auth() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      <Header profile={profile} className="h-20 bg-white" />
      <div className="container py-3">
        <Outlet />
      </div>
    </div>
  );
}
