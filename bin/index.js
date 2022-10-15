#!/usr/bin/env node

import { app } from '../app.js';

app(process.env.NODE_ENV)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
