import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var VANTA: any;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage implements OnDestroy {
  private authService = inject(Auth);
  private router = inject(Router);
  private vantaEffect: any;

  registerForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.getRawValue();

      const userData = {
        ...formValues,
        idRol: 2,
      };

      console.log('Json estructuado:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('¡Usuario registrado y logueado!', response);
          this.router.navigate(['/dashboard']); // Directo al tablero sin escalas
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          alert('No se pudo crear la cuenta. Es posible que el correo ya esté en uso.');
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}
