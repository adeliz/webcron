package com.ae.webcron;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.Message;

/**
 * Email account
 * user : notify.nova
 * password: 1Colombe
 *
 */
public class GmailSender {
	
	@Context
	ServletContext context;
	
    /** Application name. */
    private static final String APPLICATION_NAME =
        "Nova Notifications";


    /** Global instance of the JSON factory. */
    private static final JsonFactory JSON_FACTORY =
        JacksonFactory.getDefaultInstance();

    /** Global instance of the HTTP transport. */
    private static HttpTransport HTTP_TRANSPORT;


    /**
     * Creates an authorized Credential object.
     * @return an authorized Credential object.
     * @throws IOException
     */
    public static Credential authorize() throws IOException {

        GoogleCredential credential2 = null;
        try{
        	String emailAddress = "552198184104-qjg7b6ibsma8ob618eln7j4v121gisob@developer.gserviceaccount.com"; //notasecret
            //JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
        	HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            credential2 = new GoogleCredential.Builder()
                .setTransport(HTTP_TRANSPORT)
                .setJsonFactory(JSON_FACTORY)
                .setServiceAccountId(emailAddress)
                .setServiceAccountPrivateKeyFromP12File(new File("C:/temp/scheduler.p12"))
                .setServiceAccountScopes(Collections.singleton(GmailScopes.GMAIL_SEND))
                .setServiceAccountUser("notify.nova@gmail.com")
                .build();
        }catch(Exception e){
        	e.printStackTrace();
        }
        
        return credential2;
    }

    /**
     * Build and return an authorized Gmail client service.
     * @return an authorized Gmail client service
     * @throws IOException
     */
    public static Gmail getGmailService() throws IOException {
        Credential credential = authorize();
        return new Gmail.Builder(HTTP_TRANSPORT, JacksonFactory.getDefaultInstance(), credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }
    
    public static void sendEmail(String to,String subject, String text){
    	System.setProperty("http.proxyHost", "test.com");
        System.setProperty("http.proxyPort", "8080");
        System.setProperty("https.proxyHost", "test.com");
        System.setProperty("https.proxyPort", "8080");
    	// Build a new authorized API client service.
        
        
        try{
        	Gmail service = getGmailService();        
        	
	        Properties props = new Properties();
	        Session session = Session.getDefaultInstance(props, null);
	
	        MimeMessage email = new MimeMessage(session);
	
	        email.setFrom(new InternetAddress("me"));
	        email.setRecipients(javax.mail.Message.RecipientType.TO,
	                           InternetAddress.parse(to));
	        email.setSubject(subject);
	        email.setText(text);
	        
	        //Message message = createMessageWithEmail(email);
	        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
	        email.writeTo(bytes);
	        String encodedEmail = Base64.encodeBase64URLSafeString(bytes.toByteArray());
	        Message message = new Message();
	        message.setRaw(encodedEmail);
	        
	        message = service.users().messages().send("me", message).execute();

        }catch(Exception e){
        	e.printStackTrace();
        }
    }

    public static void main(String[] args) throws IOException {
    	sendEmail("test@gmail.com,test2@gmail.com","Alarm2","This a new test");
    }

}
