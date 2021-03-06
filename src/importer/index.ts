import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import glob from "glob";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

export type Section = {
  type: "directory" | "heading" | "document";
  path: string;
  label: string;
  create: string;
  match: string;
  exclude: string;
  templates: string[];
  new_doc_ext: string;
  read_only: boolean;
};

export type Build = {
  preview_env: string[];
  preview_output_directory: string;
  preview_docker_image: string;
  mount_path: string;
  instant_preview_command: string;
};

export type Settings = {
  new_page_extension: string;
  auto_deploy: boolean;
  admin_path: string;
  webhook_url: string;
  sections: Section[];
  upload_dir: string;
  public_path: string;
  front_matter_path: string;
  use_front_matter_path: string;
  file_template: string;
  build: Build;
  version: string;
};

export type Page = {
  data: any;
  content: string;
  format: string;
  type: string;
  checksum: string;
  path: string;
};

export const readSettings = (projectPath: string): Settings => {
  const settingsFile = path.join(projectPath, ".forestry", "settings.yml");
  return yaml.safeLoad(fs.readFileSync(settingsFile).toString()) as Settings;
};

export const handleDirectory = (
  rootPath: string,
  dirPath: string,
  matchPattern: string
) => {
  const matches = glob.sync(path.join(rootPath, dirPath, matchPattern));
  matches.map((filePath: string) => {
    const file = matter.read(filePath);
    doIndex("project", file); // TODO: index name
  });
};

export const handleDocument = (rootPath: string, documentPath: string) => {
  const file = matter.read(path.join(rootPath, documentPath));
  doIndex("project", file); // TODO: index name
};

export const handleTemplates = (rootPath: string) => {
  const matches = glob.sync(
    path.join(rootPath, ".forestry", "front_matter", "templates", "*.yml")
  );
  matches.map((filePath: string) => {
    const file = matter.read(filePath);
    doIndex("project-templates", file);
  });
};

export const handleSettings = (rootPath: string) => {
  const file = matter.read(path.join(rootPath, ".forestry", "settings.yml"));
  doIndex("project-settings", file);
};

const client = new Client({ node: "http://localhost:9200" });
export const doIndex = async (index: string, doc: any) => {
  await client.index({ index, body: doc });
};
