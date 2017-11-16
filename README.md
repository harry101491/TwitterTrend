# Twitter Trend Application
A Tweet Sentiment Analysis Application built on Node and Express. It get
tweets from **Twitter Streaming API** and collects then on **AWS SQS**. On every tweet it uses **IBM Watson Sentiment analysis** and notifiy the WebServer with **AWS SNS** to plot on the google maps.

## Getting Started

For starting the app you have to put your own set of credentials at production environment (Heorku etc.). You can set the enviornment variables in prod environment to make the application work. For the local machine just use your personal credentials and run

```
npm install
```
and 

```
npm start
```

## Example

This is image of the google maps after getting the sentiments from the server and plotting them on the maps.

![alt Goolge map Image](/images/sampleImage.jpeg?raw=true "Sentiment Analysis of Tweets") 

## Authors

* **Harshit Pareek** - Software Engineer(NYU Grad)
Looking for new opportunites

* **Navneet Jain** - Software Engineer(NYU Grad)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details