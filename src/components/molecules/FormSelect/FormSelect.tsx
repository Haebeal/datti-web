import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { Controller } from "react-hook-form";

import type {
  ActionMeta,
  AsyncProps,
  GroupBase,
  SingleValue,
} from "chakra-react-select";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues, U> = AsyncProps<U, true, GroupBase<U>> & {
  id?: string;
  label: string;
  placeholder: string;
  readonly?: boolean;
  error?: FieldError;
  control: Control<T>;
  isLoading?: boolean;
  name: Path<T>;
  onChangeSelect?: (
    newValue: SingleValue<U>,
    actionMeta: ActionMeta<U>
  ) => void;
};

export const FormSelect = <T extends FieldValues, U>({
  id,
  label,
  placeholder,
  readonly = false,
  error,
  control,
  isLoading = false,
  name,
  loadOptions,
  getOptionLabel,
  getOptionValue,
  value,
  onChangeSelect,
}: Props<T, U>) => {
  const isError = error ? true : false;

  return (
    <FormControl isInvalid={error ? true : false}>
      <Stack direction={{ base: "column", md: "row" }}>
        <Heading
          w={{ base: "", md: "30%" }}
          as={FormLabel}
          pt={2}
          size="sm"
          noOfLines={1}
        >
          {label}
        </Heading>
        <Skeleton w="full" isLoaded={!isLoading}>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <AsyncSelect<U, false>
                {...field}
                instanceId={`select-${id}`}
                placeholder={placeholder}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                value={value}
                onChange={onChangeSelect}
                loadOptions={loadOptions}
                defaultOptions
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    width: "full",
                  }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: readonly ? "" : "gray.200",
                  }),
                }}
                size="md"
                isReadOnly={readonly}
                isClearable
              />
            )}
          />
        </Skeleton>
      </Stack>
      {isError ? <FormErrorMessage>{error?.message}</FormErrorMessage> : null}
    </FormControl>
  );
};
