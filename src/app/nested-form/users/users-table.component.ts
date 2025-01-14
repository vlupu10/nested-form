import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserData } from '../../data.service';

type SortColumn = 'id' | 'name' | 'street' | 'city' | 'postalCode';
type SortDirection = 'asc' | 'desc' | 'none';

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

  sortColumn: SortColumn | null = null;
  sortDirection: SortDirection = 'none';

  onEdit(user: UserData): void {
    this.editUser.emit(user);
  }

  onDelete(user: UserData): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.deleteUser.emit(user);
    }
  }

  sort(column: SortColumn): void {
    if (this.sortColumn === column) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = 'none';
        this.sortColumn = null;
      } else {
        this.sortDirection = 'asc';
        this.sortColumn = column;
      }
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (this.sortDirection === 'none') {
      this.users = [...this.users].sort((a, b) => a.id - b.id);
    } else {
      this.users = [...this.users].sort((a, b) => {
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        if (a[column] < b[column]) return -1 * direction;
        if (a[column] > b[column]) return 1 * direction;
        return 0;
      });
    }
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) return '↕️';
    switch (this.sortDirection) {
      case 'asc': return '↑';
      case 'desc': return '↓';
      default: return '↕️';
    }
  }
}
