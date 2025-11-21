import { inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChirpstackEventsService {

    private apiUrl = 'http://223.239.130.108:8080/api/devices';
    private zone = inject(NgZone);
  private authToken = localStorage.getItem('auth_token');

    streamDeviceEvents(devEui: string   ): Observable<unknown> {
        return new Observable((observer) => {

            const url = `${this.apiUrl}/${devEui}/events`;


            const eventSource = new EventSource(url, {
                withCredentials: false
            });

            // Send token via header (browser does not allow directly)
            // So we must pass token as query param for SSE:
            // /events?token=xxxx

            const authUrl = `${url}?token=${this.authToken}`;

            const es = new EventSource(authUrl);

            es.onmessage = (event) => {
                this.zone.run(() => {
                    observer.next(JSON.parse(event.data));
                });
            };

            es.onerror = (error) => {
                console.error("SSE error:", error);
                this.zone.run(() => observer.error(error));
                es.close();
            };

            return () => es.close();
        });
    }
}
