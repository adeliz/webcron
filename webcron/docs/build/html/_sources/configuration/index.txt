Configuration
=============

For production use, it is a good idea to define an external data directory that will contain database and properties file, to make it easier to upgrade. Properties will include SMTP parameters. A proxy can also be defined for HTTP requests. 

|

web.xml
-------

When running a Webcron WAR inside a servlet container the data directory can be specified using a servlet context parameter.
Create the following <context-param> element in the WEB-INF/web.xml file for the Webcron application:

.. code-block:: xml

    <web-app>
    	...
    	<context-param>
    		<param-name>WEBCRON</param-name>
    		<param-value>E:\webcron</param-value>
    	</context-param>
    	...
    </web-app>

This folder will contain :
 * the database file (webcron.odb)
 * the properties file (webcron.properties)

|

webcron.properties
------------------

In the webrcon.properties file, the SMTP server has to be set (at least host, port and sender's email). A proxy that will be used only for HTTP requests can also be specified. 

.. code-block:: python

    #SMTP Configuration
    mail.smtp.host=smtp.server.com
    mail.smtp.port=25
    #mail.smtp.auth=true
    #mail.smtp.user=user
    #mail.smtp.password=password
    #mail.smtp.starttls.enable=true
    
    mail.sender=notify.webcron@example.com
    #mail.sender=John Doe <John.doe@example.com>
    
    #PROXY configuration - Only for HTTP requests
    #proxy.host=192.168.1.1
    #proxy.port=8080
    #proxy.auth=true
    #proxy.user=user
    #proxy.password=password