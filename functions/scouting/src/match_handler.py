import os
import boto3
import csv

ENV = os.environ.get('ENVIRONMENT', 'dev')
BUCKET_RAW_NAME = f"mms-{ENV}-scouting-raw"
BUCKET_OUTPUT_NAME = f"mms-{ENV}-scouting-output"
TABLE_NAME = f"mms-{ENV}-scouting"


def repair_csv_lines(lines):
    lines = iter(lines)
    fixed_rows = []

    header = next(lines).rstrip()
    fixed_rows.append(header)

    expected_columns = header.count(',') + 1

    while True:
        try:
            current = str(next(lines)).rstrip()

            while current.count(',') < expected_columns - 1:
                current += str(next(lines)).rstrip()

            fixed_rows.append(current)
        except StopIteration:
            break

    return fixed_rows


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
    if rating == 'none':
        return 0
    if rating == 'bad':
        return 1
    if rating == 'average':
        return 2
    if rating == 'good':
        return 3
    if rating == 'very good':
        return 4


def load_match_data(object_name: str) -> dict:
    lines = list(s3_iter(object_name))
    fixed_lines = repair_csv_lines(lines)
    reader = csv.DictReader(fixed_lines, delimiter=',', quotechar='"')

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
                'scouter': line['scouter'],
                "alliancePosition": f"{line['alliance'][0]}{line['alliancePos']}",
                "startLocation": "",
                "autoClimb": 0,
                "endgame": 0,  # Tower level 0-3
                "fireRating": 0,
                "accuracy": 0,
                "defenseRating": 0,
                "notes": "",
                "totalAutoFuelShootingDuration": 0,
                "totalTeleopFuelShootingDuration": 0,
                "totalTeleopFuelPassingDuration": 0,
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
                item["fireRating"] = ratingStrToNum(line["fireRating"])
                item["accuracy"] = ratingStrToNum(line["accuracy"])
            case "pass":
                item["totalTeleopFuelPassingDuration"] += float(line["duration"])

            case "score":
                if isAuto(line["timestamp"]):
                    item["totalAutoFuelShootingDuration"] += float(line["duration"])

                else:
                    item["totalTeleopFuelShootingDuration"] += float(line["duration"])

    output = []
    keys = items[0].keys()
    output.append(",".join(keys))
    for item in items:
        output.append(",".join(str(item[key]) for key in keys))
    csv_data = "\n".join(output)

    s3 = boto3.client('s3')
    s3.put_object(Bucket=BUCKET_OUTPUT_NAME, Key=f"{event_name}.csv", Body=csv_data)
