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

    # selects the needed columns
    csv_file = csv_file[["Provincie", "Gemeente", "Onderwijstype", "LeerwegVMBO", "VMBOsector", "Instellingsnaam",
                         "Afdeling", "Examenkandidaten", "Geslaagden", "Gezakten", "GemiddeldeCijferSchoolExamen", "GemiddeldeCijferCentraalExamen", "GemiddeldeCijferCijferlijst"]]

    return csv_file


def write_json(csv_file, output_file):
    json_file = csv_file.to_json(path_or_buf=output_file, orient="records")
    return json_file


if __name__ == "__main__":
    main("geslaagdenEnGezakten.csv", "geslaagdenEnGezakten.json")
