#!/bin/sh

# Substitute env vars in config.js.template and save to config.js
envsubst '${GATEWAY_URL}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g 'daemon off;'
