import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService, UserData } from './data.service';
import type { Mocked } from 'jest-mock';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockUser: UserData = {
    id: 1,
    name: 'Test User',
    street: 'Test Street',
    city: 'Test City',
    postalCode: '12345'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users data', () => {
    const mockUsers: UserData[] = [mockUser];

    service.getData().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
