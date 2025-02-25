import { createSeminar } from "@/api-handlers";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import queryClient from "@/query-client";
import type { FormError } from "@/types";
import { Button, Fieldset, HStack, Input } from "@chakra-ui/react";
import { isAPIError, type NewSeminar, newSeminarSchema } from "cyborg-utils";
import { useRef, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const SeminarForm = () => {
  const form = useRef(null);
  const [formErrors, setFormErrors] = useState<FormError>({});

  const {
    register: registerSeminar,
    control: controlSeminar,
    handleSubmit: handleSeminarSubmit,
    formState: { errors },
  } = useForm<NewSeminar>({
    defaultValues: {
      draft: true,
      inProgress: false,
      completed: false,
    },
  });

  const onSeminarSubmit: SubmitHandler<NewSeminar> = async (
    data: NewSeminar,
  ) => {
    const res = newSeminarSchema.omit({ slug: true }).safeParse(data);
    if (!res.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormErrors(res.error as any);
    } else {
      try {
        const seminar = await createSeminar({ ...res.data, slug: "" });
        await queryClient.invalidateQueries({
          queryKey: [`${import.meta.env.VITE_API_URL}/seminars`],
        });
        toast.success(`Created new seminar ${seminar.title}!`, {
          toastId: "semSuccess",
        });
      } catch (err) {
        toast.error(
          isAPIError(err)
            ? err.message
            : "Something went wrong creating seminar",
          { toastId: "createSeminarErr" },
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSeminarSubmit(onSeminarSubmit)}
      ref={form}
      style={{ margin: "auto 0", width: "75%" }}
    >
      <Fieldset.Root size="lg" maxW="md" m="auto">
        <Fieldset.Content>
          <Field
            label="Title"
            invalid={!!errors.title || !!formErrors?.title}
            errorText={errors.title?.message || formErrors?.title?._errors[0]}
            required
          >
            <Input {...registerSeminar("title")} />
          </Field>
          <Field
            label="Description"
            invalid={!!errors.description || !!formErrors?.description}
            errorText={
              errors.description?.message || formErrors?.description?._errors[0]
            }
          >
            <Input {...registerSeminar("description")} />
          </Field>
          <HStack>
            <Controller
              name="draft"
              control={controlSeminar}
              render={({ field }) => (
                <Field
                  orientation="vertical"
                  label="Draft?"
                  invalid={!!errors?.draft || !!formErrors?.draft}
                  errorText={
                    errors.draft?.message || formErrors?.draft?._errors[0]
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
              name="inProgress"
              control={controlSeminar}
              render={({ field }) => (
                <Field
                  orientation="vertical"
                  label="In Progress?"
                  invalid={!!errors?.inProgress || !!formErrors?.inProgress}
                  errorText={
                    errors.inProgress?.message ||
                    formErrors?.inProgress?._errors[0]
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
              name="completed"
              control={controlSeminar}
              render={({ field }) => (
                <Field
                  orientation="vertical"
                  label="Completed?"
                  invalid={!!errors?.completed || !!formErrors?.completed}
                  errorText={
                    errors.completed?.message ||
                    formErrors?.completed?._errors[0]
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
          </HStack>
        </Fieldset.Content>
        <Button type="submit">Submit</Button>
      </Fieldset.Root>
    </form>
  );
};
