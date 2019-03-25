from postfetch import post
import argparse

# create parser
parser = argparse.ArgumentParser(
    description='Give postID to redditFetch backend.')

parser.add_argument("-p", '--postID', action="store",
                    type=str, dest="id", default="b4hvqd",
                    help="reddit post id.")

args = parser.parse_args()


# create link
link = post(args.id)

# start/continue collecting data
link.autoAddData()
