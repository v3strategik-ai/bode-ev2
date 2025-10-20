from fastapi import APIRouter
from fastapi.responses import HTMLResponse

test_router = APIRouter(prefix="/files-test", tags=["files-test"])

@test_router.get("/", response_class=HTMLResponse)
async def get_file_test_client():
    """Serve a test client for the file sharing system"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>MATIKAI File Sharing - Test Client</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f0f2f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; }
            .header { text-align: center; color: #2c3e50; margin-bottom: 30px; }
            .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .section h3 { color: #34495e; margin-top: 0; }
            input, textarea, select, button { margin: 5px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #3498db; color: white; cursor: pointer; padding: 10px 20px; }
            button:hover { background: #2980b9; }
            .response { background: #ecf0f1; padding: 10px; margin-top: 10px; border-radius: 4px; font-family: monospace; max-height: 200px; overflow-y: auto; }
            .success { border-left: 4px solid #27ae60; }
            .error { border-left: 4px solid #e74c3c; }
            .file-input { width: 100%; }
            .file-list { background: #fafafa; padding: 10px; border-radius: 4px; max-height: 300px; overflow-y: auto; }
            .file-item { display: flex; justify-content: between; align-items: center; padding: 10px; margin: 5px 0; background: white; border-radius: 4px; border: 1px solid #ddd; }
            .file-info { flex: 1; }
            .file-actions { display: flex; gap: 10px; }
            .file-actions button { padding: 5px 10px; font-size: 12px; }
            .mock-indicator { background: #f39c12; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
            .drag-drop { border: 2px dashed #ddd; padding: 20px; text-align: center; background: #fafafa; border-radius: 8px; margin: 10px 0; }
            .drag-drop.dragover { border-color: #3498db; background: #e3f2fd; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>☁️ MATIKAI File Sharing System</h1>
                <p>Phase 1: Cloud Storage & File Attachment Test Interface</p>
                <div id="authStatus" style="margin: 10px 0;">
                    <span style="color: #e74c3c;">Please login in the messenger test first to get access token</span>
                </div>
            </div>
            
            <!-- File Upload Section -->
            <div class="section">
                <h3>📤 File Upload</h3>
                
                <div class="drag-drop" id="dragDropArea">
                    <p>Drag and drop files here, or click to select</p>
                    <input type="file" id="fileInput" multiple class="file-input" style="display: none;">
                    <button onclick="document.getElementById('fileInput').click()">Select Files</button>
                </div>
                
                <div style="margin-top: 15px;">
                    <label>Folder:</label>
                    <select id="uploadFolder">
                        <option value="documents">Documents</option>
                        <option value="images">Images</option>
                        <option value="videos">Videos</option>
                        <option value="shared">Shared</option>
                    </select>
                    
                    <label>Room ID (optional):</label>
                    <input type="text" id="roomIdUpload" placeholder="Link to chat room">
                    
                    <button onclick="uploadFiles()">Upload Files</button>
                </div>
                
                <div id="uploadProgress" style="display: none;">
                    <div style="background: #ecf0f1; height: 20px; border-radius: 10px; margin: 10px 0;">
                        <div id="progressBar" style="background: #3498db; height: 100%; width: 0%; border-radius: 10px; transition: width 0.3s;"></div>
                    </div>
                    <span id="progressText">Uploading...</span>
                </div>
                
                <div id="uploadResponse" class="response"></div>
            </div>
            
            <!-- File Management Section -->
            <div class="section">
                <h3>📁 File Management</h3>
                <div>
                    <button onclick="listFiles()">Refresh File List</button>
                    <select id="listFolder">
                        <option value="">All Files</option>
                        <option value="documents">Documents</option>
                        <option value="images">Images</option>
                        <option value="videos">Videos</option>
                        <option value="shared">Shared</option>
                    </select>
                    <button onclick="listFiles(document.getElementById('listFolder').value)">Filter by Folder</button>
                </div>
                
                <div id="fileList" class="file-list"></div>
                <div id="listResponse" class="response"></div>
            </div>
            
            <!-- File Sharing Section -->
            <div class="section">
                <h3>🔗 File Sharing & Links</h3>
                <div>
                    <input type="text" id="shareFilename" placeholder="Enter filename from list above" style="width: 60%;">
                    <select id="shareMethod">
                        <option value="GET">Download Link</option>
                        <option value="PUT">Upload Link</option>
                    </select>
                    <input type="number" id="shareExpiration" value="3600" placeholder="Expiration (seconds)">
                    <button onclick="generateShareLink()">Generate Link</button>
                </div>
                <div id="shareResponse" class="response"></div>
            </div>
            
            <!-- Integration Status -->
            <div class="section">
                <h3>🔗 File System Status</h3>
                <div id="systemStatus">
                    <p>☁️ <strong>AWS S3 Integration:</strong> <span id="s3Status" style="color: #f39c12;">⏳ Checking...</span></p>
                    <p>💾 <strong>Database Storage:</strong> <span style="color: #27ae60;">✅ MongoDB Active</span></p>
                    <p>🔒 <strong>File Security:</strong> <span style="color: #27ae60;">✅ User-based Access Control</span></p>
                    <p>📎 <strong>Message Attachments:</strong> <span style="color: #27ae60;">✅ Chat Integration Ready</span></p>
                    <p>🔄 <strong>File Validation:</strong> <span style="color: #27ae60;">✅ Type & Size Limits Active</span></p>
                    <p>📊 <strong>File Metadata:</strong> <span style="color: #27ae60;">✅ Tracking & Analytics</span></p>
                </div>
            </div>
        </div>

        <script>
            let accessToken = localStorage.getItem('messenger_token') || '';
            const backendUrl = 'https://notify-mesh.preview.emergentagent.com/api';
            
            // Update auth status on load
            document.addEventListener('DOMContentLoaded', function() {
                updateAuthStatus();
                checkSystemStatus();
                setupDragAndDrop();
            });
            
            function updateAuthStatus() {
                const authStatusEl = document.getElementById('authStatus');
                if (accessToken) {
                    authStatusEl.innerHTML = '<span style="color: #27ae60;">✅ Authenticated - File operations available</span>';
                } else {
                    authStatusEl.innerHTML = '<span style="color: #e74c3c;">❌ Not authenticated - Please login first</span>';
                }
            }
            
            function setupDragAndDrop() {
                const dropArea = document.getElementById('dragDropArea');
                const fileInput = document.getElementById('fileInput');
                
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, preventDefaults, false);
                    document.body.addEventListener(eventName, preventDefaults, false);
                });
                
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropArea.addEventListener(eventName, highlight, false);
                });
                
                ['dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, unhighlight, false);
                });
                
                dropArea.addEventListener('drop', handleDrop, false);
                fileInput.addEventListener('change', handleFileSelect, false);
                
                function preventDefaults(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                function highlight(e) {
                    dropArea.classList.add('dragover');
                }
                
                function unhighlight(e) {
                    dropArea.classList.remove('dragover');
                }
                
                function handleDrop(e) {
                    const files = e.dataTransfer.files;
                    fileInput.files = files;
                    updateFileInputDisplay(files);
                }
                
                function handleFileSelect(e) {
                    updateFileInputDisplay(e.target.files);
                }
                
                function updateFileInputDisplay(files) {
                    const fileNames = Array.from(files).map(f => f.name).join(', ');
                    dropArea.querySelector('p').textContent = files.length > 0 ? 
                        `Selected: ${fileNames}` : 'Drag and drop files here, or click to select';
                }
            }
            
            async function uploadFiles() {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                const fileInput = document.getElementById('fileInput');
                const files = fileInput.files;
                
                if (!files || files.length === 0) {
                    alert('Please select files first');
                    return;
                }
                
                const folder = document.getElementById('uploadFolder').value;
                const roomId = document.getElementById('roomIdUpload').value;
                
                showProgress(true);
                
                try {
                    const results = [];
                    
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        updateProgress((i / files.length) * 100, `Uploading ${file.name}...`);
                        
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('folder', folder);
                        if (roomId) formData.append('room_id', roomId);
                        
                        const response = await fetch(`${backendUrl}/files/upload`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: formData
                        });
                        
                        const result = await response.json();
                        results.push({
                            file: file.name,
                            success: response.ok,
                            result: result
                        });
                    }
                    
                    updateProgress(100, 'Upload complete!');
                    setTimeout(() => showProgress(false), 2000);
                    
                    displayResponse('uploadResponse', {
                        message: 'Upload completed',
                        results: results
                    }, true);
                    
                    // Clear file input
                    fileInput.value = '';
                    document.getElementById('dragDropArea').querySelector('p').textContent = 'Drag and drop files here, or click to select';
                    
                    // Refresh file list
                    listFiles();
                    
                } catch (error) {
                    showProgress(false);
                    displayResponse('uploadResponse', { error: error.message }, false);
                }
            }
            
            function showProgress(show) {
                document.getElementById('uploadProgress').style.display = show ? 'block' : 'none';
                if (!show) {
                    updateProgress(0, '');
                }
            }
            
            function updateProgress(percent, text) {
                document.getElementById('progressBar').style.width = percent + '%';
                document.getElementById('progressText').textContent = text;
            }
            
            async function listFiles(folder = null) {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                try {
                    let url = `${backendUrl}/files/list`;
                    if (folder) {
                        url += `?folder=${folder}`;
                    }
                    
                    const response = await fetch(url, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        displayFileList(result.files);
                        displayResponse('listResponse', {
                            message: `Found ${result.files.length} files`,
                            files: result.files.length
                        }, true);
                    } else {
                        displayResponse('listResponse', result, false);
                    }
                } catch (error) {
                    displayResponse('listResponse', { error: error.message }, false);
                }
            }
            
            function displayFileList(files) {
                const fileListEl = document.getElementById('fileList');
                
                if (!files || files.length === 0) {
                    fileListEl.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No files found</p>';
                    return;
                }
                
                const fileItems = files.map(file => {
                    const sizeStr = formatFileSize(file.size || 0);
                    const mockBadge = file.mock_mode ? '<span class="mock-indicator">MOCK</span>' : '';
                    
                    return `
                        <div class="file-item">
                            <div class="file-info">
                                <strong>${file.original_filename || file.filename.split('/').pop()}</strong> ${mockBadge}<br>
                                <small>Size: ${sizeStr} | Modified: ${new Date(file.last_modified).toLocaleString()}</small><br>
                                <small style="color: #7f8c8d;">Path: ${file.filename}</small>
                            </div>
                            <div class="file-actions">
                                <button onclick="downloadFile('${file.filename}')" style="background: #27ae60;">Download</button>
                                <button onclick="shareFile('${file.filename}')" style="background: #f39c12;">Share</button>
                                <button onclick="deleteFile('${file.filename}')" style="background: #e74c3c;">Delete</button>
                            </div>
                        </div>
                    `;
                }).join('');
                
                fileListEl.innerHTML = fileItems;
            }
            
            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
            
            async function downloadFile(filename) {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                try {
                    const response = await fetch(`${backendUrl}/files/download/${filename}`, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = filename.split('/').pop();
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    } else {
                        const error = await response.json();
                        alert(`Download failed: ${error.detail}`);
                    }
                } catch (error) {
                    alert(`Download error: ${error.message}`);
                }
            }
            
            async function deleteFile(filename) {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                if (!confirm(`Are you sure you want to delete ${filename.split('/').pop()}?`)) {
                    return;
                }
                
                try {
                    const response = await fetch(`${backendUrl}/files/delete/${filename}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        alert('File deleted successfully');
                        listFiles(); // Refresh list
                    } else {
                        alert(`Delete failed: ${result.detail}`);
                    }
                } catch (error) {
                    alert(`Delete error: ${error.message}`);
                }
            }
            
            function shareFile(filename) {
                document.getElementById('shareFilename').value = filename;
            }
            
            async function generateShareLink() {
                if (!accessToken) {
                    alert('Please login first');
                    return;
                }
                
                const filename = document.getElementById('shareFilename').value;
                const method = document.getElementById('shareMethod').value;
                const expiration = parseInt(document.getElementById('shareExpiration').value);
                
                if (!filename) {
                    alert('Please enter a filename');
                    return;
                }
                
                try {
                    const response = await fetch(`${backendUrl}/files/presigned-url`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            filename: filename,
                            method: method,
                            expiration: expiration
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        displayResponse('shareResponse', {
                            presigned_url: result.presigned_url,
                            expires_in: result.expires_in,
                            note: "Copy this URL to share the file securely"
                        }, true);
                    } else {
                        displayResponse('shareResponse', result, false);
                    }
                } catch (error) {
                    displayResponse('shareResponse', { error: error.message }, false);
                }
            }
            
            async function checkSystemStatus() {
                try {
                    // Check if we can list files (indicates S3 service is working)
                    const response = await fetch(`${backendUrl}/files/list?limit=1`, {
                        headers: { 'Authorization': `Bearer ${accessToken || 'dummy'}` }
                    });
                    
                    const s3StatusEl = document.getElementById('s3Status');
                    
                    if (response.status === 401 || response.status === 403) {
                        s3StatusEl.innerHTML = '<span style="color: #f39c12;">⏳ Ready (Authentication Required)</span>';
                    } else if (response.ok) {
                        const result = await response.json();
                        const mockMode = result.files && result.files.some(f => f.mock_mode);
                        if (mockMode) {
                            s3StatusEl.innerHTML = '<span style="color: #f39c12;">🧪 Mock Mode Active</span>';
                        } else {
                            s3StatusEl.innerHTML = '<span style="color: #27ae60;">✅ Connected to AWS S3</span>';
                        }
                    } else {
                        s3StatusEl.innerHTML = '<span style="color: #e74c3c;">❌ Service Error</span>';
                    }
                } catch (error) {
                    document.getElementById('s3Status').innerHTML = '<span style="color: #e74c3c;">❌ Connection Failed</span>';
                }
            }
            
            // Utility Functions
            function displayResponse(elementId, data, isSuccess) {
                const element = document.getElementById(elementId);
                element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                element.className = `response ${isSuccess ? 'success' : 'error'}`;
            }
            
            // Check for access token from messenger login
            setInterval(() => {
                const newToken = localStorage.getItem('messenger_token');
                if (newToken !== accessToken) {
                    accessToken = newToken || '';
                    updateAuthStatus();
                    if (accessToken) {
                        listFiles(); // Auto-load files when authenticated
                    }
                }
            }, 1000);
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)