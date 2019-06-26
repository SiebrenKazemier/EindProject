###############################################################################
# Name: Siebren Kazemier
# School: Uva
# Student number: 12516597
# Project: Final project
# Context: Changes json to right format for the updated grouped bar chart.
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
    dataDict = {}

    # appand total average
    directDict = {}
    for direction in direction_list:
        directCount = 0
        directGrade1 = 0
        directGrade2 = 0
        directGrade3 = 0
        for line in data:
            if direction == line["Afdeling"]:
                directCount += 1
                directGrade1 += float(line["GemiddeldeCijferSchoolExamen"])
                directGrade2 += float(line["GemiddeldeCijferCentraalExamen"])
                directGrade3 += float(line["GemiddeldeCijferCijferlijst"])
                average = (directGrade1 + directGrade2 + directGrade3)/3
        if directCount > 0:
            directGrade1 = round((directGrade1 / directCount), 1)
            directGrade2 = round((directGrade2 / directCount), 1)
            directGrade3 = round((directGrade3 / directCount), 1)
            average = round((average / directCount), 1)
            directDict[direction] = [directGrade1, directGrade2, directGrade3, average]
        dataDict["values"] = directDict

    for school in school_list:
        directDict = {}
        for direction in direction_list:
            directCount = 0
            directGrade1 = 0
            directGrade2 = 0
            directGrade3 = 0
            for line in data:
                if line["Instellingsnaam"] == school and line["Afdeling"] == direction:
                    directCount += 1
                    directGrade1 += float(line["GemiddeldeCijferSchoolExamen"])
                    directGrade2 += float(line["GemiddeldeCijferCentraalExamen"])
                    directGrade3 += float(line["GemiddeldeCijferCijferlijst"])
                    average = dataDict["values"][direction][3]
            if directCount > 0:
                directGrade1 = round((directGrade1 / directCount), 1)
                directGrade2 = round((directGrade2 / directCount), 1)
                directGrade3 = round((directGrade3 / directCount), 1)
                directDict[direction] = [directGrade1, directGrade2, directGrade3, average]
        dataDict[school] = directDict

with open("groupedBarChart2.json", "w") as f:
    json.dump(dataDict, f)
