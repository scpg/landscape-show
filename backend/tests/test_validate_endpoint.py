from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


VALID_YAML = """
metadata:
  title: "Test Landscape"
systems:
  - id: system-a
    name: "System A"
    type: backend
systems-positions:
  - id: system-a
    x: 0
    y: 0
systems-styles:
  - id: system-a
    color: "#123456"
connections:
  - from: system-a
    to: system-a
    type: api
"""

INVALID_YAML = """
metadata:
  title: "Broken Landscape"
systems:
  - id: system-a
    name: "System A"
    type: backend
connections:
  - from: system-a
    to: missing-system
    type: api
"""


def test_generic_validate_accepts_valid_yaml():
    response = client.post(
        "/api/landscapes/validate",
        data=VALID_YAML,
        headers={"Content-Type": "text/plain"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["valid"] is True
    assert "message" in body


def test_generic_validate_rejects_invalid_yaml():
    response = client.post(
        "/api/landscapes/validate",
        data=INVALID_YAML,
        headers={"Content-Type": "text/plain"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["valid"] is False
    assert "non-existent system" in body["error"]
