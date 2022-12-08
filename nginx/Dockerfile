FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/logs
COPY ./nginx/nginx.conf /etc/nginx/conf.d
COPY ./nginx/logs /var/logs
CMD ["nginx", "-g", "daemon off;"]
