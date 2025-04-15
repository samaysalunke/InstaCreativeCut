import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  templates, type Template, type InsertTemplate, 
  media, type Media, type InsertMedia
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Template methods
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Media methods
  getAllMedia(): Promise<Media[]>;
  getMedia(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private templates: Map<number, Template>;
  private mediaItems: Map<number, Media>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private templateIdCounter: number;
  private mediaIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.templates = new Map();
    this.mediaItems = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.templateIdCounter = 1;
    this.mediaIdCounter = 1;
    
    // Initialize with some demo templates
    this.initDemoData();
  }
  
  private initDemoData() {
    // Add some default templates
    const defaultTemplates = [
      {
        name: "Instagram Story",
        thumbnail: "/templates/instagram-story.jpg",
        description: "Perfect for vertical Instagram story videos",
        config: JSON.stringify({
          width: 1080,
          height: 1920,
          duration: 15000
        })
      },
      {
        name: "TikTok Video",
        thumbnail: "/templates/tiktok.jpg",
        description: "Vertical format ideal for TikTok content",
        config: JSON.stringify({
          width: 1080,
          height: 1920,
          duration: 60000
        })
      },
      {
        name: "YouTube Short",
        thumbnail: "/templates/youtube-short.jpg",
        description: "Optimized for YouTube Shorts",
        config: JSON.stringify({
          width: 1080,
          height: 1920,
          duration: 60000
        })
      }
    ];
    
    defaultTemplates.forEach(template => {
      this.createTemplate(template);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = { 
      ...projectData, 
      id,
      createdAt: now, 
      updatedAt: now 
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const updatedProject: Project = { 
      ...existingProject, 
      ...projectData,
      updatedAt: new Date()
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<void> {
    if (!this.projects.has(id)) {
      throw new Error(`Project with id ${id} not found`);
    }
    this.projects.delete(id);
  }
  
  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }
  
  async createTemplate(templateData: InsertTemplate): Promise<Template> {
    const id = this.templateIdCounter++;
    const template: Template = { ...templateData, id };
    this.templates.set(id, template);
    return template;
  }
  
  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.mediaItems.values());
  }
  
  async getMedia(id: number): Promise<Media | undefined> {
    return this.mediaItems.get(id);
  }
  
  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const id = this.mediaIdCounter++;
    const now = new Date();
    const media: Media = { 
      ...mediaData, 
      id,
      createdAt: now 
    };
    this.mediaItems.set(id, media);
    return media;
  }
}

export const storage = new MemStorage();
