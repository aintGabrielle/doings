// Generated by Xata Codegen 0.28.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "users",
    columns: [
      { name: "user_id", type: "string", unique: true },
      { name: "first_name", type: "string" },
      { name: "last_name", type: "string" },
      { name: "email", type: "string", unique: true },
      { name: "phone", type: "string", unique: true },
      { name: "birthday", type: "datetime" },
    ],
  },
  {
    name: "projects",
    columns: [
      { name: "name", type: "string" },
      { name: "description", type: "text" },
      { name: "owner_id", type: "string" },
      { name: "enrollment_id", type: "string", unique: true },
    ],
    revLinks: [{ column: "project", table: "joined_projects" }],
  },
  {
    name: "tasks",
    columns: [
      { name: "name", type: "string" },
      { name: "short_description", type: "text" },
      { name: "status", type: "string" },
      { name: "event_id", type: "string" },
      { name: "owner_id", type: "string" },
      { name: "project_id", type: "string" },
      { name: "priority_range", type: "string" },
    ],
  },
  {
    name: "events",
    columns: [
      { name: "name", type: "string" },
      { name: "short_description", type: "text" },
      { name: "starting_date", type: "datetime" },
      { name: "ending_date", type: "datetime" },
      { name: "owner_id", type: "string" },
      { name: "priority_range", type: "string" },
    ],
  },
  {
    name: "comments",
    columns: [
      { name: "user_id", type: "string" },
      { name: "task_id", type: "string" },
      { name: "content", type: "text" },
    ],
  },
  {
    name: "joined_projects",
    columns: [
      { name: "owner_id", type: "string" },
      { name: "user_id", type: "string" },
      { name: "project", type: "link", link: { table: "projects" } },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Users = InferredTypes["users"];
export type UsersRecord = Users & XataRecord;

export type Projects = InferredTypes["projects"];
export type ProjectsRecord = Projects & XataRecord;

export type Tasks = InferredTypes["tasks"];
export type TasksRecord = Tasks & XataRecord;

export type Events = InferredTypes["events"];
export type EventsRecord = Events & XataRecord;

export type Comments = InferredTypes["comments"];
export type CommentsRecord = Comments & XataRecord;

export type JoinedProjects = InferredTypes["joined_projects"];
export type JoinedProjectsRecord = JoinedProjects & XataRecord;

export type DatabaseSchema = {
  users: UsersRecord;
  projects: ProjectsRecord;
  tasks: TasksRecord;
  events: EventsRecord;
  comments: CommentsRecord;
  joined_projects: JoinedProjectsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://aintGabrielle-s-workspace-ool6cl.ap-southeast-2.xata.sh/db/doings",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
