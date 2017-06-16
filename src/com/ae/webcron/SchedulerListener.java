package com.ae.webcron;

import javax.persistence.*;
import javax.servlet.*;
import javax.ws.rs.core.Context;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
 
public class SchedulerListener implements ServletContextListener {
	
    // Prepare the EntityManagerFactory & Enhance:
    public void contextInitialized(ServletContextEvent e) {
        com.objectdb.Enhancer.enhance("com.ae.webcron.*");
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("$objectdb/webcron.odb");
        if(e.getServletContext().getInitParameter("WEBCRON")!=null){
        	emf = Persistence.createEntityManagerFactory(e.getServletContext().getInitParameter("WEBCRON")+"/webcron.odb");
        }
        e.getServletContext().setAttribute("emf", emf);
    }
 
    // Release the EntityManagerFactory:
    public void contextDestroyed(ServletContextEvent e) {
        EntityManagerFactory emf =
            (EntityManagerFactory)e.getServletContext().getAttribute("emf");
        emf.close();
        Scheduler scheduler = (Scheduler) e.getServletContext().getAttribute("scheduler");
        try {
			scheduler.shutdown( true );// true = wait for jobs to complete
		     // you may want to give Quartz some extra time to shutdown
		     //Thread.sleep(1000);
		} catch (SchedulerException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}  
    }
}