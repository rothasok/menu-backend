
## Express Server with Docker Compose
## Prerequisites
```sh
apt update
```
# install npm
```sh
apt install npm
```
# install vmp
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
# install node js 18
```sh
nvm install 18
```
# install docker
```sh
apt install docker
```
```sh
systemctl start docker

## Setting Up Environment Variables

Copy the example `.env` file to `.env` and update it with your configuration:

```sh
cp .env.example .env
```

## Install Dependencies

To install all required dependencies for the Express.js project, run the following commands one by one:

```sh
npm install @aws-sdk/client-s3
```

```sh
npm install @socket.io/redis-adapter
```

```sh
npm install axios
```

```sh
npm install bcrypt
```

```sh
npm install body-parser
```

```sh
npm install dotenv
```

```sh
npm install ioredis
```

```sh
npm install joi
```

```sh
npm install jsonwebtoken
```

```sh
npm install mongoose
```

```sh
npm install mongoose-paginate-v2
```

```sh
npm install multer
```

```sh
npm install multer-s3
```

```sh
npm install passport
```

```sh
npm install passport-jwt
```

```sh
npm install rate-limit-redis
```

```sh
npm install redis
```

```sh
npm install socket.io
```

```sh
npm install swagger-generator-express
```

```sh
npm install swagger-jsdoc
```

## Build Project

To build the project using Docker Compose, run:

```sh
docker compose build
```

## Run Project

To run the project in detached mode, use the following command:

```sh
docker compose up -d
```

This will start all the necessary services defined in your `docker-compose.yml` file.

## Access the Application

Once the project is running, you can access the Express server at:

```
http://localhost:<your-port>
```

Replace `<your-port>` with the port specified in your Docker Compose configuration or `.env` file.

## Stopping the Project

To stop all services, run:

```sh
docker compose down
```

