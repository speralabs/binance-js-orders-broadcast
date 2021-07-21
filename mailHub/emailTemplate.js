const templates = {};
const config = require('../config/config');

templates.welcomeEmail = function (firstName, code) {
  return `<table width="100%" cellpadding="0" cellspacing="0">
  <tbody><tr>
  <td style="width:100%;margin:0;padding:0;background-color:#fff" align="center">
			  <table width="100%" cellpadding="0" cellspacing="0">
				  <tbody>
					  <tr>
						  <td style="text-align:center">
							  <img width="200" style="padding: 10px" src="https://i.imgur.com/LDV3wbR.jpeg">
						  </td>
					  </tr>
  
  
			  <tr>
				  <td style="width:100%;margin:0;padding:0;border-top:1px solid #edeff2;border-bottom:1px solid #edeff2;background-color:#fff" width="100%">
					  <table style="width:auto;max-width:570px;margin:0 auto;padding:0" align="center" width="570" cellpadding="0" cellspacing="0">
						  <tbody><tr>
							  <td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;padding:35px">
  
								  <h1 style="margin-top:0;color:#2f3133;font-size:19px;text-align:left">
									  Hello ${firstName}!
								  </h1>
  
  
								  <p style="margin-top:0;color:#74787e;font-size:16px;line-height:1.5em">
									  Welcome to ${config.app_name}
									  <br>
									  <br>
									You have successfully created a new account in ${config.app_name}.
									<br>
                                    You can confirm your email by pressing the bellow button.
								  </p>
								  <br>
								  <div style="width: 100%; text-align:center;">
									  <a href="${
                      config.server_path
                    }api/users/confirm/${code}" style="padding: 10px 20px 10px 20px; background-color: #000000;color: white;border-radius: 5px;text-decoration: none;font-size:14px;">Confirm Email</a>
								  </div>
								  <br><br>
									  
								  Confirmation URL:- ${config.server_path}api/users/confirm/${code}

							  <br><br>
								  <p style="margin-top:10px;color:#74787e;font-size:16px;line-height:1.5em">
									  Thanks,<br>Your Friends at ${config.app_name}
								  </p>
							  </td>
						  </tr>
						  </tbody></table>
				  </td>
			  </tr>
  
  
			  <tr>
			  <td>
			  <table style="width:auto;max-width:570px;margin:0 auto;padding:0;text-align:center" align="center" width="570" cellpadding="0" cellspacing="0">
				  <tbody><tr>
					  <td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#aeaeae;padding:35px;text-align:center">
						  <p style="margin-top:0;color:#000;font-size:12px;line-height:1.5em">
							  © ${new Date().getFullYear()}
							  <a style="color:#000" href="http://package-tracking.speralabs.com/" target="_blank">${
                  config.app_name
                }</a>.
							  All rights reserved.
						  </p>
					  </td>
				  </tr>
				  </tbody></table>
		  </td>
			  </tr>
			  </tbody></table>
	  </td>
  </tr>
  </tbody>
  </table>`;
};

templates.passwordReset = function (first_name) {
  return `<table width="100%" cellpadding="0" cellspacing="0">
	<tbody><tr>
	<td style="width:100%;margin:0;padding:0;background-color:#fff" align="center">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tbody>
						<tr>
							<td style="text-align:center">
								<img width="200" style="padding: 10px" src="https://i.imgur.com/LDV3wbR.jpeg">
							</td>
						</tr>
	
	
				<tr>
					<td style="width:100%;margin:0;padding:0;border-top:1px solid #edeff2;border-bottom:1px solid #edeff2;background-color:#fff" width="100%">
						<table style="width:auto;max-width:570px;margin:0 auto;padding:0" align="center" width="570" cellpadding="0" cellspacing="0">
							<tbody><tr>
								<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;padding:35px">
	
									<h1 style="margin-top:0;color:#2f3133;font-size:19px;text-align:left">
										Hi ${first_name},
									</h1>
	
	
									<p style="margin-top:0;color:#74787e;font-size:16px;line-height:1.5em">
										Your password has been successfully reset.
										<br>
									</p>
	
									<br>
									<p style="margin-top:10px;color:#74787e;font-size:16px;line-height:1.5em">
										Thanks,<br>Your Friends at ${config.app_name}
									</p>
								</td>
							</tr>
							</tbody></table>
					</td>
				</tr>
	
	
				<tr>
				<td>
				<table style="width:auto;max-width:570px;margin:0 auto;padding:0;text-align:center" align="center" width="570" cellpadding="0" cellspacing="0">
					<tbody><tr>
						<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#aeaeae;padding:35px;text-align:center">
							<p style="margin-top:0;color:#000;font-size:12px;line-height:1.5em">
								© ${new Date().getFullYear()}
								<a style="color:#000" href="http://package-tracking.speralabs.com/" target="_blank">${
                  config.app_name
                }</a>.
								All rights reserved.
							</p>
						</td>
					</tr>
					</tbody></table>
			</td>
				</tr>
				</tbody></table>
		</td>
	</tr>
	</tbody>
	</table>`;
};

templates.passwordForget = function (first_name, password) {
  return `<table width="100%" cellpadding="0" cellspacing="0">
	<tbody><tr>
	<td style="width:100%;margin:0;padding:0;background-color:#fff" align="center">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tbody>
						<tr>
							  <td style="text-align:center">
								  <img width="200" style="padding: 10px" src="https://i.imgur.com/LDV3wbR.jpeg">
							  </td>
						  </tr>
				<tr>
					<td style="width:100%;margin:0;padding:0;border-top:1px solid #edeff2;border-bottom:1px solid #edeff2;background-color:#fff" width="100%">
						<table style="width:auto;max-width:570px;margin:0 auto;padding:0" align="center" width="570" cellpadding="0" cellspacing="0">
							<tbody><tr>
								<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;padding:35px">
	
									<h1 style="margin-top:0;color:#2f3133;font-size:19px;text-align:left">
										Hi ${first_name},
									</h1>
	
	
									<p style="margin-top:0;color:#74787e;font-size:16px;line-height:1.5em">
										Your password has been successfully reset.
										<br>
										<br>
										New password :- ${password}
										<br>
									</p>
									<P style="margin-top:0;color:#74787e;font-size:12px;line-height:1.5em;color: red">* Don't copy spaces before and after the password</P>
	
	
									<br>
									<p style="margin-top:10px;color:#74787e;font-size:16px;line-height:1.5em">
										Thanks,<br>Your Friends at ${config.app_name}
									</p>
								</td>
							</tr>
							</tbody></table>
					</td>
				</tr>
				<tr>
				<td>
				<table style="width:auto;max-width:570px;margin:0 auto;padding:0;text-align:center" align="center" width="570" cellpadding="0" cellspacing="0">
					  <tbody><tr>
						  <td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#aeaeae;padding:35px;text-align:center">
							  <p style="margin-top:0;color:#000;font-size:12px;line-height:1.5em">
								  © ${new Date().getFullYear()}
								  <a style="color:#000" href="http://package-tracking.speralabs.com/" target="_blank">${
                    config.app_name
                  }</a>.
								  All rights reserved.
							  </p>
						  </td>
					  </tr>
					  </tbody></table>
			</td>
				</tr>
				</tbody></table>
		</td>
	</tr>
	</tbody>
	</table>`;
};

templates.userCreation = function (name, email, password, code) {
  return `<table width="100%" cellpadding="0" cellspacing="0">
	<tbody><tr>
	<td style="width:100%;margin:0;padding:0;background-color:#fff" align="center">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tbody>
						<tr>
							<td style="text-align:center">
								<img width="200" src="https://i.imgur.com/LDV3wbR.jpeg" />
							</td>
						</tr>
	
	
				<tr>
					<td style="width:100%;margin:0;padding:0;border-top:1px solid #edeff2;border-bottom:1px solid #edeff2;background-color:#fff" width="100%">
						<table style="width:auto;max-width:570px;margin:0 auto;padding:0" align="center" width="570" cellpadding="0" cellspacing="0">
							<tbody><tr>
								<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;padding:35px">
	
									<h1 style="margin-top:0;color:#2f3133;font-size:19px;text-align:left">
										Hi ${name},
									</h1>
	
	
									<p style="margin-top:0;color:#74787e;font-size:16px;line-height:1.5em">
										You have successfully registered with the ${
                      config.app_name
                    }. Use the following credentials to log in to the system. 
										<br>
										<br>
										Email :- ${email}
										<br>
										Password :- ${password}
										<br>
									</p>
									<P style="margin-top:0;color:#74787e;font-size:12px;line-height:1.5em;color: red">* Don't copy spaces before and after the password</P>
	
									<br>
  
									<p style="margin-top:0;color:#74787e;font-size:16px;line-height:1.5em">
									  Please make sure to confirm your email by pressing the bellow button.
									</p>
									   <br>
									<div style="width: 100%; text-align:center;">
										<a href="${
                      config.server_path
                    }api/users/confirm/${code}" style="padding: 10px 20px 10px 20px; background-color: #000000;color: white;border-radius: 5px;text-decoration: none;font-size:14px;">Confirm Email</a>
									</div>
									 <br>
									  <br>
								  Confirmation URL:- ${config.server_path}api/users/confirm/${code}
								   <br>
									  <br>
									<p style="margin-top:10px;color:#74787e;font-size:16px;line-height:1.5em">
										Thanks,<br>Your Friends at ${config.app_name}
									</p>
								</td>
							</tr>
							</tbody></table>
					</td>
				</tr>
	
	
				<tr>
				<td>
				<table style="width:auto;max-width:570px;margin:0 auto;padding:0;text-align:center" align="center" width="570" cellpadding="0" cellspacing="0">
					<tbody><tr>
						<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#aeaeae;padding:35px;text-align:center">
							<p style="margin-top:0;color:#000;font-size:12px;line-height:1.5em">
								© ${new Date().getFullYear()}
								<a style="color:#000" href="http://package-tracking.speralabs.com/" target="_blank">${
                  config.app_name
                }</a>.
								All rights reserved.
							</p>
						</td>
					</tr>
					</tbody></table>
			</td>
				</tr>
				</tbody></table>
		</td>
	</tr>
	</tbody>
	</table>`;
};

module.exports = templates;
