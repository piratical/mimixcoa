#!/bin/bash
#
# start_server.sh
#
# Starts the Node.js
# application server
#
# — 2021.09.20.ET
#
LOG=server.log
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=
ENV=/usr/bin/env
#CMD=/usr/local/bin/node
CMD=/opt/homebrew/bin/node
APP=mimixcoa_server.js
COMMAND="$ENV PGUSER=$PGUSER PGHOST=$PGHOST PGPASSWORD=$PGPASSWORD PGDATABASE=$PGDATABASE PGPORT=$PGPORT $CMD $APP"

# CHECK IF BEING RUN AS ROOT
#if [[ $EUID -ne 0 ]]; then
#  printf "\e[0;31m==============     ERROR      =================\e[m\n"
#  printf "This script must be run as root. Try using 'sudo' ... \n" 
#  printf "\e[0;31m===============================================\e[m\n"
#  exit 1
#fi

printf "\e[0;32m============== STARTING SERVER ================\e[m\n"
until $COMMAND >>$LOG 2>&1 ; do 
  printf "\e[0;31m==============     ERROR      =================\e[m\n"
  printf "\e[0;31m Server died with exit code $?.\e[m\n"
  printf "\e[0;31m===============================================\e[m\n"
  printf "\e[0;32m===============================================\e[m\n"
  printf "\e[0;32m Respawning ... \e[m\n"
  printf "\e[0;32m===============================================\e[m\n"
  echo "$(date '+%Y-%m-%d %X') :: SERVER STARTED" >>$LOG
  sleep 1
done

