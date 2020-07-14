const keys = require('../../config/keys')

module.exports=mail =>{
	return `
		<html>
			<body>
				<div style="text-align: center;">
					<h3>I'd like your input</h3>
					<p>Please answer the following questions:</p>
					<p>${mail.body}</p>
					<div>
						<a href="${keys.domain}/forgotpassword/${mail.token}/resetPassword">Reset Your Password </a>
					</div>
				</div>
			</body>
		</html>
	`;
};