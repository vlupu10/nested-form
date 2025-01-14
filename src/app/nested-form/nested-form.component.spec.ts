import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NestedFormComponent } from './nested-form.component';
import { DataService } from '../data.service';
import { UsersTableComponent } from './users/users-table.component';
import { of } from 'rxjs';

describe('NestedFormComponent', () => {
  let component: NestedFormComponent;
  let fixture: ComponentFixture<NestedFormComponent>;
  let dataService: jest.SpyInstance;

  const mockUser = {
    id: 1,
    name: 'Test User',
    street: 'Test St',
    city: 'Test City',
    postalCode: '12345'
  };

  beforeEach(async () => {
    const mockDataService = {
      getData: jest.fn().mockReturnValue(of([])),
      insertUser: jest.fn().mockReturnValue(of(mockUser)),
      updateUser: jest.fn().mockReturnValue(of(mockUser)),
      deleteUser: jest.fn().mockReturnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      declarations: [
        NestedFormComponent,
        UsersTableComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NestedFormComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jest.SpyInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty forms', () => {
    expect(component.addForm.get('name')?.value).toBe('');
    expect(component.editForm.get('name')?.value).toBe('');
  });

  it('should handle edit user', () => {
    component.handleEdit(mockUser);
    expect(component.selectedUser).toEqual(mockUser);
    expect(component.editForm.value).toEqual({
      name: mockUser.name,
      street: mockUser.street,
      city: mockUser.city,
      postalCode: mockUser.postalCode
    });
    expect(component.activeTab).toBe('edit');
  });

  it('should submit add form when valid', () => {
    component.addForm.patchValue({
      name: 'New User',
      street: 'New St',
      city: 'New City',
      postalCode: '54321'
    });

    component.onAddSubmit();
    expect(dataService.insertUser).toHaveBeenCalled();
  });

  it('should submit edit form when valid and user selected', () => {
    component.handleEdit(mockUser);
    component.editForm.patchValue({
      name: 'Updated User',
      street: 'Updated St',
      city: 'Updated City',
      postalCode: '98765'
    });

    component.onEditSubmit();
    expect(dataService.updateUser).toHaveBeenCalled();
  });

  it('should handle delete user', () => {
    component.handleDelete(mockUser);
    expect(dataService.deleteUser).toHaveBeenCalledWith(mockUser.id);
  });
});
