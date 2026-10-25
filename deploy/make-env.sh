#!/bin/sh
IMAGE_NAME=$1
cat << ENVEOF > .env
NEXTAUTH_SECRET=secret_key_novaria_hospital_2026
NEXTAUTH_URL=http://72.60.194.165
DATABASE_URL=postgresql://postgres:postgres@db:5432/hos?schema=public
IMAGE_APP=${IMAGE_NAME}:latest
IMAGE_MIGRATOR=${IMAGE_NAME}-migrator:latest
ENVEOF
