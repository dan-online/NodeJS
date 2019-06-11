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
    await run('git fetch');
    await run('git checkout origin/master ' + __dirname + '/bin/www')
}