# Reddit Live Chart Experiment
_Code behind [this](https://www.reddit.com/r/dataisbeautiful/comments/b4in2s/live_diagram_of_how_many_upvotes_and_comments/) very popular reddit post._

![result](https://i.imgur.com/TxIkL3R.png)
____
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

### How does it work?

The backend folder contains an API that, given the ID of a reddit post, periodically fetches its comments and upvotes.
Dependencies: [FastApi](http://fastapi.tiangolo.com/), [praw](https://praw.readthedocs.io/en/latest/), [uvicorn](https://www.uvicorn.org/)

The fontend folder contains a responsive and lightweight website that fetches the data from the API and dispays it using [D3.js](https://d3js.org/).

### How to host it?

I would recommend using a Python WSGI HTTP Server like [gunicorn](https://gunicorn.org/) together with [NGINX](https://www.nginx.com/) for the API and any websever should do for the frontend.
