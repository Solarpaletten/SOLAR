#!/bin/bash
export $(grep -v '^#' .env.terraform | xargs)