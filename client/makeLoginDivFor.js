'use strict'

// makeLoginDivFor requires function elt.
function makeLoginDivFor(appName, appDiv) {
  appDiv.style.display = 'none';
	const gif = elt('img', {style: 'border-radius: 30%', src: `gif/${Math.floor(Math.random() * 1e4 % 9)}.gif`});
	const hint = elt('p', {style: 'color: red'});
	socket.on('hint', pack => { hint.innerHTML = pack.hint; });
	const accountInput = elt('input', {style: 'border-radius: 5%', type: 'text' });
	const passwordInput = elt('input', {style: 'border-radius: 5%', type: 'password'});
	const confirmPassword = elt('span'); const passwordInput2 = elt('input', {style: 'border-radius: 5%', type: 'hidden'});
	const question = elt('span'); const answerInput = elt('input', {type: 'hidden', size: 4}); 

	const select = elt('select', null, elt('option', {value: 'login'}, 'Login (登录)'), elt('option', {value: 'signUp'}, 'Sign Up (注册)'), elt('option', {value: 'delAcct'}, 'DltAcct （删号）'));  
	select.addEventListener('change', () => {
		if (select.value == 'login') {
			confirmPassword.innerHTML = ''; passwordInput2.type = 'hidden';
			question.innerHTML = ''; answerInput.type = 'hidden';
		} else if (select.value == 'signUp') {
			confirmPassword.innerHTML = '<em>Confirm Password （确认密码）: </em>'; passwordInput2.type = 'password';
			socket.emit('getTest', {});
		} else if (select.value == 'delAcct') {
			confirmPassword.innerHTML = ''; passwordInput2.type = 'hidden';
			socket.emit('getTest', {});
		}
	});
	socket.on('test', pack => {
		question.innerHTML = pack.question;
		answerInput.type = 'text';
	});
	const enterButton = elt('button', { 
		innerHTML: '<em>Enter （确定）</em>',
		style: 'border-radius: 5%',
		onclick: () => {
			socket.emit(select.value, {
				account: accountInput.value, 
				password: passwordInput.value,
				password2: passwordInput2.value,
				answer: answerInput.value,
			});
		} 
	});
	const loginDiv = elt('div', { style: 'text-align: center' }, 
			gif,
			hint,
      elt('p', {style: "font: 20px 'Comic Sans MS'; font-weight: bold"}, appName),
			elt('p', null, elt('em', null, 'Username （用户名）: '), accountInput),
			elt('p', null, elt('em', null, 'Password （密码）: '), passwordInput),
			elt('p', null, confirmPassword, passwordInput2),
			elt('p', null, question, answerInput),
			elt('p', null, enterButton),
			elt('p', null, select),
			);
	socket.on('loginSuccess', pack => {
		console.log("loginSuccess");
		loginDiv.style.display = 'none';
		appDiv.style.display = 'block';
	});
	socket.on('signUpSuccess', () => {
		clearInput();
	});
	socket.on('delAcctSucess', () => {
		clearInput();
	});
	function clearInput() {
		accountInput.value = '';
		passwordInput.value = '';
		passwordInput2.value = '';
		answerInput.value = '';
	}
	return loginDiv;
};
