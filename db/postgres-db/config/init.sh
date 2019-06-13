#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE tripapp;
EOSQL

psql -v ON_ERROR_STOP=1 --dbname tripapp --username "$POSTGRES_USER" <<-EOSQL
    CREATE SCHEMA backend;
EOSQL
