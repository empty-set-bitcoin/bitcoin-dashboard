FROM mhart/alpine-node:12
WORKDIR /app
COPY ./build .
RUN yarn global add serve
CMD ["serve", "-p", "80", "-s", "."]
