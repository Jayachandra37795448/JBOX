# Version 1.0.6

Changes:</br>

* Added Execution service UI for CT user convenience.
* Execution service page is combination of drop-downs, input fields and action buttons.
* Added timestamp on test step level*

# Version 1.0.4 & 1.0.5

Changes:

* Rally tab data binding fields updated as per back-end updates
* Console log tab on ETR
* Code Update to display step name more than 30 chars
* Code update to parse html tags
* Code update to display timestamp on test step level

# Version 1.0.3

Changes:

* Created testRunGroup page with list of test suites
* Added Rally tab on test case page
* Added failure reasons on test suite page

# Version 1.0.2

Changes:

* Added search feature
* Show all test steps
* UI Enhancements
* Error handling for invalid inputs (in route level)

# Version 1.0.1

Changes:

* Productionize Enterprise Test Report (ETR).

# Version 1.0.0
	
Changes:
* Custom views for BDD test suites

# Version 0.1

CT Enterprise Test Report 2

* Test Suite View
* Test Case View
* Test Search View

This application built using Angular 6. Prerequisites are :
Node.js v8.x or higher
npm 5.x or higher

## Getting Started

* Clone the repo: `ssh://git@bitbucket.service.edp.t-mobile.com:7999/cta/ct_enterprise_test_report2.git`

* Or Fork the repo `ssh://git@bitbucket.service.edp.t-mobile.com:7999/cta/ct_enterprise_test_report2.git`

## Using the Source Files

After cloning the repo take a look at the `gulpfile.js` and check out the tasks available:

*  Run `npm install` to install the dependancies through `package.json`

*  Run the `ng serve --open` Command to make your local server up and application opens in browser http://localhost:4200/.

*  Run `http://localhost:4200` to see the application up and running in local.

*  Go to `server` level and run `npm install` to install the `express(nodeJs)` dependencies.

* Run `node bin/www` to run local node server.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
