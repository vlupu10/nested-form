import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NestedFormComponent } from './nested-form.component';
import { DataService } from '../data.service';
import { of } from 'rxjs';
import { UsersTableComponent } from './users/users-table.component';

import type { Mocked } from 'jest-mock';

describe('NestedFormComponent', () => {
  let component: NestedFormComponent;
  let fixture: ComponentFixture<NestedFormComponent>;
  let dataService: Mocked<DataService>;

  beforeEach(async () => {
    const mockDataService = {
      getData: jest.fn(),
      insertUser: jest.fn(),
      deleteUser: jest.fn(),
      updateUser: jest.fn()
    };

    mockDataService.getData.mockReturnValue(of([]));
    mockDataService.insertUser.mockReturnValue(of({
      id: 1,
      name: 'Test',
      street: 'Test St',
      city: 'Test City',
      postalCode: '12345'
    }));
    mockDataService.deleteUser.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [
        NestedFormComponent,
        UsersTableComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NestedFormComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as Mocked<DataService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.userForm.get('name')?.value).toBe('');
  });

  it('should validate required fields', () => {
    expect(component.userForm.valid).toBeFalsy();

    component.userForm.patchValue({
      name: 'Test User',
      street: 'Test St',
      city: 'Test City',
      postalCode: '12345'
    });

    expect(component.userForm.valid).toBeTruthy();
  });

  it('should submit form when valid', () => {
    const testUser = {
      id: 1,
      name: 'Test User',
      street: 'Test St',
      city: 'Test City',
      postalCode: '12345'
    };

    component.userForm.patchValue({
      id: testUser.id,
      name: testUser.name,
      street: testUser.street,
      city: testUser.city,
      postalCode: testUser.postalCode

    });

    component.onSubmit();

    expect(dataService.insertUser).toHaveBeenCalledWith({
      id: 1,
      name: testUser.name,
      street: testUser.street,
      city: testUser.city,
      postalCode: testUser.postalCode
    });
  });

  it('should load data on init', () => {
    const mockUsers = [{
      id: 1,
      name: 'Test User',
      street: 'Test St',
      city: 'Test City',
      postalCode: '12345'
    }];

    dataService.getData.mockReturnValue(of(mockUsers));
    component.ngOnInit();

    expect(dataService.getData).toHaveBeenCalled();
  });

  it('should handle edit user', () => {
    const userToEdit = {
      id: 1,
      name: 'Test User',
      street: 'Test St',
      city: 'Test City',
      postalCode: '12345'
    };

    component.handleEdit(userToEdit);

    expect(component.userForm.get('name')?.value).toBe(userToEdit.name);
    expect(component.userForm.get('street')?.value).toBe(userToEdit.street);
    expect(component.userForm.get('city')?.value).toBe(userToEdit.city);
    expect(component.userForm.get('postalCode')?.value).toBe(userToEdit.postalCode);
  });

  it('should handle delete user', () => {
    const userToDelete = {
      id: 1,
      name: 'Test User',
      street: 'Test St',
      city: 'Test City',
      postalCode: '12345'
    };

    component.handleDelete(userToDelete);
    expect(dataService.deleteUser).toHaveBeenCalledWith(userToDelete.id);
  });
});
