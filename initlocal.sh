#!/bin/bash

aws dynamodb create-table --attribute-definitions AttributeName=email,AttributeType=S \
--table-name users --key-schema AttributeName=email,KeyType=HASH \
--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
--endpoint-url http://localhost:8000
