import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Issue {
  id?: number;
  ticketCode?: string;
  title: string;
  description: string;
  type: string; // BUG, TASK, STORY
  status: string; // BACKLOG, TODO, IN_PROGRESS, DONE
  priority: string; // HIGH, MEDIUM, LOW
  idProject: number;
  projectKey?: string;
  creatorName?: string;
  assigneeName?: string;
  idCreator?: number;
  idAssignee?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Service()
export class IssueService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/issues`;
  private historiesUrl = `${environment.apiUrl}/api/v1/histories`;

  getIssuesByProject(projectId: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/project/${projectId}`);
  }

  createIssue(issue: any): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue);
  }

  updateIssueStatus(issueId: number, status: string): Observable<Issue> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Issue>(`${this.apiUrl}/${issueId}/status`, {}, { params });
  }

  getIssueHistory(issueId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.historiesUrl}/issue/${issueId}`);
  }
}
