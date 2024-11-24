import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  search: string = '';
  dropdown: boolean = false;

  onDropdown() {
    this.dropdown = !this.dropdown;
  }

  onSendSearch() {}

  onDisconnect() {}
}
