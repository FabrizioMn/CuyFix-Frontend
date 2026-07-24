import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ProjectService, Project } from '../../core/services/project';
import { Issue, IssueService } from '../../core/services/issue';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, RouterLink],
  templateUrl: './project-board.page.html',
  styleUrl: './project-board.page.scss',
})
export class ProjectBoardPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private issueService = inject(IssueService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  projectId!: number;
  project?: Project;
  userId: number = 1;

  // Listas de incidencias para cada columna del Kanban
  backlogList: Issue[] = [];
  todoList: Issue[] = [];
  inProgressList: Issue[] = [];
  doneList: Issue[] = [];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = Number(idParam);
      this.loadProjectDetails();
      this.loadIssues();
    } else {
      this.router.navigate(['/dashboard']);
    }

    this.extractUserId();
  }

  private extractUserId(): void {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.id) {
          this.userId = Number(decoded.id);
        } else if (decoded.jti) {
          this.userId = Number(decoded.jti);
        }
      } catch (error) {
        console.error('Error decodificando token en tablero:', error);
      }
    }
  }

  loadProjectDetails(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.project = projects.find((p) => p.id === this.projectId);
        if (!this.project) {
          this.router.navigate(['/dashboard']);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al recuperar detalles del proyecto:', err);
      },
    });
  }

  loadIssues(): void {
    this.issueService.getIssuesByProject(this.projectId).subscribe({
      next: (issues) => {
        this.backlogList = issues.filter((i) => i.status.toUpperCase() === 'BACKLOG');
        this.todoList = issues.filter((i) => i.status.toUpperCase() === 'TODO');
        this.inProgressList = issues.filter((i) => i.status.toUpperCase() === 'IN_PROGRESS');

        this.doneList = issues.filter((i) => i.status.toUpperCase() === 'DONE');

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar incidencias:', err),
    });
  }

  onDrop(
    event: CdkDragDrop<Issue[]>,
    targetStatus: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE',
  ): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const movedIssue = event.container.data[event.currentIndex];
      if (movedIssue.id) {
        this.issueService.updateIssueStatus(movedIssue.id, targetStatus).subscribe({
          next: (updated) => {
            movedIssue.status = targetStatus;
          },
          error: (err) => {
            console.error('Fallo al actualizar el estado en el servidor:', err);
            this.loadIssues();
            Swal.fire({
              title: 'Error de Sincronización',
              text: 'No se pudo mover la tarea. Verifica tu conexión.',
              icon: 'error',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#ef4444',
            });
          },
        });
      }
    }
  }

  openCreateIssueModal(): void {
    Swal.fire({
      title: 'Crear Incidencia',
      html: `
        <div class="text-left w-full">
          <p class="text-neutral-400 text-xs mb-4">La nueva tarea se registrará automáticamente en la columna de Backlog.</p>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Título del Ticket</label>
            <input type="text" id="swal-issue-title" class="w-full bg-black border border-neutral-800 rounded-md p-2.5 text-white text-sm focus:border-neutral-500 focus:outline-none transition" placeholder="Ej. Implementar login con Google">
          </div>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Tipo de Incidencia</label>
            <select id="swal-issue-type" class="w-full bg-black border border-neutral-800 rounded-md p-2.5 text-white text-sm focus:border-neutral-500 focus:outline-none transition">
              <option value="TASK" selected>TASK (Tarea)</option>
              <option value="BUG">BUG (Error)</option>
              <option value="STORY">STORY (Historia)</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Prioridad</label>
            <select id="swal-issue-priority" class="w-full bg-black border border-neutral-800 rounded-md p-2.5 text-white text-sm focus:border-neutral-500 focus:outline-none transition">
              <option value="LOW">Baja (LOW)</option>
              <option value="MEDIUM" selected>Media (MEDIUM)</option>
              <option value="HIGH">Alta (HIGH)</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Descripción</label>
            <textarea id="swal-issue-desc" class="w-full bg-black border border-neutral-800 rounded-md p-2.5 text-white text-sm focus:border-neutral-500 focus:outline-none transition" rows="3" placeholder="Detalla los requerimientos o pasos para reproducir..."></textarea>
          </div>
        </div>
      `,
      background: '#0a0a0a',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ffffff',
      customClass: {
        popup: 'border border-neutral-800 rounded-lg p-6 shadow-2xl',
        confirmButton:
          'px-4 py-2 bg-white text-black font-semibold rounded-md text-sm hover:bg-neutral-250 transition cursor-pointer mr-3',
        cancelButton:
          'px-4 py-2 border border-neutral-800 text-neutral-400 rounded-md text-sm hover:text-white transition cursor-pointer mr-3',
      },
      buttonsStyling: false,
      focusConfirm: false,
      preConfirm: () => {
        const title = (
          document.getElementById('swal-issue-title') as HTMLInputElement
        ).value.trim();
        const type = (document.getElementById('swal-issue-type') as HTMLSelectElement).value;
        const priority = (document.getElementById('swal-issue-priority') as HTMLSelectElement)
          .value;
        const description = (
          document.getElementById('swal-issue-desc') as HTMLTextAreaElement
        ).value.trim();

        if (!title) {
          Swal.showValidationMessage('El título de la incidencia es obligatorio');
          return false;
        }

        return {
          title,
          description,
          type,
          priority,
          idProject: this.projectId,
          idCreator: this.userId,
          // Por defecto la API asignará "Unassigned" y status "BACKLOG"
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.issueService.createIssue(result.value).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Incidencia Creada!',
              text: 'Se ha registrado la tarea en el Backlog.',
              icon: 'success',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#999999',
            });
            this.loadIssues();
          },
          error: (err) => {
            console.error('Error al registrar incidencia:', err);
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'No se pudo crear la tarea.',
              icon: 'error',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#ef4444',
            });
          },
        });
      }
    });
  }

  confirmDeleteProject(): void {
    if (!this.project || !this.projectId) return;

    Swal.fire({
      title: '¿Estás completamente seguro?',
      text: `Esta acción es irreversible. Se eliminará de forma permanente el proyecto "${this.project.name}", junto con todas sus incidencias asociadas y el historial de cambios.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar proyecto',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      background: '#0a0a0a',
      color: '#ffffff',
      customClass: {
        popup: 'border border-neutral-800 rounded-lg p-6 shadow-2xl',
        confirmButton:
          'px-4 py-2 bg-red-600 text-white font-semibold rounded-md text-sm hover:bg-red-500 transition cursor-pointer mr-3',
        cancelButton:
          'px-4 py-2 border border-neutral-800 text-neutral-400 rounded-md text-sm hover:text-white transition cursor-pointer mr-3',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor, espera un momento.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          background: '#0a0a0a',
          color: '#ffffff',
        });

        this.projectService.deleteProject(this.projectId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Proyecto Eliminado!',
              text: 'El espacio de trabajo ha sido removido con éxito.',
              icon: 'success',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#999999',
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          },
          error: (err) => {
            console.error('Error al intentar eliminar el proyecto:', err);
            Swal.fire({
              title: 'Error de servidor',
              text: 'No se pudo eliminar el proyecto en este momento.',
              icon: 'error',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#ef4444',
            });
          },
        });
      }
    });
  }

  openIssueHistory(issueId: number, issueTitle: string): void {
    this.issueService.getIssueHistory(issueId).subscribe({
      next: (logs) => {
        let historyHtml =
          '<div class="text-left space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">';

        if (logs.length === 0) {
          historyHtml +=
            '<p class="text-neutral-500 text-xs text-center py-4">No hay cambios registrados para esta incidencia todavía.</p>';
        } else {
          logs.forEach((log) => {
            const date = new Date(log.changedAt).toLocaleString();
            historyHtml += `
            <div class="border-b border-neutral-900 pb-2 mb-2 text-xs">
              <span class="text-neutral-500 font-mono">[${date}]</span> 
              <strong class="text-white">${log.userName}</strong> modificó 
              <span class="text-amber-400 font-semibold">${log.changedField}</span>: 
              <span class="text-red-400 line-through">${log.oldValue || 'N/A'}</span> &rarr; 
              <span class="text-emerald-400 font-bold">${log.newValue}</span>
            </div>
          `;
          });
        }
        historyHtml += '</div>';

        Swal.fire({
          title: `Historial: ${issueTitle}`,
          html: historyHtml,
          background: '#0a0a0a',
          color: '#ffffff',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#ffffff',
          customClass: {
            popup: 'border border-neutral-800 rounded-lg p-6 shadow-2xl',
            confirmButton:
              'px-4 py-2 bg-white text-black font-semibold rounded-md text-sm hover:bg-neutral-250 transition cursor-pointer',
          },
          buttonsStyling: false,
        });
      },
      error: (err) => console.error('Error al traer historial:', err),
    });
  }

  openArchivedProjectsModal(): void {
    let archivedHtml =
      '<div class="text-left space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">';

    if (this.doneList.length === 0) {
      archivedHtml +=
        '<p class="text-neutral-500 text-xs text-center py-4">No hay tareas archivadas en este proyecto.</p>';
    } else {
      this.doneList.forEach((issue) => {
        archivedHtml += `
          <div class="bg-black border border-neutral-800 rounded-md p-3 flex justify-between items-center group">
            <div>
              <span class="text-[10px] font-mono text-neutral-500 border border-neutral-900 px-1.5 py-0.5 rounded bg-neutral-950">${issue.ticketCode}</span>
              <h4 class="text-sm font-semibold text-neutral-200 mt-1">${issue.title}</h4>
            </div>
            <button onclick="window.angularComponentReference.viewLog(${issue.id}, '${issue.title}')" class="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-800 rounded transition cursor-pointer">
              Ver Auditoría
            </button>
          </div>
        `;
      });
    }
    archivedHtml += '</div>';

    Swal.fire({
      title: 'Historial de Tareas Completadas',
      html: archivedHtml,
      background: '#0a0a0a',
      color: '#ffffff',
      confirmButtonText: 'Volver',
      confirmButtonColor: '#ffffff',
      customClass: {
        popup: 'border border-neutral-800 rounded-lg p-6 shadow-2xl',
        confirmButton:
          'px-4 py-2 bg-white text-black font-semibold rounded-md text-sm hover:bg-neutral-250 transition cursor-pointer',
      },
      buttonsStyling: false,
      didOpen: () => {
        (window as any).angularComponentReference = {
          viewLog: (id: number, title: string) => this.openIssueHistory(id, title),
        };
      },
    });
  }
}
