line = "hello\nworld kese\n\n\n\n\n\n\n\n"
print(line)
lins = line.rstrip("\n")
print(lins)
print(type(lins))

data  = {
    "Labels": ['ok', "jello", "bye"],
    "exp": [["error", "ERROR", "Warning"], ["warning", "WARNING"], ["info", "INFO", "Error"]],
    "status": ["pass", "fail", "pass"],
    "description": ["", "", ""],
    "Waived": ['','',""]
}

def check_waived(label):
    if label in data["Labels"]:
        idx = data["Labels"][label]
        print(idx)
    #     if data["Waived"][idx] == "WAIVED":
    #         print("ok")
    #     else:
    #         print("not ok")
    # else:
    #     print("Label not found")


check_waived("bye")
check_waived("jello")
check_waived("ok")