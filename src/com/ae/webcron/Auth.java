package com.ae.webcron;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;

@Path("/v1/auth")
public class Auth {

	@POST
	@Path("/login")
	public String getDataPoints(@FormParam("username") String username, @FormParam("password") String password) {

		Subject currentUser = SecurityUtils.getSubject();
		
		if ( !currentUser.isAuthenticated() ) {
		    //collect user principals and credentials in a gui specific manner
		    //such as username/password html form, X509 certificate, OpenID, etc.
		    //We'll use the username/password example here since it is the most common.
		    //(do you know what movie this is from? ;)
		    UsernamePasswordToken token = new UsernamePasswordToken(username, password);
		    //this is all you have to do to support 'remember me' (no config - built in!):
		    token.setRememberMe(true);
		    try {
		        currentUser.login( token );
		        //if no exception, that's it, we're done!
		    } catch ( UnknownAccountException uae ) {
		        //username wasn't in the system, show them an error message?
		    } catch ( IncorrectCredentialsException ice ) {
		        //password didn't match, try again?
		    } catch ( LockedAccountException lae ) {
		        //account for that username is locked - can't login.  Show them a message?
		    } catch ( AuthenticationException ae ) {
		        //unexpected condition - error?
		    }
		}
		
		
		return currentUser.getPrincipal().toString()+ " login";
	}	

	@GET
	@Path("/currentuser")
	public String getCurrentUser() {
		
		Subject currentUser = SecurityUtils.getSubject();
		String user="Nobody";
		
		if ( currentUser.isAuthenticated() ) {
		
			user = (String) currentUser.getPrincipal();
			
		}

		return user;
	}
	
	@GET
	@Path("/logout")
	public String logout() {
		
		Subject currentUser = SecurityUtils.getSubject();
		String user="Nobody";
		
		if ( currentUser.isAuthenticated() ) {
		
			user = (String) currentUser.getPrincipal();
			
		}
		currentUser.logout();
		return user+" logout";
	}

}
