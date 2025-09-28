from fastapi import APIRouter
from fastapi.responses import HTMLResponse

test_router = APIRouter(prefix="/messenger-test", tags=["messenger-test"])

@test_router.get("/", response_class=HTMLResponse)
async def get_test_client():
    """Serve a simple test client for the messenger system"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>BODE EV Team Messenger - Test Client</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f0f2f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; }
            .header { text-align: center; color: #2c3e50; margin-bottom: 30px; }
            .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .section h3 { color: #34495e; margin-top: 0; }
            input, textarea, select, button { margin: 5px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #3498db; color: white; cursor: pointer; padding: 10px 20px; }
            button:hover { background: #2980b9; }
            .response { background: #ecf0f1; padding: 10px; margin-top: 10px; border-radius: 4px; font-family: monospace; }
            .success { border-left: 4px solid #27ae60; }
            .error { border-left: 4px solid #e74c3c; }
            #messages { height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; background: #fafafa; }
            .message { margin: 5px 0; padding: 5px; background: white; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 BODE EV Team Messenger</h1>
                <p>Phase 1: Core Messaging System Test Interface</p>
            </div>
            
            <!-- Authentication Section -->
            <div class="section">
                <h3>🔐 Authentication</h3>
                <div>
                    <h4>Register User</h4>
                    <input type="text" id="regEmail" placeholder="Email" value="test@bodeev.com">
                    <input type="text" id="regUsername" placeholder="Username" value="testuser">
                    <input type="text" id="regFullName" placeholder="Full Name" value="Test User">
                    <input type="password" id="regPassword" placeholder="Password" value="password123">
                    <button onclick="registerUser()">Register</button>
                </div>
                <div style="margin-top: 15px;">
                    <h4>Login</h4>
                    <input type="text" id="loginEmail" placeholder="Email" value="test@bodeev.com">
                    <input type="password" id="loginPassword" placeholder="Password" value="password123">
                    <button onclick="loginUser()">Login</button>
                </div>
                <div id="authResponse" class="response"></div>
            </div>
            
            <!-- Room Management Section -->
            <div class="section">
                <h3>🏠 Room Management</h3>
                <div>
                    <h4>Create Room</h4>
                    <input type="text" id="roomName" placeholder="Room Name" value="General Discussion">
                    <input type="text" id="roomDesc" placeholder="Description" value="Main chat room">
                    <select id="roomType">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <button onclick="createRoom()">Create Room</button>
                </div>
                <div style="margin-top: 15px;">
                    <button onclick="getUserRooms()">Get My Rooms</button>
                </div>
                <div id="roomResponse" class="response"></div>
            </div>
            
            <!-- Messaging Section -->
            <div class="section">
                <h3>💬 Real-time Messaging</h3>
                <div>
                    <input type="text" id="roomId" placeholder="Room ID (from room list above)">
                    <button onclick="connectWebSocket()">Connect to Room</button>
                    <button onclick="disconnectWebSocket()">Disconnect</button>
                </div>
                <div id="messages"></div>
                <div style="margin-top: 10px;">
                    <input type="text" id="messageText" placeholder="Type your message..." style="width: 70%;">
                    <button onclick="sendMessage()">Send Message</button>
                </div>
                <div id="wsResponse" class="response"></div>
            </div>
            
            <!-- Video Call Section -->
            <div class="section">
                <h3>📹 Video Calls</h3>
                <div>
                    <input type="text" id="callRoomId" placeholder="Room ID">
                    <select id="callType">
                        <option value="video">Video Call</option>
                        <option value="audio">Audio Call</option>
                    </select>
                    <button onclick="startVideoCall()">Start Call</button>
                </div>
                <div id="callResponse" class="response"></div>
            </div>
            
            <!-- Integration Status -->
            <div class="section">
                <h3>🔗 Integration Status</h3>
                <div id="integrationStatus">
                    <p>📊 <strong>Core Messenger:</strong> <span style="color: #27ae60;">✅ Active</span></p>
                    <p>💬 <strong>Slack Integration:</strong> <span style="color: #f39c12;">⏳ Pending API Keys</span></p>
                    <p>📹 <strong>Zoom Integration:</strong> <span style="color: #f39c12;">⏳ Pending API Keys</span></p>
                    <p>☁️ <strong>AWS S3 Storage:</strong> <span style="color: #f39c12;">⏳ Pending API Keys</span></p>
                    <p>🎯 <strong>Salesforce Sync:</strong> <span style="color: #f39c12;">⏳ Pending API Keys</span></p>
                    <p>🚀 <strong>HubSpot Integration:</strong> <span style="color: #f39c12;">⏳ Pending API Keys</span></p>
                    <p>📡 <strong>WebRTC Calling:</strong> <span style="color: #f39c12;">⏳ Implementation Pending</span></p>
                </div>
            </div>
        </div>

        <script>
            let accessToken = '';
            let websocket = null;
            const backendUrl = 'https://notify-mesh.preview.emergentagent.com/api';
            
            // Authentication Functions
            async function registerUser() {
                const data = {
                    email: document.getElementById('regEmail').value,
                    username: document.getElementById('regUsername').value,
                    full_name: document.getElementById('regFullName').value,
                    password: document.getElementById('regPassword').value
                };
                
                try {
                    const response = await fetch(`${backendUrl}/messenger/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    displayResponse('authResponse', result, response.ok);
                } catch (error) {
                    displayResponse('authResponse', { error: error.message }, false);
                }
            }
            
            async function loginUser() {
                const data = {
                    email: document.getElementById('loginEmail').value,
                    password: document.getElementById('loginPassword').value
                };
                
                try {
                    const response = await fetch(`${backendUrl}/messenger/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    if (response.ok) {
                        accessToken = result.access_token;
                        displayResponse('authResponse', { message: 'Login successful!', user: result.user }, true);
                    } else {
                        displayResponse('authResponse', result, false);
                    }
                } catch (error) {
                    displayResponse('authResponse', { error: error.message }, false);
                }
            }
            
            // Room Management Functions
            async function createRoom() {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                const data = {
                    name: document.getElementById('roomName').value,
                    description: document.getElementById('roomDesc').value,
                    type: document.getElementById('roomType').value
                };
                
                try {
                    const response = await fetch(`${backendUrl}/messenger/rooms`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    displayResponse('roomResponse', result, response.ok);
                } catch (error) {
                    displayResponse('roomResponse', { error: error.message }, false);
                }
            }
            
            async function getUserRooms() {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                try {
                    const response = await fetch(`${backendUrl}/messenger/rooms`, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    const result = await response.json();
                    displayResponse('roomResponse', result, response.ok);
                } catch (error) {
                    displayResponse('roomResponse', { error: error.message }, false);
                }
            }
            
            // WebSocket Functions
            function connectWebSocket() {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                const roomId = document.getElementById('roomId').value;
                if (!roomId) {
                    alert('Please enter a room ID');
                    return;
                }
                
                // Extract user ID from token (simplified - in production, decode JWT properly)
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                const userId = payload.sub;
                
                const wsUrl = `wss://evcrm-saas.preview.emergentagent.com/api/messenger/ws/${userId}`;
                websocket = new WebSocket(wsUrl);
                
                websocket.onopen = function() {
                    displayResponse('wsResponse', { message: 'Connected to WebSocket' }, true);
                };
                
                websocket.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    displayMessage(data);
                };
                
                websocket.onclose = function() {
                    displayResponse('wsResponse', { message: 'WebSocket disconnected' }, false);
                };
                
                websocket.onerror = function(error) {
                    displayResponse('wsResponse', { error: 'WebSocket error' }, false);
                };
            }
            
            function disconnectWebSocket() {
                if (websocket) {
                    websocket.close();
                    websocket = null;
                }
            }
            
            async function sendMessage() {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                const roomId = document.getElementById('roomId').value;
                const content = document.getElementById('messageText').value;
                
                if (!roomId || !content) {
                    alert('Please enter room ID and message');
                    return;
                }
                
                const data = {
                    room_id: roomId,
                    content: content
                };
                
                try {
                    const response = await fetch(`${backendUrl}/messenger/messages`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    if (response.ok) {
                        document.getElementById('messageText').value = '';
                        displayMessage({ type: 'new_message', message: result });
                    } else {
                        displayResponse('wsResponse', result, false);
                    }
                } catch (error) {
                    displayResponse('wsResponse', { error: error.message }, false);
                }
            }
            
            // Video Call Functions
            async function startVideoCall() {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                const roomId = document.getElementById('callRoomId').value;
                const callType = document.getElementById('callType').value;
                
                if (!roomId) {
                    alert('Please enter a room ID');
                    return;
                }
                
                const data = {
                    room_id: roomId,
                    call_type: callType
                };
                
                try {
                    const response = await fetch(`${backendUrl}/messenger/calls`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    displayResponse('callResponse', result, response.ok);
                } catch (error) {
                    displayResponse('callResponse', { error: error.message }, false);
                }
            }
            
            // Utility Functions
            function displayResponse(elementId, data, isSuccess) {
                const element = document.getElementById(elementId);
                element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                element.className = `response ${isSuccess ? 'success' : 'error'}`;
            }
            
            function displayMessage(data) {
                const messagesDiv = document.getElementById('messages');
                const messageEl = document.createElement('div');
                messageEl.className = 'message';
                
                if (data.type === 'new_message') {
                    messageEl.innerHTML = `<strong>${data.message.sender_id}:</strong> ${data.message.content} <em>(${new Date(data.message.created_at).toLocaleTimeString()})</em>`;
                } else {
                    messageEl.innerHTML = `<em>System: ${JSON.stringify(data)}</em>`;
                }
                
                messagesDiv.appendChild(messageEl);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)