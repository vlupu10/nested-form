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
  userForm!: FormGroup;
  userData: UserData | null = null;
  usersData: UserData[] = [];
  ready = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.userData = {
      id: 0,
      name: '',
      city: '',
      street: '',
      postalCode: ''
    };
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
    this.dataService.getData().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.usersData = data;
          this.userData = data[0];
          this.ready = true;
          this.userForm = this.fb.group({
            name: [this.userData?.name, Validators.required],
            street: [this.userData?.street, Validators.required],
            city: [this.userData?.city, Validators.required],
            postalCode: [this.userData?.postalCode, Validators.required],
          });
        } else {
          this.userForm = this.fb.group({
            name: ['', Validators.required],
            street: [this.userData?.street, Validators.required],
            city: [this.userData?.city, Validators.required],
            postalCode: [this.userData?.postalCode, Validators.required],
          });
        }
      },
      error: (error) => {
        // Handle error gracefully (e.g., display an error message to the user)
        this.userForm = this.fb.group({
          name: ['', Validators.required],
          street: ['', Validators.required],
          city: ['', Validators.required],
          postalCode: ['', Validators.required],
        });
      }
    });
  }

  get name() {
    return this.userForm.get('name');
  }

  get street() {
    return this.userForm.get('street');
  }
  get city() {
    return this.userForm.get('city');
  }
  get postalCode() {
    return this.userForm.get('postalCode');
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData: UserData = {
        id: this.userData?.id ?? 0,
        name: this.userForm.value.name,
        street: this.userForm.value.street,
        city: this.userForm.value.city,
        postalCode: this.userForm.value.postalCode
      };

      this.dataService.insertUser(userData).subscribe({
        next: (response) => {
          // Refresh the data after successful insertion
          this.loadData(); // Method to fetch updated data
        },
        error: (error) => {
          console.error('Error:', error);
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
    this.userData = user;
    this.userForm.patchValue({
      name: user.name,
      street: user.street,
      city: user.city,
      postalCode: user.postalCode
    });
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
