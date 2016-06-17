package com.ae.webcron;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.servlet.ServletContext;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.DefaultProxyRoutePlanner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

@XmlRootElement
@Entity
@SequenceGenerator(name = "seq", initialValue = 1, allocationSize = 1)
public class CronJob implements Serializable, Job {

	@Transient
	private Logger logger = LogManager.getLogger(this.getClass().getName());
	
	private static final long serialVersionUID = 1L;

	// Persistent Fields:
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq")
	// @GeneratedValue
	@Id
	@XmlAttribute
	Long id;
	private String name;
	private String description;
	private String cron;
	private Boolean active;
	private Boolean alarm;
	private Long lastexecution;
	private Long nextexecution;
	@XmlTransient
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "cronjob")
	private Set<Log> logs;
	// @OneToOne (cascade = CascadeType.ALL) @MapsId private Request request;
	@Embedded
	private Request request;
	@Embedded
	private Log lastlog;
	@Embedded
	private Notification notification;

	public CronJob() {
		// TODO Auto-generated constructor stub
	}

	public CronJob(String name, String description, String cron, Boolean active, Request request) {
		this.name = name;
		this.description = description;
		this.cron = cron;
		this.active = active;
		this.request = request;
		this.alarm = false;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCron() {
		return cron;
	}

	public void setCron(String cron) {
		this.cron = cron;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Request getRequest() {
		return request;
	}

	public void setRequest(Request request) {
		this.request = request;
	}

	public Long getLastexecution() {
		return lastexecution;
	}

	public void setLastexecution(Long lastexecution) {
		this.lastexecution = lastexecution;
	}

	public Long getNextexecution() {
		return nextexecution;
	}

	public void setNextexecution(Long nextexecution) {
		this.nextexecution = nextexecution;
	}

	public Log getLastlog() {
		return lastlog;
	}

	public void setLastlog(Log lastlog) {
		this.lastlog = lastlog;
	}

	public Boolean getAlarm() {
		return alarm;
	}

	public void setAlarm(Boolean alarm) {
		this.alarm = alarm;
	}

	public Notification getNotification() {
		return notification;
	}

	public void setNotification(Notification notification) {
		this.notification = notification;
	}

	@XmlTransient
	public Set<Log> getLogs() {
		return logs;
	}

	public void setLogs(Set<Log> logs) {
		this.logs = logs;
	}

	//String Representation:
	@Override
	public String toString() {
		return name;
	}

	public void execute(JobExecutionContext context) throws JobExecutionException {
		
		Date start = new Date();
		Boolean sendAlarm = false;
		// JobKey key = context.getJobDetail().getKey();
		JobDataMap dataMap = context.getJobDetail().getJobDataMap();

		// String description = dataMap.getString("description");

		CronJob cronjob = (CronJob) dataMap.get("obj");

		ServletContext ctx = (ServletContext) dataMap.get("servletctxt");
		EntityManagerFactory emf = (EntityManagerFactory) ctx.getAttribute("emf");
		EntityManager em = emf.createEntityManager();

		try {
			CronJob job = em.find(CronJob.class, cronjob.getId());
			Log log = null;

			HttpResponse<String> stringResponse = null;
			
			
			try {
				Properties props = new Properties();
				InputStream is = null;
				String path = ".."+System.getProperty("file.separator");
				if(ctx.getInitParameter("WEBCRON")!=null){
					path = ctx.getInitParameter("WEBCRON")+System.getProperty("file.separator");
					is = new FileInputStream(path+"webcron.properties");
				}else{
					is = SmtpSender.class.getClassLoader().getResourceAsStream(path+"webcron.properties");
				}
				
				props.load(is);
				is.close();
				
				if(props.get("proxy.host")!=null){
					String proxyhost = props.get("proxy.host").toString();
					int proxyport = 80;
					if(props.get("proxy.port")!=null){proxyport = Integer.valueOf(props.get("proxy.port").toString());}
					
					HttpHost proxy = new HttpHost(proxyhost, proxyport);
					DefaultProxyRoutePlanner routePlanner = new DefaultProxyRoutePlanner(proxy);
					
					CloseableHttpClient httpclient;
					if(Boolean.parseBoolean(props.getProperty("proxy.auth")) && props.get("proxy.user")!=null && props.get("proxy.password")!=null){
						CredentialsProvider credsProvider = new BasicCredentialsProvider();
				        credsProvider.setCredentials(
				        		AuthScope.ANY,
				                new UsernamePasswordCredentials(props.get("proxy.user").toString(), props.get("proxy.password").toString()));
				        httpclient = HttpClients.custom()
			                    .setRoutePlanner(routePlanner)
			                    .setDefaultCredentialsProvider(credsProvider)
			                    .build();
				        Unirest.setHttpClient(httpclient);
					}else{
						httpclient = HttpClients.custom()
			                    .setRoutePlanner(routePlanner)
			                    .build();
					}
					
					Unirest.setHttpClient(httpclient);
					
				}
				
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			
			switch (cronjob.getRequest().getMethod()) {
			case "GET":
				stringResponse = Unirest.get(cronjob.getRequest().getUrl()).asString();
				break;
			case "POST":
				String form = cronjob.getRequest().getForm();

				if(form!=null && form!=""){
					
					String[] params = form.split("\n");
					Map<String,Object> map = new HashMap<String,Object>();
					for(int i=0;i<params.length;i++){
						map.put(params[i].split("=")[0],params[i].split("=")[1]);
					}
					stringResponse = Unirest.post(cronjob.getRequest().getUrl())
							.fields(map)
							.asString();
				}else{
					stringResponse = Unirest.post(cronjob.getRequest().getUrl()).body(cronjob.getRequest().getBody()).asString();	
				}
				break;
				
			}
			log = new Log((new Date()).getTime(), stringResponse.getStatus(), stringResponse.getStatusText(), stringResponse.getHeaders().toString(),
					stringResponse.getBody());
			log.setCronjob(job);

			// CronJob job =
			// em.createQuery("SELECT g FROM CronJob g where g.id='" + id + "'",
			// CronJob.class).getSingleResult();
			em.getTransaction().begin();
			job.setLastexecution((new Date()).getTime());
			if(context.getNextFireTime()!=null){
				job.setNextexecution(context.getNextFireTime().getTime());
			}
			
			// CronTrigger cronTrigger = (CronTrigger) context.getTrigger();
			// cronTrigger.getExpressionSummary();

			if (!job.getNotification().getScript().equals("")) {
				ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
				Invocable invocable = (Invocable) engine;
				boolean result = false;
				try {
					engine.eval(job.getNotification().getScript());
					result = (boolean) invocable.invokeFunction("fx", stringResponse.getBody());
					log.setScriptResult(String.valueOf(result));
				} catch (Exception e) {
					log.setScriptResult(e.getMessage());
				}

				if (result) {
					if (!job.getAlarm()) {
						if (job.getNotification().getNotify() == 2) {
							sendAlarm = true;
						}
						job.setAlarm(true);
					}
				} else {
					if (job.getAlarm()) {
						job.setAlarm(false);
					}
				}
			} else {
				if (job.getNotification().getNotify() == 2) {
					sendAlarm = true;
				}
				if (job.getAlarm()) {
					job.setAlarm(false);
				}
			}

			/**
			 * Si la tâche dure plus longtemps que l'intervalle entre 2
			 * executions, le job se trouve modifié par 2 EntityManager (em)
			 * différents et le commit ne peut se faire. -> exception. Il
			 * faudrait un seul entitymanager pour toutes les executions d'une
			 * même tâche.
			 */
			Date end = new Date();
			long diffInMillies = end.getTime() - start.getTime();
			if(job.getLastexecution()!=null && job.getNextexecution()!=null){
				if (diffInMillies > (job.getNextexecution() - job.getLastexecution())) {
					logger.warn(job.getName() + " takes too long!! (longer than the execution interval)");
				}
			}
			
			log.setDuration((int) diffInMillies);
			job.setLastlog(log);

			em.getTransaction().commit();

			if(sendAlarm){
				this.sendEmail(job,ctx);
			}
			
			
			
		} catch (UnirestException e) {

			logger.error("Unirest exception","",e);
			em = emf.createEntityManager();
			CronJob job = em.find(CronJob.class, cronjob.getId());
			em.getTransaction().begin();
			Log log = new Log((new Date()).getTime(), 0, "Unknown error", "", "");
			if (e.getCause().getClass().getName().equals("java.net.UnknownHostException")) {

				log = new Log((new Date()).getTime(), 0, "Unknown host", "", "");
				if (!job.getAlarm()) {
					if (job.getNotification().getNotify() > 0) {
						sendAlarm = true;
					}
					job.setAlarm(true);
				}

			}
			if (e.getCause().getClass().getName().equals("org.apache.http.conn.ConnectTimeoutException")) {
				log = new Log((new Date()).getTime(), 408, "Time out", "", "");
				if (!job.getAlarm()) {
					if (job.getNotification().getNotify() > 0) {
						sendAlarm = true;
					}
					job.setAlarm(true);
				}
			}

			log.setCronjob(job);

			job.setLastexecution((new Date()).getTime());
			if(context.getNextFireTime()!=null){
				job.setNextexecution(context.getNextFireTime().getTime());
			}
			
			Date end = new Date();
			long diffInMillies = end.getTime() - start.getTime();
			if(job.getLastexecution()!=null && job.getNextexecution()!=null){
				if (diffInMillies > (job.getNextexecution() - job.getLastexecution())) {
					logger.warn(job.getName() + " takes too long!! (longer than the execution interval)");
				}
			}
			log.setDuration((int) diffInMillies);
			job.setLastlog(log);
			em.getTransaction().commit();

			if(sendAlarm){
				this.sendEmail(job,ctx);
			}
		} catch (Exception e) {
			logger.error("Error during job execution","",e);
		} finally {

			// Delete extra logs

			int nblogs = (int) (long) em.createQuery("SELECT COUNT(g) FROM Log g JOIN g.cronjob c where c.id=" + cronjob.getId()).getSingleResult();
			int nboklogs = (int) (long) em.createQuery("SELECT COUNT(g) FROM Log g JOIN g.cronjob c where g.statusText='OK' and c.id=" + cronjob.getId())
					.getSingleResult();

			if (nblogs > 100) {
				em.getTransaction().begin();
				int nbToDelete = nblogs - 100;
				// Delete ok logs
				if (nboklogs >= nbToDelete) {
					//Delete only ok logs
					List<Log> logs = em
							.createQuery(
									"SELECT g FROM Log g JOIN g.cronjob c where g.statusText='OK' and c.id=" + cronjob.getId() + " order by g.startTime asc",
									Log.class).setMaxResults(nbToDelete).getResultList();
					for (Log log : logs) {
						em.remove(log);
					}
				} else {
					if (nboklogs > 0) {
						//Delete ok logs first
						List<Log> logs = em.createQuery(
								"SELECT g FROM Log g JOIN g.cronjob c where g.statusText='OK' and c.id=" + cronjob.getId() + " order by g.startTime asc",
								Log.class).setMaxResults(nboklogs).getResultList();
						for (Log log : logs) {
							em.remove(log);
						}
					}
					// If not enough, delete errors logs
					List<Log> logs = em.createQuery("SELECT g FROM Log g JOIN g.cronjob c where c.id=" + cronjob.getId() + " order by g.startTime asc",
							Log.class).setMaxResults(nbToDelete - nboklogs).getResultList();
					//Then delete errors logs
					for (Log log : logs) {
						em.remove(log);
					}
				}
				em.getTransaction().commit();
			}

			// Close the database connection:
			if (em.getTransaction().isActive())
				em.getTransaction().rollback();
			em.close();
		}

		// cronjob.setNextexecution(new Date().getTime());

		/*try {

			Process proc =
			Runtime.getRuntime().exec("cmd.exe /c ping 172.20.41.10");
			
			Process proc = Runtime.getRuntime().exec(command);
			BufferedReader in = new BufferedReader(newInputStreamReader(proc.getInputStream()));
			String response;
			while((response = in.readLine()) != null) {
				..write response
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}*/

	}

	private void sendEmail(CronJob cronjob, ServletContext ctx) {

		Notification notif = cronjob.getNotification();

		String subject = notif.getSubject();
		if(subject!=null){
			subject = subject.replaceAll("%Name%", cronjob.getName());
			subject = subject.replaceAll("%Status%", String.valueOf(cronjob.getLastlog().getStatus()));
			subject = subject.replaceAll("%StatusText%", cronjob.getLastlog().getStatusText());
			subject = subject.replaceAll("%Body%", cronjob.getLastlog().getBody());
		}
		

		String text = notif.getText();
		if(text!=null){
			text = text.replaceAll("%Name%", cronjob.getName());
			text = text.replaceAll("%Status%", String.valueOf(cronjob.getLastlog().getStatus()));
			text = text.replaceAll("%StatusText%", cronjob.getLastlog().getStatusText());
			text = text.replaceAll("%Body%", cronjob.getLastlog().getBody());
		}
		

		//GmailSender.sendEmail(notif.getInternetAddresses(), subject, text);
		SmtpSender.sendEmail(notif.getInternetAddresses(), subject, text, ctx);
	}
}
