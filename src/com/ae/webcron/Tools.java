package com.ae.webcron;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletContext;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;

@Path("/tools")
public class Tools {
	
	@Context
	ServletContext context;

	private Logger logger = LogManager.getLogger(this.getClass().getName());
	
	@Context
	Request request;

	@POST
	@Path("/shell/")
	//@Produces("application/json")
	public String runProcess(String command) {

		JSONObject obj = new JSONObject();
		
		
		StringBuilder text = new StringBuilder();

		int exitcode=-1;
		try 
        { 
			logger.info("Run command : "+ command);
			//Process p=Runtime.getRuntime().exec(command); 

			ProcessBuilder pb = new ProcessBuilder(command.split(" "));
			pb.redirectErrorStream(true);
			Process p = pb.start();
			
            p.waitFor();
            
            BufferedReader input=new BufferedReader(
                new InputStreamReader(p.getInputStream())
            );
            

            String line; 
            while((line = input.readLine()) != null) 
            { 
                text.append(line).append(System.getProperty("line.separator"));
            }
            
            
            exitcode = p.exitValue();

        }
        catch(Exception e) {
        	logger.error("Error to execute shell command","",e);
        } 

		obj.put("command", command);
		obj.put("exitcode", exitcode);
		obj.put("output", text.toString());

		return obj.toString();
	}
	
}
