#!/bin/sh
# This script checks if the container is started for the first time.

DATABASE="./prisma/tworooms.db"
if [ ! -e /$DATABASE ]; then
    npm run migrate && npm run seed
else
    npm run migrate
fi
npm run start:prod