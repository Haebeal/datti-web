import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "@chakra-ui/react";

import { Profile, profileScheme, putProfile } from "@/features/profile";
import { useAccessToken } from "@/hooks/useAccessToken";

export const useProfile = () => {
  const { getAccessToken } = useAccessToken();
  const { user, isLoading } = useAuth0();
  const toast = useToast();

  const profile = user === undefined ? undefined : profileScheme.parse(user);

  const updateProfile = async (value: Partial<Profile>) => {
    const accessToken = await getAccessToken();

    try {
      const result = await putProfile(accessToken, value);
      toast({
        status: "success",
        title: "プロフィールを更新しました",
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          status: "error",
          title: error.message,
        });
      } else {
        toast({
          status: "error",
          title: "不明なエラーが発生しました",
        });
      }
      return null;
    }
  };

  return { profile, isLoading, updateProfile };
};
