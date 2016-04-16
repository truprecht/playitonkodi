#!/usr/bin/python

import json
import sys
import argparse
import requests

parser = argparse.ArgumentParser()
parser.add_argument("-u","--url",help="Video url")
parser.add_argument("--host",default="raspberry",help="Host default is raspberry")
parser.add_argument("-p","--port",default="8181",help="Port default is 8181")

args = parser.parse_args()
data = 	{	"version"	: "1.1",
			"method"	: "playHostedVideo",
			"id"    	: '1',
			"params"	: {"videoLink" : args.url}
}
jsonData = json.dumps(data)
hostNport ="http://"+args.host+":"+args.port+"/PlayIt"
print "Sending: "+ args.url+"to\n"+hostNport
r = requests.post(hostNport, data= jsonData)
print r.content
