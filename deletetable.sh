#!/bin/bash

aws dynamodb delete-table --table-name users \
--endpoint-url http://localhost:8000
