package com.ae.webcron;

import javax.persistence.*;
import javax.servlet.*;
 
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
    }
}