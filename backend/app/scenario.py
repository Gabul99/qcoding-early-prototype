# auto_dialogue_grouping.py
# Python script to parse sample_data_string, run automatic dialogues between codes,
# and form thematic groups based on LLM responses.

import re
import json
import os
import random
from itertools import combinations
from prompts.sample_data_string import sample_data_string
from prompts.livingcodes import livingcodes_system_prompt
from dotenv import load_dotenv
from openai import OpenAI

# === Configuration ===
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4o-mini"
logs = []

codes = [
    {
        "code": "Personal insult — \"Imbecile (바보)\"",
        "raw": "Joe Biden is an Imbecile. He doesn't deserve to be President. We all know what happens if he wins. He will be found incompetent to serve. Kamala Harris will become President. Nancy Pelosi (if the dems retain the house) will be Vice President. And this country will go to hell."
    },
    {
        "code": "Competence-based denigration — \"incompetent (무능)\"",
        "raw": "We like presidents that aren't incompetent, don't lie, don't promote hate, are not corrupt and treasonous. #TrumpLiedAmericansDied #TrumpIsANationalDisgrace #BidenHarris2020  https://t.co/eBoXjohAUm"
    },
    {
        "code": "Insult with incompetence claim — \"moron\"",
        "raw": "@realDonaldTrump I BELIEVE IT'S TIME TO DRUG TEST JUNIOR YOU F**KING MORON!!!!!!!! #WAKEUPAMERICA THIS MORON IN THE W.H ISN'T EVEN QUALIFIED TO RUN AN LEMONADE STAND!!!! #TRUMPISALAUGHINGSTOCK #TRUMPFAILEDAMERICA #2OOKDEAD #BIDENHARRIS2020 #VOTEEARLY #VOTEEARLY #VOTEEARLY"
    },
    {
        "code": "Violent wish",
        "raw": "I wish death upon 45th President of the United States of America Donald J. Trump. He really deserves to die honestly. #trump2020 #covidhurryup #MAGA #CovidTrump  #COVIDMAGA"
    },
    {
        "code": "Call for elimination",
        "raw": "@donwinslow SO WE NEED TO GET RID OF THE FLOCK!!!!!!! TRUMP IS HANGING HIMSELF EVERYDAY!!!!!! HE'S NO WORRY WE JUST NEED TO ELIMINATE THE ENABLERS!!!!!! #THEGOPISTHEPROBLEM #THEGOPISTHEPROBLEM #WAKEUPAMERICA #WAKEUPAMERICA #BIDENHARRIS2020 #BIDENHARRIS2020 #GOEARLYVOTE #VOTEEARLY #VOTEEARLY"
    },
    {
        "code": "Violent metaphor — \"wipe\"",
        "raw": "@blueheartedly Kamala is gonna wipe the floor up with Pence!! #BidenHarris2020"
    },
    {
        "code": "Emotional outburst profanity",
        "raw": "Facebook approves of Nazi-ism but does not condone love.[NEWLINE][NEWLINE]Holy crap I'm angry about this![NEWLINE][NEWLINE]🤬F*ck Facebook🤬[NEWLINE][NEWLINE]#Biden2020 [NEWLINE]#ProudBoys https://t.co/S7pBKItrkD"
    },
    {
        "code": "Emotional provocation",
        "raw": "@MoNiicole Big mad! You're a Christian but hate Joe Biden and Kamala Harris....right! Lol"
    },
    {
        "code": "Emotional insult",
        "raw": "@Mike_Pence was talking soo much shit that there were literally flys over him 👽"
    },
    {
        "code": "Expose moral double‑standard",
        "raw": "@cidalia_borges @TheView @JoyVBehar @sunny The reality is you're a hypocrite if you voted for Joe, who's a racist and pedophile, and for Kamala Harris who is a COP who locked up black males for cheap labor. But go ahead and keep telling us how racist Trump is."
    },
    {
        "code": "Community-wide hypocrisy claim",
        "raw": "The #DemocraticParty has no merit to say it's hypocritical for @realDonaldTrump to want to nominate a #SCOTUS before the election considering their entire party is hypocrisy, @SpeakerPelosi being the most hypocritical one of all #WakeUpAmerica #Trump2020"
    },
    {
        "code": "Accuse hypocrisy",
        "raw": "Dog bites man and #LadyGraham is a hypocrite. #PackTheCourt #BidenHarris2020 #FDT  https://t.co/QO1sif2XaO"
    }
]

all_codes = [(code['code'], code['raw']) for code in codes]

processing = [
    {
        'name': '',
        'codes': [ {'code': code[0], 'raw': code[1]} ],
    }
    for code in all_codes
]
groups = []

def send_event(evt):
    msg = json.dumps(evt, ensure_ascii=False)
    logs.append(msg)

# === 메인 루프: processing이 4개 남을 때까지 ===
while len(processing) > 4:
    # (1) 랜덤 선택 & 즉시 제거
    a, b = random.sample(processing, 2)
    send_event({"event": "select_pair", "data": {"items": [a, b]}})
    processing = [p for p in processing if p not in (a, b)]

    # (2) LLM 호출
    messages = [{'role':'system','content': livingcodes_system_prompt}]
    comp_desc = {'components': [a, b]}
    user_prompt = f"""RQ: How do users justify or defend their use of hate speech in tweets?

## Selected components
{json.dumps(comp_desc, ensure_ascii=False)}
"""
    messages.append({'role':'user','content': user_prompt})
    resp = client.chat.completions.create(model=MODEL, messages=messages, temperature=0.7)
    content = resp.choices[0].message.content
    send_event({"event":"ai_message","data":{"content":content}})

    # (3) 결과 파싱 & 처리
    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        # 파싱 실패 시, 원래대로 복원
        processing.extend([a, b])
        continue

    mode = result['final_decision']['final_decision_mode']
    comps = result['final_decision']['final_components']

    if mode == 'MERGE':
        labels = comps[0]['codes']
        group_name = comps[0]['group_name'] or ""
        # 새 컴포넌트 생성
        new_comp = {
            'name': group_name,
            'codes': [ {'code': lbl['code'], 'raw': lbl['raw']} for lbl in labels ]
        }
        processing.append(new_comp)
        groups.append(new_comp)
        send_event({"event":"match_result","data":{"mode":"MERGE","group":new_comp}})
        print("MERGE", new_comp)

    elif mode == 'SPLIT':
        new_groups = []
        for comp_item in comps:
            grp_name = comp_item['group_name'] or ""
            labels = comp_item['codes']
            # 원본 raw 복원을 위해, a,b 중 어디서 왔는지 매핑 필요합니다. 예시에선 생략.
            new_comp = {
                'name': grp_name,
                'codes': [ {'code': lbl['code'], 'raw': lbl['raw']} for lbl in labels ]
            }
            processing.append(new_comp)
            groups.append(new_comp)
            new_groups.append(new_comp)
        send_event({"event":"match_result","data":{"mode":"SPLIT","groups":new_groups}})
        print("SPLIT")

    else:  # APART
        # 단순히 원래 두 컴포넌트를 되돌려 줍니다
        processing.extend([a, b])
        send_event({"event":"match_result","data":{"mode":"APART","items":[a,b]}})
        print("APART")

    # (4) 상태 업데이트
    send_event({"event":"group_update","data":{"processing":processing}})
    print(len(processing))

# (5) 완료
send_event({"event":"finished","data":{"processing":processing}})
with open('./log_data.json','w', encoding='utf-8') as f:
    json.dump(logs, f, ensure_ascii=False, indent=2)
