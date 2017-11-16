# Twitter Trend Application
A Tweet Sentiment Analysis Application built on Node and Express. It get
tweets from **Twitter Streaming API** and collects then on **AWS SQS**. On every tweet it uses **IBM Watson Sentiment analysis** and notifiy the WebServer with **AWS SNS** to plot on the google maps.
