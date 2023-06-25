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

    # Specify a list of files not to be copied
    files_to_exclude = ['READE.md', '.gitignore', 'doc/note.md', 'doc/Snipaste_2023-06-19_00-52-18.png']

    for file_name in os.listdir(current_directory):
        if file_name not in files_to_exclude:
            source_path = os.path.join(current_directory, file_name)
            destination_path = os.path.join(parent_directory, file_name)

            # File copying using the shutil library
            shutil.copy2(source_path, destination_path)

            print(f"Copying file {file_name} to {parent_directory} succeeded!")


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