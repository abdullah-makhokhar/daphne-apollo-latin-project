#!/bin/bash
# Deploy game to separate Vercel project
cd "$(dirname "$0")/artifacts/daphnes-root"
vercel --prod
