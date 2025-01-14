import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTableComponent } from './users-table.component';
import { UserData } from '../../data.service';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  let confirmSpy: jest.SpyInstance;

  const mockUsers: UserData[] = [
    { id: 1, name: 'Alice', street: 'Oak St', city: 'Boston', postalCode: '12345' },
    { id: 2, name: 'Bob', street: 'Pine St', city: 'Chicago', postalCode: '23456' },
    { id: 3, name: 'Charlie', street: 'Maple St', city: 'Denver', postalCode: '34567' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    component.users = [...mockUsers];
    confirmSpy = jest.spyOn(window, 'confirm');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editUser event', () => {
    const emitSpy = jest.spyOn(component.editUser, 'emit');
    component.onEdit(mockUsers[0]);
    expect(emitSpy).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should emit deleteUser event when confirmed', () => {
    confirmSpy.mockReturnValue(true);
    const emitSpy = jest.spyOn(component.deleteUser, 'emit');
    component.onDelete(mockUsers[0]);
    expect(emitSpy).toHaveBeenCalledWith(mockUsers[0]);
  });

  describe('sorting', () => {
    it('should start with no sorting', () => {
      expect(component.sortColumn).toBeNull();
      expect(component.sortDirection).toBe('none');
    });

    it('should cycle through sort states for same column', () => {
      // First click: ascending
      component.sort('name');
      expect(component.sortColumn).toBe('name');
      expect(component.sortDirection).toBe('asc');
      expect(component.users[0].name).toBe('Alice');

      // Second click: descending
      component.sort('name');
      expect(component.sortDirection).toBe('desc');
      expect(component.users[0].name).toBe('Charlie');

      // Third click: no sort
      component.sort('name');
      expect(component.sortDirection).toBe('none');
      expect(component.sortColumn).toBeNull();
      expect(component.users[0].id).toBe(1); // Back to ID order
    });

    it('should reset sort when switching columns', () => {
      component.sort('name');
      expect(component.sortColumn).toBe('name');
      expect(component.sortDirection).toBe('asc');

      component.sort('city');
      expect(component.sortColumn).toBe('city');
      expect(component.sortDirection).toBe('asc');
    });

    it('should return correct sort icons', () => {
      expect(component.getSortIcon('name')).toBe('↕️');

      component.sort('name');
      expect(component.getSortIcon('name')).toBe('↑');
      expect(component.getSortIcon('city')).toBe('↕️');

      component.sort('name');
      expect(component.getSortIcon('name')).toBe('↓');

      component.sort('name');
      expect(component.getSortIcon('name')).toBe('↕️');
    });
  });
});
