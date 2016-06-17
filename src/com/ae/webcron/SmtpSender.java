package com.ae.webcron;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletContext;


public class SmtpSender {
	
	public static void main(String[] args) {
		//sendEmail("adelise.skope@gmail.com","Test","a test description");
	}
	
	public static void sendEmail(String to,String subject, String text, ServletContext ctx){
		Properties props = new Properties();
		InputStream is = null;
		try {
			String path = ".."+System.getProperty("file.separator");
			if(ctx.getInitParameter("WEBCRON")!=null){
				path = ctx.getInitParameter("WEBCRON")+System.getProperty("file.separator");
				is = new FileInputStream(path+"webcron.properties");
			}else{
				is = SmtpSender.class.getClassLoader().getResourceAsStream(path+"webcron.properties");
			}
		
			props.load(is);
			is.close();

		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		Session session = Session.getInstance(props);
		session.setDebug(true);

		try {

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(props.get("mail.sender").toString()));
			message.setRecipients(Message.RecipientType.TO,
				InternetAddress.parse(to));
			if(subject!=null){message.setSubject(subject);}
			if(text!=null){message.setText(text);}else{
				message.setText("");
			}

			Transport.send(message);

		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
	}

}
