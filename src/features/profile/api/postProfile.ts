import { fetcher } from "@/utils";

import type { Profile } from "../types";

export const postProfile = (
  accessToken: string,
  body: Partial<Profile>,
): Promise<Profile> => {
  return fetcher<Profile>(
    `${process.env.NEXT_PUBLIC_FETCH_HOST}/api/me`,
    accessToken,
    "POST",
    body,
  );
};
