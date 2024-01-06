#!/bin/sh
# This script checks if the container is started for the first time.

DATABASE="./prisma/tworooms.db"
if [ ! -e /$DATABASE ]; then
    npm run seed
fi

npm run start:prod