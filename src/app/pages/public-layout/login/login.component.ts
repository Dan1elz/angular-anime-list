import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  eye: boolean = false;
  typePassword: string = 'password';
  icon: string = 'bi bi-eye-slash';

  hasSuccess: boolean = false;
  hasError: boolean = false;
  message: string = '';

  actor = { email: '', password: '' };

  onSubmit(Event: Event) {
    Event.preventDefault();
    console.log(Event);
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

  CloseAlert() {
    this.hasSuccess = false;
    this.hasError = false;
  }
}
