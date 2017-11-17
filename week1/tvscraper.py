#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    # NOTE: CHANGE ALL THOSE ANNOYING STRINGS TO UTF8 OR ELSE CSV WILL COMPLAIN.
    
    # create list to put data dicts in
    datalist = []
    
    # loop over movies
    for movies in dom("div.lister-item-content"):
        # clear dict for every individual series
        data = {}
        # get title
        for header in movies("h3.lister-item-header"):
            for title in header("a"):
                data['title'] = title.content

        # get runtime and genre
        for subtext in movies("p.text-muted"):
            for runtime in subtext("span.runtime"):
                # end up with only a number for runtime
                time = runtime.content.strip('min')
                data['runtime'] = time

            for genre in subtext("span.genre"):
                # strip to remove extra spaces at the end
                genres = genre.content.strip()
                data['genre'] = genres

        # get rating
        for rating_bar in movies("div.inline-block.ratings-imdb-rating"):
            for rating in rating_bar("strong"):
                data['rating'] = rating.content

        # get actor(s)/actress(es)
        cast = []
        for actors in movies("p"):
            for actor in actors("a"):
                cast.append(actor.content)
            actorlist = ', '.join(cast)
            data['actors'] = actorlist

        # put all data in the list
        datalist.append(data)
    
    return datalist


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    
    # Write TV-series to disk
    for series in tvseries:
        writer.writerow([series["title"].encode("utf-8"), series["rating"], series["genre"], series["actors"].encode("utf-8"), series["runtime"]])

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)