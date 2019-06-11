const chalk = require("chalk");
const logged = [{name: "Initialize", value: false}, 
                {name: "Port", value: false}, 
                {name: "Server", value: false}, 
                {name: "Routes", value: false}, 
                {name: "Database", value: false},
                {name: "Update", value: false}
            ];
        
const config = require("../../package.json");
process.stdout.moveCursor(0, -1);
process.stdout.clearLine();
var errors = [];
var test = false; 
var okOn = "Online";
var errOff = "Starting";

if(process.argv.find((x) => x === "test")) {
    test = true;
    okOn = "OK";
}

async function log(change, err) {
    if(err) {
        errOff = "Error";
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
            if(l.value === true) {
                process.stdout.clearLine(); process.stdout.write(chalk.black.bgGreen.bold(" " + okOn + " ") + " " + l.name + "\n");
            } else {
                process.stdout.clearLine(); process.stdout.write(chalk.black.bgRed.bold(" " + errOff + " ") + " " + l.name + "\n");
            }
        });
        if(err) {
            if(!err.adv) {
                err.adv = "";
            }
            if(test !== true) {
                console.error("\nError: "  + err + " " + err.adv);
                return process.exit(1);
            } else {
                logged.find((x) => x.name.toLowerCase() === change.toLowerCase()).value = "err";
                errors.push(err);
            }
        }
        if(logged.filter((x) => x.value === false && x.name != 'Update').length === 0) {
            await require('../../bin/update').update()
            if(errors.length > 0) {
                errors.forEach((e) => console.error("\nError: "  + e + " " + e.adv));
                return process.exit(1);
            }
            if(test) {
                process.stdout.write(chalk.bold.green("\nAll checks finished.\n\n"));
                return process.exit(0);
            }
            process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);
        }
    } else {
        process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);
    }
}

if(test) {
    logged.push({name: "Syntax", value: false});
    require("child_process").exec("find .  -path ./node_modules -prune -o -path ./.history -prune -o -path ./data -prune -o -name \"*.js\" -exec node -c {} \\;", function(err, out) {
        if(err) {
            log("syntax", err);
        } else {
            log("syntax");
        }
    });
}

log("start");


module.exports = log;