###############################################################################
# Name: Siebren Kazemier
# School: Uva
# Student number: 12516597
# Project: Final project
# Context: Changes json to right format for the updated pie chart.
###############################################################################

import json

with open("geslaagdenEnGezakten.json") as f:
    data = json.load(f)

    # add type of education to VMBO-T
    for lines in data:
        if lines["Onderwijstype"] == "VMBO-TL":
            lines["Afdeling"] = lines["Onderwijstype"]

    # change VMBO learn direction
    for lines in data:
        if lines["Onderwijstype"] == "VMBO-BL" or lines["Onderwijstype"] == "VMBO-KL" or lines["Onderwijstype"] == "VMBO-GL":
            lines["Afdeling"] = lines["VMBOsector"]

    # makes list of all the different items of a column
    def make_list(column):
        name_list = []
        for lines in data:
            if not lines[column] in name_list:
                name_list.append(lines[column])
        return name_list

    school_list = make_list("Instellingsnaam")
    direction_list = make_list("Afdeling")

    # contains all data
    data_dict = {}
    for school in school_list:
        passed = 0
        failed = 0
        for line in data:
            if line["Instellingsnaam"] == school:
                passed += line["Geslaagden"]
                failed += line["Gezakten"]
        pas_fail = {"Geslaagd": passed, "Gezakt": failed}
        data_dict[school] = pas_fail


with open("updatePieData.json", "w") as f:
    json.dump(data_dict, f)
