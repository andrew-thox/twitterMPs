from tweepy.streaming import StreamListener, json
from tweepy import OAuthHandler
from tweepy import Stream
import arrow

#Variables that contains the user credentials to access Twitter API
consumer_key = "usZJVyb6s9o2XZ5OXZqabak0G"
consumer_secret = "vv6q6hVnjZ7gUxUY2ZHqTMQ7npa6Qzgxr9cKsRjiLumPaqpaLA"
access_token = "15841632-Fh3NLi6jXPTn60ic13TcFDUdSf0JBNir0jQ4xNG1J"
access_token_secret = "SMyaN4ZQpGjq8ggMCDMGdsnj4eb2sLei8RDsuG7EYAVUw"

from socketIO_client import SocketIO, LoggingNamespace
socket = SocketIO('localhost', 5000, LoggingNamespace)

#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    # def on_data(self, data):
    #     print(data)
    #     return True

    def on_data(self, json_data):
        #TODO: How favorites?
        data = json.loads(json_data)

        if data.get('retweeted_status'):
            # A retweet could be a retweet by an MP of or an MP
            #print(timestamp, "This is a retweet")
            pass
        elif data.get('in_reply_to_user_id'):
            #print(timestamp, "This is a reply")
            pass
        else:
            try:
                timestamp_ms = data['timestamp_ms']
                timestamp = arrow.get(timestamp_ms[:-3])
                user = data["user"]["screen_name"]
                content = data["text"]
                id = data["id_str"]
                print("Timestamp: ", timestamp)
                print("User: ", user)
                print("Content: ", content)
                print("ID: ", id)
                socket.emit('text',
                            {'msg': content, 'user': user, 'timestamp': timestamp_ms, 'id': id},
                            namespace='/',
                            broadcast=True)
                #print(data)
            except KeyError:
                print(data)
        return True

    def on_error(self, status):
        print(status)


if __name__ == '__main__':
    with open('json_uk_mps/data.json') as data_file:
        data = json.load(data_file)

    twitter_ids = [str(member['twitter']) for member in data if member['twitter']]

    #This handles Twitter authetification and the connection to Twitter Streaming API
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    #twitter_ids = ['15841632']
    stream.filter(follow= twitter_ids)
