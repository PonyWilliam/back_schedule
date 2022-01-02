FROM node:latest
 
RUN mkdir -p /home/www/koa
WORKDIR /home/www/koa
 
COPY . /home/www/koa
 
RUN npm install
 
EXPOSE 5858
 
ENTRYPOINT ["npm", "run"]
CMD ["start"]