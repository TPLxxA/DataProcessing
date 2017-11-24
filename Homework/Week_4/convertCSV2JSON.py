# Casper van Velzen
# Minor programmeren / Data_processing
# 11030275
# converts csv files to json format
#

import csv
import json

# remember lists for later
data = []
data2 = []
final_data = []

# open data file put dict with data in list
with open('Linguistic diversity index.csv', 'r') as csvfile:
	rawdata = csv.reader(csvfile)
	for row in rawdata:
		if not row[0].startswith('#'):
			temp = {'country': row[0], 'ldi': row[1]}
			data.append(temp)

with open('literacy.csv', 'r') as csvfile2:
	rawdata = csv.reader(csvfile2)
	for row in rawdata:
		if not row[0].startswith('#'):
			for el in data:
				if el['country'] == row[0]:
					el['literacy'] = row[1]
					data2.append(el)


with open('Average years of schooling of adults.csv', 'r') as csvfile2:
	rawdata = csv.reader(csvfile2)
	for row in rawdata:
		if not row[0].startswith('#'):
			for el in data:
				if el['country'] == row[0]:
					el['schooling'] = row[1]
					final_data.append(el)


# make the data more useful to work with
for el in final_data:
	el['literacy'] = el['literacy'].replace('%','')

# write data to json file
with open('json_data.json', 'w') as jsonfile:
	json.dump(final_data, jsonfile)