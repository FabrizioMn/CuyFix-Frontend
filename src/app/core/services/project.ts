import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  id?: number;
  name: string;
  key: string;
  description: string;
  idIssueScheme: number;
  inviteCode?: string;
  createdAt?: string;
  idUser?: number;
  userName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/projects`;
  private membersUrl = `${environment.apiUrl}/api/v1/project-members`;

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  joinProject(inviteCode: string, idUser: number): Observable<any> {
    const params = new HttpParams().set('inviteCode', inviteCode).set('idUser', idUser.toString());

    return this.http.post<any>(`${this.membersUrl}/join`, {}, { params });
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
