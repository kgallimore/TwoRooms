#!/bin/sh
# This script checks if the container is started for the first time.

DATABASE="./prisma/tworooms.db"
# For early dev just delete the db every time
rm $DATABASE
if [ ! -e /$DATABASE ]; then
    npm run migrate && npm run seed
else
    npm run migrate
fi
npm run start:prod