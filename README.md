# Chatter
A customer service chat client built with websockets

Chatter is in it's initial stages. The current project outlook is as follows:

+ Customer Service Agent login
  + MongoDB database to hold agent data
  + Path to add agents
  + Path to have agents login
  + Middleware to be sure that only agents have access to agent page
  + Middleware to allow only certain IP addresses have access to agent registration/login
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
  + Customer can see if agent is typic (sent via websockets)
  + Agent can see what the customer is typing, even before message is sent
  + Chats have a maximum length
  + Each chat sent shows what time the chat was sent
  + Chats are displayed so the chat *you* sent is always on the left, the other person is on the right (regardless of customer/agent  role)
  + Each chat an agent engages with gets saved to conversations in the DB
