import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import {
  UpdateDTO,
  UserDTO,
} from '../../../core/interfaces/user-dto.interface';
import { DataItemComponent } from './components/data-item/data-item.component';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DataItemComponent, AsyncPipe, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [DatePipe],
})
export class ProfileComponent implements OnInit {
  private service = inject(UserService);
  user$!: Observable<UserDTO>;
  @ViewChild('modal') modal!: ElementRef;

  ngOnInit(): void {
    this.user$ = this.service.onGetUser();
  }

  constructor(private datePipe: DatePipe) {}
  Logout() {
    this.service.onLogout();
  }

  onSubmit(event: any, campo: string, user: UserDTO) {
    const update: UpdateDTO = { ...user, [campo]: event };
    this.service.onUpdate(update).subscribe({
      next: (response) => {
        this.user$ = this.service.onGetUser();
      },
    });
  }

  onDelete() {
    this.service.onDelete().subscribe({
      next: (response) => {
        this.service.onLogout();
      },
    });
  }

  onFormatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM d, y, h:mm a') || '';
  }

  onOpenModal() {
    this.modal.nativeElement.showModal();
    this.modal.nativeElement.classList.add('active');
  }
  onCloseModal() {
    this.modal.nativeElement.classList.remove('active');
    this.modal.nativeElement.close();
  }
}
