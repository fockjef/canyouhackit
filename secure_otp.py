#!/usr/bin/python3

import os
import random
import urllib.parse

params = urllib.parse.parse_qs(os.environ['QUERY_STRING'])
callback = params['callback'][0]
seed = int(params['seed'][0])
random.seed(seed)
otp = ''
for i in range(6):
    otp += str(random.randint(0, 9))
print('Content-type: application/javascript\n\n' + callback + "('" + otp + "')")
