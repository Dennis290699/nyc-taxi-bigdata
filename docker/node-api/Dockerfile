FROM node:16-alpine

WORKDIR /app

COPY api/package*.json ./
RUN npm install

COPY api/ .
COPY spark-jobs/ /opt/spark-apps/

EXPOSE 3000

CMD ["npm", "start"]