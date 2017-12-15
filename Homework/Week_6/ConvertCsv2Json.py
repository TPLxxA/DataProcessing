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
with open('Purchasing_power_Europe2015.csv', 'r') as csvfile:
	rawdata = csv.reader(csvfile)
	for row in rawdata:
		if not row[0].startswith('#'):
			tmp = {'country': str(row[0]), 'ppi2015': float(row[1])}
			data.append(tmp)

# write data to json file
with open('ppi2015.json', 'w') as jsonfile:
	json.dump(data, jsonfile)