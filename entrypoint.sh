#!/bin/sh

# Create a new env.js file with the environment variables
echo "window.env = {" > /usr/share/nginx/html/env.js
for var in $(env | grep ^VITE_); do
  varname=$(echo $var | cut -d= -f1)
  varvalue=$(echo $var | cut -d= -f2-)
  echo "  $varname: \"$varvalue\"," >> /usr/share/nginx/html/env.js
done
echo "};" >> /usr/share/nginx/html/env.js

# Execute the CMD from the Dockerfile
exec "$@"