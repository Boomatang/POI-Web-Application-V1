# POI Web Application V1

This is a college project based around the idea of points of interests.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Node
npm
Mongodb
Cloudinary Account
```

### Installing

A step by step series of examples that tell you how to get a development env running

Clone the the project to local machine

```bash
$ git clone https://github.com/Boomatang/POI-Web-Application-V1.git
```

Install all the required packages.

```bash
$ npm install
```

Setup the .env file with the required paths.

```bash
$ mv .env.sample .env
$ vim .env
```

Running in the app will seed the database with sample data. You can run the with the following.
``` bash
$ node index.js
```

## Running the tests

There is currently no automated tests for this system. Pull requests accepted.

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [hapi](https://hapijs.com) - The web framework used
* [npm](https://www.npmjs.com) - Dependency Management

