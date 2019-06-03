###############################################################################
# Name: Siebren Kazemier
# Student number: 12516597
# School: Uva
# Project: Assignment week 4, Converting CSV file to JSON
###############################################################################

import pandas as pd


def main(input_file, output_file):

    csv_file = read_csv(input_file)
    json_file = write_json(csv_file, output_file)


def read_csv(input_file):
    csv_file = pd.read_csv(input_file, sep=",")
    csv_file = parseData(csv_file)
    return csv_file


def parseData(csv_file):
    # rename columns
    csv_file.rename(columns={"Country Name": "Country",
                             "Country Code": "Code"}, inplace=True)

    # selects the needed columns
    csv_file = csv_file[["Country", "Code", "2008", "2009", "2010",
                         "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]]

    # cleaning database
    csv_file = csv_file.dropna(0)
    print(csv_file.to_string())

    return csv_file


def write_json(csv_file, output_file):
    json_file = csv_file.to_json(path_or_buf=output_file, orient="split")
    return json_file


if __name__ == "__main__":
    main("LaborForceParticipationRateFemale.csv", "LaborForceParticipationRateFemale.json")
