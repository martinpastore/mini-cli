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
                const namei = optimist.argv["name"];
                this.init(namei);
                break;
            case 'build':
                this.build();
                break;
            case 'run':
                const port = optimist.argv["port"];
                this.run(port);
                break;
            case 'new':
                const namen = optimist.argv["name"];
                const type = optimist.argv["type"];
                this.new(namen, type);
                break;
            default:
                console.log(`Mini-CLI: '${cmd}' is not a recognized command.`);
                break;
        }
    },
    init: function (name) {
        if (!name) {
            name = 'burgerjs-test';
        }
        clear();
        console.log(chalk.yellow(figlet.textSync('Mini CLI', {horizontalLayout: 'full'})));

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

        fs.writeFileSync(`./${name}/burger.json`, `{
          "title": "BurgerJS - Test SPA",
          "scripts": [],
          "styles": [],
          "pages": "pages",
          "components": "components"
        }`);
        fs.writeFileSync(`./${name}/module.js`, `const burger = require('burgerjs');
    
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
        if (fs.existsSync('burger.json')) {
            exec('node module.js', function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    process.exit(1);
                }
            });
        } else {
            console.log('Mini-CLI: You should be in a burgerjs project to use this command');
            process.exit(1);
        }
    },
    run: function(port) {
        if (fs.existsSync('burger.json')) {

            if (!port) {
                port = '8080';
            }

            if (fs.existsSync(`./dist`)) {
                process.chdir(`./dist`);

                exec(`browser-sync start --server './' --port ${port} --files="./"`, function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                        process.exit(1);
                    }
                });
            } else {
                console.log('Mini-CLI: You need to run "build" command before "run"');
                process.exit(1);
            }
        } else {
            console.log('Mini-CLI: You should be in a burgerjs project to use this command');
            process.exit(1);
        }
    },
    new: function(name, type) {
        if (fs.existsSync('burger.json')) {
            if (type === 'component') {
                process.chdir(`./components`);
                fs.mkdirSync(`./${name}`);
                fs.writeFileSync(`./${name}/${name}.html`, '');
                fs.writeFileSync(`./${name}/${name}.js`, '');
                fs.writeFileSync(`./${name}/${name}.css`, '');
            } else if (type === 'page') {
                process.chdir(`./pages`);
                fs.mkdirSync(`./${name}`);
                fs.writeFileSync(`./${name}/${name}.html`, '');
                fs.writeFileSync(`./${name}/${name}.js`, '');
                fs.writeFileSync(`./${name}/${name}.css`, '');
            }
        } else {
            console.log('Mini-CLI: You should be in a burgerjs project to use this command');
            process.exit(1);
        }
    }
};

app.map(cmd);

module.exports = app;