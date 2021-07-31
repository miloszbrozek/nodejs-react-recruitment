FROM node:12

WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/dist/ .

WORKDIR /usr/src/app/frontend
COPY frontend/dist/ .

ENV FRONTEND_LOCATION="/usr/src/app/frontend"
ENV NODE_PATH="/usr/src/app/backend"
# ENV PORT="5000"

WORKDIR /usr/src/app/backend
# EXPOSE $PORT

CMD [ "node", "index.js" ]