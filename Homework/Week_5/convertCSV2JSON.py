# Casper van Velzen
# Minor programmeren / Data_processing
# 11030275
# converts csv files to json format
#

import csv
import json

# remember lists for later
data = []

# open data file put dict with data in list
with open('Temp_de_Bilt_2006.csv', 'r') as csvfile:
	rawdata = csv.reader(csvfile)
	for row in rawdata:
		if not row[0].startswith('#'):
			tmp = {'date': str(row[1]), 'avg_temp': int(row[2]), 'min_temp': int(row[3]), 'max_temp': int(row[4])}
			data.append(tmp)

# make date compatible with JavaScript
for row in data:
	year =  row['date'][0:4]
	month = row['date'][4:6]
	day = row['date'][6:8]
	row['date'] = month + '/' + day + '/' + year


# write data to json file
with open('temp_2006.json', 'w') as jsonfile:
	json.dump(data, jsonfile)