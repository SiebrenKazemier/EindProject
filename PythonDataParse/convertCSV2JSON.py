###############################################################################
# Name: Siebren Kazemier
# School: Uva
# Student number: 12516597
# Project: Final project
# Context: This program changes the csv file to a json file
###############################################################################

import pandas as pd
import json


def main(input_file, output_file):

    csv_file = read_csv(input_file)
    json_file = write_json(csv_file, output_file)


def read_csv(input_file):
    csv_file = pd.read_csv(input_file, sep=";")
    csv_file = parseData(csv_file)
    return csv_file


def parseData(csv_file):
    # rename columns
    csv_file.rename(columns={"INSTELLINGSNAAM VESTIGING": "Instellingsnaam",
                             "GEMEENTENAAM VESTIGING": "Gemeente",
                             "PROVINCIE VESTIGING": "Provincie",
                             "ONDERWIJSTYPE VO": "Onderwijstype",
                             "LEERWEG VMBO": "LeerwegVMBO",
                             "VMBO SECTOR": "VMBOsector",
                             "AFDELING": "Afdeling",
                             "EXAMENKANDIDATEN": "Examenkandidaten",
                             "GESLAAGDEN": "Geslaagden",
                             "GEZAKTEN": "Gezakten",
                             "GEMIDDELD CIJFER SCHOOLEXAMEN": "GemiddeldeCijferSchoolExamen",
                             "GEMIDDELD CIJFER CENTRAAL EXAMEN": "GemiddeldeCijferCentraalExamen",
                             "GEMIDDELD CIJFER CIJFERLIJST": "GemiddeldeCijferCijferlijst"}, inplace=True)

    csv_file.GemiddeldeCijferSchoolExamen = csv_file.GemiddeldeCijferSchoolExamen.str.replace(
        ",", ".")
    csv_file.GemiddeldeCijferCentraalExamen = csv_file.GemiddeldeCijferCentraalExamen.str.replace(
        ",", ".")
    csv_file.GemiddeldeCijferCijferlijst = csv_file.GemiddeldeCijferCijferlijst.str.replace(
        ",", ".")

    # selects the needed columns
    csv_file = csv_file[["Provincie", "Gemeente", "Onderwijstype", "LeerwegVMBO", "VMBOsector", "Instellingsnaam",
                         "Afdeling", "Examenkandidaten", "Geslaagden", "Gezakten", "GemiddeldeCijferSchoolExamen", "GemiddeldeCijferCentraalExamen", "GemiddeldeCijferCijferlijst"]]

    return csv_file

# writes to json


def write_json(csv_file, output_file):

    json_file = csv_file.to_json(path_or_buf=output_file, orient="records")
    return json_file


if __name__ == "__main__":
    main("geslaagdenEnGezakten.csv", "geslaagdenEnGezakten.json")
