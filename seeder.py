#generating for firebase
import json

conditions = ["1", "2", "3"]
players = ["A", "B", "C"]
keys = ["test1", "test2"]
ob = {}

for condition in conditions:
	ob[condition] = {}
	for key in keys:
		ob[condition][key] = {}
		ob[condition][key]["player_status"] = {}
		ob[condition][key]["games"] = {}
		

		for i in range(int(condition)):
			ob[condition][key]["player_status"][players[i]] = False

		for n in range(3):
			ob[condition][key]["games"]["game_" + str(n)] = {}
			for turn in range(10):
				ob[condition][key]["games"]["game_" + str(n)]["turn_" + str(turn)] = {}
				ob[condition][key]["games"]["game_" + str(n)]["turn_" + str(turn)]["moves"] = {}
				ob[condition][key]["games"]["game_" + str(n)]["turn_" + str(turn)]["outcome"] = False

				for i in range(int(condition)):
					ob[condition][key]["games"]["game_" + str(n)]["turn_" + str(turn)]["moves"][players[i]] = False


with open("seed.json", "w+") as outfile:
    json.dump(ob, outfile)