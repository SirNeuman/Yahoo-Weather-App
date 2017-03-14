# Yahoo-Weather-App

This application was built using the Yahoo Weather API. It is built upon the following technologies.

+ Backend is built using *Python/Flask* - The code on the backend is minimal and is only really used for rendering the html with all of the necessary css and javascript files.
+ Frontend is built with *AngularJS v1* - All of the components of this small application is broken out into their own directives
+ *Bootstrap* - Used for creating a responsive design
+ *Highcharts.js* - Charting library used for creating the 7 Day forecast
+ *Public Yahoo weather API* - [link to documentation for yahoo API](https://developer.yahoo.com/weather/)

### How to run?

If you already have Flask installed globally you can run the application by running `python main.py` in your terminal. 

I would recommend, however, running the application in a [virtual enviornment](http://docs.python-guide.org/en/latest/dev/virtualenvs/). After setting up the virtual environment just install the requirements from requirements.txt via `pip install -r requirements.txt`

Then copy and paste the output, which is the location of where it is running the app, from that command into your browser. E.G. for me it runs on localhost on port 5000 `(http://127.0.0.1:5000/)`.


