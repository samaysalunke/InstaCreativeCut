import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Project model - represents a video editing project
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  aspectRatio: text("aspect_ratio").default("9:16").notNull(),
  duration: integer("duration").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Store project data as JSON
  data: jsonb("data").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  title: true,
  description: true,
  aspectRatio: true,
  data: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Media model - represents uploaded media files (videos, images, audio)
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // video, image, audio
  name: text("name").notNull(),
  path: text("path").notNull(),
  duration: integer("duration"),
  thumbnailPath: text("thumbnail_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMediaSchema = createInsertSchema(media).pick({
  userId: true,
  type: true,
  name: true,
  path: true,
  duration: true,
  thumbnailPath: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// Template model - represents pre-designed templates
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailPath: text("thumbnail_path").notNull(),
  aspectRatio: text("aspect_ratio").default("9:16").notNull(),
  category: text("category"),
  // Template data stored as JSON
  data: jsonb("data").notNull(),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  title: true,
  description: true,
  thumbnailPath: true,
  aspectRatio: true,
  category: true,
  data: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Define project data structure for type safety
export interface TimelineClip {
  id: string;
  type: 'video' | 'audio' | 'caption';
  name: string;
  start: number; // Start time in the timeline (ms)
  end: number; // End time in the timeline (ms)
  track: number; // Track number
  src?: string; // Source file path
  color?: string; // Color for display
  properties?: {
    text?: string;
    font?: string;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    position?: { x: number, y: number };
    animation?: string;
    [key: string]: any;
  };
}

export interface ProjectData {
  clips: TimelineClip[];
  duration: number;
  selectedClipId?: string;
  activeToolTab: string;
}
