from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get('/health')
    assert r.status_code == 200
    data = r.json()
    assert data['status'] == 'ok'
    assert 'database' in data

def test_docs_and_redoc():
    r_docs = client.get('/docs')
    assert r_docs.status_code == 200

    r_redoc = client.get('/redoc')
    assert r_redoc.status_code == 200

def test_events_list():
    r = client.get('/api/events')
    assert r.status_code == 200
    events = r.json()
    assert len(events) == 3
    ids = [e['id'] for e in events]
    assert 'flood' in ids
    assert 'glacier' in ids
    assert 'wetland' in ids

def test_event_details():
    for event_id in ['flood', 'glacier', 'wetland']:
        r = client.get(f'/api/events/{event_id}')
        assert r.status_code == 200
        data = r.json()
        assert data['id'] == event_id
        assert 'before' in data
        assert 'after' in data
        assert 'bbox' in data

def test_unknown_event_404():
    r = client.get('/api/events/nonexistent')
    assert r.status_code == 404

def test_sources():
    r = client.get('/api/sources')
    assert r.status_code == 200
    assert len(r.json()) >= 3

def test_team():
    r = client.get('/api/team')
    assert r.status_code == 200
    assert len(r.json()) == 6

def test_steps():
    r = client.get('/api/steps')
    assert r.status_code == 200
    assert len(r.json()) == 4

def test_feedback_submit():
    r = client.post('/api/feedback', json={'name': 'Space Enthusiast', 'message': 'Loved the radar viewer!'})
    assert r.status_code == 201
    assert r.json()['success'] is True

def test_feedback_validation():
    r = client.post('/api/feedback', json={'name': '', 'message': ''})
    assert r.status_code in [400, 422]

if __name__ == '__main__':
    test_health()
    test_docs_and_redoc()
    test_events_list()
    test_event_details()
    test_unknown_event_404()
    test_sources()
    test_team()
    test_steps()
    test_feedback_submit()
    test_feedback_validation()
    print('>>> ALL 10 FASTAPI TEST CASES PASSED SUCCESSFULLY! <<<')
