import {
  SubmissionResult,
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useNavigation } from "@remix-run/react";
import { useId } from "react";
import { User } from "~/api/datti/@types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { profileFormSchema } from "~/schema/profileFormSchema";

interface Props {
  defaultValue?: User;
  lastResult?: SubmissionResult<string[]> | null;
}

export function ProfileForm({ defaultValue, lastResult }: Props) {
  const [form, { name, photoUrl }] = useForm({
    defaultValue,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: profileFormSchema });
    },
  });

  const { state } = useNavigation();

  const emailId = useId();
  const nameId = useId();

  return (
    <div className="grid grid-cols-5 px-4 gap-3">
      <div className="col-span-5 md:col-span-2 grid place-content-center max-h-80 py-10">
        <Avatar className="size-full max-md max-w-60 max-h-60 border border-gray-200">
          <AvatarImage className="hover:cursor-pointer" src={photoUrl.value} />
        </Avatar>
      </div>
      <Form
        method="post"
        {...getFormProps(form)}
        className="flex flex-col gap-8 items-center col-span-5 md:col-span-3"
      >
        <Input {...getInputProps(photoUrl, { type: "hidden" })} />
        <div className="w-full">
          <Label htmlFor={emailId}>メールアドレス</Label>
          <Input
            defaultValue={defaultValue?.email}
            readOnly
            disabled={state !== "idle"}
            id={emailId}
            placeholder="datti@example.com"
          />
        </div>
        <div className="w-full">
          <Label htmlFor={nameId}>ユーザー名</Label>
          <Input
            {...getInputProps(name, { type: "text" })}
            id={nameId}
            disabled={state !== "idle"}
            placeholder="ユーザー名を入力"
          />
          <p>{name.errors?.toString()}</p>
        </div>
        <Button
          type="submit"
          className="w-full max-w-2xl bg-sky-500 hover:bg-sky-600  font-semibold"
          disabled={state !== "idle"}
        >
          更新
        </Button>
      </Form>
    </div>
  );
}
