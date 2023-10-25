"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Cake,
  Edit,
  Fingerprint,
  Mail,
  Phone,
  User,
  UserCog,
  Users2,
  X,
} from "lucide-react";

import { PersonalInfoFormType } from "@/types";

import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import EditPhoneNumber from "./input-fields/edit-phone-number";
import EditDesignation from "./input-fields/edit-designation";
import EditDepartment from "./input-fields/edit-department";
import PersonalInfoField from "./personal-info-field";
import EditName from "./input-fields/edit-name";
import EditDob from "./input-fields/edit-dob";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { trpc } from "@/app/_trpc/client";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  designation: z.string().nullish(),
  departmentId: z.string().nullish(),
  dob: z.date().nullish(),
  phoneNumber: z.string().nullish(),
});

export default function PersonalInformation() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: departments } = trpc.list.getDepartments.useQuery();
  const getuserProfile = trpc.user.getUserProfile.useQuery();

  const { data: user, isFetching } = getuserProfile;

  const fields = useMemo(
    () => [
      {
        id: uuid(),
        icon: User,
        label: "Name",
        value: user?.name,
      },
      {
        id: uuid(),
        icon: Box,
        label: "Designation",
        value: user?.designation,
      },
      {
        id: uuid(),
        icon: Mail,
        label: "Email Address",
        value: user?.email,
      },
      {
        id: uuid(),
        icon: Fingerprint,
        label: "Employee ID",
        value: user?.empId,
      },
      {
        id: uuid(),
        icon: Users2,
        label: "Department",
        value: user?.department,
      },
      {
        id: uuid(),
        icon: UserCog,
        label: "Role",
        value: `${
          user?.role &&
          user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()
        }`,
      },
      {
        id: uuid(),
        icon: Cake,
        label: "Date of Birth",
        value: user?.dob,
      },
      {
        id: uuid(),
        icon: Phone,
        label: "Phone Number",
        value: user?.phoneNumber,
      },
    ],
    [user],
  );

  const initialData = useMemo(
    () => ({
      name: user?.name,
      designation: user?.designation,
      departmentId: user?.departmentId,
      dob: !!user?.dob ? new Date(user?.dob) : undefined,
      phoneNumber: user?.phoneNumber,
    }),
    [user],
  );

  const { mutate: handleEditProfile, isLoading } =
    trpc.user.editPersonalInfo.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: () => {
        setIsEditing(false);
        router.refresh();
      },
      onSettled: () => getuserProfile.refetch(),
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      designation: "",
      departmentId: "",
      dob: !!user?.dob ? new Date(user?.dob) : null,
      phoneNumber: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => handleEditProfile(values),
    [handleEditProfile],
  );

  return (
    <section className="relative p-6 md:p-8 lg:pl-10">
      <h2 className="text-lg font-medium lg:text-xl">Personal Info</h2>
      {!isEditing && (
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-6 md:gap-y-8 lg:gap-x-4 xl:gap-y-10">
          {fields.map((field) => (
            <PersonalInfoField
              key={field.id}
              icon={field.icon}
              label={field.label}
              value={field.value}
              isLoading={isFetching}
            />
          ))}
        </ul>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-2 mt-6 space-y-8"
          >
            <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2">
              <EditName form={form} disabled={isLoading} />
              <EditDesignation form={form} disabled={isLoading} />
              <EditDepartment
                form={form}
                disabled={isLoading}
                options={departments?.map((dept) => ({
                  label: dept.name,
                  value: dept.id,
                }))}
              />
              <EditDob form={form} disabled={isLoading} />
              <EditPhoneNumber form={form} disabled={isLoading} />
            </div>
            <Button type="submit" variant="theme">
              Save
            </Button>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </form>
        </Form>
      )}
      <div
        role="button"
        onClick={() => setIsEditing((prev) => !prev)}
        className="absolute right-5 top-5"
      >
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              {!isEditing ? (
                <Edit className="text-slate-600" />
              ) : (
                <X className="text-slate-600" />
              )}
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{!isEditing ? "Edit information" : "Cancel"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </section>
  );
}
