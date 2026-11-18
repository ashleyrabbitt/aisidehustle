FROM node:22-alpine
WORKDIR /app
COPY field-guide ./field-guide
COPY server.mjs start.mjs ./
USER node
CMD ["node", "start.mjs"]
