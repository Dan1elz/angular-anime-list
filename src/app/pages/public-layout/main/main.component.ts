import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
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
