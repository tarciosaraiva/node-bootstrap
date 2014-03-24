[![Build Status](https://travis-ci.org/tarciosaraiva/nodecreate.svg?branch=master)](https://travis-ci.org/tarciosaraiva/nodecreate)
[![Code Climate](https://codeclimate.com/github/tarciosaraiva/nodecreate.png)](https://codeclimate.com/github/tarciosaraiva/nodecreate)

nodecreate
==========

Bootstraps a new `node` application.

I created this utility to help out other devs when deciding how to structure their new `node` app. When you run `npm init` then only thing that happens is the creation of the `package.json`.

After some research I found that devs usually find have at least a `test` folder while some others have a `lib` folder where they keep their own files accessed from the main file.

I built on that research and implemented a step previous to `npm init` which allows you to create a bunch of folders prior to running `npm init`, which is also run by this utility.

How to run it
-------------
First install it by running `npm install -g nodecreate`.

Then execute `ncreate` and you should be good. Here are the questions that get asked:

1. Please enter the name of new app:
2. Would you like to store your app contributors in a lib directory?
3. What test framework would you like to use?
4. Would you like me to create a bin directory?
5. Would you like to include a Travis file?

###### A note about question #4 (testing framework)
Enter the name of the npm package you would like to install. For instance, by default, it relies on [mocha](https://www.npmjs.org/package/mocha) and also brings along [chai](https://www.npmjs.org/package/chai), [sinon](https://www.npmjs.org/package/sinon) and [should](https://www.npmjs.org/package/should).

Even if you decide to go with [jasmine](https://www.npmjs.org/package/jasmine-node) it will bring those extra dependencies along.

All the dependencies mentioned above will be under `devDependencies` on your `package.json`.

Contributing
------------
Yes, we have a [Trello board](https://trello.com/b/VTVJ9gLm/nodecreate). Feel free to add ideas.

Or simply fork it, change it and submit a pull request.
