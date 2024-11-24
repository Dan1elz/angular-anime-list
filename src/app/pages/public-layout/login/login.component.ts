import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import {
  LoginDTO,
  RegisterDTO,
} from '../../../core/interfaces/user-dto.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly service = inject(UserService);

  eye: boolean = false;
  typePassword: string = 'password';
  icon: string = 'bi bi-eye-slash';

  hasSuccess: boolean = false;
  hasError: boolean = false;
  message: string = '';

  actor: LoginDTO = { email: 'danielzanni07@gmail.com', password: '12312312' };

  onSubmit(Event: Event) {
    Event.preventDefault();

    this.service.onLogin(this.actor).subscribe({
      next: (response) => {
        this.message = 'User logged successfully';
        this.onOpenSuccess();
      },
      error: (error) => {
        this.message = `error logging in user, check the data!`;
        console.log(error.error.message);
        this.onOpenError();
      },
    });
  }

  onEye() {
    this.eye = !this.eye;
    if (this.eye) {
      this.typePassword = 'text';
      this.icon = 'bi bi-eye';
    } else {
      this.typePassword = 'password';
      this.icon = 'bi bi-eye-slash';
    }
  }

  onOpenError() {
    this.hasError = true;
    setTimeout(() => (this.hasError = false), 5000);
  }
  onOpenSuccess() {
    this.hasSuccess = true;
    setTimeout(() => (this.hasSuccess = false), 5000);
  }
  CloseAlert() {
    this.hasSuccess = false;
    this.hasError = false;
  }
}
