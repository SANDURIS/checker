Playwright Test Execution Guide

clone the repository: https://github.com/SANDURIS/checker.git 


Prerequisites
1. Node.js Installation

Ensure Node.js (version 14 or higher) is installed on your system
Verify installation: node --version
Download from: https://nodejs.org/ if not installed

2. Project Setup

Initialize a Node.js project if not already done:
npm init -y


3. Playwright Installation

Install Playwright Test framework:
npm install --save-dev @playwright/test

Install browsers (first time only):
npx playwright install

4. Execute the Test

npx playwright test checker.spec.ts
