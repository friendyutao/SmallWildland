function login(socket, dbAccount) {
	return new Promise( (resolve, reject) => {
		socket.on('login', pack => {
      if (typeof pack != 'object') { console.log('Cheating: login information is not an Object, ignored'); return; }
			const account = String(pack.account).trim();
			dbAccount.find({account: account}).toArray().then(r => {
				if (r[0] && r[0].password === String(pack.password)) {
					resolve(r[0]);
					socket.emit('hint', {hint: 'Login success'});
					socket.emit('loginSuccess');
				} else {
					socket.emit('hint', {hint: 'Invalid account or password'});
				}
			}).catch(err => {
				reject(err);
			});
		});
		function getTest() {
			const a = Math.floor(Math.random() * 1e2);
			const b = Math.floor(Math.random() * 1e2);
			return {
				question: `${a} + ${b} = `,
				answer: String(a + b),
			}
		}
		let test;
		socket.on('getTest', pack => {
      if (typeof pack != 'object') { console.log('Cheating: login information is not an Object, ignored'); return; }
			test = getTest();
			socket.emit('test', { question: test.question, });
		});
		socket.on('signUp', pack => {
      if (typeof pack != 'object') { console.log('Cheating: login information is not an Object, ignored'); return; }
			const account = String(pack.account).trim();
			const password = String(pack.password);
			if (account.length == 0) {
				socket.emit('hint', {hint: 'Please input account'});
			} else if (password.length < 6) {
				socket.emit('hint', {hint: 'Your password should be no shorter than 6 characters'});
			} else if(password != String(pack.password2)) {
				socket.emit('hint', {hint: 'Password does not match the confirm password'});
			} else if (String(pack.answer).trim() != test.answer) {
				socket.emit('hint', {hint: 'Invalid answer. Take a look at the question.'});
			} else {
				dbAccount.find({account: account}).toArray().then(r => {
					if (r[0]) {
						socket.emit('hint', {hint: 'That account is taken. Please try another.'});
					} else {
						dbAccount.insertOne({
							account: account, 
							password: password,
							signUpDate: new Date(),
						}).then( r => {
							socket.emit('hint', {hint: 'Sign up Success.'});
							socket.emit('signUpSuccess', {});
						}).catch( err => {
							reject(err);
						});
					}
				}).catch( err => {
					reject(err);
				});
			}
			test = getTest();
			socket.emit('test', { question: test.question, });
		});
		socket.on('delAcct', pack => {
      if (typeof pack != 'object') { console.log('Cheating: login information is not an Object, ignored'); return; }
			if (String(pack.answer).trim() != test.answer) {
				socket.emit('hint', {hint: 'Invalid answer, please take a look at the question.'});
			} else {
				const account = String(pack.account).trim();
				dbAccount.find({account: account}).toArray().then(r => {
					if (r[0] && r[0].password === String(pack.password)) {
						dbAccount.deleteOne({account: account}).then(r => {
							socket.emit('hint', {hint: 'Delete account success'});
							socket.emit('delAcctSuccess');
						}).catch(err => {
							reject(err);
						});
					} else {
						socket.emit('hint', {hint: 'Invalid account or password'});
					}
				}).catch(err => {
					reject(err);
				});
			}
			test = getTest();
			socket.emit('test', { question: test.question, });
		});
	});
}

module.exports = login;
