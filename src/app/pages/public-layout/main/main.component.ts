import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <app-navbar />
    <router-outlet />
  `,
  styles: `
  :host {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var( --bg-primary);
  }

  `,
})
export class MainComponent {}
