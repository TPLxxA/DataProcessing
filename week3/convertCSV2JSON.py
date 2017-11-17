# Casper van Velzen
# Minor programmeren / Data_processing
# 11030275
# converts csv files to json format
#

import csv
import json

# remember lists for later
data = []
avg_data = []
apr_days = 30

# open data file put dict with data in list
with open('KNMI_20170431.csv', 'r') as csvfile:
	rawdata = csv.reader(csvfile)
	for row in rawdata:
		if not row[0].startswith('#'):
			temp = {'station': int(row[0]), 'precipitation': int(row[2])}
			data.append(temp)

# calculate average downpour
station = -1
for i in range(len(data)):
	# if new station, make new entry in avg_data
	if data[i]['station'] != data[i-1]['station']:
		temp = {'station': data[i]['station'], 'precipitation': data[i]['precipitation']}
		avg_data.append(temp)
		station += 1
	# increase total downpour
	else:
		avg_data[station]['precipitation'] += data[i]['precipitation']

# calculate average downpour in april
for i in range(len(avg_data)):
	avg_data[i]['precipitation'] = avg_data[i]['precipitation'] / apr_days

# write data to json file
with open('json_data.json', 'w') as jsonfile:
	json.dump(avg_data, jsonfile)