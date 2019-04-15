#!/bin/bash

rm -rf ./dist/ && grunt --force && cp -R ../grafana-switch-panel $GOPATH/src/github.com/grafana/grafana/data/plugins 
