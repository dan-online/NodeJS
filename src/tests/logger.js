const chalk = require("chalk");
const logged = [{name: "Initialize", value: false}, 
                {name: "Port", value: false}, 
                {name: "Server", value: false}, 
                {name: "Routes", value: false}, 
                {name: "Database", value: false}];
        
const config = require("../../package.json");
process.stdout.moveCursor(0, -1);
process.stdout.clearLine();
var test = false; 
var okOn = "Online";
var errOff = "Starting";

log("start");

function log(change, err) {
    if(err) {
        errOff = "Error"
    }
    if(change === "test") {
        test = true;
        okOn = "OK";
    }
    if(config.log === "tech") {
        if(logged.find((x) => x.name.toLowerCase() === change) && !err) {
            logged.find((x) => x.name.toLowerCase() === change).value = true;
        }
        //logged.forEach(l => process.stdout.clearLine());
        logged.forEach((l) => {
            process.stdout.moveCursor(0, -1);
            process.stdout.clearLine();
        });
        logged.forEach((l) => {
            if(l.value) {
                process.stdout.clearLine(); process.stdout.write(chalk.black.bgGreen.bold(" " + okOn + " ") + " " + l.name + "\n");
            } else {
                process.stdout.clearLine(); process.stdout.write(chalk.black.bgRed.bold(" " + errOff + " ") + " " + l.name + "\n");
            }
        });
        if(err) {
            if(!err.adv) {
                err.adv = "";
            }
            console.error("\nError: "  + err + " " + err.adv);
            process.exit(1);
        }
        if(logged.filter((x) => !x.value).length === 0) {
            if(test) {
                process.stdout.write(chalk.bold.green("\nAll checks finished.\n\n"))
                return process.exit(0);
            }
            process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);
        }
    } else {
        process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);
    }
}
module.exports = log;