import axios from './api/index'

export interface DSSProjectSummary {
  projectKey: string
  name?: string
  shortDesc?: string
  owner?: string
  [k: string]: unknown
}

export interface LLMItem {
  id: string
  type: string
  description?: string
}

export const API = {
  getProjects: () => axios.get<DSSProjectSummary[]>('/api/projects'),
  getLLMs: () => axios.get<LLMItem[]>('/api/llms'),
}
