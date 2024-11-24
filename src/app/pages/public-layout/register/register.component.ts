import { NgClass } from '@angular/common';
import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formData = {
    name: 'Daniel',
    lastname: 'Zanni',
    email: 'danielzanni07@gmail.com',
    password: '12312312',
    confirmPassword: '12312312',
  };

  eye: boolean[] = [false, false];
  typePassword: string[] = ['password', 'password'];
  icon: string[] = ['bi bi-eye-slash', 'bi bi-eye-slash'];

  hasError: boolean = false;
  hasSuccess: boolean = false;
  message: string = '';

  onSubmit(Event: Event) {
    Event.preventDefault();
    if (this.formData.password !== this.formData.confirmPassword) {
      this.message = 'Passwords do not match';
      this.onOpenError();
    } else {
      this.CloseAlert();
    }
  }

  onEye(i: number) {
    this.eye[i] = !this.eye[i];
    if (this.eye[i]) {
      this.typePassword[i] = 'text';
      this.icon[i] = 'bi bi-eye';
    } else {
      this.typePassword[i] = 'password';
      this.icon[i] = 'bi bi-eye-slash';
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
    this.message = '';
    this.hasError = false;
    this.hasSuccess = false;
  }
}
