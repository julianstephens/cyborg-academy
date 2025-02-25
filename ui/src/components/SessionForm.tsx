import { createSeminarSession } from "@/api-handlers";
import { Field } from "@/components/ui/field";
import {
  NumberInputField,
  NumberInputLabel,
  NumberInputRoot,
} from "@/components/ui/number-input";
import { Switch } from "@/components/ui/switch";
import queryClient from "@/query-client";
import type { FormError, SelectOption } from "@/types";
import { Button, Fieldset, HStack, Input } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import {
  isAPIError,
  type NewSeminarSession,
  newSeminarSessionSchema,
} from "cyborg-utils";
import { useRef, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const SessionForm = ({ seminars }: { seminars: SelectOption[] }) => {
  const form = useRef(null);
  const [formErrors, setFormErrors] = useState<FormError>({});
  const {
    register: registerSession,
    handleSubmit: handleSessionSubmit,
    formState: { errors },
    control: sessionControl,
  } = useForm<NewSeminarSession>({
    defaultValues: { order: 1, locked: true, draft: true },
  });

  const onSessionSubmit: SubmitHandler<NewSeminarSession> = async (data) => {
    const res = newSeminarSessionSchema.safeParse({
      ...data,
      readings: [],
      notes: [],
    });
    if (!res.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormErrors(res.error as any);
    } else {
      try {
        const session = await createSeminarSession(res.data);
        await queryClient.invalidateQueries({
          queryKey: [`${import.meta.env.VITE_API_URL}/seminars`],
        });
        toast.success(`Created new seminar session ${session.title}!`, {
          toastId: "sessSuccess",
        });
      } catch (err) {
        toast.error(
          isAPIError(err)
            ? err.message
            : "Something went wrong creating seminar session",
          { toastId: "createSessionErr" },
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSessionSubmit(onSessionSubmit)}
      ref={form}
      style={{ margin: "auto 0", width: "75%" }}
    >
      <Fieldset.Root
        size="lg"
        maxW="md"
        m="auto"
        invalid={Object.values(errors)
          .map((e) => e.message)
          .some((m) => !!m)}
      >
        <Fieldset.Content>
          <Field
            label="Title"
            invalid={!!errors?.title || !!formErrors?.title}
            errorText={errors?.title?.message || formErrors?.title?._errors[0]}
            required
          >
            <Input {...registerSession("title")} />
          </Field>
          <Field
            label="Description"
            invalid={!!errors?.description || !!formErrors?.description}
            errorText={
              errors?.description?.message ||
              formErrors?.description?._errors[0]
            }
            required
          >
            <Input {...registerSession("description")} />
          </Field>
          <HStack w="full" display="flex" justify="space-around">
            <Field
              label="Seminar"
              invalid={!!errors?.seminarId || !!formErrors?.seminarId}
              errorText={
                errors?.seminarId?.message || formErrors?.seminarId?._errors[0]
              }
              required
            >
              <Controller
                control={sessionControl}
                name="seminarId"
                render={({ field }) => (
                  <Select
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    options={seminars as any}
                    // @ts-expect-error controlled
                    onChange={({ value }) => field.onChange(value)}
                  />
                )}
              />
            </Field>
            <Field
              label="Order"
              w="fit"
              invalid={!!errors?.order || !!formErrors?.order}
              errorText={
                errors?.order?.message || formErrors?.order?._errors[0]
              }
              required
            >
              <Controller
                name="order"
                control={sessionControl}
                render={({ field }) => (
                  <NumberInputRoot
                    min={1}
                    disabled={field.disabled}
                    name={field.name}
                    value={field.value + ""}
                    onValueChange={({ value }) => {
                      field.onChange(value);
                    }}
                  >
                    <NumberInputLabel />
                    <NumberInputField />
                  </NumberInputRoot>
                )}
              />
            </Field>
          </HStack>
          <Controller
            name="locked"
            control={sessionControl}
            render={({ field }) => (
              <Field
                orientation="horizontal"
                label="Locked?"
                invalid={!!errors?.locked || !!formErrors?.locked}
                errorText={
                  errors?.locked?.message || formErrors?.locked?._errors[0]
                }
              >
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                />
              </Field>
            )}
          />
          <Controller
            name="draft"
            control={sessionControl}
            render={({ field }) => (
              <Field
                orientation="horizontal"
                label="Draft?"
                invalid={!!errors?.draft || !!formErrors?.draft}
                errorText={
                  errors?.draft?.message || formErrors?.draft?._errors[0]
                }
              >
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                />
              </Field>
            )}
          />
        </Fieldset.Content>
        <Button type="submit">Submit</Button>
      </Fieldset.Root>
    </form>
  );
};
