"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { trpc } from "@/app/_trpc/client";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter a name" })
    .max(50, { message: "Maximum 50 characters allowed" })
    .regex(new RegExp(/^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/), {
      message: "Name should contain only letters of the alphabet",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, {
      message:
        "Password must contain at least: 6 characters, 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character",
    })
    .regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/), {
      message:
        "Password must contain at least: 6 characters, 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character",
    }),
  confirmPassword: z
    .string()
    .min(6, { message: "Must be the same as the password" }),
});

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: registerUser, isLoading } =
    trpc.user.registerUser.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: () => {
        toast.success("User account created");
        signIn("credentials", {
          email: form.getValues("email"),
          password: form.getValues("password"),
          redirect: false,
        }).then((callback) => {
          if (callback?.ok) {
            toast.success(`Logged in as ${form.getValues("name")}`);
            router.refresh();
          }
        });
      },
    });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => registerUser(values),
    [registerUser],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 w-full max-w-xl space-y-4 px-6"
      >
        {/* Name. */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-lg text-rose-600">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This name will be visible to others.
              </FormDescription>
              <FormMessage className="text-rose-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email Address <span className="text-lg text-rose-600">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-rose-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-lg text-rose-600">*</span>
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-rose-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm Password{" "}
                <span className="text-lg text-rose-600">*</span>
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-rose-500" />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <Button
            type="submit"
            variant="theme"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Loader className="animate-spin" /> : <>REGISTER</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
