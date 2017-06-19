package com.ae.webcron;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.io.InputStream;
import java.util.List;
import java.util.Properties;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnitUtil;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;

@Path("/v1")
public class CRUD {
	
	@Context
	ServletContext context;

	private Logger logger = LogManager.getLogger(this.getClass().getName());
	
	@Context
	Request request;

	@GET
	@Path("/version/")
	//@Produces("application/json")
	public Response getVersion() {

		InputStream resourceAsStream =
		          this.getClass().getResourceAsStream(
		            "/version.properties"
		          );
		String version="version ??";
		        Properties prop = new Properties();
		        try
		        {
		            prop.load( resourceAsStream );
		            version = "Version " + prop.getProperty("version");
		        }catch(Exception e){
		        	
		        }
		return Response
	            .status(200)
	            .header("Access-Control-Allow-Origin", "*")
	            .entity(version)
	            .build();
	}
	
	@GET
	@Path("/job/{id}")
	@Produces("application/json")
	public CronJob getJob(@PathParam("id") String id) {
		EntityManagerFactory emf = (EntityManagerFactory) context.getAttribute("emf");
		EntityManager em = emf.createEntityManager();
		CronJob job = null;
		try {

			job = em.find(CronJob.class, Long.parseLong(id));
			logger.info("GET : "+job.getDescription());
			//job = em.createQuery("SELECT g FROM CronJob g where g.id='" + id + "'", CronJob.class).getSingleResult();
		} catch(Exception e){
			logger.error("Error to GET job","",e);
		} finally {
			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}
		return job;
	}
	
	@GET
	@Path("/job/{id}/test")
	@Produces("application/json")
	public CronJob testJob(@PathParam("id") String id) {
		Scheduler scheduler = (Scheduler) context.getAttribute("scheduler");
		EntityManagerFactory emf = (EntityManagerFactory) context.getAttribute("emf");
		EntityManager em = emf.createEntityManager();
		CronJob cronjob = null;
		try {

			cronjob = em.find(CronJob.class, Long.parseLong(id));
			JobDetail job = newJob(CronJob.class).withIdentity("job"+id, "test").build();
			job.getJobDataMap().put("obj", cronjob);
			job.getJobDataMap().put("servletctxt", context);

			Trigger trigger = TriggerBuilder.newTrigger().build();
			
			scheduler.scheduleJob(job, trigger);

			
		} catch(Exception e){
			logger.error("Error to test job","",e);
		} finally {
			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}
		return cronjob;
	}
	
	@GET
	@Path("/job/{id}/logs")
	@Produces("application/json")
	public List<Log> getLogs(@PathParam("id") String id) {
		EntityManagerFactory emf = (EntityManagerFactory) context.getAttribute("emf");
		EntityManager em = emf.createEntityManager();
		List<Log> logs = null;
		try {
			logs = em.createQuery("SELECT g FROM Log g JOIN g.cronjob c where c.id="+id+" order by g.startTime desc", Log.class).setMaxResults(100).getResultList();
			//job = em.createQuery("SELECT g FROM CronJob g where g.id='" + id + "'", CronJob.class).getSingleResult();
		} catch(Exception e){
			logger.error("Error to GET logs","",e);
		} finally {
			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}
		return logs;
	}

	@GET
	@Path("/job/list")
	@Produces("application/json")
	public List<CronJob> getCsvFileID() {
		EntityManagerFactory emf = (EntityManagerFactory) context.getAttribute("emf");
		EntityManager em = emf.createEntityManager();
		List<CronJob> jobList = null;
		try {

			// Display the list of guests:
			jobList = em.createQuery("SELECT g FROM CronJob g", CronJob.class).getResultList();


		} finally {
			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}
		return jobList;
	}

	@POST
	@Path("/job")
	@Produces("application/json")
	@Consumes("application/json")
	public CronJob insertdata2(CronJob cronjob) {
		Scheduler scheduler = (Scheduler) context.getAttribute("scheduler");
		EntityManagerFactory emf = (EntityManagerFactory) context.getAttribute("emf");
		EntityManager em = emf.createEntityManager();
		try {
			em.getTransaction().begin();
			em.persist(cronjob);
			em.getTransaction().commit();

			PersistenceUnitUtil util = emf.getPersistenceUnitUtil();
			Long id = (Long) util.getIdentifier(cronjob);

			if(cronjob.getActive()){
				JobDetail job = newJob(CronJob.class).withIdentity("job"+id, "group1").storeDurably(true).build();
				job.getJobDataMap().put("obj", cronjob);
				job.getJobDataMap().put("servletctxt", context);

				Trigger trigger = newTrigger().withIdentity("trigger" + id, "group1").withSchedule(cronSchedule(cronjob.getCron())).forJob(
						"job"+id, "group1").build();
				
				scheduler.scheduleJob(job, trigger);
				context.setAttribute("job" + id, job);
				
				CronJob cjob = em.find(CronJob.class, id);
				em.getTransaction().begin();
				cjob.setNextexecution(trigger.getNextFireTime().getTime());
				em.getTransaction().commit();
			}
			
		} catch (Exception e) {
			logger.error("Error to POST job","",e);
		} finally {
			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}
		return cronjob;
	}

	@DELETE
	@Path("/job/{id}")
	public String deletedata(@PathParam("id") String id) {
		/**Shiro test**/
		/*Subject currentUser = SecurityUtils.getSubject();
		if(!currentUser.hasRole("Administrator")){
			return "Not allowed";
		}*/
		/****************/
		Scheduler scheduler = (Scheduler) context.getAttribute("scheduler");
		EntityManagerFactory emf = (EntityManagerFactory) context.getAttribute("emf");
		EntityManager em = emf.createEntityManager();
		try {
			CronJob job = em.find(CronJob.class, Long.parseLong(id));
			//CronJob job = em.createQuery("SELECT g FROM CronJob g where g.id=" + id, CronJob.class).getSingleResult();
			em.getTransaction().begin();
			em.refresh(job); 
			em.remove(job);
			em.getTransaction().commit();

			if(context.getAttribute("job"+job.getId())!=null){
				scheduler.deleteJob(((JobDetail) context.getAttribute("job" + job.getId())).getKey());
				context.removeAttribute("job"+job.getId());
			}
			
		} catch(Exception e){
			logger.error("Error to DELETE job","",e);
		} finally {
			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}
		return "done";
	}

	@PUT
	@Produces("application/json")
	@Consumes("application/json")
	@Path("/job/{id}")
	public String updatedata2(@PathParam("id") String id, CronJob newjob) {
		Scheduler scheduler = (Scheduler) context.getAttribute("scheduler");		
		
		logger.info("PUT : "+newjob.getDescription());
		EntityManagerFactory emf = (EntityManagerFactory) context.getAttribute("emf");
		EntityManager em = emf.createEntityManager();
		try {
			
			CronJob cronjob = em.find(CronJob.class, Long.parseLong(id));
			//CronJob cronjob = em.createQuery("SELECT g FROM CronJob g where g.id='" + id + "'", CronJob.class).getSingleResult();
			
			//If job was active
			if(cronjob.getActive()){
				scheduler.deleteJob(((JobDetail) context.getAttribute("job" + cronjob.getId())).getKey());
				context.removeAttribute("job"+cronjob.getId());
			}
			
			em.getTransaction().begin();
			cronjob.setName(newjob.getName());
			cronjob.setDescription(newjob.getDescription());
			cronjob.setActive(newjob.getActive());
			cronjob.setCron(newjob.getCron());
			cronjob.setAlarm(false);
			com.ae.webcron.Request newrequest = (com.ae.webcron.Request) newjob.getRequest();
			com.ae.webcron.Request req = new com.ae.webcron.Request(newrequest.getMethod(), newrequest.getUrl(), newrequest.getBody());
			req.setType(newrequest.getType());
			com.ae.webcron.Notification newnot = (com.ae.webcron.Notification) newjob.getNotification();
			Notification not = new Notification();
			not.setNotify(newnot.getNotify());
			not.setInternetAddresses(newnot.getInternetAddresses());
			not.setSubject(newnot.getSubject());
			not.setText(newnot.getText());
			not.setScript(newnot.getScript());
			cronjob.setNotification(not);
			cronjob.setRequest(req);
			cronjob.setNextexecution(null);
			
			


			//If new job is active
			if(cronjob.getActive()){

				JobDetail job = newJob(CronJob.class).withIdentity("job"+cronjob.getId(), "group1").storeDurably(true).build();
				job.getJobDataMap().put("obj", cronjob);
				job.getJobDataMap().put("servletctxt", context);

				Trigger trigger = newTrigger().withIdentity("trigger" + cronjob.getId(), "group1").withSchedule(cronSchedule(cronjob.getCron())).forJob(
						"job"+cronjob.getId(), "group1").build();

				
				scheduler.scheduleJob(job, trigger);
				context.setAttribute("job" + id, job);

				cronjob.setNextexecution(trigger.getNextFireTime().getTime());

			}else{
				cronjob.setLastlog(null);
			}
			
			em.getTransaction().commit();
			
		} catch(Exception e){
			logger.error("Error to PUT job","",e);
		} finally {
			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}
		return "{\"status\":\"done\"}";
	}
}