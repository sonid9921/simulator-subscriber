FROM node:16-alpine
ENV NODE_ENV=production
RUN mkdir /app && chown -R node /app
WORKDIR /app
COPY ["package*.json", "./"]
RUN npm install --production --silent
COPY . .
USER node
CMD ["npm", "run", "start:docker"]