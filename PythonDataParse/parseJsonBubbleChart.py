###############################################################################
# Name: Siebren Kazemier
# School: Uva
# Student number: 12516597
# Project: Final project
# Context: Changes json to right format for bubble chart.
###############################################################################

import json

with open("geslaagdenEnGezakten.json") as f:
    data = json.load(f)

    # add type of education to VMBO
    for lines in data:
        if lines["Onderwijstype"] == "VMBO":
            lines["Onderwijstype"] = lines["Onderwijstype"] + "-" + lines["LeerwegVMBO"]

    # make list with schoolnames
    nameList = []
    for lines in data:
        if not lines["Instellingsnaam"] in nameList:
            nameList.append(lines["Instellingsnaam"])

    # append candidates to schools
    list = []
    for name in nameList:
        counter = 0
        for line in data:
            if line["Instellingsnaam"] == name:
                counter += line["Examenkandidaten"]
                province = line["Provincie"]
        dictcandidates = {}
        dictcandidates["name"] = name
        dictcandidates["value"] = counter
        dictcandidates["province"] = province
        list.append(dictcandidates)

with open("bubbleData.json", "w") as f:
    json.dump(list, f)
