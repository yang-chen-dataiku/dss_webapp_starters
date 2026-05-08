import axios from "./api/index";

// DSS project summary returned by dataiku.api_client().list_projects()
export interface DSSProjectSummary {
  projectKey: string;
  name?: string;
  [k: string]: any;
}

// LLM returned by project.list_llms()
export interface LLMItem {
  id: string;
  type: string;
  description?: string;
}

export const API = {
  getProjects: () => axios.get<DSSProjectSummary[]>("/api/projects"),
  getLLMs: () => axios.get<LLMItem[]>("/api/llms"),
};
