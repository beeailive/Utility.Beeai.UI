import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChirpstackService {
  private http = inject(HttpClient);
  private _router = inject(Router);
  private headerOptions: { headers: HttpHeaders } = { headers: new HttpHeaders() };


  private setHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
  constructor() {

  }


  loginuser(apiUrl: string, userid: string, password: string) {
    return this.http.post(
      environment.baseapiUrl + apiUrl,
      { email: userid, password: password }, // do NOT stringify
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      catchError(async (error) => this.HandleError(error))
    );


  }

  HandleError(error: unknown) {

    if (typeof error === 'object' && error !== null) {
      const err = (error as HttpErrorResponse).error; // Only here we cast

      if (err?.status === 401) {
        this._router.navigate(['/login']);
        return;
      }

      if (err?.status === 409) {
        console.log('warning', err.error);
        return;
      }
    }

    console.error("Unhandled error:", error);
  }


}
