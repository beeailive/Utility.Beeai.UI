import { Injectable } from '@angular/core';
import { InternalServiceClient } from '@chirpstack/chirpstack-api-grpc-web/api/internal_grpc_web_pb';
import { LoginRequest } from '@chirpstack/chirpstack-api-grpc-web/api/internal_pb';

@Injectable({
  providedIn: 'root'
})
export class ChirpstackService {
  private client: InternalServiceClient;

  constructor() {
    // Replace with your ChirpStack gRPC-Web endpoint
    this.client = new InternalServiceClient('http://136.112.165.113:8080/');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = new LoginRequest();
      req.setEmail(username);
      req.setPassword(password);

      this.client.login(req, {}, (err, response) => {
        if (err) reject(err);
        else resolve(response.toObject());
      });
    });
  }
}
