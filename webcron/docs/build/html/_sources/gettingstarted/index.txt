Getting started
===============

This section contains common tasks in Webcron, to get new users using the system quickly and easily.

|

Create a job
------------

Click the **new** button.

|

1. Job excution
***************

Define its execution period using the **cron** parameter (`Documentation <http://www.quartz-scheduler.org/documentation/quartz-1.x/tutorials/crontrigger>`_)

Check the **Activate** checkbox to enable the job.

.. image:: img/job.png


|

2. Job's request
****************

Choose the request method (GET, POST, PUT or DELETE)
Define the url
Set the parameters to send for PUT or POST methods
It can be : 

* parameters in the form field 

.. code-block:: javascript

   title=foo
   body=bar
   userId=1


* a JSON string in the body field

.. code-block:: javascript

   {
      title: 'foo',
      body: 'bar',
      userId: 1
   }


.. image:: img/request.png

|

3. Process response using script
********************************

The response returned by the web request can be processed using a script. The result will trigger or not an email notification.
The javascript function must be named **fx** et contains one unique parameter which is the response from the web request.
This fonction must return true or false. When true is returned, an email will be sent.

.. image:: img/script.png

|

4. Trigger email notification
*****************************

An email can be sent using :

* using the http request status (choose *If execution fails*)
* using the script's result (choose *After execution*)

Available variables are :

* ``%Name%`` : Job's name
* ``%Status%`` : Request status (HTTP code)
* ``%StatusText%`` : Request status text
* ``%Body%`` : Request's response body

.. image:: img/notification.png

|

Click the **Add** button to create the new job.

|

Update a job
------------
Select the job to  modify in the list and clicke the **Edit** button.
Make your changes in the editor's window.
Click the **Update** button.

|

Delete a job
------------
Select the job to  delete.
Click the **Delete** button.

|

View logs
---------

Logs can be visualized in the **Logs** tab (Right panel).
Select a log to view the body's response of the request.

.. image:: img/logs.png


|

Run a job
---------
Job can be runned manually.
Click the **Run** button to execute a job.
The result will be added in the logs.