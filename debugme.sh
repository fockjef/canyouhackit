echo "b208c5eeabf4e74932cd47570a1c8361 debugme" | md5sum -c &> /dev/null

if [ $? -eq 0 ]; then
	# restore UPX magic bytes
	perl -i -pe 's/   !/UPX!/g' debugme

	# unpack executable
	upx -dqqq debugme

	# poor mans patch
	printf '\x85' | dd of=debugme bs=1 seek=14020 count=1 conv=notrunc &> /dev/null
	printf '\x85' | dd of=debugme bs=1 seek=14521 count=1 conv=notrunc &> /dev/null
	chmod +x debugme
fi

# get the flag
echo 1 | ./debugme | grep 'flag{'
