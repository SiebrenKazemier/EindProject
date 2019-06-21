import json

with open("geslaagdenEnGezakten.json") as f:
    data = json.load(f)

    # add type of education to VMBO
    for lines in data:
        if lines["Onderwijstype"] == "VMBO":
            lines["Onderwijstype"] = lines["Onderwijstype"] + "-" + lines["LeerwegVMBO"]

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

    province_list = make_list("Provincie")
    schooltype_list = make_list("Onderwijstype")
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

    # append all provinces
    for province in province_list:
        provinceDict = {}
        for schooltype in schooltype_list:
            directionDict = {}
            schooldirectionDict = {}
            for direction in direction_list:
                ####################### FIRST DATA ROW ######################
                directionCount = 0
                cijferSchoolExamen = 0
                cijferCentraalExamen = 0
                cijferCijferlijst = 0

                ####################### SECOND DATA ROW ######################
                schooltypeCount = 0
                schoolcijferSchoolExamen = 0
                schoolcijferCentraalExamen = 0
                schoolcijferCijferlijst = 0

                # loop through data
                for line in data:

                    ####################### FIRST DATA ROW ######################

                    if province == line["Provincie"]:
                        if direction == line["Afdeling"]:
                            directionCount += 1
                            cijferSchoolExamen += float(line["GemiddeldeCijferSchoolExamen"])
                            cijferCentraalExamen += float(line["GemiddeldeCijferCentraalExamen"])
                            cijferCijferlijst += float(line["GemiddeldeCijferCijferlijst"])
                            first_average = dataDict["values"][direction][3]

                            ####################### SECOND DATA ROW ######################
                            if schooltype == line["Onderwijstype"]:
                                schooltypeCount += 1
                                schoolcijferSchoolExamen += float(
                                    line["GemiddeldeCijferSchoolExamen"])
                                schoolcijferCentraalExamen += float(
                                    line["GemiddeldeCijferCentraalExamen"])
                                schoolcijferCijferlijst += float(
                                    line["GemiddeldeCijferCijferlijst"])
                                average = dataDict["values"][direction][3]

                ####################### FIRST DATA ROW ######################
                if directionCount > 0:
                    # add directions
                    cijferSchoolExamen = round((cijferSchoolExamen / directionCount), 1)
                    cijferCentraalExamen = round((cijferCentraalExamen / directionCount), 1)
                    cijferCijferlijst = round((cijferCijferlijst / directionCount), 1)
                    directionList = [cijferSchoolExamen, cijferCentraalExamen,
                                     cijferCijferlijst, first_average]
                    directionDict[direction] = directionList

                    ####################### SECOND DATA ROW ######################
                if schooltypeCount > 0:
                    # add directions

                    schoolcijferSchoolExamen = round(
                        (schoolcijferSchoolExamen / schooltypeCount), 1)
                    schoolcijferCentraalExamen = round(
                        (schoolcijferCentraalExamen / schooltypeCount), 1)
                    schoolcijferCijferlijst = round((schoolcijferCijferlijst / schooltypeCount), 1)
                    schooldirectionList = [schoolcijferSchoolExamen,
                                           schoolcijferCentraalExamen, schoolcijferCijferlijst, average]
                    schooldirectionDict[direction] = schooldirectionList

            provinceDict["values"] = directionDict
            provinceDict[schooltype] = schooldirectionDict

        # add provinces
        dataDict[province] = provinceDict

with open("groupedBarChart.json", "w") as f:
    json.dump(dataDict, f)
