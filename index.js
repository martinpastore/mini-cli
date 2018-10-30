#!/usr/bin/env node
const files = require('./lib/files');

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const exec = require('child_process').exec;
const optimist = require('optimist');
const fs = require('fs');

const name = optimist.argv["name"];

const app = {
    init: function (name) {
        if (!name) {
            name = 'burgerjs-test';
        }
        clear();
        console.log(chalk.yellow(figlet.textSync('Mayo CLI', {horizontalLayout: 'full'})));

        if (!fs.existsSync(`./${name}`)) {
            fs.mkdirSync(`./${name}`);
        }

        fs.mkdirSync(`./${name}/components`);
        fs.mkdirSync(`./${name}/pages`);
        fs.mkdirSync(`./${name}/assets`);
        fs.mkdirSync(`./${name}/styles`);
        fs.mkdirSync(`./${name}/scripts`);

        fs.writeFile(`./${name}/burger.json`, `{
          "title": "BurgerJS - Test SPA",
          "scripts": [],
          "styles": [],
          "pages": "pages",
          "components": "components"
        }`);
        fs.writeFile(`./${name}/module.js`, `const burger = require('burgerjs');
    
            burger.module([]);`
        );

        process.chdir(`${name}`);

        exec('npm init -y', function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
                return;
            }

            exec('npm install --save burgerjs@latest', function (error, stdout, stderr) {
                if (stdout !== null) console.log('stdout: ' + stdout);
                if (stderr !== null && stderr !== '') console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        });
    }
}

app.init(name);

module.exports = app;