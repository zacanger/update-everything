@echo off
for /F %%p in ('npm root -g') do ls -1 %%p
:: Not really sure where this is going.
:: Need to capture the above as input to `npm i -g`
