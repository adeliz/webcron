package com.ae.webcron;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.servlet.GenericServlet;
import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebServlet;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.Trigger;
import org.quartz.ee.servlet.QuartzInitializerServlet;
import org.quartz.impl.StdSchedulerFactory;

/**
 * Servlet implementation class QzServlet
 */
@WebServlet("/QzServlet")
public class QzServlet extends GenericServlet {
	private static final long serialVersionUID = 1L;

	private Logger logger = LogManager.getLogger(this.getClass().getName());
	
	/**
	 * @see GenericServlet#GenericServlet()
	 */
	public QzServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		
		logger.debug("Webcron starts");
		super.init(config);
		
		// SchedulerFactory sf = new StdSchedulerFactory();
		StdSchedulerFactory sf = (StdSchedulerFactory) this.getServletContext().getAttribute(QuartzInitializerServlet.QUARTZ_FACTORY_KEY);
		try {
			Scheduler sched = sf.getScheduler();

			EntityManagerFactory emf = (EntityManagerFactory) this.getServletContext().getAttribute("emf");
			EntityManager em = emf.createEntityManager();
			List<CronJob> jobList = null;
			try {

				// Display the list of guests:
				jobList = em.createQuery("SELECT g FROM CronJob g", CronJob.class).getResultList();
				Iterator<CronJob> iterator = jobList.iterator();
				while (iterator.hasNext()) {
					CronJob cronjob = iterator.next();
					if (cronjob.getActive() == true) {
						JobDetail job = newJob(CronJob.class).withIdentity("job"+cronjob.getId(), "group1").usingJobData("description", cronjob.getDescription())
								.storeDurably(true).build();

						job.getJobDataMap().put("obj", cronjob);
						job.getJobDataMap().put("servletctxt", this.getServletContext());

						Trigger trigger = newTrigger().withIdentity("trigger" + cronjob.getId(), "group1").withSchedule(cronSchedule(cronjob.getCron()))
								.forJob("job"+cronjob.getId(), "group1").build();

						sched.scheduleJob(job, trigger);

						// this.getServletConfig().getServletContext().setAttribute(tasks.get(i).getName(),
						// job);
						this.getServletConfig().getServletContext().setAttribute("job" + cronjob.getId(), job);
						
						CronJob cjob = em.find(CronJob.class, cronjob.getId());
						em.getTransaction().begin();
						cjob.setNextexecution(trigger.getNextFireTime().getTime());
						em.getTransaction().commit();

					}
				}
				this.getServletConfig().getServletContext().setAttribute("scheduler", sched);

			} finally {
				// Close the database connection:
				if (em.getTransaction().isActive())
					em.getTransaction().rollback();
				em.close();
			}

		} catch (Exception e) {
			logger.error("Error running main servlet","",e);
		}
	}

	/**
	 * @see Servlet#service(ServletRequest request, ServletResponse response)
	 */
	public void service(ServletRequest request, ServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
