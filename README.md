Thanks for checking out my trail running app!

# Mission

Corsa came about in collaboration with my coach Joe McConaughy. I often find it difficult to understand what a good even effort level is when trail running. We wanted to leverage existing data to help runners understand equivilant pacing, race planning, and provide insights into training. It's also just a lot of fun to run in unique environments. Our hope is that this tool will help experts perform their best while providing an on-ramp to newcomers in the space.

# Stack

This repository contains frontend React code for the application. It talks through GraphQL to a set of backend services hosted in serverless AWS. This backend repo is available on my Github profile as well. 

# How it's being used in the wild

The initial ambition of the project was to build a tool that could predict ideal pacing times given data about the course - number of miles, elevation, length of race, etc. The first iteration of the site had a lot more features and tried to do a lot more. This version functions as a pace calculator and per-mile breakdown of GPX track data. I've found the elevation profile of each mile along with the cumulative average pace features to be the most useful.

# Stack
The most recent feature is an AI workout generator built with OpenAI's Assistants API. This system analyzes the selected course and collects some athlete information to generate workouts aimed at preparing runners to race this course. 

# Future plans

I would love to build a live tracking feature to expand media coverage of FKT athletes. There are also many improvements to be made in regards to deployment processes, testing, and user features. The next step will be to get the application into the hands of more runners for feeedback.  