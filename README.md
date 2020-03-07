# OpenALPRBrowserDemo
OpenALPR Browser Demo

Edit /js/server.js and add your secret key from OpenALPR.

https://hutch120.github.io/OpenALPRBrowserDemo/

If you are looking for a demo, I'm pretty sure OpenALPR now has that. I wrote this demo app before they had one in order to show a client the features of their product. So in the first instance check out https://cloud.openalpr.com/

Second, this is a browser demo, it is really just to understand the API. It 100% runs in the browser and demonstrates some of the OpenALPR capability with minimal setup or configuration effort.

The server.js file is simply there to indicate that you shouldn't hardcode credentials. For the sake of a client demo I simply hardcode some temporary credentials from https://www.openalpr.com/ to make it work.

When you are ready to take your application further you would clearly need to add some form of authentication to the system or run the code on a server where credentials are protected.

If you actually want to run this on a server as a nodejs app, then there would be a bunch of additional stuff to do, such as wrapping it in an expressjs wrapper. 

I wouldn't recommend using this as a base for any application. Consider starting with either ReactJS for client side or expressjs template for serverside.
