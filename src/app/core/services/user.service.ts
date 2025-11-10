import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  ListUsersRequest,
  ListUsersResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserPasswordRequest
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  listUsers(request: ListUsersRequest = {}): Observable<ListUsersResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());

    return this.http.get<ListUsersResponse>(`${this.apiUrl}/users`, { params });
  }

  getUser(id: string): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(`${this.apiUrl}/users/${id}`);
  }

  createUser(request: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.apiUrl}/users`, request);
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}`, request);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  updatePassword(request: UpdateUserPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${request.userId}/password`, {
      password: request.password
    });
  }
}

