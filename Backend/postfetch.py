import praw
import time
import csv
import json

# TODO: MAKE FILENAMES DEPEND ON SUBMISSION ID


class post(object):
    """creates a link to a reddit post.
    Used to collect data"""

    def __init__(self, submissionID, csvFileDir="./data/",
                 PATH_TO_AUTH="./data/auth.json"):
        super(post, self).__init__()
        self.submissionID = submissionID
        self.csvFile = csvFileDir + self.submissionID + ".csv"
        with open(PATH_TO_AUTH, "r") as f:
            auth = json.load(f)

        # creating link to reddit
        self.R = praw.Reddit(client_id=auth["CLIENT_ID"],
                             client_secret=auth["CLIENT_SECRET"],
                             password=auth["PASSWORD"],
                             user_agent=auth["USER_AGENT"],
                             username=auth["USERNAME"])

    def fetchData(self):
        # link to submission
        self.post = self.R.submission(id=self.submissionID)
        return [time.time(), self.post.score, self.post.num_comments]

    def addData(self):
        with open(self.csvFile, "a+") as f:
            writer = csv.writer(f)
            writer.writerow(self.fetchData())

    def getJSON(self):
        with open(self.csvFile, "r") as f:
            fieldNames = ["time", "upvote", "num_comments"]
            reader = csv.DictReader(f, fieldnames=fieldNames)

            response = []
            for row in reader:
                response.append(row)
            return json.dumps(response)

    def autoAddData(self):
        while True:
            self.addData()
            with open("./data/data.json", "w") as dump:
                json.dump(self.getJSON(), dump)
            time.sleep(5)
