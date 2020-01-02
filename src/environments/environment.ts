// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://127.0.01:3001',
  domain: '127.0.0.1:3001',
  // apiUrl: 'http://api.quickfixcars.com',
  // domain: 'api.quickfixcars.com',
  superAdmin: [3, 124],
  claimBaseUrl: 'http://claimqa.policybazaar.com',
  claimApiBaseUrl: 'http://claimqaapi.policybazaar.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
