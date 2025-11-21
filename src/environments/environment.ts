// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
    apiUrl: "http://223.239.130.108:8090/api",
    //baseapiUrl: "http://223.239.130.108:5000/",
    baseapiUrl: "http://localhost:5000/",
    token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjY3NjBjNmUyLWE2YmItNGE2NS1hMmViLThhNzliNzdjYTQ1MyIsInR5cCI6ImtleSJ9.z24Ry0B0Hr6cf2OZO1H2nS9aNu7a1phHbYjAra60oOw",
    SECRET_KEY: "beeailive!2029"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
