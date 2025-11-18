// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
    apiUrl: "http://223.239.130.108:8090",
    baseapiUrl: "http://223.239.130.108:5000/",
  token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjgwMmFhOTNiLWY4ZDItNDZkMC1iNmE2LTk2MDYzY2Q1ODI3YSIsInR5cCI6ImtleSJ9.lzeF2I5fqQgytgiM4hxDpdw1IKsQXwaykhHnF9M8350"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
