import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserDTO } from '../../../core/interfaces/user-dto.interface';
import { DataItemComponent } from './components/data-item/data-item.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DataItemComponent, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private service = inject(UserService);
  user$!: Observable<UserDTO>;
  @ViewChild('modal') modal!: ElementRef;

  ngOnInit(): void {
    this.user$ = this.service.onGetUser();
  }
  Logout() {}

  onSubmit(event: any, campo: string) {
    // if (campo === 'name') {
    //   this.user.name = event;
    // } else if (campo === 'lastname') {
    //   this.user.lastname = event;
    // } else if (campo === 'username') {
    //   this.user.username = event;
    // }
  }

  onDelete(id: string) {}

  onOpenModal() {
    this.modal.nativeElement.showModal();
    this.modal.nativeElement.classList.add('active');
  }
  onCloseModal() {
    this.modal.nativeElement.classList.remove('active');
    this.modal.nativeElement.close();
  }
}
