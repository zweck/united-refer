#!/usr/bin/env node

const shell = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

const src = 'platforms/browser/www';
const dist = 'docs';

shell(`mkdir -p ${dist}`);
shell(`cp -r ${src}/* ${dist}`);
