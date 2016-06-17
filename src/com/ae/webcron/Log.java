package com.ae.webcron;
 
import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement
@Entity
public class Log implements Serializable {
    private static final long serialVersionUID = 1L;
 
    // Persistent Fields:
    private long startTime;
    private int status;
    private String statusText;
    private String headers;
    private String body;
    @XmlElement(nillable=true)
    private String scriptResult;
    private int duration;
    
	@XmlTransient
    //@ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="id", nullable=false)
    private CronJob cronjob;
 
    // Constructors:
    public Log() {
    }
 
    public Log(long startTime, int status, String statusText, String headers, String body) {
    	this.startTime = startTime;
    	this.status = status;
        this.statusText = statusText;
        this.body = body;
        this.headers = headers;
    }

	public long getStartTime() {
		return startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getStatusText() {
		return statusText;
	}

	public void setStatusText(String statusText) {
		this.statusText = statusText;
	}

	public String getHeaders() {
		return headers;
	}

	public void setHeaders(String headers) {
		this.headers = headers;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	@XmlTransient
	public CronJob getCronjob() {
		return cronjob;
	}

	public void setCronjob(CronJob cronjob) {
		this.cronjob = cronjob;
	}
	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	public String getScriptResult() {
		return scriptResult;
	}

	public void setScriptResult(String scriptResult) {
		this.scriptResult = scriptResult;
	}
	// String Representation:
    @Override
    public String toString() {
        return this.getStatus()+" "+this.getStatusText();
    }

	
} 