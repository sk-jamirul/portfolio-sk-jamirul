import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

// Profile table
export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  qualification: varchar("qualification", { length: 255 }).notNull(),
  qualify_des: varchar("qualify_des", { length: 255 }).notNull(),
  profileUrl: text("profile_url").notNull(),
});

// Services table (many services to one profile)
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  des: varchar("des", { length: 255 }).notNull(),
  profileId: uuid("profile_id").references(() => profile.id), // FK
});

// Projects table (many projects to one profile)
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull().default("facebook"),
  url: text("url").notNull(),
  profileId: uuid("profile_id").references(() => profile.id), // FK
});

// Contact Icons table (many icons to one profile)
export const contactIcons = pgTable("contact_icons", {
  id: uuid("id").primaryKey().defaultRandom(),
  icon: text("icon").notNull(),
  link: text("link").notNull(),
  profileId: uuid("profile_id").references(() => profile.id), // FK
});

export const profileRelations = relations(profile, ({ many }) => ({
  services: many(services),
  projects: many(projects),
  contactIcons: many(contactIcons),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  profile: one(profile, {
    fields: [services.profileId],
    references: [profile.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  profile: one(profile, {
    fields: [projects.profileId],
    references: [profile.id],
  }),
}));

export const contactIconsRelations = relations(contactIcons, ({ one }) => ({
  profile: one(profile, {
    fields: [contactIcons.profileId],
    references: [profile.id],
  }),
}));
