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
