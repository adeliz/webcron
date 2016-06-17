Installation
============

Webcron is packaged as a standalone servlet for use with existing application servers such as Apache Tomcat and Jetty.

.. note:: Webcron has been mostly tested using Tomcat, and so is the recommended application server. Other application servers have been known to work, but are not guaranteed.

|

Deploy
------

Make sure you have a Java Runtime Environment (JRE) installed on your system. Webcron requires a Java 8 environment. You can download `JRE 8 from Oracle <http://www.oracle.com/technetwork/java/javase/downloads/>`_.

`Download <http://adeliz.bitbucket.org/>`_ and unpack the archive.
Deploy the web archive as you would normally. Often, all that is necessary is to copy the webcron.war file to the application server’s webapps directory, and the application will be deployed.

.. note:: A restart of your application server may be necessary.

|

Running
-------

Use your container application’s method of starting and stopping webapps to run Webcron.

To access the Web Interface, open a browser and navigate to ``http://SERVER/webcron``. For example, with Tomcat running on port 8080 on localhost, the URL would be ``http://localhost:8080/webcron``.

|

Uninstallation
--------------

Stop the container application.
Remove the Webcron webapp from the container application’s webapps directory. This will usually include the webcron.war file as well as a webcron directory.