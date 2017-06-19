package com.ae.webcron;
 
import java.io.Serializable;

import javax.persistence.Embeddable;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement 
@Embeddable
public class Request implements Serializable {
    private static final long serialVersionUID = 1L;
 
    // Persistent Fields:
    //@Id @GeneratedValue
    //Long id;
    //@Id private String jobname;
    private String method;
    private String url;
    private String type;
    private String body;
 
    // Constructors:
    public Request() {
    }
 
    public Request(String method, String url, String body) {
        this.method = method;
        this.url = url;
        this.body = body;
    }


	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	// String Representation:
    @Override
    public String toString() {
        return url;
    }
} 