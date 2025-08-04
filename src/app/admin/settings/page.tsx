"use client";

import { socials } from "@/app/constants";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrUpdateInfo, getAllInfo } from "@/server/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  qualification: z.string().min(1, "Qualification is required"),
  qualify_des: z.string().min(1, "Qualification description is required"),
  profileUrl: z.url("Must be a valid URL"),

  services: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        des: z.string().min(1, "Description is required"),
      })
    )
    .min(1, "At least one service is required"),

  projects: z
    .array(
      z.object({
        type: z.string(),
        url: z.url("Must be a valid URL"),
      })
    )
    .min(1, "At least one project is required"),

  contactIcons: z
    .array(
      z.object({
        icon: z.string().min(1, "Icon name is required"),
        link: z.url("Must be a valid URL"),
      })
    )
    .min(1, "At least one contact icon is required"),
});

export type ProfileFormType = z.infer<typeof profileFormSchema>;

import React from "react";

const defaultValues = {
  name: "",
  qualification: "",
  qualify_des: "",
  profileUrl: "",
  services: [{ title: "", des: "" }],
  projects: [{ type: "", url: "" }],
  contactIcons: [{ icon: "", link: "" }],
};
export default function Page() {
  const { isPending, error, data } = useQuery({
    queryKey: ["form-data"],
    queryFn: () => getAllInfo(),
  });

  if (isPending) {
    return <div className="text-center">Fetching...</div>;
  }

  if (error) {
    return <div className="text-center">Error Occurs</div>;
  }
  return (
    <div>
      {data.info ? (
        <FullProfileForm data={data.info} />
      ) : (
        <FullProfileForm data={defaultValues} />
      )}
    </div>
  );
}

function FullProfileForm({ data }: { data: ProfileFormType }) {
  const mutation = useMutation({
    mutationFn: createOrUpdateInfo,
    onSuccess: ({ type }) => {
      toast.success(type);
    },
  });
  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: data,
  });

  const { control, handleSubmit } = form;
  const serviceArray = useFieldArray({ control, name: "services" });
  const projectArray = useFieldArray({ control, name: "projects" });
  const iconArray = useFieldArray({ control, name: "contactIcons" });

  const onSubmit = (data: ProfileFormType) => {
    console.log("Validated JSON Data:", data);
    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Profile Form
      </h1>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Profile Info */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Profile Info</h2>
            {(
              ["name", "qualification", "qualify_des", "profileUrl"] as const
            ).map((field) => (
              <FormField
                key={field}
                control={control}
                name={field}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={`Enter ${field.name}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </section>

          {/* Section: Services */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Services</h2>
            {serviceArray.fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
              >
                <FormField
                  control={control}
                  name={`services.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Service Title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={`services.${index}.des`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Service Description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => serviceArray.remove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => serviceArray.append({ title: "", des: "" })}
            >
              + Add Service
            </Button>
          </section>

          {/* Section: Projects */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            {projectArray.fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
              >
                <FormField
                  control={control}
                  name={`projects.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          {...field}
                          placeholder="Facebook Video / Reel only"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={`projects.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => projectArray.remove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => projectArray.append({ type: "", url: "" })}
            >
              + Add Project
            </Button>
          </section>

          {/* Section: Contact Icons */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Icons</h2>
            {iconArray.fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
              >
                <FormField
                  control={control}
                  name={`contactIcons.${index}.icon`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Social" />
                          </SelectTrigger>
                          <SelectContent>
                            {socials.map((item) => (
                              <SelectItem value={item} key={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={`contactIcons.${index}.link`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => iconArray.remove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => iconArray.append({ icon: "", link: "" })}
            >
              + Add Contact Icon
            </Button>
          </section>

          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full mt-6"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
