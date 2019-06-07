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
    data_dict = {}

    passed = 0
    failed = 0
    # appand total average
    for line in data:
        passed += line["Geslaagden"]
        failed += line["Gezakten"]
    pas_fail = {"passed": passed, "failed": failed}
    # append total to dataDict
    data_dict["values"] = pas_fail

    # append all provinces
    for province in province_list:
        province_dict = {}
        for schooltype in schooltype_list:
            direction_dict = {}
            schooldirection_dict = {}
            for direction in direction_list:
                province_passed = 0
                province_failed = 0

                direction_passed = 0
                direction_failed = 0

                schooltype_passed = 0
                schooltype_failed = 0
                for line in data:
                    if province == line["Provincie"]:
                        province_passed += line["Geslaagden"]
                        province_failed += line["Gezakten"]

                        if direction == line["Afdeling"]:
                            direction_passed += line["Geslaagden"]
                            direction_failed += line["Gezakten"]

                            if schooltype == line["Onderwijstype"]:
                                schooltype_passed += line["Geslaagden"]
                                schooltype_failed += line["Gezakten"]

                if direction_passed > 0 and direction_failed > 0:
                    direction_pass_fail = {"passed": direction_passed, "failed": direction_failed}
                    direction_dict[direction] = direction_pass_fail

                if schooltype_passed > 0 and schooltype_failed > 0:
                    type_pass_fail = {"passed": schooltype_passed, "failed": schooltype_failed}
                    schooldirection_dict[direction] = type_pass_fail

            province_dict["test"] = direction_dict
            province_dict[schooltype] = schooldirection_dict
            province_dict["values"] = {"passed": province_passed, "failed": province_failed}
        # add provinces
        data_dict[province] = province_dict

with open("pieChart.json", "w") as f:
    json.dump(data_dict, f)
