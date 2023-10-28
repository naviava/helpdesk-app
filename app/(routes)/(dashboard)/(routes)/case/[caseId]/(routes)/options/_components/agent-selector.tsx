"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/app/_trpc/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  agentEmail: z.string().email(),
  ticketId: z.string().min(1),
});

export default function AgentSelector() {
  const router = useRouter();
  const params = useParams<{ caseId: string }>();

  const { data: agents, isFetching } = trpc.user.getAgents.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentEmail: "",
      ticketId: params.caseId,
    },
  });

  const { mutate: assignTicket, isLoading } =
    trpc.ticket.assignTicket.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: () => {
        router.refresh();
        toast.success("Ticket assigned");
      },
    });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => assignTicket(values),
    [assignTicket],
  );

  if (!params.caseId) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-10 mt-4 space-y-6"
      >
        <FormField
          control={form.control}
          name="agentEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoading || isFetching}>
                    <SelectValue placeholder="Select an agent..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem key={agent.email} value={agent.email}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            variant="theme"
            size="sm"
            disabled={isLoading || isFetching}
          >
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
}
