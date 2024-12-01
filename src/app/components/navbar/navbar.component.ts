import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly service = inject(UserService);
  search: string = '';
  dropdown: boolean = false;

  onDropdown() {
    this.dropdown = !this.dropdown;
  }

  onSendSearch() {}

  onDisconnect() {
    this.service.onLogout();
  }
}
