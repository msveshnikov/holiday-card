@echo off
setlocal enabledelayedexpansion

REM Export collections with expanded fields and metadata
ssh -l ubuntu holidaycard.shop "docker exec holiday_mongodb_1 mongoexport --db holiday --type csv --collection users --fields _id,email,firstName,lastName,subscriptionStatus,subscriptionId,createdAt,lastLogin,isAdmin,visitedCountries,preferences.language,preferences.currency,preferences.interests,preferences.bio >users.csv"

REM Copy exported files to local machine
scp ubuntu@holidaycard.shop:/home/ubuntu/users.csv .
