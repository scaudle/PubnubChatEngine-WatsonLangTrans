
Setting up backend for multilingual chat app using PubNub ChatEngine involves two major steps:

1. Setup Watson Translator Service
2. Setup PubNub account with ChatEngine support

This file provides detailed steps to carry out the backend setup for multilingual chatbot using PubNub ChatEngine and IBM Watson Language Translator service.

#### Prerequisites

Before you can create Watson Language Translator Service, you need your own [IBM ID](https://console.bluemix.net/).  

You also need a developer account on [PubNub](https://admin.pubnub.com) to  create and configure PubNub function for accessing Watson Language Translator service. Once you have created the accounts, follow the steps below.

#### Create Watson Language Translator Service

##### Step 1

Log on to [IBM Cloud](https://console.bluemix.net/) with your IBM ID. Go to catalog, then select **Language Translator** under Watson services.

![Watson Language Translator Service](screenshots/lts_1.png)


##### Step 2

Enter a name for the service. Scrolling down, leave the pricing plan to 'Lite' and click on 'Create' button in the bottom right corner.

![Watson Language Translator Service](screenshots/lts_2.png)


##### Step 3

Once the service is created, from the service page, go to 'Service credentials'. We need to create new credentials so click on 'New credential' button.

![Watson Language Translator Service](screenshots/lts_3.png)


On the popup screen, enter a name for the credentials and leave other things default. Click on 'Add' button on the popup screen. Watson will create a new set of credentials for the Language Translator service for you.

![Watson Language Translator Service](screenshots/lts_4.png)

##### Step 4

On the service page, click on 'View credentials' which will show a json object with url, username and password for your service.
The username and password are unique to your service instance created. Make note of these as we will use them later while setting up the PubNub function.


![Watson Language Translator Service](screenshots/lts_5.png)


This completes the creation of Watson Language Translator Service. There is no need to configure it specifically for our tutorial.




### Configure PubNub ChatEngine

Now that we have created a Language Translator service on IBM Watson, your PubNub account needs to be configured with a couple of functions required for ChatEngine and also to access the Watson Language Translation service.

###### Step 5:

Login to [PubNub](https://admin.pubnub.com) with your credentials and then head to this link -[https://www.pubnub.com/docs/tutorials/chatengine#step-one-pubnub-keys](https://www.pubnub.com/docs/tutorials/chatengine#step-one-pubnub-keys). Click on the 'Setup' button on this page to let PubNub automagically create a new app with all required functions for the ChatEngine. Once the setup is done, a success message will be shown.

![PubNub](screenshots/pubnub-1.png)

![PubNub](screenshots/pubnub-2.png)


###### Step 6:

* Head back to your PubNub dashboard at https://admin.pubnub.com. You should see a new ChatEngine app created for you.

![PubNub](screenshots/pubnub-3.png)


* Click on the app and you can see the publish, subscribe keys created for the app as well. Click on the keys.

![PubNub](screenshots/pubnub-4.png)

* On the next screen, click the copy buttons towards right side of the keys and copy both publish and subscribe keys in a text file on your PC. We will use them later.

![PubNub](screenshots/pubnub-5.png)


###### Step 7:

* From the left side bar, click on FUNCTIONS. You can see the function is already created for Chat Engine. Click on the function box.

![PubNub](screenshots/pubnub-6.png)

* Within the function, two modules are already created and running. These are required for Chat Engine functionality. We need to create one more module within this function to access Watson Langauge Translator service from within PubNub. Click on the '+CREATE' button which will pop-up a 'Create a New Function' dialog box.

![PubNub](screenshots/pubnub-7.png)


###### Step 8:

* In the dialog box to create a new function module, enter a name, select trigger as 'Before Publish or Fire' and put an asterisk in the channel name box. Then click on 'CREATE' button on the dialog box.

![PubNub](screenshots/pubnub-8.png)


###### Step 9:

* A new function will be created with a default code. Replace this default code with the code from file [chatbot-pubnub-function.js](watson-lt-function/watson-lt-function.js).

![PubNub](screenshots/pubnub-9.png)


* Replace the Watson credentials in this code with your Watson Language Translation service credentials obtained in step 4 earlier.

![PubNub](screenshots/pubnub-a.png)


* Save the newly created module by clicking on 'SAVE' button and then restart the module by clicking on 'Restart module' button.

![PubNub](screenshots/pubnub-c.png)

This completes the backend setup for the multilingual chatbot app.
