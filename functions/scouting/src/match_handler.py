import os
import boto3
import csv

ENV = os.environ.get('ENVIRONMENT', 'dev')
BUCKET_RAW_NAME = f"mms-{ENV}-scouting-raw"
BUCKET_OUTPUT_NAME = f"mms-{ENV}-scouting-output"
TABLE_NAME = f"mms-{ENV}-scouting"

def s3_iter(object_name: str):
  s3 = boto3.client('s3')
  print(object_name)
  object_response = s3.get_object(Bucket=BUCKET_RAW_NAME, Key=object_name)
  line_iter = object_response["Body"].iter_lines()
  for line in line_iter:
    yield bytes.decode(line)

def isAuto(time: str):
  return float(time) < 15

def endgameStrToNum(level: str):
  if level == 'none':
    return 0
  if level == 'level 1':
    return 1
  if level == 'level 2':
    return 2
  if level == 'level 3':
    return 3

def ratingStrToNum(rating: str):
  if rating == 'slow':
    return 1
  if rating == 'semi-slow':
    return 2
  if rating == 'average':
    return 3
  if rating == 'semi-fast':
    return 4
  if rating == 'fast':
    return 5

def load_match_data(object_name: str) -> dict:
  reader = csv.DictReader(s3_iter(object_name), delimiter=',', quotechar='"')

  event_name = object_name.split(".")[0].lower()
  prevKey = ""
  items = []
  item = {}
  for line in reader:
    key = f"{line["teamNum"]}-{line["matchNum"]}"
    if prevKey != key:
      item = {
      "event": event_name,
      "team-match": key,
      "alliancePosition": f"{line['alliance'][0]}{line['alliancePos']}",
      "startLocation": "",
      "autoClimb": 0, 
      "endgame": 0, # Tower level 0-3
      "defenseRating": 0,
      "notes": "",
      "totalAutoFuelShootingDuration": 0,
      "averageAutoFuelShootingSpeed": 0,
      "averageAutoFuelShootingAccuracy": 0,
      "totalTeleopFuelShootingDuration": 0,
      "averageTeleopFuelShootingSpeed": 0,
      "averageTeleopFuelShootingAccuracy": 0,
      "totalTeleopFuelPassingDuration": 0,
      "averageTeleopFuelPassingSpeed": 0,
      "averageTeleopFuelPassingAccuracy": 0,
      "totalAutoCycles": 0,
      "totalPassCycles": 0,
      "totalTeleopCycles": 0,
      "totalAutoRating": 0,
      "totalAutoAccuracy": 0,
      "totalTeleopRating": 0,
      "totalTeleopAccuracy": 0,
      "totalPassRating": 0,
      "totalPassAccuracy": 0 
      }
      prevKey = key
      items.append(item)
    match line["type"]:
      case "start":
        item["startLocation"] = line["location"]
      case "auto":
        item["autoClimb"] = 1 if line["autoClimb"] == "TRUE" else 0
      case "endgame":
        item["endgame"] = endgameStrToNum(line["towerLevel"])
        item["defenseRating"] = line["defenseRating"]
        item["notes"] = f"\"{line["notes"]}\""
      case "pass":
        item["totalTeleopFuelPassingDuration"] += float(line["duration"])
        item["totalPassCycles"] += 1

        item["totalPassRating"] += ratingStrToNum(line["rating"])
        item["totalPassAccuracy"] += float(line["accuracy"])
        item["averageTeleopFuelPassingSpeed"] = item["totalPassRating"] / item["totalPassCycles"]
        item["averageTeleopFuelPassingAccuracy"] = item["totalPassAccuracy"] / item["totalPassCycles"]
      case "score":
        if isAuto(line["timestamp"]):
          item["totalAutoFuelShootingDuration"] += float(line["duration"])
          item["totalAutoCycles"] += 1

          item["totalAutoRating"] += ratingStrToNum(line["rating"])
          item["totalAutoAccuracy"] += float(line["accuracy"])
          item["averageAutoFuelShootingSpeed"] = item["totalAutoRating"] / item["totalAutoCycles"]
          item["averageAutoFuelShootingAccuracy"] = item["totalAutoAccuracy"] / item["totalAutoCycles"]

        else:
          item["totalTeleopFuelShootingDuration"] += float(line["duration"])
          item["totalTeleopCycles"] += 1

          item["totalTeleopRating"] += ratingStrToNum(line["rating"])
          item["totalTeleopAccuracy"] += float(line["accuracy"])
          item["averageTeleopFuelShootingSpeed"] = item["totalTeleopRating"] / item["totalTeleopCycles"]
          item["averageTeleopFuelShootingAccuracy"] = item["totalAutoAccuracy"] / item["totalTeleopCycles"]


  output = []
  keys = items[0].keys()
  output.append(",".join(keys))
  for item in items:
    output.append(",".join(str(item[key]) for key in keys))
  csv_data = "\n".join(output)

  s3 = boto3.client('s3')
  s3.put_object(Bucket=BUCKET_OUTPUT_NAME, Key=f"{event_name}.csv", Body=csv_data)