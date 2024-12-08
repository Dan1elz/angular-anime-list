import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="functions">
      <a routerLink="/auth/home">Home</a>
      <a href="#about">About</a>
      <a href="mailto:danielzanni07@gmail.com">Contact</a>
    </div>
    <div class="line"><div></div></div>
    <div class="social-midia">
      <a target="_blank" href="https://github.com/Dan1elz"
        ><i class="bi bi-github"></i
      ></a>
      <a target="_blank" href="https://www.linkedin.com/in/daniel-zanni/"
        ><i class="bi bi-linkedin"></i
      ></a>
      <a target="_blank" href="https://www.instagram.com/daniel_zanni/"
        ><i class="bi bi-instagram"></i
      ></a>
    </div>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
