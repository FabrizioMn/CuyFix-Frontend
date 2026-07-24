# 🐹 CuyFix - Incident Manager Frontend

[![Angular](https://img.shields.io/badge/Angular-22-dd0031.svg)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06b6d4.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg)](https://incident-manager-g1.vercel.app)

**CuyFix** es una aplicación web moderna de gestión de incidencias y tableros de proyectos construida con **Angular 22**, **Tailwind CSS v4** y **Angular CDK Drag & Drop**. Proporciona una interfaz fluida, interactiva e intuitiva inspirada en flujos de trabajo de herramientas como Jira para equipos de desarrollo ágiles.

---

## 🌐 Enlaces del Proyecto

* **Aplicación desplegada (Vercel):** [https://cuyfix.vercel.app/](https://cuyfix.vercel.app/)
* **API REST Backend (Render):** [https://cuyfix-backend.onrender.com](https://cuyfix-backend.onrender.com)
* **Documentación OpenAPI / Swagger:** [https://cuyfix-backend.onrender.com/swagger-ui.html](https://cuyfix-backend.onrender.com/swagger-ui.html)

---

## ✨ Funcionalidades Principales

- **🎨 Diseño Moderno & Animado:**
  - Landing Page atractiva integrada con efectos 3D dinámicos mediante **Vanta.js (Cells)**.
  - Estilos oscuros elegantes con **Tailwind CSS v4** y personalización mediante CSS variables.
- **🔐 Autenticación & Seguridad:**
  - Formularios reactivos (`ReactiveFormsModule`) para Iniciar Sesión y Registrarse.
  - Protección de rutas mediante **Functional Guards (`CanActivateFn`)**.
  - Inyección de tokens JWT mediante **Functional Interceptors (`HttpInterceptorFn`)**.
  - Persistencia segura de sesiones y extracción de claims con `jwt-decode`.
- **📁 Dashboard de Proyectos:**
  - Vista general de proyectos activos diferenciando roles (`Owner` vs. `Miembro`).
  - Creación interactiva de proyectos con clave personalizada (`KEY`).
  - Unirse a proyectos existentes mediante un **código único de invitación de 8 caracteres**.
- **📋 Tablero Kanban Interactivo:**
  - Movimiento de tareas entre columnas (*Backlog*, *Por Hacer*, *En Progreso*, *Completado*) usando **Drag & Drop** nativo (`@angular/cdk/drag-drop`).
  - Sincronización automática de estado con el backend en cada movimiento.
  - Creación de tareas asignando prioridad (`HIGH`, `MEDIUM`, `LOW`) y tipo (`BUG`, `TASK`, `STORY`).
- **🕒 Trazabilidad y Auditoría:**
  - Modal interactivo alimentado con **SweetAlert2** para consultar el historial detallado de cambios de cada ticket (quién, qué y cuándo modificó).
  - Sección dedicada para revisar y auditar tareas completadas/archivadas.

---

## 🛠️ Tecnologías y Herramientas

| Categoría | Tecnología / Librería |
| :--- | :--- |
| **Framework Frontend** | Angular 19 (Componentes Standalone) |
| **Lenguaje** | TypeScript 5.x |
| **Estilos & UI** | Tailwind CSS v4 + PostCSS |
| **Drag & Drop** | `@angular/cdk/drag-drop` |
| **Manejo de HTTP** | Angular `HttpClient` + Functional Interceptors |
| **Modales & Notificaciones** | SweetAlert2 |
| **Efectos Visuales** | Vanta.js + Three.js |
| **Despliegue** | Vercel |

---

## 📂 Estructura del Proyecto

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/          # AuthGuard para protección de rutas
│   │   ├── interceptors/    # Interceptor HTTP para inyección de JWT Bearer
│   │   └── services/        # Servicios de comunicación API (Auth, Project, Issue)
│   ├── features/
│   │   ├── auth/            # Módulos de Login y Registro
│   │   ├── dashboard/       # Vista principal de gestión de proyectos
│   │   ├── landing/         # Landing Page de presentación
│   │   └── project-board/   # Tablero Kanban Drag & Drop
│   ├── app.config.ts        # Configuración global de Angular (HttpClient, Routes)
│   └── app.routes.ts        # Definición de rutas protegidas
└── environments/            # Configuración de URLs por entorno (environment.ts)
```

---

## 💻 Desarrollo Local

### Prerrequisitos
* **Node.js**: v18.x o superior
* **npm**: v9.x o superior

### Pasos para iniciar:

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone https://github.com/FabrizioMn/Incident-Manager.git
   cd Incident-Manager/frontend/Incident-Manager-FrontEnd
   npm install
   ```

2. **Verificar la URL del Backend en `src/environments/environment.ts`:**
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://cuyfix-backend.onrender.com' // O 'http://localhost:8080' para local
   };
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm start
   # o usando Angular CLI directamente:
   ng serve
   ```

4. Abre tu navegador y navega a `http://localhost:4200/`.

---
