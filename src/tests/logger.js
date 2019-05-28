const chalk = require('chalk');
const logged = [{name: 'Initialize', value: false}, {name: 'Listening', value: false}, {name: 'Server', value: false}, {name: 'Routes', value: false}, {name: "Database", value: false}]
const config = require('../../package.json')
process.stdout.moveCursor(0, -1);
process.stdout.clearLine();

function log(change) {
    if(config.log == 'tech') {
        logged.find(x => x.name.toLowerCase() == change).value = true;
        //logged.forEach(l => process.stdout.clearLine());
        logged.forEach(l => process.stdout.moveCursor(0, -1) && process.stdout.clearLine());
        logged.forEach(l => {
        if(l.value) {
            process.stdout.clearLine(); process.stdout.write(chalk.black.bgGreen.bold(' Online ') + ' ' + l.name + '\n');
        } else {
            process.stdout.clearLine(); process.stdout.write(chalk.black.bgRed.bold(' Starting ') + ' ' + l.name + '\n');
        }
        });
        if(logged.filter(x => !x.value).length == 0) {
            process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);
        }
    } else {
        if(change == 'server') {
            process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);
        }
    }
}
module.exports = log;