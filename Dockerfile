FROM hub.c.163.com/library/nginx 


RUN rm /etc/nginx/conf.d/default.conf 

ADD default.conf /etc/nginx/conf.d/ 

COPY dist/  /usr/share/nginx/html/  