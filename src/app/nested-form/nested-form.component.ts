import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { UserData } from '../data.service'; // Import UserData interface

@Component({
  selector: 'app-nested-form',
  standalone: false,
  templateUrl: './nested-form.component.html',
  styleUrls: ['./nested-form.component.scss']
})
export class NestedFormComponent implements OnInit {
  editForm!: FormGroup;
  addForm!: FormGroup;
  selectedUser: UserData | null = null;
  usersData: UserData[] = [];
  activeTab: 'edit' | 'add' = 'edit';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.initializeForms();
    this.loadData();
  }

  private initializeForms() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
    });

    this.addForm = this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  onEditSubmit() {
    if (this.editForm.valid && this.selectedUser) {
      const userData: UserData = {
        id: this.selectedUser.id,
        ...this.editForm.value
      };

      this.dataService.updateUser(userData).subscribe({
        next: () => {
          this.loadData();
          this.editForm.reset();
          this.selectedUser = null;
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }

  onAddSubmit() {
    if (this.addForm.valid) {
      const userData: UserData = {
        id: 0, // This will be set by the server
        ...this.addForm.value
      };

      this.dataService.insertUser(userData).subscribe({
        next: () => {
          this.loadData();
          this.addForm.reset();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        }
      });
    }
  }

  loadData() {
    this.dataService.getData().subscribe({
      next: (data) => {
        this.usersData = data;
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  handleEdit(user: UserData): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name,
      street: user.street,
      city: user.city,
      postalCode: user.postalCode
    });
    this.activeTab = 'edit';
  }

  handleDelete(user: UserData): void {
    this.dataService.deleteUser(user.id).subscribe({
      next: () => {
        this.usersData = this.usersData.filter(u => u.id !== user.id);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }
}
