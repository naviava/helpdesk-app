"use client";

import { useCallback } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import EditPhoneNumber from "./input-fields/edit-phone-number";
import EditDesignation from "./input-fields/edit-designation";
import EditDepartment from "./input-fields/edit-department";
import EditName from "./input-fields/edit-name";
import EditDob from "./input-fields/edit-dob";

import { trpc } from "@/app/_trpc/client";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  designation: z.string().nullish(),
  departmentId: z.string().nullish(),
  dob: z.date().nullish(),
  phoneNumber: z.string().nullish(),
});

export default function EditInfoForm() {
  const { data: user } = trpc.user.getUserProfile.useQuery();
  const { data: departments } = trpc.list.getDepartments.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      designation: user?.designation || "",
      departmentId: user?.departmentId || "",
      dob: !!user?.dob ? new Date(user?.dob) : null,
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    /**
     * TODO: API mutation call to save data.
     */
    console.log(values);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-2 space-y-8">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2">
          <EditName form={form} />
          <EditDesignation form={form} />
          <EditDepartment
            form={form}
            options={departments?.map((dept) => ({
              label: dept.name,
              value: dept.id,
            }))}
          />
          <EditDob form={form} />
          <EditPhoneNumber form={form} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
