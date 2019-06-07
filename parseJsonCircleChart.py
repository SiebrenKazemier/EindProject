import json

with open("geslaagdenEnGezakten.json") as f:
    data = json.load(f)

    # calculate total amount of candidates
    candidates = 0
    for lines in data:
        candidates += lines["Examenkandidaten"]

    circle_data = {}
    circle_data = {"name": "Nederland", "value": candidates, "children": []}

    # add type of education to VMBO
    for lines in data:
        if lines["Onderwijstype"] == "VMBO":
            lines["Onderwijstype"] = lines["Onderwijstype"] + "-" + lines["LeerwegVMBO"]

    # makes list of all the different items of a column
    def makeList(column):
        name_list = []
        for lines in data:
            if not lines[column] in name_list:
                name_list.append(lines[column])
        return name_list

    # make first child (province)
    def add_children(province):
        counter = 0
        dict = {}
        for lines in data:
            if lines["Provincie"] == province:
                counter += lines["Examenkandidaten"]
        dict = {"name": province, "value": counter, "children": ""}
        return dict

    # make second child (education type)

    def add_children2(schooltype, province):
        counter = 0
        dict = {}
        for lines in data:
            if lines["Onderwijstype"] == schooltype and lines["Provincie"] == province:
                counter += lines["Examenkandidaten"]

        dict = {"name": schooltype, "value": counter, "children": ""}
        return dict

    # make name lists
    province_list = makeList("Provincie")
    schooltype_list = makeList("Onderwijstype")
    # school_list = makeList("Instellingsnaam")

    # append all childs
    child_list = []
    for province in province_list:
        child = add_children(province)
        second_child_list = []
        for schooltype in schooltype_list:
            second_child_list.append(add_children2(schooltype, province))
        child["children"] = second_child_list
        child_list.append(child)
    circle_data["children"] = child_list

    # # third level childs
    # list = []
    # for name in school_list:
    #     for levels in schooltype_list:
    #         thirdCounter = 0
    #         for line in data:
    #             if line["Instellingsnaam"] == name and line["Onderwijstype"] == levels:
    #                 thirdCounter += line["Examenkandidaten"]
    #                 provinces = line["Provincie"]
    #         if thirdCounter > 0:
    #             last_child = {"name": name, "value": thirdCounter, "level": levels}
    #             list.append(last_child)
    #
    # # add third level childs
    # for item in circle_data["children"]:
    #     for level in item["children"]:
    #         lastList = []
    #         for line in list:
    #             if line["level"] == level["name"]:
    #                 lastDict = {}
    #                 lastDict["name"] = line["name"]
    #                 lastDict["value"] = line["value"]
    #                 # print(lastDict)
    #                 lastList.append(lastDict)
    #         level["children"] = lastList

with open("circleData.json", "w") as f:
    json.dump(circle_data, f)
