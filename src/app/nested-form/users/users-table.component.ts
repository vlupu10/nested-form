import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserData } from '../../data.service';

@Component({
  selector: 'app-users-table',
  standalone: false,
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  @Input() users: UserData[] = [];
  @Output() editUser = new EventEmitter<UserData>();
  @Output() deleteUser = new EventEmitter<UserData>();

  onEdit(user: UserData): void {
    this.editUser.emit(user);
  }

  onDelete(user: UserData): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.deleteUser.emit(user);
    }
  }
}
