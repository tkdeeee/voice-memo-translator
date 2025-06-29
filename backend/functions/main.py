# functions/main.py
import json
from datetime import datetime
from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore
import firebase_admin

# Firebase Admin初期化
if not firebase_admin._apps:
    initialize_app()

# 共通のCORS設定
def get_cors_headers():
    """共通のCORSヘッダーを返す"""
    return {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

def handle_preflight():
    """OPTIONS (preflight) リクエストの処理"""
    return https_fn.Response(
        '',
        status=204,
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
    )

# OPTIONS専用エンドポイント（お好みで）
@https_fn.on_request()
def cors_preflight(req: https_fn.Request) -> https_fn.Response:
    """CORS preflight専用エンドポイント"""
    return handle_preflight()

@https_fn.on_request()
def create_dmdoc(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'OPTIONS':
        return handle_preflight()
    
    cors_headers = get_cors_headers()
    
    if req.method != 'POST':
        return https_fn.Response(
            json.dumps({'error': 'Method Not Allowed'}),
            status=405,
            headers=cors_headers
        )
        
    try:
        request_data = req.get_json(silent=True)
        
        if not request_data:
            return https_fn.Response(
                json.dumps({'error': "Invalid JSON"}),
                status=405,
                headers=cors_headers
            )
        
        required_fields = ['uid', 'frienduid']
        for field in required_fields:
            if field not in request_data or not request_data[field]:
                return https_fn.Response(
                    json.dumps({'error': f'Missing required field: {field}'}),
                    status=400,
                    headers=cors_headers
                )

        uid = request_data['uid']
        friend_uid = request_data['frienduid']
        
        # バリデーション
        if uid == friend_uid:
            return https_fn.Response(
                json.dumps({'error': 'Cannot dm with yourself'}),
                status=400,
                headers=cors_headers
            )
        
        print(f"Creating DM document for {uid} and {friend_uid}")
        
        dm_config = {
            'member': [uid, friend_uid],
            'memberdict': {
                uid: friend_uid,
                friend_uid: uid
            },
            'talkhistory': [],
        }
        db = firestore.client()
        dm_ref = db.collection('dm').add(dm_config)
        print(f"✅ Successfully created DM document: {dm_ref}")
        dm_id = dm_ref[1].id
        
        return https_fn.Response(
            json.dumps({
                'message': 'Successfully created DM document',
                'dmId': dm_id,
                'uid': uid,
                'friendUid': friend_uid
            }),
            status=200,
            headers=cors_headers
        )
        
    except Exception as error:
        print(f"Error creating DM document: {error}")
        
        return https_fn.Response(
            json.dumps({
                'error': 'Internal server error',
                'message': str(error)
            }),
            status=500,
            headers=cors_headers
        )
        
        
        

@https_fn.on_request()
def add_to_maybe_friends(req: https_fn.Request) -> https_fn.Response:
    """
    ユーザーのmaybefriends配列に友達候補を追加
    
    リクエスト例:
    POST https://your-region-your-project.cloudfunctions.net/add_to_maybe_friends
    {
        "uid": "user123",
        "displayName": "John Doe", 
        "photoURL": "https://example.com/photo.jpg",
        "dmid": "dm123",
        "targetUid": "user456"
    }
    """
    
    # CORS preflight処理
    if req.method == 'OPTIONS':
        return handle_preflight()
    
    # CORSヘッダー取得
    cors_headers = get_cors_headers()
    
    # POSTメソッドのみ許可
    if req.method != 'POST':
        return https_fn.Response(
            json.dumps({'error': 'Method Not Allowed'}),
            status=405,
            headers=cors_headers
        )
    
    try:
        # リクエストボディの取得と検証
        request_data = req.get_json(silent=True)
        
        if not request_data:
            return https_fn.Response(
                json.dumps({'error': 'Invalid JSON'}),
                status=400,
                headers=cors_headers
            )
        
        # 必須フィールドの検証
        required_fields = ['uid', 'displayName', 'photoURL', 'dmid', 'targetUid']
        for field in required_fields:
            if field not in request_data or not request_data[field]:
                return https_fn.Response(
                    json.dumps({'error': f'Missing required field: {field}'}),
                    status=400,
                    headers=cors_headers
                )
        
        # データ取得
        uid = request_data['uid']
        display_name = request_data['displayName']
        photo_url = request_data['photoURL']
        dm_id = request_data['dmid']
        target_uid = request_data['targetUid']
        
        # バリデーション
        if uid == target_uid:
            return https_fn.Response(
                json.dumps({'error': 'Cannot add yourself as a friend'}),
                status=400,
                headers=cors_headers
            )
        
        print(f"Adding user {uid} to {target_uid}'s maybefriends")
        
        # Firestore操作
        db = firestore.client()
        user_ref = db.collection('users').document(target_uid)
        
        # ユーザー存在確認
        user_doc = user_ref.get()
        if not user_doc.exists:
            return https_fn.Response(
                json.dumps({'error': 'Target user not found'}),
                status=404,
                headers=cors_headers
            )
        
        # 友達情報
        friend_info = {
            'uid': uid,
            'displayName': display_name,
            'photoURL': photo_url,
            'dmid': dm_id,
        }
        
        # 配列に追加
        user_ref.update({
            'maybefriends': firestore.ArrayUnion([friend_info])
        })
        
        print(f"✅ Successfully added {uid} to {target_uid}'s maybefriends")
        
        # 成功レスポンス
        return https_fn.Response(
            json.dumps({
                'message': 'Successfully added to maybefriends',
                'targetUid': target_uid,
                'addedUser': {
                    'uid': uid,
                    'displayName': display_name,
                    'dmid': dm_id
                }
            }),
            status=200,
            headers=cors_headers
        )
        
    except Exception as error:
        print(f"Error adding to maybefriends: {error}")
        
        return https_fn.Response(
            json.dumps({
                'error': 'Internal server error',
                'message': str(error)
            }),
            status=500,
            headers=cors_headers
        )

@https_fn.on_request()
def get_maybe_friends(req: https_fn.Request) -> https_fn.Response:
    """maybefriends一覧取得"""
    
    if req.method == 'OPTIONS':
        return handle_preflight()
    
    cors_headers = get_cors_headers()
    
    if req.method != 'GET':
        return https_fn.Response(
            json.dumps({'error': 'Method Not Allowed'}),
            status=405,
            headers=cors_headers
        )
    
    try:
        uid = req.args.get('uid')
        
        if not uid:
            return https_fn.Response(
                json.dumps({'error': 'Missing uid parameter'}),
                status=400,
                headers=cors_headers
            )
        
        db = firestore.client()
        user_doc = db.collection('users').document(uid).get()
        
        if not user_doc.exists:
            return https_fn.Response(
                json.dumps({'error': 'User not found'}),
                status=404,
                headers=cors_headers
            )
        
        user_data = user_doc.to_dict()
        maybe_friends = user_data.get('maybefriends', [])
        
        return https_fn.Response(
            json.dumps({
                'uid': uid,
                'maybefriends': maybe_friends,
                'count': len(maybe_friends)
            }, default=str),
            status=200,
            headers=cors_headers
        )
        
    except Exception as error:
        print(f"Error getting maybefriends: {error}")
        
        return https_fn.Response(
            json.dumps({
                'error': 'Internal server error',
                'message': str(error)
            }),
            status=500,
            headers=cors_headers
        )

@https_fn.on_request()
def health_check(req: https_fn.Request) -> https_fn.Response:
    """ヘルスチェック"""
    return https_fn.Response(
        json.dumps({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'message': 'Firebase Functions (Python) is running'
        }),
        status=200,
        headers={'Content-Type': 'application/json'}
    )