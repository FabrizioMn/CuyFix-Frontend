import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../core/services/project';
import { Auth } from '../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  projects: Project[] = [];
  userId: number = 1;

  showUserMenu = false;
  userEmail: string = 'Usuario';
  userInitials: string = 'U';

  ngOnInit(): void {
    this.loadProjects();
    this.extractUserIdFromToken();
  }

  private extractUserIdFromToken(): void {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        if (decoded.sub) {
          this.userEmail = decoded.sub;
          this.userInitials = decoded.sub.substring(0, 2).toUpperCase();
        }

        if (decoded.id) {
          this.userId = Number(decoded.id);
        } else if (decoded.jti) {
          this.userId = Number(decoded.jti);
        }
      } catch (error) {
        console.error('Error decodificando el token JWT:', error);
      }
    }
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los proyectos de forma inicial.',
          icon: 'error',
          background: '#0a0a0a',
          color: '#ffffff',
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }

  openCreateModal(): void {
    Swal.fire({
      title: 'Crear Proyecto',
      html: `
        <div class="text-left w-full">
          <p class="text-neutral-400 text-xs mb-4">Completa los campos obligatorios para registrar un nuevo espacio.</p>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Nombre del Proyecto</label>
            <input type="text" id="swal-project-name" class="w-full bg-black border border-neutral-800 rounded-md p-2.5 text-white text-sm focus:border-neutral-500 focus:outline-none transition" placeholder="Ej. Sistema de Logística">
          </div>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Clave (Key - Máx 5 caracteres)</label>
            <input type="text" id="swal-project-key" maxlength="5" class="w-full bg-black border border-neutral-800 rounded-md p-2.5 text-white text-sm focus:border-neutral-500 focus:outline-none uppercase transition" placeholder="Ej. LOG">
          </div>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Descripción</label>
            <textarea id="swal-project-desc" class="w-full bg-black border border-neutral-800 resize-none rounded-md p-2.5 text-white text-sm focus:border-neutral-500 focus:outline-none transition" rows="3" placeholder="Describe brevemente los objetivos..."></textarea>
          </div>
        </div>
      `,
      background: '#0a0a0a',
      color: '#000',
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
        const name = (
          document.getElementById('swal-project-name') as HTMLInputElement
        ).value.trim();
        const key = (document.getElementById('swal-project-key') as HTMLInputElement).value
          .trim()
          .toUpperCase();
        const description = (
          document.getElementById('swal-project-desc') as HTMLTextAreaElement
        ).value.trim();

        if (!name || !key) {
          Swal.showValidationMessage('El nombre y la clave son obligatorios');
          return false;
        }

        if (key.length > 5) {
          Swal.showValidationMessage('La clave (Key) debe tener como máximo 5 caracteres');
          return false;
        }

        return { name, key, description, idIssueScheme: 1, idUser: this.userId };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.projectService.createProject(result.value).subscribe({
          next: (created) => {
            Swal.fire({
              title: '¡Proyecto creado!',
              text: `El proyecto "${created.name}" se registró con éxito.`,
              icon: 'success',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#999999',
            });
            this.loadProjects();
          },
          error: (err) => {
            console.error('Error al crear proyecto', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo crear el proyecto.',
              icon: 'error',
              background: '#0a0a0a',
              color: '#FFFFFF',
              confirmButtonColor: '#ef4444',
            });
          },
        });
      }
    });
  }

  openJoinModal(): void {
    Swal.fire({
      title: 'Unirse a Proyecto',
      html: `
        <div class="text-left w-full">
          <p class="text-neutral-400 text-xs mb-6">Digita el código único de 8 caracteres que te compartió el administrador.</p>
          <div class="mb-4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Código de Invitación</label>
            <input type="text" id="swal-invite-code" class="w-full bg-black border border-neutral-800 rounded-md p-3 text-center text-xl font-mono tracking-widest uppercase text-white focus:border-neutral-500 focus:outline-none transition" maxlength="8" placeholder="A1B2C3D4">
          </div>
        </div>
      `,
      background: '#0a0a0a',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonText: 'Unirme',
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
        const inviteCode = (document.getElementById('swal-invite-code') as HTMLInputElement).value
          .trim()
          .toUpperCase();
        if (!inviteCode) {
          Swal.showValidationMessage('Por favor, ingresa un código de invitación');
          return false;
        }
        return inviteCode;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.projectService.joinProject(result.value, this.userId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Unido con éxito!',
              text: 'Ya formas parte de este proyecto.',
              icon: 'success',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#999999',
            });
            this.loadProjects();
          },
          error: (err) => {
            console.error('Error al unirse al proyecto', err);
            Swal.fire({
              title: 'Error de acceso',
              text: err.error?.message || 'Código inválido o ya eres miembro.',
              icon: 'error',
              background: '#0a0a0a',
              color: '#ffffff',
              confirmButtonColor: '#999999',
            });
          },
        });
      }
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
