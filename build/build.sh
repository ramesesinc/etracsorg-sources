#!/bin/sh
echo "[etracsorg] build..."
docker rmi -f ramesesinc/etracsorg:1.01
docker build -t ramesesinc/etracsorg:1.01 .
echo "[etracsorg] finished."
