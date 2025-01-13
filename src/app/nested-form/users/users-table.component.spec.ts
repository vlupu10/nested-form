import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTableComponent } from './users-table.component';
import { UserData } from '../../data.service';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  let confirmSpy: jest.SpyInstance;

  const mockUser: UserData = {
    id: 1,
    name: 'Test User',
    street: 'Test Street',
    city: 'Test City',
    postalCode: '12345'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    confirmSpy = jest.spyOn(window, 'confirm') as jest.SpyInstance<boolean, []>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editUser event', () => {
    const emitSpy = jest.spyOn(component.editUser, 'emit');
    component.onEdit(mockUser);
    expect(emitSpy).toHaveBeenCalledWith(mockUser);
  });

  it('should emit deleteUser event when confirmed', () => {
    confirmSpy.mockReturnValue(true);
    const emitSpy = jest.spyOn(component.deleteUser, 'emit');
    component.onDelete(mockUser);
    expect(emitSpy).toHaveBeenCalledWith(mockUser);
  });
});
