package com.ae.webcron;
 
import java.io.Serializable;

import javax.persistence.Embeddable;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement 
@Embeddable
public class Notification implements Serializable {
    private static final long serialVersionUID = 1L;
 
    // Persistent Fields:
    //@Id @GeneratedValue
    //Long id;
    //@Id private String jobname;
    private String internetAddresses; //Separated by comma (,)
    private String subject;
    private String text;
    private int notify; //0 inactive, 1 active on error, 2 active on success + on error
    private String script;
 
    // Constructors:
    public Notification() {
    }
 
    public Notification(String internetAddresses) {
        this.internetAddresses = internetAddresses;
    }

	public String getInternetAddresses() {
		return internetAddresses;
	}

	public void setInternetAddresses(String internetAddresses) {
		this.internetAddresses = internetAddresses;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getNotify() {
		return notify;
	}

	public void setNotify(int notify) {
		this.notify = notify;
	}

	public String getScript() {
		return script;
	}

	public void setScript(String script) {
		this.script = script;
	}

	// String Representation:
    @Override
    public String toString() {
        return internetAddresses;
    }
} 