#!/bin/bash
# Sets required environment variables and runs the Civic Platform backend.
# Edit the values below before running.

export DB_URL="jdbc:mysql://localhost:3306/civic_platform"
export DB_USERNAME="root"
export DB_PASSWORD=""

export JWT_SECRET="5MTRJnKX10x8ikjinoGjAR9VzVSEOK6+xJ0F9BmyqFQ="

# Get a free key at https://aistudio.google.com/app/apikey and paste it below


./mvnw spring-boot:run
 