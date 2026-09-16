// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// The shell run covers the whole workspace: shell specs plus every project under projects/.
const shellSpecs = require.context('./', true, /\.spec\.ts$/);
shellSpecs.keys().forEach(shellSpecs);
const projectSpecs = require.context('../projects/', true, /\.spec\.ts$/);
projectSpecs.keys().forEach(projectSpecs);
