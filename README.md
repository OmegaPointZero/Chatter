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


## Current sprint missions

+ Update the mongodb schema to save all conversations any agent has to their entry in the database.
    + Test case 1: Conduct 3 conversations. Passing: 3 conversations all saved, independently and properly.
    + Upon saved chats, have agent chat window open in new tab
    + Let agents access old conversations


## Next sprint mission

+ Build an actual UI for customers, and for agents
    + Customers get a basic lorem ipsum page, and links to the possible chat categories
    + Agents have an agent page, that has a link to let them become available for chats
        + Passing: test it on chrome and firefox for Ubuntu and windows, plus chrome, firefox and dolphin on android
+ Create a seperate category of agent: Administrator
    + Admins can create new agents
    + Admins can assign categories to agents
    + Admins can allow 1-4 chats per agent on the agent chat page
+ Update websockets infrastructure to match customers to agent by category only
+ Allow agents to go on "last call", and stop being added to queue upon activating when customers disconnect

## The latest updates

+ Current Sprint completions:
    + Preliminary chat UI for customers and agents created
    + Chats are kept between one agent and one client
    + There is a queue of agents and clients waiting, when there are more of one waiting than the other
    + Upon one client disconnection, the other party is notified of the disconnection, and prevented from sending further messages
    + Agent can choose when to jump back in the queue after finishing a chat with a customer

## Outlook

Chatter is in it's initial stages. The current project outlook is as follows:

+ Customer Service Agent login
  + Keep track of number of agents logged in at any given time
  
+ Categories of Service
  + There should be 3-4 default categories of service, but can be changed/updated by the user
  + Specific agents should be assigned categories they can handle
  
+ Customer facing side
  + When customers visit, server adds customers to count of connected customers
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
