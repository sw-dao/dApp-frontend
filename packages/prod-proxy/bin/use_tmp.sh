#!/bin/sh
orig=${PWD}
cd /tmp
timeout --signal=SIGINT 10 pm2 logs 'dApp Frontend' --raw --lines 0 | grep --line-buffered --max-count=1 -iq "GraphQL"
if [ $? == 1 ]; then
    echo "Search terminated without finding the pattern"
fi
${orig}/bin/nginx-1.22.0-x86_64-linux -c ${orig}/config/nginx.conf
