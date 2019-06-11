const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require("inquirer");

async function run(code) {
	var r = await exec(code).catch(err => {if(err) var r = {type: 'error', stderr:err}}
);
	if(!r) r = {stderr: r}
	if (r.stderr) {
		console.log('Error when running ' + code);
		let current = fs.createReadSync('./error.log');
		current += r.stderr;
		fs.createWriteSync('./error.log', current);
    	return {type: 'error', output: r.stderr};
  	} else {
  		return {type: 'success', output: r.stdout};
  	}
}

module.exports.update = async function () {
    async function file(file) {
        await run('git fetch');
        let check = await run('git diff origin/master ' + file)
        if(check.output) {
            var questions = [{
                    type: "list",
                    name: "update",
                    message: "Would you like to update " + file + '?',
                    choices: ["Yes", "No"],
                }];
            const answers = await inquirer.prompt(questions)
            if(answers['update'] == 'Yes') {
                await run('git checkout origin/master ' + file);
                console.log(file + ' updated!');
            }
        }
    }

    await file('./bin/www');
    await file('./bin/update.js');
    //await run('git checkout origin/master ' + __dirname + '/bin/www')
}
