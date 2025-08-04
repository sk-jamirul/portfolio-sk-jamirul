"use server";

import { ProfileFormType } from "@/app/admin/settings/page";
import { db } from "@/drizzle/db";
import { contactIcons, profile, projects, services } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";

export async function getAllInfo() {
  const [data] = await db.query.profile.findMany({
    with: {
      projects: { columns: { type: true, url: true } },
      contactIcons: { columns: { icon: true, link: true } },
      services: { columns: { des: true, title: true } },
    },
    columns: { id: false },
  });
  return { info: data };
}

export async function createOrUpdateInfo(info: ProfileFormType) {
  const [{ exist }] = await db.select({ exist: count() }).from(profile);

  if (!exist) {
    // Create new profile
    const [createdProfile] = await db
      .insert(profile)
      .values({
        name: info.name,
        qualification: info.qualification,
        qualify_des: info.qualify_des,
        profileUrl: info.profileUrl,
      })
      .returning({ id: profile.id });

    const profileId = createdProfile.id;

    if (info.services.length) {
      await db.insert(services).values(
        info.services.map((s) => ({
          ...s,
          profileId,
        }))
      );
    }

    if (info.projects.length) {
      await db.insert(projects).values(
        info.projects.map((p) => ({
          ...p,
          profileId,
        }))
      );
    }

    if (info.contactIcons.length) {
      await db.insert(contactIcons).values(
        info.contactIcons.map((c) => ({
          ...c,
          profileId,
        }))
      );
    }

    return { success: true, type: "created" };
  }

  // Update existing profile
  const [existingProfile] = await db.select().from(profile).limit(1);
  const profileId = existingProfile.id;

  await db
    .update(profile)
    .set({
      name: info.name,
      qualification: info.qualification,
      qualify_des: info.qualify_des,
      profileUrl: info.profileUrl,
    })
    .where(eq(profile.id, profileId));

  // Delete old services, projects, contactIcons
  await db.delete(services).where(eq(services.profileId, profileId));
  await db.delete(projects).where(eq(projects.profileId, profileId));
  await db.delete(contactIcons).where(eq(contactIcons.profileId, profileId));

  // Insert new ones
  if (info.services.length) {
    await db.insert(services).values(
      info.services.map((s) => ({
        ...s,
        profileId,
      }))
    );
  }

  if (info.projects.length) {
    await db.insert(projects).values(
      info.projects.map((p) => ({
        ...p,
        profileId,
      }))
    );
  }

  if (info.contactIcons.length) {
    await db.insert(contactIcons).values(
      info.contactIcons.map((c) => ({
        ...c,
        profileId,
      }))
    );
  }

  return { success: true, type: "updated" };
}
