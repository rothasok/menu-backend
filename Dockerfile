FROM node:18.20.2-slim
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV TZ="Asia/Bangkok"
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]