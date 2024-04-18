import requests
import sys
import json
import os
import shutil


def post_wx():
    try:
        get_token_url = f"https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={CORPID}&corpsecret={CORPSECRET}"
        response = requests.get(get_token_url).content
        access_token = json.loads(response).get('access_token')

        if access_token and len(access_token) > 0:
            send_msg_url = f'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={access_token}'
            data = {
                "touser": '@all',
                "agentid": AGENTID,
                "msgtype": "textcard",
                "textcard": {
                    "title": repository.split('/')[1] + " updated! 🚀",
                    "description": "🎉 Github Workflow Notification. 🍏 This job's status is " + status,
                    "url": "https://github.com/" + repository,
                    "btntxt": "More"
                },
                "enable_id_trans": 0,
                "enable_duplicate_check": 0,
                "duplicate_check_interval": 1800
            }
            requests.post(send_msg_url, data=json.dumps(data))
        else:
            print('error: Failed to post wechat notification. access_token is invalid. status: 500')
    except Exception as e:
        print('error: Failed to post wechat notification.' + str(e) + ' status: 500')


def copy_files_to_parent_directory():
    current_directory = os.getcwd()
    parent_directory = os.path.dirname(current_directory)

    # Specify a list of folders not to be copied
    directories_to_exclude = ['doc', '.github', '.git', '.idea']
    items_to_exclude = ['.gitignore', 'requirements.txt', 'wechat.py', 'README.md']

    for item in os.listdir(current_directory):
        item_path = os.path.join(current_directory, item)
        destination_path = os.path.join(parent_directory, item)

        if item not in directories_to_exclude and item not in items_to_exclude:
            if os.path.isfile(item_path):
                # copy files
                shutil.copy2(item_path, destination_path)
                print(f"Copying file {item} to {parent_directory} succeeded!")
            elif os.path.isdir(item_path):
                # Copy a folder and its contents
                shutil.copytree(item_path, destination_path)
                print(f"Copy folder {item} to {parent_directory} SUCCESSFUL!")


if __name__ == '__main__':
    try:
        repository = sys.argv[1]
        status = sys.argv[2]
        AGENTID = sys.argv[3]  # application id
        CORPID = sys.argv[4]  # enterprise id
        CORPSECRET = sys.argv[5]  # application secret

        copy_files_to_parent_directory()
        post_wx()
    except IndexError:
        print('Please specify five params: repository, job_status, AGENTID, CORPID, CORPSECRET')