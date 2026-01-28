import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MockApiService } from '@core/services/auth/mock-api.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <div class="logo">IMPULSA</div>
        <div class="user-info">
          @if (currentUser(); as user) {
            <span>{{ user.name }} ({{ user.type === 'business' ? 'Negocio' : 'Persona' }})</span>
          }
          <button (click)="logout()" class="btn-logout">Salir</button>
        </div>
      </header>

      <main class="app-content">
        <router-outlet></router-outlet>
      </main>

      <nav class="bottom-nav">
        @if (currentUser()?.type === 'business') {
          <a routerLink="/app/business/sale" routerLinkActive="active">Venta</a>
          <a routerLink="/app/business/inventory" routerLinkActive="active">Inventario</a>
        } @else {
          <a routerLink="/app/person/charge" routerLinkActive="active">General Cobro</a>
          <a routerLink="/app/person/history" routerLinkActive="active">Historital</a>
        }
      </nav>
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .app-header {
        background: #111827;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo {
        font-weight: 800;
        letter-spacing: -0.5px;
      }
      .app-content {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        background: #f9fafb;
      }
      .bottom-nav {
        background: white;
        border-top: 1px solid #e5e7eb;
        display: flex;
        padding: 1rem;
        justify-content: space-around;
      }
      .bottom-nav a {
        color: #6b7280;
        text-decoration: none;
        font-weight: 500;
      }
      .bottom-nav a.active {
        color: #2563eb;
        font-weight: 700;
      }
      .btn-logout {
        background: none;
        border: 1px solid #374151;
        color: #9ca3af;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class AppShellComponent {
  mockApi = inject(MockApiService);
  router = inject(Router);
  currentUser = this.mockApi.currentUser;

  logout() {
    this.mockApi.logout();
    this.router.navigate(['/auth']);
  }
}
