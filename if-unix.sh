#!/bin/sh

# using backticks for sh compat
# escaped ls is because folks often alias ls to something better than default
for p in `\ls -1 \`npm root -g\``
do
  echo installing $p
  npm i -g $p
done
