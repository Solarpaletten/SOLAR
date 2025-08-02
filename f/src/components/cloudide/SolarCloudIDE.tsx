//f/src/components/cloudide/SolarCloudIDE.tsx
import React, { useState, useEffect } from 'react';
import { 
  Github, 
  GitBranch, 
  FileText, 
  Folder, 
  Search, 
  Play, 
  Download,
  GitCompare,
  Zap,
  Code,
  Eye,
  CloudUpload
} from 'lucide-react';

const SolarCloudIDE: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileContent, setFileContent] = useState('');
  const [newCode, setNewCode] = useState('');
  const [comparison, setComparison] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 🐙 Parse GitHub URL
  const parseGitHubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace('.git', '')
      };
    }
    return null;
  };

  // 📁 Load repository
  const loadRepository = async () => {
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      alert('Invalid GitHub URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cloudide/repo/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          owner: parsed.owner,
          repo: parsed.repo,
          branch: selectedBranch
        })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedRepo(parsed);
        setFiles(result.data.files);
        
        // Load branches
        loadBranches(parsed.owner, parsed.repo);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error loading repository:', error);
      alert('Failed to load repository');
    } finally {
      setLoading(false);
    }
  };

  // 🌿 Load branches
  const loadBranches = async (owner: string, repo: string) => {
    try {
      const response = await fetch(`/api/cloudide/repo/branches?owner=${owner}&repo=${repo}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setBranches(result.data);
      }
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  };

  // 📄 Load file content
  const loadFileContent = async (file: any) => {
    if (!selectedRepo) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/cloudide/repo/file?owner=${selectedRepo.owner}&repo=${selectedRepo.repo}&filePath=${file.path}&branch=${selectedBranch}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      const result = await response.json();
      if (result.success) {
        setSelectedFile(file);
        setFileContent(result.data.content);
        setNewCode(result.data.content);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Compare code
  const compareCode = async () => {
    if (!selectedRepo || !selectedFile) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cloudide/repo/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          owner: selectedRepo.owner,
          repo: selectedRepo.repo,
          filePath: selectedFile.path,
          branch: selectedBranch,
          newCode
        })
      });

      const result = await response.json();
      if (result.success) {
        setComparison(result.data);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error comparing code:', error);
      alert('Failed to compare code');
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search repositories
  const searchRepositories = async (query: string) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(`/api/cloudide/repo/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setSearchResults(result.data);
      }
    } catch (error) {
      console.error('Error searching repositories:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CloudUpload className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                Solar Cloud IDE
              </h1>
            </div>
            <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
              GitHub Integration • Live Environment • AI Analysis
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {selectedRepo && (
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{selectedRepo.owner}/{selectedRepo.repo}</span>
                
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  {branches.map(branch => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Repository Input */}
        <div className="mt-4 flex space-x-2">
          <div className="flex-1 relative">
            <Github className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={loadRepository}
            disabled={!repoUrl.trim() || loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{loading ? 'Loading...' : 'Load Repo'}</span>
          </button>

          {selectedFile && (
            <button
              onClick={compareCode}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel: Repository Files */}
        <div className="w-1/4 border-r bg-white overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800">📁 Repository Files</h3>
            {selectedRepo && (
              <p className="text-xs text-gray-500 mt-1">
                {files.length} files • {selectedBranch} branch
              </p>
            )}
          </div>
          
          <div className="p-2">
            {files.length > 0 ? (
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => loadFileContent(file)}
                    className={`p-3 rounded cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedFile?.path === file.path ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {file.path}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        file.isComponent ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {file.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Github className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Load a repository to see files</p>
              </div>
            )}
          </div>
        </div>

        {/* Middle Panel: Code Editor */}
        <div className="w-1/2 border-r bg-white flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {selectedFile ? `📝 ${selectedFile.name}` : '💡 Code Editor'}
              </h3>
              {selectedFile && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Code className="w-4 h-4" />
                  <span>{newCode.split('\n').length} lines</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            {selectedFile ? (
              <>
                {/* Original Content */}
                <div className="h-1/2 border-b">
                  <div className="px-4 py-2 bg-gray-100 border-b text-sm font-medium text-gray-700">
                    🐙 GitHub Original ({selectedBranch})
                  </div>
                  <textarea
                    value={fileContent}
                    readOnly
                    className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-gray-50"
                  />
                </div>

                {/* Editable Version */}
                <div className="h-1/2">
                  <div className="px-4 py-2 bg-blue-100 border-b text-sm font-medium text-blue-700">
                    ✏️ Your Version (Editable)
                  </div>
                  <textarea
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Edit the code here..."
                    className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none focus:bg-white transition-colors"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Welcome to Solar Cloud IDE</h3>
                  <p className="text-sm mb-4">Load a GitHub repository and select a file to start</p>
                  <div className="text-xs bg-gray-100 rounded-lg p-4 max-w-md">
                    <div className="font-medium mb-2">🚀 Features:</div>
                    <ul className="text-left space-y-1">
                      <li>• Live GitHub integration</li>
                      <li>• Real-time code comparison</li>
                      <li>• AI-powered analysis</li>
                      <li>• Branch switching</li>
                      <li>• Instant diff visualization</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Analysis & Comparison */}
        <div className="w-1/4 bg-white overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800">🔍 AI Analysis</h3>
          </div>
          
          <div className="p-4">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Analyzing...</p>
              </div>
            ) : comparison ? (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center space-x-2">
                  {comparison.analysis.status === 'identical' && (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">Identical</span>
                    </>
                  )}
                  {comparison.analysis.status === 'modified' && (
                    <>
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-600 font-medium">Modified</span>
                    </>
                  )}
                  {comparison.analysis.status === 'new' && (
                    <>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-600 font-medium">New Version</span>
                    </>
                  )}
                </div>

                {/* Code Statistics */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-800 mb-2">📊 Statistics</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>GitHub Lines:</span>
                      <span className="font-medium">{comparison.analysis.lines.repo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Lines:</span>
                      <span className="font-medium">{comparison.analysis.lines.compare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Differences:</span>
                      <span className="font-medium text-orange-600">{comparison.analysis.lines.diff}</span>
                    </div>
                  </div>
                </div>

                {/* Detected Patterns */}
                {comparison.analysis.patterns.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">🤖 Detected Patterns</h4>
                    <div className="space-y-1">
                      {comparison.analysis.patterns.map((pattern: string, index: number) => (
                        <div key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                          {pattern}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diff Preview */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">📋 Changes</h4>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
                    {comparison.diff.slice(0, 10).map((part: any, index: number) => (
                      <div
                        key={index}
                        className={`text-xs font-mono whitespace-pre-wrap ${
                          part.added ? 'bg-green-100 text-green-700' :
                          part.removed ? 'bg-red-100 text-red-700' :
                          'text-gray-600'
                        }`}
                      >
                        {part.value}
                      </div>
                    ))}
                    {comparison.diff.length > 10 && (
                      <div className="text-xs text-gray-500 mt-2">
                        ... and {comparison.diff.length - 10} more changes
                      </div>
                    )}
                  </div>
                </div>

                {/* Repository Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-1">🐙 Repository</h4>
                  <div className="text-sm text-blue-700">
                    <div>{comparison.repo}</div>
                    <div className="text-xs opacity-75">Branch: {comparison.branch}</div>
                    <div className="text-xs opacity-75">File: {comparison.file.path}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm">
                    💾 Apply to Local Project
                  </button>
                  
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    📤 Create Pull Request
                  </button>
                  
                  <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                    💾 Save as New File
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="mb-2">Ready for Analysis</p>
                <p className="text-sm">Select a file and click "Compare" to see AI insights</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-gray-800 text-white px-6 py-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Solar Cloud IDE v1.0</span>
            </div>
            {selectedRepo && (
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>{selectedRepo.owner}/{selectedRepo.repo}</span>
                <GitBranch className="w-4 h-4" />
                <span>{selectedBranch}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {selectedFile && (
              <span>📄 {selectedFile.name}</span>
            )}
            <span>🚀 Live Environment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarCloudIDE;