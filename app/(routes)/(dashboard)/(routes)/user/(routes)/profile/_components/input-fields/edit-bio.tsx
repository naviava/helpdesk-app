"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { trpc } from "@/app/_trpc/client";

interface EditBioProps {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
  bio: z.string().min(20, { message: "Make it at least 20 characters ;-)" }),
});

export default function EditBio({ setIsEditing }: EditBioProps) {
  const router = useRouter();
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const getUserProfile = trpc.user.getUserProfile.useQuery();
  const { data: user } = useMemo(() => getUserProfile, [getUserProfile]);

  const { mutate: handleSetBio, isLoading } = trpc.user.setBio.useMutation({
    onError: ({ message }) => toast.error(message),
    onSuccess: () => {
      router.refresh();
      setIsEditing(false);
    },
    onSettled: () => getUserProfile.refetch(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { bio: user?.bio || "" },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      handleSetBio(values);
    },
    [handleSetBio],
  );

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      if (evt.ctrlKey && evt.key === "Enter") {
        sendButtonRef?.current?.click();
      }

      if (evt.key === "Escape") {
        cancelButtonRef.current?.click();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  placeholder={`Ready to add your own touch?\nPress Ctrl + Enter to send...`}
                  className="h-[20rem] resize-none whitespace-pre-wrap text-sm leading-[1.75rem] md:h-[20rem] md:text-base md:leading-[2rem]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="ghost"
            disabled={isLoading}
            onClick={() => setIsEditing(false)}
            className="min-w-[8rem]"
          >
            Cancel
          </Button>
          <Button
            ref={sendButtonRef}
            type="submit"
            variant="theme"
            disabled={isLoading}
            className="min-w-[8rem]"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
