#!/bin/bash

if ! [ -f "debugme_fixed" ]
then
    md5=$(md5sum debugme | cut -d" " -f1)

    perl -pe 's/   !/UPX!/g' debugme > debugme_fixed
    upx -dqqq debugme_fixed

    if [ "$md5" = "b5fbec8de704f75788b6c16763bb865b" ]
    then
        printf '\x85' | dd of=debugme_fixed bs=1 seek=19353 count=1 conv=notrunc &> /dev/null
        printf '\x85' | dd of=debugme_fixed bs=1 seek=21153 count=1 conv=notrunc &> /dev/null
    fi
    if [ "$md5" = "b208c5eeabf4e74932cd47570a1c8361" ]
    then
        printf '\x85' | dd of=debugme_fixed bs=1 seek=14020 count=1 conv=notrunc &> /dev/null
        printf '\x85' | dd of=debugme_fixed bs=1 seek=14521 count=1 conv=notrunc &> /dev/null
    fi
fi

echo 1 | ./debugme_fixed | grep 'flag{'
