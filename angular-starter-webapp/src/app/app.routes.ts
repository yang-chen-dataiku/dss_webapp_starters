import { Routes } from '@angular/router'
import { ProjectsComponent } from './views/projects/projects.component'
import { ProjectComponent } from './views/project/project.component'
import { LLMsComponent } from './views/llms/llms.component'

export const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'projects/:projectKey', component: ProjectComponent },
  { path: 'llms', component: LLMsComponent },
  { path: 'fetch', redirectTo: '' },
  { path: 'fetch/**', redirectTo: '' },
  { path: '**', redirectTo: '' },
]
