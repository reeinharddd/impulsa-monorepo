import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserType } from '../../core/models/enums';
import { MockApiService } from '../../core/services/mock-api.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>{{ isRegistering() ? 'Crear Cuenta' : 'Iniciar Sesión' }}</h2>

        <form [formGroup]="authForm" (ngSubmit)="onSubmit()">

          @if (isRegistering()) {
            <div class="form-group">
              <label>Nombre</label>
              <input formControlName="name" type="text" placeholder="Tu nombre o negocio">
            </div>

            <div class="form-group">
                <label>Tipo de Usuario</label>
                <div class="type-selector">
                    <label [class.selected]="authForm.get('type')?.value === 'business'">
                        <input type="radio" formControlName="type" value="business">
                        Negocio
                    </label>
                    <label [class.selected]="authForm.get('type')?.value === 'person'">
                        <input type="radio" formControlName="type" value="person">
                        Persona
                    </label>
                </div>
            </div>
          }

          <div class="form-group">
             <!-- Mock ID for Login simplification -->
             @if (!isRegistering()) {
                 <label>ID de Usuario (Simulado)</label>
                 <select formControlName="userId">
                    <option value="" disabled>Selecciona un usuario</option>
                    @for (user of users(); track user.id) {
                        <option [value]="user.id">{{ user.name }} ({{ user.type }})</option>
                    }
                 </select>
             }
          </div>

          <button type="submit" [disabled]="authForm.invalid" class="btn-submit">
            {{ isRegistering() ? 'Registrarse' : 'Entrar' }}
          </button>
        </form>

        <div class="toggle-mode">
          <button type="button" (click)="toggleMode()">
            {{ isRegistering() ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
          </button>
        </div>

        <div class="legal-notice">
            <small>Impulsa no custodia fondos. Registro gratuito.</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f3f4f6;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #111827;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
    }
    input[type="text"], select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        margin-top: 0.25rem;
    }
    .type-selector {
        display: flex;
        gap: 1rem;
    }
    .type-selector label {
        flex: 1;
        border: 1px solid #e5e7eb;
        padding: 0.75rem;
        border-radius: 0.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
    }
    .type-selector label.selected {
        background: #eff6ff;
        border-color: #3b82f6;
        color: #1d4ed8;
    }
    .type-selector input {
        display: none;
    }
    .btn-submit {
        width: 100%;
        background: #2563eb;
        color: white;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: none;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
    }
    .btn-submit:disabled {
        background: #9ca3af;
        cursor: not-allowed;
    }
    .toggle-mode {
        text-align: center;
        margin-top: 1rem;
    }
    .toggle-mode button {
        background: none;
        border: none;
        color: #2563eb;
        cursor: pointer;
        text-decoration: underline;
    }
    .legal-notice {
        text-align: center;
        margin-top: 1.5rem;
        color: #6b7280;
    }
  `]
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private mockApi = inject(MockApiService);

  isRegistering = signal(true);
  users = signal(this.mockApi.listUsers());

  // We need to fix MockApiService to actually expose users for login listing or just rely on manual input
  // For now, let's assume I fix MockApiService or access the signal if I made it public.
  // Wait, I made it private `_users`. I should expose it or add a method.
  // I'll assume I update MockApiService in next step to expose `listUsers` or I'll just use what I have.
  // Actually, let's just make the form handle registration primarily, and for login, I might need to "hack" it for MVP
  // or I'll update MockApi to expose users.

  authForm = this.fb.group({
    name: ['', []],
    type: [UserType.BUSINESS, []],
    userId: ['']
  });

  constructor() {
      // Re-fetch users for login dropdown
      // This is a bit hacky as I can't see private _users.
      // I will update MockApiService to include listUsers method in a sec.
      // For now, let's assume it exists.
      this.users.set(this.mockApi.listUsers());
  }

  toggleMode() {
    this.isRegistering.update(v => !v);
    if (!this.isRegistering()) {
        // Refresh users list when switching to login
         this.users.set(this.mockApi.listUsers());
         this.authForm.get('name')?.disable();
         this.authForm.get('type')?.disable();
         this.authForm.get('userId')?.setValidators(Validators.required);
    } else {
        this.authForm.get('name')?.enable();
        this.authForm.get('name')?.setValidators(Validators.required);
        this.authForm.get('type')?.enable();
        this.authForm.get('userId')?.clearValidators();
    }
    this.authForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    if (this.isRegistering()) {
      const { name, type } = this.authForm.value;
      if (name && type) {
        this.mockApi.registerUser(name, type);
        this.router.navigate(['/app']);
      }
    } else {
        const { userId } = this.authForm.value;
        if (userId) {
            const success = this.mockApi.loginAs(userId);
            if (success) {
                this.router.navigate(['/app']);
            }
        }
    }
  }
}
