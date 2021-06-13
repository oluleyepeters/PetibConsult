const activate = () => {
	var username = document.getElementById('reguname')
	var email = document.getElementById('regemail');
	var password = document.getElementById('regpword');
	document.getElementById('regpword').addEventListener('keyup', activation)
	var button = document.getElementById('regbutton');
	button.disabled = true;

	function activation() {
		if (email.value !== '' && password.value !== '' && username.value !== '') {
			button.disabled = false;
		};
	}
};

activate();

