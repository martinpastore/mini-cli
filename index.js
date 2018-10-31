#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const exec = require('child_process').exec;
const optimist = require('optimist');
const fs = require('fs');

const cmd = process.argv[2];

const app = {
    map: function(cmd) {
        switch(cmd) {
            case 'init':
                const name = optimist.argv["name"];
                this.init(name);
                break;
            case 'build':
                this.build();
                break;
            case 'run':
                const port = optimist.argv["port"];
                this.run(port);
                break;
            default:
                console.log(`Mayo-CLI: '${cmd}' is not a recognized command.`);
                break;
        }
    },
    init: function (name) {
        if (!name) {
            name = 'burgerjs-test';
        }
        clear();
        console.log(chalk.yellow(figlet.textSync('Mayo CLI', {horizontalLayout: 'full'})));

        if (!fs.existsSync(`./${name}`)) {
            fs.mkdirSync(`./${name}`);
        } else {
            process.exit(1);
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
                process.exit(1);
            }

            exec('npm install --save burgerjs@latest', function (error, stdout, stderr) {
                if (stdout !== null) console.log('stdout: ' + stdout);
                if (stderr !== null && stderr !== '') console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                    process.exit(1);
                }
            });
        });
    },
    build: function() {
        exec('node module.js', function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
                process.exit(1);
            }
        })
    },
    run: function(port) {
        if (!port) {
            port = '8080';
        }

        if (fs.existsSync(`./dist`)) {
            process.chdir(`./dist`);

            exec(`browser-sync start --server './' --port ${port} --files="./"`, function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    process.exit(1);
                }
            });
        } else {
            console.log('Mayo-CLI: You need to run "build" command instead of "run"');
            process.exit(1);
        }
    }
};

app.map(cmd);

module.exports = app;