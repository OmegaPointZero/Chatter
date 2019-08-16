# Chatter
A customer service chat client built with websockets

## Getting started

### .env file

Chatter requires a .env file with the following values populated in order to work:

.env
    + `SESSION_SECRET` = session secret for express
    + `SERVER_PORT` = port number for the server to listen for connections on
    + `MONGOURL` = url of the mongo database being used (`mongodb://mongourl/databasename`)
    + `AGENT_WHITELIST` = Comma seperated IP addresses that act as a whitelist for agent access. Should probably throw this into a database somewhere, realistically this would become quite large.


### The latest updates

Server skeleton works, enough to init and run with npm. If the user sends a req from the whitelist, the page for agents is rendered. If not, they get redirected to the welcome page for customers.

Chatter is in it's initial stages. The current project outlook is as follows:

+ Customer Service Agent login
  + Keep track of number of agents logged in at any given time
  
+ Categories of Service
  + There should be 3-4 default categories of service, but can be changed/updated by the user
  + Specific agents should be assigned categories they can handle
  
+ Customer facing side
  + When customers visit, server adds customers to count of connected customers
  + Let customer select category  of service needed (or 'other' to be connected to next general agent)
  + Create a queue of waiting customers, by category
    + Keep track of agents in each category, when agent becomes available, connect customer that's waited longest to the agent
  + A customer's place in line is kept track of, and shown to the customer, updated in real time with websockets
 
+ Chats
  + Customer can see if agent is typing (sent via websockets)
  + Agent can see what the customer is typing, even before message is sent
  + Chats have a maximum length
  + Each chat sent shows what time the chat was sent
  + Chats are displayed so the chat *you* sent is always on the left, the other person is on the right (regardless of customer/agent  role)
  + Each chat an agent engages with gets saved to conversations in the DB
