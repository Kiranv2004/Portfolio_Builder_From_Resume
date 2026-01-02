#!/bin/bash
# Seed script for MongoDB

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
sleep 5

# Create Users Collection
mongo resume_portfolio --eval 'db.createCollection("users")'
mongo resume_portfolio --eval 'db.users.createIndex({username: 1}, {unique: true})'
mongo resume_portfolio --eval 'db.users.createIndex({email: 1}, {unique: true})'

# Create Resumes Collection
mongo resume_portfolio --eval 'db.createCollection("resumes")'
mongo resume_portfolio --eval 'db.resumes.createIndex({userId: 1})'

# Create Portfolios Collection
mongo resume_portfolio --eval 'db.createCollection("portfolios")'
mongo resume_portfolio --eval 'db.portfolios.createIndex({userId: 1})'
mongo resume_portfolio --eval 'db.portfolios.createIndex({username: 1}, {unique: true})'

echo "Database seeded successfully!"
