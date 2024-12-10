import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [FormsModule, NgClass, RouterModule],
    template: `
    <div class="nav-items-left">
      <a routerLink="/auth/home"
        ><i class="bi bi-house"></i><span>Home</span></a
      >
      <a routerLink="/auth/favorites"
        ><i class="bi bi-heart"></i><span>Favorites</span></a
      >
      <a routerLink="/auth/categories"
        ><i class="bi bi-ui-checks-grid"></i><span>Categories</span></a
      >
      <a routerLink="/auth/add-anime"><i class="bi bi-bookmark-plus"></i></a>
    </div>
    <div class="nav-items-right">
      <div class="search">
        <input
          type="text"
          [(ngModel)]="search"
          (keydown.enter)="onSendSearch()"
          placeholder="Search anime..."
        />
        <button (click)="onSendSearch()"><i class="bi bi-search"></i></button>
      </div>
      <div class="person">
        <span (click)="onDropdown()" class="person-icon"
          ><i class="bi bi-person"></i
        ></span>

        <div class="dropdown" [ngClass]="{ open: dropdown }">
          <a routerLink="/auth/profile"
            ><span><i class="bi bi-person"></i></span>Profile</a
          >
          <a routerLink="/auth/settings"
            ><span><i class="bi bi-gear"></i></span>Settings</a
          >
          <a (click)="onDisconnect()"
            ><span><i class="bi bi-box-arrow-right"></i></span>Logout</a
          >
        </div>
      </div>
    </div>
  `,
    styleUrl: './navbar.component.scss'
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
